'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class gambar extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	static associate(models) {
		// define association here
	}
	};
	gambar.init({
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},
		originalname: DataTypes.STRING,
		encoding: DataTypes.STRING,
		mimetype: DataTypes.STRING,
		destination: DataTypes.STRING,
		filename: DataTypes.STRING,
		path: DataTypes.STRING,
		size: DataTypes.STRING,
		is_deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		created_at: DataTypes.DATE,
		updated_at: DataTypes.DATE
		}, {
		sequelize,
		timestamps: false,
		modelName: 'gambar',
		freezeTableName: true
	})
	return gambar
}