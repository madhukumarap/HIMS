const db = require("../model/index.model.js");
const Nurse = db.nurse;
const axios = require("axios");
const nodemailer = require("nodemailer");
const { checkUser } = require("../middleware/checkUser.js");
const { getConnectionList } = require("../model/index.model3");

const User = db.user;

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hims.pharmacy.tech@gmail.com",
    pass: "uliiksvpjxgfeizf",
  },
});

const SaveNurse = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Nurse = db.nurse;
  const User = db.user;
  console.log(req.body);
  try {
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
        status: "active",
        roles: ["nurse"],
      }
    );
    console.log("signupResponse: " + JSON.stringify(signupResponse.data));
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
        <li><strong>Phone Number:</strong>  ${countryCode + " " + phoneNo}</li>
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
    const pharmacist = await Nurse.create({
      FirstName: firstName,
      MiddleName: middleName,
      LastName: lastName,
      Address: address,
      phoneNo,
      countryCode,
      email,
      username: userName,
    });

    // Send a success response
    res.status(200).send("Nurse saved successfully");
  } catch (signupError) {
    // Handle signup API error
    console.error(signupError);
    if (
      signupError.response &&
      signupError.response.data &&
      signupError.response.data.message
    ) {
      return res.status(400).json({
        message: `Failed to create Nurse. ${signupError.response.data.message}`,
      });
    } else {
      return res
        .status(500)
        .json({ message: "An error occurred while saving the Nurse" });
    }
  }
  // } catch (pharmacistError) {
  //     // Handle pharmacist creation error
  //     console.error(pharmacistError);
  //     return res.status(500).json({ message: 'An error occurred while saving the pharmacist' });
  // }
};

const getNurseList = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Nurse = db.nurse;
  const User = db.user;
  try {
    const nurses = await Nurse.findAll();
    res.status(200).json(nurses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving nurse list", error: error.message });
  }
};

const DeleteNurse = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Nurse = db.nurse;
  const User = db.user;
  const { id } = req.params;

  try {
    const nurse = await Nurse.findByPk(id);

    if (!nurse) {
      return res.status(404).json({ message: "Nurse not found" });
    }

    const nurseUsername = nurse.username;

    await nurse.destroy();

    const user = await User.findOne({ where: { username: nurseUsername } });

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

const EditNurseData = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Nurse = db.nurse;
  const User = db.user;
  const { id } = req.params;
  const {
    FirstName,
    MiddleName,
    LastName,
    Address,
    phoneNo,
    email,
    countryCode,
  } = req.body;
  console.log(req.body);
  try {
    // Find the nurse by ID
    const nurse = await Nurse.findByPk(id);
    const user = await User.findOne({ where: { username: nurse.username } });

    if (!nurse) {
      return res.status(404).json({ message: "Nurse not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the nurse data
    nurse.FirstName = FirstName;
    nurse.MiddleName = MiddleName;
    nurse.LastName = LastName;
    nurse.Address = Address;
    nurse.phoneNo = phoneNo;
    nurse.email = email;
    nurse.countryCode = countryCode;

    // Save the updated nurse
    await nurse.save();

    // Update the user data
    user.name = FirstName + " " + MiddleName + " " + LastName;
    user.phoneNumber = phoneNo;
    user.email = email;
    console.log("hello1");
    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Nurse updated successfully", nurse });
  } catch (error) {
    console.log("Error editing nurse:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  DeleteNurse,
  SaveNurse,
  EditNurseData,
  getNurseList,
};
