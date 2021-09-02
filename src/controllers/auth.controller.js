'use strict'

const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const config = require('../config')
const httpStatus = require('http-status')
const uuidv1 = require('uuid/v1')

exports.register = async (req, res, next) => {
  try {
    const activationKey = uuidv1()
    const body = req.body
    body.activationKey = activationKey
    const user = new User(body)
    const savedUser = await user.save()
    res.status(httpStatus.CREATED)
    res.send(savedUser.transform())
  } catch (error) {
    return next(User.checkDuplicateEmailError(error))
  }
}

exports.login = async (req, res, next) => {
  try {
    const user = await User.findAndGenerateToken(req.body)
    const payload = {sub: user.id}
    const token = jwt.sign(payload, config.secret)
    return res.json({ message: 'OK', token: token })
  } catch (error) {
    next(error)
  }
}

exports.confirm = async (req, res, next) => {
  try {
    await User.findOneAndUpdate(
      { 'activationKey': req.query.key },
      { 'active': true }
    )
    return res.json({ message: 'OK' })
  } catch (error) {
    next(error)
  }
}

exports.addBeer = async (req, res, next) => {
  let user = req.user
  console.log(user)
  if (!req.body.code) {
    res.status(400).json('No beer id specified')
  } else if (!/^\d+$/.test(req.body.code.code)) {
    return res.status(400).json('Wrong bar code specified')
  }
  try {
    let resp = await User.findByIdAndUpdate(req.user._id, {$push: {beers: req.body.code}}, {new: true})
    return res.json({message: 'OK', user: resp})
  } catch (error) {
    next(error)
  }
}
