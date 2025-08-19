module.exports = (sequelize, DataTypes) => {
  const PatientPrescription = sequelize.define("patientPrecription", {
    prescriptionId: {
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
    PatientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumberP: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PrescribedDoctor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RegistrationNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PhoneNo: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    DoctorEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AppointBookingID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    socialLifestyle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foodHabits: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    medicalHistory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    allergies: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clinicalDiagnosis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prescribeMedicineQuantity: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
    DispensedMedicineQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pharmacistRemark: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    bloodPressure: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    respiratoryRate: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    heartRate: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    temperature: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    familyDetails: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    revisitDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    revisit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailSentStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailSentDetails: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return PatientPrescription;
};
