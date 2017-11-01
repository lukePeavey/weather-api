const router = require('express').Router()
const fetch = require('node-fetch')
const { get, isEmpty } = require('lodash')
const createError = require('http-errors')
const normalizeWeather = require('../utils/normalizeWeather')
const API_BASE = 'http://api.wunderground.com/api'
const KEY = process.env.WEATHER_UNDERGROUND_KEY

/**
 * Makes a request to the weather underground API.
 * The requeset can include any of the supported API features, such as
 * 'conditions', 'forecast10day', etc. At least one feature must be specified.
 * If the place is not specified, it will default to 'autoip', which detects
 * the user's approximate location based on IP.
 *
 * @param {string} req.query.place - longitude,latitude | zip code | default is 'autoip'
 * @param {string} req.query.features - comma separated list of weather api feaetures to include
 * @see {@link https://www.wunderground.com/weather/api/d/docs}
 */
router.get('/weather', async (req, res, next) => {
  const { query } = req
  const place = query.place || 'autoip'
  const features = String(query.features)
    .split(',')
    .join('/')

  try {
    const apiResponse = await fetch(`${API_BASE}/${KEY}/${features}/q/${place}.json`)
    const { response, ...data } = await apiResponse.json()
    if (isEmpty(data)) {
      return next(createError(422, get(response, 'error.description', 'Unable to get weather')))
    }
    res.status(200).json(normalizeWeather(data))
  } catch (err) {
    return next(err)
  }
})

/**
 * Gets the current weather conditions
 * If place is not specified, it will default to 'autoip', which detects the
 * user's approximate location based on ip.
 *
 * @param {string} req.query.place - longitude,latitude | zip code (default is autoip)
 * @see {@link https://www.wunderground.com/weather/api/d/docs?d=data/conditions}
 */
router.get('/weather/current/:place?', async (req, res, next) => {
  const { query, params } = req
  const place = params.place || query.place || 'autoip'
  try {
    const apiResponse = await fetch(`${API_BASE}/${KEY}/conditions/q/${place}.json`)
    const { response, ...data } = await apiResponse.json()
    if (isEmpty(data)) {
      return next(createError(422, get(response, 'error.description', 'Unable to get weather')))
    }
    res.status(200).json(normalizeWeather(data))
  } catch (err) {
    return next(err)
  }
})

/**
 * Gets 10 days of daily weather forecast data.
 *
 * @param req.query.place - longitude,latitude | zip code (default is autoip)
 * @see {@link https://www.wunderground.com/weather/api/d/docs?d=data/forecast10day}
 */
router.get('/weather/days/:place?', async (req, res, next) => {
  const { query, params } = req
  const place = params.place || query.place || 'autoip'
  try {
    const apiResponse = await fetch(`${API_BASE}/${KEY}/forecast10day/q/${place}.json`)
    const { response, ...data } = await apiResponse.json()
    if (isEmpty(data)) {
      return next(createError(422, get(response, 'error.description', 'Unable to get weather')))
    }
    res.status(200).json(normalizeWeather(data))
  } catch (err) {
    return next(err)
  }
})

/**
 * Get 10 days of hourly weather forecast data.
 *
 * @param {string} req.query.place - longitude,latitude | zip code (default is autoip)
 * @see {@link https://www.wunderground.com/weather/api/d/docs?d=data/hourly10day}
 */
router.get('/weather/hours/:place?', async (req, res, next) => {
  const { query, params } = req
  const place = params.place || query.place || 'autoip'
  try {
    const apiResponse = await fetch(`${API_BASE}/${KEY}/hourly10day/q/${place}.json`)
    const { response, ...data } = await apiResponse.json()
    if (isEmpty(data)) {
      return next(createError(422, get(response, 'error.description', 'Unable to get weather')))
    }
    res.status(200).json(normalizeWeather(data))
  } catch (err) {
    return next(err)
  }
})

module.exports = router
