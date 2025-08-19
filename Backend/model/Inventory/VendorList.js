const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define("Vendor", {
    vendorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    panNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    bankDetails: {
      type: DataTypes.STRING, // Adjust the type as needed
      allowNull: true, // Adjust the nullability as needed
    },

    contactPerson: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    govtRegDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    receiveDonation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  });

  return Vendor;
};
