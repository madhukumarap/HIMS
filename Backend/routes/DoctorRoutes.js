const DoctorController = require("../Controller/DoctorController.js");
const axios = require("axios");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const { checkUser } = require("../middleware/checkUser.js");

const { getConnectionList } = require("../model/index.model3");
const uploadimage = multer({ dest: "public/images" });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    // console.log;
    cb(null, file.originalname);
  },
});

const upload2 = multer({ storage: storage });
// router
const router = require("express").Router();

router.post(
  "/saveDoctor",
  uploadimage.single("signatureImage"),
  DoctorController.SaveDoctor
);

// router.get("/getDoctorData", DoctorController.getDoctorData);

router.delete("/deleteDoctor/:id", DoctorController.deleteDoctor);

router.put("/updateDoctor/:id", DoctorController.updateDoctor);
router.put(
  "/uploadSignature/:id",
  upload2.single("signatureImage"),
  DoctorController.updateDoctorSign
);

router.get("/getDoctorByID/:testBookingID", DoctorController.getDoctorById);
const db = require("../model/index.model.js");
const Doctor = db.doctor;
const User = db.user;

router.get("/getDoctors", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Doctor = db.doctor;
  const User = db.user;
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/getDoctorData", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Doctor = db.doctor;
  const User = db.user;
  try {
    const doctors = await Doctor.findAll({
      attributes: [
        "id",
        "Dr",
        "username",
        "FirstName",
        "MiddleName",
        "LastName",
        "registrationNo",
        "email",
        "address",
        "phoneNo",
        "countryCode",
        "createdAt",
        "signatureImage",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    // Convert signatureImage to base64
    const doctorsWithBase64Signature = doctors.map((doctor) => {
      if (doctor?.signatureImage) {
        try {
          const imageBuffer = fs.readFileSync(doctor?.signatureImage);
          const imageBase64 = imageBuffer.toString("base64");
          doctor.signatureImage = imageBase64;
        } catch (error) {
          console.error("Error reading image file:", error);
        }
      }
      return doctor;
    });

    res.json(doctorsWithBase64Signature);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getDoctorByIdsign/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Doctor = db.doctor;
  const User = db.user;
  try {
    const doctorId = req.params.id; // Get the doctor ID from the URL parameter

    // Find the doctor by ID
    const doctor = await Doctor.findOne({
      where: { id: doctorId },
      attributes: [
        "id",
        "Dr",
        "username",
        "FirstName",
        "MiddleName",
        "LastName",
        "registrationNo",
        "email",
        "address",
        "phoneNo",
        "countryCode",
        "createdAt",
        "signatureImage",
        "updatedAt",
      ],
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    if (doctor?.signatureImage) {
      const imageBuffer = fs.readFileSync(doctor?.signatureImage);
      const imageBase64 = imageBuffer.toString("base64");
      doctor.signatureImage = imageBase64;
    }
    console.log(doctor);
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const express = require("express");

const app = express();

const upload = multer({ dest: "public/uploads/" });

const csv = require("csv-parser");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hims.pharmacy.tech@gmail.com",
    pass: "uliiksvpjxgfeizf",
  },
});
router.post("/uploadDoctors", upload.single("file"), async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Doctor = db.doctor;
  const User = db.user;
  try {
    // Access the uploaded file using req.file
    const file = req.file;
    console.log(file);

    // Process the file and save the data to the database
    const results = [];

    fs.createReadStream(file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        console.log(results);

        // Loop through the results and save each doctor to the database
        for (const result of results) {
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
          } = result;

          console.log(result);

          if (
            !firstName ||
            !lastName ||
            !registrationNo ||
            !phoneNo ||
            !countryCode ||
            !username ||
            !email
          ) {
            console.log(
              ` this firstName || lastName || registrationNo || phoneNo || username || email Input data not be null`
            );
            continue; // Skip to the next iteration
          }
          // Check if a doctor with the given registration number already exists
          const existingDoctor = await Doctor.findOne({
            where: { registrationNo },
          });
          if (existingDoctor) {
            console.log(
              `Doctor with registration number ${registrationNo} already exists. Skipping...`
            );
            continue; // Skip to the next iteration
          }

          // Check if a user with the given username already exists
          const existingUsername = await User.findOne({ where: { username } });
          if (existingUsername) {
            console.log(
              `User with username ${username} already exists. Skipping...`
            );
            continue; // Skip to the next iteration
          }

          // Check if a user with the given email already exists
          const existingEmail = await User.findOne({ where: { email } });
          if (existingEmail) {
            console.log(`User with email ${email} already exists. Skipping...`);
            continue; // Skip to the next iteration
          }

          // Check if a doctor with the given phone number already exists
          const existingPhone = await Doctor.findOne({ where: { phoneNo } });
          if (existingPhone) {
            console.log(
              `Doctor with phone number ${phoneNo} already exists. Skipping...`
            );
            continue; // Skip to the next iteration
          }
          const HospitalName = await checkUser(req, res);

          // Call the signup API to create a new user
          const signupResponse = await axios.post(
            `${process.env.REMOTE_SERVER_BASE_URL}/api/${HospitalName}/auth/signup`,
            {
              name: firstName + " " + middleName + " " + lastName,
              username: username,
              email: email,
              phoneNumber: phoneNo,
              password: password,
              roles: ["doctor"],
            }
          );

          const mailOptions = {
            from: "hims.pharmacy.tech@gmail.com",
            to: email,
            subject: "Registration Successful",
            html: `
    <h3>Registration Successful - HIMS </h3>
    <p>Your registration with HIMS is complete.</p>
    <p>Your account details:</p>
    <ul>
        <li><strong>Name:</strong>Dr. ${firstName} ${middleName} ${lastName}</li>
       <li><strong>RegistrationNo:</strong> ${registrationNo}</li>
        <li><strong>Username:</strong> ${username}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone Number:</strong>  ${phoneNo}</li>
    </ul>
    <p>Please use the provided username to reset your password using forgot password option.</p>
    <p>Thank you!</p>
`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error sending  email:", error);
              // res.status(500).json({ message: 'Error sending  email' });
            } else {
              console.log(" email sent:", info.response);
            }
          });

          // Create a new doctor instance
          const doctor = await Doctor.create({
            Dr: "DR",
            FirstName: firstName,
            MiddleName: middleName,
            LastName: lastName,
            registrationNo,
            phoneNo,
            countryCode,
            email: email,
            address: address,
            username: username,
          });

          console.log(doctor);
        }

        // Send a success response
        res.status(200).json({ message: "Doctors saved successfully" });
      });
  } catch (error) {
    // Handle any errors
    console.error("Error saving doctors:", error);
    res
      .status(500)
      .json({ message: "An error occurred while saving the doctors" });
  }
});

module.exports = router;
