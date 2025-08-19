const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const CreateVaccinationPatient = sequelize.define(
    "CreateVaccinationPatient",
    {
      motherName: {
        type: DataTypes.STRING,
      },
      babyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vaccinationRegNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      fatherName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.BIGINT,
        unique: false,
        //allowNull: true,
      },

      ageOption: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }
  );

  return CreateVaccinationPatient;
};
