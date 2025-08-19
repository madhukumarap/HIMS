const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Diagnostics_package = sequelize.define("diagnostics_package", {
    packageName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    MRPOfPackage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    finalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return Diagnostics_package;
};
