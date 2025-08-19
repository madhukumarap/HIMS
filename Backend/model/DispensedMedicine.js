module.exports = (sequelize, DataTypes) => {
  const DispensedMedicine = sequelize.define("dispensedMedicine", {
    PatientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patient_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prescription_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DispenseID: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    DispenseTableID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MedicineName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    BatchNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    UnitPrice: {
      type: DataTypes.FLOAT(5, 2), // 5 total digits with 2 decimal places
      allowNull: true,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    EachmedicineCost: {
      type: DataTypes.FLOAT(5, 2), // 5 total digits with 2 decimal places
      allowNull: true,
    },
    EachMedicineCurrency: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  });
  return DispensedMedicine;
};
