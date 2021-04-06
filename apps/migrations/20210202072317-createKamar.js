'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('kamar', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
        },
      nama_kamar: {
        type: Sequelize.STRING
      },
      kapasitas: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      id_asrama: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'asrama',
          key: 'id'
        }
      },
      id_lantai: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'lantai',
          key: 'id'
        }
      },
      id_gambar: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'gambar',
          key: 'id'
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
    await queryInterface.dropTable('kamar');
  }
};