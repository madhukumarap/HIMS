const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const HospitalAdmission = sequelize.define("HospitalAdmission", {
    PatientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PatientID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    AdmissionDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PatientPhoneNo: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    AdmittingPhysician: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AdmittingPhysicianPhone: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    AdmittingPhysicianID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ReferringPhysician: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ReferringPhysicianPhone: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    ReferringPhysicianID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ReasonForAdmission: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AdvanceAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    DueAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    TotalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    TotalExpense: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    TotalAdvance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PaymentOption: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PaymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PaymentDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AdmissionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PaymentType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PreviousHospitalizations: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ChronicConditions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TreatmentPlan: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    Medications: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RoomNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BedNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BedType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CheckInTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CheckOutTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patientCondition: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    BillingInformation: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    InsuranceClaimDetails: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    PaymentStatusDischarge: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    nursingNotes: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    physicianNotes: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    DischargeDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    DischargeInstruction: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    FollowUpAppointments: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    summaryOfTreatment: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    postDischargeCare: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    transferInformation: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    transferFacility: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    transferDateTime: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    PatientSignature: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "NA",
    },
    AuthorizedConsent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  });

  return HospitalAdmission;
};
