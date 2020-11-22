/* eslint-disable node/no-deprecated-api */
const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const ENDPOINT_URL = 'https://pkgstore.datahub.io/JohnSnowLabs/population-figures-by-country/population-figures-by-country-csv_json/data/2159fad77778c3b584f3d396593e0af6/population-figures-by-country-csv_json.json'

router.get('/country.json', (req, res) => {
  // console.log(`requesting ${ENDPOINT_URL}${req.url}`)
  const headers = {
    'Content-Type': 'application/json'
  }
  fetch(ENDPOINT_URL, headers)
    .then(data => data.json())
    .then(json => {
      // console.log(JSON.stringify(json));
      res.send(json)
    })
    .catch(e => console.log(`Error: ${e}`))
})

module.exports = router
