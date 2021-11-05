# SDC

SDC is our Systems Design Capstone Project. Our team inherited a legacy codebase for an eCommerce site and we were tasked with developing the back end infrastructure for three microservices: Products, Questions and Answers, Ratings and Reviews. We optimized database queries, server and load balancer configurations and scaled our services to handle over 12 million records and heavy user traffic (at least 1000 requests per second) with low latency and low error rate (<1%).


## Contributors
<a href="https://github.com/jaylee20">Jay Lee</a>,
<a href="https://github.com/chiakat">Katherine Yu</a>,
<a href="https://github.com/theGuyNextDoor">Tim Jordan</a>

The front end for this repo was forked from [Marvelous Maitake](https://github.com/marvelous-maitake/fec).


## Tech Stack

* [React.js](https://reactjs.org/)
* [Express.js](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org/)
* [AWS EC2](https://aws.amazon.com/ec2/)
* [NGINX](https://www.nginx.com/)
* [k6](https://k6.io/)
* [loader.io](https://loader.io/)
* [New Relic](https://newrelic.com/)


## Installation

Use the package manager [npm](https://www.npmjs.com/) to install dependencies.

```bash
npm install
```


## Usage
```
# bundles files
npm run transpile

# initializes server
npm run server

# enter api key
copy config.example.js in server folder
rename it to config.js
uncomment code and replace 'GITHUBKEY' with your personal access token

# open client
open http://localhost:3000/ in browser
```
