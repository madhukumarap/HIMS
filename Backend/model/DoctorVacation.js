const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const DoctorVacation = sequelize.define(
    "DoctorVacation",
    {
      doctorId: {  
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      doctorEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "doctor_vacations",
    }
  );

  return DoctorVacation;
};
