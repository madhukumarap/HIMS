module.exports = (sequelize, DataTypes) => {
  const PatientReg = sequelize.define("patientRegistration", {
    mr: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PackageName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PackageID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    countryCode: {
      type: DataTypes.STRING(4), // Adjust the length as per your requirement
      allowNull: true, // Adjust allowNull based on your use case
    },
    phoneNumberP: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      //  unique: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PatientAadharID: {
      type: DataTypes.STRING(13),
      // allowNull: true,
      // validate: {
      //   is: /^[0-9]{12}$/, // Validates that it's a 12-digit number
      // },
    },
    HealthNationalID: {
      type: DataTypes.STRING(17),
      // allowNull: true,
      // validate: {
      //   is: /^[0-9]{16}$/, // Validates that it's a 16-digit number
      // },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING(6),
      allowNull: true,
      // validate: {
      //   is: /^[0-9]{6}$/, // Validates that it's a 6-digit number
      // },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    CompanyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    CompanyID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CorporateID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registrationFees: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.ENUM("Paid", "Not-Paid"),
      allowNull: true,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW, // Set default value to current date
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ageOption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return PatientReg;
};
