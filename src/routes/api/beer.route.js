'use strict'

const axios = require('axios')
const express = require('express')
const config = require('../../config')
const router = express.Router()
const auth = require('../../middlewares/authorization')

router.post('/infos', auth(), (req, res) => {

  if (!req.body.product_id) {
    res.status(400).json('No product id specified')
  }
  // example route for auth
  axios.get(config.openFoodFactsUri + req.body.product_id)
    .then(function (response) {
      // handle success
      if (response.data.status === 0) {
        res.status(400).json('Ce produit n\'existe pas')
      }
      let categories = response.data.product.categories
      if (categories.includes("Bière")){
        res.json({ infos: response.data })
      }
      else {
        res.status(400).json('Ceci n\'est pas une bière')
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error)
    })
})

module.exports = router
