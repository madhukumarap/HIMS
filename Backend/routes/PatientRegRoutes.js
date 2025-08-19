// import controllers PaitentRegController
const PaitentRegController = require("../Controller/PatientRegController.js");
const authJwt = require("../middleware/authJwt");
const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const mysql = require("mysql");
const db = require("../model/index.model.js");
const PaitentReg = db.paitentReg;
const CompanyRegistrationModel = db.CompanyRegistration;
const axios = require("axios");
const { Op } = require("sequelize");
// router
const router = require("express").Router();
const { getConnectionList } = require("../model/index.model3");

router.post("/paitentRegui", PaitentRegController.createPaitentui); //[authJwt.verifyToken, authJwt.isAdmin]

//paitentDocterpriscription create
router.post(
  "/postPaitentPrecriptions",
  [authJwt.verifyToken, authJwt.isDoctor],
  PaitentRegController.postprescription
);

//
router.get("/getoneP/:id", PaitentRegController.getonePaisent);
//getall

//router.put("/editPaitent",PaitentRegController.editPaitent);

// update by id
router.put("/updatePatient/:id", PaitentRegController.updatePatient);
//get list of Paitent
router.get("/getallPaitents", PaitentRegController.findallPaitents);
//router.get("/getallPaitents/:hospitalId", PaitentRegController.findallPaitents);

router.get(
  "/getallPaitentsList/:email",
  [authJwt.verifyToken, authJwt.isDoctor],
  PaitentRegController.findallPaitentsEachDoctor
);

//get one .. one to many
router.get("/getOnePaisentReg/:id", PaitentRegController.getOnePaisentReg); //  [authJwt.verifyToken, authJwt.isDoctor],
router.get(
  "/getOnePaisentRegPatient/:phoneNumber",
  PaitentRegController.getOnePaisentRegPatient
);
router.put("/updateBillingInfo/:id", PaitentRegController.updateBillingInfo);

router.delete("/deletePatientBy/:id", PaitentRegController.deletePatientById);

const upload = multer({ dest: "uploads/" });

