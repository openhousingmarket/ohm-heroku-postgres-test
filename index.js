const pg = require('pg')
const url = require('url')
const request = require('request')
const parseString = require('xml2js').parseString
require('dotenv').config()

const args = process.argv
const place = args[args.length-1]
if (!place || /\.js$/.test(place)) {
  console.error('usage: node index.js POSTCODE')
  process.exit(1)
}

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

const insertProperty = listing => {
  return new Promise((fulfill, reject) => {
    const onComplete = (err, res) => {
      if (err) throw err
      else {
        console.log('Inserted row')
        fulfill(res)
      }
    }
    client.query("insert into public.properties (outcode) values ('" + listing.outcode + "')", onComplete)
  })
}

const closeConnection = () => client.end(err => { if (err) throw err })

const handleConnection = err => {
  if (err) throw err
  request(
    'http://api.zoopla.co.uk/api/v1/property_listings.xml?postcode=' +
    place + '&page_size=100&include_sold=1&listing_status=sale&api_key=4psufpf7vmrvpngfrc3zuyqm',
    (error, response, body) => {
      console.log('API Response received')
      parseString(body, (err, result) => {
        if (result.response.listing) {
          const insertions = result.response.listing.map(insertProperty)
          Promise.all(insertions)
            .then(() => console.log('All insertions completed successfully'))
            .catch(() => console.log('Some insertions failed'))
            .then(closeConnection)
        }
        else {
          console.log('No results returned from API')
          closeConnection()
        }
      })
    }
  )
}

client.connect(handleConnection)

