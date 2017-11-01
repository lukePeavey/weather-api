const router = require('express').Router()
const createError = require('http-errors')
const GoogleMaps = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_KEY,
  Promise: Promise
})

/**
 * Wrapper for GoogleMapsClient#AutoComplete
 * Gets a list of autocomplete suggestions for the given input value
 *
 * @param {string} req.query.input (required) the value used
 * @see {@link https://developers.google.com/places/web-service/autocomplete}
 */
router.get('/places/autocomplete/', async (req, res, next) => {
  try {
    const apiResponse = await GoogleMaps.placesAutoComplete(req.query).asPromise()
    const { json: { predictions, status } } = apiResponse
    if (status !== 'OK') {
      throw createError(422, status)
    }
    res.status(200).json(predictions)
  } catch (err) {
    return next(err)
  }
})

/**
 * Wrapper for GoogleMapsClient#Place
 * Gets the details about a specific place from Google Place API.
 *
 * @param {string} req.query.placeid (required) the ID of the place
 * @see {@link https://developers.google.com/places/web-service/details}
 */
router.get(`/places/details`, async (req, res, next) => {
  try {
    const { status, json: { result } } = await GoogleMaps.place(req.query).asPromise()
    if (status !== 'OK') {
      throw createError(422, status)
    }
    const { geometry: { location }, photos, ...rest } = result
    res.status(200).json({ location, ...rest })
  } catch (err) {
    return next(err)
  }
})

/**
 * Wrapper for GoogleMapsClient#geolocate
 * Performs a geolocate request to get the client's location using
 * geolocation technology. This requires user authorization to access
 * location services
 *
 * @param {string} req.query.placeid (required) the ID of the place
 * @see {@link https://developers.google.com/maps/documentation/geolocation}
 */
router.get(`/places/geolocate`, async (req, res, next) => {
  try {
    const { status, json } = await GoogleMaps.geolocate({}).asPromise()
    res.status(200).json(json)
  } catch (err) {
    return next(err)
  }
})

/**
 * Wrapper for GoogleMapsClient#reverseGeocode
 * Performs a reverse-geocode request to retrieve address/location info
 * based on geographic coordinates.
 *
 * @param {string} req.query.latlng (required) the coordinates
 * @see {@link https://developers.google.com/maps/documentation/geocoding}
 */
router.get(`/places/reverse-geocode`, async (req, res, next) => {
  try {
    const { status, json } = await GoogleMaps.reverseGeocode(req.query).asPromise()
    res.status(200).json(json)
  } catch (err) {
    return next(err)
  }
})

module.exports = router
