const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const DoctorPaymentHistory = sequelize.define(
    "doctor_payment_history",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false, // or true if sometimes you don’t have it
      },
      consultationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      referralId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pathologyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      diagnosisId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      paidAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      paymentDateTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      status: {
        type: Sequelize.ENUM("Paid", "Unpaid"),
        defaultValue: "Unpaid",
      },
    },
    {
      tableName: "doctor_payment_history", // Explicitly set the table name
      timestamps: true, // Adds createdAt and updatedAt
    }
  );

  return DoctorPaymentHistory;
};
