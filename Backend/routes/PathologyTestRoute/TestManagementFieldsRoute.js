const axios = require("axios");
const express = require("express");
const router = express.Router();
const db = require("../../model/index.model");
const Test = db.PathologyTestManage;
const PathologyTest = db.PathologyTest;
const DoctorModel = db.doctor;
const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const dbConfig = require("../../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");
const TestArray = db.PathologyTestManage;
const StatusOfPathologyTestsForTestBooking =
  db.StatusOfPathologyTestsForTestBooking;
const { getConnectionList } = require("../../model/index.model3");

function findTestIdByName(tests, testName) {
  const test = tests.find((test) => test.testName === testName);
  return test ? test.id : null;
}

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

router.post(
  "/createOrUpdateTestResultTableCSV",
  upload.single("file"),
  async (req, res) => {
    const database = req.headers.userDatabase;
    console.log("DataBase:test:" + database);
    //return;
    const Currency = req.body.BaseCurrency;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const connection = db.connection;
    const sequelize = db.sequelize;
    const Test = db.PathologyTestManage;
    const PathologyTest = db.PathologyTest;
    const DoctorModel = db.doctor;
    const TestArray = db.PathologyTestManage;
    const StatusOfPathologyTestsForTestBooking =
      db.StatusOfPathologyTestsForTestBooking;

    try {
      const filePath = req.file.path;
      console.log(filePath);
      // if (Currency) {
      //   return res.send((message = "Please set Base Currency First"));
      // }

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", async (row) => {
          // Assuming row contains the data in the format you provided
          const {
            testName,
            category,
            SpecimenName,
            LabCategoryName,
            // fieldName,
            minimumRange,
            maximumRange,
            unitOfMeasurements,
            testPrice,
            description,
            // Currency,
            parameterName,
            code,
          } = row;

          console.log(row);

          // return;
          let test = await Test.findOne({
            where: { testName },
          });

          console.log("Currency: :" + req.body.BaseCurrency);
          // return;
          if (!test) {
            test = await Test.create({
              testName,
              code:
                testName.slice(0, 5) +
                Math.floor(100000 + Math.random() * 900000),
              description: testName,
              category: category || "NA",
              testPrice: testPrice,
              LabCategoryName,
              SpecimenName,
              category,
              description: description || "NA",
              Currency: Currency,
              LabCategoryNameID: 0,
              SpecimenName: SpecimenName || "NA",
              SpecimenNameID: 0,
              LabCategoryName: LabCategoryName || "NA",
            });
          }
          console.log("///////testCreated/////////:  " + test.id);
          // return
          // Generate the table name by removing spaces and converting to lowercase
          const createNewTableName =
            testName.replace(/\s+/g, "").toLowerCase() + "resultmodel";

          // Check if the table already exists
          const tableExists = await sequelize
            .getQueryInterface()
            .showAllTables();
          const lowerCaseNewTableName = createNewTableName.toLowerCase() + "s";

          if (tableExists.includes(lowerCaseNewTableName)) {
            // Get existing columns of the table
            const existingColumns = await sequelize
              .getQueryInterface()
              .describeTable(lowerCaseNewTableName);

            // Filter out field names that already exist in the table
            const fieldExists = existingColumns[parameterName];

            // If field does not exist, add it to the table
            if (!fieldExists) {
              await sequelize
                .getQueryInterface()
                .addColumn(lowerCaseNewTableName, parameterName, {
                  type: DataTypes.STRING,
                  allowNull: true,
                });
              console.log(
                `Added field ${parameterName} to table ${createNewTableName}`
              );
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
              // selectedTestName: {
              //   type: DataTypes.STRING,
              //   allowNull: true,
              // },
              PatientTestBookingID: {
                type: DataTypes.INTEGER,
                allowNull: false,
              },
            };

            // Extract only the 'fieldName' values from the array of objects
            // const fieldNames = fields.map((field) => field.fieldName);

            tableDefinition[parameterName] = {
              type: DataTypes.STRING,
              allowNull: true,
            };

            const newTable = await sequelize.define(
              createNewTableName,
              tableDefinition
            );
            await newTable.sync();
          }

          const testManagementID = test.id;

          //console.log(req.body);

          // Create an array to hold the values for insertion
          let fieldName = parameterName;
          const values = [
            testManagementID,
            fieldName,

            minimumRange,
            maximumRange,
            unitOfMeasurements,
          ];

          const query = `
                  INSERT INTO ${database}.testmanagementnormalvalues 
                  (testManagementID, fieldName, minimumRange, maximumRange, unitOfMeasurements) 
                  VALUES (?, ?, ?, ?, ?) 
                  ON DUPLICATE KEY UPDATE 
                    testManagementID = VALUES(testManagementID), 
                    fieldName = VALUES(fieldName), 
                    minimumRange = VALUES(minimumRange), 
                    maximumRange = VALUES(maximumRange), 
                    unitOfMeasurements = VALUES(unitOfMeasurements)
                   
                `;

          connection.query(query, values, (err, results) => {
            if (err) {
              console.error("Error executing query: " + err);
              return res.status(500).send("Internal Server Error");
            }
          });

          //fs.unlinkSync(filePath);
        })
        .on("end", () => {
          res.status(200).send("CSV file uploaded and processed successfully");
        });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  }
);

