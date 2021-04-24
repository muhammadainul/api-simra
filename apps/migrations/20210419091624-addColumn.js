'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await [
			queryInterface.addColumn('reservasi', 'tgl_cekin', {
				type: Sequelize.DATEONLY,
				allowNull: true,
				defaultValue: null
			}),
			queryInterface.addColumn('reservasi', 'tgl_cekout', {
				type: Sequelize.DATEONLY,
				allowNull: true,
				defaultValue: null
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
  }
};
