const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const PathologyTestReferral = sequelize.define("pathologytestReferral", {
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    commissionType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    commissionValue: {
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
    DoctorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    bookingTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  return PathologyTestReferral;
};
