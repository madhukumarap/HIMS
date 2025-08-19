const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const SampleCollection = sequelize.define("samplecollection", {
    PatientName: {
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
    Address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PatientPhoneNo: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: false,
    },
    BarcodeValuesAllSelectedTest: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    sampleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sampleDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    sampleTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sampleLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reCollection: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "No", // Set the default value to "No"
    },

    reCollectionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    reCollectionTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sampleTakerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    testType: {
      type: DataTypes.STRING,
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

  return SampleCollection;
};
