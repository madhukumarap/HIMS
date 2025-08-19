const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const CompanyRegistration = sequelize.define("CompanyRegistration", {
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industryType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registrationNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    // companyAdminEmail: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     isEmail: true,
    //   },
    // },
    PAN_TAN: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    landline: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return CompanyRegistration;
};
