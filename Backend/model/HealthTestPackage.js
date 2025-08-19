const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const HealthTestPackageModel = sequelize.define("healthtestpackagemodel", {
    packageName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    MRPOfPackage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    finalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return HealthTestPackageModel;
};
