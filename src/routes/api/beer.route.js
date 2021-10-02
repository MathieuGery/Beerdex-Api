'use strict'

const express = require('express')
const router = express.Router()
const validator = require('express-validation')
const { beer } = require('../../validations/beer.validation')
const { addBeer } = require('../../validations/addBeer.validation')
const auth = require('../../middlewares/authorization')
const beerController = require('../../controllers/beer.controller')

router.post('/infos', validator(beer), auth(), beerController.get_beer_infos)
router.post('/add_beer', validator(addBeer), auth(), beerController.addBeer)
module.exports = router
