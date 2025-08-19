const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const PlateletCountTestModel = sequelize.define("PlateletCountTestModel", {
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
    Platelet_Count: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Smear_Examination: {
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
  });

  return PlateletCountTestModel;
};
