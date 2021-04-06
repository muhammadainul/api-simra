'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class asrama extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
		static associate(models) {
			// define association here
			asrama.hasMany(models.kamar, { foreignKey: 'id_asrama' })
			asrama.belongsTo(models.gambar, { foreignKey: 'id_gambar', as: 'files' })
		}
	}
		asrama.init({
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},
		nama_asrama: DataTypes.STRING,
		jumlah_kamar: DataTypes.INTEGER,
		jumlah_lantai: DataTypes.INTEGER,
		fasilitas: DataTypes.STRING,
		id_gambar: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'gambar',
				key: 'id'
			}
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		created_at: DataTypes.DATE,
		updated_at: DataTypes.DATE
		}, {
		sequelize,
		timestamps: false,
		modelName: 'asrama',
		freezeTableName: true
		})
		return asrama
}