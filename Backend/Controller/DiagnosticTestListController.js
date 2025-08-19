// controllers/testController.js

const db = require("../model/index.model");
const Test = db.DiagnosticTestList;
const PathologyTest = db.DiagnosticsBookingModel;
const { getConnectionList } = require("../model/index.model3");

const createTest = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.DiagnosticTestList;
  const PathologyTest = db.DiagnosticsBookingModel;

  try {
    const {
      testName,
      // code,
      description,
      testPrice,
      category,
      LabCategoryName,
      labCategoryId,
      SpecimenName,
      specimenId,
      Currency,
    } = req.body;
    console.log(req.body);
    // return;

    const isTestName = await Test.findOne({ where: { testName: testName } })
    // const isTestCode = await Test.findOne({ where: { code: code } })

    // if (isTestCode) {
    //   res.status(400).send({ message: "Test already present with code " + code + "" });
    // }
    // else 
    if (isTestName) {
      res.status(400).send({ message: "Test already present with name " + testName + "" });
    } else {

      const test = await Test.create({
        testName,
        code : testName.slice(0, 5) +
        Math.floor(100000 + Math.random() * 900000),
        description,
        testPrice,
        category,
        LabCategoryName,
        LabCategoryNameID: labCategoryId,
        SpecimenName,
        SpecimenNameID: specimenId || 0,
        Currency,
      });
      res
        .status(201)
        .json({ message: "Test created successfully", testID: test.id });

    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating test" });
  }
};

const getAllTests = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.DiagnosticTestList;
  const PathologyTest = db.DiagnosticsBookingModel;
  try {
    const tests = await Test.findAll();

    console.log(tests);
    res.status(200).json({ tests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tests" });
  }
};
const updateTest = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.DiagnosticTestList;
  const PathologyTest = db.DiagnosticsBookingModel;
  const testId = req.params.id;

  try {
    const test = await Test.findByPk(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Apply updates from req.body
    const {
      testName,
      // code,
      description,
      category,
      testPrice,
      LabCategoryName,
      labCategoryId,
      SpecimenName,
      specimenId,
      Currency,
    } = req.body;
    console.log("Data: " + req.body.testName);
    test.testName = testName;
    // test.code = code;
    test.description = description;
    test.category = category;
    test.testPrice = testPrice;
    test.LabCategoryName = LabCategoryName;
    test.LabCategoryNameID = labCategoryId;
    test.SpecimenName = SpecimenName || "NA";
    test.SpecimenNameID = specimenId || 0;
    test.Currency = Currency || "";
    await test.save();

    res.status(200).json({ message: "Test updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating test" });
  }
};

const deleteTest = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.DiagnosticTestList;
  const PathologyTest = db.DiagnosticsBookingModel;
  const testId = req.params.id;

  try {
    const deletedTestCount = await Test.destroy({
      where: { id: testId },
    });

    if (deletedTestCount === 0) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting test" });
  }
};

const getAllTestsBothPathologyandDiagnostic = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.DiagnosticTestList;
  const PathologyTest = db.DiagnosticsBookingModel;
  try {
    const pathologyTests = await PathologyTest.findAll();
    const diagnosticTests = await Test.findAll();

    // Add testType field to pathologyTests
    const pathologyTestsWithType = pathologyTests.map((test) => ({
      ...test.get(),
      testType: "Pathology",
    }));

    // Add testType field to diagnosticTests
    const diagnosticTestsWithType = diagnosticTests.map((test) => ({
      ...test.get(),
      testType: "Diagnostic",
    }));

    const tests = [...pathologyTestsWithType, ...diagnosticTestsWithType];
    console.log(tests);
    res.status(200).json({ tests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tests" });
  }
};

module.exports = {
  createTest,
  getAllTests,
  updateTest,
  deleteTest,
  getAllTestsBothPathologyandDiagnostic,
};
