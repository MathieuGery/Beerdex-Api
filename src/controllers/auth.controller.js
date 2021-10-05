'use strict'

const User = require('../models/user.model')
const Beer = require('../models/beer.model')
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


exports.connectedUserInfos = async (req, res, next) => {
  try {
    let resp = await User.findById(req.user._id)
    const user_beers = await Beer.find({ user_id: req.user._id }).exec()
    let user = JSON.stringify(resp)
    user = JSON.parse(user)
    let fav_beers = 0
    user_beers.forEach(element => {
      if (element.favorite)
        fav_beers++
    });
    user.favorite_beers = fav_beers
    user.total_scanned_beers = user_beers.length
    user.beers = user_beers
    return res.json({ message: 'OK', user})
  } catch (error) {
    next(error)
  }
}

exports.UserInfosById = async (req, res, next) => {
  try {
    let resp = await User.findById(req.params.id)
    const user_beers = await Beer.find({ user_id: req.params.id }).exec()
    let user = JSON.stringify(resp)
    user = JSON.parse(user)
    let fav_beers = 0
    user_beers.forEach(element => {
      if (element.favorite)
        fav_beers++
    });
    user.favorite_beers = fav_beers
    user.total_scanned_beers = user_beers.length
    user.beers = user_beers
    return res.json({ message: 'OK', user})
  } catch (error) {
    next(error)
  }
}

exports.editInfos = async (req, res, next) => {
  try {
    const resp = await User.findById(req.user._id)
    let userInfos = JSON.parse(JSON.stringify(resp))
    const fields = ['location', 'name', 'country', 'description', 'image', 'notifications']
    fields.forEach((field) => {
      if (req.body[field] || field === 'notifications')
        userInfos[field] = req.body[field]
    })
    let user = await User.findByIdAndUpdate(req.user._id, userInfos, {new: true})
    return res.json({ message: 'OK', user})
  } catch (error) {
    next(error)
  }
}

exports.listBeersConnectedUser = async (req, res, next) => {
  try {
    let resp = await User.findById(req.user._id)
    return res.json({message: 'OK', nb_beers: (resp.beers).length, user_beers: resp.beers})
  } catch (error) {
    next(error)
  }
}
