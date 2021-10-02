'use strict'

const Joi = require('joi')

// User validation rules
module.exports = {
  beer: {
    body: {
      product_id: Joi.number().required()
    }
  }
}