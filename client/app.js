const EventSource = require('EventSource');

console.log(`Worker ${process.pid} started`);

const args = require('yargs').argv;

const url = args.url;

console.log("URL", url);

/*
var bunyan = require('bunyan');
const log = bunyan.createLogger({
    name: 'sse.logs',
    serializers: bunyan.stdSerializers,
    level: 'info',
    streams: [
        {
            type: 'rotating-file',
            level: bunyan.INFO,
            path: 'logs/sse.log',
            closeOnExit: true,
            period: '1d',   // daily rotation
            count: 3,        // keep 3 back copies
        }
    ]
});

//const es = new EventSource("https://dev-mgr.in.fd5.io/api/print/invoice/A380061FI00101");

*/

const cluster = require('cluster');

if (cluster.isMaster) {

    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < 1; i++) {
        cluster.fork();
    }

    cluster.on('fork', (worker) => {
        console.log(`worker ${worker.process.pid} forked`);
    });

    cluster.on('message', (worker, message, handle) => {
        console.log(message);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });

} else {

    console.log('Connecting:' + url);

    const es = new EventSource(url);

    es.addEventListener('message', function (e) {
        console.log(e.data);

        var diff = new Date().getTime() - parseInt(e.data);

        if(diff > 500) console.log("diff:", diff);

    });
}