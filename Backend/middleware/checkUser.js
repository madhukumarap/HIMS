const dbConfig = require("../config/db.config");
const config = require("../config/auth.config");
const { checkUserRole } = require("../model/index.model");
const db = require("../model/index.model");
const jwt = require("jsonwebtoken");
const { Sequelize, DataTypes } = require("sequelize");

const checkUser = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  let token = authorizationHeader?.split(" ")[1];

  if (!token) {
    token = authorizationHeader;
  }
  let HospitalName;
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }

    console.log("ClientName: " + decoded?.userDatabase);
    HospitalName = decoded?.userDatabase;
    console.log("--------HospitalName------" + JSON.stringify(decoded));
  });
  return HospitalName;
};

module.exports = { checkUser };
