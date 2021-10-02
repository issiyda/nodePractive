// Sequelize 本体
const Sequelize = require('sequelize');        
// 接続先の設定
const dbConfig = require('./db-config');       

/**
 * フロントエンドに返却するクエリ実行結果
 */
let result = {
  status: null,
  record: null,
  message: ""
};

/**
 * クエリ実行結果を初期化する
 */
const initializeResult = () => {
      result.status = null,
      result.record = null,
      result.message = ""
};

const setResult = (status, record, message) => {
  initializeResult();
  result.status = status;
  if (record) {
    result.record = record;
  } else {
    result.message = message;
  }

  return result;
};

/** 
 * コンストラクタ
 */
const DbClient = () => {
  // db access
  dbConfig
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
}

// 中略

module.exports = DbClient;