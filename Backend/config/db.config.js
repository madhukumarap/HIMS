// config/db.config.js
const mysql = require("mysql");
require('dotenv').config(); // Load environment variables

module.exports = {
  // Database configuration
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "1234", // Use DB_PASSWORD from env
  DB: process.env.DB_NAME || "healthcare",
  dialect: "mysql",
  
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  // Orthanc DICOM server configuration - ADD THESE LINES
  orthancUrl: process.env.ORTHANC_URL || "http://localhost:8042",
  orthancLocal: process.env.ORTHANC_LOCAL || "http://localhost:8042",
  orthancUser: process.env.ORTHANC_USER || "",
  orthancPass: process.env.ORTHANC_PASS || "",
};