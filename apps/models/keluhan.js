'use strict'
const {
  Model, Sequelize
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class keluhan extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	static associate(models) {
		// define association here
	}
	}
	keluhan.init({
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},
		nama: DataTypes.STRING,
		keluhan: DataTypes.STRING,
		status: DataTypes.INTEGER,
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
		is_deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		created_at: DataTypes.DATE,
		updated_at: DataTypes.DATE
		}, {
		sequelize,
		modelName: 'keluhan',
		freezeTableName: true
	})
	return keluhan
}