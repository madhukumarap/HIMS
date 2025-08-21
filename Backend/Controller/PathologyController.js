const db = require("../model/index.model.js");
const PathologyTest = db.PathologyTest;
const Patient = db.paitentReg;
const DoctorModel = db.doctor;
const TestPackageModel = db.TestPackageModel;
const axios = require("axios");

const Doctor = db.doctor;
const StatusOfPathologyTestsForTestBooking =
  db.StatusOfPathologyTestsForTestBooking;
const Sequelize = require("sequelize");
const T3T4TSHTestModel = db.T3T4TSHTestModel;
const BloodSugerForPP = db.BloodSugerForPP;
const EnterCodeTypeValue = db.CommissionCodeData;
const AllTestManagementList = db.PathologyTestManage;
const BloodSugarForFasting = db.BloodSugarForFasting;
const PlateletCountTest = db.PlateletCountTestModel;
const LipidProfileModel = db.LipidProfileModel;
const TestArray = db.PathologyTestManage;
const { getConnectionList } = require("../model/index.model3");

const { Op } = require("sequelize");
function findTestIdByName(tests, testName) {
  const test = tests.find((test) => test.testName === testName);
  return test ? test.id : null;
}

const createBooking = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Payments = db.Payments;
  const HospitalAdmission = db.HospitalAdmission;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  try {
    const {
      patientId,
      doctorID,
      status,
      lapName,
      remarks,
      instrumentsUsed,
      // selectedTests, // array without id
      //  selectedTest, // array with id name
      testFees,
      paymentDate,
      paymentStatus,
      commissionType,
      selectedPackageID,
      commissionValue,

      TestManagementID,
      Currency,
      PaidAmount,
      TotalFees,
      admissionID,
    } = req.body;
    // if (paymentStatus == "Paid") {
    //   PaidAmount = TotalFees;
    // }
    const selectedTestArray = new Set(req.body.selectedTest);
    const selectedTest = [...selectedTestArray];

    const selectedTestsArray = new Set(req.body.selectedTests);
    const selectedTests = [...selectedTestsArray];

    console.log(req.body);
    console.log("selectedTest: " + selectedTest);

    //return;
    // const tests = await TestArray.findAll();
    // const testid = findTestIdByName(tests, "Lipid Profile");
    // console.log("testid:" + testid);
    //return;
    const enterCodeTypeValue = await EnterCodeTypeValue.findByPk(
      commissionType
    );

    if (!enterCodeTypeValue) {
      return res.status(404).json({ error: "EnterCodeTypeValue not found" });
    }
    console.log(enterCodeTypeValue);
    // return;
    // Fetch patient details by patientId
    // const patientIdInfo = patientId;
    // const regex = /PID:(\d+)/;
    // const match = patientIdInfo.match(regex);

    if (true) {
      // const patientId = match[1];
      console.log("Patient ID:", patientId);

      // Fetch patient details by patientId
      const patient = await Patient.findByPk(patientId);
      const doctor = await DoctorModel.findByPk(doctorID);

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // console.log();
      // return;
      const selectedTestsString = selectedTest.join(", ");

      //return;
      // Create a new pathology test record
      const pathologyTest = await PathologyTest.create({
        PatientName:
          patient.mr + " " + patient.firstName + " " + patient.lastName,
        PatientID: patient.id,
        CorporateID: patient?.CorporateID || null,
        DoctorName:
          (doctor?.FirstName || "NA") + " " + (doctor?.LastName || "NA"),
        DoctorPhone: doctor?.phoneNo || "0",
        DoctorEmail: doctor?.email,
        doctorId: doctorID || "0",
        Address: "NA",
        PatientPhoneNo: patient?.phoneNumberP,
        status,
        lapName,
        remarks,
        PaidAmount: paymentStatus === "Paid" ? TotalFees : PaidAmount || 0,
        selectedPackageID,
        commissionType: enterCodeTypeValue.id,
        commissionValue: enterCodeTypeValue.codeType,
        TestManagementID: TestManagementID || 0,
        results: "pending",
        instrumentsUsed,
        PaymentStatus: paymentStatus,
        PaymentDate: paymentDate || new Date("2000-01-01"),
        selectedTests: selectedTestsString,
        testFees: req.body.testFees,
        TotalFees,
        Currency,
        admissionID,
      });

      const admission = await HospitalAdmission.findByPk(admissionID);

      // if(admission){
      //   admission.TotalExpense = Number(admission.TotalExpense) + Number(TotalFees)
      //   admission.TotalAdvance = Number(admission.TotalAdvance) + Number(PaidAmount)
      //   await admission.save()
      // }

      const newPayment = await Payments.create({
        paymentID: `pay${Math.floor(1000000 + Math.random() * 9000000)}`,
        paymentDate: paymentDate,
        admissionID: admissionID,
        hospitalID: req.hospitalID,
        amount: PaidAmount == 0 ? TotalFees : PaidAmount,
        currency: Currency,
      });

      for (let i = 0; i < selectedTest.length; i++) {
        const testName = selectedTest[i];
        const tests = await TestArray.findAll();
        const testid = findTestIdByName(tests, testName);
        console.log("testid:" + testid);
        console.log(testName);
        const currentDateTime = new Date();

        const newStatus = await StatusOfPathologyTestsForTestBooking.create({
          testName: testName,
          TestStatus: status,
          PatientID: patientId,
          PathologyTestBookingId: pathologyTest.id,
          TestID: testid,
          TestRegisteredDateTime: currentDateTime,
          admissionID,
        });
      }
      res.status(201).json({
        message: "Pathology test created successfully",
        pathologyTest,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving pathology test" });
  }
};

const createBookingEvent = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  try {
    const {
      patientId,
      doctorId,
      status,
      lapName,
      tests,
      remarks,
      instrumentsUsed,
      selectedTests,
      amount,
      paymentDateTime,
      paymentStatus,
      selectedPackageID,
      TestManagementID,
    } = req.body;

    console.log(req.body);
    //return;
    const testsAll = await AllTestManagementList.findAll({
      where: {
        id: tests,
      },
    });
    const testIds = testsAll.map((test) => test.id).join(",");
    const testNames = testsAll.map((test) => test.testName).join(",");
    const testNamesArray = testNames.split(",");

    console.log(testNamesArray);
    console.log(testNames);
    console.log(testIds);
    // return;
    // Fetch patient details by patientId

    if (true) {
      // Fetch patient details by patientId
      const patient = await Patient.findByPk(patientId);
      const doctor = await Doctor.findByPk(doctorId);
      console.log(doctor);
      //return;
      const PaymentStatus = paymentStatus === "paid" ? "Paid" : "Not-Paid";

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      console.log(patient);
      //return;
      // Create a new pathology test record
      const pathologyTest = await PathologyTest.create({
        PatientName:
          patient.mr + " " + patient.firstName + " " + patient.lastName,
        PatientID: patient.id,
        PaidAmount:amount,
        CorporateID: patient?.CorporateID || null,
        DoctorName:
          (doctor?.FirstName || "NA") + " " + (doctor?.LastName || "NA"),
        DoctorPhone: doctor?.phoneNo || "0",
        doctorId: doctorId || "0",
        Address: "Null",

        PatientPhoneNo: patient?.phoneNumberP,
        status: "Registered",
        lapName: " ",
        remarks,

        TestManagementIDs: testIds,
        TestManagementID: tests[0],
        results: "pending",
        instrumentsUsed,
        commissionType: "NA",
        commissionValue: "NA",
        PaymentStatus: PaymentStatus,
        PaymentDate: paymentDateTime,
        selectedTests: testNames,
        testFees: amount,
        selectedPackageID,
        remarks: "NA",
      });

      console.log("testNames: " + testNames);
      const testNamesArray = testNames.split(",");

      for (let i = 0; i < testNamesArray.length; i++) {
        const testName = testNamesArray[i];
        const tests = await TestArray.findAll();
        const testid = findTestIdByName(tests, testName);
        console.log("testid:" + testid);
        console.log(testName);
        const currentDateTime = new Date();
        console.log("testName////////////: " + testName);
        const newStatus = await StatusOfPathologyTestsForTestBooking.create({
          testName: testName,
          TestStatus: "Registered",
          PatientID: patientId,
          PathologyTestBookingId: pathologyTest.id,
          TestID: testid,
          TestRegisteredDateTime: currentDateTime,
        });
      }
      console.log(pathologyTest);
      res.status(200).json({
        message: "Pathology test created successfully",
        pathologyTest,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving pathology test" });
  }
};
const updateBooking = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  try {
    const bookingId = req.params.id;
    const {
      patientId,
      status,
      lapName,
      remarks,
      instrumentsUsed,
      selectedTest,
      testFees,
      commissionType,
      commissionValue,
      TestManagementID,
      paymentDate,
      paymentStatus,
      selectedTests,
      doctorID,
      TotalFees,
      Currency,
      PaidAmount,
    } = req.body;

    console.log(req.body);
    // return;
    // Fetch patient details by patientId
    const selectedTestsString = selectedTests.join(", ");

    // Find the booking by ID
    const doctor = await DoctorModel.findByPk(doctorID);
    const booking = await PathologyTest.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const enterCodeTypeValue = await EnterCodeTypeValue.findByPk(
      commissionType
    );

    console.log(enterCodeTypeValue);
    // Update the booking record
    booking.status = status;
    booking.lapName = lapName;
    booking.TestManagementID = TestManagementID;
    booking.remarks = remarks;
    booking.instrumentsUsed = instrumentsUsed;
    booking.testFees = testFees;
    booking.DoctorEmail = doctor?.email;
    booking.commissionType = commissionType || "0";
    booking.commissionValue = commissionValue;
    console.log("PaidAmount//////////--:");
    console.log(Number(booking.PaidAmount) + PaidAmount);
    booking.PaidAmount = Number(booking.PaidAmount) + PaidAmount;
    booking.selectedTests = selectedTestsString;
    booking.PaymentStatus = paymentStatus;
    if (paymentStatus === "Not-Paid") {
      booking.PaymentDate = null;
    } else {
      booking.PaymentDate = paymentDate;
    }
    if (
      parseInt(booking.TotalFees) <=
      parseInt(booking.PaidAmount) + parseInt(PaidAmount) + 2
    ) {
      booking.PaymentStatus = "Paid";
    } else {
      booking.PaymentStatus = paymentStatus;
    }
    booking.DoctorName =
      (doctor?.FirstName || "NA") + " " + (doctor?.LastName || "NA");
    booking.DoctorPhone = doctor?.phoneNo || "0";
    booking.doctorId = doctorID || 0;
    booking.commissionType = enterCodeTypeValue?.id || "0";
    booking.commissionValue = enterCodeTypeValue?.codeType || "NA";
    booking.Currency = Currency;
    booking.TotalFees = TotalFees;
    await booking.save();

    res
      .status(200)
      .json({ message: "Pathology test updated successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating pathology test" });
  }
};

const getAllBookings = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  try {
    // Fetch all pathology test bookings
    const bookings = await PathologyTest.findAll();

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

const getAllInPatientBookings = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  try {
    // Fetch all pathology test bookings
    const bookings = await PathologyTest.findAll();
    let Filtereddata = bookings.filter((element) => element.admissionID !== 0);
    let data = [];
    Filtereddata.forEach((patient) => {
      data.push({
        patientName: patient.PatientName,
        PatientID: patient.PatientID,
        Currency: patient.Currency,
        procedure: "Pathology",
        admissionID: patient.admissionID,
        createdAt: patient.createdAt,
        TotalFees: patient.TotalFees,
        testFees: patient.testFees,
      });
      // data = [...data, {patient, procedure : "Pathology"}]
    });
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

const getPathologyDataUsingAdmissionId = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const id = req.params.admissionId;
  try {
    const data = await PathologyTest.findAll({ where: { admissionID: id } });
    res.send(data);
  } catch (error) {
    console.log("Error-------------:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const deleteBooking = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  try {
    const bookingId = req.params.id;

    // Find the booking by ID
    const booking = await PathologyTest.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Delete the booking record
    await booking.destroy();

    res.status(200).json({ message: "Pathology test deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting pathology test" });
  }
};
const updateResult = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  try {
    const bookingId = req.params.id;
    const { results } = req.body;

    // Find the booking by ID
    const booking = await PathologyTest.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the results field
    booking.results = results;
    await booking.save();

    res.status(200).json({ message: "Results updated successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating results" });
  }
};

const updateAuthorization = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  try {
    const { id, authorizationStatus, feedback } = req.body;

    console.log(req.body);
    // return;
    // Find the booking by ID
    const booking = await PathologyTest.findByPk(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the results field
    booking.Authorization = authorizationStatus;
    booking.feedback = feedback;
    await booking.save();

    res.status(200).json({ message: "status updated successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating status" });
  }
};

const GetTestBookingAndResultData = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  const bookingId = req.params.id;
  try {
    // Find the booking by ID
    const booking = await PathologyTest.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log(booking.selectedTests);
    // Check if the selectedTests value matches the condition
    if (booking.selectedTests === "T3 T4 TSH") {
      // Get PatientTestBookingID from the booking
      console.log("Test is T3 T4 TSH");
      const patientTestBookingId = booking.id;

      const T3T4TSHTestModelData = await T3T4TSHTestModel.findOne({
        where: {
          PatientTestBookingID: patientTestBookingId,
        },
        order: [["createdAt", "DESC"]], // Sort by creation date in descending order
      });

      console.log("T3T4TSHTestModelData: " + T3T4TSHTestModelData);

      // Include both sets of data in the response
      const responseData = {
        booking,
        T3T4TSHTestModelData,
      };

      res.status(200).json(responseData);
    } else if (booking.selectedTests === "BLOOD SUGAR FOR PP") {
      // Get PatientTestBookingID from the booking
      console.log("Test is BLOOD SUGAR FOR PP");
      const patientTestBookingId = booking.id;

      const BloodSugarPPTestModelData = await BloodSugerForPP.findOne({
        where: {
          PatientTestBookingID: patientTestBookingId,
        },
        order: [["createdAt", "DESC"]], // Sort by creation date in descending order
      });

      console.log("BloodSugarPPTestModelData: " + BloodSugarPPTestModelData);

      // Include both sets of data in the response
      const responseData = {
        booking,
        BloodSugarPPTestModelData,
      };

      res.status(200).json(responseData);
    } else if (booking.selectedTests === "PLATELET COUNT") {
      // Get PatientTestBookingID from the booking
      console.log("Test is T3 T4 TSH");
      const patientTestBookingId = booking.id;

      const PlateletCountModelData = await PlateletCountTest.findOne({
        where: {
          PatientTestBookingID: patientTestBookingId,
        },
        order: [["createdAt", "DESC"]], // Sort by creation date in descending order
      });

      console.log("PlateletCountModelData: " + PlateletCountModelData);

      // Include both sets of data in the response
      const responseData = {
        booking,
        PlateletCountModelData,
      };

      res.status(200).json(responseData);
    } else if (booking.selectedTests === "LIPID PROFILE") {
      // Get PatientTestBookingID from the booking
      console.log("Test is LIPID PROFILE");
      const patientTestBookingId = booking.id;

      const LipidProfileModelData = await LipidProfileModel.findOne({
        where: {
          PatientTestBookingID: patientTestBookingId,
        },
        order: [["createdAt", "DESC"]],
      });

      console.log("LipidProfileModelData: " + LipidProfileModelData);

      // Include both sets of data in the response
      const responseData = {
        booking,
        LipidProfileModelData,
      };

      res.status(200).json(responseData);
    } else if (booking.selectedTests === "BLOOD SUGAR FOR FASTING") {
      // Get PatientTestBookingID from the booking
      console.log("Test is BLOOD SUGAR FOR FASTING");
      const patientTestBookingId = booking.id;

      const BloodSugarForFastingModelData = await BloodSugarForFasting.findOne({
        where: {
          PatientTestBookingID: patientTestBookingId,
        },
        order: [["createdAt", "DESC"]],
      });

      console.log("LipidProfileModelData: " + BloodSugarForFastingModelData);

      // Include both sets of data in the response
      const responseData = {
        booking,
        BloodSugarForFastingModelData,
      };

      res.status(200).json(responseData);
    } else {
      const responseData = {
        booking,
        T3T4TSHTestModelData: null,
        LipidProfileModelData: null,
        PlateletCountModelData: null,
        BloodSugarForFastingModelData: null,
        BloodSugerForPP: null,
      };

      res.status(200).json(responseData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};
const getSelectedPackageBooking = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  const {
    selectedPackageId,
    startDate,
    endDate,
    selectedCorporateType,
    selectedCompany,
  } = req.query;
  console.log(req.query);

  try {
    let whereCondition = {
      selectedPackageId: selectedPackageId,
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    };

    // Add condition for PaymentStatus being "Paid"
    whereCondition.PaymentStatus = "Paid";

    if (selectedCorporateType === "Corporate") {
      whereCondition.CorporateID = {
        [Op.not]: null,
      };
    } else if (selectedCorporateType === "NonCorporate") {
      whereCondition.CorporateID = null;
    }
    if (selectedCompany) {
      whereCondition.CorporateID = selectedCompany;
    }

    const tests = await PathologyTest.findAll({
      where: whereCondition,
    });

    res.json(tests);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSelectedTestRevenue = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  const {
    testName,
    startDate,
    endDate,
    selectedCorporateType,
    selectedCompany,
  } = req.query;
  console.log(req.query);
  // return;
  try {
    let whereCondition = {
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    };

    if (selectedCorporateType === "Corporate") {
      whereCondition.CorporateID = {
        [Op.not]: null,
      };
    } else if (selectedCorporateType === "NonCorporate") {
      whereCondition.CorporateID = null;
    }
    if (selectedCompany) {
      whereCondition.CorporateID = selectedCompany;
    }
    whereCondition.PaymentStatus = "Paid";
    // Modify the whereCondition to include a partial match on selectedTests
    whereCondition.selectedTests = {
      [Op.like]: `%${testName}%`,
    };

    const tests = await PathologyTest.findAll({
      where: whereCondition,
    });
    console.log("Hello " + tests);

    res.json(tests);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSelectedPackagePatients = async (req, res) => {
  try {
    const id = req.params.selectedPackageId;
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const PathologyTest = db.PathologyTest;
    const { startDate, endDate } = req.query;
    console.log("startDate::" + startDate);
    const data = await PathologyTest.findAll({
      where: {
        selectedPackageID: id,
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

// const getAllPathologyTestData = async (req, res)=>{
//   try {
//     // const id = req.params.selectedPackageId
//     const database = req.headers.userDatabase;
//   const connectionList = await getConnectionList(database);
//   const db = connectionList[database];
//   const PathologyTest = db.PathologyTest;
//   const {startDate, endDate, selectedCorporateType , selectedPackageId } = req.body

//   if(startDate && endDate){

//     const StartedDate = new Date(startDate);
//     const EndDate = new Date(endDate)

//     let whereCondition = {
//       createdAt: {
//         [Op.between]: [StartedDate, EndDate],
//       },
//     };

//     if (selectedCorporateType === "Corporate") {
//       whereCondition.CorporateID = {
//         [Op.not]: null,
//       };
//     } else if (selectedCorporateType === "NonCorporate") {
//       whereCondition.CorporateID = null;
//     }

//     if(selectedPackageId){
//       whereCondition.selectedPackageID = selectedPackageId;
//     }

//     const bookings = await PathologyTest.findAll({where: whereCondition, });

//     console.log('bookings :', bookings);
//     res.status(200).send( bookings );
//   }else{
//     const bookings = await PathologyTest.findAll();
//     console.log("hello");
//     console.log('bookings :', bookings);
//     res.status(200).send( bookings );
//   }

//   // const data = await PathologyTest.findAll()
//   // res.send(data)

//   } catch (error) {
//     console.log(error)
//     res.status(500).send({message:"Something went wrong"})
//   }
// };

const getAllPathologyTestData = async (req, res) => {
  try {
    // const id = req.params.selectedPackageId
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const PathologyTest = db.PathologyTest;
    const { startDate, endDate, selectedCorporateType, selectedPackageId } =
      req.body;

    if (startDate && endDate) {
      const StartedDate = new Date(startDate);
      const EndDate = new Date(endDate);

      let whereCondition = {
        createdAt: {
          [Op.between]: [StartedDate, EndDate],
        },
      };

      if (selectedCorporateType === "Corporate") {
        whereCondition.CorporateID = {
          [Op.not]: null,
        };
      } else if (selectedCorporateType === "NonCorporate") {
        whereCondition.CorporateID = null;
      }

      if (selectedPackageId) {
        whereCondition.selectedPackageID = selectedPackageId;
      }

      const bookings = await PathologyTest.findAll({ where: whereCondition });

      console.log("bookings :", bookings);
      res.status(200).send(bookings);
    } else {
      const bookings = await PathologyTest.findAll();
      console.log("hello");
      console.log("bookings :", bookings);
      res.status(200).send(bookings);
    }

    // const data = await PathologyTest.findAll()
    // res.send(data)
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const getAllBookingsTestPathologyPerVisit = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  const { startDate, endDate, selectedCorporateType, selectedCompany } =
    req.query;
  console.log(req.query);
  // return;
  try {
    let whereCondition = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (selectedCorporateType === "Corporate") {
      whereCondition.CorporateID = {
        [Op.not]: null,
      };
    } else if (selectedCorporateType === "NonCorporate") {
      whereCondition.CorporateID = null;
    }
    if (selectedCompany) {
      whereCondition.CorporateID = selectedCompany;
    }
    whereCondition.PaymentStatus = "Paid";
    // Modify the whereCondition to include a partial match on selectedTests

    const tests = await PathologyTest.findAll({
      where: whereCondition,
    });
    console.log(
      "/////////////////////////////////////////////////////////////"
    );
    const mergedTests = {};
    tests.forEach((test) => {
      const key = test.PatientID + test.createdAt.toISOString().split("T")[0]; // Using date only

      if (!mergedTests[key]) {
        mergedTests[key] = { ...test, testFees: parseFloat(test.testFees) };
      } else {
        mergedTests[key].testFees += parseFloat(test.testFees);
      }
      mergedTests[key].PatientName = test.PatientName;
      mergedTests[key].createdAt = test.createdAt;
      mergedTests[key].PatientPhoneNo = test.PatientPhoneNo;
      mergedTests[key].PatientID = test.PatientID;
    });

    const result = Object.values(mergedTests);

    console.log("length: " + JSON.stringify(result[3]));
    console.log("length: " + JSON.stringify(tests.length));
    //return;
    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllBookingsTestPathologySelectedDoctorReferral = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  const {
    SelectedDoctorID,
    startDate,
    endDate,
    selectedCorporateType,
    selectedCompany,
  } = req.query;

  try {
    // Fetch exchange rates only if they are not available
    let exchangeRates;

    if (!exchangeRates) {
      exchangeRates = await getExchangeRates();
    }

    let whereCondition = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
      PaymentStatus: "Paid",
    };

    if (selectedCorporateType === "Corporate") {
      whereCondition.CorporateID = {
        [Op.not]: null,
      };
    } else if (selectedCorporateType === "NonCorporate") {
      whereCondition.CorporateID = null;
    }
    if (selectedCompany) {
      whereCondition.CorporateID = selectedCompany;
    }
    if (SelectedDoctorID) {
      whereCondition.doctorId = SelectedDoctorID;
    }

    const tests = await PathologyTest.findAll({
      where: whereCondition,
    });

    const enterCodeList = await EnterCodeTypeValue.findAll();

    let totalCommission = 0;
    let totalTestFeesUSD = 0; // Initialize total test fees in USD

    console.log("Length test: " + tests.length);

    for (const test of tests) {
      const commissionType = enterCodeList.find(
        (item) => item.id === parseInt(test.commissionType)
      );

      console.log("test.testFees" + test.TotalFees);
      console.log("commissionType.value" + commissionType?.value);

      if (commissionType && commissionType?.value) {
        const commissionPercentage =
          parseFloat(commissionType.value.replace("%", "")) / 100;
        const commission = test.TotalFees * commissionPercentage;
        totalCommission += commission;

        // Convert test fees to USD and accumulate
        const testFeesUSD = convertToCurrency(
          test.TotalFees,
          test.Currency,
          exchangeRates,
          "USD"
        );
        const commission2 = testFeesUSD * commissionPercentage;

        console.log("testFeesUSD: " + testFeesUSD);
        totalTestFeesUSD += commission2;
      }
    }

    const resultObject = {
      totalCommission: totalTestFeesUSD.toFixed(2),
      totalTestFeesUSD: totalTestFeesUSD.toFixed(2), // Total test fees in USD
      PatientCount: tests.length,
      DoctorId: SelectedDoctorID,
    };
    console.log(resultObject);
    res.json(resultObject);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Define a new route for fetching data for all doctors

const getAllBookingsTestPathologyAllDoctorReferral = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  const { startDate, endDate, selectedCorporateType, selectedCompany } =
    req.query;

  try {
    // Fetch exchange rates only if they are not available
    let exchangeRates;

    if (!exchangeRates) {
      exchangeRates = await getExchangeRates();
    }

    let whereCondition = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
      PaymentStatus: "Paid",
    };

    if (selectedCorporateType === "Corporate") {
      whereCondition.CorporateID = {
        [Op.not]: null,
      };
    } else if (selectedCorporateType === "NonCorporate") {
      whereCondition.CorporateID = null;
    }
    if (selectedCompany) {
      whereCondition.CorporateID = selectedCompany;
    }

    const tests = await PathologyTest.findAll({
      where: whereCondition,
    });

    const enterCodeList = await EnterCodeTypeValue.findAll();

    const commissionsData = {};

    for (const test of tests) {
      const commissionType = enterCodeList.find(
        (item) => item.id === parseInt(test.commissionType)
      );

      if (commissionType && commissionType?.value) {
        const commissionPercentage =
          parseFloat(commissionType.value.replace("%", "")) / 100;
        const commission = test.TotalFees * commissionPercentage;

        const doctorData = await Doctor.findByPk(test.doctorId);

        // Convert test fees and commission to USD
        const testFeesUSD = convertToCurrency(
          test.TotalFees,
          test.Currency,
          exchangeRates,
          "USD"
        );

        const commissionUSD = convertToCurrency(
          commission,
          test.Currency,
          exchangeRates,
          "USD"
        );

        if (commissionsData[doctorData.id]) {
          // If the doctor is already in commissionsData, add fees and commission to the existing entry
          commissionsData[doctorData.id].earnedCommission += commissionUSD;
          commissionsData[doctorData.id].totalTestFees += testFeesUSD;
          commissionsData[doctorData.id].patientCount += 1;
        } else {
          // If it's a new doctor, create a new entry in commissionsData
          commissionsData[doctorData.id] = {
            doctorId: doctorData.id,
            doctorName: `${doctorData.FirstName} ${doctorData.LastName}`,
            registrationNo: doctorData.registrationNo,
            phoneNo: doctorData.phoneNo,
            patientCount: 1,
            earnedCommission: commissionUSD,
            totalTestFees: testFeesUSD,
          };
        }
      }
    }

    // Convert commissionsData object to an array of values
    const resultData = Object.values(commissionsData);

    console.log("commissionsData: " + JSON.stringify(resultData));
    res.json(resultData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Rest of the code remains the same

// Function to convert amount to the target currency
function convertToCurrency(amount, currency, exchangeRates, targetCurrency) {
  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedAmount)) {
    return null;
  }

  if (currency === targetCurrency) {
    return parsedAmount;
  } else if (exchangeRates[currency] && exchangeRates[targetCurrency]) {
    const amountInUSD = parsedAmount / exchangeRates[currency];
    return amountInUSD * exchangeRates[targetCurrency];
  } else {
    return null;
  }
}

const getLostInFollowPatientListforPathology = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  try {
    const { startDate, endDate, selectedCorporateType, selectedCompany } =
      req.query;

    let whereCondition = {
      // createdAt: {
      //   [Op.between]: [startDate, endDate],
      // },
      // PaymentStatus: "Paid",
    };

    if (selectedCorporateType === "Corporate") {
      whereCondition.CorporateID = {
        [Op.not]: null,
      };
    } else if (selectedCorporateType === "NonCorporate") {
      whereCondition.CorporateID = null;
    }
    if (selectedCompany) {
      whereCondition.CorporateID = selectedCompany;
    }
    const patientsWithSingleBooking = await PathologyTest.findAll({
      attributes: ["PatientID"],
      group: ["PatientID"],
      having: Sequelize.literal("COUNT(PatientID) = 1"),
      where: whereCondition,
    });

    const patientIDs = patientsWithSingleBooking.map(
      (patient) => patient.PatientID
    );

    const bookingData = await PathologyTest.findAll({
      where: {
        PatientID: patientIDs,
      },
    });

    console.log("bookingData: " + bookingData);
    res.status(200).json({ bookingData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

const getAllPackageRevenue = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;

  const { startDate, endDate, selectedCorporateType, selectedCompany } =
    req.query;

  try {
    // Fetch all available packages
    const allPackages = await TestPackageModel.findAll();

    // Object to store revenue data with package ID as key
    const packageRevenueData = {};

    // Iterate over all packages and calculate revenue for each
    for (const package of allPackages) {
      let whereCondition = {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
        // Add condition for PaymentStatus being "Paid"
        PaymentStatus: "Paid",
      };

      if (selectedCorporateType === "Corporate") {
        whereCondition.CorporateID = {
          [Op.not]: null,
        };
      } else if (selectedCorporateType === "NonCorporate") {
        whereCondition.CorporateID = null;
      }
      if (selectedCompany) {
        whereCondition.CorporateID = selectedCompany;
      }

      // Set the current package ID in the where condition
      whereCondition.selectedPackageId = package.id;

      // Fetch tests for the current package and specified criteria
      const tests = await PathologyTest.findAll({
        where: whereCondition,
      });

      console.log("Tesssssstt :", tests);

      // Calculate revenue for the current package
      const packageRevenue = tests.length * package.finalPrice;

      // Update packageRevenueData with package details and revenue
      packageRevenueData[package.id] = {
        packageId: package.id,
        packageName: package.packageName,
        packagePrice: package.finalPrice,
        testCount: tests.length,
        Currency: package.Currency,
        packageRevenue: packageRevenue,
      };
    }

    // Convert packageRevenueData object to an array of values
    const resultData = Object.values(packageRevenueData);

    // Log and send result data as JSON response
    console.log("packageRevenueData: " + JSON.stringify(resultData));
    res.json(resultData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTestCountsAndRevenue = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  const { startDate, endDate, selectedCorporateType, selectedCompany } =
    req.query;
  console.log(req.query);
  // Fetch all available tests
  const AllTests = await TestArray.findAll();
  // Object to store revenue data with test ID as key
  const AllTestRevenueData = {};

  try {
    // Iterate over all tests and calculate revenue for each
    for (const test of AllTests) {
      let whereCondition = {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
        PaymentStatus: "Paid",
      };

      if (selectedCorporateType === "Corporate") {
        whereCondition.CorporateID = {
          [Op.not]: null,
        };
      } else if (selectedCorporateType === "NonCorporate") {
        whereCondition.CorporateID = null;
      }
      if (selectedCompany) {
        whereCondition.CorporateID = selectedCompany;
      }

      // Modify the whereCondition to include a partial match on selectedTests
      whereCondition.selectedTests = {
        [Op.like]: `%${test.testName}%`,
      };

      // Fetch entries for the current test and specified criteria
      const testEntries = await PathologyTest.findAll({
        where: whereCondition,
      });

      // Calculate revenue for the current test
      const testRevenue = testEntries.length * test.testPrice;

      // Update AllTestRevenueData with test details and revenue
      AllTestRevenueData[test.id] = {
        testId: test.id,
        testName: test.testName,
        testPrice: test.testPrice,
        testCount: testEntries.length,
        testRevenue: testRevenue,
      };
    }

    // Convert AllTestRevenueData object to an array of values
    const resultData = Object.values(AllTestRevenueData);

    // Log and send result data as JSON response
    console.log("AllTestRevenueData: " + JSON.stringify(resultData));
    res.json(resultData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const listOfInpatientTestonAdmissionID = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  const admissionID = req.params.admissionID;

  try {
    const getList = await StatusOfPathologyTestsForTestBooking.findAll({
      where: { admissionID: admissionID },
    });

    res.json(getList);
  } catch (error) {
    console.error("Error fetching inpatient test list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const listOfInpatientTestonAdmissionIDPathology = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PathologyTest = db.PathologyTest;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const TestPackageModel = db.TestPackageModel;

  const Doctor = db.doctor;
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const Sequelize = require("sequelize");
  const T3T4TSHTestModel = db.T3T4TSHTestModel;
  const BloodSugerForPP = db.BloodSugerForPP;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const AllTestManagementList = db.PathologyTestManage;
  const BloodSugarForFasting = db.BloodSugarForFasting;
  const PlateletCountTest = db.PlateletCountTestModel;
  const LipidProfileModel = db.LipidProfileModel;
  const TestArray = db.PathologyTestManage;
  const admissionID = req.params.admissionID;

  try {
    const getList = await StatusOfPathologyTestsForTestBooking.findAll({
      where: { admissionID: admissionID },
    });

    res.json(getList);
  } catch (error) {
    console.error("Error fetching inpatient test list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getAllInPatientBookings,
  listOfInpatientTestonAdmissionID,
  updateBooking,
  deleteBooking,
  listOfInpatientTestonAdmissionIDPathology,
  updateResult,
  GetTestBookingAndResultData,
  createBookingEvent,
  updateAuthorization,
  getSelectedPackageBooking,
  getSelectedTestRevenue,
  getAllBookingsTestPathologyPerVisit,
  getAllBookingsTestPathologySelectedDoctorReferral,
  getLostInFollowPatientListforPathology,
  getAllBookingsTestPathologyAllDoctorReferral,
  getAllPackageRevenue,
  getTestCountsAndRevenue,
  getSelectedPackagePatients,
  getAllPathologyTestData,
  getPathologyDataUsingAdmissionId,
};

// Function to get exchange rates from the API
async function getExchangeRates() {
  try {
    const response = await axios.get(
      `${process.env.REMOTE_SERVER_BASE_URL}/api/GetExchangeRates/INR`
    );

    const exchangeRatesData = response.data.exchangeRatesData;
    const firstCurrencyData = exchangeRatesData[0].data;
    const rates = firstCurrencyData.rates;
    return rates;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching exchange rates");
  }
}

// Function to convert amount to the target currency
function convertToCurrency(amount, currency, exchangeRates, targetCurrency) {
  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedAmount)) {
    return null;
  }

  if (currency === targetCurrency) {
    return parsedAmount;
  } else if (exchangeRates[currency] && exchangeRates[targetCurrency]) {
    const amountInINR = parsedAmount / exchangeRates[currency];
    return amountInINR * exchangeRates[targetCurrency];
  } else {
    return null;
  }
}
