const db = require("../model/index.model.js");
const SampleCollection = db.SampleCollection;
const Patient = db.paitentReg;
const TestArray = db.PathologyTestManage;
const StatusOfPathologyTestsForTestBooking =
  db.StatusOfPathologyTestsForTestBooking;
const { getConnectionList } = require("../model/index.model3");

function findTestIdByName(tests, testName) {
  const test = tests.find((test) => test.testName === testName);
  return test ? test.id : null;
}
const createSampleBooking = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const SampleCollection = db.SampleCollection;
  const Patient = db.paitentReg;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  try {
    const {
      patientId,
      sampleName,
      sampleDate,
      sampleTime,
      sampleTakerName,
      testType,
      remarks,
      barcodeValues,
      sampleLocation,
      PathologyTestBookingId,
    } = req.body;

    console.log(req.body);

    // return;
    // Check if patientID is provided
    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const testNamesArray = sampleName.split(",");
    console.log("testNamesArray: " + testNamesArray);
    // return;
    for (let i = 0; i < testNamesArray.length; i++) {
      const testName = testNamesArray[i];
      const tests = await TestArray.findAll();
      const testid = findTestIdByName(tests, testName);
      console.log("testid:" + testid);
      console.log(testName);
      console.log("PathologyTestBookingId:", PathologyTestBookingId);
      const testRow = await StatusOfPathologyTestsForTestBooking.findOne({
        where: {
          PathologyTestBookingId: PathologyTestBookingId,
          testName: testName,
        },
      });

      // console.log("TestRow:", testRow);
      if (testRow?.TestStatus === "Sample Collected") {
        console.log(
          `Sample for ${testName} is already collected for this booking`
        );
        return res
          .status(400)
          .send(`Sample for ${testName} is already collected`);
      }
      if (!testRow?.testName) {
        return res
          .status(400)
          .send(`This Patient for  ${testName} not Booked `);
      }
    }

    if (patientId) {
      //const patientId = match[1];
      console.log("Patient ID:", patientId);

      // Fetch patient details by patientId
      const patient = await Patient.findByPk(patientId);
      console.log(patient);
      // return;
      if (!patient) {
        res.status(404).json({ message: "Patient not found" });
      }

      // Create a new sample collection record
      const sampleCollection = await SampleCollection.create({
        PatientName:
          patient.firstName + " " + patient.middleName + " " + patient.lastName,
        PatientID: patient.id,
        Address: "Null",
        PatientPhoneNo: patient.phoneNumberP,
        sampleName,
        sampleDate,
        PathologyTestBookingId,
        sampleTime,
        sampleTakerName,
        BarcodeValuesAllSelectedTest: barcodeValues,
        testType,
        remarks,
        sampleLocation,
      });
      console.log("sampleCollection: " + sampleCollection);

      for (let i = 0; i < testNamesArray.length; i++) {
        const testName = testNamesArray[i];
        const tests = await TestArray.findAll();
        const testid = findTestIdByName(tests, testName);
        console.log("testid:" + testid);
        console.log(testName);
        console.log("PathologyTestBookingId:", PathologyTestBookingId);
        const testRow = await StatusOfPathologyTestsForTestBooking.findOne({
          where: {
            PathologyTestBookingId: PathologyTestBookingId,
            testName: testName,
          },
        });

        if (testRow) {
          const currentDateTime = new Date();
          testRow.TestSamplecollectedDateTime = currentDateTime;
          testRow.TestStatus = "Sample Collected";

          await testRow.save();
        }
      }
      res.status(200).json({
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

const updateSampleBooking = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const SampleCollection = db.SampleCollection;
  const Patient = db.paitentReg;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  try {
    const {
      sampleName,
      sampleDate,
      sampleTime,
      sampleTakerName,
      testType,
      remarks,
      sampleLocation,
    } = req.body;
    const { id } = req.params; // Assuming you have the sample booking ID in the URL parameter

    console.log(id);
    // Check if sample booking exists
    const existingSampleBooking = await SampleCollection.findByPk(id);

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
      sampleLocation,
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

const getAllSampleBookings = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const SampleCollection = db.SampleCollection;
  const Patient = db.paitentReg;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  try {
    // Fetch all pathology test bookings
    const bookings = await SampleCollection.findAll();

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

const deleteSampleBooking = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const SampleCollection = db.SampleCollection;
  const Patient = db.paitentReg;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  try {
    const { id } = req.params; // Assuming you have the sample booking ID in the URL parameter

    // Check if the sample booking exists
    const existingSampleBooking = await SampleCollection.findByPk(id);

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

const reCollectionSample = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const SampleCollection = db.SampleCollection;
  const Patient = db.paitentReg;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const { barcodes, selectedRowID } = req.body;

  try {
    // Find the sample booking by ID
    const sampleBooking = await SampleCollection.findByPk(selectedRowID);

    if (!sampleBooking) {
      return res.status(404).json({ message: "Sample booking not found" });
    }
    console.log(req.body);
    sampleBooking.BarcodeValuesAllSelectedTest = barcodes;

    // Save the changes
    await sampleBooking.save();

    res.status(200).json({ message: "Sample booking updated successfully" });
  } catch (error) {
    console.error("Error updating sample booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const reCollectionSampleDate = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const SampleCollection = db.SampleCollection;
  const Patient = db.paitentReg;
  const TestArray = db.PathologyTestManage;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const reCollectionId = req.params.reCollectionId;
  const { reCollection, reCollectionDate, reCollectionTime } = req.body;
  console.log("req.body", req.body);
  try {
    // Find the sample booking by ID
    const sampleBooking = await SampleCollection.findByPk(reCollectionId);

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
  createSampleBooking,
  getAllSampleBookings,
  updateSampleBooking,
  deleteSampleBooking,
  reCollectionSample,
  reCollectionSampleDate,
};
