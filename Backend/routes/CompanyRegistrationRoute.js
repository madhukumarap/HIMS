const db = require("../model/index.model.js");
const CompanyRegistrationModel = db.CompanyRegistration;

const router = require("express").Router();
const { getConnectionList } = require("../model/index.model3");

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const { compareSync } = require("bcryptjs");
const app = express();
const upload = multer({ dest: "public/images" });

// Enable CORS
app.use(cors());

// Create a new company registration record
router.post("/createCompany", upload.single("logo"), async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CompanyRegistrationModel = db.CompanyRegistration;

  try {
    const file = req.file;
    const formData = req.body;

    console.log(formData);

    const image = file;
    let imageBuffer = "";

    if (image) {
      try {
        imageBuffer = await fs.promises.readFile(image.path);
      } catch (error) {
        console.log("Error reading the image file:", error);
      }
    } else {
      console.log("Image file does not exist.");
    }

    const company = await CompanyRegistrationModel.create({
      companyName: formData.companyName,
      industryType: formData.industry,
      Address: formData.address,
      registrationNo: formData.registrationNo,
      email: formData.email,
      website: formData.website,
      logo: imageBuffer,
      PAN_TAN: formData.PAN_TAN,
      phone: formData.phone,
      landline: formData.landline,
      countryCode:formData.countryCode
    });

    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      data: company,
    });
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Retrieve all registered companies
router.get("/getAllCompanies", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CompanyRegistrationModel = db.CompanyRegistration;
  try {
    const companies = await CompanyRegistrationModel.findAll();

    const companiesWithImages = companies.map((company) => {
      return {
        id: company.id,
        companyName: company.companyName,
        industryType: company.industryType,
        Address: company.Address,
        registrationNo: company.registrationNo,
        email: company.email,
        website: company.website,
        logo: company.logo.toString("base64"),
        PAN_TAN: company.PAN_TAN,
        phone: company.phone,
        landline: company.landline,
        countryCode : company.countryCode
      };
    });
    res.json({ success: true, data: companiesWithImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Delete a company registration record by ID
router.delete("/deleteCompany/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CompanyRegistrationModel = db.CompanyRegistration;
  try {
    const companyId = req.params.id;

    const company = await CompanyRegistrationModel.findByPk(companyId);

    if (!company) {
      return res
        .status(404)
        .json({ success: false, error: "Company not found" });
    }

    await company.destroy();

    res.json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Update a company registration record by ID
router.put("/updateCompany/:id", upload.single("logo"), async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CompanyRegistrationModel = db.CompanyRegistration;
  try {
    const companyId = req.params.id;
    const file = req.file;
    const formData = req.body;

    const company = await CompanyRegistrationModel.findByPk(companyId);

    if (!company) {
      return res
        .status(404)
        .json({ success: false, error: "Company not found" });
    }

    company.companyName = formData.companyName;
    company.industryType = formData.industry;
    company.Address = formData.address;
    company.registrationNo = formData.registrationNo;
    company.email = formData.email;
    company.website = formData.website;
    company.PAN_TAN = formData.PAN_TAN;
    company.phone = formData.phone;
    company.landline = formData.landline;
    company.countryCode = formData.countryCode;

    if (file) {
      const imageBuffer = await fs.promises.readFile(file.path);
      company.logo = imageBuffer;
    }

    await company.save();

    res.json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Get the last created company registration record
router.get("/getLastCreatedCompany", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CompanyRegistrationModel = db.CompanyRegistration;
  try {
    const lastCreatedCompany = await CompanyRegistrationModel.findOne({
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    if (!lastCreatedCompany) {
      return res
        .status(404)
        .json({ success: false, error: "No companies found" });
    }

    const companyWithImage = {
      id: lastCreatedCompany.id,
      companyName: lastCreatedCompany.companyName,
      industryType: lastCreatedCompany.industryType,
      Address: lastCreatedCompany.Address,
      registrationNo: lastCreatedCompany.registrationNo,
      email: lastCreatedCompany.email,
      website: lastCreatedCompany.website,
      logo: lastCreatedCompany.logo.toString("base64"),
      PAN_TAN: lastCreatedCompany.PAN_TAN,
      phone: lastCreatedCompany.phone,
      landline: lastCreatedCompany.landline,
    };

    res.json({ success: true, data: companyWithImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
