const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Pharmacist = sequelize.define("pharmacist", {
    username: {
      type: DataTypes.STRING,
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    MiddleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNo: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: false,
    },

    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  return Pharmacist;
};
