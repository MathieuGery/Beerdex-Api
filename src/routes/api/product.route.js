'use strict'

const axios = require('axios')
const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/authorization')

router.post('/infos', auth(), (req, res) => {

  if (!req.body.product_id) {
    res.status(400).json('No product id specified')
  }
  // example route for auth
  axios.get('https://world.openfoodfacts.org/api/v0/product/' + req.body.product_id)
    .then(function (response) {
      // handle success
      res.json({ message: response.data })
    })
    .catch(function (error) {
      // handle error
      console.log(error)
    })
})

module.exports = router
