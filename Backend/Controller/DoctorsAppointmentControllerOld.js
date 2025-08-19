const db = require("../model/index.model.js");
const Patient = db.paitentReg;
const Doctor = db.doctor;
const DoctorsAppointment = db.DoctorsAppointment;
const pathologistTestBookingAppointment = db.pathologistTestBookingAppointment;
const { Op } = require("sequelize");
const moment = require("moment");
const multer = require("multer");
const upload = multer({ dest: "public/images" });

const createDoctorsAppointment = async (req, res) => {
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
    } = req.body;
    console.log(req.body);

    console.log(capturedImage);
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
      image: capturedImage,
      PatientName:
        fetchedPatient.mr +
        " " +
        fetchedPatient.firstName +
        " " +
        fetchedPatient.middleName +
        " " +
        fetchedPatient.lastName,
      PatientPhone: fetchedPatient.phoneNumberP,
      DoctorName:
        fetchedDoctor.FirstName +
        " " +
        fetchedDoctor.MiddleName +
        " " +
        fetchedDoctor.LastName,
      DoctorPhone: fetchedDoctor.phoneNo,
      DoctorEmail: fetchedDoctor.email,
      amount,
      paymentStatus,
      paymentDateTime: req.body.paymentDateTime,
      bookingStartDate: req.body.bookingStartDate,
      bookingEndDate: req.body.bookingEndDate,
      remarks,
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
    const { paymentStatus, paymentDateTime, amount } = req.body;
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
      fetchedDoctor.FirstName +
      " " +
      fetchedDoctor.MiddleName +
      " " +
      fetchedDoctor.LastName;
    appointment.amount = amount;
    appointment.paymentDateTime = req.body.paymentDateTime;
    appointment.paymentStatus = paymentStatus;

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
  try {
    const appointments = await DoctorsAppointment.findAll();

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching doctors appointments:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch doctors appointments." });
  }
};

// const getAllDoctorsAppointments = async (req, res) => {
//   try {
//     const appointments = await DoctorsAppointment.findAll();

//     const imagesWithBase64 = await Promise.all(
//       appointments.map(async (image) => {
//         const imagePath = image.imagePath;
//         const imageBuffer = fs.readFileSync(imagePath);
//         const imageBase64 = imageBuffer.toString("base64");
//         return {
//           id: image.id,
//           image: `data:image/png;base64,${imageBase64}`,
//         };
//       })
//     );

//     res.status(200).json({ success: true, appointments: imagesWithBase64 });
//   } catch (error) {
//     console.error("Error fetching doctors appointments:", error);
//     res
//       .status(500)
//       .json({ success: false, error: "Failed to fetch doctors appointments." });
//   }
// };

const deleteAppointment = async (req, res) => {
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

    // Convert test IDs to comma-separated string
    const testIdsString = tests.join(",");
    console.log(testIdsString);
    //return;
    // Create the booking
    const booking = await pathologistTestBookingAppointment.create({
      patientId,
      PatientName:
        patientData?.mr +
        " " +
        patientData?.firstName +
        " " +
        patientData?.middleName +
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

module.exports = {
  createDoctorsAppointment,
  getAllDoctorsAppointments,
  deleteAppointment,
  updateDoctorsAppointment,
  findallPatientsEachDoctor,
  getPatientDoctorDatabyBookingID,
  createPathologistTestBooking,
};
