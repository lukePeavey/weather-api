const router = require('express').Router()
const User = require('../models/User')

/**
 * Get all users from the database.
 */
router.get(`/users`, async (req, res, next) => {})

/**
 * Gets a single user from the database
 */
router.get(`/users/:id`, (req, res, next) => {})

/**
 * Update an existing user
 */
router.put(`/users/:id`, (req, res, next) => {})

/**
 * Delete a user from the database
 */
router.delete(`/users/:id`, (req, res, next) => {})

module.exports = router
