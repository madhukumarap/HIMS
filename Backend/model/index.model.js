const dbConfig = require("../config/db.config");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

console.log("///////////////------------------///////////////////////////////");
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.userRole = require("./userRole.model")(sequelize, Sequelize);
db.Payments = require("./paymentsModel.js")(sequelize, DataTypes);
db.Hospital = require("./Hospital.js")(sequelize, DataTypes);
db.HospitalAdmission = require("./HospitalAdmission.js")(sequelize, DataTypes);
db.DiagnosticsBookingModel = require("./DiagnosticsBookingModel")(
  sequelize,
  DataTypes
);
db.PathologyTest = require("./PathologyTestModal")(sequelize, DataTypes);
db.HospitalAdminRegistration = require("./HospitalAdminRegistration")(
  sequelize,
  DataTypes
);
db.user = require("../model/user.model.js")(sequelize, Sequelize);
db.pharmacist = require("./Pharmacist.js")(sequelize, DataTypes);
db.nurse = require("./Nurse.js")(sequelize, DataTypes);
db.doctor = require("./Doctor.js")(sequelize, DataTypes);
db.CompanyRegistration = require("./CompanyRegistration")(sequelize, DataTypes);

db.PathologyTestManage = require("./PathologyTestManage")(sequelize, DataTypes);
db.DiagnosticTestList = require("./DiagnostictestManagement")(
  sequelize,
  DataTypes
);
db.BackupData = require("./BackupData.js")(sequelize, DataTypes);
db.paisentprescription = require("./PatientPrescription.js")(
  sequelize,
  DataTypes
);
db.BackupConfig = require("./backupConfig.js")(sequelize, DataTypes);
db.dispensedMedicine = require("./DispensedMedicine")(sequelize, DataTypes);
db.CurrencyRate = require("./CurrencyRates.js")(sequelize, DataTypes);
db.addDrugToDB = require("./AddDrugToDB")(sequelize, DataTypes);
db.Inventry = require("./Inventry.js")(sequelize, DataTypes);

db.BedsHospitalRoom = require("./BedsHospitalRoom.js")(sequelize, DataTypes);
db.HospitalMain = require("./MainHospitalCreate.js")(sequelize, DataTypes);
db.deleteHospital = require("./DeleteHospital.js")(sequelize, db.HospitalMain);

db.otSchedule = require("./OTSchedulePatient")(sequelize, DataTypes);
// db.PathologyTest = require("./PathologyTestModal")(sequelize, DataTypes);
db.HospitalRooms = require("./HospitalRooms")(sequelize, DataTypes);
db.DiagonosticSelectedTestForPackageModel =
  require("./DiagonosticSelected.Model")(sequelize, DataTypes);
db.StatusOfPathologyTestsForTestBooking =
  require("./StatusOfPathologyTestsForTestBooking")(sequelize, DataTypes);
db.StatusOfDiagnosticTestsForTestBooking =
  require("./StatusOfDiagnosticTestsForTestBooking")(sequelize, DataTypes);

db.CompanyItem = require("./Inventory/CompanyItem.js")(sequelize, DataTypes);
db.VendorList = require("./Inventory/VendorList.js")(sequelize, DataTypes);
//DiagnosticsBooking
db.Diagnostics_package = require("./DiagonosticsPackageModel")(
  sequelize,
  DataTypes
);
db.HealthTestPackage = require("./HealthTestPackage")(sequelize, DataTypes);
db.TestPackageModel = require("./TestPackageModel")(sequelize, DataTypes);

