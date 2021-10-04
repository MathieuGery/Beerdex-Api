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
    let resp = await Beer.findById(req.params.id).catch(() => { res.status(400)
      return res.json({message: 'Beer not found'})})
    console.log(req.body.favorite)
    if (resp.user_id != req.user._id) {
      res.status(401)
      return res.json({message: 'Not authorized'})
    }
    if (req.body.comment)
      resp.comment = req.body.comment
    if (req.body.rating)
      resp.rating = req.body.rating
    if (req.body.favorite == false || req.body.favorite)
      resp.favorite = req.body.favorite
    let result = await Beer.findByIdAndUpdate(req.params.id, {$set: resp}, {new: true})
    return res.json({message: 'OK', user_beers: result})
  } catch (error) {
    next(error)
  }
}
