const puppeteer = require('puppeteer');

async function startworker() {

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
  
	await page.goto('https://cloudfront.radheexch.com/home');
	await page.waitForSelector('title');
  
	// Executes Navigation API within the page context
	const metrics = await page.evaluate(() => JSON.stringify(window.performance));
  
	await browser.close();

	// Parses the result to JSON
	//console.info(JSON.parse(metrics));
  
	return JSON.parse(metrics);
}

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	console.log(`Master ${process.pid} is running`);

	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
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