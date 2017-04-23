const pg = require('pg')
const url = require('url')
const request = require('request')
const parseString = require('xml2js').parseString
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

const handleError = f => function (err) {
  if (err) throw err
  else if (f) f.apply(this, Array.from(arguments).splice(1))
}

const client = new pg.Client(connectionSettings)

const handleQueryResult = result => {
  console.log(result.rows)
  
}


const args = process.argv
const place = args[args.length-1]

request('http://api.zoopla.co.uk/api/v1/property_listings.xml?postcode=' + place + '&page_size=100&include_sold=1&listing_status=sale&api_key=4psufpf7vmrvpngfrc3zuyqm',
  (error, response, body) => {
   parseString(body, (err, result) => {
     client.query(
       "insert into public.properties (outcode) values ('" + result.response.listing[0].outcode + "')",
       handleError(() => client.end(handleError())))
    })
  })



const handleConnection = () => { }

client.connect(handleError(handleConnection))

