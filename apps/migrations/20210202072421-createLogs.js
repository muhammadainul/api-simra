'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('logs', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      ipaddress: {
        type: Sequelize.STRING
      },
      browser: {
        type: Sequelize.STRING
      },
      browser_version: {
        type: Sequelize.STRING
      },
      os: {
        type: Sequelize.STRING
      },
      logdetail: {
        type: Sequelize.STRING
      },
      hostname: {
        type: Sequelize.STRING
      },
      id_users: {
        type: Sequelize.UUID,
        allowNull: true, 
        references: {
          model: 'users',
          id: 'key'
        }
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('logs')
  }
}