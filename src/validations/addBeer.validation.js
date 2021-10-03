'use strict'

const Joi = require('joi')

// User validation rules
module.exports = {
  addBeer: {
    body: {
      beer: {
        code: Joi.number().required(),
        rating: Joi.number().min(0).max(5).required(),
        comment: Joi.string().max(280).required(),
        favorite: Joi.boolean().required()
      }
    }
  }
}
