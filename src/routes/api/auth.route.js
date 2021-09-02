'use strict'

const axios = require('axios')
const express = require('express')
const router = express.Router()
const authController = require('../../controllers/auth.controller')
const validator = require('express-validation')
const { create } = require('../../validations/user.validation')
const auth = require('../../middlewares/authorization')

router.post('/register', validator(create), authController.register) // validate and register
router.post('/login', authController.login) // login
router.get('/confirm', authController.confirm)
router.post('/add_beer', auth(), authController.addBeer)
// Authentication example
router.post('/secret1', auth(), (req, res) => {
  res.json({ message: 'Only auth users can access' })
})
router.get('/secret2', auth(['admin']), (req, res) => {
  // example route for auth
  res.json({ message: 'Only admin can access' })
})
router.get('/secret3', auth(['user']), (req, res) => {
  // example route for auth
  res.json({ message: 'Only user can access' })
})

module.exports = router
