const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const DiagnosticTestResultImages = sequelize.define(
    "diagnostictestResultimage",
    {
      testBookingID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      testName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      testType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }
  );

  return DiagnosticTestResultImages;
};
