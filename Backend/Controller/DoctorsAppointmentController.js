const db = require("../model/index.model.js");
const Patient = db.paitentReg;
const Doctor = db.doctor;
const DoctorsAppointment = db.DoctorsAppointment;
const pathologistTestBookingAppointment = db.pathologistTestBookingAppointment;
const { getConnectionList } = require("../model/index.model3");

const Sequelize = require("sequelize");

function findTestIdByName(tests, testName) {
  const test = tests.find((test) => test.testName === testName);
  return test ? test.id : null;
}

const { Op } = require("sequelize");
const moment = require("moment");
const fs = require("fs");
//

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

//

const createDoctorsAppointment = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const DoctorsAppointment = db.DoctorsAppointment;
  const pathologistTestBookingAppointment =
    db.pathologistTestBookingAppointment;

  try {
    const {
      doctorId,
      patientId,
      paymentStatus,
      paymentDateTime,
      amount,
      bookingStartDate,
      bookingEndDate,
      remarks,
      capturedImage,
      visitType,
      reason,
      Currency,
      admissionID,
      referraldoctorId,
    } = req.body;
    console.log("res.body=", req.body);
    // return;
    // console.log("capturedImage=", capturedImage);
    let image;
    if (req.file) {
      const file = req.file.path;
      // const formData = req.body;

      image = file;
    } else {
      image = capturedImage;
    }

    console.log("image=", image);
    // let imageBuffer = "";

    // if (image) {
    //   try {
    //     imageBuffer = await fs.promises.readFile(image.path);
    //   } catch (error) {
    //     console.log("Error reading the image file:", error);
    //   }
    // } else {
    //   console.log("Image file does not exist.");
    // }

    // console.log("imagebufer=", imageBuffer);
    // return;
    const fetchedPatient = await Patient.findByPk(patientId);
    const fetchedDoctor = await Doctor.findByPk(doctorId);

    if (!fetchedPatient || !fetchedDoctor) {
      console.log("Patient or Doctor Not Found");
      return res
        .status(404)
        .json({ success: false, error: "Patient or doctor not found" });
    }

    //format start date
    const hour = moment(bookingStartDate).hours();
    const minute = moment(bookingStartDate).minutes();
    const newDateTime = moment(bookingStartDate).set({
      hour: hour,
      minute: minute,
    });

    const formattedDateTime = newDateTime.format("MM/DD/YYYY, hh:mm A");
    req.body.bookingStartDate = formattedDateTime;

    //format payment time Date
    const hourpayment = moment(paymentDateTime).hours();
    const minutepayment = moment(paymentDateTime).minutes();
    const newDateTimepayment = moment(paymentDateTime).set({
      hour: hourpayment,
      minute: minutepayment,
    });

    const formattedDateTimepayment = newDateTimepayment.format(
      "MM/DD/YYYY, hh:mm A"
    );
    req.body.paymentDateTime = formattedDateTimepayment;

    //format End Date
    const hourend = moment(bookingEndDate).hours();
    const minuteend = moment(bookingEndDate).minutes();
    const newDateTimeend = moment(bookingEndDate).set({
      hour: hourend,
      minute: minuteend,
    });

    const formattedDateTimeend = newDateTimeend.format("MM/DD/YYYY, hh:mm A");
    req.body.bookingEndDate = formattedDateTimeend;

    console.log(req.body);
    //return;

    const newAppointment = await DoctorsAppointment.create({
      doctorId,
      patientId,
      CorporateID: fetchedPatient?.CorporateID || null,
      image: image,
      PatientName:
        fetchedPatient.mr +
        " " +
        fetchedPatient.firstName +
        " " +
        fetchedPatient.lastName,
      PatientPhone: fetchedPatient.phoneNumberP,
      DoctorName: fetchedDoctor.FirstName + " " + fetchedDoctor.LastName,
      DoctorPhone: fetchedDoctor.phoneNo,
      DoctorEmail: fetchedDoctor.email,
      amount,
      paymentStatus,
      paymentDateTime: req.body.paymentDateTime,
      bookingStartDate: req.body.bookingStartDate,
      bookingEndDate: req.body.bookingEndDate,
      remarks,
      BookingStatus: "Booked",
      visitType,
      reason,
      Currency,
      admissionID,
      referraldoctorId,
    });

    res.status(200).json({ success: true, appointment: newAppointment });
  } catch (error) {
    console.error("Error creating doctors appointment:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create doctors appointment." });
  }
};

