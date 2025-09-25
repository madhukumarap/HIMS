const db = require("../model/index.model.js");
const { QueryTypes } = require("sequelize");
const Doctor = db.doctor;
const Test = db.DiagnosticsBookingModel;
const { checkUser } = require("../middleware/checkUser.js");

const axios = require("axios");
const User = db.user;
const nodemailer = require("nodemailer");
const fs = require("fs");
const { getConnectionList } = require("../model/index.model3.js");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hims.pharmacy.tech@gmail.com",
    pass: "uliiksvpjxgfeizf",
  },
});

const GetDoctorsWithAllFees = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];

  try {
    const doctorsWithFees = await db.sequelize.query(
      `
      SELECT 
        d.id AS doctorId,
        d.FirstName,
        d.LastName,
        d.email,
        d.phoneNo,
        d.registrationNo,
        d.address,
        d.Dr,
        d.createdAt AS doctorCreatedAt,
        f.id AS feeId,
        f.consultationFee,
        f.referralFee,
        f.consultationCurrency,
        f.createdAt AS feeCreatedAt,
        f.updatedAt AS feeUpdatedAt
      FROM doctors d
      LEFT JOIN doctor_fees f
        ON f.doctor_id = d.id
      ORDER BY d.id, f.updatedAt DESC
      `,
      { type: QueryTypes.SELECT }
    );

    res.status(200).json(doctorsWithFees);
  } catch (error) {
    console.error("Error fetching doctors with all fees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const UpdateDoctorFees = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];

  try {
    const doctorId = req.params.id;
    const {
      consultationFee,
      referralFee,
      consultationCurrency = "INR",
    } = req.body;

    await db.sequelize.query(
      `
      INSERT INTO doctor_fees 
      (doctor_id, consultationFee, consultationCurrency, referralFee, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, NOW(), NOW())
      `,
      {
        replacements: [
          doctorId,
          consultationFee ?? 0,
          consultationCurrency || "INR",
          referralFee ?? 0,
        ],
        type: QueryTypes.INSERT,
      }
    );

    res.json({ message: "Doctor fees updated successfully" });
  } catch (error) {
    console.error("Error updating doctor fees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetAllDoctorFees = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];

  try {
    const doctorId = req.params.id;

    const doctorFees = await db.sequelize.query(
      `
      SELECT id, doctor_id, consultationFee, consultationCurrency, referralFee, createdAt, updatedAt
      FROM doctor_fees
      WHERE doctor_id = ?
      ORDER BY updatedAt DESC
      `,
      {
        replacements: [doctorId],
        type: QueryTypes.SELECT,
      }
    );

    if (doctorFees.length === 0) {
      return res
        .status(404)
        .json({ message: "No fee records found for this doctor" });
    }

    res.status(200).json(doctorFees);
  } catch (error) {
    console.error("Error fetching doctor fees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// This controller can update (if doc username exist) or create the doctor
const SaveDoctor = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Doctor = db.doctor;
  const User = db.user;

  try {
    const {
      firstName,
      middleName,
      lastName,
      registrationNo,
      phoneNo,
      countryCode,
      username,
      password,
      email,
      address,
      consultationFee,
      consultationCurrency,
      discount,
      doctorsType,
      referralFee,
    } = req.body;

    // Check if doctor already exists
    const existingDoc = await Doctor.findOne({ where: { username } });
    if (existingDoc) {
      if (consultationFee !== undefined)
        existingDoc.consultationFee = consultationFee;
      if (discount !== undefined) existingDoc.discount = discount;
      if (consultationCurrency !== undefined)
        existingDoc.consultationCurrency = consultationCurrency;
      await existingDoc.save();
      return res.status(200).json({ message: "Doctor updated successfully" });
    }

    // Handle signature image
    let imageBinaryData = null;
    if (req.file) {
      const imageBuffer = fs.readFileSync(req.file.path);
      imageBinaryData = Buffer.from(imageBuffer).toString("base64");
    }

    const HospitalName = req.HospitalName;

    const mainDbConnection = await getConnectionList("healthcare");
    const mainDb = mainDbConnection["healthcare"];

    const hospitalRecord = await mainDb.HospitalMain.findOne({
      where: { databaseName: HospitalName },
    });

    const hospitalId = hospitalRecord?.id;

    // Call signup API to create user
    try {
      await axios.post(
        `${process.env.REMOTE_SERVER_BASE_URL}/api/${HospitalName}/auth/signup`,
        {
          name: `${firstName} ${middleName} ${lastName}`,
          username,
          email,
          phoneNumber: phoneNo,
          password,
          status: "active",
          roles: ["doctor"],
          hospitalId: hospitalId,
        }
      );
    } catch (axiosError) {
      if (
        axiosError.response &&
        axiosError.response.status === 400 &&
        axiosError.response.data.message === "Duplicate record found"
      ) {
        return res.status(400).json({
          message: `Doctor user already exists in system (username/email/phone duplicate)`,
        });
      } else {
        console.error("Error calling signup API:", axiosError.message);
        return res.status(500).json({
          message: "Error creating doctor user",
          error: axiosError.message,
        });
      }
    }

    // Send registration email
    const mailOptions = {
      from: "hims.pharmacy.tech@gmail.com",
      to: email,
      subject: "Registration Successful",
      html: `
        <h3>Registration Successful - HIMS</h3>
        <p>Your registration with HIMS is complete.</p>
        <p>Your account details:</p>
        <ul>
          <li><strong>Name:</strong> Dr. ${firstName} ${middleName} ${lastName}</li>
          <li><strong>RegistrationNo:</strong> ${registrationNo}</li>
          <li><strong>Username:</strong> ${username}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone Number:</strong> ${phoneNo}</li>
        </ul>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log("Error sending email:", error);
      else console.log("Email sent:", info.response);
    });

    // Create doctor in database
    const doctor = await Doctor.create({
      Dr: "DR",
      FirstName: firstName,
      MiddleName: middleName || null,
      LastName: lastName,
      registrationNo,
      phoneNo,
      countryCode,
      email,
      address,
      username,
      signatureImage: imageBinaryData || null,
      consultationFee: consultationFee || 0,
      consultationCurrency,
      doctorsType,
      referralFee: referralFee || 0,
    });

    // Call UpdateDoctorFees after creating the doctor
    await UpdateDoctorFeesHelper(
      db,
      doctor.id,
      consultationFee,
      referralFee,
      consultationCurrency
    );

    res.status(200).json({ message: "Doctor saved successfully", doctor });
  } catch (error) {
    console.error("Error saving doctor:", error);
    return res.status(500).json({
      message: "An error occurred while saving the doctor",
      error: error.message,
    });
  }
};

// Helper to call UpdateDoctorFees logic
const UpdateDoctorFeesHelper = async (
  db,
  doctorId,
  consultationFee = 0,
  referralFee = 0,
  consultationCurrency = "INR"
) => {
  await db.sequelize.query(
    `
    INSERT INTO doctor_fees 
    (doctor_id, consultationFee, consultationCurrency, referralFee, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, NOW(), NOW())
    `,
    {
      replacements: [
        doctorId,
        consultationFee,
        consultationCurrency,
        referralFee,
      ],
      type: QueryTypes.INSERT,
    }
  );
};

const getDoctorData = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Doctor = db.doctor;
  const User = db.user;
  const Test = db.DiagnosticsBookingModel;
  console.log("getDcotorDat");
  try {
    const doctors = await Doctor.findAll({ order: [["createdAt", "DESC"]] });
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Isnternal server error", issue: error });
  }
};

const deleteDoctor = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Doctor = db.doctor;
  const User = db.user;
  const Test = db.DiagnosticsBookingModel;
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await doctor.destroy();

    const user = await User.findOne({ where: { username: doctor.username } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.sendStatus(200); // No Content
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Internal Server Error
  }
};

const updateDoctor = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Doctor = db.doctor;
  const User = db.user;
  const Test = db.DiagnosticsBookingModel;
  console.log(req.body);
  const { id } = req.params;
  const {
    FirstName,
    MiddleName,
    LastName,
    registrationNo,
    phoneNo,
    email,
    countryCode,
    fee,
    consultationFee,
    consultationCurrency,
  } = req.body;

  try {
    const doctor = await Doctor.findByPk(id);
    const user = await User.findOne({ where: { username: doctor.username } });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the doctor's data
    doctor.FirstName = FirstName;
    doctor.MiddleName = MiddleName;
    doctor.LastName = LastName;
    doctor.registrationNo = registrationNo;
    doctor.phoneNo = phoneNo;
    doctor.email = email;
    doctor.countryCode = countryCode;
    doctor.consultationFee = consultationFee;
    doctor.consultationCurrency = consultationCurrency;

    await doctor.save();

    // Update the user data
    user.name = FirstName + " " + MiddleName + " " + LastName;
    user.phoneNumber = phoneNo;
    user.email = email;
    console.log("hello1");
    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "Doctor updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

const getDoctorById = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Doctor = db.doctor;
  const User = db.user;
  const Test = db.DiagnosticsBookingModel;
  try {
    const testBookingID = req.params.testBookingID;
    console.log("testBookingID: " + testBookingID);
    const pathologyTest = await Test.findByPk(testBookingID);
    const doctorId = pathologyTest.doctorId;
    const doctor = await Doctor.findByPk(doctorId);
    console.log("Doctor: " + doctor.id);

    // return;

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    console.log(doctor.signatureImage);
    return res.status(200).json({ doctor });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while fetching doctor data" });
  }
};

const updateDoctorSign = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Doctor = db.doctor;
  const User = db.user;
  const Test = db.DiagnosticsBookingModel;
  try {
    const doctorId = req.params.id;
    console.log(doctorId);
    // console.log(req.body.signatureImage);
    // if (!req.file || !req.file.signatureImage) {
    //   console.log("No signature image uploaded");
    //   return res.status(400).json({ message: "No signature image uploaded" });
    // }
    const signatureImage = req.file.path;
    console.log(signatureImage);
    let imageBuffer = signatureImage;

    // if (signatureImage) {
    //   try {
    //     imageBuffer = await fs.promises.readFile(signatureImage.path);
    //   } catch (error) {
    //     console.log("Error reading the image file:", error);
    //   }
    // } else {
    //   console.log("Image file does not exist.");
    // }
    //return;
    //const imageBuffer = signatureImage.data;
    //const imageBinaryData = Buffer.from(imageBuffer).toString("base64");

    const doctor = await Doctor.findByPk(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.signatureImage = imageBuffer;
    await doctor.save();

    res.status(200).json({ message: "Signature updated successfully" });
  } catch (error) {
    console.error("Error updating signature:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating signature" });
  }
};

const chrono = require("chrono-node");
const moment = require("moment");
const { Op } = require("sequelize");

async function findNextAvailableDateByEmail(db, doctorEmail) {
  let checkDate = moment().add(1, "days");

  while (true) {
    // 1️⃣ Check vacations (date-only)
    const vacation = await db.doctorVacation.findOne({
      where: {
        doctorEmail,
        startDate: { [Op.lte]: checkDate.clone().endOf("day").toDate() },
        endDate: { [Op.gte]: checkDate.clone().startOf("day").toDate() },
      },
    });

    if (vacation) {
      // Skip to the next day after vacation ends
      checkDate = moment(vacation.endDate).add(1, "days");
      continue;
    }

    // 2️⃣ Check appointments
    const existing = await db.DoctorsAppointment.findOne({
      where: {
        DoctorEmail: doctorEmail,
        bookingStartDate: checkDate.format("MM/DD/YYYY, hh:mm A"),
      },
    });

    if (!existing) {
      return checkDate.toDate();
    }

    // 3️⃣ Try next day
    checkDate.add(1, "days");
  }
}

const rescheduleAppointmentsByText = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DoctorsAppointment = db.DoctorsAppointment;

  try {
    const { command, doctorEmail, patients } = req.body;

    let targetDate;
    let sourceDate = null;

    if (command.toLowerCase().includes("next available day")) {
      targetDate = await findNextAvailableDateByEmail(db, doctorEmail);
    } else {
      // Use chrono.parse() to get all dates from the command - CALL ONLY ONCE
      const parsedDates = chrono.parse(command);

      if (parsedDates.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No date found in your command.",
        });
      }

      // Improved logic for determining source and target dates
      const lowerCommand = command.toLowerCase();

      if (parsedDates.length === 1) {
        // Only one date found - use it as target
        targetDate = parsedDates[0].start.date();
      } else {
        // For commands like "Reschedule all the 10th October appointments to 11th October"
        if (lowerCommand.includes("to") && parsedDates.length >= 2) {
          // Find the position of "to" in the command
          const toIndex = lowerCommand.indexOf("to");

          // Find which dates come before and after "to"
          const datesBeforeTo = parsedDates.filter(
            (date) => date.index < toIndex
          );
          const datesAfterTo = parsedDates.filter(
            (date) => date.index >= toIndex
          );

          if (datesBeforeTo.length > 0 && datesAfterTo.length > 0) {
            // Last date before "to" is source, first date after "to" is target
            sourceDate = datesBeforeTo[datesBeforeTo.length - 1].start.date();
            targetDate = datesAfterTo[0].start.date();
          } else {
            // Fallback: use first as source, last as target
            sourceDate = parsedDates[0].start.date();
            targetDate = parsedDates[parsedDates.length - 1].start.date();
          }
        } else if (
          lowerCommand.includes("from") &&
          lowerCommand.includes("to")
        ) {
          // Format: "from X to Y"
          const fromIndex = lowerCommand.indexOf("from");
          const toIndex = lowerCommand.indexOf("to");

          if (fromIndex < toIndex) {
            sourceDate = parsedDates[0].start.date();
            targetDate = parsedDates[1].start.date();
          }
        } else {
          // Default: use last date as target
          targetDate = parsedDates[parsedDates.length - 1].start.date();
          sourceDate = parsedDates[0].start.date();
        }
      }
    }

    console.log("Source Date:", sourceDate);
    console.log("Target Date:", targetDate, "targetDate////");

    if (!targetDate) {
      return res.status(400).json({
        success: false,
        message: "Could not determine target date.",
      });
    }

    // 🚨 CHECK VACATION for the target date
    const vacation = await db.doctorVacation.findOne({
      where: {
        doctorEmail,
        startDate: { [Op.lte]: moment(targetDate).endOf("day").toDate() },
        endDate: { [Op.gte]: moment(targetDate).startOf("day").toDate() },
      },
    });

    if (vacation) {
      return res.status(400).json({
        success: false,
        message: `Doctor is on vacation from ${moment(
          vacation.startDate
        ).format("MM/DD/YYYY")} to ${moment(vacation.endDate).format(
          "MM/DD/YYYY"
        )}. Please choose another date.`,
      });
    }

    // 🚨 Build where clause for appointments
    let whereClause = {
      DoctorEmail: doctorEmail,
    };

    // 🚨 CRITICAL CHANGE: If source date is specified, reschedule ALL appointments from that date
    // IGNORE the patients filter when source date is specified
    if (sourceDate) {
      whereClause.bookingStartDate = {
        [Op.like]: `%${moment(sourceDate).format("MM/DD/YYYY")}%`,
      };
      console.log(
        `Rescheduling ALL appointments from: ${moment(sourceDate).format(
          "MM/DD/YYYY"
        )} to target: ${moment(targetDate).format("MM/DD/YYYY")}`
      );
    } else {
      // Only use patient filtering when NO source date is specified
      // Extract unique identifiers from the patients array
      const patientIds = patients.map(
        (patient) => patient.patientId || patient.id
      );
      const admissionIds = patients
        .map((patient) => patient.admissionID)
        .filter((id) => id);
      const patientPhones = patients
        .map((patient) => patient.PatientPhone)
        .filter((phone) => phone);
      const patientNames = patients
        .map((patient) => patient.PatientName)
        .filter((name) => name);

      whereClause[Op.or] = [
        { patientId: { [Op.in]: patientIds } },
        { admissionID: { [Op.in]: admissionIds } },
        { PatientPhone: { [Op.in]: patientPhones } },
        { PatientName: { [Op.in]: patientNames } },
      ].filter((condition) => {
        const values = Object.values(condition)[0][Op.in];
        return values && values.length > 0;
      });

      console.log(`Filtering by specific patients only`);
    }

    // 🚨 Fetch appointments based on the where clause
    const appointments = await DoctorsAppointment.findAll({
      where: whereClause,
    });

    if (!appointments.length) {
      const message = sourceDate
        ? `No appointments found for ${moment(sourceDate).format(
            "MM/DD/YYYY"
          )} to reschedule.`
        : "No appointments found to reschedule for the selected patients.";

      return res.status(200).json({
        success: true,
        message: message,
      });
    }

    console.log(
      `Found ${appointments.length} appointments to reschedule from ${
        sourceDate
          ? moment(sourceDate).format("MM/DD/YYYY")
          : "selected patients"
      } to ${moment(targetDate).format("MM/DD/YYYY")}`
    );

    // Get IDs of appointments we're rescheduling
    const reschedulingAppointmentIds = appointments.map((appt) => appt.id);

    // Check for time conflicts on the target date (EXCLUDE appointments we're rescheduling)
    const existingAppointmentsOnTargetDate = await DoctorsAppointment.findAll({
      where: {
        DoctorEmail: doctorEmail,
        bookingStartDate: {
          [Op.like]: `%${moment(targetDate).format("MM/DD/YYYY")}%`,
        },
        id: { [Op.notIn]: reschedulingAppointmentIds }, // Exclude the appointments we're moving
      },
    });

    console.log("Rescheduling appointments:", reschedulingAppointmentIds);
    console.log(
      "Existing appointments on target date:",
      existingAppointmentsOnTargetDate.map((a) => ({
        id: a.id,
        name: a.PatientName,
        time: a.bookingStartDate,
      }))
    );

    // Create a set of occupied time slots from appointments NOT being rescheduled
    const occupiedSlots = new Set();
    existingAppointmentsOnTargetDate.forEach((appt) => {
      try {
        const time = moment(
          appt.bookingStartDate,
          "MM/DD/YYYY, hh:mm A"
        ).format("HH:mm");
        occupiedSlots.add(time);
        console.log(`Occupied slot: ${time} for ${appt.PatientName}`);
      } catch (error) {
        console.error("Error parsing appointment time:", error);
      }
    });

    // Reschedule each appointment with 30-minute intervals
    const rescheduledAppointments = [];
    const timeSlots = []; // Track all time slots we're using in this reschedule operation

    // Sort appointments by original time to maintain order
    appointments.sort((a, b) => {
      const timeA = moment(a.bookingStartDate, "MM/DD/YYYY, hh:mm A");
      const timeB = moment(b.bookingStartDate, "MM/DD/YYYY, hh:mm A");
      return timeA.diff(timeB);
    });

    for (const appt of appointments) {
      const apptMoment = moment(appt.bookingStartDate, "MM/DD/YYYY, hh:mm A");
      const originalTime = apptMoment.format("HH:mm");

      // Try to keep the original time first
      let newStart = moment(targetDate)
        .hour(apptMoment.hour())
        .minute(apptMoment.minute());

      let newTime = newStart.format("HH:mm");
      let attempts = 0;
      const maxAttempts = 48; // Try all 30-minute slots in a day (24 hours * 2)

      // Find an available time slot
      while (attempts < maxAttempts) {
        // Check if this time slot is available (not occupied and not used in current batch)
        if (!occupiedSlots.has(newTime) && !timeSlots.includes(newTime)) {
          break;
        }

        // Try next 30-minute slot
        newStart.add(30, "minutes");
        newTime = newStart.format("HH:mm");
        attempts++;
      }

      if (attempts >= maxAttempts) {
        return res.status(400).json({
          success: false,
          message: `No available time slots found on ${moment(
            targetDate
          ).format("MM/DD/YYYY")} for ${
            appt.PatientName
          }. The day is fully booked.`,
        });
      }

      // Reserve this time slot
      timeSlots.push(newTime);
      occupiedSlots.add(newTime); // Also add to occupied slots to prevent conflicts in this batch

      const duration = moment(appt.bookingEndDate, "MM/DD/YYYY, hh:mm A").diff(
        apptMoment,
        "minutes"
      );
      const newEnd = moment(newStart).add(duration, "minutes");

      // Store old date for logging
      const oldDate = appt.bookingStartDate;

      appt.bookingStartDate = newStart.format("MM/DD/YYYY, hh:mm A");
      appt.bookingEndDate = newEnd.format("MM/DD/YYYY, hh:mm A");

      await appt.save();

      rescheduledAppointments.push({
        patientName: appt.PatientName,
        oldDate: oldDate,
        newDate: appt.bookingStartDate,
        oldTime: moment(oldDate, "MM/DD/YYYY, hh:mm A").format("hh:mm A"),
        newTime: newStart.format("hh:mm A"),
      });

      console.log(
        `Rescheduled ${appt.PatientName} from ${originalTime} to ${newTime}`
      );
    }

    res.status(200).json({
      success: true,
      message: `Rescheduled ${appointments.length} appointments from ${
        sourceDate
          ? moment(sourceDate).format("MM/DD/YYYY")
          : "selected patients"
      } to ${moment(targetDate).format("MM/DD/YYYY")}.`,
      rescheduledAppointments: rescheduledAppointments,
      details: rescheduledAppointments.map(
        (appt) => `${appt.patientName}: ${appt.oldTime} → ${appt.newTime}`
      ),
    });
  } catch (error) {
    console.error("Error rescheduling appointments:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reschedule appointments.",
    });
  }
};

module.exports = {
  SaveDoctor,
  getDoctorData,
  deleteDoctor,
  updateDoctor,
  getDoctorById,
  updateDoctorSign,
  UpdateDoctorFees,
  GetAllDoctorFees,
  GetDoctorsWithAllFees,
  rescheduleAppointmentsByText,
  findNextAvailableDateByEmail,
};
