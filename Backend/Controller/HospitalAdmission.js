const db = require("../model/index.model.js");
const HospitalAdmission = db.HospitalAdmission;
const PathologyTest = db.PathologyTest;
const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
const DoctorsAppointment = db.DoctorsAppointment;
const Patient = db.paitentReg;
const Doctor = db.doctor;
const BedsHospitalRoom = db.BedsHospitalRoom;
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const Medecines = db.paitentMedicines;
const PaisentPrescription = db.paisentprescription;
const { getConnectionList } = require("../model/index.model3");

const createHospitalAdmission = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Medecines = db.paitentMedicines;
  const PaisentPrescription = db.paisentprescription;
  const HospitalAdmission = db.HospitalAdmission;
  const PathologyTest = db.PathologyTest;
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const DoctorsAppointment = db.DoctorsAppointment;
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const BedsHospitalRoom = db.BedsHospitalRoom;
  const Payments = db.Payments;

  console.log(req.body);

  try {
    const {
      patientId,
      doctorId,
      referringPhysician,
      AdmissionType,
      admissionDate,
      reason,
      medications,
      previousHospitalizations,
      chronicConditions,
      paymentStatus,
      amount,
      currency,
      paymentOption,
      paymentDateTime,
      CheckInTime,
      CheckOutTime,
      BedNumber,
      advanceAmount,
      totalAmount,
      paymentType,
      dueAmount,
      refDoctorId
    } = req.body;

    console.log("hospitaladminid",req.body);
    // return;
    // Validate required fields
    if (
      !patientId ||
      !doctorId ||
      !refDoctorId ||
      // !AdmissionType ||
      !admissionDate ||
      // !paymentStatus ||
      // !paymentType ||
      // !amount ||
      !currency ||
      // !paymentOption ||
      !paymentDateTime
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const fetchedPatient = await Patient.findByPk(patientId);
    const fetchedDoctor = await Doctor.findByPk(doctorId);
    const referringPhysicianDoctor = await Doctor.findByPk(refDoctorId);
    const getBedDetails = await BedsHospitalRoom.findOne({
      where: { BedNumber: BedNumber },
    });
    const bed = await BedsHospitalRoom.findByPk(getBedDetails?.id);

    // console.log(getBedDetails);
    //  return;
    if (!fetchedPatient || !fetchedDoctor) {
      console.log("Patient or Doctor Not Found");
      return res
        .status(404)
        .json({ success: false, error: "Patient or doctor not found" });
    }

    if (paymentType == "normal") {
      // Create a new hospital admission
      try {
        const newHospitalAdmission = await HospitalAdmission.create({
          PatientName:
            fetchedPatient.mr +
            " " +
            fetchedPatient.firstName +
            " " +
            fetchedPatient.lastName,
          PatientPhoneNo: fetchedPatient?.phoneNumberP,
          AdmittingPhysician:
            fetchedDoctor?.FirstName + " " + fetchedDoctor?.LastName,
          AdmittingPhysicianPhone: fetchedDoctor.phoneNo,
          ReferringPhysician:
            referringPhysicianDoctor?.FirstName +
            " " +
            referringPhysicianDoctor?.LastName,
          ReferringPhysicianPhone: referringPhysicianDoctor.phoneNo,
          PatientID: patientId,
          AdmittingPhysicianID: doctorId,
          ReferringPhysicianID: referringPhysician,
          AdmissionType,
          AdmissionDate: admissionDate,
          ReasonForAdmission: reason || "NA",
          Medications: medications || "NA",
          PreviousHospitalizations: previousHospitalizations || "NA",
          ChronicConditions: chronicConditions || "NA",
          PaymentStatus: paymentStatus,
          AdvanceAmount: amount,
          Currency: currency,
          PaymentOption: paymentOption,
          PaymentDate: paymentDateTime,
          RoomNumber: getBedDetails?.HospitalRoomNumber,
          BedNumber: getBedDetails?.BedNumber,
          BedType: getBedDetails?.BedType,
          CheckInTime: CheckInTime,
          CheckOutTime: CheckOutTime,
          PaymentType: paymentType,
          TotalAmount: totalAmount,
          DueAmount: 0,
          AdvanceAmount: 0,
          PaymentStatus: "paid",
          TotalExpense: totalAmount,
          TotalAdvance: advanceAmount,
        });

        bed.OccupiedCheckInTime = CheckInTime;
        bed.OccupiedCheckOutTime = CheckOutTime;
        bed.OccupiedAdmissionID = newHospitalAdmission?.id;
        const updatedBed = await bed.save();

        console.log(newHospitalAdmission);

        if (newHospitalAdmission.id) {
          const newPayment = await Payments.create({
            paymentID: `pay${Math.floor(1000000 + Math.random() * 9000000)}`,
            paymentDate: paymentDateTime,
            admissionID: newHospitalAdmission.id,
            hospitalID: req.hospitalID,
            amount: amount,
            currency: currency,
          });
        }

        res.status(201).json({
          message: "Hospital admission created successfully.",
          data: newHospitalAdmission,
        });
      } catch (error) {
        console.log("Error :", error);
      }
    } else {
      try {
        let status = "notPaid";

        if (totalAmount == advanceAmount) {
          status = "paid";
        }
        if (dueAmount - advanceAmount == 0) {
          status = "paid";
        }

        const newHospitalAdmission = await HospitalAdmission.create({
          PatientName:
            fetchedPatient.mr +
            " " +
            fetchedPatient.firstName +
            " " +
            fetchedPatient.lastName,
          PatientPhoneNo: fetchedPatient?.phoneNumberP,
          AdmittingPhysician:
            fetchedDoctor?.FirstName + " " + fetchedDoctor?.LastName,
          AdmittingPhysicianPhone: fetchedDoctor.phoneNo,
          ReferringPhysician:
            referringPhysicianDoctor?.FirstName +
            " " +
            referringPhysicianDoctor?.LastName,
          ReferringPhysicianPhone: referringPhysicianDoctor.phoneNo,
          PatientID: patientId,
          AdmittingPhysicianID: doctorId,
          ReferringPhysicianID: referringPhysician,
          AdmissionType,
          AdmissionDate: admissionDate,
          ReasonForAdmission: reason || "NA",
          Medications: medications || "NA",
          PreviousHospitalizations: previousHospitalizations || "NA",
          ChronicConditions: chronicConditions || "NA",
          PaymentStatus: paymentStatus,
          AdvanceAmount: amount,
          Currency: currency,
          PaymentOption: paymentOption,
          PaymentDate: paymentDateTime,
          RoomNumber: getBedDetails?.HospitalRoomNumber,
          BedNumber: getBedDetails?.BedNumber,
          BedType: getBedDetails?.BedType,
          CheckInTime: CheckInTime,
          CheckOutTime: CheckOutTime,
          PaymentType: paymentType,
          TotalAmount: totalAmount,
          DueAmount: totalAmount - advanceAmount,
          AdvanceAmount: advanceAmount,
          PaymentStatus: status,
          TotalExpense: totalAmount,
          TotalAdvance: advanceAmount,
        });

        bed.OccupiedCheckInTime = CheckInTime;
        bed.OccupiedCheckOutTime = CheckOutTime;
        bed.OccupiedAdmissionID = newHospitalAdmission?.id;
        const updatedBed = await bed.save();

        console.log(newHospitalAdmission);

        if (newHospitalAdmission.id) {
          const newPayment = await Payments.create({
            paymentID: `pay${Math.floor(1000000 + Math.random() * 9000000)}`,
            paymentDate: paymentDateTime,
            admissionID: newHospitalAdmission.id,
            hospitalID: req.hospitalID,
            amount: advanceAmount,
            currency: currency,
          });
        }

        res.status(201).json({
          message: "Hospital admission created successfully.",
          data: newHospitalAdmission,
        });
      } catch (error) {
        console.log("Error :", error);
      }
    }

    // Create a new hospital admission

    // bed.OccupiedCheckInTime = CheckInTime;
    // bed.OccupiedCheckOutTime = CheckOutTime;
    // bed.OccupiedAdmissionID = newHospitalAdmission?.id;
    // const updatedBed = await bed.save();

    // res.status(201).json({
    //   message: "Hospital admission created successfully.",
    //   data: newHospitalAdmission,
    // });
  } catch (error) {
    console.error("Error creating hospital admission:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getAllHospitalAdmissions = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Medecines = db.paitentMedicines;
  const PaisentPrescription = db.paisentprescription;
  const HospitalAdmission = db.HospitalAdmission;
  const PathologyTest = db.PathologyTest;
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const DoctorsAppointment = db.DoctorsAppointment;
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const BedsHospitalRoom = db.BedsHospitalRoom;
  try {
    const hospitalAdmissions = await HospitalAdmission.findAll();

    res.status(200).json({
      success: true,
      data: hospitalAdmissions,
    });
  } catch (error) {
    console.error("Error fetching hospital admissions:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const formatDateTime = (isoDateTime) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(isoDateTime).toLocaleString("en-US", options);
};

const checkBedAavailability = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Medecines = db.paitentMedicines;
  const PaisentPrescription = db.paisentprescription;
  const HospitalAdmission = db.HospitalAdmission;
  const PathologyTest = db.PathologyTest;
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const DoctorsAppointment = db.DoctorsAppointment;
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const BedsHospitalRoom = db.BedsHospitalRoom;
  try {
    const { startDate, endDate, bedNumber } = req.body;

    const formattedStartDate = formatDateTime(startDate);
    const formattedEndDate = formatDateTime(endDate);

    const occupiedBed = await HospitalAdmission.findOne({
      where: {
        BedNumber: bedNumber,
        [Op.or]: [
          {
            [Op.and]: [
              { CheckInTime: { [Op.lte]: formattedEndDate } },
              { CheckOutTime: { [Op.gte]: formattedStartDate } },
            ],
          },
        ],
      },
    });

    if (occupiedBed) {
      return res.json({ status: "Occupied", bedNumber });
    } else {
      return res.json({ status: "Available", bedNumber });
    }
  } catch (error) {
    console.error("Error checking bed availability:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getBedsListWithStatus = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Medecines = db.paitentMedicines;
  const PaisentPrescription = db.paisentprescription;
  const HospitalAdmission = db.HospitalAdmission;
  const PathologyTest = db.PathologyTest;
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const DoctorsAppointment = db.DoctorsAppointment;
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const BedsHospitalRoom = db.BedsHospitalRoom;
  try {
    const { startDate, endDate } = req.body;
    console.log(req.body);
    const formattedStartDate = formatDateTime(startDate);
    const formattedEndDate = formatDateTime(endDate);

    // Fetch all beds from the database
    const bedsList = await BedsHospitalRoom.findAll();

    // Check availability status for each bed
    const bedsWithStatus = await Promise.all(
      bedsList.map(async (bed) => {
        const occupiedBed = await HospitalAdmission.findOne({
          where: {
            BedNumber: bed.BedNumber,
            [Op.or]: [
              {
                [Op.and]: [
                  { CheckInTime: { [Op.lte]: formattedEndDate } },
                  { CheckOutTime: { [Op.gte]: formattedStartDate } },
                ],
              },
            ],
          },
        });

        return {
          ...bed.toJSON(),
          status: occupiedBed ? "Occupied" : "Available",
        };
      })
    );

    // Return the list of beds with status as JSON response
    res.json(bedsWithStatus);
  } catch (error) {
    console.error("Error getting beds list with status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getHospitalAdmissionById = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const Medecines = db.paitentMedicines;
    const PaisentPrescription = db.paisentprescription;
    const HospitalAdmission = db.HospitalAdmission;
    const PathologyTest = db.PathologyTest;
    const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
    const DoctorsAppointment = db.DoctorsAppointment;
    const Patient = db.paitentReg;
    const Doctor = db.doctor;
    const BedsHospitalRoom = db.BedsHospitalRoom;
    const { admissionId } = req.params;

    // Validate admissionId
    if (!admissionId) {
      return res.status(400).json({ error: "Admission ID is required." });
    }

    // Find the hospital admission by ID
    const hospitalAdmission = await HospitalAdmission.findByPk(admissionId);

    // Check if the admission exists
    if (!hospitalAdmission) {
      return res.status(404).json({ error: "Hospital admission not found." });
    }

    // Send the hospital admission data in the response
    res.status(200).json({
      success: true,
      data: hospitalAdmission,
    });
  } catch (error) {
    console.error("Error getting hospital admission by ID:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
const updateHospitalAdmissionById = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const Medecines = db.paitentMedicines;
    const PaisentPrescription = db.paisentprescription;
    const HospitalAdmission = db.HospitalAdmission;
    const PathologyTest = db.PathologyTest;
    const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
    const DoctorsAppointment = db.DoctorsAppointment;
    const Patient = db.paitentReg;
    const Doctor = db.doctor;
    const BedsHospitalRoom = db.BedsHospitalRoom;
    const { admissionId } = req.params;
    const {
      patientId,
      doctorId,
      referringPhysician,
      AdmissionType,
      admissionDate,
      reason,
      medications,
      previousHospitalizations,
      chronicConditions,
      paymentStatus,
      amount,
      currency,
      paymentOption,
      paymentDateTime,
      CheckInTime,
      CheckOutTime,
      BedNumber,
    } = req.body;

    // Validate admissionId
    if (!admissionId) {
      return res.status(400).json({ error: "Admission ID is required." });
    }

    // Find the hospital admission by ID
    let hospitalAdmission = await HospitalAdmission.findByPk(admissionId);
    const getBedDetails = await BedsHospitalRoom.findOne({
      where: { BedNumber: BedNumber },
    });
    const bed = await BedsHospitalRoom.findByPk(getBedDetails?.id);
    const oldbedstatus = await BedsHospitalRoom.findOne({
      where: { BedNumber: hospitalAdmission?.BedNumber },
    });
    const oldbedupdate = await BedsHospitalRoom.findByPk(oldbedstatus?.id);

    let bedChange = false;
    if (BedNumber !== hospitalAdmission?.BedNumber) {
      bedChange = true;
      // console.log(oldbedstatus);
    }

    const fetchedPatient = await Patient.findByPk(patientId);
    const fetchedDoctor = await Doctor.findByPk(doctorId);
    const referringPhysicianDoctor = await Doctor.findByPk(referringPhysician);

    if (!fetchedPatient || !fetchedDoctor) {
      console.log("Patient or Doctor Not Found");
      return res
        .status(404)
        .json({ success: false, error: "Patient or doctor not found" });
    }
    // Check if the admission exists
    if (!hospitalAdmission) {
      return res.status(404).json({ error: "Hospital admission not found." });
    }

    // Update the hospital admission data
    hospitalAdmission.PatientID = patientId;

    hospitalAdmission.AdmittingPhysicianID = doctorId;
    hospitalAdmission.ReferringPhysicianID = referringPhysician;
    hospitalAdmission.AdmissionType = AdmissionType;
    hospitalAdmission.AdmissionDate = admissionDate;
    hospitalAdmission.ReasonForAdmission = reason || "NA";
    hospitalAdmission.Medications = medications || "NA";
    hospitalAdmission.PreviousHospitalizations =
      previousHospitalizations || "NA";
    hospitalAdmission.ChronicConditions = chronicConditions || "NA";
    // hospitalAdmission.PaymentStatus = paymentStatus;
    // hospitalAdmission.AdvanceAmount = amount;
    // hospitalAdmission.Currency = currency;
    // hospitalAdmission.PaymentOption = paymentOption;
    // hospitalAdmission.PaymentDate = paymentDateTime;
    hospitalAdmission.CheckInTime = CheckInTime;
    hospitalAdmission.CheckOutTime = CheckOutTime;
    hospitalAdmission.BedNumber = BedNumber;
    hospitalAdmission.BedType = getBedDetails?.BedType;
    hospitalAdmission.RoomNumber = getBedDetails?.HospitalRoomNumber;
    hospitalAdmission.PatientName =
      fetchedPatient.mr +
      " " +
      fetchedPatient.firstName +
      " " +
      fetchedPatient.lastName;
    hospitalAdmission.PatientPhoneNo = fetchedPatient?.phoneNumberP;
    (hospitalAdmission.AdmittingPhysician =
      fetchedDoctor?.FirstName + " " + fetchedDoctor?.LastName),
      (hospitalAdmission.AdmittingPhysicianPhone = fetchedDoctor.phoneNo);
    hospitalAdmission.ReferringPhysician =
      referringPhysicianDoctor?.FirstName +
      " " +
      referringPhysicianDoctor?.LastName;
    hospitalAdmission.ReferringPhysicianPhone =
      referringPhysicianDoctor.phoneNo;
    await hospitalAdmission.save();
    if (bedChange) {
      oldbedupdate.OccupiedCheckInTime = null;
      oldbedupdate.OccupiedCheckOutTime = null;
      oldbedupdate.OccupiedAdmissionID = 0;
      const updatedBed1 = await oldbedupdate.save();
      bed.OccupiedCheckInTime = CheckInTime;
      bed.OccupiedCheckOutTime = CheckOutTime;
      bed.OccupiedAdmissionID = admissionId;
      const updatedBed = await bed.save();
    } else {
      bed.OccupiedCheckInTime = CheckInTime;
      bed.OccupiedCheckOutTime = CheckOutTime;
      bed.OccupiedAdmissionID = admissionId;
      const updatedBed = await bed.save();
    }

    // Send the updated hospital admission data in the response
    res.status(200).json({
      success: true,
      message: "Hospital admission updated successfully.",
      data: hospitalAdmission,
    });
  } catch (error) {
    console.error("Error updating hospital admission by ID:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const updatePayment = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const Medecines = db.paitentMedicines;
    const PaisentPrescription = db.paisentprescription;
    const HospitalAdmission = db.HospitalAdmission;
    const PathologyTest = db.PathologyTest;
    const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
    const DoctorsAppointment = db.DoctorsAppointment;
    const Patient = db.paitentReg;
    const Doctor = db.doctor;
    const Payments = db.Payments;
    const BedsHospitalRoom = db.BedsHospitalRoom;
    const { admissionId } = req.params;
    const {
      patientId,
      doctorId,
      referringPhysician,
      AdmissionType,
      admissionDate,
      reason,
      medications,
      previousHospitalizations,
      chronicConditions,
      paymentStatus,
      amount,
      paymentOption,
      paymentDateTime,
      CheckInTime,
      CheckOutTime,
      BedNumber,
      currency,
      advanceAmount,
      paymentType,
      paymentAmount,
    } = req.body;

    console.log("Payments :", db);

    // Validate admissionId
    if (!admissionId) {
      return res.status(400).json({ error: "Admission ID is required." });
    }

    // Find the hospital admission by ID
    let hospitalAdmission = await HospitalAdmission.findByPk(admissionId);

    let status = "unPaid";

    if (hospitalAdmission.DueAmount - advanceAmount == 0) {
      status = "paid";
    }

    if (paymentType == "normal") {
      hospitalAdmission.Currency = currency;
      // hospitalAdmission.AdvanceAmount = Number(hospitalAdmission.AdvanceAmount) + Number(advanceAmount);
      hospitalAdmission.DueAmount =
        Number(hospitalAdmission.DueAmount) - Number(paymentAmount);
      hospitalAdmission.PaymentType = paymentType;
      hospitalAdmission.PaymentStatus = "paid";
      // const newPayment = await Payments.create({
      //     paymentID : `pay${Math.floor(Math.random() * 10)}`,
      //     paymentDate : new Date(),
      //     admissionID : hospitalAdmission.id,
      //     hospitalID : req.hospitalID,
      //     amount : paymentAmount,
      //     currency : currency
      //   })
    } else {
      hospitalAdmission.Currency = currency;
      hospitalAdmission.AdvanceAmount =
        Number(hospitalAdmission.AdvanceAmount) + Number(advanceAmount);
      hospitalAdmission.DueAmount =
        Number(hospitalAdmission.DueAmount) - Number(advanceAmount);
      hospitalAdmission.PaymentType = paymentType;
      hospitalAdmission.PaymentStatus = status;
      hospitalAdmission.TotalAdvance =
        Number(hospitalAdmission.TotalAdvance) + Number(advanceAmount);

      // const newPayment = await Payments.create({
      //   paymentID : `pay${Math.floor(Math.random() * 10)}`,
      //   paymentDate : new Date(),
      //   admissionID : hospitalAdmission.id,
      //   hospitalID : req.hospitalID,
      //   amount : advanceAmount,
      //   currency : currency
      // })
    }
    await hospitalAdmission.save();

    const newPayment = await Payments.create({
      paymentID: `pay${Math.floor(1000000 + Math.random() * 9000000)}`,
      paymentDate: paymentDateTime,
      admissionID: hospitalAdmission.id,
      hospitalID: req.hospitalID,
      amount: paymentType == "normal" ? paymentAmount : advanceAmount,
      currency: currency,
    });

    res.send({ message: "Payment successfull" });
  } catch (error) {
    res.send({ message: "Payment failed" });
    console.log(error);
  }
};

const updateAdmittedPatientStatus = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const Medecines = db.paitentMedicines;
    const PaisentPrescription = db.paisentprescription;
    const HospitalAdmission = db.HospitalAdmission;
    const PathologyTest = db.PathologyTest;
    const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
    const DoctorsAppointment = db.DoctorsAppointment;
    const Patient = db.paitentReg;
    const Doctor = db.doctor;
    const BedsHospitalRoom = db.BedsHospitalRoom;
    const { AdmissionID, patientCondition, nursingNotes, physicianNotes } =
      req.body;

    // if (!AdmissionID || !patientCondition || !nursingNotes || !physicianNotes) {
    //   return res.status(400).json({ error: "All fields are required." });
    // }

    // Find the admission record by AdmissionID
    const admissionRecord = await HospitalAdmission.findByPk(AdmissionID);

    if (!admissionRecord) {
      return res.status(404).json({ error: "Hospital admission not found." });
    }

    // Update the patient status
    admissionRecord.patientCondition = patientCondition || "";
    admissionRecord.nursingNotes = nursingNotes || "";
    admissionRecord.physicianNotes = physicianNotes || "";

    // Save the changes to the database
    await admissionRecord.save();

    res
      .status(200)
      .json({ success: true, message: "Patient status updated successfully." });
  } catch (error) {
    console.error("Error updating patient status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
const updateAdmittedPatientDischargeDetails = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const Medecines = db.paitentMedicines;
    const PaisentPrescription = db.paisentprescription;
    const HospitalAdmission = db.HospitalAdmission;
    const PathologyTest = db.PathologyTest;
    const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
    const DoctorsAppointment = db.DoctorsAppointment;
    const Patient = db.paitentReg;
    const Doctor = db.doctor;
    const BedsHospitalRoom = db.BedsHospitalRoom;
    const {
      AdmissionID,

      DischargeDate,
      DischargeInstruction,
      FollowUpAppointment,
      PatientSignature,
      AuthorizedConsent,
    } = req.body;

    const admissionRecord = await HospitalAdmission.findByPk(AdmissionID);

    if (!admissionRecord) {
      return res.status(404).json({ error: "Hospital admission not found." });
    }

    admissionRecord.DischargeDate = DischargeDate || null;
    admissionRecord.DischargeInstruction = DischargeInstruction || "";
    admissionRecord.FollowUpAppointments = FollowUpAppointment || "";
    admissionRecord.PatientSignature = PatientSignature || "";
    admissionRecord.AuthorizedConsent = AuthorizedConsent || false;
    // Save the changes to the database
    await admissionRecord.save();

    res
      .status(200)
      .json({ success: true, message: "Patient status updated successfully." });
  } catch (error) {
    console.error("Error updating patient status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getAllBillingData = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Medecines = db.paitentMedicines;
  const PaisentPrescription = db.paisentprescription;
  const HospitalAdmission = db.HospitalAdmission;
  const PathologyTest = db.PathologyTest;
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const DoctorsAppointment = db.DoctorsAppointment;
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const BedsHospitalRoom = db.BedsHospitalRoom;
  const pathologyAdmissionData = await PathologyTest.findAll({
    where: { admissionID: { [Op.gt]: 0 } },
  });

  const DoctorsAppointmentData = await DoctorsAppointment.findAll({
    where: { admissionID: { [Op.gt]: 0 } },
  });

  const DiagnosticsBookingData = await DiagnosticsBookingModel.findAll({
    where: { admissionID: { [Op.gt]: 0 } },
  });

  const hospitalAdmissions = await HospitalAdmission.findAll();

  let finalData = [
    ...pathologyAdmissionData,
    ...DoctorsAppointmentData,
    ...DiagnosticsBookingData,
  ];
  // let finalData = [pathologyAdmissionData + DoctorsAppointmentData + DiagnosticsBookingData]

  //  for(let i = 0; i< finalData.length; i++){
  //     for(let j = 0; j < hospitalAdmissions.length; j++ ){
  //       if(finalData[i].PatientID == hospitalAdmissions[j].PatientID){
  //         console.log("TRUEEEEEEEEEEEEEEEEEEEEEEEEE")
  //         finalData[i].AdmissionDate = hospitalAdmissions[j].AdmissionDate
  //       }
  //     }
  //  }

  // let newFinalData = finalData.map((patient)=>{
  //   for(let j = 0; j < hospitalAdmissions.length; j++ ){
  //           if(patient.PatientID == hospitalAdmissions[j].PatientID){
  //             let obj = patient;
  //             console.log('finalData :', patient.PatientID)
  //             console.log('hospitalAdmissions :', hospitalAdmissions[j].PatientID + " " + hospitalAdmissions[j].AdmissionDate)
  //             // obj['AdmissionDate'] = hospitalAdmissions[j].AdmissionDate
  //             console.log(obj)
  //             //  patient.AdmissionDate = hospitalAdmissions[j].AdmissionDate
  //              return {...obj, AdmissionDate : hospitalAdmissions[j].AdmissionDate }
  //           }
  //         }
  // })

  res.send(finalData);
};

const updateAdmittedPatientDischargeSummary = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const Medecines = db.paitentMedicines;
    const PaisentPrescription = db.paisentprescription;
    const HospitalAdmission = db.HospitalAdmission;
    const PathologyTest = db.PathologyTest;
    const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
    const DoctorsAppointment = db.DoctorsAppointment;
    const Patient = db.paitentReg;
    const Doctor = db.doctor;
    const BedsHospitalRoom = db.BedsHospitalRoom;
    const {
      AdmissionID,
      SummaryOfTreatment,
      PostDischargeCare,
      TransferInformation,
      TransferFacility,
      TransferDateTime,
      BillingInformation,
      InsuranceClaimDetails,
      PaymentStatus,
    } = req.body;
    console.log(req.body);
    const admissionRecord = await HospitalAdmission.findByPk(AdmissionID);

    if (!admissionRecord) {
      return res.status(404).json({ error: "Hospital admission not found." });
    }

    // Update discharge summary fields
    admissionRecord.summaryOfTreatment = SummaryOfTreatment;
    admissionRecord.postDischargeCare = PostDischargeCare;
    admissionRecord.transferInformation = TransferInformation;
    admissionRecord.transferFacility = TransferFacility;
    admissionRecord.transferDateTime = TransferDateTime;
    admissionRecord.BillingInformation = BillingInformation;
    admissionRecord.InsuranceClaimDetails = InsuranceClaimDetails;
    admissionRecord.PaymentStatusDischarge = PaymentStatus;
    // Save the updated record
    await admissionRecord.save();

    return res
      .status(200)
      .json({ message: "Discharge summary updated successfully." });
  } catch (error) {
    console.error("Error updating discharge summary:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const getOnePrescriptionForInPatient = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Medecines = db.paitentMedicines;
  const PaisentPrescription = db.paisentprescription;
  const HospitalAdmission = db.HospitalAdmission;
  const PathologyTest = db.PathologyTest;
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const DoctorsAppointment = db.DoctorsAppointment;
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const BedsHospitalRoom = db.BedsHospitalRoom;
  const admissionID = req.params.admissionID;
  console.log(admissionID);
  const appointment = await DoctorsAppointment.findOne({
    where: { admissionID: admissionID },
    order: [["createdAt", "DESC"]],
  });

  if (!appointment) {
    return res
      .status(404)
      .send({ message: "Doctor Consultantation not booked for this Patient" });
  }
  const patientID = appointment.patientId;
  const patient = await db.paitentReg.findOne({
    where: { id: patientID },
    order: [["createdAt", "DESC"]],
  });

  const appointmentID = appointment.id;
  const prescription = await db.paisentprescription.findOne({
    where: { AppointBookingID: appointmentID },
    order: [["createdAt", "DESC"]],
  });
  console.log(prescription);
  if (!prescription) {
    return res.status(404).send({ message: "Not found Prescription" });
  }

  let prescription_Id = prescription?.id;

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
    const PatientPrescription = {
      patient,
      prescription: data,
    };
    res.status(200).send(PatientPrescription);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const HospitalAdminSaveTreatmentPlan = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Medecines = db.paitentMedicines;
  const PaisentPrescription = db.paisentprescription;
  const HospitalAdmission = db.HospitalAdmission;
  const PathologyTest = db.PathologyTest;
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
  const DoctorsAppointment = db.DoctorsAppointment;
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const BedsHospitalRoom = db.BedsHospitalRoom;
  try {
    const { AdmissionID, TreatmentPlan } = req.body;
    console.log(req.body);
    const admissionRecord = await HospitalAdmission.findByPk(AdmissionID);

    if (!admissionRecord) {
      return res.status(404).json({ error: "Hospital admission not found." });
    }

    admissionRecord.TreatmentPlan = TreatmentPlan;
    // Save the updated record
    await admissionRecord.save();

    return res
      .status(200)
      .json({ message: "Discharge summary updated successfully." });
  } catch (error) {
    console.error("Error updating discharge summary:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Experiment
const totalExpenses = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalAdmission = db.HospitalAdmission;
  const PathologyTests = db.PathologyTest;
  const DiagnosticsTests = db.DiagnosticsBookingModel;
  const { admissionId } = req.params;

  try {
    db.HospitalAdmission.findAll({
      where: { id: admissionId },
      attributes: ["id"],
      include: [
        { model: PathologyTests, attributes: ["admissionID"] },
        { model: DiagnosticsTests, attributes: ["admissionID"] },
      ],
    })
      .then(function (data) {
        return res.json(data);
      })
      .catch(function (err) {
        console.log(err);
        return res.send({
          error: err,
          status: 500,
        });
      });
  } catch (error) {
    console.log("Error fetching total expense:", error);
    return res.status(500).send({ error: "Internal server error." });
  }
};

module.exports = {
  createHospitalAdmission,
  updateAdmittedPatientDischargeSummary,
  getAllHospitalAdmissions,
  checkBedAavailability,
  getBedsListWithStatus,
  getHospitalAdmissionById,
  getAllBillingData,
  getOnePrescriptionForInPatient,
  updateHospitalAdmissionById,
  updateAdmittedPatientStatus,
  updateAdmittedPatientDischargeDetails,
  HospitalAdminSaveTreatmentPlan,
  updatePayment,
  totalExpenses,
};

// admissionID: {
//   [Op.gt]: 0
// }
// }
