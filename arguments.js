require('dotenv').config()

exports.readArguments = function readArguments () {
  const args = process.argv
  const place = args[args.length-1]
  if (!place || /\.js$/.test(place)) {
    console.error('usage: node index.js POSTCODE')
    process.exit(1)
  }
  return {
    place,
    databaseUrl: process.env.DATABASE_URL
  }
}

