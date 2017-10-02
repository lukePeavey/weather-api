const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authentication = {
  local: passport.authenticate('local', { session: false })
}

/**
 * Login Route
 * Uses the local authentication strategy. If a user successfully logs in with
 * username and password, a json web token (JWT) is sent to the client which
 * can be used to authenticate subsequent requests to the API.
 */
router.post('/auth/login', authentication.local, async (req, res, next) => {
  const user = req.user
  const payload = {
    fullName: user.fullName,
    email: user.email,
    id: user.id
  }
  const token = jwt.sign(payload, process.env.SECRET_KEY)
  // @todo - handle successful login
  res.json({ message: 'LOGIN SUCCESSFUL', token })
})

/**
 * Registration Route
 * Creates a new user account with the provided data.
 */
router.post('/auth/register', async (req, res, next) => {
  // Registration form data
  const { firstName, lastName, email, password } = req.body
  const name = { first: firstName, last: lastName }

  // Make sure all of the required fields are present
  if (!firstName || !lastName || !email || !password) {
    return res.status(422).send('INVALID REQUEST')
  }

  try {
    // Check if the username exists already
    let user = await User.findOne({ email })
    if (user !== null) {
      res.status(422).send('A USER WITH THAT EMAIL ADDRESS ALREADY EXISTS')
    } else {
      // Create a new user and save it to the database
      user = await new User({ email, password, name }).save()
      // @todo - handle successful registration
      res.status(200).json({ message: 'REGISTRATION SUCCESSFUL', user })
    }
  } catch (err) {
    console.error(err)
    response.status(500)
  }
})

module.exports = router
