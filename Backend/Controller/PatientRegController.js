const db = require("../model/index.model.js");
const PaitentReg = db.paitentReg;
const PaisentPrescription = db.paisentprescription;
const authJwt = require("../middleware/authJwt");
const { getConnectionList } = require("../model/index.model3");

//paitent create

const createPaitentui = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaitentReg = db.paitentReg;
  const PaisentPrescription = db.paisentprescription;
  try {
    const {
      mr,
      firstName,
      middleName,
      lastName,
      phoneNumberP,
      email,
      age,
      gender,
      height,
      weight,
      aadharId,
      healthNationalId,
      city,
      countryCode,

      state,
      pincode,
      address,
      FirstName,
      MiddleName,
      LastName,
      PhoneNo,
      RegistrationNo,
      DoctorEmail,
      doctor_Id,
      hospitalId,
      registrationFees,
      paymentStatus,
      paymentDate,
      maritalStatus,
      bloodGroup,
      ageOption,
      Currency,
    } = req.body;

    // Create a new patient record
    const createdPatient = await PaitentReg.create({
      mr,
      firstName,
      middleName,
      lastName,
      phoneNumberP,
      email,
      countryCode,
      age,
      gender,
      height,
      weight,
      PatientAadharID: aadharId,
      HealthNationalID: healthNationalId,
      city,
      state,
      pincode,
      address,
      hospitalId,
      maritalStatus,
      bloodGroup,
      ageOption,
      registrationFees,
      paymentStatus,
      paymentDate,
      Currency,
    });

    res.status(201).json({
      success: true,
      message: "Patient record created successfully",
      data: createdPatient,
    });
  } catch (error) {
    console.error("Error creating patient record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create patient record",
      error: error.message,
    });
  }
};

const postprescription = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaitentReg = db.paitentReg;
  const PaisentPrescription = db.paisentprescription;
  console.log(req.body);
  //console.log(req.body.tablets);

  console.log("///////////////////////");

  const tabletsData = req.body.tablets;
  for (let i = 0; i < tabletsData.length; i++) {
    tabletsData[i].prescriptionId = "p" + req.body.prescriptionId;
  }

  console.log(tabletsData);
  res.status(200).json("data added");
};

const findallPaitents = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaitentReg = db.paitentReg;
  const PaisentPrescription = db.paisentprescription;
  try {
    // if (!req.headers.authorization) {
    //   const token = req.headers.authorization;
    //   console.log(token)
    // }
    // Find all patient records in the PaitentReg model
    // const { hospitalId } = req.params;
    const patients = await PaitentReg.findAll({
      order: [["createdAt", "DESC"]],
    });

    //return;
    // Send the patient records as a response to the API request
    res.send(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

const findallPaitentsEachDoctor = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaitentReg = db.paitentReg;
  const PaisentPrescription = db.paisentprescription;
  try {
    const { email } = req.params;
    const token = req.headers.authorization;
    console.log(token);

    // Find all patient records in the PaitentReg model where DoctorEmail matches the provided email
    const patients = await PaitentReg.findAll({
      where: { DoctorEmail: email },
      order: [["createdAt", "DESC"]],
    });

    // Send the patient records as a response to the API request
    res.send(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

//get one
const getonePaisent = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaitentReg = db.paitentReg;
  const PaisentPrescription = db.paisentprescription;
  const id = req.params.id;
  try {
    // Find the patient record with the specified ID
    const patient = await PaitentReg.findByPk(id);

    // If the record is found, send it as a response to the API request
    if (patient) {
      res.send(patient);
    } else {
      res.status(404).send("Patient not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

//update paitent by id
const updatePatient = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaitentReg = db.paitentReg;
  const PaisentPrescription = db.paisentprescription;
  try {
    const { id } = req.params;
    console.log(req.body);

    const {
      phoneNumberP,
      email,
      gender,
      weight,
      age,
      address,
      HealthNationalID,
      PatientAadharID,
    } = req.body;

    // Check if patient with given id exists
    const patient = await PaitentReg.findByPk(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Update the patient object
    patient.age = age;
    patient.gender = gender;
    patient.weight = weight;
    patient.PatientAadharID = PatientAadharID;
    patient.HealthNationalID = HealthNationalID;
    patient.phoneNumberP = phoneNumberP;
    patient.email = email;
    patient.address = address;
    await patient.save();

    /////////////////////////////////////////////////////////////////////////
    const patientPrescription = await PaisentPrescription.findOne({
      where: { patient_Id: id },
    });
    if (!patientPrescription) {
      // return res.status(404).json({ message: 'Prescription not found' });
    }

    // Update the phoneNumberP field
    if (patientPrescription) {
      patientPrescription.phoneNumberP = phoneNumberP;

      // Save the updated prescription
      await patientPrescription.save();
    }
    res.status(200).json({ message: "Patient updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//one to many mapping
const getOnePaisentReg = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaitentReg = db.paitentReg;
  const PaisentPrescription = db.paisentprescription;
  const id = req.params.id;

  const data = await PaitentReg.findOne({
    include: [
      {
        model: PaisentPrescription,
        as: "patientPrecription",
      },
    ],
    where: { id: id },
  });

  res.status(200).send(data);
};

const getOnePaisentRegPatient = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaitentReg = db.paitentReg;
  const PaisentPrescription = db.paisentprescription;
  const phoneNumber = req.params.phoneNumber;

  const data = await PaitentReg.findOne({
    include: [
      {
        model: PaisentPrescription,
        as: "patientPrecription",
      },
    ],
    where: { phoneNumberP: phoneNumber },
  });

  res.status(200).send(data);
};
const deletePatientById = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaitentReg = db.paitentReg;
  const PaisentPrescription = db.paisentprescription;
  const id = req.params.id;

  try {
    // Find the patient record with the specified ID
    const patient = await PaitentReg.findByPk(id);

    // If the record is found, delete it
    if (patient) {
      await patient.destroy();
      res.status(200).json({ message: "Patient deleted successfully" });
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateBillingInfo = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaitentReg = db.paitentReg;
  const PaisentPrescription = db.paisentprescription;
  try {
    const id = req.params.id;
    const updatedBillingInfo = req.body;
    console.log(id);
    // Find the patient record with the specified ID
    const patient = await PaitentReg.findByPk(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Update the billing information
    patient.registrationFees = updatedBillingInfo.registrationFees;
    patient.paymentStatus = updatedBillingInfo.paymentStatus;
    patient.paymentDate = updatedBillingInfo.paymentDate;

    // Save the updated patient record
    await patient.save();

    res.status(200).json({ message: "Billing info updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = {
  getOnePaisentRegPatient,
  getonePaisent,
  findallPaitents,
  postprescription,
  getOnePaisentReg,
  updatePatient,
  updateBillingInfo,
  createPaitentui,
  findallPaitentsEachDoctor,
  deletePatientById,
};
