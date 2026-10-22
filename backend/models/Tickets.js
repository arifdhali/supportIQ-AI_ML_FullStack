const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tickets.belongsTo(models.Users, {
        foreignKey: "customerId",
        as: 'tickets',
      })

      Tickets.belongsTo(models.Departments, {
        foreignKey: "department_id",
        as: "ticket_department"
      })

      Tickets.hasMany(models.Assignments, {
        foreignKey: 'ticket_id',
        as: 'assignments',
      })


    }
  }
  Tickets.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    subject: DataTypes.STRING,
    descriptions: DataTypes.STRING,
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Tickets',
  });
  return Tickets;
};