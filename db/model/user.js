const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db-config');

const User = sequelize.define('users', {
  id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true 
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  deletedAt: {
    type: Sequelize.DATE
  },
  });

module.exports = User