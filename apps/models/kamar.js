'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class kamar extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
		static associate(models) {
			// define association here
			kamar.hasOne(models.penghuni, { foreignKey: 'id_kamar' })
			kamar.belongsTo(models.asrama, { foreignKey: 'id_asrama' })
			kamar.belongsTo(models.lantai, { foreignKey: 'id_lantai' })
			kamar.belongsTo(models.gambar, { foreignKey: 'id_gambar' })
		}
	}
	kamar.init({
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},
		nama_kamar: DataTypes.STRING,
		kapasitas: DataTypes.INTEGER,
		status: DataTypes.INTEGER,
		id_asrama: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'asrama',
				key: 'id'
			}
		},
		id_lantai: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'lantai',
				key: 'id'
			}
		},
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
		created_at: {
			type: DataTypes.DATE,
			field: 'created_at'
		},
		updated_at: {
			type: DataTypes.DATE,
			field: 'updated_at'
		}
	}, {
	timestamps: false,
	sequelize,
	modelName: 'kamar',
	freezeTableName: true
	})
	return kamar
}