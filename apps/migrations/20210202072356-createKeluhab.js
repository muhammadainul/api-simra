'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('keluhan', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      nama: {
        type: Sequelize.STRING
      },
      keluhan: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      id_asrama: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'asrama',
          id: 'id'
        }
      },
      id_kamar: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'kamar',
          id: 'id'
        }
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('keluhan');
  }
};