const NurseController = require("../Controller/NurseController");
// router
const { checkUser } = require("../middleware/checkUser.js");

const { getConnectionList } = require("../model/index.model3");
const axios = require("axios");
const nodemailer = require("nodemailer");
// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hims.pharmacy.tech@gmail.com",
    pass: "uliiksvpjxgfeizf",
  },
});

const db = require("../model/index.model.js");
const Nurse = db.nurse;
const User = db.user;
const router = require("express").Router();

router.post("/saveNurse", NurseController.SaveNurse);
router.get("/getNurseList", NurseController.getNurseList);

router.delete("/DeleteNurse/:id", NurseController.DeleteNurse);

router.put("/EditNurseData/:id", NurseController.EditNurseData);

const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer({ dest: "public/uploads/" });

const csv = require("csv-parser");
const fs = require("fs");

router.post("/UploadNurseData", upload.single("file"), async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Nurse = db.nurse;
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

        // Loop through the results and save each nurse to the database
        for (const result of results) {
          const {
            firstName,
            middleName,
            lastName,
            address,
            phoneNo,
            countryCode,
            email,
            userName,
            password,
          } = result;

          if (
            !firstName ||
            !lastName ||
            !address ||
            !countryCode ||
            !phoneNo ||
            !email ||
            !userName ||
            !password
          ) {
            console.log(`One or more fields are null. Skipping nurse data...`);
            continue; // Skip to the next iteration
          }

          // Check if a nurse with the given email already exists
          // Check if a nurse with the given email already exists
          const existingEmailNurse = await Nurse.findOne({ where: { email } });
          if (existingEmailNurse) {
            console.log(
              `Nurse with email ${email} already exists. Skipping...`
            );
            continue; // Skip to the next iteration
          }

          // Check if a user with the given email already exists
          const existingEmailUser = await User.findOne({ where: { email } });
          if (existingEmailUser) {
            console.log(`User with email ${email} already exists. Skipping...`);
            continue; // Skip to the next iteration
          }

          // Check if a user with the given username already exists
          const existingUsername = await User.findOne({
            where: { username: userName },
          });
          if (existingUsername) {
            console.log(
              `User with username ${userName} already exists. Skipping...`
            );
            continue; // Skip to the next iteration
          }

          // Check if a user with the given phone number already exists
          const existingPhoneUser = await User.findOne({
            where: { phoneNumber: phoneNo },
          });
          if (existingPhoneUser) {
            console.log(
              `User with phone number ${phoneNo} already exists. Skipping...`
            );
            continue; // Skip to the next iteration
          }

          // Check if a nurse with the given phone number already exists
          const existingPhoneNurse = await Nurse.findOne({
            where: { phoneNo },
          });
          if (existingPhoneNurse) {
            console.log(
              `Nurse with phone number ${phoneNo} already exists. Skipping...`
            );
            continue; // Skip to the next iteration
          }

          const HospitalName = await checkUser(req, res);

          // Call the signup API to create a new user
          const signupResponse = await axios.post(
            `${process.env.REMOTE_SERVER_BASE_URL}/api/${HospitalName}/auth/signup`,
            {
              name: `${firstName} ${middleName} ${lastName}`,
              username: userName,
              email,
              phoneNumber: phoneNo,
              password,
              roles: ["nurse"],
            }
          );

          //sending details with email

          const mailOptions = {
            from: "hims.pharmacy.tech@gmail.com",
            to: email,
            subject: "Registration Successful",
            html: `
    <h3>Registration Successful - HIMS </h3>
    <p>Your registration with HIMS is complete.</p>
    <p>Your account details:</p>
    <ul>
        <li><strong>Name:</strong> ${firstName} ${middleName} ${lastName}</li>
        <li><strong>Username:</strong> ${userName}</li>
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

          // Create a new nurse instance
          const nurse = await Nurse.create({
            FirstName: firstName,
            MiddleName: middleName,
            LastName: lastName,
            Address: address,
            phoneNo,
            countryCode,
            email,
            username: userName,
          });

          console.log(nurse);
        }

        // Send a success response
        res.status(200).json({ message: "Nurses saved successfully" });
      });
  } catch (error) {
    // Handle any errors
    console.error("Error saving nurses:", error);
    res
      .status(500)
      .json({ message: "An error occurred while saving the nurses" });
  }
});

module.exports = router;
