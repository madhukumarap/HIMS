const db = require("../model/index.model");
const config = require("../config/auth.config");
// const { getConnectionList } = require("../model/index.model3");
const nodemailer = require("nodemailer");
const { getConnectionList } = require("../model/index.model3");

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hims.pharmacy.tech@gmail.com",
    pass: "uliiksvpjxgfeizf",
  },
});
exports.signupUI = async (req, res) => {
  console.log("signup----------: " + req.params.ClientID);
  //  return;
  console.log(req.body);
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

  const User = con.user;
  const Role = con.role;

  // Save User to Database
  console.log(req.body);
  console.log(req.body.hospitalId);
  const hospitalID = req.body.hospitalId;
  const roles = req.body.roles;
  //return;
  User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    status: req.body.status
      ? req.body.status
      : roles.includes("patient")
      ? "active"
      : "inactive",
    password: bcrypt.hashSync(req.body.password, 8),
    hospitalId: hospitalID,
  })
    .then((user) => {
      if (req.body.roles && req.body.roles.length > 0) {
        Role.findAll({
          where: {
            role: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            const mailOptions = {
              from: "hims.pharmacy.tech@gmail.com",
              to: req.body.email,
              subject: "Registration Successful",
              html: `
    <h3>Registration Successful - HIMS </h3>
    <p>Your registration with HIMS is complete.</p>
    <p>Your account details:</p>
    <ul>
        <li><strong>Name:</strong> ${req.body.name}</li>
        <li><strong>Username:</strong> ${req.body.username}</li>
        <li><strong>Email:</strong> ${req.body.email}</li>
        <li><strong>Phone Number:</strong>  ${req.body.phoneNumber}</li>
    </ul>
    <p>Please use the provided username to reset your password using forgot password option else Login With Your created password.</p>
    <p>Thank you!</p>
`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log("Error sending  email:", error);
                // res.status(500).json({ message: 'Error sending  email' });
              } else {
                console.log(" email sent:", info.response);
              }
            });

            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // Check if the user registered with the email "admin@gmail.com"
        if (req.body.email === "admin@gmail.com") {
          // Assign both "admin" and "user" roles to the user
          Role.findAll({
            where: {
              role: {
                [Op.or]: ["admin", "user"],
              },
            },
          }).then((roles) => {
            user.setRoles(roles).then(() => {
              res.send({ message: "User was registered successfully!" });
            });
          });
        } else {
          // Default role = "user"
          Role.findOne({ where: { role: "user" } }).then((role) => {
            user.setRoles([role]).then(() => {
              res.send({ message: "User was registered successfully!" });
            });
          });
        }
      }
    })
    .catch((err) => {
      console.error("Error Signup: " + err);
      if (err.name === "SequelizeUniqueConstraintError") {
        res.status(400).send({ message: "Duplicate record found" });
      } else {
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
};
exports.signup = async (req, res) => {
  console.log("signup----------: " + req.params.ClientID);
  //  return;
  console.log(req.body);
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
      where: { databaseName: hospitalName },
    });
    RequestDatabase = hospitals?.databaseName || mainDatabase;
  }

  // return;

  const connectionList = await getConnectionList(RequestDatabase);
  console.log("connection: " + connectionList[RequestDatabase]);
  const con = connectionList[RequestDatabase];

  const User = con.user;
  const Role = con.role;

  // Save User to Database
  console.log(req.body);
  console.log(req.body.hospitalId);
  const hospitalID = req.body.hospitalId;
  const roles = req.body.roles;
  //return;
  User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    countryCode: req.body.countryCode,
    status: req.body.status
      ? req.body.status
      : roles.includes("patient")
      ? "active"
      : "inactive",
    password: bcrypt.hashSync(req.body.password, 8),
    hospitalId: hospitalID,
  })
    .then((user) => {
      if (req.body.roles && req.body.roles.length > 0) {
        Role.findAll({
          where: {
            role: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            const mailOptions = {
              from: "hims.pharmacy.tech@gmail.com",
              to: req.body.email,
              subject: "Registration Successful",
              html: `
    <h3>Registration Successful - HIMS </h3>
    <p>Your registration with HIMS is complete.</p>
    <p>Your account details:</p>
    <ul>
        <li><strong>Name:</strong> ${req.body.name}</li>
        <li><strong>Username:</strong> ${req.body.username}</li>
        <li><strong>Email:</strong> ${req.body.email}</li>
        <li><strong>Phone Number:</strong>  ${req.body.phoneNumber}</li>
    </ul>
    <p>Please use the provided username to reset your password using forgot password option else Login With Your created password.</p>
    <p>Thank you!</p>
`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log("Error sending  email:", error);
                // res.status(500).json({ message: 'Error sending  email' });
              } else {
                console.log(" email sent:", info.response);
              }
            });

            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // Check if the user registered with the email "admin@gmail.com"
        if (req.body.email === "admin@gmail.com") {
          // Assign both "admin" and "user" roles to the user
          Role.findAll({
            where: {
              role: {
                [Op.or]: ["admin", "user"],
              },
            },
          }).then((roles) => {
            user.setRoles(roles).then(() => {
              res.send({ message: "User was registered successfully!" });
            });
          });
        } else {
          // Default role = "user"
          Role.findOne({ where: { role: "user" } }).then((role) => {
            user.setRoles([role]).then(() => {
              res.send({ message: "User was registered successfully!" });
            });
          });
        }
      }
    })
    .catch((err) => {
      console.error("Error Signup: " + err);
      if (err.name === "SequelizeUniqueConstraintError") {
        res.status(400).send({ message: "Duplicate record found" });
      } else {
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
};

exports.signin = async (req, res) => {
  console.log("SignIN: " + req.params.ClientID);
  //  return;
  console.log(req.body);
  let mainDatabase = "healthcare";
  let RequestDatabase;
  let hospitals;

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
  const numberOfConnections = Object.keys(connectionList).length;
  const hospital = con.Hospital;
  const hospitalName = await hospital.findAll();

  console.log("Number of database connections: " + numberOfConnections);
  console.log(con.user,"connectionList[RequestDatabase]");
  console.log("Selected database:", RequestDatabase);
  con.user.findOne({
      where: {
        username: req.body.username,
      },
    })
    .then((user) => {
      console.log("🧠 Login Attempt");
      console.log("➡️ Username (input):", req.body.username);
      console.log("➡️ Password (input):", req.body.password);
      console.log("user", user);
      if (!user) {
        console.log("❌ User not found for username:", req.body.username);
        return res.status(404).send({ message: "Invalid credentials!" });
      }

      console.log("✅ User found:", user.username);
      console.log("🔐 Hashed password in DB:", user.password);

      try {
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        console.log("🔄 Password match result:", passwordIsValid);

        if (!passwordIsValid) {
          console.log("❌ Password did not match");
          return res.status(401).send({
            Token: null,
            message: "Invalid credentials!",
          });
        }
      } catch (err) {
        console.error("💥 bcrypt compareSync error:", err);
        return res.status(500).send({ message: "Internal server error" });
      }

      // Now continue to token generation, role fetching etc.

      if (user.status === "inactive" && user.overlimit === true) {
        console.log("User is inactive and overlimit.");
        return res.status(403).send({
          message:
            "Your hospital reduced active users number. Please contact admin to regain access.",
        });
      }

      if (user.status === "inactive") {
        console.log("User is inactive.");
        return res.status(403).send({
          message:
            "Your profile is deactivated, please contact your administrator",
        });
      }

      // everything is okay here, continue as before...
      else {
        // Update loggedInStatus before returning the token
        user
          .update({
            loggedInStatus: "LoggedIn",
          })
          .then(async () => {
            // Generate token
            const token = jwt.sign(
              {
                id: user.id,
                username: user.username,
                name: user.name,
                userDatabase: RequestDatabase,
                baseCurrency: hospitalName[0]?.baseCurrency,
                hospitalID: hospitalName[0]?.id,
              },
              config.secret,
              {
                expiresIn: 86400, // 24 hours
              }
            );

            // ✅ Get admin role IDs
            const adminRoles = await con.role.findAll({
              where: { role: "admin" },
            });
            const adminRoleIds = adminRoles.map((r) => r.id);

            // ✅ Get admin user IDs from UserRole table
            const adminUserRoles = await con.userRole.findAll({
              where: {
                roleId: {
                  [Op.in]: adminRoleIds,
                },
              },
            });
            const adminUserIds = adminUserRoles.map((ur) => ur.userId);

            // ✅ Check if current user is admin
            const isAdmin = adminUserIds.includes(user.id);

            // ✅ Build authority roles
            const roles = await user.getRoles();
            const authorities = roles.map(
              (r) => "ROLE_" + r.role.toUpperCase()
            );

            // ✅ Show notice only to admin if overlimit
            let adminNotice = "";
            if (isAdmin && user.overlimit === true) {
              adminNotice =
                "Active user limit changed. Users beyond this limit have been deactivated.";
            }

            // ✅ Prepare final response
            const responsePayload = {
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              hospitalId: user.hospitalId,
              phoneNumber: user.phoneNumber,
              countryCode: user.countryCode,
              roles: authorities,
              baseCurrency: hospitalName[0]
                ? hospitalName[0].baseCurrency
                : "INR",
              HospitalName:
                RequestDatabase === "healthcare"
                  ? "healthcare"
                  : hospitals.name,
              Token: token,
            };

            // Include admin message only if applicable
            if (adminNotice) {
              responsePayload.notice = adminNotice;
            }

            res.status(200).send(responsePayload);
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.logout = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];

  const userId = req.userId;

  try {
    const user = await db.user.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Update loggedInStatus to "LoggedOut"
    await user.update({
      loggedInStatus: "LoggedOut",
    });

    res.status(200).send({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getLoggedInStatusByUserId = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];

  const userId = req.userId;
  if (!userId) {
    return res
      .status(400)
      .send({ message: "User ID not provided in headers!" });
  }

  try {
    const user = await db.user.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    res.status(200).send({ loggedInStatus: user.loggedInStatus });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
};
async function waitTwoSeconds() {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
}
