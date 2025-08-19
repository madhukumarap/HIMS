const DrugDatabaseController = require("../Controller/DrugDataBaseController");

const db = require("../model/index.model");
const AddDrugToDB = db.addDrugToDB;
const { Op } = require("sequelize");
const { getConnectionList } = require("../model/index.model3");

// router
const router = require("express").Router();

//post drug
router.post("/addDrug", DrugDatabaseController.addDrug);

//update drug by id
router.put("/UpdateDrug/:id", DrugDatabaseController.updateDrug);

router.post("/addDrugSubstitute", DrugDatabaseController.addDrugSubstitute);

//delete drug by id
router.delete("/deletedrugs/:id", DrugDatabaseController.deleteDrugById);

router.get(
  "/getAllSubstitute/:medicineId",
  DrugDatabaseController.getAllsubstitute
);

router.get("/medicine/:id", DrugDatabaseController.getmedicineInfo);

const { DrugDatabase } = db.addDrugToDB; // Assuming you have a DrugDatabase model defined

router.get("/getMedicine/:id", async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const AddDrugToDB = db.addDrugToDB;
    const { DrugDatabase } = db.addDrugToDB;

    const id = req.params.id;
    const medicine = await DrugDatabase.findByPk(id);

    if (!medicine) {
      res.status(404).json({ message: "Medicine not found" });
    } else {
      res.json(medicine);
    }
  } catch (error) {
    console.error("Error fetching medicine info:", error);
    res.status(500).send("Error fetching medicine info");
  }
});

//this function used when search drug get it from database by name

router.get("/getMedicine", async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const AddDrugToDB = db.addDrugToDB;
    const { DrugDatabase } = db.addDrugToDB;
    const medicineName = req.query.medicine_name;

    const results = await AddDrugToDB.findAll({
      where: {
        medicineName: {
          [Op.like]: `${medicineName}%`,
        },
      },
    });

    res.json(results);
  } catch (error) {
    console.error("Error fetching medicine info:", error);
    res.status(500).send("Error fetching medicine info");
  }
});

router.get("/drugs", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const AddDrugToDB = db.addDrugToDB;
  const { DrugDatabase } = db.addDrugToDB;

  try {
    // Fetch all drugs from the database
    const drugs = await AddDrugToDB.findAll();

    res.status(200).json(drugs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "public/uploads/" });

router.post("/UploadDrugData", upload.single("file"), async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const AddDrugToDB = db.addDrugToDB;
  const { DrugDatabase } = db.addDrugToDB;

  try {
    // Access the uploaded file using req.file
    const file = req.file;
    console.log(file);

    // Process the file and save the data to the database
    const results = [];

    fs.createReadStream(file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        console.log(results);

        for (const result of results) {
          const {
            medicineName,
            manufacturer,
            saltComposition,
            packaging,
            price,
            storage,
            overview,
            usesBenefits,
            sideEffects,
            howToUse,
            drugWorks,
            safetyAdvice,
            missedDose,
            quickTips,
            interactionDrugs,
            patientConcerns,
            Currency,
          } = result;

          // Check if the medicineName is null or empty
          if (
            !medicineName ||
            !manufacturer ||
            !price ||
            !usesBenefits ||
            !sideEffects
          ) {
            console.log("Skipping row: medicineName is missing");
            continue;
          }

          // Check if a drug with the same medicineName already exists in the database
          const existingDrug = await AddDrugToDB.findOne({
            where: { medicineName },
          });
          if (existingDrug) {
            console.log(
              `Drug with medicineName ${medicineName} already exists. Skipping...`
            );
            continue;
          }

          // Create a new Drug model instance with the provided data
          const newDrug = new AddDrugToDB({
            medicineName,
            manufacturer,
            saltComposition,
            packaging,
            price,
            storage,
            overview,
            usesBenefits,
            sideEffects,
            howToUse,
            drugWorks,
            safetyAdvice,
            missedDose,
            quickTips,
            interactionDrugs,
            patientConcerns,
            Currency: req.body.BaseCurrency,
          });

          // Save the new drug to the database
          const savedDrug = await newDrug.save();

          console.log(savedDrug);
        }

        // Send a success response
        res.status(200).json({ message: "Drug data saved successfully" });
      });
  } catch (error) {
    // Handle any errors
    console.error("Error saving drug data:", error);
    res
      .status(500)
      .json({ message: "An error occurred while saving the drug data" });
  }
});

module.exports = router;
