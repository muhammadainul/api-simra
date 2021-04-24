'use strict'
const {
  Model, Sequelize
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class reservasi extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	static associate(models) {
		// define association here
		reservasi.belongsTo(models.asrama, { foreignKey: 'id_asrama' })
		reservasi.belongsTo(models.kamar, { foreignKey: 'id_kamar' })
		reservasi.belongsTo(models.penghuni, { foreignKey: 'id_penghuni' })
	}
	};
	reservasi.init({
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},
		id_reservasi: DataTypes.STRING,
		id_asrama: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'asrama',
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
		id_penghuni: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'penghuni',
				id: 'id'
			}
		},
		tgl_reservasi: DataTypes.DATE,
		tgl_cekin: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null
		},
		tgl_cekout: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null
		},
		status: DataTypes.INTEGER,
		is_deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		created_at: DataTypes.DATE,
		updated_at: DataTypes.DATE
		}, {
		sequelize,
		modelName: 'reservasi',
		freezeTableName: true,
		timestamps: false
	})
	return reservasi
}