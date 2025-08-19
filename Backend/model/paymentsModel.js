const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define("Payments", {
    paymentID: {
      type: DataTypes.STRING,
    },
    paymentDate: {
      type: DataTypes.STRING,
    },
    admissionID: {
      type: DataTypes.INTEGER,
    },
    hospitalID: {
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    currency: {
      type: DataTypes.STRING,
    }
  });

  return Payments;
};
