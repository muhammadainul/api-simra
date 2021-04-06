'use strict'
const {
  Model, Sequelize
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class kategori_asset extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	static associate(models) {
		// define association here
	}
	};
	kategori_asset.init({
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},
		nama_kategori: DataTypes.STRING,
		deskripsi: DataTypes.STRING,
		is_deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		created_at: DataTypes.DATE,
		updated_at: DataTypes.DATE
		}, {
		sequelize,
		modelName: 'kategori_asset',
		freezeTableName: true
	})
	return kategori_asset
}