router.post(
  "/uploadPatientMasterdata",
  upload.single("file"),
  async (req, res) => {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const PaitentReg = db.paitentReg;
    const CompanyRegistrationModel = db.CompanyRegistration;
    try {
      const results = [];

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => {
          results.push(data);
        })
        .on("end", async () => {
          const invalidData = [];
          const successfulInsertions = [];
          const existingPhoneNumbers = (
            await PaitentReg.findAll({
              attributes: ["phoneNumberP"],
            })
          ).map((record) => record.phoneNumberP);

          for (const data of results) {
            const { mr, firstName, lastName, phoneNumberP, age, gender } = data;
            console.log("CorporateID: " + data.CorporateID);

            const company = await CompanyRegistrationModel.findOne({
              where: {
                registrationNo: data.CorporateID,
              },
            });
            if (company) {
              data.CompanyName = company?.companyName;
              data.CompanyID = company.id;
              console.log("Company: " + company.companyName);
            }
            //return;
            data.hospitalId = 0; //get it from req body or query
            // Check if mandatory fields are present
            if (
              !mr ||
              !firstName ||
              !lastName ||
              !phoneNumberP ||
              !age ||
              !gender
            ) {
              invalidData.push(data);
              continue; // Skip this data
            }

            // Check if at least one of the optional fields is present
            if (!data.address && !data.pincode && !data.state && !data.city) {
              invalidData.push(data);
              continue; // Skip this data
            }

            if (existingPhoneNumbers.includes(phoneNumberP)) {
              invalidData.push(data);
              continue; // Skip this data
            }
            const existingPatient = await PaitentReg.findOne({
              where: { phoneNumberP },
            });
            if (existingPatient) {
              console.log(
                `Patient with email ${phoneNumberP} already exists. Skipping...`
              );
              invalidData.push(data);
              continue; // Skip this data
            }

            try {
              await PaitentReg.create(data);
              successfulInsertions.push(data);
            } catch (error) {
              console.error(error);
            }
          }

          fs.unlinkSync(req.file.path);

          res.json({
            message: "Data upload completed",
            successfulInsertions,
            invalidData,
          });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/PatientRegTotalfees", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaitentReg = db.paitentReg;
  const CompanyRegistrationModel = db.CompanyRegistration;
  try {
    let exchangeRates;

    if (!exchangeRates) {
      exchangeRates = await getExchangeRates();
    }

    const bookings = await db.paitentReg.findAll({
      attributes: ["registrationFees", "Currency"],
      where: {
        registrationFees: {
          [Op.gt]: 0, // TotalFees > 0
        },
        paymentStatus: "Paid",
      },
    });

    let totalFeesINR = 0;
    let totalFeesUSD = 0;
    let totalFeesEUR = 0;
    let totalFeesCDF = 0;
    // Iterate through each booking and convert TotalFees to INR, USD, and EUR
    for (const booking of bookings) {
      const convertedAmountINR = convertToCurrency(
        booking.registrationFees,
        booking.Currency,
        exchangeRates,
        "INR"
      );
      console.log("convertedAmountINR: " + convertedAmountINR);
      if (!isNaN(convertedAmountINR)) {
        totalFeesINR += convertedAmountINR;
      }

      const convertedAmountUSD = convertToCurrency(
        booking.registrationFees,
        booking.Currency,
        exchangeRates,
        "USD"
      );
      console.log("convertedAmountUSD: " + convertedAmountUSD);
      if (!isNaN(convertedAmountUSD)) {
        totalFeesUSD += convertedAmountUSD;
      }

      const convertedAmountEUR = convertToCurrency(
        booking.registrationFees,
        booking.Currency,
        exchangeRates,
        "EUR"
      );
      console.log("convertedAmountEUR: " + convertedAmountEUR);
      if (!isNaN(convertedAmountEUR)) {
        totalFeesEUR += convertedAmountEUR;
      }
      const convertedAmountCDF = convertToCurrency(
        booking.registrationFees,
        booking.Currency,
        exchangeRates,
        "CDF"
      );
      console.log("convertedAmountCDF: " + convertedAmountCDF);
      if (!isNaN(convertedAmountCDF)) {
        totalFeesCDF += convertedAmountCDF;
      }
      // console.log("totalFeesINR: " + totalFeesINR);
      // console.log("totalFeesUSD: " + totalFeesUSD);
      // console.log("totalFeesEUR: " + totalFeesEUR);
    }

    res.json({
      totalFeesINR: parseFloat(totalFeesINR.toFixed(2)),
      totalFeesUSD: parseFloat(totalFeesUSD.toFixed(2)),
      totalFeesEUR: parseFloat(totalFeesEUR.toFixed(2)),
      totalFeesCDF: parseFloat(totalFeesCDF.toFixed(2)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Function to get exchange rates from the API
async function getExchangeRates() {
  try {
    const response = await axios.get(
      `${process.env.REMOTE_SERVER_BASE_URL}/api/GetExchangeRates/INR`
    );

    const exchangeRatesData = response.data.exchangeRatesData;
    const firstCurrencyData = exchangeRatesData[0].data;
    const rates = firstCurrencyData.rates;
    return rates;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching exchange rates");
  }
}

// Function to convert amount to the target currency
function convertToCurrency(amount, currency, exchangeRates, targetCurrency) {
  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedAmount)) {
    return null;
  }

  if (currency === targetCurrency) {
    return parsedAmount;
  } else if (exchangeRates[currency] && exchangeRates[targetCurrency]) {
    const amountInINR = parsedAmount / exchangeRates[currency];
    return amountInINR * exchangeRates[targetCurrency];
  } else {
    return null;
  }
}

module.exports = router;
