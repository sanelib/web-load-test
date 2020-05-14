const puppeteer = require('puppeteer');

const url = 'https://cloudfront.radheexch.com/';
//const url = 'https://pptr.dev';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Starts to gather coverage information for JS and CSS files
    await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);

    // Starts to record a trace of the operations
    await page.tracing.start({ path: 'trace.json' });

    await page.goto(url);
    await page.waitForSelector('title');

    // Stops the coverage gathering
    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage()
    ]);

    // Calculates how many bytes are being used based on the coverage
    const calculateUsedBytes = (type, coverage) =>
    coverage.map(({ url, ranges, text }) => {
        let usedBytes = 0;

        ranges.forEach(range => (usedBytes += range.end - range.start - 1));

        return {
        url,
        type,
        usedBytes,
        totalBytes: text.length
        };
    });

    console.info([
        ...calculateUsedBytes('js', jsCoverage),
        ...calculateUsedBytes('css', cssCoverage)
      ]);

    // Executes Navigation API within the page context
    const metrics = await page.evaluate(() => JSON.stringify(window.performance));

    // Parses the result to JSON
    console.info(JSON.parse(metrics));

    // Returns runtime metrics of the page
    const metrics2 = await page.metrics();
    console.info(metrics2);

    await page.goto('https://cloudfront.radheexch.com/home');
    await page.waitForSelector('title');

    // Stops the recording
    await page.tracing.stop();

    await browser.close();
})();