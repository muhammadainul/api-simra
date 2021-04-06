'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('asset', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4
		},
		nama_asset: {
			type: Sequelize.STRING
		},
		id_kategori: {
			type: Sequelize.UUID,
			allowNull: true,
			references: {
				model: 'kategori_asset',
				key: 'id'
			}
		},
		id_gambar: {
			type: Sequelize.UUID,
			allowNull: true,
			references: {
				model: 'gambar',
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
		id_asrama: {
			type: Sequelize.UUID,
			allowNull: true,
			references: {
				model: 'asrama',
				id: 'id'
			}
		},
		is_deleted: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: false
		}
	});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('asset')
  }
}