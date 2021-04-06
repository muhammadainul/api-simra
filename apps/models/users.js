'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class users extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
		static associate(models) {
			// define association here
			users.hasOne(models.penghuni, { foreignKey: 'id_users', as: 'userDetail' })
		}
	}
	users.init({
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		enabled: DataTypes.INTEGER,
		nama_lengkap: DataTypes.STRING,
		nip: DataTypes.STRING,
		email: DataTypes.STRING,
		kewenangan_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'kewenangan',
				key: 'id'
			}
		},
		id_token: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'token',
				key: 'id'
			}
		},
		is_verified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		createdAt: { 
			type: DataTypes.DATE,
			field: 'created_at'
		},
		updatedAt: { 
			type: DataTypes.DATE,
			field: 'updated_at'
		}
		}, {
		sequelize,
		modelName: 'users'
	})
	return users
}