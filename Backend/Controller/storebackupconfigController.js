const db = require("../model/index.model");
const { getConnectionList } = require("../model/index.model3");
const executeSqlFromFile = require("../Restore");
const fs = require("fs");
const performDatabaseDump = require("../dump.js");

const BackupConfig = db.BackupConfig;

const databasesUnderBackup = [];

const addBackupConfig = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const { period, day, time } = req.body;
    const BackupConfig = db.BackupConfig;

    const data = new BackupConfig({ period, day, time });
    const save = await data.save();
    res.send({ message: "Backup configuration added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getLastBackupConfig = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const BackupConfig = db.BackupConfig;

    const lastBackupConfig = await BackupConfig.findOne({
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    if (!lastBackupConfig) {
      return res
        .status(404)
        .send({ message: "No backup configurations found" });
    }

    res.send({ lastBackupConfig });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getLastBackupDump = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const BackupConfig = db.BackupConfig;
    const BackupData = db.BackupData;

    const BackupDataDump = await BackupData.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    console.log("BackupDataDump: " + BackupDataDump);
    if (!BackupDataDump) {
      return res.status(404).send({ message: "No backup Dump found" });
    }

    res.send({ BackupDataDump });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const restoreDump = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const userId = req.headers.userId;
    // Add the database to the array to indicate it's under backup
    databasesUnderBackup.push(database);
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const BackupConfig = db.BackupConfig;
    const BackupData = db.BackupData;
    const { filname, path, id } = req.body;
    // await db.user.update(
    //   { loggedInStatus: "LoggedOut" },
    //   {
    //     where: {
    //       id: {
    //         [db.Sequelize.Op.not]: userId,
    //       },
    //     },
    //   }
    // );
    const user = await db.user.findByPk(userId);

    console.log(req.body);
    let backup = await BackupData.findByPk(id);
    console.log("backup : ", backup.status);
    backup.status = "restored";
    backup.restoredBy = user.name;
    await backup.save();
    // const connectionList = await getConnectionList(database);
    // const db = connectionList[database];
    // return
    await executeSqlFromFile(database, path);
    // After successful backup, remove the database from the array
    const index = databasesUnderBackup.indexOf(database);
    if (index !== -1) {
      databasesUnderBackup.splice(index, 1);
    }
    res.status(200).send({ message: "Restore successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const backupNow = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const userId = req.headers.userId;

    // Add the database to the array to indicate it's under backup
    databasesUnderBackup.push(database);

    const connectionList = await getConnectionList(database);
    const db = connectionList[database];

    console.log(database);

    console.log("Name :", req.name);
    await performDatabaseDump(database, req.name);

    // After successful backup, remove the database from the array
    const index = databasesUnderBackup.indexOf(database);
    if (index !== -1) {
      databasesUnderBackup.splice(index, 1);
    }

    res.status(200).send({ message: "Backup successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const downloadDump = (req, res) => {
  const { path } = req.body;
  const fileStream = fs.createReadStream(path);
  res.setHeader("Content-disposition", "attachment; filename=sql_dump.sql");
  res.setHeader("Content-type", "application/sql");
  fileStream.pipe(res);
};

module.exports = {
  addBackupConfig,
  getLastBackupConfig,
  getLastBackupDump,
  restoreDump,
  backupNow,
  databasesUnderBackup,
  downloadDump,
};
