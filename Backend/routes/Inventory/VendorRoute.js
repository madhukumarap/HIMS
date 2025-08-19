const db = require("../../model/index.model");
const { Sequelize, DataTypes } = require("sequelize");
const Vendor = db.VendorList;
const router = require("express").Router();
const { getConnectionList } = require("../../model/index.model3");

// Create a Vendor - POST request
router.post("/CreateVendor", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Vendor = db.VendorList;
  try {
    const {
      vendorName,
      contactAddress,
      contactNumber,
      panNumber,
      bankDetails,
      contactPerson,
      email,
      govtRegDate,
      isActive,
      receiveDonation,
    } = req.body;

    const newVendor = await Vendor.create({
      vendorName,
      contactAddress,
      contactNumber,
      panNumber,
      bankDetails,
      contactPerson,
      email,
      govtRegDate,
      isActive,
      receiveDonation,
    });

    res.status(201).json(newVendor);
  } catch (error) {
    console.error("Error creating Vendor:", error);
    res.status(500).json({ error: "Error creating Vendor" });
  }
});

// Get all Vendors - GET request
router.get("/AllVendors", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Vendor = db.VendorList;
  try {
    const vendors = await Vendor.findAll();
    res.json(vendors);
  } catch (error) {
    console.error("Error fetching Vendors:", error);
    res.status(500).json({ error: "Error fetching Vendors" });
  }
});

// Get Vendor by ID - GET request
router.get("/vendors/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Vendor = db.VendorList;
  const { id } = req.params;
  try {
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json(vendor);
  } catch (error) {
    console.error("Error fetching Vendor by ID:", error);
    res.status(500).json({ error: "Error fetching Vendor by ID" });
  }
});

// Update Vendor by ID - PUT request
router.put("/UpdateVendor/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Vendor = db.VendorList;
  const { id } = req.params;
  try {
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    // Destructure the updated fields from req.body
    const {
      vendorName,
      contactAddress,
      contactNumber,
      panNumber,
      bankDetails,
      contactPerson,
      email,
      govtRegDate,
      isActive,
      receiveDonation,
    } = req.body;

    // Update the Vendor attributes
    vendor.vendorName = vendorName || vendor.vendorName;
    vendor.contactAddress = contactAddress || vendor.contactAddress;
    vendor.contactNumber = contactNumber || vendor.contactNumber;
    vendor.panNumber = panNumber || vendor.panNumber;
    vendor.bankDetails = bankDetails || vendor.bankDetails;
    vendor.contactPerson = contactPerson || vendor.contactPerson;
    vendor.email = email || vendor.email;
    vendor.govtRegDate = govtRegDate || vendor.govtRegDate;
    vendor.isActive = isActive || vendor.isActive;
    vendor.receiveDonation = receiveDonation || vendor.receiveDonation;

    // Save the updated Vendor
    await vendor.save();

    // Fetch and return the updated Vendor
    const updatedVendor = await Vendor.findByPk(id);
    res.json(updatedVendor);
  } catch (error) {
    console.error("Error updating Vendor:", error);
    res.status(500).json({ error: "Error updating Vendor" });
  }
});

// Delete Vendor by ID - DELETE request
router.delete("/deleteVendor/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Vendor = db.VendorList;
  const { id } = req.params;
  try {
    const deleted = await Vendor.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting Vendor:", error);
    res.status(500).json({ error: "Error deleting Vendor" });
  }
});

module.exports = router;
