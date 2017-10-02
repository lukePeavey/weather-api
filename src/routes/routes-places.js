const router = require('express').Router()
const moment = require('moment-timezone')
const GoogleMaps = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_KEY,
  Promise: Promise
})

/**
 * Wrapper for GoogleMapsClient#AutoComplete
 * Gets a list of autocomplete suggestions for the given input value
 * @see https://developers.google.com/places/web-service/autocomplete
 */
router.get('/places/autocomplete/', async (req, res, next) => {
  try {
    const apiResponse = await GoogleMaps.placesAutoComplete(req.query).asPromise()
    res.status(200).json(apiResponse)
  } catch(err) {
    console.error(err)
    res.status(500)
  }
})

/**
 * Wrapper for GoogleMapsClient#Place
 * Gets details about a specific place from Google Place API
 * @see https://developers.google.com/places/web-service/details
 */
router.get(`/places/details`, async (req, res, next) => {
  try {
    const apiResponse = await GoogleMaps.place(req.query).asPromise()
    res.status(200).json(apiResponse)
  } catch(err) {
    console.error(err)
    res.status(500)
  }
})

module.exports = router
