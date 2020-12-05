const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.DECIMAL,
    },
    paymentMethodId: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  })

  Order.isValid = (order) => {
    const errors = []
    const valid =
      !!order.quantity && !!order.productId && !!order.paymentMethodId
    if (!order.productId) {
      errors.push('Product is required')
    }
    if (!order.quantity) {
      errors.push('Quantity is required')
    }
    if (!order.paymentMethodId) {
      errors.push('Payment method is required')
    }
    return [valid, errors.join(', ')]
  }

  Order.associate = (models) => {
    Order.hasMany(models.Product, {
      as: 'product',
      foreignKey: 'productId',
    })
    Order.hasOne(models.User, {
      as: 'user',
      foreignKey: 'userId',
    })
  }

  return Order
}
