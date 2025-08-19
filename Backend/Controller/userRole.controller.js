// controllers/userRole.controller.js
const { getConnectionList } = require("../model/index.model3");

const createUserRole = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    if (!database) {
      return res.status(400).json({ error: "Database header is required" });
    }

    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const UserRole = db.userRole;

    const { userId, roleId } = req.body;
    if (!userId || !roleId) {
      return res.status(400).json({ error: "userId and roleId are required" });
    }

    // Check if assignment exists
    const existing = await UserRole.findOne({
      where: { userId, roleId },
    });

    if (existing) {
      return res.status(409).json({ error: "Role already assigned to user" });
    }

    const newUserRole = await UserRole.create({ userId, roleId });
    res.status(201).json(newUserRole);
  } catch (error) {
    console.error("Create UserRole Error:", error);
    res.status(500).json({ error: "Failed to create user role assignment" });
  }
};

const getAllUserRoles = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    if (!database) {
      return res.status(400).json({ error: "Database header is required" });
    }

    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const UserRole = db.userRole;

    const userRoles = await UserRole.findAll();
    res.status(200).json(userRoles);
  } catch (error) {
    console.error("Get All UserRoles Error:", error);
    res.status(500).json({ error: "Failed to fetch user roles" });
  }
};

const getUserRolesByUserId = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    if (!database) {
      return res.status(400).json({ error: "Database header is required" });
    }

    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const UserRole = db.userRole;
    const userId = req.params.userId;

    const userRoles = await UserRole.findAll({ where: { userId } });

    if (!userRoles.length) {
      return res.status(404).json({ error: "No roles found for this user" });
    }

    res.status(200).json(userRoles);
  } catch (error) {
    console.error("Get User Roles Error:", error);
    res.status(500).json({ error: "Failed to fetch user roles" });
  }
};

const deleteUserRole = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    if (!database) {
      return res.status(400).json({ error: "Database header is required" });
    }

    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const UserRole = db.userRole;
    const { userId, roleId } = req.params;

    const deletedCount = await UserRole.destroy({
      where: { userId, roleId },
    });

    if (!deletedCount) {
      return res.status(404).json({ error: "User role assignment not found" });
    }

    res.status(200).json({ message: "Role assignment deleted successfully" });
  } catch (error) {
    console.error("Delete UserRole Error:", error);
    res.status(500).json({ error: "Failed to delete user role assignment" });
  }
};

module.exports = {
  createUserRole,
  getAllUserRoles,
  getUserRolesByUserId,
  deleteUserRole,
};
