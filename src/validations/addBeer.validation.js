'use strict'

const Joi = require('joi')

// User validation rules
module.exports = {
  beer: {
    body: {
      beer: {
        code: Joi.number().required(),
        rating: Joi.number().min(0).max(4).required(),
        comment: Joi.string().max(280).required()
      }
    }
  }
}
