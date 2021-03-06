'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class asset extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	static associate(models) {
		// define association here
		asset.belongsTo(models.kategori_asset, { foreignKey: 'id_kategori' })
		asset.belongsTo(models.gambar, { foreignKey: 'id_gambar' })
		asset.belongsTo(models.kamar, { foreignKey: 'id_kamar' })
		asset.belongsTo(models.asrama, { foreignKey: 'id_asrama' })
	}
	};
	asset.init({
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},
		nama_asset: DataTypes.STRING,
		id_kategori: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'kategori_asset',
				key: 'id'
			}
		},
		id_gambar: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'gambar',
				id: 'id'
			}
		},
		id_kamar: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'kamar',
				id: 'id'
			}
		},
		id_asrama: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'asrama',
				id: 'id'
			}
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		created_at: { 
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('now')
		},
		updated_at: { 
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('now')
		},
	}, {
		timestamps: false,
		sequelize,
		modelName: 'asset',
		freezeTableName: true
	})
	return asset
}