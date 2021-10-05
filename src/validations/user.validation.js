'use strict'

const Joi = require('joi')

// User validation rules
module.exports = {
  create: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128).required()
    }
  },
  edit: {
    body: {
      name: Joi.string().max(128),
      description: Joi.string().max(280),
      location: Joi.string().max(50),
      country: Joi.string().max(30),
      notifications: Joi.boolean()
    }
  }
}
