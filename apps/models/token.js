'use strict'

const { Model, Sequelize } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class token extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
		static associate(models) {
			// define association here
		}
	}
	token.init({
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},
		token: DataTypes.STRING,
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
	modelName: 'token',
	freezeTableName: true
	})
	return token
}