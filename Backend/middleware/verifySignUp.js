const db = require("../model/index.model");
const { getConnectionList } = require("../model/index.model3");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  let mainDatabase = "healthcare";
  let RequestDatabase;
  let hospitals;

  console.log("req.params.ClientID: ", req.params.ClientID);
  // return;
  if (req.params.ClientID === "healthcare") {
    RequestDatabase = mainDatabase;
  } else {
    const hospitalName = req.params.ClientID || req.body.username;
    hospitals = await db.HospitalMain.findOne({
      where: { name: hospitalName },
    });
    if (hospitals?.databaseName) {
      RequestDatabase = hospitals?.databaseName;
    } else {
      const hospitalName = req.params.ClientID || req.body.username;
      hospitals = await db.HospitalMain.findOne({
        where: { databaseName: hospitalName },
      });
      RequestDatabase = hospitals?.databaseName || mainDatabase;
    }
  }

  // return;

  const connectionList = await getConnectionList(RequestDatabase);
  console.log("connection: " + connectionList[RequestDatabase]);
  const con = connectionList[RequestDatabase];

  const ROLE = con.role;
  const User = con.user;
  // Username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!",
        });
        return;
      }

      next();
    });
  });
};

const checkRolesExisted = async (req, res, next) => {
  let mainDatabase = "healthcare";
  let RequestDatabase;
  let hospitals;

  console.log("req.params.ClientID: ", req.params.ClientID);
  // return;
  if (req.params.ClientID === "healthcare") {
    RequestDatabase = mainDatabase;
  } else {
    const hospitalName = req.params.ClientID || req.body.username;
    hospitals = await db.HospitalMain.findOne({
      where: { name: hospitalName },
    });
    RequestDatabase = hospitals?.databaseName || mainDatabase;
  }

  // return;

  const connectionList = await getConnectionList(RequestDatabase);
  console.log("connection: " + connectionList[RequestDatabase]);
  const con = connectionList[RequestDatabase];

  const ROLE = con.role;
  const User = con.user;
  console.log(req.body);

  if (req.body.roles) {
    try {
      const existingRoles = await ROLE.findAll({ attributes: ["role"] });
      const roleNames = existingRoles.map((role) => role.role);

      for (let i = 0; i < req.body.roles.length; i++) {
        if (!roleNames.includes(req.body.roles[i])) {
          res.status(400).send({
            message: "Failed! Role does not exist = " + req.body.roles[i],
          });
          return;
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
      return;
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  verifySignUp,
};
