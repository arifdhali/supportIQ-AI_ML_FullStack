'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assignments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Assignments.belongsTo(models.Tickets, {
        foreignKey: 'ticket_id',
        as: 'ticket',
      });
      Assignments.belongsTo(models.Agents, {
        foreignKey: 'agent_id',
        as: 'agent',
      });
    }
  }
  Assignments.init({
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assigned_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Assignments',
  });
  return Assignments;
};