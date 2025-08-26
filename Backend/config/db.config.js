const mysql = require("mysql");
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "silfra@123", // silfra@123
  DB: "healthcare", //database name
  dialect: "mysql",

  //
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
