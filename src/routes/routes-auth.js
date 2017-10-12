const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { tokenExpiration } = require('../config/authentication')
const { pick } = require('lodash')

/** Authenticates request using local authentication strategy */
const authenticate = passport.authenticate('local', { session: false })

/**
 * Login Route
 * Uses the local authentication strategy. If a user successfully logs in with
 * username and password, a json web token (JWT) is sent to the client which
 * can be used to authenticate subsequent requests to the API.
 */
router.post('/auth/login', authenticate, async (req, res, next) => {
  const user = req.user
  const payload = pick(user, ['fullName', 'email', 'id'])
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: tokenExpiration
  })
  res.json({ status: 'OK', token, tokenExpiration })
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
    return res.status(401).json({ status: 'MISSING REQUIRED FIELDS' })
  }

  try {
    // Check if the username exists already
    let user = await User.findOne({ email })
    if (user !== null) {
      res.status(422).json({ status: 'EMAIL ADDRESS ALREADY REGISTERED' })
    } else {
      // Create a new user and save it to the database
      user = await new User({ email, password, firstName, lastName }).save()
      res.status(200).json({ status: 'OK', user })
    }
  } catch (err) {
    console.error(err)
    response.status(500)
  }
})

module.exports = router
