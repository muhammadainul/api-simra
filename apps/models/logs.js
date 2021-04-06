'use strict'
const {
  Model, Sequelize
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class logs extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	static associate(models) {
		// define association here
	}
	}
	logs.init({
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},
		ipaddress: DataTypes.STRING,
		browser: DataTypes.STRING,
		browser_version: DataTypes.STRING,
		os: DataTypes.STRING,
		logtime: DataTypes.DATE,
		logdetail: DataTypes.STRING,
		hostname: DataTypes.STRING,
		id_users: {
			type: DataTypes.UUID,
			allowNull: true, 
			references: {
				model: 'users',
				id: 'key'
			}
		}
		}, {
		timestamps: false,
		sequelize,
		modelName: 'logs',
		freezeTableName: true
	})
	return logs
}