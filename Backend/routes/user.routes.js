const authJwt = require("../middleware/authJwt");
const controller = require("../Controller/user.controller");
const db = require("../model/index.model");
const { getConnectionList } = require("../model/index.model3");
const express = require("express");
const router = express.Router();

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/doctor",
    [authJwt.verifyToken, authJwt.isDoctor],
    controller.DoctorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get(
    "/api/test/Pharmacist",
    [authJwt.verifyToken, authJwt.isPharmacist],
    controller.PharmacistBoard
  );

  app.get(
    "/api/test/Patient",
    [authJwt.verifyToken, authJwt.isPatient],
    controller.PatientBoard
  );

  //get all users
  app.get("/api/users", async (req, res) => {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];

    const Role = db.role;
    const User = db.user;

    try {
      // Fetch users from the database
      const users = await User.findAll();

      // Send the list of users as a response
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // delete User By Id
  app.delete("/api/deleteUser/:id", async (req, res) => {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];

    const Role = db.role;
    const User = db.user;

    const userId = req.params.id;

    try {
      const deletedUser = await User.destroy({
        where: {
          id: userId,
        },
      });

      if (deletedUser === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.json({ message: "User deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Route to add a new role
  app.post(
    "/api/role",
    [authJwt.verifyToken, authJwt.isAdmin],
    async (req, res) => {
      const database = req.headers.userDatabase;
      const connectionList = await getConnectionList(database);
      const db = connectionList[database];

      const Role = db.role;
      const User = db.user;

      const { role } = req.body;

      try {
        // Create the role
        const newRole = await Role.create({ role });

        // Send the response
        res.status(201).json(newRole);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  var bcrypt = require("bcryptjs");

  app.put("/api/update-profile", async (req, res) => {
    console.log(req.headers.userDatabase);
    //return;
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];

    const Role = db.role;
    const User = db.user;

    try {
      // Get the username from the request body
      const { username } = req.body;

      // Find the user by username
      const user = await User.findOne({ where: { username } });

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the user's profile data
      user.name = req.body.name;
      user.email = req.body.email;
      user.phoneNumber = req.body.phoneNumber;

      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      } // Save the updated user profile
      await user.save();

      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(
    "/api/update-status",
    [authJwt.verifyToken, authJwt.isAdmin],
    async (req, res) => {
      const database = req.headers.userDatabase;
      const connectionList = await getConnectionList(database);
      const db = connectionList[database];

      const Role = db.role;
      const User = db.user;

      try {
        // Get the username from the request body
        const { username } = req.body;

        // Find the user by username
        const user = await User.findOne({ where: { username } });

        // Check if the user exists
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        user.status = req.body.status;

        await user.save();

        return res
          .status(200)
          .json({ message: "Profile updated successfully" });
      } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/roles",
    [authJwt.verifyToken, authJwt.isAdmin],
    async (req, res) => {
      const database = req.headers.userDatabase;
      const connectionList = await getConnectionList(database);
      const db = connectionList[database];

      const Role = db.role;
      const User = db.user;

      try {
        // Find all roles in the database
        const roles = await Role.findAll();

        // Send the response
        res.send(roles);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.put(
    "/users/:username",
    [authJwt.verifyToken, authJwt.isAdmin],
    async (req, res) => {
      const database = req.headers.userDatabase;
      const connectionList = await getConnectionList(database);
      const db = connectionList[database];

      const Role = db.role;
      const User = db.user;

      const username = req.params.username;
      const { roleName } = req.body;

      try {
        // Find the user and the new role in the database
        const user = await User.findOne({ where: { username } });
        const newRole = await Role.findOne({ where: { role: roleName } });

        if (!user || !newRole) {
          return res.status(404).json({ error: "User or role not found." });
        }

        // Get the existing roles of the user
        const existingRoles = await user.getRoles();

        // Remove the existing roles from the user
        await user.removeRoles(existingRoles);

        // Assign the new role to the user
        await user.addRole(newRole);

        res.json({ message: "Role assigned successfully." });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to assign role." });
      }
    }
  );

  var bcrypt = require("bcryptjs");

  app.put("/user/:username", async (req, res) => {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];

    const Role = db.role;
    const User = db.user;

    try {
      const { username } = req.params;
      const { password } = req.body;

      // Find the user by username
      const user = await User.findOne({ where: { username } });
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a salt and hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();
      console.log(user);
      return res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/hospitals/:id/active-count", async (req, res) => {
    const database = req.headers.userdatabase; // header key should be lowercase
    if (!database)
      return res.status(400).json({ error: "Database header missing" });

    try {
      const connectionList = await getConnectionList(database);

      const db = connectionList[database]; // ✅ define db first
      if (!db) {
        return res.status(400).json({ error: "Database not found in pool" });
      }

      // ✅ Log DB info *after* db is defined
      // console.log("Using Sequelize DB:", db.sequelize.config.database);
      // console.log("Connected Host:", db.sequelize.config.host);

      const User = db.user;

      // Check if column exists
      const tableDescription = await User.describe();

      const whereClause = {
        status: "active",
      };

      if (tableDescription.overlimit) {
        whereClause.overlimit = false;
      }

      const count = await User.count({ where: whereClause });

      // console.log("✅ Active user count:", count); // Optional log
      res.json({ count });
    } catch (error) {
      console.error("❌ Database error:", error);
      res.status(500).json({
        error: "Failed to count active users",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  });

  const { Op } = require("sequelize");

  app.post("/api/hospitals/:id/reduce-users", async (req, res) => {
    const database = req.headers.userdatabase || req.headers.userDatabase;
    const { newLimit } = req.body;

    if (!database) {
      return res.status(400).json({ error: "Database header missing" });
    }

    try {
      const connectionList = await getConnectionList(database);
      const db = connectionList[database];

      // Models
      const User = db.user;
      const Role = db.role;
      const UserRole = db.userRole; // ✅ this fixes the TypeError

      console.log("✅ Connected DB:", db.sequelize.config.database);

      // Step 1: Get active users sorted by newest first
      const activeUsers = await User.findAll({
        where: {
          status: "active",
          overlimit: false,
        },
        order: [["updatedAt", "DESC"]],
      });

      const activeUserCount = activeUsers.length;
      console.log("🔢 Active user count:", activeUserCount);

      if (activeUserCount <= newLimit) {
        return res.json({
          success: true,
          message: "No users need to be deactivated",
          deactivatedUsers: [],
        });
      }

      // Step 2: Get admin role IDs
      const adminRoles = await Role.findAll({ where: { role: "admin" } });
      const adminRoleIds = adminRoles.map((r) => r.id);
      console.log("🛡️ Admin role IDs:", adminRoleIds);

      // Step 3: Get user IDs who have admin roles
      const adminUserRoles = await UserRole.findAll({
        where: {
          roleId: {
            [Op.in]: adminRoleIds,
          },
        },
      });

      const adminUserIds = adminUserRoles.map((ur) => ur.userId);
      console.log("🧑‍💼 Admin user IDs:", adminUserIds);

      // Step 4: Deactivate extra users (newest first, skipping admin + overtime)
      const excessCount = activeUserCount - newLimit;
      const deactivatedUsers = [];

      for (const user of activeUsers) {
        if (deactivatedUsers.length >= excessCount) break; // ✅ done deactivating required number

        if (adminUserIds.includes(user.id)) {
          console.log(`⏭️ Skipping admin user ${user.id}`);
          continue;
        }

        if (user.overtime) {
          console.log(`⏭️ Skipping overtime user ${user.id}`);
          continue;
        }

        await user.update({
          status: "inactive",
          overlimit: true,
        });

        console.log(`✅ Deactivated user ${user.id}`);
        deactivatedUsers.push(user.id);
      }

      res.json({
        success: true,
        message: `Deactivated ${deactivatedUsers.length} newest non-admin users`,
        deactivatedUsers,
      });
    } catch (error) {
      console.error("❌ Error reducing users:", error);
      res.status(500).json({ error: "Failed to reduce user count" });
    }
  });

  app.post("/api/hospitals/:id/extend-users", async (req, res) => {
    const database = req.headers.userdatabase || req.headers.userDatabase;
    const { newLimit } = req.body;

    if (!database) {
      return res.status(400).json({ error: "Database header missing" });
    }

    try {
      const connectionList = await getConnectionList(database);
      const db = connectionList[database];

      const User = db.user;

      console.log("✅ Connected DB:", db.sequelize.config.database);

      // Step 1: Count how many active users are not overlimit
      const activeCount = await User.count({
        where: {
          status: "active",
          overlimit: false,
        },
      });

      const slotsToFree = newLimit - activeCount;

      console.log("📈 Current active users:", activeCount);
      console.log("🪄 Slots to bring back from overlimit:", slotsToFree);

      if (slotsToFree <= 0) {
        return res.json({
          success: true,
          message: "No overlimit users need to be reactivated",
          updatedUsers: [],
        });
      }

      // Step 2: Get oldest overlimit users
      const overlimitUsers = await User.findAll({
        where: {
          status: "inactive",
          overlimit: true,
        },
        order: [["updatedAt", "ASC"]],
        limit: slotsToFree,
      });

      const updatedUsers = [];

      for (const user of overlimitUsers) {
        await user.update({
          overlimit: false,
          status: "active",
        });
        updatedUsers.push(user.id);
      }

      res.json({
        success: true,
        message: `Reactivated ${updatedUsers.length} overlimit users`,
        updatedUsers,
      });
    } catch (error) {
      console.error("❌ Error extending users:", error);
      res.status(500).json({ error: "Failed to extend user count" });
    }
  });

  // routes/user.routes.js
  // ✅ Now use router.get(...) instead of app.get(...)
  router.get("/notice", [authJwt.verifyToken], async (req, res) => {
    const database = req.headers.userdatabase || req.headers.userDatabase;

    if (!database) {
      return res.status(400).json({ message: "Database header missing" });
    }

    const connectionList = await getConnectionList(database);
    const db = connectionList[database];

    if (!db) {
      return res
        .status(400)
        .json({ message: "Invalid or missing DB connection" });
    }

    // ✅ Log which DB this is using
    console.log("Connected to DB:", db.sequelize.config.database);

    const user = await db.user.findByPk(req.userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // ✅ Models
    const User = db.user;
    const Role = db.role;
    const UserRole = db.userRole;

    // ✅ Step 1: Check if logged-in user is admin
    const adminRoles = await Role.findAll({ where: { role: "admin" } });
    const adminRoleIds = adminRoles.map((r) => r.id);

    const userRoles = await UserRole.findAll({
      where: {
        roleId: adminRoleIds,
        userId: user.id,
      },
      // raw: true ← ❌ don't use this here
    });

    // 🧠 Safe check to determine if admin
    const isAdmin = userRoles.some((ur) =>
      adminRoleIds.includes(ur.dataValues.roleId)
    );

    console.log("🔐 isAdmin:", isAdmin);

    if (!isAdmin) {
      return res.json({ showNotice: false });
    }

    // ✅ Step 2: Check if any users in DB have overlimit = true
    const overlimitUsers = await db.user.findAll({
      where: { overlimit: true },
      attributes: ["id", "username", "name"],
    });

    if (overlimitUsers.length > 0) {
      return res.json({
        showNotice: true,
        message:
          "Active user limit changed. Users beyond this limit have been deactivated.",
        affectedUsers: overlimitUsers,
      });
    }

    return res.json({ showNotice: false });
  });

  // Add more router.get/post/put(...) here

  // ✅ Export the router
  module.exports = router;
};
