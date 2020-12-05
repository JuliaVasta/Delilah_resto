const jwt = require('jsonwebtoken')

const { secretKey } = require('../config')
const db = require('../models')

const auth = async (req, res, next) => {
  const authorization = req.header('Authorization')
  if (!authorization) {
    res.status(403).json({ message: 'Authorization token is required.' })
    return
  }
  const token = authorization.replace('Bearer ', '')
  try {
    const data = jwt.verify(token, secretKey)
    const user = await db.User.findByPk(data.id)
    if (!user || user.active === false) {
      return res.status(401).send()
    }
    req.user = user
    req.token = token
    next()
  } catch (error) {
    const json = { message: 'Not authorized to access this resource' }
    return res.status(401).json(json)
  }
}

const authAdministrator = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      next()
    } else {
      throw Error('It is not an admin')
    }
  } catch (error) {
    const json = { message: 'Not authorized to access this resource' }
    return res.status(401).json(json)
  }
}

module.exports = { auth, authAdministrator }
