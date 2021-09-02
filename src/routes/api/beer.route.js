'use strict'

const axios = require('axios')
const express = require('express')
const config = require('../../config')
const router = express.Router()
const auth = require('../../middlewares/authorization')
const beerController = require('../../controllers/beer.controller')

router.post('/infos', auth(), beerController.get_beer_infos)

module.exports = router
