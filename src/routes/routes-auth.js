const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { tokenExpiration } = require('../config/authentication')
const { pick } = require('lodash')
const createError = require('http-errors')

/** Authenticates request using local authentication strategy */
const authenticate = passport.authenticate('local', { session: false })

/**
 * Login Route
 * Uses the local authentication strategy. If a user successfully logs in with
 * username and password, a json web token (JWT) is created which will be used
 * to authenticate subsequent API requests from the user. The token is stored
 * on the client as a cookie.
 * @todo further research: cookies vs local storage (for jwt)
 */
router.post('/auth/login', authenticate, async (req, res, next) => {
  const user = req.user
  const payload = pick(user, ['fullName', 'email', 'id'])
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: tokenExpiration
  })
  // Send token to the client as cookie
  res.cookie('jwt', token, {
    signed: true,
    httpOnly: true,
    maxAge: tokenExpiration,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production'
  })

  res.json({ token, user })
})

/**
 * Registration Route
 * Creates a new user account with the provided data.
 * @todo Handle successful registration (?)
 * @todo handle errors (?)
 */
router.post('/auth/register', async (req, res, next) => {
  // Extract form data
  const { firstName, lastName, email, password } = req.body
  // Make sure all of the required fields are present
  if (!firstName || !lastName || !email || !password) {
    return next(createError(400, 'Missing required fields'))
  }

  try {
    // Check if the username (email address) is already registered
    let user = await User.findOne({ email })
    if (user !== null) {
      return next(createError(422, 'A user with that email address has already registered'))
    } else {
      // Create a new user and save it to the database
      user = await new User({ email, password, firstName, lastName }).save()
      res.status(200).json({ user })
    }
  } catch (err) {
    return next(err)
  }
})

module.exports = router
