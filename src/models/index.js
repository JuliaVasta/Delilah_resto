const { Sequelize, DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')

const User = require('./user')
const Order = require('./order')
const Product = require('./product')
const { databaseUrl, passwordSuper } = require('../config')

const sequelize = new Sequelize(databaseUrl)

const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize

db.User = User(sequelize)
db.Product = Product(sequelize)
db.Order = Order(sequelize)

db.User.sync({ alter: true })
db.Product.sync({ alter: true })
db.Order.sync({ alter: true })

const authenticate = async () => {
  console.log('Trying to connect to database ...')
  try {
    await sequelize.authenticate()
    const password = await bcrypt.hash(passwordSuper, 6)
    const user = await db.User.findOne({ where: { role: 'admin' } })
    if (!user) {
      await db.User.create({
        address: '',
        phone: '',
        name: 'Admin',
        username: 'admin',
        email: 'test@test.com',
        role: 'admin',
        password,
      })
    }
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

authenticate()

module.exports = db
