module.exports = (sequelize, DataTypes) => {
  const Inventry = sequelize.define("inventry", {
    SKU: {
      type: DataTypes.STRING,
    },
    itemName: {
      type: DataTypes.STRING,
    },
    composition: {
      type: DataTypes.TEXT("long"),
    },

    description: {
      type: DataTypes.TEXT("long"),
    },
    unitPrice: {
      type: DataTypes.FLOAT(5, 2), // 5 total digits with 2 decimal places
      allowNull: true,
    },
    batchNo: {
      type: DataTypes.STRING,
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
    },
    unit: {
      type: DataTypes.STRING,
    },
    dateIn: {
      type: DataTypes.DATEONLY,
    },
    quantityIn: {
      type: DataTypes.INTEGER,
    },
    dateOut: {
      type: DataTypes.DATEONLY,
    },
    quantityOut: {
      type: DataTypes.INTEGER,
    },
    balanceQuantity: {
      type: DataTypes.BIGINT,
    },
    AverageMonthlyQuantityOut: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    AverageWeeklyQuantityOut: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    Currency: {
      type: DataTypes.STRING,

      allowNull: false,
    },
  });

  return Inventry;
};
