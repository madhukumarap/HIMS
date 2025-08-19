const PaitentPrController = require("../Controller/PatientPrescriptionController.js");

// Configure the storage for uploaded files

// router
const router = require("express").Router();

router.post("/saveRemark", PaitentPrController.saveRemark);

//create prescription
//router.post("/postPaitentPrecription", PaitentPrController.upload, PaitentPrController.createPaitentPrescription);

// //create alternative medecine for allergy patient
router.post("/alternativeMedecines", PaitentPrController.alternativeMedecines);

//get prescription with medecines
router.get(
  "/getOnePrescription/:prescription_Id",
  PaitentPrController.getOnePrescription
);

router.get(
  "/getPatientIfNotDispensed",
  PaitentPrController.getPatientIfNotDispensed
);

router.get("/getMedicineList/:id", PaitentPrController.getMedicineList);

router.put("/updateMedicines", PaitentPrController.PrescriptionupdateMedicines);

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const app = express();
// const upload = multer({ dest: "public/images" }); // Set the destination folder for uploaded images
//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    // console.log;
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//
// Enable CORS
app.use(cors());
const db = require("../model/index.model.js");
const { getConnectionList } = require("../model/index.model3");

const Medecines = db.paitentMedicines;
const PaitentReg = db.paitentReg;
const PaisentPrescription = db.paisentprescription;
const DoctorsAppointment = db.DoctorsAppointment;

router.post("/newMPrescription", upload.single("image"), async (req, res) => {
  try {
    console.log("hello");
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const Medecines = db.paitentMedicines;
    const PaitentReg = db.paitentReg;
    const PaisentPrescription = db.paisentprescription;
    const DoctorsAppointment = db.DoctorsAppointment;
    const file = req.file?.path;
    const formData = req.body;

    // const image = file;
    const prescriptionData = JSON.parse(formData.prescriptionData);
    console.log(prescriptionData);
    // return;
    let imageBuffer;

    if (file) {
      imageBuffer = file;
    } else {
      imageBuffer = null;
    }

    // if (image) {
    //   try {
    //     imageBuffer = await fs.promises.readFile(image.path);
    //     // Continue with further processing of the image
    //   } catch (error) {
    //     console.log("Error reading the image file:", error);
    //     // Handle the error when reading the image file
    //   }
    // } else {
    //   console.log("Image file does not exist.");
    //   // Handle the case when the image file is not available
    // }

    // console.log(image);

    const patientData = prescriptionData.patientData;
    const patientId = patientData.patientId;

    // Update patient registration record
    // await PaitentReg.update(
    //   {
    //     mr: patientData.mr,
    //     firstName: patientData.firstName,
    //     middleName: patientData.middleName,
    //     lastName: patientData.lastName,
    //     phoneNumberP: patientData.phoneNumberP,
    //     email: patientData.email,
    //     age: patientData.age,
    //     gender: patientData.gender,
    //     height: patientData.height,
    //     weight: patientData.weight,
    //     DFirstName: patientData.prescriberFirstName,
    //     DMiddleName: patientData.prescriberMiddleName,
    //     DLastName: patientData.prescriberLastName,
    //     RegistrationNo: patientData.registrationNo,
    //     PhoneNo: patientData.phoneNo,
    //     doctor_Id: patientData.doctor_Id,
    //   },
    //   {
    //     where: { id: patientId },
    //   }
    // );

    // Create prescription record
    const prescriptionRecord = await PaisentPrescription.create({
      prescriptionId: prescriptionData.prescriptionId,
      patient_Id: patientId,
      doctor_Id: patientData.doctor_Id,
      PatientName: `${patientData.mr} ${patientData.firstName} ${patientData.middleName} ${patientData.lastName}`,
      PrescribedDoctor: `Dr ${patientData.prescriberFirstName} ${patientData.prescriberMiddleName} ${patientData.prescriberLastName}`,
      RegistrationNo: patientData.registrationNo,
      phoneNumberP: patientData.phoneNumberP,
      PhoneNo: patientData.phoneNo,
      DoctorEmail: patientData.DoctorEmail,
      AppointBookingID: patientData.TestBookingID,
      socialLifestyle: prescriptionData.socialLifestyle,
      foodHabits: prescriptionData.foodHabits,
      medicalHistory: prescriptionData.medicalHistory,
      allergies: prescriptionData.allergies,
      image: imageBuffer,
      clinicalDiagnosis: prescriptionData.clinicalDiagnosis,
      bloodPressure: prescriptionData.bloodPressure,
      respiratoryRate: prescriptionData.respiratoryRate,
      heartRate: prescriptionData.heartRate,
      temperature: prescriptionData.temperature,
      familyDetails: prescriptionData.familyDetails,
      revisitDate: prescriptionData.revisitDate,
      revisit: prescriptionData.revisit,
      emailSentStatus: "notsent",
      prescribeMedicineQuantity: prescriptionData.prescribeMedicineQuantity,
    });

    // Update createdAt and updatedAt columns of prescription table

    // Insert medicine records
    const tablets = prescriptionData.tablets;

    let sumQuantity = 0;

    // Calculate the sum of quantity for all objects in tablets array
    // Calculate the sum of quantity for all objects in tablets array
    for (let i = 0; i < tablets.length; i++) {
      sumQuantity += parseInt(tablets[i].quantity, 10);
    }
    console.log(sumQuantity);

    // Find the PaisentPrescription record based on the prescriptionId
    PaisentPrescription.findOne({ where: { id: prescriptionRecord.id } })
      .then((prescription) => {
        if (prescription) {
          // Update the prescribeMedicineQuantity in the PaisentPrescription model table
          prescription.prescribeMedicineQuantity = sumQuantity;
          return prescription.save();
        } else {
          // Handle the case when the PaisentPrescription record is not found
          throw new Error("PaisentPrescription record not found");
        }
      })
      .then(() => {
        // Success: The prescribeMedicineQuantity has been updated.
      })
      .catch((error) => {
        // Error: Failed to update the prescribeMedicineQuantity or record not found.
        console.error(error);
      });
    const insertedIds = [];

    for (let i = 0; i < tablets.length; i++) {
      tablets[i].prescriptionId = prescriptionData.prescriptionId;
      tablets[i].patient_Id = patientId;
      tablets[i].prescription_Id = prescriptionRecord.id;
      console.log("InventoryitemNameID:-" + tablets[i].InventoryitemNameID);
      const medicineRecord = await Medecines.create(tablets[i]);
      insertedIds.push(medicineRecord.id);
    }

    const testBookingIDStatus = patientData?.TestBookingID;
    const appointment = await DoctorsAppointment.findByPk(testBookingIDStatus);
    if (appointment) {
      console.log("appointment.BookingStatus: " + appointment.BookingStatus);
      appointment.BookingStatus = "Consultated";
    }
    if (appointment) await appointment.save();
    console.log("appointment: " + JSON.stringify(appointment));
    // Update createdAt and updatedAt columns of medicines table
    //  return;
    res.status(201).json({
      message: "Prescription entries created successfully",
      insertedIds,
    });
  } catch (error) {
    console.error(
      "An error occurred while creating the prescription record:",
      error
    );
    res.status(500).json({
      error: "An error occurred while creating the prescription record.",
    });
  }
});

module.exports = router;
