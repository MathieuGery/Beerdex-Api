'use strict'
const axios = require('axios')
const config = require('../config')

exports.get_beer_infos = async (req, res, next) => {
  let keywords = ''
  let categories = ''

  if (!req.body.product_id) {
    res.status(400).json('No product id specified')
  }
  // example route for auth
  axios.get(config.openFoodFactsUri + req.body.product_id)
    .then(function (response) {
      // handle success
      if (response.data.status === 0) {
        res.status(404).json('Ce produit n\'existe pas')
      }
      if (response.data.product.categories) {
        categories = response.data.product.categories
      }
      if (response.data.product._keywords) {
        keywords = response.data.product._keywords
      }
      if (categories.toLowerCase().includes('bière') || categories.toLocaleLowerCase().includes('beer')|| keywords.includes('biere') || keywords.includes('beer')) {
        res.json({ infos: response.data })
      } else {
        res.status(400).json('Ceci n\'est pas une bière')
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error)
    })
}
