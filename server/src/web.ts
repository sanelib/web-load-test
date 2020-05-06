import * as cluster from 'cluster';
import * as http from 'http';
import * as os from 'os';
import * as  yargs from 'yargs';

const numCPUs = os.cpus().length;

//const timeOut = (args.delay || 0) as number;
//const port = args.port || 8000;

const timeOut = 0;
const port = 8000;

console.log("port", port);
console.log("delay", timeOut);

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', function (worker) {
    console.log('worker:' + worker.id + " is forked");
  });

  cluster.on('online', function (worker) {
    console.log('worker:' + worker.id + " is online");
  });

  cluster.on('listening', function (worker) {
    console.log('worker:' + worker.id + " is listening");
  });

  cluster.on('disconnect', function (worker) {
    console.log('worker:' + worker.id + " is disconnected");
  });

  cluster.on('exit', function (worker) {
    console.log('worker:' + worker.id + " is dead");
  });

  cluster.on('exit', function (worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });

} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer(function (req, res) {

    (<any>process).send('worker:' + cluster.worker.id + " going to send response ");

    setTimeout(function () {
      res.writeHead(200);
      res.end("worker: " + cluster.worker.id);
    }, timeOut);
    
  }).listen(port);

}
