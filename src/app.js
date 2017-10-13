const dotenv = require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')
const routes = require('./routes')
const authentication = require('./config/authentication')
const cookieParser = require('cookie-parser')

// Environment variables
const { SECRET_KEY, DATABASE_URL } = process.env

// Initialize the app
const app = express()
app.use(bodyParser.json())
app.use(cookieParser(SECRET_KEY))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())

// Setup API routes
app.use(routes.users)
app.use(routes.auth)
app.use(routes.weather)
app.use(routes.places)

// Initialize database connection
mongoose.Promise = global.Promise
mongoose.connect(DATABASE_URL, { useMongoClient: true })

module.exports = app
