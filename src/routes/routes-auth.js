const router = require('express').Router()

/**
 * Login Route
 * Uses the local authentication strategy. If a user successfully logs in with
 * username and password, a json web token (JWT) is sent to the client which
 * can be used to authenticate subsequent requests to the API.
 */
router.post('/auth/login', async (req, res, next) => {})

/**
 * Registration Route
 * Registers a new user in the local database
 */
router.post('/auth/register', async (req, res, next) => {})

module.exports = router
