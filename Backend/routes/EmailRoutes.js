const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const db = require("../model/index.model");
const User = db.user;
const { getConnectionList } = require("../model/index.model3");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hims.pharmacy.tech@gmail.com",
    pass: "uliiksvpjxgfeizf",
  },
});

// Generate and store OTP
const generateOTP = () => {
  const otpLength = 6;
  let otp = "";

  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10); // Generates a random number between 0 and 9
  }

  return otp;
};

const otpStore = {};

router.post("/:ClientID/sendOTP/email", async (req, res) => {
  console.log(req.body);
  let mainDatabase = "healthcare";
  let RequestDatabase;
  let hospitals;

  console.log("req.params.ClientID: ", req.params.ClientID);
  // return;
  if (req.params.ClientID === "healthcare") {
    RequestDatabase = mainDatabase;
  } else {
    const hospitalName = req.params.ClientID || req.body.username;
    hospitals = await db.HospitalMain.findOne({
      where: { name: hospitalName },
    });
    RequestDatabase = hospitals?.databaseName || mainDatabase;
  }

  // return;

  const connectionList = await getConnectionList(RequestDatabase);
  console.log("connection: " + connectionList[RequestDatabase]);
  const con = connectionList[RequestDatabase];

  const User = con.user;

  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    const mailOptions = {
      from: "hims.pharmacy.tech@gmail.com",
      to: email,
      subject: "Your One-Time Password (OTP) Verification Code",
      html: `
                <h3>Reset Your Password - HIMS Pharmacy</h3>
                <p>We have received a request to reset your password for your HIMS Pharmacy account.</p>
                <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
                <p>Please enter this code on the password reset page to proceed with resetting your password.</p>
                <p>If you did not initiate this request, please ignore this email.</p>
                <p>Thank you!</p>
            `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending OTP email:", error);
        res.status(500).json({ message: "Error sending OTP email" });
      } else {
        console.log("OTP email sent:", info.response);
        otpStore[email] = otp;
        res.status(200).json({ message: "OTP sent successfully" });
      }
    });
  } catch (error) {
    console.log("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// Endpoint for verifying OTP sent via email
router.post("/:ClientID/verifyOTP/email", async (req, res) => {
  console.log(req.body);
  let mainDatabase = "healthcare";
  let RequestDatabase;
  let hospitals;

  console.log("req.params.ClientID: ", req.params.ClientID);
  // return;
  if (req.params.ClientID === "healthcare") {
    RequestDatabase = mainDatabase;
  } else {
    const hospitalName = req.params.ClientID || req.body.username;
    hospitals = await db.HospitalMain.findOne({
      where: { name: hospitalName },
    });
    RequestDatabase = hospitals?.databaseName || mainDatabase;
  }

  // return;

  const connectionList = await getConnectionList(RequestDatabase);
  console.log("connection: " + connectionList[RequestDatabase]);
  const con = connectionList[RequestDatabase];

  const User = con.user;
  const { email, otp } = req.body;
  const storedOTP = otpStore[email];

  if (storedOTP && storedOTP === otp) {
    delete otpStore[email];
    console.log("OTP verification successful");
    res.status(200).json({ message: "OTP verification successful" });
  } else {
    res.status(401).json({ message: "Invalid OTP" });
  }
});

router.post("/:ClientID/sendOTP/username", async (req, res) => {
  console.log(req.body);
  let mainDatabase = "healthcare";
  let RequestDatabase;
  let hospitals;

  console.log("req.params.ClientID: ", req.params.ClientID);
  // return;
  if (req.params.ClientID === "healthcare") {
    RequestDatabase = mainDatabase;
  } else {
    const hospitalName = req.params.ClientID || req.body.username;
    hospitals = await db.HospitalMain.findOne({
      where: { name: hospitalName },
    });
    RequestDatabase = hospitals?.databaseName || mainDatabase;
  }

  // return;

  const connectionList = await getConnectionList(RequestDatabase);
  console.log("connection: " + connectionList[RequestDatabase]);
  const con = connectionList[RequestDatabase];

  const User = con.user;
  console.log("hello");
  try {
    const { username } = req.body;
    console.log(username);
    const user = await User.findOne({ where: { username } });

    if (!user) {
      console.log("Not Found");
      return res.status(404).json({ message: "User not found" });
    }

    const email = user.email; // Assuming the email is stored in the user object

    const otp = generateOTP();

    const mailOptions = {
      from: "hims.pharmacy.tech@gmail.com",
      to: email,
      subject: "Your One-Time Password (OTP) Verification Code",
      html: `
                <h3>Reset Your Password - HIMS Pharmacy</h3>
                <p>We have received a request to reset your password for your HIMS Pharmacy account.</p>
                <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
                <p>Please enter this code on the password reset page to proceed with resetting your password.</p>
                <p>If you did not initiate this request, please ignore this email.</p>
                <p>Thank you!</p>
            `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending OTP email:", error);
        res.status(500).json({ message: "Error sending OTP email" });
      } else {
        console.log("OTP email sent:", info.response);
        otpStore[email] = otp;
        res.status(200).json(email);
      }
    });
  } catch (error) {
    console.log("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

router.post("/:ClientID/verifyOTP/username", async (req, res) => {
  console.log(req.body);
  let mainDatabase = "healthcare";
  let RequestDatabase;
  let hospitals;

  console.log("req.params.ClientID: ", req.params.ClientID);
  // return;
  if (req.params.ClientID === "healthcare") {
    RequestDatabase = mainDatabase;
  } else {
    const hospitalName = req.params.ClientID || req.body.username;
    hospitals = await db.HospitalMain.findOne({
      where: { name: hospitalName },
    });
    RequestDatabase = hospitals?.databaseName || mainDatabase;
  }

  // return;

  const connectionList = await getConnectionList(RequestDatabase);
  console.log("connection: " + connectionList[RequestDatabase]);
  const con = connectionList[RequestDatabase];
  const User = con.user;

  const { username, otp } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const email = user.email; // Assuming the email is stored in the user object
  const storedOTP = otpStore[email];

  if (storedOTP && storedOTP === otp) {
    delete otpStore[email];
    console.log("OTP verification successful");
    res.status(200).json({ message: "OTP verification successful" });
  } else {
    res.status(404).json({ message: "Invalid OTP" });
  }
});

router.post("/:ClientID/updatePassword", async (req, res) => {
  try {
    console.log(req.body);
    let mainDatabase = "healthcare";
    let RequestDatabase;
    let hospitals;

    console.log("req.params.ClientID: ", req.params.ClientID);
    // return;
    if (req.params.ClientID === "healthcare") {
      RequestDatabase = mainDatabase;
    } else {
      const hospitalName = req.params.ClientID || req.body.username;
      hospitals = await db.HospitalMain.findOne({
        where: { name: hospitalName },
      });
      RequestDatabase = hospitals?.databaseName || mainDatabase;
    }

    // return;

    const connectionList = await getConnectionList(RequestDatabase);
    console.log("connection: " + connectionList[RequestDatabase]);
    const con = connectionList[RequestDatabase];

    const User = con.user;
    const { email, username, password } = req.body;
    console.log();
    let user;
    if (email) user = await User.findOne({ where: { email: email } });
    else user = await User.findOne({ where: { username: username } });

    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password before saving it
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Update the user's password
    await user.update({ password: hashedPassword });

    console.log("Password updated successfully");
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Error updating password:", error);
    res.status(500).json({ message: "Error updating password" });
  }
});

module.exports = router;
