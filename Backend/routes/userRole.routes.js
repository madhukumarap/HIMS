// routes/userRole.routes.js
const express = require("express");
const router = express.Router();
const userRoleController = require("../Controller/userRole.controller");

// Create a new UserRole
router.post("/", userRoleController.createUserRole); // Changed from 'create'

// Retrieve all UserRoles
router.get("/list", userRoleController.getAllUserRoles); // Changed from 'findAll'

// Retrieve all roles for a specific user
router.get("/user/:userId", userRoleController.getUserRolesByUserId); // Changed from 'findByUserId'

// Delete a UserRole with userId and roleId
router.delete("/:userId/:roleId", userRoleController.deleteUserRole); // Changed from 'delete'

// Note: findByRoleId is not implemented in your controller
// You can either implement it or remove this route
// router.get("/role/:roleId", userRoleController.findByRoleId);

module.exports = router;