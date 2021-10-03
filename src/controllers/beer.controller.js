'use strict'
const axios = require('axios')
const config = require('../config')
const checkBeerValidity = require('../utils/checkBeerValidity')
const httpStatus = require('http-status')
const Beer = require('../models/beer.model')

exports.get_beer_infos = async (req, res) => {
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
      if(checkBeerValidity.checkBeerValidity(response.data.product.brands_tags) || categories.toLowerCase().includes('bière') || categories.toLowerCase().includes('beer') || keywords.includes('biere') || keywords.includes("bierre")) {
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

exports.addBeer = async (req, res, next) => {
  try {
    let resp = await User.findByIdAndUpdate(req.user._id, {$push: {beers: req.body.beer}}, {new: true})
    console.log(resp)
    return res.json({message: 'OK', user_beers: resp.beers})
  } catch (error) {
    next(error)
  }
}

exports.addBeer2 = async (req, res, next) => {
  try {
    const body = req.body
    body.user_id = req.user._id
    const beer = new Beer(req.body)
    const savedBeer = await beer.save()
    res.status(httpStatus.CREATED)
    res.send(savedBeer.transform())
  } catch (error) {
    return next(error)
  }
}

exports.editBeer = async (req, res, next) => {
  try {
    let found = false
    let resp = await User.findById(req.user._id)
    resp.beers.filter(function(item) { if (item.code === parseInt(req.params.id)) {
      if (req.body.beer.comment)
        item.comment = req.body.beer.comment
      if (req.body.beer.rating)
        item.rating = req.body.beer.rating
      found = true
    }});
    if (found)
     await User.findByIdAndUpdate(req.user._id, {$set: {beers: resp.beers}}, {new: true})
    return res.json({message: 'OK', user_beers: resp.beers})
  } catch (error) {
    next(error)
  }
}
