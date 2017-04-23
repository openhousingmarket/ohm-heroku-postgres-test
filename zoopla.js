const request = require('request')
const parseString = require('xml2js').parseString

exports.makeRequest = function getListingsForPlace(url) {
  return new Promise((fulfill, reject) => {
    request(url,
      (err, response, body) => {
        if (err || response.statusCode !== 200) reject(err || response.statusCode)
        else {
          parseString(body, (err, result) => {
            if (err) reject(err)
            else fulfill(result)
          })
        }
      }
    )
  })
}
