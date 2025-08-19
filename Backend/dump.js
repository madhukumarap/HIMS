const mysqldump = require("mysqldump");
const fs = require("fs").promises;
const path = require("path");
const db = require("./model/index.model");
const { getConnectionList } = require("./model/index.model3");
const dbConfig1 = require("./config/db.config");
const {
  databasesUnderBackup,
} = require("./Controller/storebackupconfigController.js");

// Function to perform the database dump
async function performDatabaseDump(databaseName, userName) {
  // Add the database to the array to indicate it's under backup
  try {
    databasesUnderBackup.push(databaseName);
  } catch (e) {
    console.log("error: " + e);
  }

  const dbConfig = {
    host: dbConfig1.HOST,
    user: dbConfig1.USER,
    password: dbConfig1.PASSWORD,
    database: databaseName,
  };

  console.log(databaseName);
  // Create the main folder "DatabaseDump" if it doesn't exist
  const mainFolderPath = path.join(__dirname, "DatabaseDump");
  try {
    await fs.mkdir(mainFolderPath);
  } catch (error) {
    // Ignore "folder already exists" error
    if (error.code !== "EEXIST") {
      console.error(`Error creating folder: ${error.message}`);
      return;
    }
  }

  // Create a folder with the database name inside "DatabaseDump"
  const folderPath = path.join(mainFolderPath, databaseName);
  try {
    await fs.mkdir(folderPath);
  } catch (error) {
    // Ignore "folder already exists" error
    if (error.code !== "EEXIST") {
      console.error(`Error creating folder: ${error.message}`);
      return;
    }
  }

  const sanitizedDatabaseName = databaseName.replace(/[^a-zA-Z0-9]/g, "_");

  // Generate a timestamp for the dump file
  const timestamp = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .substring(0, 19);

  const filename = `${databaseName}_${timestamp}.sql`;
  const filePath = path.join(folderPath, filename);

  // Dump options
  const dumpOptions = {
    connection: {
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    },
    dumpToFile: filePath,
    data: true,
  };

  try {
    // Perform the dump
    await mysqldump(dumpOptions);

    const connectionList = await getConnectionList(databaseName);
    const db = connectionList[databaseName];
    const BackupData = db.BackupData;
    // const Users = db.users;
    // console.log("User ID :", userId)
    // const user = await Users.findByPk(userId)
    // console.log("User details :", user)
    // return
    const data = new BackupData({ filename, path: filePath, user: userName });
    // Save the data to the database
    const save = await data.save();
    // After successful backup, remove the database from the array
    const index = databasesUnderBackup.indexOf(databaseName);
    if (index !== -1) {
      databasesUnderBackup.splice(index, 1);
    }
    // console.log(
    //   `Dump completed successfully. Check the "DatabaseDump/${databaseName}" folder for the SQL file.`
    // );
  } catch (err) {
    console.error("Error Got___:" + err);
  }
}

module.exports = performDatabaseDump;
