using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Websocket.Client;

namespace ConsoleApp2
{
    class Program
    {
        static object obj = new object();

        static List<IWebsocketClient> clients = new List<IWebsocketClient>();

        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            for (int i = 1; i <= 1; i++)
            {
                Console.WriteLine($"Connecting: {i}");
                lock(obj)
                {
                    clients.Add(Connect());
                }                
            }

            Console.ReadLine();
        }

        static IWebsocketClient Connect()
        {
            var url = new Uri("ws://127.0.0.1/");

            using var client = new WebsocketClient(url)
            {
                ReconnectTimeout = TimeSpan.FromSeconds(30)
            };

            client.ReconnectionHappened.Subscribe(info =>
                Console.WriteLine($"Reconnection happened, type: {info.Type}"));

            client.MessageReceived.Subscribe(msg => Console.WriteLine($"Message received: {msg}"));
            
            client.Start();

            return client;
        }
    }
}
