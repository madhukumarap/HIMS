const db = require("../model/index.model.js");
const SampleHomeCollection = db.SampleHomeCollection;
const Patient = db.paitentReg;

const createSampleHomeBooking = async (req, res) => {
  try {
    const {
      patientId,
      sampleName,
      sampleDate,
      sampleTime,
      sampleTakerName,
      testType,
      remarks,
    } = req.body;

    console.log(req.body);

    // Check if patientID is provided
    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    // Extract patient ID from the provided identifier
    const patientIdInfo = patientId;
    const regex = /PID:(\d+)/;
    const match = patientIdInfo.match(regex);

    if (match && match[1]) {
      const patientId = match[1];
      console.log("Patient ID:", patientId);

      // Fetch patient details by patientId
      const patient = await Patient.findByPk(patientId);

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // Create a new sample collection record
      const sampleCollection = await SampleHomeCollection.create({
        PatientName:
          patient.firstName + " " + patient.middleName + " " + patient.lastName,
        PatientID: patient.id,
        Address: "Null",
        PatientPhoneNo: patient.phoneNumberP,
        sampleName,
        sampleDate,
        sampleTime,
        sampleTakerName,
        testType,
        remarks,
      });
      console.log("sampleCollection: " + sampleCollection);

      res.status(201).json({
        message: "Sample Collection created successfully",
        sampleCollection,
      });
    } else {
      console.log("Patient ID not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving Sample Collection" });
  }
};

const updateSampleHomeBooking = async (req, res) => {
  try {
    const {
      sampleName,
      sampleDate,
      sampleTime,
      sampleTakerName,
      testType,
      remarks,
    } = req.body;
    const { id } = req.params; // Assuming you have the sample booking ID in the URL parameter

    console.log(id);
    // Check if sample booking exists
    const existingSampleBooking = await SampleHomeCollection.findByPk(id);

    if (!existingSampleBooking) {
      return res.status(404).json({ message: "Sample booking not found" });
    }

    // Update the sample booking record
    const response = await existingSampleBooking.update({
      sampleName,
      sampleDate,
      sampleTime,
      sampleTakerName,
      testType,
      remarks,
    });
    console.log(response);
    res.status(200).json({
      message: "Sample Collection updated successfully",
      updatedSampleBooking: existingSampleBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating Sample Collection" });
  }
};

const getAllSampleHomeBookings = async (req, res) => {
  try {
    // Fetch all pathology test bookings
    const bookings = await SampleHomeCollection.findAll();

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

const deleteSampleHomeBooking = async (req, res) => {
  try {
    const { id } = req.params; // Assuming you have the sample booking ID in the URL parameter

    // Check if the sample booking exists
    const existingSampleBooking = await SampleHomeCollection.findByPk(id);

    if (!existingSampleBooking) {
      return res.status(404).json({ message: "Sample booking not found" });
    }

    // Delete the sample booking record
    await existingSampleBooking.destroy();

    res.status(200).json({ message: "Sample booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting sample booking" });
  }
};

const reCollectionSampleHome = async (req, res) => {
  const reCollectionId = req.params.reCollectionId;
  const { reCollection, reCollectionDate, reCollectionTime } = req.body;

  try {
    // Find the sample booking by ID
    const sampleBooking = await SampleHomeCollection.findByPk(reCollectionId);

    if (!sampleBooking) {
      return res.status(404).json({ message: "Sample booking not found" });
    }

    // Update the reCollection field and other fields if needed
    sampleBooking.reCollection = reCollection;
    sampleBooking.reCollectionDate = reCollectionDate;
    sampleBooking.reCollectionTime = reCollectionTime;

    // Save the changes
    await sampleBooking.save();

    res.status(200).json({ message: "Sample booking updated successfully" });
  } catch (error) {
    console.error("Error updating sample booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createSampleHomeBooking,
  getAllSampleHomeBookings,
  updateSampleHomeBooking,
  deleteSampleHomeBooking,
  reCollectionSampleHome,
};
