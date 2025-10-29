const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const StatusOfDiagnosticTestsForTestBooking = sequelize.define(
    "statusofdiagnostictestsfortestbookings",
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

      DiagnosticTestBookingId: {
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

      TestCompletedDateTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      admissionID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },{
      tablename :'statusofdiagnostictestsfortestbookings'
    }
  );

  return StatusOfDiagnosticTestsForTestBooking;
};
