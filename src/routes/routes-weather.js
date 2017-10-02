const router = require('express').Router()

/**
 * @param {Array} features - See API docs for supported features
 * @param {string} place - US zip code or longitude,latitude
 *
 * @see https://www.wunderground.com/weather/api/d/docs
 */
router.get('/weather/', async (req, res, next) => {})

module.exports = router
