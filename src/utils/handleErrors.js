/**
 * Error handing middleware for routes
 * @todo Need to do some additional work/research on error handling in express routes
 */
module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  // Log errors to the console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err)
  }
  // Send the status and error message to the client.
  // For internal server errors, this will not send the specific error message,
  // just the status text.
  const status = err.status || 500
  const message = status === 500 ? 'Internal server Error' : err.message
  res.status(status).json({ status, message })
}
