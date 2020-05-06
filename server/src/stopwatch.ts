const NS_PER_SEC = 1e9;

export default class StopWatch {
    startTime: [number, number];
    stopTime: [number, number];
    running: boolean;

    constructor() {
        this.startTime = [0, 0];
        this.stopTime = [0, 0];
        this.running = false;
    }
    start() {
        this.startTime = process.hrtime();
        this.running = true;
    }
    stop() {
        this.stopTime = process.hrtime(this.startTime);
        this.running = false;
    }
    printElapsed(name?: string) {
        var currentName = name || 'Elapsed:';
        console.log(currentName, `${this.stopTime[0] * NS_PER_SEC + this.stopTime[1]} nanoseconds`);
    }
}