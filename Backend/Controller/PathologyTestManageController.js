// controllers/testController.js

const db = require("../model/index.model");
const Test = db.PathologyTestManage;
const LabCategoryList = db.LabCategoryList;
const SpecimenList = db.SpecimenManagement;
const { getConnectionList } = require("../model/index.model3");

const createTest = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.PathologyTestManage;
  const LabCategoryList = db.LabCategoryList;
  const SpecimenList = db.SpecimenManagement;
  try {
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
    console.log(req.body);
    // return;
    const testData = await Test.findOne({ where: { testName: testName } });
    if (testData) {
      res
        .status(400)
        .send({ message: "Test already present with name " + testName + "" });
    } else {
      const test = await Test.create({
        testName,
        code : testName.slice(0, 5) +
        Math.floor(100000 + Math.random() * 900000),
        description,
        category,
        testPrice,
        LabCategoryName,
        LabCategoryNameID: labCategoryId,
        SpecimenName,
        SpecimenNameID: specimenId,
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
  const Test = db.PathologyTestManage;
  const LabCategoryList = db.LabCategoryList;
  const SpecimenList = db.SpecimenManagement;
  try {
    const tests = await Test.findAll();
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
  const Test = db.PathologyTestManage;
  const LabCategoryList = db.LabCategoryList;
  const SpecimenList = db.SpecimenManagement;
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
    test.SpecimenName = SpecimenName;
    test.SpecimenNameID = specimenId;
    test.Currency = Currency;
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
  const Test = db.PathologyTestManage;
  const LabCategoryList = db.LabCategoryList;
  const SpecimenList = db.SpecimenManagement;
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

const CreateLabCategory = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.PathologyTestManage;
  const LabCategoryList = db.LabCategoryList;
  const SpecimenList = db.SpecimenManagement;
  try {
    const { CategoryName, LabCode, Status } = req.body;
    const newLabCategory = await LabCategoryList.create({
      CategoryName,
      LabCode,
      Status,
    });
    res.status(200).json(newLabCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to create LabCategory." });
  }
};

const GetListOfLabCategories = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.PathologyTestManage;
  const LabCategoryList = db.LabCategoryList;
  const SpecimenList = db.SpecimenManagement;
  try {
    const labCategories = await LabCategoryList.findAll();
    res.json(labCategories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch LabCategories." });
  }
};

const DeleteLabCategory = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.PathologyTestManage;
  const LabCategoryList = db.LabCategoryList;
  const SpecimenList = db.SpecimenManagement;
  try {
    const { id } = req.params;
    const deletedRowCount = await LabCategoryList.destroy({ where: { id } });
    if (deletedRowCount > 0) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "LabCategory not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete LabCategory." });
  }
};

const UpdateLabCategory = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.PathologyTestManage;
  const LabCategoryList = db.LabCategoryList;
  const SpecimenList = db.SpecimenManagement;
  try {
    const { id } = req.params;
    const { CategoryName, LabCode, Status } = req.body;
    const [updatedRowsCount] = await LabCategoryList.update(
      { CategoryName, LabCode, Status },
      { where: { id } }
    );
    if (updatedRowsCount > 0) {
      res.status(200).json({ message: "LabCategory updated successfully." });
    } else {
      res.status(404).json({ error: "LabCategory not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update LabCategory." });
  }
};

const CreateSpecimen = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.PathologyTestManage;
  const LabCategoryList = db.LabCategoryList;
  const SpecimenList = db.SpecimenManagement;
  try {
    const { SpecimenName, SpecimenCode } = req.body;
    const newSpecimen = await SpecimenList.create({
      SpecimenName,
      SpecimenCode,
    });
    res.status(200).json(newSpecimen);
  } catch (error) {
    res.status(500).json({ error: "Failed to create Specimen." });
  }
};

const GetListOfSpecimens = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.PathologyTestManage;
  const LabCategoryList = db.LabCategoryList;
  const SpecimenList = db.SpecimenManagement;
  try {
    const specimens = await SpecimenList.findAll();
    console.log(specimens);
    res.json(specimens);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Specimens." });
  }
};

const DeleteSpecimen = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.PathologyTestManage;
  const LabCategoryList = db.LabCategoryList;
  const SpecimenList = db.SpecimenManagement;
  try {
    const { id } = req.params;
    const deletedRowCount = await SpecimenList.destroy({ where: { id } });
    if (deletedRowCount > 0) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Specimen not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Specimen." });
  }
};

const UpdateSpecimen = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Test = db.PathologyTestManage;
  const LabCategoryList = db.LabCategoryList;
  const SpecimenList = db.SpecimenManagement;
  try {
    const { id } = req.params;
    const { SpecimenName, SpecimenCode } = req.body;
    const [updatedRowsCount] = await SpecimenList.update(
      { SpecimenName, SpecimenCode },
      { where: { id } }
    );
    if (updatedRowsCount > 0) {
      res.status(200).json({ message: "Specimen updated successfully." });
    } else {
      res.status(404).json({ error: "Specimen not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Specimen." });
  }
};

const getSpecimenWithCategory = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const SpecimenList = db.SpecimenManagement;
  const LabCategoryList = db.LabCategoryList;

  try {
    const specimensWithCategory = await SpecimenList.findAll({
      attributes: ["id", "SpecimenName"],
    });
    const LabCategory = await LabCategoryList.findAll({
      attributes: ["id", "CategoryName"],
    });
    res.status(200).json({ specimensWithCategory, LabCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching specimens with category" });
  }
};

module.exports = {
  createTest,
  getAllTests,
  updateTest,
  deleteTest,
  //////LabCategory////////
  CreateLabCategory,
  GetListOfLabCategories,
  DeleteLabCategory,
  UpdateLabCategory,
  ////////////SpecimenManagement/////////////
  CreateSpecimen,
  GetListOfSpecimens,
  DeleteSpecimen,
  UpdateSpecimen,
  getSpecimenWithCategory,
};
