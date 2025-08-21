const express = require("express");
const router = express.Router();
const bookingController = require("../Controller/DiagnosticsBookingController");
const db = require("../model/index.model.js");
const axios = require("axios");
const { Op } = require("sequelize");
const { getConnectionList } = require("../model/index.model3");

const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
// Create a new booking
router.post("/createDiagnosticsBooking", bookingController.createBooking);
router.put(
  "/updateDiagnosticsBooking/:bookingId",
  bookingController.updateBooking
);
router.get("/getDiagnosticsBooking", bookingController.getAllBookings);
router.post(
  "/getDiagnosticsBooking",
  bookingController.getAllDiagnosticsBookings
);
router.get(
  "/selectedPackagePatients/diagnostic/:selectedPackageId",
  bookingController.getSelectedPackagePatients
);

router.get(
  "/getSelectedPackageBookingDiagnostic",
  bookingController.getSelectedPackageBookingDiagnostic
);
router.get(
  "/getAllBookingsTestDiagnosticPerVisit",
  bookingController.getAllBookingsTestDiagnosticPerVisit
);
router.get(
  "/getSelectedTestRevenueDiagnostic",
  bookingController.getSelectedTestRevenueDiagnostic
);
router.get(
  "/getTestCountsAndRevenueDiagnostic",
  bookingController.getTestCountsAndRevenueDiagnostic
);
router.get(
  "/getAllPackageRevenueDiagnostic",
  bookingController.getAllPackageRevenueDiagnostic
);

router.put(
  "/updateAuthorizationDiagnostic",
  bookingController.updateAuthorization
);
router.delete(
  "/deleteDiagnosticTestBooking/:id",
  bookingController.deleteBooking
);

router.get(
  "/getAllBookingsTestDiagnosticSelectedDoctorReferral",
  bookingController.getAllBookingsTestDiagnosticSelectedDoctorReferral
);

router.get(
  "/getLostInFollowPatientListforDiagnostic",
  bookingController.getLostInFollowPatientListforDiagnostic
);
router.get(
  "/getAllBookingsTestDiagnosticAllDoctorReferral",
  bookingController.getAllBookingsTestDiagnosticAllDoctorReferral
);

router.get(
  "/listOfInpatientTestonAdmissionIDDiagnostic/:admissionID",
  bookingController.listOfInpatientTestonAdmissionIDDiagnostic
);

router.get("/DiagnosticTotalfees", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticsBookingModel = db.DiagnosticsBookingModel;

  try {
    // Fetch exchange rates only if they are not available
    let exchangeRates;

    if (!exchangeRates) {
      exchangeRates = await getExchangeRates();
    }

    const bookings = await DiagnosticsBookingModel.findAll({
      attributes: ["TotalFees", "Currency"],
      where: {
        TotalFees: {
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
        booking.TotalFees,
        booking.Currency,
        exchangeRates,
        "INR"
      );
      if (!isNaN(convertedAmountINR)) {
        totalFeesINR += convertedAmountINR;
      }

      const convertedAmountUSD = convertToCurrency(
        booking.TotalFees,
        booking.Currency,
        exchangeRates,
        "USD"
      );
      console.log("convertedAmountUSD: " + convertedAmountUSD);
      if (!isNaN(convertedAmountUSD)) {
        totalFeesUSD += convertedAmountUSD;
      }

      const convertedAmountEUR = convertToCurrency(
        booking.TotalFees,
        booking.Currency,
        exchangeRates,
        "EUR"
      );
      console.log("convertedAmountEUR: " + convertedAmountEUR);
      if (!isNaN(convertedAmountEUR)) {
        totalFeesEUR += convertedAmountEUR;
      }
      const convertedAmountCDF = convertToCurrency(
        booking.TotalFees,
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
