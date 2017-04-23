const pg = require('pg')
const url = require('url')

exports.connect = function connect (databaseUrl) {
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
  return new Promise((fulfill, reject) => {
    client.connect(err => {
      if (err) reject(err)
      else fulfill(client)
    })
  })
}

exports.closeConnection = function closeConnection (client) {
  client.end(err => { if (err) throw err })
}

exports.executeQuery = function executeQuery (client, query) {
  return new Promise((fulfill, reject) => {
    client.query(query, (err, res) => {
      if (err) reject(err)
      else {
        fulfill(res)
      }
    })
  })
}

