const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const HospitalAdminRegistration = sequelize.define(
    "HospitalAdminRegistration",
    {
      username: {
        type: DataTypes.STRING,
      },
      hospitalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
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
    }
  );

  return HospitalAdminRegistration;
};
