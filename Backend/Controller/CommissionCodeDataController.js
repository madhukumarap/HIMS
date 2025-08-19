const db = require("../model/index.model"); // Assuming you have your models set up
const EnterCodeTypeValue = db.CommissionCodeData;
const { getConnectionList } = require("../model/index.model3");

const createEnterCodeTypeValue = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const EnterCodeTypeValue = db.CommissionCodeData;

  try {
    const { codeType, value } = req.body;
    console.log(req.body);
    const newEnterCode = await EnterCodeTypeValue.create({
      codeType: codeType,
      value: value,
    });
    console.log(newEnterCode);
    res.status(200).json(newEnterCode);
  } catch (error) {
    console.error("Error creating Enter Code data:", error);

    res.status(500).json({ error: "Failed to create EnterCodeTypeValue." });
  }
};

const getEnterCodeList = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const EnterCodeTypeValue = db.CommissionCodeData;

  try {
    const enterCodeList = await EnterCodeTypeValue.findAll();
    res.json(enterCodeList);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch EnterCodeTypeValues." });
  }
};

const updateEnterCodeTypeValue = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const EnterCodeTypeValue = db.CommissionCodeData;

  try {
    const { id } = req.params;
    const { value, codeType } = req.body;
    const [updatedRowsCount] = await EnterCodeTypeValue.update(
      { codeType, value },
      { where: { id } }
    );
    if (updatedRowsCount > 0) {
      res
        .status(200)
        .json({ message: "EnterCodeTypeValue updated successfully." });
    } else {
      res.status(404).json({ error: "EnterCodeTypeValue not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update EnterCodeTypeValue." });
  }
};

const deleteEnterCodeTypeValue = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const EnterCodeTypeValue = db.CommissionCodeData;

  try {
    const { id } = req.params;
    const deletedRowCount = await EnterCodeTypeValue.destroy({ where: { id } });
    if (deletedRowCount > 0) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "EnterCodeTypeValue not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete EnterCodeTypeValue." });
  }
};

module.exports = {
  createEnterCodeTypeValue,
  getEnterCodeList,

  updateEnterCodeTypeValue,
  deleteEnterCodeTypeValue,
};
