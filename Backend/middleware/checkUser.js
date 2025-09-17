const dbConfig = require("../config/db.config");
const config = require("../config/auth.config");
const { checkUserRole } = require("../model/index.model");
const db = require("../model/index.model");
const jwt = require("jsonwebtoken");
const { Sequelize, DataTypes } = require("sequelize");

const checkUser = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  let token = authorizationHeader?.split(" ")[1] || authorizationHeader;

  if (!token) {
    return res.status(401).send({ message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    req.HospitalName = decoded.userDatabase; // attach to request
    next(); // call next middleware/controller
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
};

module.exports = { checkUser };
