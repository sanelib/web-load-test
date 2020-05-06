https://www.npmjs.com/package/curl-request

1.To Install PM2 run following command

npm install pm2 -g

2. Install packages

npm install

3. To run app without PM2

node app.js --port=9000 --url='http://localhost:9001/events'

4. To run app with PM2

pm2 start app.js -- --port=9000 --url='http://localhost:9001/events'

" make sure -- for passing command arguments"

" you can use '-i 0'  for cluster testing " ex: pm2 start app.js -i 0 -- --port=9000 --url="http://localhost:9001/events"