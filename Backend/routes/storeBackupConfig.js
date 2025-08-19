const express = require("express");
const { verifyToken } = require("../middleware/authJwt");
const backupController = require("../Controller/storebackupconfigController");

const BackupConfiguration = express.Router();

BackupConfiguration.post(
  "/add-backup-config",
  verifyToken,
  backupController.addBackupConfig
);
BackupConfiguration.get(
  "/get-last-backup-config",
  verifyToken,
  backupController.getLastBackupConfig
);
BackupConfiguration.get(
  "/get-last-backup-Dump",
  verifyToken,
  backupController.getLastBackupDump
);
BackupConfiguration.post(
  "/Restore-Dump",
  verifyToken,
  backupController.restoreDump
);
BackupConfiguration.post(
  "/Backup-Now",
  verifyToken,
  backupController.backupNow
);
BackupConfiguration.post(
  "/download-dump",
  verifyToken,
  backupController.downloadDump
);

module.exports = BackupConfiguration;
