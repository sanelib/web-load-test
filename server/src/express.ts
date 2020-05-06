/*
// Require needed modules and initialize Express app
import express from 'express';
import { json, urlencoded } from 'body-parser';
import querystring from 'querystring';
import cors from 'cors';
import serveStatic from 'serve-static';
import { argv as args } from 'yargs';

const app = express();
const port = args.port || 9000;
const interval = args.interval;

let clients: any[] = [];

app.use(serveStatic(__dirname));
// Middleware for GET /events endpoint
function eventsHandler(req: { params: { id: number; }; on: (arg0: string, arg1: () => void) => void; }, res: { writeHead: (arg0: number, arg1: { 'Content-Type': string; Connection: string; 'Cache-Control': string; }) => void; write: (arg0: string) => void; }, next: any) {

  // Mandatory headers and http status to keep connection open
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };

  res.writeHead(200, headers);

  const id = req.params.id || new Date().getTime();

  const newClient = { id, res };

  clients.push(newClient);

  const data = `data: Connected on - ${new Date().getTime()}\n\n`;

  res.write(data);

  // Generate an id based on timestamp and save res
  // object of client connection on clients list
  // Later we'll iterate it and send updates to each client

  // When client closes connection we update the clients list
  // avoiding the disconnected one
  req.on('close', () => {
    console.log(`${id} Connection closed`);
    clients = clients.filter(c => c.id !== id);
  });
}

// Iterate clients list and use write res object method to send new nest
function sendEventsToAll(data: undefined) {

  //data['time'] = new Date().getTime();

  clients.forEach(c => {
    c.res.write(`data: ${new Date().getTime()}\n\n`)
  }
  ); //id: ${c.id},
}

function triggerEvent() {
  setInterval(function () {
    sendEventsToAll();
  }, interval);
}

triggerEvent();

// Set cors and bodyParser middlewares
app.use(cors());
//app.use(json());
//app.use(urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Define endpoints
app.get('/events/:id?', eventsHandler);

app.post('/data', (req: { body: any; }, res: { json: (arg0: { clients: number; }) => any; }) => {
  sendEventsToAll(req.body);
  return res.json({ clients: clients.length });
});

app.get('/status', (req: any, res: { json: (arg0: { clients: number; }) => any; }) => res.json({ clients: clients.length }));

// const PORT = 9000;
// Start server on 3000 port
app.listen(port, () => console.log(`Swamp Events service listening on port ${port}`));

*/