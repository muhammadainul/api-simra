'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('asrama', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4
		},
		nama_asrama: {
			type: Sequelize.STRING
		},
		jumlah_kamar: {
			type: Sequelize.INTEGER
		},
		jumlah_lantai: {
			type: Sequelize.INTEGER
		},
		fasilitas: {
			type: Sequelize.STRING
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
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('asrama')
  }
}