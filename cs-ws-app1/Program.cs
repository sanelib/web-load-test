//
// csc wsserver.cs
// wsserver.exe

using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {
        static List<NetworkStream> streams = new List<NetworkStream>();

        public static void Main()
        {
            string ip = "127.0.0.1";
            int port = 80;
            var server = new TcpListener(IPAddress.Parse(ip), port);

            server.Start();
            Console.WriteLine("Server has started on {0}:{1}, Waiting for a connection...", ip, port);

            while(true)
            {
                TcpClient client = server.AcceptTcpClient();
                
                Console.WriteLine("A client connected.");
                Task.Run(() => Listen(client));                
            }
        }

        private static Task Listen(TcpClient client)
        {
            NetworkStream stream = client.GetStream();

            streams.Add(stream);

            // enter to an infinite cycle to be able to handle every change in stream
            while (true)
            {
                while (!stream.DataAvailable) ;
                while (client.Available < 3) ; // match against "get"

                byte[] bytes = new byte[client.Available];
                stream.Read(bytes, 0, client.Available);
                string s = Encoding.UTF8.GetString(bytes);

                if (Regex.IsMatch(s, "^GET", RegexOptions.IgnoreCase))
                {
                    Console.WriteLine("=====Handshaking from client=====\n{0}", s);

                    // 1. Obtain the value of the "Sec-WebSocket-Key" request header without any leading or trailing whitespace
                    // 2. Concatenate it with "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" (a special GUID specified by RFC 6455)
                    // 3. Compute SHA-1 and Base64 hash of the new value
                    // 4. Write the hash back as the value of "Sec-WebSocket-Accept" response header in an HTTP response
                    string swk = Regex.Match(s, "Sec-WebSocket-Key: (.*)").Groups[1].Value.Trim();
                    string swka = swk + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                    byte[] swkaSha1 = System.Security.Cryptography.SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(swka));
                    string swkaSha1Base64 = Convert.ToBase64String(swkaSha1);

                    // HTTP/1.1 defines the sequence CR LF as the end-of-line marker
                    byte[] response = Encoding.UTF8.GetBytes(
                        "HTTP/1.1 101 Switching Protocols\r\n" +
                        "Connection: Upgrade\r\n" +
                        "Upgrade: websocket\r\n" +
                        "Sec-WebSocket-Accept: " + swkaSha1Base64 + "\r\n\r\n");

                    stream.Write(response, 0, response.Length);
                }
                else
                {
                    bool fin = (bytes[0] & 0b10000000) != 0,
                        mask = (bytes[1] & 0b10000000) != 0; // must be true, "All messages from the client to the server have this bit set"

                    int opcode = bytes[0] & 0b00001111, // expecting 1 - text message
                        msglen = bytes[1] - 128, // & 0111 1111
                        offset = 2;

                    if (msglen == 126)
                    {
                        // was ToUInt16(bytes, offset) but the result is incorrect
                        msglen = BitConverter.ToUInt16(new byte[] { bytes[3], bytes[2] }, 0);
                        offset = 4;
                    }
                    else if (msglen == 127)
                    {
                        Console.WriteLine("TODO: msglen == 127, needs qword to store msglen");
                        // i don't really know the byte order, please edit this
                        // msglen = BitConverter.ToUInt64(new byte[] { bytes[5], bytes[4], bytes[3], bytes[2], bytes[9], bytes[8], bytes[7], bytes[6] }, 0);
                        // offset = 10;
                    }

                    if (msglen == 0)
                        Console.WriteLine("msglen == 0");
                    else if (mask)
                    {
                        byte[] decoded = new byte[msglen];
                        byte[] masks = new byte[4] { bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3] };
                        offset += 4;

                        for (int i = 0; i < msglen; ++i)
                            decoded[i] = (byte)(bytes[offset + i] ^ masks[i % 4]);

                        string text = Encoding.UTF8.GetString(decoded);
                        Console.WriteLine("{0}", text);

                        var response = EncodeOutgoingMessage(DateTime.Now.Ticks.ToString());

                        var watch = new System.Diagnostics.Stopwatch();

                        watch.Start();

                        foreach (var stm in streams)
                        {
                            try
                            {
                                stm.Write(response, 0, response.Length);
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine(ex.Message);
                            }                            
                        }

                        watch.Stop();

                        Console.WriteLine($"Time to send {streams.Count} - {watch.ElapsedMilliseconds}");
                        
                    }
                    else
                        Console.WriteLine("mask bit not set");

                    Console.WriteLine();
                }
            }
        }

        private static byte[] EncodeOutgoingMessage(string text, bool masked = false)
        {
            /* this is how and header should be made:
             *   - first byte  -> FIN + RSV1 + RSV2 + RSV3 + OPCODE
             *   - second byte -> MASK + payload length (only 7 bits)
             *   - third, fourth, fifth and sixth bytes -> (optional) XOR encoding key bytes
             *   - following bytes -> the encoded (if a key has been used) payload
             *
             *   FIN    [1 bit]      -> 1 if the whole message is contained in this frame, 0 otherwise
             *   RSVs   [1 bit each] -> MUST be 0 unless an extension is negotiated that defines meanings for non-zero values
             *   OPCODE [4 bits]     -> defines the interpretation of the carried payload
             *
             *   MASK           [1 bit]  -> 1 if the message is XOR masked with a key, 0 otherwise
             *   payload length [7 bits] -> can be max 1111111 (127 dec), so, the payload cannot be more than 127 bytes per frame
             *
             * valid OPCODES:
             *   - 0000 [0]             -> continuation frame
             *   - 0001 [1]             -> text frame
             *   - 0010 [2]             -> binary frame
             *   - 0011 [3] to 0111 [7] -> reserved for further non-control frames
             *   - 1000 [8]             -> connection close
             *   - 1001 [9]             -> ping
             *   - 1010 [A]             -> pong
             *   - 1011 [B] to 1111 [F] -> reserved for further control frames
             */
            // in our case the first byte will be 10000001 (129 dec = 81 hex).
            // the length is going to be (masked)1 << 7 (OR) 0 + payload length.
            byte[] header = new byte[] { 0x81, (byte)((masked ? 0x1 << 7 : 0x0) + text.Length) };
            // by default the mask array is empty...
            byte[] maskKey = new byte[4];
            if (masked)
            {
                // but if needed, let's create it properly.
                Random rd = new Random();
                rd.NextBytes(maskKey);
            }
            // let's get the bytes of the message to send.
            byte[] payload = Encoding.UTF8.GetBytes(text);
            // this is going to be the whole frame to send.
            byte[] frame = new byte[header.Length + (masked ? maskKey.Length : 0) + payload.Length];
            // add the header.
            Array.Copy(header, frame, header.Length);
            // add the mask if necessary.
            if (maskKey.Length > 0)
            {
                Array.Copy(maskKey, 0, frame, header.Length, maskKey.Length);
                // let's encode the payload using the mask.
                for (int i = 0; i < payload.Length; i++)
                {
                    payload[i] = (byte)(payload[i] ^ maskKey[i % maskKey.Length]);
                }
            }
            // add the payload.
            Array.Copy(payload, 0, frame, header.Length + (masked ? maskKey.Length : 0), payload.Length);
            return frame;
        }
    }
}
