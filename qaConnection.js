const { Pool, Client } = require('pg');
const { POSTGRES_USER, POSTGRES_PASSWORD } = require('./server/config.js');

// const pool = new Pool({
//   user: POSTGRES_USER,
//   host: '127.0.0.1',
//   database: 'questionsandanswers',
//   password: POSTGRES_PASSWORD,
//   port: 5432,
// })

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

const client = new Client({
  user: POSTGRES_USER,
  host: '127.0.0.1',
  database: 'questionsandanswers',
  password: POSTGRES_PASSWORD,
  port: 5432,
})

client.connect()

// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   client.end()
// })