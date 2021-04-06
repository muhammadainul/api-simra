'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
	await queryInterface.createTable('users', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: Sequelize.UUID
		},
		username: {
			type: Sequelize.STRING
		},
		password: {
			type: Sequelize.STRING
		},
		enabled: {
			type: Sequelize.INTEGER
		},
		nama_lengkap: {
			type: Sequelize.STRING
		},
		nip: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING
		},
		kewenangan_id: {
			type: Sequelize.UUID,
			allowNull: true,
			references: {
				model: 'kewenangan',
				key: 'id'
			}
		},
		id_token: {
			type: Sequelize.UUID,
			allowNull: true,
			references: {
				model: 'token',
				key: 'id'
			}
		},
		is_verified: {
			type: Sequelize.BOOLEAN
		},
		is_deleted: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},
		created_at: Sequelize.DATE,
		updated_at: Sequelize.DATE
	})
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('users')
	}
} 