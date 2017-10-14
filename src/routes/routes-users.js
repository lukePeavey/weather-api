const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')
const { isString, pick } = require('lodash')

/** Authenticates a request using passport JWT strategy. */
const authenticate = passport.authenticate('jwt', { session: false })

/**
 * Gets all users from the database. This route doesn't
 * require authentication and is only for testing purposes.
 */
router.get(`/users`, async (req, res, next) => {
  try {
    let users = await User.find({})
    res.status(200).json(users)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

/**
 * Returns the authenticated user from the database.
 */
router.get(`/user`, authenticate, async (req, res, next) => {
  res.status(200).json(req.user)
})

/**
 * Updates basic user information for the authenticated user.
 * Allows users to change the name and email address for their account
 */
router.put(`/user`, authenticate, async (req, res, next) => {
  const updateFields = pick(req.body, ['firstName', 'lastName', 'email'])
  try {
    await User.update({ _id: req.user._id }, updateFields)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

/**
 * Deletes the authenticated user from the database.
 * This would be used to allow users to delete their own account.
 */
router.delete(`/user`, authenticate, async (req, res, next) => {
  try {
    await User.remove({ _id: req.user._id })
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    console.error(err)
    res.sendStatus(200)
  }
})

/**
 * Adds a new saved location to the authenticated user.
 * The app allows users to save locations (for weather forecast). The locations
 * are stored directly in the user document, as an array of ids. The ids
 * correspond to locations from the Google Places API.
 */
router.put(`/user/locations/`, authenticate, async (req, res, next) => {
  const locationID = String(req.query.id)
  try {
    await User.update(
      { _id: req.user._id },
      { $addToSet: { savedLocations: locationID } }
    )
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

/**
 * Removed a saved location from the authenticated user.
 * The provided locationID is removed from the array of stored locations
 * for the authenticated user.
 */
router.delete(`/user/locations/:id`, authenticate, async (req, res, next) => {
  const locationID = String(req.params.id)
  try {
    await User.update(
      { _id: req.user._id },
      { $pullAll: { savedLocations: [locationID] } }
    )
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

module.exports = router
