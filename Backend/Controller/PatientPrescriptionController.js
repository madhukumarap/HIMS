const db = require("../model/index.model.js");
const PaisentPrescription = db.paisentprescription;
const Medecines = db.paitentMedicines;

const { Sequelize, DataTypes } = require("sequelize");
const multer = require("multer");
const path = require("path");
const { getConnectionList } = require("../model/index.model3");

const fs = require("fs");
// image Upload

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /.*/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("image");

//paitent create

const alternativeMedecines = async (req, res) => {
  const { allergies, tablets } = prescriptionData;
  // Do something with the data (e.g. store it in a database)
  console.log(allergies);
  console.log(tablets);
  res.send("Data received!");
};

//one to many mapping in prescription table and medecines
const getOnePrescription = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaisentPrescription = db.paisentprescription;
  const Medecines = db.paitentMedicines;
  const prescription_Id = req.params.prescription_Id;

  try {
    const data = await PaisentPrescription.findOne({
      include: [
        {
          model: Medecines,
          as: "medicines",
        },
      ],
      where: { id: prescription_Id },
    });

    //
    const imagePath = data.image;
    console.log("imagePath=", imagePath);
    let imageBase64;
    if (imagePath) {
      const imageBuffer = fs.readFileSync(imagePath);
      //   console.log("imageBuffer=", imageBuffer == true);
      imageBase64 = imageBuffer.toString("base64");

      // Convert image buffer to base64
      const base64Image = data.image.toString("base64");

      // Add the base64 image to the data object
      data.image = imageBase64;
    }
    // console.log(data.image);
    res.status(200).send(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const getPatientIfNotDispensed = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaisentPrescription = db.paisentprescription;
  const Medecines = db.paitentMedicines;
  try {
    const searchQuery = req.query.search;

    // Find patients based on the search query and status condition
    const filteredPatients = await PaisentPrescription.findAll({
      where: {
        PatientName: {
          [Sequelize.Op.like]: `%${searchQuery}%`,
        },
        status: false,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(filteredPatients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMedicineList = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const PaisentPrescription = db.paisentprescription;
    const Medecines = db.paitentMedicines;
    const { id } = req.params;

    // Fetch the medicine list from the database based on the ID
    const medicineList = await Medecines.findAll({
      where: { prescription_Id: id },
    });

    if (medicineList.length === 0) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    // Return the medicine list as the response
    res.json(medicineList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const PrescriptionupdateMedicines = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const PaisentPrescription = db.paisentprescription;
    const Medecines = db.paitentMedicines;
    const updatedMedicines = req.body; // Assuming the request body contains an array of updated medicines

    // Loop through the updated medicines array and update each medicine by its ID
    for (const medicine of updatedMedicines) {
      console.log(medicine);
      const {
        id,
        medicineName,
        quantity,
        dosageAmount,
        startDate,
        food,
        weekly,
        timing,
        InventoryitemNameID,
      } = medicine;

      // Find the medicine by its ID
      const foundMedicine = await Medecines.findByPk(id);
      if (!foundMedicine) {
        return res.status(404).json({ error: "Medicine not found" });
      }

      // Update the medicine with the new values
      foundMedicine.medicineName = medicineName;
      foundMedicine.quantity = quantity;
      foundMedicine.dosageAmount = dosageAmount;
      foundMedicine.startDate = startDate;
      foundMedicine.food = food; //clinical advice
      foundMedicine.weekly = weekly; // no of days to take medicine
      foundMedicine.InventoryitemNameID = InventoryitemNameID;

      // Save the changes
      await foundMedicine.save();
    }

    res.status(200).json({ message: "Medicines updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// API endpoint to save pharmacist remark
const saveRemark = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const PaisentPrescription = db.paisentprescription;
    const Medecines = db.paitentMedicines;
    const { prescriptionId, remark } = req.body;

    // Retrieve the existing remark from the database
    const existingPrescription = await PaisentPrescription.findOne({
      where: { id: prescriptionId },
    });

    let updatedRemark = remark;
    if (existingPrescription && existingPrescription.pharmacistRemark) {
      // Combine existing remark with the new remark, separated by a comma and line break
      updatedRemark = `${existingPrescription.pharmacistRemark},\n${remark}`;
    }

    await PaisentPrescription.update(
      { pharmacistRemark: updatedRemark },
      { where: { id: prescriptionId } }
    );

    res.status(200).send({ message: "Remark saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to save remark" });
  }
};

module.exports = {
  alternativeMedecines,
  getOnePrescription,
  saveRemark,
  getPatientIfNotDispensed,
  upload,
  getMedicineList,
  PrescriptionupdateMedicines,
};