const updateDoctorsAppointment = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const DoctorsAppointment = db.DoctorsAppointment;
  const pathologistTestBookingAppointment =
    db.pathologistTestBookingAppointment;

  const appointmentId = req.params.id; // Assuming the appointment ID is passed as a route parameter

  try {
    // Find the appointment by ID
    const appointment = await DoctorsAppointment.findByPk(appointmentId);
    const fetchedDoctor = await Doctor.findByPk(req.body.doctorId);

    console.log(fetchedDoctor);
    // return;
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, error: "Appointment not found" });
    }
    const { paymentStatus, paymentDateTime, amount, reason, visitType } =
      req.body;
    //format paymentDateTime date
    const hour = moment(paymentDateTime).hours();
    const minute = moment(paymentDateTime).minutes();
    const newDateTime = moment(paymentDateTime).set({
      hour: hour,
      minute: minute,
    });

    const formattedDateTime = newDateTime.format("MM/DD/YYYY, hh:mm A");
    req.body.paymentDateTime = formattedDateTime;
    console.log(paymentStatus);

    // Update the appointment properties with values from req.body
    appointment.bookingStartDate = req.body.bookingStartDate;
    appointment.bookingEndDate = req.body.bookingEndDate;
    appointment.doctorId = req.body.doctorId;
    appointment.DoctorPhone = fetchedDoctor.phoneNo;
    appointment.DoctorEmail = fetchedDoctor.email;
    appointment.DoctorName =
      fetchedDoctor.FirstName + " " + fetchedDoctor.LastName;
    appointment.amount = amount;
    appointment.paymentDateTime = req.body.paymentDateTime;
    appointment.paymentStatus = paymentStatus;
    appointment.visitType = visitType || "";
    appointment.reason = reason || "";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment: appointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to update appointment" });
  }
};

const getAllDoctorsAppointments = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DoctorsAppointment = db.DoctorsAppointment;

  try {
    const appointments = await DoctorsAppointment.findAll({
      order: [["createdAt", "DESC"]],
      attributes: { include: ["referralDoctorId"] }, // ensure Sequelize fetches it
    });

    const imagesWithBase64 = await Promise.all(
      appointments.map(async (image) => {
        let imageBase64;

        if (image && image.image && image.image.startsWith("images")) {
          const imageBuffer = fs.readFileSync(image.image);
          imageBase64 = imageBuffer.toString("base64");
        } else {
          imageBase64 = image?.image;
        }

        return {
          id: image?.id ?? null,
          image: imageBase64 ? `data:image/png;base64,${imageBase64}` : null,
          doctorId: image?.doctorId ?? null,
          patientId: image?.patientId ?? null,
          PatientName: image?.PatientName ?? null,
          PatientPhone: image?.PatientPhone ?? null,
          DoctorName: image?.DoctorName ?? null,
          DoctorPhone: image?.DoctorPhone ?? null,
          DoctorEmail: image?.DoctorEmail ?? null,
          amount: image?.amount ?? null,
          paymentStatus: image?.paymentStatus ?? null,
          visitType: image?.visitType ?? null,
          reason: image?.reason ?? null,
          paymentDateTime: image?.paymentDateTime ?? null,
          bookingStartDate: image?.bookingStartDate ?? null,
          bookingEndDate: image?.bookingEndDate ?? null,
          remarks: image?.remarks ?? null,
          createdAt: image?.createdAt ?? null,
          CorporateID: image?.CorporateID ?? null,
          Currency: image?.Currency ?? null,
          referralDoctorId:
            image?.referralDoctorId ?? image?.referraldoctorId ?? null,
        };
      })
    );

    res.status(200).json({ success: true, appointments: imagesWithBase64 });
  } catch (error) {
    console.error("Error fetching doctors appointments:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch doctors appointments." });
  }
};

const deleteAppointment = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const DoctorsAppointment = db.DoctorsAppointment;
  const pathologistTestBookingAppointment =
    db.pathologistTestBookingAppointment;

  const appointmentId = req.params.id;

  try {
    // Find the appointment by ID
    const appointment = await DoctorsAppointment.findByPk(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, error: "Appointment not found" });
    }

    // Delete the appointment
    await appointment.destroy();

    res
      .status(200)
      .json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to delete appointment" });
  }
};

const findallPatientsEachDoctor = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const DoctorsAppointment = db.DoctorsAppointment;
  const pathologistTestBookingAppointment =
    db.pathologistTestBookingAppointment;

  try {
    const { email } = req.params;
    const token = req.headers.authorization;
    console.log(token);

    // Find all patient records in the PaitentReg model where DoctorEmail matches the provided email
    const patients = await DoctorsAppointment.findAll({
      where: { DoctorEmail: email },
      order: [["createdAt", "DESC"]],
    });

    console.log(patients);
    // Send the patient records as a response to the API request
    res.send(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

const getPatientDoctorDatabyBookingID = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const DoctorsAppointment = db.DoctorsAppointment;
  const pathologistTestBookingAppointment =
    db.pathologistTestBookingAppointment;

  try {
    const appointmentId = req.params.id;
    console.log(req.body);

    const appointment = await DoctorsAppointment.findByPk(appointmentId);
    const fetchedPatient = await Patient.findByPk(appointment.patientId);
    const fetchedDoctor = await Doctor.findByPk(appointment.doctorId);

    if (!fetchedPatient || !fetchedDoctor) {
      console.log("Patient or Doctor Not Found");
      return res
        .status(404)
        .json({ success: false, error: "Patient or doctor not found" });
    }

    // Combine patient and doctor data into a single object
    const patientDoctorData = {
      patient: fetchedPatient,
      doctor: fetchedDoctor,
    };

    // Send the combined data as a response
    res.status(200).json({ success: true, data: patientDoctorData });
  } catch (error) {
    console.error("Error fetching patient and doctor data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch patient and doctor data",
    });
  }
};

