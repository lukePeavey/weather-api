const router = require('express').Router()

/**
 * Wrapper for GoogleMapsClient#AutoComplete
 * Gets a list of autocomplete suggestions for the given input value
 * @see https://developers.google.com/places/web-service/autocomplete
 */
router.get('/places/autocomplete/', async (req, res, next) => {})

/**
 * Wrapper for GoogleMapsClient#Place
 * Gets details about a specific place from Google Place API
 * @see https://developers.google.com/places/web-service/details
 */
router.get(`/places/details`, async (req, res, next) => {})

module.exports = router
