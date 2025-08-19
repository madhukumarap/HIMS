const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const HospitalMain = sequelize.define("HospitalMain", {
    hospitalName: {
      type: DataTypes.STRING,
      unique: true,
    },
    hospitalURL: {
      type: DataTypes.STRING,
    },
    HospitalGUID: {
      type: DataTypes.STRING,
      allownull: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allownull: true,
      unique: true,
    },
    databaseName: {
      type: DataTypes.STRING,
      allownull: true,
      unique: true,
    },
    allowed_users: {
      type: DataTypes.INTEGER,
      allowNull: false, // Mandatory field
      validate: {
        min: 1, // Ensure number is at least 1
      },
    },
  });
  //
  return HospitalMain;
};
