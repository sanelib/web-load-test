import * as cluster from 'cluster';
import StopWatch from './stopwatch'

if (cluster.isMaster) {

    var stopwatch = new StopWatch();
    stopwatch.start();

    for (var index = 0; index < 1; index++) {
        stopwatch.printElapsed('Instance[' + index + ']');

        const worker = cluster.fork();
        worker.on('message', (text) => {
            console.log(text);
        });
    }

    stopwatch.stop();

    stopwatch.printElapsed();

} else {
    let interval = 500; // the default value, can be tweaked
    let lastTime = Date.now();
    setInterval(function () {
        const now = Date.now();
        let lag = now - lastTime;
        lag = Math.max(0, lag - interval);
        (<any>process).send('lag: ' + lag);
    }, interval);
}