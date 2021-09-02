'use strict'

const axios = require('axios')
const express = require('express')
const config = require('../../config')
const router = express.Router()
const validator = require('express-validation')
const { beer } = require('../../validations/beer.validation')
const auth = require('../../middlewares/authorization')
const beerController = require('../../controllers/beer.controller')

router.post('/infos', validator(beer), auth(), beerController.get_beer_infos)

module.exports = router
