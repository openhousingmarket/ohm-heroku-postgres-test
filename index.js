const { readArguments                          } = require('./arguments')
const { makeRequest                            } = require('./zoopla')
const { connect, executeQuery, closeConnection } = require('./database')

const { place, databaseUrl } = readArguments()

const insertProperty = (client, listing) => 
  executeQuery(client, {
    text: "insert into public.properties (outcode) values ($1)",
    values: listing.outcode
  })
  .then(() => console.log('Inserted row'))
  .catch(err => console.error('Failed to insert row', err))

const zooplaApiUrl =
  'http://api.zoopla.co.uk/api/v1/property_listings.xml?postcode=' +
  place +
  '&page_size=100&include_sold=1&listing_status=sale&api_key=4psufpf7vmrvpngfrc3zuyqm'

connect(databaseUrl)
  .then(client => makeRequest(zooplaApiUrl)
    .then(result => {
      console.log('Zoopla API response received')
      if (!result.response.listing) {
        console.log('No results returned from API')
      }
      const insertions = result.response.listing.map(x => insertProperty(client, x))
      return Promise.all(insertions)
        .then(() => console.log('All insertions completed successfully'))
        .catch(() => console.log('Some insertions failed'))
    })
    .catch(err => console.error(err))
    .then(() => closeConnection(client))
  )
  .catch(err => console.error(err))

