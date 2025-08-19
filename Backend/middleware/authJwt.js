const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../model/index.model.js");
const User = db.user;
const { getConnectionList } = require("../model/index.model3");

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  console.log(req.headers.authorization);
  let token = authorizationHeader?.split(" ")[1];
  if (!token) {
    token = authorizationHeader;
  }

  console.log(token);
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    console.log("-//////////----------" + decoded.userDatabase, decoded);
    req.userId = decoded.id;
    req.headers.userDatabase = decoded?.userDatabase;
    req.database = decoded?.userDatabase;
    req.name = decoded.name;
    req.headers.userId = decoded.id;
    req.headers.backupdatabase = decoded?.userDatabase; //use for when doing backup
    req.currency = decoded?.baseCurrency; 
    req.hospitalID = decoded?.hospitalID; 
    next();
  });
};

const checkDatabase = (req) => {
  const authorizationHeader = req.headers.authorization;
  console.log(req.headers.authorization);
  let token = authorizationHeader?.split(" ")[1];
  if (!token) {
    token = authorizationHeader;
  }

  console.log(token);
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      // return res.status(401).send({
      //   message: "Unauthorized!",
      // });
      console.log("Unauthorized");
    } else {
      return decoded?.userDatabase;
    }
    // console.log("-//////////----------" + decoded.userDatabase);
    // req.userId = decoded.id;
    // req.headers.userDatabase = decoded?.userDatabase;
    // req.database = decoded?.userDatabase
    // req.name = decoded.name
  });
};

const isAdmin = async (req, res, next) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];

  const ROLE = db.role;
  const User = db.user;
  User.findByPk(req.userId)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].role === "admin") {
            next();
            return;
          }
        }

        return res.status(403).send({
          message: "Require Admin Role!",
        });
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
};

const isSuperAdmin = async (req, res, next) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const ROLE = db.role;
  const User = db.user;
  User.findByPk(req.userId)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].role === "admin") {
            next();
            return;
          }
        }

        return res.status(403).send({
          message: "Require Super Admin Role!",
        });
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
};

const isDoctor = async (req, res, next) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const ROLE = db.role;
  const User = db.user;
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].role === "doctor") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Doctor Role!",
      });
    });
  });
};

const isPharmacist = async (req, res, next) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const ROLE = db.role;
  const User = db.user;
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].role === "pharmacist") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Pharmacist Role!",
      });
    });
  });
};

const isPatient = async (req, res, next) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const ROLE = db.role;
  const User = db.user;
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].role === "patient") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Patient Role!",
      });
    });
  });
};

const isPharmacistOrAdmin = async (req, res, next) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const ROLE = db.role;
  const User = db.user;
  User.findByPk(req.userId).then((user) => {
    console.log(req.userId);
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].role === "pharmacist") {
          next();
          return;
        }

        if (roles[i].role === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Pharmacist or Admin Role!",
      });
    });
  });
};

const isDoctorOrAdmin = async (req, res, next) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const ROLE = db.role;
  const User = db.user;
  User.findByPk(req.userId).then((user) => {
    console.log(req.userId);
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].role === "doctor") {
          next();
          return;
        }

        if (roles[i].role === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Doctor or Admin Role!",
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isDoctor: isDoctor,
  isPharmacist: isPharmacist,
  isPatient: isPatient,
  isPharmacistOrAdmin: isPharmacistOrAdmin,
  isDoctorOrAdmin: isDoctorOrAdmin,
};
module.exports = {
  isDoctorOrAdmin,
  verifyToken,
  isAdmin,
  isDoctor,
  isPharmacist,
  isPatient,
  isPharmacistOrAdmin,
  isSuperAdmin,
  checkDatabase,
};
