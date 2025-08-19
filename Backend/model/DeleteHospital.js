
// models/deleteHospital.js
const { Sequelize } = require('sequelize');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const dbConfig = require("../config/db.config");

module.exports = (sequelize, HospitalMain) => {
  const deleteHospitalAndDatabase = async (hospitalId) => {
    const transaction = await sequelize.transaction();

    try {
      // 1. Find the hospital first
      const hospital = await HospitalMain.findOne({
        where: { id: hospitalId },
        transaction
      });

      if (!hospital) {
        throw new Error('Hospital not found');
      }

      const dbName = hospital.databaseName;
      const backupDir = path.join(__dirname, '..', 'backups');
      const backupFile = path.join(backupDir, `${dbName}_${Date.now()}.sql`);
      // 2. Ensure backup folder exists
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // 3. Backup database before deleting
      // 3. Backup database before deleting
      await new Promise((resolve, reject) => {
        // NO space between -p and password
        const dumpCommand = `mysqldump -u ${dbConfig.USER} -p${dbConfig.PASSWORD} ${dbName} > "${backupFile}"`;
      
        exec(dumpCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error creating DB backup: ${stderr}`);
            return reject(error);
          }
          console.log(`Database backup created at: ${backupFile}`);
          resolve();
        });
      });
      

      // 4. Delete the hospital record
      await HospitalMain.destroy({
        where: { id: hospitalId },
        transaction
      });

      // 5. Drop the associated database
      await sequelize.query(`DROP DATABASE IF EXISTS \`${dbName}\``, {
        transaction
      });

      await transaction.commit();
      return { 
        success: true, 
        message: 'Hospital deleted and backup saved locally',
        backupFile: backupFile
      };

    } catch (error) {
      await transaction.rollback();
      console.error('Error in deleteHospitalAndDatabase:', error);
      throw error;
    }
  };

  return {
    deleteHospitalAndDatabase
  };
};
