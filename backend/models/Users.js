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
      Users.hasMany(models.tickets, {
        foreignKey: "userId",
        as: "creator"
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
      unique: trueF
    },
    password: DataTypes.STRING,
    photo: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    roles: {
      type: DataTypes.ENUM('user', 'agent', 'admin'),
      defaultValue: "user"
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};