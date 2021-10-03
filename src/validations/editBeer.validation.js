'use strict'

const Joi = require('joi')

// User validation rules
module.exports = {
  editBeer: {
    body: {
      beer: {
        rating: Joi.number().min(0).max(5),
        comment: Joi.string().max(280)
      }
    }
  }
}
