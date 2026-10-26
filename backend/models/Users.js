'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Tickets, {
        foreignKey: "userId",
        as: "creator"
      })
      Users.hasOne(models.Agents, {
        foreignKey: "userId",
        as: "agentProfile"
      })
    }
  }
  Users.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    roles: {
      type: DataTypes.ENUM('user', 'agent', 'admin'),
      defaultValue: "user"
    },
    status: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: null,
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};