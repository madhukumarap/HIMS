const db = require("../model/index.model.js");
const TestPackageModel = db.HealthTestPackage;
const SelectedTestForPackageModel = db.SelectedTestForHealthPackage;
const CorporatePatientListPackage = db.CorporatePatientListPackage;
const PaitentReg = db.paitentReg;
const { getConnectionList } = require("../model/index.model3");

const CreatePackageForCorporatePatient = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const TestPackageModel = db.HealthTestPackage;
  const SelectedTestForPackageModel = db.SelectedTestForHealthPackage;
  const CorporatePatientListPackage = db.CorporatePatientListPackage;
  const PaitentReg = db.paitentReg;
  try {
    const { patientId, packageId } = req.body;
    console.log(req.body);
    const fetchedPatient = await PaitentReg.findByPk(patientId);
    const fetchedPackage = await TestPackageModel.findByPk(packageId);
    console.log("patient: " + JSON.stringify(fetchedPatient));

    if (!fetchedPatient.CorporateID) {
      return res.status(500).json({
        message: "This is not a Corporate Patient",
      });
    }

    // Check if package is already assigned to the patient
    const existingAssignment = await CorporatePatientListPackage.findOne({
      where: {
        PackageID: packageId,
        PatientID: patientId,
      },
    });

    if (existingAssignment) {
      return res.status(500).json({
        message: "This Package already assigned to this patient",
      });
    }
    // return;
    await PaitentReg.update(
      {
        PackageID: fetchedPackage.id,
        PackageName: fetchedPackage.packageName,
      },
      {
        where: {
          id: patientId,
        },
      }
    );
    const createdPackage = await CorporatePatientListPackage.create({
      packageName: fetchedPackage.packageName,
      MRPOfPackage: fetchedPackage.MRPOfPackage,
      discount: fetchedPackage.discount, //in percentage
      finalPrice: fetchedPackage.finalPrice,
      PackageID: fetchedPackage.id,
      PatientID: fetchedPatient.id,
      PatientPhone: fetchedPatient.PatientPhone,
      PatientName:
        fetchedPatient.mr +
        " " +
        fetchedPatient?.firstName +
        " " +
        fetchedPatient?.middleName +
        " " +
        fetchedPatient?.lastName,
      PatientCorporateID: fetchedPatient.CorporateID,
      PatientPhone: fetchedPatient.phoneNumberP,
    });

    // Send success response
    return res.status(200).json({
      message: "Package and associated to Patient created successfully",
    });
  } catch (error) {
    console.error("Error creating package and associated to Patient:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPackageForCorporatePatient = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const TestPackageModel = db.HealthTestPackage;
  const SelectedTestForPackageModel = db.SelectedTestForHealthPackage;
  const CorporatePatientListPackage = db.CorporatePatientListPackage;
  const PaitentReg = db.paitentReg;
  try {
    const { patientId } = req.body;
    // Find all packages along with their associated tests
    const Patients = await CorporatePatientListPackage.findAll();

    // Send the packages as response
    return res.status(200).json(Patients);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const deletePackageById = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const TestPackageModel = db.HealthTestPackage;
  const SelectedTestForPackageModel = db.SelectedTestForHealthPackage;
  const CorporatePatientListPackage = db.CorporatePatientListPackage;
  const PaitentReg = db.paitentReg;
  try {
    const id = req.params.id;

    // Find the package by its ID
    const packageToDelete = await CorporatePatientListPackage.findByPk(id);

    if (!packageToDelete) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Delete the package
    await packageToDelete.destroy();

    // Send success response
    return res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  CreatePackageForCorporatePatient,
  getAllPackageForCorporatePatient,
  deletePackageById,
};
