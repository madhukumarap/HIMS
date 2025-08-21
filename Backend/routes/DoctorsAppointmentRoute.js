const express = require("express");
const doctorsAppointmentController = require("../Controller/DoctorsAppointmentController");
const db = require("../model/index.model.js");
const DoctorsAppointment = db.DoctorsAppointment;
const axios = require("axios");
const { Op } = require("sequelize");
const router = express.Router();
//
const { getConnectionList } = require("../model/index.model3");

const multer = require("multer");
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
// console.log("upload=", upload);
//
router.post(
  "/createDoctorsAppointment",
  upload.single("capturedImage"),
  doctorsAppointmentController.createDoctorsAppointment
);
router.get(
  "/getAllDoctorsAppointments",
  doctorsAppointmentController.getAllDoctorsAppointments
);
router.delete(
  "/deleteAppointment/:id",
  doctorsAppointmentController.deleteAppointment
);

router.put(
  "/updateDoctorsAppointment/:id",
  doctorsAppointmentController.updateDoctorsAppointment
);

router.get(
  "/getlistOfPatientByDoctorEmail/:email",
  doctorsAppointmentController.findallPatientsEachDoctor
);

router.get(
  "/getPatientDoctorDatabyBookingID/:id",
  doctorsAppointmentController.getPatientDoctorDatabyBookingID
);

router.get(
  "/bookingsWithCorporateIDNull",
  doctorsAppointmentController.getBookingsWithCorporateIDNull
);
router.get(
  "/bookingsWithCorporateIDNotNull",
  doctorsAppointmentController.getBookingsWithCorporateIDNotNull
);

router.post(
  "/createPathologistTestBooking",
  doctorsAppointmentController.createPathologistTestBooking
);

router.get(
  "/getAllBookingsConsultationPerVisit",
  doctorsAppointmentController.getAllBookingsConsultationPerVisit
);

router.get(
  "/getLostInFollowPatientListforConsultation",
  doctorsAppointmentController.getLostInFollowPatientListforConsultation
);

router.get("/ConsultantTotalfees", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DoctorsAppointment = db.DoctorsAppointment;

  try {
    let exchangeRates;

    if (!exchangeRates) {
      exchangeRates = await getExchangeRates();
    }

    const bookings = await DoctorsAppointment.findAll({
      attributes: ["amount", "Currency"],
      where: {
        amount: {
          [Op.gt]: 0, // TotalFees > 0
        },
        PaymentStatus: "Paid",
      },
    });

    let totalFeesINR = 0;
    let totalFeesUSD = 0;
    let totalFeesEUR = 0;
    let totalFeesCDF = 0;
    // Iterate through each booking and convert TotalFees to INR, USD, and EUR
    for (const booking of bookings) {
      const convertedAmountINR = convertToCurrency(
        booking.amount,
        booking.Currency,
        exchangeRates,
        "INR"
      );
      if (!isNaN(convertedAmountINR)) {
        totalFeesINR += convertedAmountINR;
      }

      const convertedAmountUSD = convertToCurrency(
        booking.amount,
        booking.Currency,
        exchangeRates,
        "USD"
      );
      console.log("convertedAmountUSD: " + convertedAmountUSD);
      if (!isNaN(convertedAmountUSD)) {
        totalFeesUSD += convertedAmountUSD;
      }

      const convertedAmountEUR = convertToCurrency(
        booking.amount,
        booking.Currency,
        exchangeRates,
        "EUR"
      );
      console.log("convertedAmountEUR: " + convertedAmountEUR);
      if (!isNaN(convertedAmountEUR)) {
        totalFeesEUR += convertedAmountEUR;
      }
      const convertedAmountCDF = convertToCurrency(
        booking.amount,
        booking.Currency,
        exchangeRates,
        "CDF"
      );
      console.log("convertedAmountCDF: " + convertedAmountCDF);
      if (!isNaN(convertedAmountCDF)) {
        totalFeesCDF += convertedAmountCDF;
      }
    }

    res.json({
      totalFeesINR: parseFloat(totalFeesINR.toFixed(2)),
      totalFeesUSD: parseFloat(totalFeesUSD.toFixed(2)),
      totalFeesEUR: parseFloat(totalFeesEUR.toFixed(2)),
      totalFeesCDF: parseFloat(totalFeesCDF.toFixed(2)),
    });
  } catch (error) {
    console.error("Err at ConsultantTotalfees: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// async function getExchangeRates() {
//   try {
//     const response = await axios.get(
//       `${process.env.REMOTE_SERVER_BASE_URL}/api/GetExchangeRates/INR`
//     );

//     const exchangeRatesData = response.data.exchangeRatesData;
//     const firstCurrencyData = exchangeRatesData[0].data;
//     const rates = firstCurrencyData.rates;
//     return rates;
//   } catch (error) {
//     console.error(error);
//     throw new Error(`Error fetching exchange rates: ${error}`);
//   }
// }

async function getExchangeRates(currency = "INR") {
  try {
    // Try hitting your local exchange rate service
    const response = await axios.get(
      `${process.env.REMOTE_SERVER_BASE_URL}/api/GetExchangeRates/INR`
    );
    return response.data;
  } catch (error) {
    console.error("⚠️ Error fetching exchange rates:", error.message);

    // 🔹 Fallback: return default exchange rates
    // You can adjust this depending on your needs
    const fallbackRates = {
      INR: 1, // Base currency
      USD: 83, // Example INR → USD
      EUR: 90, // Example INR → EUR
    };

    return {
      base: currency,
      rates: fallbackRates,
      source: "fallback", // so you know it came from default
    };
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
