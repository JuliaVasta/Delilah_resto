const { Router } = require('express')

const router = Router()

const db = require('../models')
const auth = require('../middlewares/auth')
const { authAdministrator } = require('../middlewares/auth')

router.get('/', async (req, res) => {
  try {
    const products = await db.Product.findAll()
    res.json(products)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
})

router.post('/', auth.auth, auth.authAdministrator, async (req, res) => {
  const { name, price, priceDiscount, picture } = req.body
  const params = {
    active: true,
    name,
    price,
    priceDiscount,
    picture,
  }
  const [valid, errors] = db.Product.isValid(params)
  if (!valid) {
    return res.status(400).json({ message: errors })
  }
  try {
    const product = await db.Product.create(params)
    return res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const product = await db.Product.findOne({
      where: { id },
    })

    if (!product) {
      return res.status(404).json({ message: 'Not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put('/:id', auth.auth, auth.authAdministrator, async (req, res) => {
  const { id } = req.params
  try {
    const { active, name, price, priceDiscount, picture } = req.body
    const params = {
      id,
      active,
      name,
      price,
      priceDiscount,
      picture,
    }
    const [valid, errors] = db.Product.isValid(params)
    if (!valid) {
      return res.status(400).json({ message: errors })
    }

    const product = await db.Product.findOne({
      where: { id },
    })
    if (!product) {
      return res.status(404).json({ message: 'Not found' })
    }

    await db.Product.update(params, { where: { id } })
    return res.send()
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete('/:id', auth.auth, auth.authAdministrator, async (req, res) => {
  const { id } = req.params
  try {
    const product = await db.Product.findOne({
      where: { id },
    })
    if (!product) {
      return res.status(412).json({ message: 'Product does not exist' })
    }
    await product.destroy()
    res.send()
  } catch (error) {
    res.json({ message: error.message })
  }
})

module.exports = router
