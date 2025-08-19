const db = require("../model/index.model.js");
const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
const Patient = db.paitentReg;
const DoctorModel = db.doctor;
const Doctor = db.doctor;
const StatusOfDiagnosticTestsForTestBooking =
  db.StatusOfDiagnosticTestsForTestBooking;
const TestArray = db.DiagnosticTestList;
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const TestPackageModel = db.Diagnostics_package;
const { getConnectionList } = require("../model/index.model3");
const axios = require("axios");

const EnterCodeTypeValue = db.CommissionCodeData;

function findTestIdByName(tests, testName) {
  console.log("testName " + testName);
  const test = tests.find((test) => test.testName === testName);
  return test ? test.id : null;
}
const createBooking = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const Payments = db.Payments;
  const HospitalAdmission = db.HospitalAdmission;

  try {
    const {
      patientId,
      doctorID,
      status,
      lapName,
      remarks,
      instrumentsUsed,
      //selectedTests, // array without id
      //selectedTest, // array with id name
      testFees,
      paymentDate,
      paymentStatus,
      commissionType,
      commissionValue,
      selectedPackageID,
      TestManagementID,
      Currency,
      TotalFees,
      admissionID,
      PaidAmount,
    } = req.body;
    // if (paymentStatus == "Paid") {
    //   PaidAmount = TotalFees;
    // }
    console.log(req.body);
    // return;
    const selectedTestArray = new Set(req.body.selectedTest);
    const selectedTest = [...selectedTestArray];

    const selectedTestsArray = new Set(req.body.selectedTests);
    const selectedTests = [...selectedTestsArray];

    console.log(req.body);
    console.log("selectedTest: " + selectedTest);
    /// return;
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
    // match && match[1]
    if (true) {
      // const patientId = patientId;
      console.log("Patient ID:", patientId);

      // Fetch patient details by patientId
      const patient = await Patient.findByPk(patientId);
      const doctor = await DoctorModel.findByPk(doctorID);

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      console.log(patient);
      const selectedTestsString = selectedTest.join(", ");

      //return;
      // Create a new pathology test record

      const DiagnosticsBookingModels = await DiagnosticsBookingModel.create({
        PatientName:
          patient.mr +
          " " +
          patient.firstName +
          " " +
          patient.middleName +
          " " +
          patient.lastName,
        PatientID: patient.id,
        selectedPackageID: selectedPackageID,
        CorporateID: patient?.CorporateID || null,
        DoctorName:
          (doctor?.FirstName || "NA") + " " + (doctor?.LastName || "NA"),
        DoctorPhone: doctor?.phoneNo || "0",
        DoctorEmail: doctor?.email,
        doctorId: doctorID || "0",
        Address: "Null",
        PatientPhoneNo: patient?.phoneNumberP,
        status,
        lapName,
        remarks,
        PaidAmount: paymentStatus === "Paid" ? TotalFees : PaidAmount || 0,
        commissionType: enterCodeTypeValue.id,
        commissionValue: enterCodeTypeValue.codeType,
        TestManagementID: TestManagementID,
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

        const newStatus = await StatusOfDiagnosticTestsForTestBooking.create({
          testName: testName,
          TestStatus: status,
          PatientID: patientId,
          DiagnosticTestBookingId: DiagnosticsBookingModels.id,
          TestID: testid,
          TestRegisteredDateTime: currentDateTime,
          admissionID,
        });
      }
      res.status(201).json({
        message: "Pathology test created successfully",
        DiagnosticsBookingModels,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving pathology test" });
  }
};

const getAllBookings = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
  try {
    // Fetch all pathology test bookings
    const bookings = await DiagnosticsBookingModel.findAll();
    console.log("hello");
    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

const getAllDiagnosticsBookings = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const { startDate, endDate, selectedCorporateType, selectedPackageId } =
    req.body;
  try {
    // Fetch all pathology test bookings
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
      const bookings = await DiagnosticsBookingModel.findAll({
        where: whereCondition,
      });
      console.log("bookings :", bookings);
      res.status(200).json({ bookings });
    } else {
      const bookings = await DiagnosticsBookingModel.findAll();
      console.log("hello");
      console.log("bookings :", bookings);
      res.status(200).json({ bookings });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

const getSelectedPackagePatients = async (req, res) => {
  // >>>>>>> ab370a055ef88128447250f673967d45969dd0cc
  try {
    const id = req.params.selectedPackageId;
    const { startDate, endDate } = req.query;

    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const DiagnosticsBooking = db.DiagnosticsBookingModel;

    const data = await DiagnosticsBooking.findAll({
      where: {
        selectedPackageID: id,
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });
    console.log("Length: " + data.length);
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const updateBooking = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
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
      Currency,
      TotalFees,
      PaidAmount,
    } = req.body;

    // console.log(req.body);
    // return;
    // Fetch patient details by patientId
    const selectedTestsString = selectedTests.join(", ");

    // Find the booking by ID
    const doctor = await DoctorModel.findByPk(doctorID);
    const booking = await DiagnosticsBookingModel.findByPk(req.body.id);

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
    booking.selectedTests = selectedTestsString;
    booking.PaymentStatus = paymentStatus;
    booking.PaidAmount = parseInt(booking.PaidAmount) + PaidAmount;
    // booking.PaidAmount = Number(booking.PaidAmount) + PaidAmount;

    if (paymentStatus === "Not-Paid") {
      booking.PaymentDate = null;
    } else {
      booking.PaymentDate = paymentDate;
    }
    booking.DoctorName =
      (doctor?.FirstName || "NA") + " " + (doctor?.LastName || "NA");
    booking.DoctorPhone = doctor?.phoneNo || "0";
    booking.doctorId = doctorID || 0;
    booking.commissionType = enterCodeTypeValue?.id || "0";
    booking.commissionValue = enterCodeTypeValue?.codeType || "NA";
    booking.Currency = Currency;
    if (
      parseInt(booking.TotalFees) <=
      parseInt(booking.PaidAmount) + parseInt(PaidAmount) + 2
    ) {
      booking.PaymentStatus = "Paid";
    } else {
      booking.PaymentStatus = paymentStatus;
    }

    booking.TotalFees = TotalFees;
    console.log("Paid::" + booking.PaidAmount);
    //return;
    await booking.save();

    res
      .status(200)
      .json({ message: "Pathology test updated successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating pathology test" });
  }
};
const updateAuthorization = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
  try {
    const { id, authorizationStatus, feedback } = req.body;

    console.log(req.body);
    // return;
    // Find the booking by ID
    const booking = await DiagnosticsBookingModel.findByPk(id);

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
const deleteBooking = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
  try {
    const bookingId = req.params.id;

    // Find the booking by ID
    const booking = await DiagnosticsBookingModel.findByPk(bookingId);

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

const getSelectedPackageBookingDiagnostic = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
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
    const tests = await DiagnosticsBookingModel.findAll({
      where: whereCondition,
    });
    console.log("DataBooking" + tests);
    res.json(tests);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSelectedTestRevenueDiagnostic = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
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
    // Add condition for PaymentStatus being "Paid"
    whereCondition.PaymentStatus = "Paid";
    // Modify the whereCondition to include a partial match on selectedTests
    whereCondition.selectedTests = {
      [Op.like]: `%${testName}%`,
    };

    const tests = await DiagnosticsBookingModel.findAll({
      where: whereCondition,
    });

    res.json(tests);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllBookingsTestDiagnosticPerVisit = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
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

    const tests = await DiagnosticsBookingModel.findAll({
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

const getAllBookingsTestDiagnosticSelectedDoctorReferral = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
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

    const tests = await DiagnosticsBookingModel.findAll({
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
const getLostInFollowPatientListforDiagnostic = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
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
    const patientsWithSingleBooking = await DiagnosticsBookingModel.findAll({
      attributes: ["PatientID"],
      group: ["PatientID"],
      having: Sequelize.literal("COUNT(PatientID) = 1"),
      where: whereCondition,
    });

    const patientIDs = patientsWithSingleBooking.map(
      (patient) => patient.PatientID
    );

    const bookingData = await DiagnosticsBookingModel.findAll({
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

const getAllBookingsTestDiagnosticAllDoctorReferral = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
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

    const tests = await DiagnosticsBookingModel.findAll({
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

const getAllPackageRevenueDiagnostic = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
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
      const tests = await DiagnosticsBookingModel.findAll({
        where: whereCondition,
      });

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

const getTestCountsAndRevenueDiagnostic = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
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
      const testEntries = await DiagnosticsBookingModel.findAll({
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
const listOfInpatientTestonAdmissionIDDiagnostic = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const Doctor = db.doctor;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const TestArray = db.DiagnosticTestList;
  const TestPackageModel = db.Diagnostics_package;
  const EnterCodeTypeValue = db.CommissionCodeData;
  const admissionID = req.params.admissionID;

  try {
    const getList = await StatusOfDiagnosticTestsForTestBooking.findAll({
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
  updateBooking,
  updateAuthorization,
  deleteBooking,
  listOfInpatientTestonAdmissionIDDiagnostic,
  getSelectedPackageBookingDiagnostic,
  getSelectedTestRevenueDiagnostic,
  getAllBookingsTestDiagnosticPerVisit,
  getAllBookingsTestDiagnosticSelectedDoctorReferral,
  getLostInFollowPatientListforDiagnostic,
  getAllBookingsTestDiagnosticAllDoctorReferral,
  getAllPackageRevenueDiagnostic,
  getTestCountsAndRevenueDiagnostic,
  getSelectedPackagePatients,
  getAllDiagnosticsBookings,
};
