const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const PathologyTest = sequelize.define("pathologytest", {
    PatientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PatientID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PaidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    CorporateID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PaymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PaymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    DoctorPhone: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    DoctorEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TotalFees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    Currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    DoctorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    commissionType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    commissionValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TestManagementID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TestManagementIDs: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PatientPhoneNo: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lapName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    selectedTests: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
    },
    instrumentsUsed: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    testFees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    results: {
      type: DataTypes.TEXT("long"), // Use TEXT with length for LONGTEXT
      allowNull: true,
    },
    Authorization: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Pending",
    },
    selectedPackageID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PackageName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "NA",
    },
    PackagePrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    feedback: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    admissionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    procedure: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Pathology",
    },
  });

  return PathologyTest;
};
