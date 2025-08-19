const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const StatusOfPathologyTestsForTestBooking = sequelize.define(
    "StatusOfPathologyTestsForTestBooking",
    {
      testName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TestStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PatientID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      PathologyTestBookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      TestID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TestRegisteredDateTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      TestSamplecollectedDateTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      TestCompletedDateTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      admissionID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    }
  );

  return StatusOfPathologyTestsForTestBooking;
};
