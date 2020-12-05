const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    priceDiscount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  })

  Product.isValid = (product) => {
    const errors = []
    const valid = !!product && !!product.name && !!product.price
    if (!product.name) {
      errors.push('Name is required')
    }
    if (!product.price) {
      errors.push('Price is required')
    }
    return [valid, errors.join(', ')]
  }

  Product.associate = (models) => {
    Product.hasMany(models.Order, {
      as: 'order',
      foreignKey: 'productId',
    })
  }

  return Product
}
