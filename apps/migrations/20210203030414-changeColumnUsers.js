'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('users', 'kewenangan_id', { 
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
				model: 'kewenangan',
				key: 'id'
			}
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('users', 'kewenangan_id', { 
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
				model: 'kewenangan',
				key: 'id'
			}
    })
  }
};