db.dispensedReport = require("./Dispention")(sequelize, DataTypes);
db.paitentReg = require("./PatientRegistration.js")(sequelize, DataTypes);
db.HealthTestPackage = require("./HealthTestPackage")(sequelize, DataTypes);
db.SelectedTestForHealthPackage = require("./SelectedTestForHealthPackage")(
  sequelize,
  DataTypes
);
db.CreateVaccinationPatient = require("./CreateVaccinationPatientModal.js")(
  sequelize,
  DataTypes
);
db.SelectedTestForPackageModel = require("./SelectedTestForPackageModel")(
  sequelize,
  DataTypes
);
db.CommissionCodeData = require("./CommisionCodeModel.js")(
  sequelize,
  DataTypes
);
db.LabCategoryList = require("./LabCategoryList.js")(sequelize, DataTypes);
db.SpecimenManagement = require("./SpecimenManagement.js")(
  sequelize,
  DataTypes
);

db.DoctorsAppointment = require("./DoctorsAppointment")(sequelize, DataTypes);
db.paitentMedicines = require("./Medicines.js")(sequelize, DataTypes);

//MedicineAdministrationReport
db.medicineAdmin = require("./MedicineAdministrationReport")(
  sequelize,
  DataTypes
);

db.SampleHomeCollection = require("./SampleHomeCollection")(
  sequelize,
  DataTypes
);
db.PathologyTestReferral = require("./PathalogyTestReferral")(
  sequelize,
  DataTypes
);

db.dailyQuantityOut = require("./DailyQuantityOutReport")(sequelize, DataTypes);

db.allsubstitute = require("./AllSubstitutes")(sequelize, DataTypes);
//

db.otNameandnumber = require("./OTNameAndNumber")(sequelize, DataTypes);
//medication
db.medicationday = require("./MedicationDays")(sequelize, DataTypes);

//PathoLogy All Test Modles
db.T3T4TSHTestModel = require("./PathologyTestAllModel/T3T4TSHTestModel")(
  sequelize,
  DataTypes
);
db.BloodSugerForPP = require("./PathologyTestAllModel/BloodSugerPP")(
  sequelize,
  DataTypes
);
db.PlateletCountTestModel =
  require("./PathologyTestAllModel/PlateletCountTestModel")(
    sequelize,
    DataTypes
  );
db.LipidProfileModel = require("./PathologyTestAllModel/LipidProfileModel")(
  sequelize,
  DataTypes
);
db.BloodSugarForFasting =
  require("./PathologyTestAllModel/BloodSugarForFasting")(sequelize, DataTypes);
db.pathologistTestBookingAppointment = require("./PathologyAppointment")(
  sequelize,
  DataTypes
);

db.SelectedTestForHealthPackage = require("./SelectedTestForHealthPackage")(
  sequelize,
  DataTypes
);
db.DiagnosticTestResultImages = require("./DiagnosticTestResultImages")(
  sequelize,
  DataTypes
);

db.CorporatePatientListPackage = require("./CorporatePatientListPackage")(
  sequelize,
  DataTypes
);
db.SampleCollection = require("./SampleCollection")(sequelize, DataTypes);

db.sequelize
  .sync({ alter: false }) /////////////////////////////////////////////
  .then(() => {
    initial();
    initializeDefaultUser()
      .then(() => {
        console.log("Default user initialization complete");
      })
      .catch((error) => {
        console.error("Error initializing default user:", error);
      });
    console.log("yes re-sync done!");
  });
db.TestPackageModel = require("./TestPackageModel")(sequelize, DataTypes);
db.SelectedTestForPackageModel = require("./SelectedTestForPackageModel")(
  sequelize,
  DataTypes
);
{
  db.TestPackageModel.hasMany(db.SelectedTestForPackageModel, {
    foreignKey: "TestPackageID",
    as: "testpackagemodel",
  });

  db.SelectedTestForPackageModel.belongsTo(db.TestPackageModel, {
    foreignKey: "TestPackageID",
    as: "testpackagemodel",
  });
}

//mapping PaitentsReg and PaitentPrescription
{
  db.paitentReg.hasMany(db.paisentprescription, {
    foreignKey: "patient_Id",
    as: "patientPrecription",
  });

  db.paisentprescription.belongsTo(db.paisentprescription, {
    foreignKey: "patient_Id",
    as: "paitentRegistration",
  });
}

