const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const CorporatePatientListPackage = sequelize.define(
    "corporatepatientListpackage",
    {
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
      finalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      PackageID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      PatientID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      PatientPhone: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      PatientName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PatientCorporateID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }
  );

  return CorporatePatientListPackage;
};