router.post("/createOrUpdateTestResultTable", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const connection = db.connection;
  const sequelize = db.sequelize;
  const Test = db.PathologyTestManage;
  const PathologyTest = db.PathologyTest;
  const DoctorModel = db.doctor;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const { testId, fields } = req.body;
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
      testData.testName.replace(/\s+/g, "").toLowerCase() + "resultmodel";

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
            type: DataTypes.STRING,
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
          type: DataTypes.STRING,
          allowNull: true,
        };
      }

      const newTable = await sequelize.define(
        createNewTableName,
        tableDefinition
      );
      await newTable.sync();
    }

    const { testManagementID } = req.body;

    console.log(req.body);

    // Create an array to hold the values for insertion
    const values = fields.map((field) => [
      testManagementID,
      field.fieldName,
      field.minimumRange,
      field.maximumRange,
      field.unitOfMeasurements,
    ]);

    // SQL query with INSERT ... ON DUPLICATE KEY UPDATE
    const query =
      "INSERT INTO healthcare.testmanagementnormalvalues (testManagementID, fieldName, minimumRange, maximumRange, unitOfMeasurements) VALUES ? " +
      "ON DUPLICATE KEY UPDATE " +
      "testManagementID = VALUES(testManagementID), " +
      "fieldName = VALUES(fieldName), " +
      "minimumRange = VALUES(minimumRange), " +
      "maximumRange = VALUES(maximumRange), " +
      "unitOfMeasurements = VALUES(unitOfMeasurements)";

    connection.query(query, [values], (err, results) => {
      if (err) {
        console.error("Error executing query: " + err);
        return res.status(500).send("Internal Server Error");
      }

      // Send a success response
      //  res.status(201).send("Data inserted/updated successfully");
    });

    return res.status(200).send("Table created/updated successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/UploadTestDataFromCsvDiagnostic",
  upload.single("file"),
  async (req, res) => {
    const database = req.headers.userDatabase;
    const Currency = req.body.BaseCurrency;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const connection = db.connection;
    const sequelize = db.sequelize;
    const Test = db.DiagnosticTestList;
    const PathologyTest = db.DiagnosticTestList;
    const DoctorModel = db.doctor;
    const TestArray = db.PathologyTestManage;
    const StatusOfPathologyTestsForTestBooking =
      db.StatusOfPathologyTestsForTestBooking;
    try {
      const filePath = req.file.path;
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", async (row) => {
          // Assuming row contains the data in the format you provided
          const {
            testName,
            // fieldName,
            parameterName,
            testPrice,
            LabCategoryName,
            description,
            category,
            // Currency,
          } = row;

          let fieldName = parameterName;

          console.log(row);
          let test = await Test.findOne({
            where: { testName },
          });

          if (!test) {
            test = await Test.create({
              testName,
              code:
                testName.slice(0, 5) +
                Math.floor(100000 + Math.random() * 900000),
              description: description || "NA",
              category: category || "NA",
              testPrice: testPrice,
              Currency: req.body.BaseCurrency,
              LabCategoryNameID: 0,
              SpecimenName: "NA",
              SpecimenNameID: 0,
              LabCategoryName: LabCategoryName || "NA",
            });
          }
          console.log("////////////////:  " + test.id);
          // return
          // Generate the table name by removing spaces and converting to lowercase
          const createNewTableName =
            testName.replace(/\s+/g, "").toLowerCase() +
            "resultmodeldiagnostics";

          // Check if the table already exists
          const tableExists = await sequelize
            .getQueryInterface()
            .showAllTables();
          const lowerCaseNewTableName = createNewTableName.toLowerCase() + "s";

          if (tableExists.includes(lowerCaseNewTableName)) {
            // Get existing columns of the table
            const existingColumns = await sequelize
              .getQueryInterface()
              .describeTable(lowerCaseNewTableName);

            // Filter out field names that already exist in the table
            const fieldExists = existingColumns[fieldName];

            // If field does not exist, add it to the table
            if (!fieldExists) {
              await sequelize
                .getQueryInterface()
                .addColumn(lowerCaseNewTableName, fieldName, {
                  type: DataTypes.STRING,
                  allowNull: true,
                });
              console.log(
                `Added field ${fieldName} to table ${createNewTableName}`
              );
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
              // selectedTestName: {
              //   type: DataTypes.STRING,
              //   allowNull: true,
              // },
              PatientTestBookingID: {
                type: DataTypes.INTEGER,
                allowNull: false,
              },
            };

            // Extract only the 'fieldName' values from the array of objects
            // const fieldNames = fields.map((field) => field.fieldName);

            tableDefinition[fieldName] = {
              type: DataTypes.STRING,
              allowNull: true,
            };

            const newTable = await sequelize.define(
              createNewTableName,
              tableDefinition
            );
            await newTable.sync();
          }

          const testManagementID = test.id;

          //console.log(req.body);

          // Create an array to hold the values for insertion
          const values = [testManagementID, fieldName];

          // const query = `
          //         INSERT INTO ${database}.testmanagementnormalvalues
          //         (testManagementID, fieldName)
          //         VALUES (?, ?)
          //         ON DUPLICATE KEY UPDATE
          //           testManagementID = VALUES(testManagementID),
          //           fieldName = VALUES(fieldName)
          //       `;

          // connection.query(query, values, (err, results) => {
          //   if (err) {
          //     console.error("Error executing query: " + err);
          //     return res.status(500).send("Internal Server Error");
          //   }
          // });

          //fs.unlinkSync(filePath);
        })
        .on("end", () => {
          res.status(200).send("CSV file uploaded and processed successfully");
        });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// router.post("/createOrUpdateTestResultTable", (req, res) => {

// });

// Close the database connection when the API server is closed
process.on("exit", () => {
  connection.end();
});

router.post("/insertTestData", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const connection = db.connection;
  const sequelize = db.sequelize;
  const Test = db.PathologyTestManage;
  const PathologyTest = db.PathologyTest;
  const DoctorModel = db.doctor;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const { tableName, formData, testName } = req.body;
  const data = formData;
  console.log("Data: " + testName);
  // return;
  data.createdAt = new Date();
  data.updatedAt = data.createdAt;

  const booking = await PathologyTest.findByPk(formData.PatientTestBookingID);
  console.log(tableName);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Update the booking record

  const testRow = await StatusOfPathologyTestsForTestBooking.findOne({
    where: {
      PathologyTestBookingId: booking.id,
      testName: testName,
    },
  });

  if (
    testRow?.TestStatus !== "Sample Collected" &&
    testRow?.TestStatus !== "Test Completed"
  ) {
    console.log("not collected sample for this test");
    return res
      .status(404)
      .json({ message: "Sample is not collected for this test" });
  }
  if (testRow) {
    const currentDateTime = new Date();
    testRow.TestCompletedDateTime = currentDateTime;
    testRow.TestStatus = "Test Completed";

    await testRow.save();
  }
  ////////////////////////////////////////////////////

  const statuses = await StatusOfPathologyTestsForTestBooking.findAll({
    where: {
      PathologyTestBookingId: booking.id,
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

router.post("/getColumnsInTable", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const connection = db.connection;
  const sequelize = db.sequelize;
  const Test = db.PathologyTestManage;
  const PathologyTest = db.PathologyTest;
  const DoctorModel = db.doctor;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
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
  const connection = db.connection;
  const sequelize = db.sequelize;
  const Test = db.PathologyTestManage;
  const PathologyTest = db.PathologyTest;
  const DoctorModel = db.doctor;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
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

router.get("/testmanagementnormalvalues", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const connection = db.connection;
  const sequelize = db.sequelize;
  const Test = db.PathologyTestManage;
  const PathologyTest = db.PathologyTest;
  const DoctorModel = db.doctor;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  // SQL query to retrieve all data from the table
  const query = "SELECT * FROM healthcare.testmanagementnormalvalues";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were returned
    if (results.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }
    console.log(results);
    res.json(results);
  });
});

router.get(
  "/getLastRecordByPatientTestBookingIDForMultipleTest/:PatientTestBookingID",
  async (req, res) => {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const connection = db.connection;
    const sequelize = db.sequelize;
    const Test = db.PathologyTestManage;
    const PathologyTest = db.PathologyTest;
    const DoctorModel = db.doctor;
    const TestArray = db.PathologyTestManage;
    const StatusOfPathologyTestsForTestBooking =
      db.StatusOfPathologyTestsForTestBooking;

    try {
      const { PatientTestBookingID } = req.params;

      // Get pathology test data
      const pathologyTest = await PathologyTest.findByPk(PatientTestBookingID);
      if (!pathologyTest) {
        return res.status(404).json({ error: "Test booking not found" });
      }

      // Get doctor data
      let Doctor = null;
      if (pathologyTest?.doctorId) {
        // Only fetch if doctorId exists
        
        try {
          const response = await axios.get(
            `${process.env.REMOTE_SERVER_BASE_URL}/api/getDoctorByIdsign/${pathologyTest.doctorId}`,
            {
              headers: {
                Authorization: req.headers?.authorization,
              },
            }
          );
          Doctor = response?.data;
        } catch (doctorError) {
          console.error("Error fetching doctor data:", doctorError);
        }
      }

      const selectedTestsArray = pathologyTest.selectedTests
        .split(",")
        .map((test) => test.trim());

      if (!Array.isArray(selectedTestsArray)) {
        return res.status(400).json({ error: "Invalid input format" });
      }

      // Use Promise.all to execute all queries in parallel
      const queryPromises = selectedTestsArray.map((tableName) => {
        const formattedTableName =
          tableName.replace(/\s+/g, "").toLowerCase() + "resultmodels";

        return new Promise((resolve) => {
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
                `Error executing query for table ${formattedTableName}:`,
                err
              );
              resolve({ [formattedTableName]: null });
            } else {
              resolve({ [formattedTableName]: rows[0] || null });
            }
          });
        });
      });

      // Wait for all queries to complete
      const queryResults = await Promise.all(queryPromises);

      // Combine all results into a single object
      const results = queryResults.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );

      const testResultData = {
        results,
        pathologyTest,
        selectedTestsArray,
        Doctor,
      };

      return res.status(200).json(testResultData);
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post("/getLastRecordByPatientTestBookingID", async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const connection = db.connection;
    const sequelize = db.sequelize;
    const Test = db.PathologyTestManage;
    const PathologyTest = db.PathologyTest;
    const DoctorModel = db.doctor;
    const TestArray = db.PathologyTestManage;
    const StatusOfPathologyTestsForTestBooking =
      db.StatusOfPathologyTestsForTestBooking;
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
});

