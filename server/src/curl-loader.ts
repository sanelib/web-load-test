import * as cluster from 'cluster';

if (cluster.isMaster) {
    const worker = cluster.fork();
    worker.on('message', (text) => {
        console.log(text);
    });
} else {
    (<any> process).send('Hello!');
}

