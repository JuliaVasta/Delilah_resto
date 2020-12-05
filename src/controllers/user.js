const { Router } = require('express')

const db = require('../models')
const { secretKey } = require('../config')
const auth = require('../middlewares/auth')

const router = new Router()

router.get('/me', auth.auth, async (req, res) => {
  const { id } = req.user
  try {
    const user = await db.User.findOne({
      where: { id },
    })
    res.json({ ...user.toJSON(), password: undefined })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
