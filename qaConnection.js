const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'katherineyu',
  host: 'database.server.com',
  database: 'questionsandanswers',
  password: 'password',
  port: 5432,
})
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})
const client = new Client({
  user: 'katherineyu',
  host: 'database.server.com',
  database: 'questionsandanswers',
  password: 'password',
  port: 5432,
})
client.connect()
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})