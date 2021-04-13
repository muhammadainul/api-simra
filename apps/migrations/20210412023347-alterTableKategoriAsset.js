'use strict';

const { now } = require("sequelize/types/lib/utils");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await [
      queryInterface.changeColumn('kategori_asset', 'createdAt', {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.fn('now')
      }),
      queryInterface.changeColumn('kategori_asset', 'updatedAt', {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.fn('now')
      })
    ]
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await [
      queryInterface.changeColumn('kategori_asset', 'created_at', {
        defaultValue: new Date()
      }),
      queryInterface.changeColumn('kategori_asset', 'updated_at', {
        defaultValue: new Date()
      })
    ]
  }
};
