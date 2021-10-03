'use strict'

const express = require('express')
const router = express.Router()
const validator = require('express-validation')
const { beer } = require('../../validations/beer.validation')
const { addBeer } = require('../../validations/addBeer.validation')
const auth = require('../../middlewares/authorization')
const beerController = require('../../controllers/beer.controller')
const { editBeer } = require('../../validations/editBeer.validation')

router.post('/infos', validator(beer), auth(), beerController.get_beer_infos)
router.post('/add_beer', validator(addBeer), auth(), beerController.addBeer)
router.post('/edit_beer/:id', validator(editBeer), auth(), beerController.editBeer)
module.exports = router
