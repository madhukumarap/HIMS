const db = require("../model/index.model.js");
const TestPackageModel = db.TestPackageModel;
const SelectedTestForPackageModel = db.SelectedTestForPackageModel;
const { getConnectionList } = require("../model/index.model3");

const CreatePackageTest = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const TestPackageModel = db.TestPackageModel;
  const SelectedTestForPackageModel = db.SelectedTestForPackageModel;
  try {
    const {
      packageName,
      MRPOfPackage,
      discount,
      finalPrice,
      selectedTests,
      Currency,
    } = req.body;
    console.log(req.body);
    const createdPackage = await TestPackageModel.create({
      packageName,
      MRPOfPackage,
      discount,
      finalPrice,
      Currency,
    });

    for (const test of selectedTests) {
      await SelectedTestForPackageModel.create({
        TestName: test.value,
        TestId: test.TestId,
        testType: "Pathology",

        category: test.category,
        TestPackageID: createdPackage.id,
      });
    }

    // Send success response
    return res
      .status(200)
      .json({ message: "Package and associated tests created successfully" });
  } catch (error) {
    console.error("Error creating package and associated tests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const UpdatePackageTest = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const TestPackageModel = db.TestPackageModel;
  const SelectedTestForPackageModel = db.SelectedTestForPackageModel;
  try {
    const { id } = req.params; // Assuming the package ID is provided in the URL parameter

    // Extract the updated data from the request body
    const {
      packageName,
      MRPOfPackage,
      discount,
      finalPrice,
      selectedTests,
      Currency,
    } = req.body;

    // Find the package by its ID
    const packageToUpdate = await TestPackageModel.findByPk(id);

    if (!packageToUpdate) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Update the package attributes
    packageToUpdate.packageName = packageName;
    packageToUpdate.MRPOfPackage = MRPOfPackage;
    packageToUpdate.discount = discount;
    packageToUpdate.finalPrice = finalPrice;
    packageToUpdate.Currency = Currency;

    // Save the updated package
    await packageToUpdate.save();

    // Delete existing selected tests for this package
    await SelectedTestForPackageModel.destroy({ where: { TestPackageID: id } });

    // Create new selected tests for this package
    for (const test of selectedTests) {
      console.log(test);

      await SelectedTestForPackageModel.create({
        TestName: test.value,
        TestId: test.TestId,
        testType: "Pathology",

        category: test.category,
        TestPackageID: id,
      });
    }

    return res.status(200).json({ message: "Package updated successfully" });
  } catch (error) {
    console.error("Error updating package:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetAllPackagesWithTests = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const TestPackageModel = db.TestPackageModel;
  const SelectedTestForPackageModel = db.SelectedTestForPackageModel;
  try {
    // Find all packages along with their associated tests
    const packages = await TestPackageModel.findAll();

    // Send the packages as response
    return res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const GetSelectedTestsByPackageID = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const TestPackageModel = db.TestPackageModel;
  const SelectedTestForPackageModel = db.SelectedTestForPackageModel;
  try {
    const { TestPackageID } = req.params;

    // Find all tests associated with the provided TestPackageID
    const selectedTests = await SelectedTestForPackageModel.findAll({
      where: { TestPackageID },
    });

    // Send the selectedTests as response
    return res.status(200).json(selectedTests);
  } catch (error) {
    console.error("Error fetching selected tests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const DeletePackage = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const TestPackageModel = db.TestPackageModel;
  const SelectedTestForPackageModel = db.SelectedTestForPackageModel;
  try {
    const { id } = req.params;

    // Find the package by its ID
    const packageToDelete = await TestPackageModel.findByPk(id);

    if (!packageToDelete) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Delete existing selected tests for this package
    await SelectedTestForPackageModel.destroy({ where: { TestPackageID: id } });

    await packageToDelete.destroy();

    return res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreatePackageTest,
  GetAllPackagesWithTests,
  GetSelectedTestsByPackageID,
  UpdatePackageTest,
  DeletePackage,
};
