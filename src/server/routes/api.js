/* eslint-disable node/no-deprecated-api */
const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const TOKEN = 'AAAAAAAAAAAAAAAAAAAAAI4OHgEAAAAAlbk0HSIAqcc3havrrU9j2NeAQ34%3DzJmzwHuQerd8JJ2TeuHfqwKgBt6bK4tk93w3ocBB2vPuKMF3cG'
const AUTH_HEADER = {
    headers: {
        Authorization: `Bearer ${TOKEN}`
    }
}
const ENDPOINT_URL = 'https://api.twitter.com'

router.get('/1.1/search/tweets.json', (req, res) => {
    // console.log(`requesting ${ENDPOINT_URL}${req.url}`)
    fetch(`${ENDPOINT_URL}${req.url}`, AUTH_HEADER)
        .then(data => data.json())
        .then(json => res.send(json))
        .catch(e => console.log(`Error: ${e}`))
})

module.exports = router
