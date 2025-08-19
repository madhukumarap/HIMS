module.exports = (sequelize, DataTypes) => {
  const DispensedReport = sequelize.define("dispensedReport", {
    PatientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patient_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DispenseID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prescription_Id: {
      type: DataTypes.INTEGER, //prescription table patient id
      allowNull: false,
    },
    PrescriptionID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PrescriptionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    PriscribedDoctor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PrescriptionType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prescriptionImage: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    DoctorRegNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalMedicineAmount: {
      type: DataTypes.FLOAT(5, 2), // 5 total digits with 2 decimal places
      allowNull: true,
    },
    TotalFees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    Currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return DispensedReport;
};
