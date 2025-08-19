const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Hospital = sequelize.define("Hospital", {
    hospitalName: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    pincode: {
      type: DataTypes.STRING,
    },
    registrationNo: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    hospitalAdminEmail: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.BIGINT,
    },

    landline: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
      allownull: true,
    },
    countryCode: {
      type: DataTypes.STRING,
      allownull: false,
    },
    HospitalUserName: {
      type: DataTypes.STRING,
      allownull: true,
      unique: true,
    },
    HospitalID_MainDatabase: {
      type: DataTypes.INTEGER,
      allownull: true,
      unique: true,
    },
    HospitalGUID: {
      type: DataTypes.STRING,
      allownull: true,
      unique: true,
    },
    baseCurrency: {
      type: DataTypes.STRING,
      allownull: true,
      defaultValue: "INR",
    },
    baseCurrencyStatus: {
      type: DataTypes.STRING,
      allownull: false,
      defaultValue: "default",
    },
    OptionalCurrency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    securityDeposit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    patientRegistrationFee: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 0,
    },
    patientRegistrationCurrency: {
      type: DataTypes.STRING,
      allowNull: true,
      default: "INR",
    },
  });

  return Hospital;
};
