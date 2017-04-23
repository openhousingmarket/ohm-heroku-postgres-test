const pg = require('pg')
const url = require('url')
require('dotenv').config()

const databaseUrl = process.env.DATABASE_URL
const urlConnectionSettings = url.parse(databaseUrl)
const [ user, password ] = urlConnectionSettings.auth.split(':')
const connectionSettings = {
  user: user,
  password: password,
  host: urlConnectionSettings.hostname,
  port: urlConnectionSettings.port,
  database: urlConnectionSettings.path.split('/')[1],
  ssl: true
}

const client = new pg.Client(connectionSettings)

const handleError = err => { if (err) throw err }

const handleQueryResult = (err, result) => {
  handleError(err)
  console.log(result.rows)
  client.end(handleError)
}

const handleConnection = err => {
  handleError(err)
  client.query('select * from public.fruits', handleQueryResult)
}

client.connect(handleConnection)

