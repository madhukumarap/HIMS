const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const dbConfig1 = require("./config/db.config");

const executeSqlFromFile = (databaseName, filepath) => {
  const dbConfig = {
    host: dbConfig1.HOST,
    user: dbConfig1.USER,
    password: dbConfig1.PASSWORD,
    database: databaseName,
  };
  const dumpFilePath = filepath; //path.join(__dirname, filepath);

  console.log("dumpFilePath: " + dumpFilePath);
  //return;
  const sqlContent = fs.readFileSync(dumpFilePath, "utf8");

  // Split the content into individual SQL statements
  const sqlStatements = sqlContent
    .split(";")
    .filter((statement) => statement.trim() !== "");

  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      return;
    }

    console.log("Connected to MySQL server");

    sqlStatements.forEach((statement) => {
      connection.query(statement, (err, results, fields) => {
        if (err) {
          console.error("Error executing SQL statement:", err);
        } else {
          console.log("SQL statement executed successfully");
        }
      });
    });

    // Close the connection
    connection.end();
  });
};

module.exports = executeSqlFromFile;
