'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.addColumn('users', 'type', {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    queryInterface.addColumn('users', 'password', {
        type: Sequelize.STRING,
        allowNull: false
      }
    )
  )
  ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users','type'),
      queryInterface.removeColumn('users','password') 
    ])
  }
};
