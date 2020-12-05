// 'use strict';
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role: {
      type: DataTypes.ENUM('regular', 'admin'),
      defaultValue: 'regular',
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  })

  User.isValid = (user) => {
    const errors = []
    const valid =
      !!user &&
      !!user.username &&
      !!user.email &&
      !!user.password &&
      !!user.phone
    if (!user.username) {
      errors.push('Username is required')
    }
    if (!user.email) {
      errors.push('Email is required')
    }
    if (!user.password) {
      errors.push('Password is required')
    }
    if (!user.phone) {
      errors.push('Phone is required')
    }
    return [valid, errors.join(', ')]
  }

  User.associate = (models) => {
    Order.hasMany(models.Order, {
      as: 'order',
      foreignKey: 'userId',
    })
  }

  return User
}
