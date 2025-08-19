const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const BloodSugerForPP = sequelize.define("BloodSugerForPP", {
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
    Chloride: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Colour: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Appearance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Coagulum: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Blood: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Proteins: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    Total_W_B_C_Count: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Polymorphs: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Lymphocytes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RBC_S: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Z_N_Stain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Cram_s_Smear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Sugar: {
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

  return BloodSugerForPP;
};
