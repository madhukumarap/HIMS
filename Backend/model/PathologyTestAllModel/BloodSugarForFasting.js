const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const BloodSugarForFastingModel = sequelize.define(
    "BloodSugarForFastingModel",
    {
      PatientID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TestManagementID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      PatientTestBookingID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Urine_Sugar: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Urine_Acetone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Post_Lunch_Blood_Sugar: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      resultDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      Remarks: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },

      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    }
  );

  return BloodSugarForFastingModel;
};
