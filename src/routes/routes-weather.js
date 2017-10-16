const router = require('express').Router()
const fetch = require('node-fetch')
const API_BASE = 'http://api.wunderground.com/api'
const KEY = process.env.WEATHER_UNDERGROUND_KEY
/**
 * @param {Array} features
 * @param {string} place - the location for the weather request.
 *   This can be a US zip code or longitude,latitude
 */
router.get('/weather/', async (req, res, next) => {
  const { query, params } = req
  let features = String(query.features)
    .split(',')
    .join('/')
  let place = query.place || 'autoip'
  try {
    const apiResponse = await fetch(`${API_BASE}/${KEY}/${features}/q/${place}.json`)
    const data = await apiResponse.json()
    res.json(data)
  } catch (err) {
    return next(err)
  }
})

module.exports = router
