const express = require("express");
const router = express.Router();
const db = require("../model/index.model.js");
const { getConnectionList } = require("../model/index.model3");

const CreateVaccinationPatient = db.CreateVaccinationPatient; // Import your Sequelize model

// Create a new vaccination patient
router.post("/CreateVaccinationPatient", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CreateVaccinationPatient = db.CreateVaccinationPatient;
  try {
    const {
      motherName,
      babyName,
      age,
      gender,
      address,
      vaccinationRegNo,
      fatherName,
      phoneNumber,
      ageOption,
    } = req.body;

    const newPatient = await CreateVaccinationPatient.create({
      motherName,
      babyName,
      age,
      gender,
      address,
      vaccinationRegNo,
      fatherName,
      phoneNumber,
      ageOption,
    });

    res.status(201).json(newPatient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all vaccination patients
router.get("/vaccinationPatients", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CreateVaccinationPatient = db.CreateVaccinationPatient;
  try {
    const allPatients = await CreateVaccinationPatient.findAll();
    res.status(200).json(allPatients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a vaccination patient by ID
router.get("/vaccinationPatients/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CreateVaccinationPatient = db.CreateVaccinationPatient;
  const { id } = req.params;
  try {
    const patient = await CreateVaccinationPatient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a vaccination patient by ID
router.put("/vaccinationPatients/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CreateVaccinationPatient = db.CreateVaccinationPatient;
  const { id } = req.params;
  try {
    const patient = await CreateVaccinationPatient.findByPk(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.motherName = req.body.motherName || patient.motherName;
    patient.babyName = req.body.babyName || patient.babyName;
    patient.age = req.body.age || patient.age;
    patient.gender = req.body.gender || patient.gender;
    patient.address = req.body.address || patient.address;
    patient.vaccinationRegNo =
      req.body.vaccinationRegNo || patient.vaccinationRegNo;
    patient.fatherName = req.body.fatherName || patient.fatherName;
    patient.phoneNumber = req.body.phoneNumber || patient.phoneNumber;
    patient.ageOption = req.body.ageOption || patient.ageOption;

    await patient.save();
    console.log("Updated");
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a vaccination patient by ID
router.delete("/vaccinationPatients/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const CreateVaccinationPatient = db.CreateVaccinationPatient;
  const { id } = req.params;
  try {
    const deleted = await CreateVaccinationPatient.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
