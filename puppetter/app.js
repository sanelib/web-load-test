const puppeteer = require('puppeteer-core');

async function startworker() {

	// Replace puppeteer.launch with puppeteer.connect
	const browser = await puppeteer.connect({
		browserWSEndpoint: 'ws://localhost:3000'
	});

	console.log(await browser.version());

	// The rest of your script remains the same
	const page = await browser.newPage();
	await page.goto('https://atcults.com');
	//await page.screenshot({ path: 'screenshot.png' });
	//page.close();
}

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	console.log(`Master ${process.pid} is running`);

	// Fork workers.
	for (let i = 0; i < numCPUs * 3; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
	});
} else {
	
	startworker()
	.then(console.log)
	.catch(console.error)

	console.log(`Worker ${process.pid} started`);
}