const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const DoctorsAppointment = sequelize.define("doctorsappointment", {
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    admissionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CorporateID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PatientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PatientPhone: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    DoctorPhone: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    DoctorEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DoctorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookingStartDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookingEndDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentDateTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    BookingStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    remarks: {
      type: DataTypes.TEXT,
    },

    image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visitType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    procedure: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue : "Doctor Visit"
    },
  });

  return DoctorsAppointment;
};
