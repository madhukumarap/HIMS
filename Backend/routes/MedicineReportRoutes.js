const express = require("express");
const router = express.Router();
const db = require("../model/index.model");
const { getConnectionList } = require("../model/index.model3");
const PatientPrescription = db.paisentprescription;
const PrescriptionMedicationR = db.prescriptionMedicationRecord;
const MedicationMedicine = db.paitentMedicines;
const MedicationDay = db.medicationday;

router.get("/listPrescription", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PatientPrescription = db.paisentprescription;
  const PrescriptionMedicationR = db.prescriptionMedicationRecord;
  const MedicationMedicine = db.paitentMedicines;
  const MedicationDay = db.medicationday;

  try {
    const prescriptions = await PatientPrescription.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/medications", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PatientPrescription = db.paisentprescription;
  const PrescriptionMedicationR = db.prescriptionMedicationRecord;
  const MedicationMedicine = db.paitentMedicines;
  const MedicationDay = db.medicationday;
  try {
    const data = req.body;
    console.log(data);

    for (const medicine of data) {
      const {
        id,
        patient_Id,
        prescription_Id,
        dosageAmount,
        food,
        medicineName,
        days,
      } = medicine;

      for (const day of days) {
        const { date, morningTime, afternoonTime, eveningTime, nightTime } =
          day;

        if (!date) {
          // Skip the iteration if the date is null or undefined
          continue;
        }

        // Check if the date is valid
        const validDate = new Date(date).toString() !== "Invalid Date";

        if (!validDate) {
          // Skip the iteration if the date is invalid
          continue;
        }

        // Check if the MedicationDay entry already exists for the medicineId and date
        const existingMedicationDay = await MedicationDay.findOne({
          where: { medicineId: id, date },
        });

        if (existingMedicationDay) {
          // Update the times if they are not null or empty
          if (morningTime) existingMedicationDay.morningTime = morningTime;
          if (afternoonTime)
            existingMedicationDay.afternoonTime = afternoonTime;
          if (eveningTime) existingMedicationDay.eveningTime = eveningTime;
          if (nightTime) existingMedicationDay.nightTime = nightTime;

          await existingMedicationDay.save();
        } else {
          // Create a new MedicationDay entry
          await MedicationDay.create({
            medicineId: id,
            PatientId: patient_Id,
            PrescriptionId: prescription_Id,
            dosageAmount,
            food,
            medicineName,
            date,
            morningTime: morningTime || "00:00:00",
            afternoonTime: afternoonTime || "00:00:00",
            eveningTime: eveningTime || "00:00:00",
            nightTime: nightTime || "00:00:00",
          });
        }
      }
    }

    res.status(200).json({ message: "Data stored successfully." });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
});

// Define route to get Medicines by prescription_Id
router.get("/medicines/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PatientPrescription = db.paisentprescription;
  const PrescriptionMedicationR = db.prescriptionMedicationRecord;
  const MedicationMedicine = db.paitentMedicines;
  const MedicationDay = db.medicationday;
  const { id } = req.params;

  try {
    // Retrieve Medicines with matching prescription_Id from the database
    const medicines = await MedicationMedicine.findAll({
      where: {
        prescription_Id: id,
      },
    });

    // Add the days field to each Medicine
    const medicinesWithDays = medicines.map((medicine) => {
      return {
        ...medicine.toJSON(),
        days: [
          {
            date: "",
            morningTime: "",
            afternoonTime: "",
            eveningTime: "",
            nightTime: "",
          },
        ],
      };
    });

    // Send the Medicines with days as the API response
    res.json(medicinesWithDays);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getMedicationData/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PatientPrescription = db.paisentprescription;
  const PrescriptionMedicationR = db.prescriptionMedicationRecord;
  const MedicationMedicine = db.paitentMedicines;
  const MedicationDay = db.medicationday;
  const prescriptionId = req.params.id;
  console.log(prescriptionId);
  try {
    const data = await PatientPrescription.findOne({
      include: [
        {
          model: MedicationDay,
          as: "medicationdays",
        },
      ],
      where: { id: prescriptionId },
    });
    const imagePath = data?.image;

    // Convert image buffer to base64

    if (imagePath) {
      const imageBuffer = fs.readFileSync(imagePath);
      //   console.log("imageBuffer=", imageBuffer == true);
      const imageBase64 = imageBuffer.toString("base64");
      data.image = base64Image;
    }
    // Add the base64 image to the data object

    res.status(200).send(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
