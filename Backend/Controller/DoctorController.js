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
};
