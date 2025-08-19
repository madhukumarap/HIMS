// import controllers inventry
const db = require("../../model/index.model");
const { Sequelize, DataTypes } = require("sequelize");
const CompanyItem = db.CompanyItem;
// router
const router = require("express").Router();
const { getConnectionList } = require("../../model/index.model3");

// Create a CompanyItem - POST request
router.post("/CreateCompanyItem", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CompanyItem = db.CompanyItem;
  try {
    const { name, code, address, email, contactNo, description, logo } =
      req.body;
    console.log(req.body);
    // Assuming you have initialized Sequelize and defined CompanyItem model
    const newCompanyItem = await CompanyItem.create({
      name,
      code,
      address,
      email,
      contactNo,
      description,
      logo,
    });

    res.status(201).json(newCompanyItem);
  } catch (error) {
    console.error("Error creating CompanyItem:", error);
    res.status(500).json({ error: "Error creating CompanyItem" });
  }
});

// Get all CompanyItems - GET request
router.get("/AllcompanyItem", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CompanyItem = db.CompanyItem;
  try {
    console.log("hello");
    const companyItems = await CompanyItem.findAll();
    res.json(companyItems);
  } catch (error) {
    console.error("Error fetching CompanyItems:", error);
    res.status(500).json({ error: "Error fetching CompanyItems" });
  }
});

// Get CompanyItem by ID - GET request
router.get("/companyItems/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CompanyItem = db.CompanyItem;
  const { id } = req.params;
  try {
    const companyItem = await CompanyItem.findByPk(id);
    if (!companyItem) {
      return res.status(404).json({ error: "CompanyItem not found" });
    }
    res.json(companyItem);
  } catch (error) {
    console.error("Error fetching CompanyItem by ID:", error);
    res.status(500).json({ error: "Error fetching CompanyItem by ID" });
  }
});

// Update CompanyItem by ID - PUT request
router.put("/UpdatecompanyItem/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CompanyItem = db.CompanyItem;
  const { id } = req.params;
  try {
    const companyItem = await CompanyItem.findByPk(id);
    if (!companyItem) {
      return res.status(404).json({ error: "CompanyItem not found" });
    }

    // Destructure the updated fields from req.body
    const { name, code, address, email, contactNo, description, logo } =
      req.body;

    // Update the CompanyItem attributes
    companyItem.name = name || companyItem.name;
    companyItem.code = code || companyItem.code;
    companyItem.address = address || companyItem.address;
    companyItem.email = email || companyItem.email;
    companyItem.contactNo = contactNo || companyItem.contactNo;
    companyItem.description = description || companyItem.description;
    companyItem.logo = logo || companyItem.logo;

    // Save the updated CompanyItem
    await companyItem.save();

    // Fetch and return the updated CompanyItem
    const updatedCompanyItem = await CompanyItem.findByPk(id);
    res.json(updatedCompanyItem);
  } catch (error) {
    console.error("Error updating CompanyItem:", error);
    res.status(500).json({ error: "Error updating CompanyItem" });
  }
});

// Delete CompanyItem by ID - DELETE request
router.delete("/deletecompanyItem/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CompanyItem = db.CompanyItem;
  const { id } = req.params;
  try {
    const deleted = await CompanyItem.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "CompanyItem not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting CompanyItem:", error);
    res.status(500).json({ error: "Error deleting CompanyItem" });
  }
});

module.exports = router;
