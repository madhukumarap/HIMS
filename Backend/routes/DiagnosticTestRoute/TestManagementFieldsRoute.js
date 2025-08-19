const express = require("express");
const router = express.Router();
const db = require("../../model/index.model");
const Test = db.DiagnosticTestList;
const Doctor = db.doctor;
const StatusOfDiagnosticTestsForTestBooking =
  db.StatusOfDiagnosticTestsForTestBooking;
const { getConnectionList } = require("../../model/index.model3");

const PathologyTest = db.DiagnosticsBookingModel;
const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "public/images" });

//const upload = multer({ dest: "uploads/" });
const dbConfig = require("../../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");

const mysql = require("mysql2");

// Create a MySQL database connection
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

router.post("/createOrUpdateTestResultTableDiagnostic", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.DiagnosticsBookingModel;
  const Test = db.DiagnosticTestList;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const connection = db.connection;
  const sequelize = db.sequelize;
  const { testId, fields } = req.body;

  console.log(req.body);
  console.log(req.body);
  try {
    const testData = await Test.findOne({
      where: { id: testId },
    });

    if (!testData) {
      return res.status(404).send("Test not found");
    }

    // Generate the table name by removing spaces and converting to lowercase
    const createNewTableName =
      testData.testName.replace(/\s+/g, "").toLowerCase() +
      "resultmodeldiagnostic";

    // Check if the table already exists
    const tableExists = await sequelize.getQueryInterface().showAllTables();
    const lowerCaseNewTableName = createNewTableName.toLowerCase() + "s";

    if (tableExists.includes(lowerCaseNewTableName)) {
      // Get existing columns of the table
      const existingColumns = await sequelize
        .getQueryInterface()
        .describeTable(lowerCaseNewTableName);

      // Extract only the 'fieldName' values from the array of objects
      const fieldNames = fields.map((field) => field.fieldName);

      // Filter out field names that already exist in the table
      const newFields = fieldNames.filter(
        (fieldName) => !existingColumns[fieldName]
      );

      // Add new fields to the table (alter table)
      for (const fieldName of newFields) {
        await sequelize
          .getQueryInterface()
          .addColumn(lowerCaseNewTableName, fieldName, {
            type: DataTypes.TEXT("long"),
            allowNull: true,
          });
        console.log(`Added field ${fieldName} to table ${createNewTableName}`);
      }
    } else {
      // If the table does not exist, create it with the specified fields
      const tableDefinition = {
        PatientID: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        TestManagementID: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Comment: {
          type: DataTypes.TEXT("long"),
          allowNull: true,
        },
        PatientTestBookingID: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      };

      // Extract only the 'fieldName' values from the array of objects
      const fieldNames = fields.map((field) => field.fieldName);

      for (const fieldName of fieldNames) {
        tableDefinition[fieldName] = {
          type: DataTypes.TEXT("long"),
          allowNull: true,
        };
      }
      //   console.log(tableDefinition);
      //   return;
      const newTable = await sequelize.define(
        createNewTableName,
        tableDefinition
      );
      await newTable.sync();
    }

    return res.status(200).send("Table created/updated successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

process.on("exit", () => {
  connection.end();
});

router.post("/insertTestDataDiagnostics", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.DiagnosticsBookingModel;
  const Test = db.DiagnosticTestList;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const connection = db.connection;
  const sequelize = db.sequelize;
  const { tableName, formData, testName } = req.body;
  const data = formData;
  data.createdAt = new Date();
  data.updatedAt = data.createdAt;

  const booking = await PathologyTest.findByPk(formData.PatientTestBookingID);
  console.log(tableName);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Update the booking record
  booking.status = "Completed";
  //  await booking.save();

  const testRow = await StatusOfDiagnosticTestsForTestBooking.findOne({
    where: {
      DiagnosticTestBookingId: booking.id,
      testName: testName,
    },
  });

  if (testRow) {
    const currentDateTime = new Date();
    testRow.TestCompletedDateTime = currentDateTime;
    testRow.TestStatus = "Test Completed";

    await testRow.save();
  }
  ////////////////////////////////////////////////////

  const statuses = await StatusOfDiagnosticTestsForTestBooking.findAll({
    where: {
      DiagnosticTestBookingId: booking.id,
    },
  });
  if (statuses) {
    for (let i = 0; i < statuses.length; i++) {
      if (statuses[i].TestStatus !== "Test Completed") {
        booking.status = "Partial Completed";
      } else {
        booking.status = "Completed";
      }
    }
  }
  await booking.save();
  console.log(statuses);
  //////////////////////////////////////////////////////////////////

  try {
    const query = `INSERT INTO ${tableName} SET ? ON DUPLICATE KEY UPDATE ?`;

    connection.query(query, [data, data], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      return res.status(201).send("Data inserted or updated successfully");
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/getColumnsInTableDiagnostic", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.DiagnosticsBookingModel;
  const Test = db.DiagnosticTestList;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const connection = db.connection;
  const sequelize = db.sequelize;
  try {
    const { tableName } = req.body;
    console.log(req.body);

    // Check if the table exists in the database
    const tableExists = await sequelize.getQueryInterface().showAllTables();
    const lowerCaseTableName = tableName.toLowerCase();

    if (!tableExists.includes(lowerCaseTableName)) {
      return res.status(404).send("Table not found");
    }

    // Get the columns of the specified table
    const columns = await sequelize
      .getQueryInterface()
      .describeTable(lowerCaseTableName);

    // Extract the column names
    const columnNames = Object.keys(columns);
    console.log(columnNames);
    return res.status(200).json(columnNames);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/getColumnsInTablesMultiple", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.DiagnosticsBookingModel;
  const Test = db.DiagnosticTestList;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const connection = db.connection;
  const sequelize = db.sequelize;
  try {
    const { tableName } = req.body;
    console.log(req.body);
    if (!tableName) {
      console.log("return");
      return res.status(400).send("tableNames is missing in the request body");
    }

    // Split the table names by comma
    const tableNameArray = tableName?.split(",");

    // Initialize an object to store table names and their columns
    const tablesAndColumns = {};

    for (const tableName of tableNameArray) {
      // Check if the table exists in the database
      const tableExists = await sequelize.getQueryInterface().showAllTables();
      const lowerCaseTableName = tableName.toLowerCase();

      if (!tableExists.includes(lowerCaseTableName)) {
        tablesAndColumns[tableName] = []; // Table not found, store an empty array
      } else {
        // Get the columns of the specified table
        const columns = await sequelize
          .getQueryInterface()
          .describeTable(lowerCaseTableName);

        // Extract the column names
        const columnNames = Object.keys(columns);

        tablesAndColumns[tableName] = columnNames;
      }
    }

    return res.status(200).json(tablesAndColumns);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.get(
  "/getLastRecordByPatientTestBookingIDForMultipleTestDiagnostic/:PatientTestBookingID",
  async (req, res) => {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const PathologyTest = db.DiagnosticsBookingModel;
    const Test = db.DiagnosticTestList;
    const Doctor = db.doctor;
    const StatusOfDiagnosticTestsForTestBooking =
      db.StatusOfDiagnosticTestsForTestBooking;
    const connection = db.connection;
    const sequelize = db.sequelize;
    try {
      const { PatientTestBookingID } = req.params;

      // const tableNames = ["LipidProfile", "PlateletCount", "BloodSugarForPP"];
      // const PatientTestBookingID = 41;

      const pathologyTest = await PathologyTest.findByPk(PatientTestBookingID);
      const doctorId = pathologyTest.doctorId;
      const doctor = await Doctor.findByPk(doctorId);
      // let DoctorSign;
      //console.log("selectedTestsArray");
      const selectedTestsArray = pathologyTest.selectedTests
        .split(",")
        .map((test) => test.trim());

      // console.log(selectedTestsArray);
      // console.log(pathologyTest);
      //return;
      if (!Array.isArray(selectedTestsArray)) {
        return res.status(400).json({ error: "Invalid input format" });
      }

      const results = {};

      for (const tableName of selectedTestsArray) {
        //  console.log(tableName);
        const formattedTableName =
          tableName.replace(/\s+/g, "").toLowerCase() +
          "resultmodeldiagnostics";

        const query = `
          SELECT *
          FROM ${formattedTableName}
          WHERE PatientTestBookingID = ?
          ORDER BY createdAt DESC
          LIMIT 1
        `;

        connection.query(query, [PatientTestBookingID], (err, rows) => {
          if (err) {
            console.error(
              `Error executing query for table ${formattedTableName}: `,
              err
            );
            results[formattedTableName] = null;
          } else {
            results[formattedTableName] = rows[0] || null;
          }

          const testResultData = {
            results,
            pathologyTest,
            selectedTestsArray,
            doctor,
          };
          //console.log(testResultData);
          // return;
          if (Object.keys(results).length === selectedTestsArray.length) {
            // console.log(
            //   "PatientTestBookingIDs: ////////////////////////////////////////////////////",
            //   testResultData
            // );

            return res.status(200).json(testResultData);
          }
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/getLastRecordByPatientTestBookingIDDiagnostic",
  async (req, res) => {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const PathologyTest = db.DiagnosticsBookingModel;
    const Test = db.DiagnosticTestList;
    const Doctor = db.doctor;
    const StatusOfDiagnosticTestsForTestBooking =
      db.StatusOfDiagnosticTestsForTestBooking;
    const connection = db.connection;
    const sequelize = db.sequelize;
    try {
      const { tableName, PatientTestBookingID } = req.body;

      const query = `
      SELECT *
      FROM ${tableName}
      WHERE PatientTestBookingID = ?
      ORDER BY createdAt DESC
      LIMIT 1
    `;

      connection.query(query, [PatientTestBookingID], (err, results) => {
        if (err) {
          console.error("Error executing query: " + err);
          return res.status(500).send("Internal Server Error");
        }

        if (results.length === 0) {
          return res.status(404).send("Result not found For this test");
        }

        const lastRecord = results[0];
        return res.status(200).json(lastRecord);
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// Function to check if a table exists in the database
async function checkIfTableExists(tableName, req) {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.DiagnosticsBookingModel;
  const Test = db.DiagnosticTestList;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const connection = db.connection;
  const sequelize = db.sequelize;
  const query = "SHOW TABLES LIKE ?";
  const [rows] = await connection.promise().query(query, [tableName]);
  return rows.length > 0;
}

router.delete("/deleteColumnFromTable", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.DiagnosticsBookingModel;
  const Test = db.DiagnosticTestList;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const connection = db.connection;
  const sequelize = db.sequelize;
  try {
    const { viewTableName, fieldName } = req.body;

    console.log(req.body);
    // Check if the table exists in the database
    const tableExists = await checkIfTableExists(viewTableName , req);

    if (!tableExists) {
      return res.status(404).send("Table not found");
    }

    // Construct the SQL query to delete the column
    const query = `ALTER TABLE ${viewTableName} DROP COLUMN ${fieldName}`;

    // Execute the query
    connection.query(query, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }
      console.log("Column deleted successfully");

      // try {
      //   // Check if fieldName is provided
      //   if (!fieldName) {
      //     return res.status(400).json({ error: "fieldName is required" });
      //   }

      //   // SQL query to delete rows based on fieldName
      //   const query =
      //     "DELETE FROM healthcare.testmanagementnormalvalues WHERE fieldName = ?";

      //   connection.query(query, [fieldName], (err, result) => {
      //     if (err) {
      //       console.error(err);
      //       return res.status(500).json({ error: "Internal Server Error" });
      //     }

      //     // Check if any rows were deleted
      //     if (result.affectedRows == 0) {
      //       return res.status(404).json({ message: "No matching rows found" });
      //     }
      //   });
      // } catch (error) {
      //   console.error(error);
      //   return res.status(500).json({ error: "Internal Server Error" });
      // }
      return res.status(200).send("Column deleted successfully");
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
