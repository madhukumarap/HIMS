const schedule = require("node-schedule");
const mysqldump = require("mysqldump");
const timestamp = require("time-stamp");
const db = require("../model/index.model");
const performDatabaseDump = require("../dump.js");

const { getConnectionList } = require("../model/index.model3");
//check config settings
const CallEveryMin = schedule.scheduleJob("*/1 * * * *", async () => {
  console.log(
    "Task executed daily at 00:00:00:",
    new Date().toLocaleTimeString()
  );

  const hospitals = await db.HospitalMain.findAll();
  // Use map to create an array of promises
  const backupPromises = hospitals.map(async (hospital) => {
    const connectionList = await getConnectionList(hospital.databaseName);
    const db = connectionList[hospital.databaseName];
    const BackupConfig = db.BackupConfig;
    const BackupData = db.BackupData;

    const lastBackupConfig = await BackupConfig.findOne({
      order: [["createdAt", "DESC"]],
      limit: 1,
    });
    const lastBackupDump = await BackupData.findOne({
      order: [["createdAt", "DESC"]],
      limit: 1,
    });
    console.log("lastBackupConfig: ", JSON.stringify(lastBackupConfig));
    console.log("lastBackupDump: ", JSON.stringify(lastBackupDump));

    if (!lastBackupConfig) {
      console.log(
        "No backup configurations found: " + JSON.stringify(hospital)
      );
      return "No backup configurations found";
    }

    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayName = getDayName(dayOfWeek);
    const backupDay = parseInt(lastBackupConfig?.day);

    if (
      (lastBackupConfig?.period === "weekly" &&
        backupDay === dayOfWeek &&
        lastBackupConfig?.time === getCurrentTimeString()) ||
      (lastBackupConfig.period === "daily" &&
        lastBackupDump &&
        lastBackupConfig.time === getCurrentTimeString()) ||
      !lastBackupDump
    ) {
      // await db.user.update({ loggedInStatus: "LoggedOut" });
      console.log(
        "User auto logout successfully on database: " + hospital.databaseName
      );
      const userName = "Backup Configuration";
      return performDatabaseDump(hospital.databaseName, userName);
    }
  });

  // Wait for all promises to resolve
  await Promise.all(backupPromises);
});

const getDayName = (dayValue) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayValue];
};
const getCurrentTimeString = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
