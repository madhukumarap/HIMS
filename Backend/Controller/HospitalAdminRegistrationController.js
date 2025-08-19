const db = require("../model/index.model.js");
const Nurse = db.nurse;
const HospitalAdminRegistrationModel = db.HospitalAdminRegistration;
const axios = require("axios");
const nodemailer = require("nodemailer");
const { getConnectionList } = require("../model/index.model3");
const { checkUser } = require("../middleware/checkUser.js");

const User = db.user;

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hims.pharmacy.tech@gmail.com",
    pass: "uliiksvpjxgfeizf",
  },
});

const SaveHospitalAdmin = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Nurse = db.nurse;
  const HospitalAdminRegistrationModel = db.HospitalAdminRegistration;
  const User = db.user;

  console.log(req.body);

  try {
    const token = req.headers.authorization;

    // Extract the data from the request body
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
      hospitalId,
    } = req.body;

    const HospitalName = await checkUser(req, res);

    // Call the signup API to create a new user
    const signupResponse = await axios.post(
      `${process.env.REMOTE_SERVER_BASE_URL}/api/${HospitalName}/auth/signup`,
      {
        name: firstName + " " + middleName + " " + lastName,
        username: userName,
        email: email,
        phoneNumber: phoneNo,
        countryCode: countryCode,
        password: password,
        hospitalId: hospitalId,
        roles: ["admin"],
      }
    );

    // console.log(hospitalId);
    // return;
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

    console.log(signupResponse.data);
    // Extract the userId from the signup response
    const userId = signupResponse.data.userId;

    // Create a new pharmacist instance
    const SavedHospitalAdmin = await HospitalAdminRegistrationModel.create({
      firstName,
      middleName,
      lastName,
      address,
      phoneNo,
      countryCode,
      email,
      hospitalId,
      username: userName,
    });

    // Send a success response
    res.status(200).send("Hospital Admin saved successfully");
  } catch (signupError) {
    // Handle signup API error
    console.error(signupError);
    if (
      signupError.response &&
      signupError.response.data &&
      signupError.response.data.message
    ) {
      return res.status(400).json({
        message: `Failed to create Hospital Admin. ${signupError.response.data.message}`,
      });
    } else {
      return res
        .status(500)
        .json({ message: "An error occurred while saving the Nurse" });
    }
  }
};

const getHospitalAdminList = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Nurse = db.nurse;
  const HospitalAdminRegistrationModel = db.HospitalAdminRegistration;
  const User = db.user;
  try {
    const hospitalAdminData = await HospitalAdminRegistrationModel.findAll();
    res.status(200).json(hospitalAdminData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving nurse list", error: error.message });
  }
};

const DeleteHospitalAdmin = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Nurse = db.nurse;
  const HospitalAdminRegistrationModel = db.HospitalAdminRegistration;
  const User = db.user;
  const { id } = req.params;

  try {
    const hospitalAdminData = await HospitalAdminRegistrationModel.findByPk(id);

    if (!hospitalAdminData) {
      return res.status(404).json({ message: "Nurse not found" });
    }

    const adminUsername = hospitalAdminData.username;

    await hospitalAdminData.destroy();

    const user = await User.findOne({ where: { username: adminUsername } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res
      .status(200)
      .json({ message: "Nurse and associated user deleted successfully" });
  } catch (error) {
    console.error("Error deleting nurse:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const EditHospitalAdminData = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Nurse = db.nurse;
  const HospitalAdminRegistrationModel = db.HospitalAdminRegistration;
  const User = db.user;
  const { id } = req.params;
  const {
    firstName,
    middleName,
    lastName,
    address,
    phoneNo,
    email,
    countryCode,
  } = req.body;
  console.log(req.body);
  try {
    // Find the nurse by ID
    const hospitalAdminData = await HospitalAdminRegistrationModel.findByPk(id);
    const user = await User.findOne({
      where: { username: hospitalAdminData.username },
    });

    if (!hospitalAdminData) {
      return res.status(404).json({ message: "Nurse not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the nurse data
    hospitalAdminData.firstName = firstName;
    hospitalAdminData.middleName = middleName;
    hospitalAdminData.lastName = lastName;
    hospitalAdminData.address = address;
    hospitalAdminData.phoneNo = phoneNo;
    hospitalAdminData.email = email;
    hospitalAdminData.countryCode = countryCode;

    // Save the updated nurse
    await hospitalAdminData.save();

    // Update the user data
    user.name = firstName + " " + middleName + " " + lastName;
    user.phoneNumber = phoneNo;
    user.email = email;
    console.log("hello1");
    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "Hospital Admin updated successfully",
      hospitalAdminData,
    });
  } catch (error) {
    console.log("Error editing nurse:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  DeleteHospitalAdmin,
  SaveHospitalAdmin,
  EditHospitalAdminData,
  getHospitalAdminList,
};
