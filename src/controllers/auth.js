const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const db = require('../models')
const { secretKey } = require('../config')

const router = Router()

const error = 'Invalid credentials.'

router.post('/signin', async (req, res) => {
  try {
    const { username = '', email = '', password } = req.body
    if (!username && !email) {
      return res.status(400).json({ message: 'Username or email is required.' })
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }
    const credentials = []
    if (username) {
      credentials.push({ username })
    }
    if (email) {
      credentials.push({ email })
    }
    const user = await db.User.findOne({
      where: {
        [Op.or]: credentials,
        active: true,
      },
    })
    if (!user) {
      return res.status(404).send({ message: 'User not found' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return res.status(403).json({ message: 'Credentials are not valid' })
    }
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey)
    res.json({ token, id: user.id, username: user.username, email })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/signup', async (req, res) => {
  const { email, username, name, phone, address, password } = req.body
  const params = {
    active: true,
    email,
    username,
    phone,
    address,
    password,
  }
  const [valid, errors] = db.User.isValid(params)
  if (!valid) {
    return res.status(400).json({ message: errors })
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 6)
    const user = await db.User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    })
    if (!user) {
      const { id } = await db.User.create({
        ...params,
        password: hashedPassword,
      })
      const token = jwt.sign({ id, username }, secretKey)
      return res.status(201).json({ token })
    } else {
      return res.status(412).json({ message: 'User already exists.' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
