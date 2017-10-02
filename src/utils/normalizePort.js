const defaultPort = require('../config/server').defaultPort

module.exports = function normalizePort(value) {
  let port = typeof value === 'number' ? value : parseInt(value, 10)
  return Number.isInteger(port) ? port : defaultPort
}
