# Quick setup

##TODO: [https://www.sitepoint.com/how-to-create-a-node-js-cluster-for-speeding-up-your-apps/]

```

npm list -g --depth 0

1.To Install PM2 run following command

npm install pm2 -g

2. Install packages

npm install

3. To run app without PM2

node app.js --port=9001 --interval=1000

4. To run app with PM2

pm2 start app.js -- --port=9001 --interval=1000

" make sure -- for passing command arguments"

```

http://servermonitoringhq.com/blog/how_to_quickly_stress_test_a_web_server

curl -n -s http://localhost:9001/events/[1-10]

Do not use time for now.
seq 1 1000 | xargs -I{} -n1 -P1000 time curl -s -n "http://localhost:9001/events/{}" -o "output.{}.txt"

seq 1 1000 | xargs -I{} -n1 -P1000 curl -s -n "http://localhost:9001/events/{}" -o "output.{}.txt"

seq 1 3000 | xargs -I{} -n1 -P3000 curl -s -n "http://localhost:9001/events/{}" -o "output.{}.txt"


https://k6.io/docs/using-k6/cloud-execution


# Various load testing options

## JAEGER

Inspired by Dapper and OpenZipkin, Jaeger is a distributed tracing system released as open source by Uber Technologies. You use it for monitoring and troubleshooting microservice-based distributed systems.

Maning book CODE: KDMATH50 30in30cc

## Running with wrk

docker pull williamyeh/wrk
docker run --rm williamyeh/wrk
docker run --rm williamyeh/wrk -t2 -c5 -d5s -H "X-CLIENT: SUNNY" --timeout 2s https://atcults.com


