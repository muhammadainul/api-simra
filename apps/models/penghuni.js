'use strict'

const {
  Model, Sequelize
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class penghuni extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
		static associate(models) {
			// define association here
			penghuni.belongsTo(models.users, { foreignKey: 'id_users' })
			penghuni.belongsTo(models.kamar, { foreignKey: 'id_kamar' })
		}
	}
	penghuni.init({ 
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},
		nik: DataTypes.INTEGER,
		jenis_kelamin: DataTypes.STRING,
		alamat: DataTypes.STRING,
		no_telepon: DataTypes.DECIMAL,
		id_users: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		id_kamar: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'kamar',
				key: 'id'
			}
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
		modelName: 'penghuni',
		freezeTableName: true
	})
	return penghuni
}