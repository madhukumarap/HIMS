const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const CommissionCodeData = sequelize.define("CommissionCodeData", {
    codeType: {
      type: DataTypes.STRING, // Assuming codeType is a string, adjust the type if needed
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING, // Assuming value is an integer, adjust the type if needed
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return CommissionCodeData;
};
