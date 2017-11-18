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
    return next(err)
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
    return next(err)
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
    return next(err)
  }
})


/**
 * Get array of saved places for the authenticated user
 */
router.get('/user/places', authenticate, async (req, res, next) => {
  try {
    const savedPlaces = req.user.places
    res.status(200).json(savedPlaces)
  } catch (err) {
    return next(err)
  }
})

/**
 * Adds a new saved location to the authenticated user.
 * The app allows users to save locations (for weather forecast). The locations
 * are stored directly in the user document, as an array of ids. The ids
 * correspond to locations from the Google Places API.
 */
router.post(`/user/places/`, authenticate, async (req, res, next) => {
  try {
    const { place_id, location } = req.body
    // Add the place to user's saved place if it doesn't exist
    if (!req.user.places.find(({place_id}) => place_id === place_id)) {
      await User.update({ _id: req.user._id }, { $addToSet: { places: { place_id, location } } })
    }
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    return next(err)
  }
})

/**
 * Removed a saved location from the authenticated user.
 * The provided placeID is removed from the array of stored locations
 * for the authenticated user.
 */
router.delete(`/user/places/:id`, authenticate, async (req, res, next) => {
  const placeID = String(req.params.id)
  try {
    await User.update({ _id: req.user._id }, { $pull: { places: { place_id: placeID } } })
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    return next(err)
  }
})


/**
 * Get the settings for the authenticated user
 */
router.get('/user/settings', authenticate, async (req, res, next) => {
  try {
    const settings = req.user.settings
    res.status(200).json(settings)
  } catch (err) {
    return next(err)
  }
})

/**
 * Updates the saved settings for the authenticated user.
 * The provided settings object will overwrite the existing settings,
 * not merge with it.
 *
 * @param {Object} req.query.settings
 */
router.post(`/user/settings/`, authenticate, async (req, res, next) => {
  const { settings } = req.body
  try {
    await User.update({ _id: req.user._id }, { settings })
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    return next(err)
  }
})

module.exports = router
