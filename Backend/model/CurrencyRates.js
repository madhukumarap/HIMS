const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const CurrencyRate = sequelize.define("CurrencyRate", {
    Currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CurrencyResponse: {
      type: DataTypes.JSON, // Use JSON for storing JSON data
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return CurrencyRate;
};
