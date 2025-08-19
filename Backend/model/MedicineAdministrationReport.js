
module.exports = (sequelize, DataTypes) => {


  const MedicineAdministrationReport = sequelize.define('medicineAdministrationReport', {

    DispeningId: {
      type: DataTypes.STRING,
      allowNull: false

    },
    DispensationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    MedicineName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PatientId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Unit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PrescriptionId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PrescriptionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    PrescribedDoctor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PatientName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
  return MedicineAdministrationReport;


}