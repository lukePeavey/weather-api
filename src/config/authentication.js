const passport = require('passport')
const passportJWT = require('passport-jwt')
const passportLocal = require('passport-local')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { fromAuthHeaderAsBearerToken, fromExtractors } = passportJWT.ExtractJwt

/** Custom extractor functions for JWT strategy */
const extractors = [
  // Extract auth token from signed cookie
  req =>  {
    if (!req || !req.signedCookies) return null
    return req.signedCookies['jwt'] || null
  },
  // Could add additional extractors here...
]

/**
 * Local Authentication Strategy
 * Standard username/password based authentication. Compares the credentials
 * provided in the request (email & password) to the internal user database.
 * This strategy is used by the '/auth/login' route.
 * @see 'models/User'
 * @see 'routes/auth'
 */
const localStrategy = new passportLocal.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  async (email, password, done) => {
    try {
      let user = await User.findOne({ email })
      let isValidPassword = user && (await user.comparePassword(password))
      return done(null, isValidPassword && user)
    } catch (err) {
      done(err)
    }
  }
)

/**
 * JWT Authentication Strategy
 * Authentication strategy using json web tokens (JWT).
 */
const jwtStrategy = new passportJWT.Strategy(
  {
    jwtFromRequest: fromExtractors(extractors),
    secretOrKey: process.env.SECRET_KEY,
    session: false
  },
  async (jwt_payload, done) => {
    try {
      let user = await User.findById(jwt_payload.id)
      return done(null, user || false)
    } catch (err) {
      return done(err)
    }
  }
)

passport.use(localStrategy)
passport.use(jwtStrategy)

module.exports = {
  tokenExpiration: 604800
}
