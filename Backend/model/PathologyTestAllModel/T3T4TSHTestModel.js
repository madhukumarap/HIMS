const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const T3T4TSHPathologyTest = sequelize.define("T3T4TSHPathologyTest", {
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
    T3_Tri_iodothyronine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    T4_Thyroxine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TSH_Thyroid_Stimulating_Hormone: {
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

  return T3T4TSHPathologyTest;
};
