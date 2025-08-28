const { v4: uuidv4 } = require("uuid");
const db = require("../model/index.model.js");
const { getConnectionList } = require("../model/index.model3");

const router = require("express").Router();
const HospitalModel = db.Hospital;

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const app = express();

// Enable CORS
app.use(cors());

//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    // console.log;
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
//

router.post("/createHospital", upload.single("logo"), async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalModel = db.Hospital;

  try {
    console.log("hello");
    const newGuid = uuidv4();
    const file = req.file.path;
    const formData = req.body;

    const image = file;
    let imageBuffer = file;

    const hospital = await HospitalModel.create({
      hospitalName: formData.hospitalName,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      registrationNo: formData.registrationNo,
      email: formData.email,
      hospitalAdminEmail: formData.hospitalAdminEmail,
      phone: formData.phone,
      countryCode: formData.countryCode,
      landline: formData.landline,
      HospitalUserName: formData.hospitalUserName,
      HospitalGUID: newGuid,
      logo: imageBuffer,
    });

    res.status(201).json({
      success: true,
      message: "Hospital created successfully",
      data: hospital,
    });
  } catch (error) {
    console.error("Error creating hospital:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/getAllHospitals", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalModel = db.Hospital;

  try {
    const hospitals = await HospitalModel.findAll();

    const hospitalsWithImages = hospitals.map((hospital) => {
      let imageBase64 = null;

      if (hospital?.logo) {
        try {
          // build absolute path safely
          const absolutePath = path.resolve(
            __dirname,
            "..",
            hospital.logo.replace(/\\/g, "/")
          );

          if (fs.existsSync(absolutePath)) {
            const imageBuffer = fs.readFileSync(absolutePath);
            imageBase64 = imageBuffer.toString("base64");
          }
        } catch (err) {
          console.warn(
            `Logo not found for hospital ${hospital.id}:`,
            err.message
          );
        }
      }

      return {
        id: hospital.id,
        hospitalName: hospital.hospitalName,
        address: hospital.address,
        city: hospital.city,
        pincode: hospital.pincode,
        registrationNo: hospital.registrationNo,
        email: hospital.email,
        hospitalAdminEmail: hospital.hospitalAdminEmail,
        phone: hospital.phone,
        countryCode: hospital.countryCode,
        landline: hospital.landline,
        HospitalUserName: hospital.HospitalUserName,
        HospitalGUID: hospital.HospitalGUID,
        countryCode: hospital.countryCode,
        logo: imageBase64, // null if not exists
        baseCurrency: hospital.baseCurrency,
        baseCurrencyStatus: hospital.baseCurrencyStatus,
        OptionalCurrency: hospital.OptionalCurrency,
        securityDeposit: hospital.securityDeposit,
      };
    });

    res.json({ success: true, data: hospitalsWithImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/getSecurityDeopsit", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalModel = db.Hospital;

  try {
    const hospitalId = req.hospitalID;
    const hospital = await HospitalModel.findByPk(hospitalId);
    if (!hospital) {
      return res
        .status(404)
        .json({ success: false, error: "Hospital not found" });
    }

    res.send(hospital);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.delete("/deleteHospital/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalModel = db.Hospital;

  try {
    const hospitalId = req.params.id;

    const hospital = await HospitalModel.findByPk(hospitalId);

    if (!hospital) {
      return res
        .status(404)
        .json({ success: false, error: "Hospital not found" });
    }

    // Delete the hospital
    await hospital.destroy();

    res.json({ success: true, message: "Hospital deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.put("/updateHospital/:id", upload.single("logo"), async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalModel = db.Hospital;

  try {
    const hospitalId = req.params.id;
    const formData = req.body;
    console.log(formData);
    //return;
    const hospital = await HospitalModel.findByPk(hospitalId);

    if (!hospital) {
      return res
        .status(404)
        .json({ success: false, error: "Hospital not found" });
    }

    // Update hospital information
    hospital.hospitalName = formData.hospitalName;
    hospital.address = formData.address;
    hospital.city = formData.city;
    hospital.pincode = formData.pincode;
    hospital.registrationNo = formData.registrationNo;
    hospital.email = formData.email;
    hospital.phone = formData.phone;
    hospital.countryCode = formData.countryCode;
    hospital.landline = formData.landline;
    hospital.hospitalAdminEmail = formData.hospitalAdminEmail;
    hospital.baseCurrencyStatus = formData.baseCurrencyStatus;
    hospital.securityDeposit = formData.securityDeposit;

    hospital.patientRegistrationCurrency = formData.patientRegistrationCurrency;
    hospital.patientRegistrationFee = formData.patientRegistrationFee;

    // Check if a logo file was uploaded
    if (req.file) {
      hospital.logo = req.file.path;
    }

    hospital.baseCurrency = formData.baseCurrency;
    hospital.OptionalCurrency = formData.OptionalCurrency;

    await hospital.save();

    res.json({
      success: true,
      message: "Hospital updated successfully",
      data: hospital,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// router.get("/getLastCreatedHospital", async (req, res) => {
//   const database = req.headers.userDatabase;
//   const connectionList = await getConnectionList(database);
//   const db = connectionList[database];
//   const HospitalModel = db.Hospital;

//   // console.log("res=", res.data);
//   try {
//     const lastCreatedHospital = await HospitalModel.findOne({
//       order: [["createdAt", "DESC"]],
//       limit: 1,
//     });
//     console.log("lastCreatedHospital=", lastCreatedHospital);
//     if (!lastCreatedHospital) {
//       return res
//         .status(404)
//         .json({ success: false, error: "No hospitals found" });
//     }
//     //

//     const imagePath = lastCreatedHospital.logo;
//     //
//     console.log("imagePath=", imagePath);

//     //
//     let imageBase64;

//     const imageBuffer = fs.readFileSync(imagePath);

//     imageBase64 = imageBuffer.toString("base64");

//     // Convert the hospital logo image from BLOB to base64
//     const hospitalWithImage = {
//       id: lastCreatedHospital.id,
//       hospitalName: lastCreatedHospital.hospitalName,
//       address: lastCreatedHospital.address,
//       city: lastCreatedHospital.city,
//       pincode: lastCreatedHospital.pincode,
//       registrationNo: lastCreatedHospital.registrationNo,
//       email: lastCreatedHospital.email,
//       phone: lastCreatedHospital.phone,
//       countryCode: lastCreatedHospital.countryCode,
//       landline: lastCreatedHospital.landline,
//       logo: imageBase64,
//     };

//     res.json({ success: true, data: hospitalWithImage });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// });
router.get("/getLastCreatedHospital", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalModel = db.Hospital;

  try {
    const lastCreatedHospital = await HospitalModel.findOne({
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    console.log("lastCreatedHospital=", lastCreatedHospital);

    if (!lastCreatedHospital) {
      return res
        .status(404)
        .json({ success: false, error: "No hospitals found" });
    }

    const imagePath = lastCreatedHospital.logo;
    console.log("imagePath=", imagePath);

    let logoData = null;

    // If logo path exists and is valid, read the file
    if (imagePath && typeof imagePath === "string" && imagePath.trim() !== "") {
      try {
        const imageBuffer = fs.readFileSync(imagePath);
        logoData = imageBuffer.toString("base64");
      } catch (error) {
        console.error("Error reading logo file:", error);
        // Fall back to default URL if file reading fails
        logoData =
          "https://silfratech.com/wp-content/uploads/2024/10/cropped-cropped-Screenshot_2024-10-04_131150_-_Copy-removebg-preview.png";
      }
    } else {
      // Use default logo URL when no logo exists
      logoData =
        "https://silfratech.com/wp-content/uploads/2024/10/cropped-cropped-Screenshot_2024-10-04_131150_-_Copy-removebg-preview.png";
    }

    // Convert the hospital logo image from BLOB to base64
    const hospitalWithImage = {
      id: lastCreatedHospital.id,
      hospitalName: lastCreatedHospital.hospitalName,
      address: lastCreatedHospital.address,
      city: lastCreatedHospital.city,
      pincode: lastCreatedHospital.pincode,
      registrationNo: lastCreatedHospital.registrationNo,
      email: lastCreatedHospital.email,
      phone: lastCreatedHospital.phone,
      countryCode: lastCreatedHospital.countryCode,
      landline: lastCreatedHospital.landline,
      logo: logoData,
      baseCurrency: lastCreatedHospital.baseCurrency,
      baseCurrencyStatus: lastCreatedHospital.baseCurrencyStatus,
      patientRegistrationFee: lastCreatedHospital.patientRegistrationFee,
      patientRegistrationCurrency:
        lastCreatedHospital.patientRegistrationCurrency,
      createdAt: lastCreatedHospital.createdAt,
      updatedAt: lastCreatedHospital.updatedAt,
    };

    res.json({ success: true, data: hospitalWithImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/getHospital/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalModel = db.Hospital;

  try {
    const hospitalId = req.params.id;

    // Find the hospital by its ID
    const hospital = await HospitalModel.findByPk(hospitalId);

    if (!hospital) {
      return res
        .status(404)
        .json({ success: false, error: "Hospital not found" });
    }

    // Read and convert logo to base64 if it exists
    let logoBase64 = null;
    if (hospital.logo) {
      try {
        const imageBuffer = fs.readFileSync(hospital.logo);
        logoBase64 = imageBuffer.toString("base64");
      } catch (err) {
        console.error("Error reading logo file:", err);
      }
    }

    // Send all hospital details
    res.json({
      success: true,
      data: {
        id: hospital.id,
        hospitalName: hospital.hospitalName,
        address: hospital.address,
        city: hospital.city,
        pincode: hospital.pincode,
        registrationNo: hospital.registrationNo,
        email: hospital.email,
        hospitalAdminEmail: hospital.hospitalAdminEmail,
        phone: hospital.phone,
        countryCode: hospital.countryCode,
        landline: hospital.landline,
        HospitalUserName: hospital.HospitalUserName,
        HospitalGUID: hospital.HospitalGUID,
        baseCurrency: hospital.baseCurrency,
        baseCurrencyStatus: hospital.baseCurrencyStatus,
        OptionalCurrency: hospital.OptionalCurrency,
        securityDeposit: hospital.securityDeposit,
        patientRegistrationCurrency: hospital.patientRegistrationCurrency,
        patientRegistrationFee: hospital.patientRegistrationFee,
        logo: logoBase64,
        createdAt: hospital.createdAt,
        updatedAt: hospital.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching hospital:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.post("/updatePatientRegistrationFee/:id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalModel = db.Hospital;

  try {
    const hospitalId = req.params.id;

    // Validate body
    let { patientRegistrationFee, patientRegistrationCurrency } = req.body;

    if (
      patientRegistrationFee === undefined ||
      patientRegistrationCurrency === undefined
    ) {
      return res.status(400).json({
        success: false,
        error:
          "patientRegistrationFee and patientRegistrationCurrency are required.",
      });
    }

    // Coerce & validate amount
    const feeNum = Number(patientRegistrationFee);
    if (isNaN(feeNum) || feeNum < 0) {
      return res.status(400).json({
        success: false,
        error: "patientRegistrationFee must be a non-negative number.",
      });
    }

    // Normalize currency (optional)
    patientRegistrationCurrency = String(patientRegistrationCurrency)
      .trim()
      .toUpperCase();

    // Find hospital
    const hospital = await HospitalModel.findByPk(hospitalId);
    if (!hospital) {
      return res
        .status(404)
        .json({ success: false, error: "Hospital not found" });
    }

    // Update ONLY these two fields
    hospital.patientRegistrationFee = feeNum;
    hospital.patientRegistrationCurrency = patientRegistrationCurrency;

    await hospital.save();

    return res.status(200).json({
      success: true,
      message: "Patient registration fee updated successfully.",
      data: {
        id: hospital.id,
        patientRegistrationFee: hospital.patientRegistrationFee,
        patientRegistrationCurrency: hospital.patientRegistrationCurrency,
        updatedAt: hospital.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating patient registration fee:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
