const app = require('./src/app')
const normalizePort = require('./src/utils/normalizePort')
const PORT = normalizePort(process.env.PORT)

// Start the web server
app.listen(PORT, () => {
  console.info(`Weather api is running on ${PORT}`)
})