// Define the association on the paisentPrescription model
db.paisentprescription.hasMany(db.paitentMedicines, {
  foreignKey: "prescription_Id",
  as: "medicines",
});

// Define the association on the paitentMedicines model
db.paitentMedicines.belongsTo(db.paisentprescription, {
  foreignKey: "prescription_Id",
  as: "paisentPrescription",
});

//mapping prescription and medication days tables
db.paisentprescription.hasMany(db.medicationday, {
  foreignKey: "PrescriptionId",
  as: "medicationdays",
});

// Define the association on the paitentMedicines model
db.medicationday.belongsTo(db.paisentprescription, {
  foreignKey: "PrescriptionId",
  as: "paisentPrescription",
});

// mapping dispensing and dispensed medicine
db.dispensedReport.hasMany(db.dispensedMedicine, {
  foreignKey: "DispenseTableID",
  as: "dispensedmedicines",
});

db.dispensedMedicine.belongsTo(db.dispensedReport, {
  foreignKey: "DispenseTableID",
  as: "dispensedreports",
});

//auth

db.role = require("../model/role.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.ROLES = ["user"];

const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
// Initialize default user
async function initializeDefaultUser() {
  try {
    let adminRole = await db.role.findOne({ where: { role: "admin" } });
    if (!adminRole) {
      adminRole = await db.role.create({ role: "admin" });
    }

    // Check if the superAdmin role exists
    let superAdminRole = await db.role.findOne({
      where: { role: "superAdmin" },
    });
    if (!superAdminRole) {
      superAdminRole = await db.role.create({ role: "superAdmin" });
    }
    // Check if the default user exists
    const defaultUser = await db.user.findOne({
      where: { username: "Hospital_Admin" },
    });
    const SuperdefaultUser = await db.user.findOne({
      where: { username: "Hospital_SuperAdmin" },
    });
    if (!defaultUser) {
      const newUser = await db.user.create({
        name: "Hospital Administrator",
        username: "Hospital_Admin",
        email: "admin@example.com",
        phoneNumber: "1234567890",
        password: bcrypt.hashSync("Admin@123", 8),
        countryCode: "+91" // Added to avoid error as model has countryCode
      });

      // Assign the admin role to the default user
      await newUser.addRole(adminRole);

      console.log("Default user created successfully.");
    } else {
      console.log("Default user already exists.");
    }
    if (!SuperdefaultUser) {
      const newUser = await db.user.create({
        name: "HealthCare",
        username: "Hospital_SuperAdmin",
        email: "superadmin@example.com",
        phoneNumber: "5675679999",
        password: bcrypt.hashSync("Admin@123", 8),
      });

      // Assign the superAdminRole role to the default user
      await newUser.addRole(superAdminRole);

      console.log("Default user created successfully.");
    } else {
      console.log("Default user already exists.");
    }
  } catch (error) {
    console.error("Error initializing default user:", error);
  }
}

async function initial() {
  try {
    const existingRoles = await Role.findAll();

    const rolesToCreate = [
      { role: "user" },
      { role: "doctor" },
      { role: "pharmacist" },
      { role: "patient" },
      { role: "nurse" },
      { role: "admin" },
      { role: "superAdmin" },
      // { role: "collectionTechnician" },
      // { role: "OTTechnician" },
      { role: "pathologistAdmin" },
      { role: "diagnosticTechnician" },
      { role: "Receptionist" },
    ].filter(
      (role) =>
        !existingRoles.find((existingRole) => existingRole.role === role.role)
    );

    if (rolesToCreate.length > 0) {
      await Role.bulkCreate(rolesToCreate);
      console.log("Default roles created successfully.");
    } else {
      console.log("Default roles already exist.");
    }
  } catch (error) {
    console.error("Error creating default roles:", error);
  }
}

console.log();

module.exports = db;