router.get(
  "/testmanagementnormalvalues/:testManagementID",
  async (req, res) => {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const connection = db.connection;
    const sequelize = db.sequelize;
    const Test = db.PathologyTestManage;
    const PathologyTest = db.PathologyTest;
    const DoctorModel = db.doctor;
    const TestArray = db.PathologyTestManage;
    const StatusOfPathologyTestsForTestBooking =
      db.StatusOfPathologyTestsForTestBooking;
    const testManagementID = req.params.testManagementID;
    console.log("testManagementID: " + testManagementID);
    // SQL query to retrieve data based on testManagementID
    const query =
      "SELECT * FROM healthcare.testmanagementnormalvalues WHERE testManagementID = ?";

    connection.query(query, [testManagementID], (err, results) => {
      if (err) {
        console.error("Error executing query: " + err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Check if any rows were returned
      if (results.length === 0) {
        return res.status(404).json({ error: "Data not found" });
      }

      console.log(results);
      res.json(results);
    });
  }
);

// Function to check if a table exists in the database
async function checkIfTableExists(tableName) {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const connection = db.connection;
  const sequelize = db.sequelize;
  const Test = db.PathologyTestManage;
  const PathologyTest = db.PathologyTest;
  const DoctorModel = db.doctor;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const query = "SHOW TABLES LIKE ?";
  const [rows] = await connection.promise().query(query, [tableName]);
  return rows.length > 0;
}

router.delete("/deleteColumnFromTable", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const connection = db.connection;
  const sequelize = db.sequelize;
  const Test = db.PathologyTestManage;
  const PathologyTest = db.PathologyTest;
  const DoctorModel = db.doctor;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  try {
    const { viewTableName, fieldName } = req.body;

    console.log(req.body);
    // Check if the table exists in the database
    const tableExists = await checkIfTableExists(viewTableName);

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

      try {
        // Check if fieldName is provided
        if (!fieldName) {
          return res.status(400).json({ error: "fieldName is required" });
        }

        // SQL query to delete rows based on fieldName
        const query =
          "DELETE FROM healthcare.testmanagementnormalvalues WHERE fieldName = ?";

        connection.query(query, [fieldName], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // Check if any rows were deleted
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No matching rows found" });
          }
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).send("Column deleted successfully");
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/fetchTestDataForPatients", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const connection = db.connection;
  const sequelize = db.sequelize;
  const Test = db.PathologyTestManage;
  const PathologyTest = db.PathologyTest;
  const DoctorModel = db.doctor;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const { TestManagementID, PatientID, StartDate, EndDate, TableName } =
    req.body;
  console.log(req.body);
  // return;
  const query = `
    SELECT *
    FROM ${TableName}
    WHERE PatientID = ? AND createdAt BETWEEN ? AND ?
  `;

  connection.query(query, [PatientID, StartDate, EndDate], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("results: " + results);
    res.json(results);
  });
});
module.exports = router;
