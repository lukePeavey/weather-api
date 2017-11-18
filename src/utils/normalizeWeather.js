const { pickBy, identity, get, mapKeys } = require('lodash')

function normalizeUnit(value, key) {
  return key === 'fahrenheit' ? 'english' : key === 'celsius' ? 'metric' : key
}

/**
 * Cleans up the data returned by the API.
 * Reduces unnecessary nesting, fixes some inconsistent property name, and
 * returns the data in more logical structure that makes client side code
 * cleaner and easier to read.
 *
 * @todo - This should be handled on the client using library like normalizr.
 * @todo - Add documentation on the returned data structure and how it differs
 * from the data returned directly from WU API.
 */
module.exports = function normalizeWeather(data) {
  let days = get(data, 'forecast.simpleforecast.forecastday')
  let current = get(data, 'current_observation')
  let hours = get(data, 'hourly_forecast')

  if (current) {
    let { display_location, observation_location, image, ...conditions } = current
    current = { location: display_location, conditions }
  }

  if (days) {
    let forecastDayNightText = data.forecast.txt_forecast.forecastday
    days = days.map((forecastDay, i) => {
      const { high, low, ...conditions } = forecastDay
      const dayText = forecastDayNightText[i * 2]
      const nightText = forecastDayNightText[i * 2 + 1]
      const summary = {
        day: { english: dayText.fcttext, metric: dayText.fcttext_metric },
        night: { english: nightText.fcttext, metric: nightText.fcttext_metric }
      }
      return {
        ...conditions,
        summary,
        high: mapKeys(high, normalizeUnit),
        low: mapKeys(low, normalizeUnit)
      }
    })
  }

  if (hours) {
    hours = hours.map(forecastHour => {
      const { FCTTIME: date, ...properties } = forecastHour
      return { ...properties, date }
    })
  }

  return pickBy({ current, days, hours }, identity)
}
