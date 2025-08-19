const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const pathologistTestBookingAppointment = sequelize.define(
    "pathologistTestBookingAppointment",
    {
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      PatientName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PatientPhone: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      testManagementID: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      remarks: {
        type: DataTypes.TEXT,
      },
    }
  );

  return pathologistTestBookingAppointment;
};
