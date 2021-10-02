const Sequelize = require('sequelize');
require('dotenv').config();

/**
 * company に対する接続設定を定義
 */
const sequelize = new Sequelize(process.env.LOCAL_DB_NAME, process.env.LOCAL_DB_USER, process.env.LOCAL_DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  port: process.env.LOCAL_DB_PORT
});

module.exports = sequelize;