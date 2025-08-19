const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define("Doctor", {
    Dr: {
      type: DataTypes.STRING,

      defaultValue: "DR", // Set the default value to 'DR'
    },
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
    registrationNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNo: {
      type: DataTypes.BIGINT,
      unique: false,
      allowNull: true,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    signatureImage: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    consultationFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: 0,
      },
    },
    consultationCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "INR",
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
  });

  return Doctor;
};
