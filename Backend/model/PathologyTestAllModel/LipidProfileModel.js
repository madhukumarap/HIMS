const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const LipidProfileModel = sequelize.define("LipidProfileModel", {
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
    Sr_Cholesterol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    HDL_Cholesterol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Sr_Triglycerides: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LDL_Cholesterol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    VLDL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Cholesterol_HDL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LDL_HDL: {
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

  return LipidProfileModel;
};
