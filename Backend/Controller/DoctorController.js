const db = require("../model/index.model.js");
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

// This controller can update (if doc username exist) or create the doctor
const SaveDoctor = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Doctor = db.doctor;
  const User = db.user;
  const Test = db.DiagnosticsBookingModel;

  try {
    // Extract the data from the request body
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
      discount
    } = req.body;

    console.log("hii////////////////");

    // check if user already exist in doctor table;

    const existingDoc = await Doctor.findOne({
      where: { username },
    });

    if (existingDoc) {
      // Update the doctor
      try {
        if (consultationFee !== undefined)
          existingDoc.consultationFee = consultationFee;
        if (discount !== undefined) existingDoc.discount = discount;
        if (consultationCurrency !== undefined)
          existingDoc.consultationCurrency = consultationCurrency;

        await existingDoc.save();

        res.status(200).json({ message: "Doctor updated successfully" });
        return;
      } catch (e) {
        console.log("errr ", e)
        res.status(400).json({ message: "Failed to update doctor!" });
        return;
      }

      return;
    }

    const signatureImage = req.file;
    let imageBuffer;
    let imageBinaryData;
    if (signatureImage) {
      imageBuffer = fs.readFileSync(req.file.path);
      imageBinaryData = Buffer.from(imageBuffer).toString("base64");
    }
    // console.log("signatureImage: " + JSON.stringify(signatureImage));
    //return;
    // Call the signup API to create a new user
    const HospitalName = await checkUser(req, res);
    console.log("ClientName2: " + HospitalName);

    const signupResponse = await axios.post(
      `${process.env.REMOTE_SERVER_BASE_URL}/api/${HospitalName}/auth/signup`,
      {
        name: firstName + " " + middleName + " " + lastName,
        username: username,
        email: email,
        phoneNumber: phoneNo,
        password: password,
        status: "active",
        roles: ["doctor"],
      }
    );
    console.log("///////2/////////////");
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
      signatureImage: imageBinaryData,
      consultationFee,
      consultationCurrency,
    });

    console.log(doctor);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending  email:", error);
        // res.status(500).json({ message: 'Error sending  email' });
      } else {
        console.log("hello");

        console.log(" email sent:", info.response);
      }
    });
    // Send a success response
    res.status(200).json({ message: "Doctor saved successfully" });
  } catch (signupError) {
    // Handle any errors

    if (
      signupError.response &&
      signupError.response.data &&
      signupError.response.data.message
    ) {
      return res.status(400).json({
        message: `Failed to create Doctor. ${signupError.response.data.message}`,
      });
    } else {
      res
        .status(500)
        .json({ message: "An error occurred while saving the doctor" });
    }
  }
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
};
