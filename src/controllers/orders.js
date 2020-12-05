const { Router } = require('express')

const router = Router()

const db = require('../models')
const { auth, authAdministrator } = require('../middlewares/auth')

const orderStatuses = {
  pending: 'PENDING',
  delivered: 'DELIVERED',
}

const paymentMethodIds = {
  cash: 'CASH',
  creditCard: 'CREDIT_CARD',
}

router.get('/', auth, authAdministrator, async (req, res) => {
  try {
    const orders = await db.Order.findAll()
    res.json(orders)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
})

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  try {
    const order = await db.Order.findOne({
      where: { id },
    })
    if (!order) {
      return res.status(404).json({ message: 'Not found' })
    }
    if (order.userId !== userId) {
      return status(403).json({ message: 'You have no access.' })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { quantity, paymentMethodId, productId } = req.body
    const [valid, message] = db.Order.isValid({
      quantity,
      paymentMethodId,
      productId,
    })
    if (!valid) {
      return res.status(400).json({ message })
    }

    const product = await db.Product.findByPk(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    const order = await db.Order.create({
      quantity,
      price: product.price,
      paymentMethodId,
      status: orderStatuses.pending,
      productId,
      userId: req.user.id,
    })
    return res.status(201).json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.post('/:id/status', auth, authAdministrator, async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  if (!Object.values(orderStatuses).includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' })
  }

  try {
    const order = await db.Order.findOne({
      where: { id },
    })
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }
    await db.Order.update(
      {
        status,
      },
      { where: { id } }
    )
    res.send()
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete('/:id', auth, authAdministrator, async (req, res) => {
  const { id } = req.params
  try {
    const order = await db.Order.findOne({
      where: { id },
    })
    if (!order) {
      return res.status(412).json({ message: 'Order does not exist' })
    }
    await order.destroy()
    res.send()
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