const createPathologistTestBooking = async (req, res) => {
  const { patientId, tests } = req.body;
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const DoctorsAppointment = db.DoctorsAppointment;
  const pathologistTestBookingAppointment =
    db.pathologistTestBookingAppointment;

  try {
    // Fetch patient data using paitentReg model
    const patientData = await Patient.findOne({
      where: {
        id: patientId,
      },
    });

    if (!patientData) {
      return res.status(404).json({ message: "Patient not found" });
    }
    console.log(patientData.firstName);
    //return;

    // Convert test IDas to comma-separated string
    const testIdsString = tests.join(",");
    console.log(testIdsString);
    //return;
    // Create the booking
    const booking = await pathologistTestBookingAppointment.create({
      patientId,
      PatientName:
        patientData.mr +
        " " +
        patientData?.mr +
        " " +
        patientData?.firstName +
        " " +
        patientData.lastName,
      PatientPhone: patientData.phoneNumberP,
      testManagementID: testIdsString,
    });

    return res
      .status(200)
      .json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating Pathologist Test:", error);
    return res
      .status(500)
      .json({ message: "Failed to create Pathologist Test" });
  }
};

const getBookingsWithCorporateIDNotNull = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const DoctorsAppointment = db.DoctorsAppointment;
  const pathologistTestBookingAppointment =
    db.pathologistTestBookingAppointment;

  try {
    const bookings = await DoctorsAppointment.findAll({
      where: {
        CorporateID: {
          [Op.not]: null,
        },
      },
    });

    res.status(200).json({ success: true, appointments: bookings });
  } catch (error) {
    console.error("Error fetching bookings with CorporateID not null:", error);
    throw error;
  }
};
const getBookingsWithCorporateIDNull = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const DoctorsAppointment = db.DoctorsAppointment;
  const pathologistTestBookingAppointment =
    db.pathologistTestBookingAppointment;

  try {
    const bookings = await DoctorsAppointment.findAll({
      where: {
        CorporateID: null,
      },
    });

    res.status(200).json({ success: true, appointments: bookings });
  } catch (error) {
    console.error("Error fetching bookings with CorporateID null:", error);
    throw error;
  }
};

const getAllBookingsConsultationPerVisit = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const DoctorsAppointment = db.DoctorsAppointment;
  const pathologistTestBookingAppointment =
    db.pathologistTestBookingAppointment;

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
    whereCondition.paymentStatus = "paid";
    // Modify the whereCondition to include a partial match on selectedTests

    const tests = await DoctorsAppointment.findAll({
      where: whereCondition,
    });
    console.log(
      "/////////////////////////////////////////////////////////////"
    );
    const mergedBookings = {};
    tests.forEach((booking) => {
      const key =
        booking.PatientID + booking.createdAt.toISOString().split("T")[0]; // Using date only

      if (!mergedBookings[key]) {
        mergedBookings[key] = {
          ...booking,
          amount: parseInt(booking.amount),
        };
      } else {
        mergedBookings[key].amount += parseInt(booking.amount);
      }
      mergedBookings[key].PatientName = booking.PatientName;
      mergedBookings[key].createdAt = booking.createdAt;
      mergedBookings[key].PatientPhone = booking.PatientPhone;
      mergedBookings[key].patientId = booking.patientId;
    });

    const result = Object.values(mergedBookings);

    console.log("length: " + JSON.stringify(result.length));
    console.log("length: " + JSON.stringify(tests.length));
    //return;
    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLostInFollowPatientListforConsultation = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Patient = db.paitentReg;
  const Doctor = db.doctor;
  const DoctorsAppointment = db.DoctorsAppointment;
  const pathologistTestBookingAppointment =
    db.pathologistTestBookingAppointment;

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
    const patientsWithSingleBooking = await DoctorsAppointment.findAll({
      attributes: ["patientId"],
      group: ["patientId"],
      having: Sequelize.literal("COUNT(patientId) = 1"),
      where: whereCondition,
    });

    const patientIDs = patientsWithSingleBooking.map(
      (patient) => patient.patientId
    );

    const bookingData = await DoctorsAppointment.findAll({
      where: {
        patientId: patientIDs,
      },
    });

    console.log("bookingData////: " + JSON.stringify(bookingData)); // Modified line
    res.status(200).json({ bookingData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};
module.exports = {
  createDoctorsAppointment,
  getAllDoctorsAppointments,
  getBookingsWithCorporateIDNull,
  deleteAppointment,
  updateDoctorsAppointment,
  findallPatientsEachDoctor,
  getPatientDoctorDatabyBookingID,
  getBookingsWithCorporateIDNotNull,
  createPathologistTestBooking,
  getAllBookingsConsultationPerVisit,
  getLostInFollowPatientListforConsultation,
};
