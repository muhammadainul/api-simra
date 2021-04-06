'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reservasi', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      id_reservasi: {
        type: Sequelize.STRING
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
      id_penghuni: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'penghuni',
          id: 'id'
        }
      },
      tgl_reservasi: Sequelize.DATE,
	    tgl_cekin: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
		  },
      tgl_cekout: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      status: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('reservasi');
  }
};