'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Agents.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "user"
      })

      Agents.belongsTo(models.Departments, {
        foreignKey: "department_id",
        as: "department"
      })
    }
  }
  Agents.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Agents',
  });
  return Agents;
};