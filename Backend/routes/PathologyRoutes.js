const express = require("express");
const router = express.Router();
const bookingController = require("../Controller/PathologyController");
const db = require("../model/index.model.js");
const axios = require("axios");
const { Op } = require("sequelize");
const StatusOfPathologyTestsForTestBooking =
  db.StatusOfPathologyTestsForTestBooking;
const StatusOfDiagnosticTestsForTestBooking =
  db.StatusOfDiagnosticTestsForTestBooking;
const PathologyTest = db.PathologyTest;
const { getConnectionList } = require("../model/index.model3");

// Create a new booking
router.post("/testBooking", bookingController.createBooking);

router.get(
  "/selectedPackagePatients/pathology/:selectedPackageId",
  bookingController.getSelectedPackagePatients
);

router.get(
  "/selectedPackagePatients/pathology/:selectedPackageId",
  bookingController.getSelectedPackagePatients
);
router.post("/allPathologyTestData", bookingController.getAllPathologyTestData);
router.get("/getAllBookingsTest", bookingController.getAllBookings);
router.get(
  "/getPathologyDataUsingAdmissionId/:admissionId",
  bookingController.getPathologyDataUsingAdmissionId
);
router.get(
  "/getAllInPatientBookingsTest",
  bookingController.getAllInPatientBookings
);
router.put("/updateBooking/:id", bookingController.updateBooking);
router.delete("/deleteTestBooking/:id", bookingController.deleteBooking);
router.put("/updateResult/:id", bookingController.updateResult);
router.put("/updateAuthorization", bookingController.updateAuthorization);

//
router.get(
  "/GetTestBookingAndResultData/:id",
  bookingController.GetTestBookingAndResultData
);
router.get(
  "/getSelectedPackageBooking",
  bookingController.getSelectedPackageBooking
);
router.get("/getAllPackageRevenue", bookingController.getAllPackageRevenue);
router.get(
  "/getAllBookingsTestPathologyPerVisit",
  bookingController.getAllBookingsTestPathologyPerVisit
);
router.post("/createEventForPathology", bookingController.createBookingEvent);
router.get("/getSelectedTestRevenue", bookingController.getSelectedTestRevenue);
router.get(
  "/getTestCountsAndRevenue",
  bookingController.getTestCountsAndRevenue
);

router.get(
  "/getLostInFollowPatientListforPathology",
  bookingController.getLostInFollowPatientListforPathology
);

router.get(
  "/listOfInpatientTestonAdmissionIDPathology/:admissionID",
  bookingController.listOfInpatientTestonAdmissionIDPathology
);
router.get(
  "/getAllBookingsTestPathologySelectedDoctorReferral",
  bookingController.getAllBookingsTestPathologySelectedDoctorReferral
);
router.get(
  "/getAllBookingsTestPathologyAllDoctorReferral",
  bookingController.getAllBookingsTestPathologyAllDoctorReferral
);
router.get(
  "/PathologyTestStatuses/:PathologyTestBookingId",
  async (req, res) => {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const StatusOfPathologyTestsForTestBooking =
      db.StatusOfPathologyTestsForTestBooking;
    const StatusOfDiagnosticTestsForTestBooking =
      db.StatusOfDiagnosticTestsForTestBooking;
    const PathologyTest = db.PathologyTest;
    try {
      const PathologyTestBookingId = req.params.PathologyTestBookingId;

      const statuses = await StatusOfPathologyTestsForTestBooking.findAll({
        where: {
          PathologyTestBookingId: PathologyTestBookingId,
        },
      });
      console.log(statuses);
      res.json(statuses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get(
  "/DiagnosticTestStatuses/:DiagnosticTestBookingId",
  async (req, res) => {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const StatusOfPathologyTestsForTestBooking =
      db.StatusOfPathologyTestsForTestBooking;
    const StatusOfDiagnosticTestsForTestBooking =
      db.StatusOfDiagnosticTestsForTestBooking;
    const PathologyTest = db.PathologyTest;
    try {
      const DiagnosticTestBookingId = req.params.DiagnosticTestBookingId;

      const statuses = await StatusOfDiagnosticTestsForTestBooking.findAll({
        where: {
          DiagnosticTestBookingId: DiagnosticTestBookingId,
        },
      });
      console.log(statuses);
      res.json(statuses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/PathologyTotalfees", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const StatusOfPathologyTestsForTestBooking =
    db.StatusOfPathologyTestsForTestBooking;
  const StatusOfDiagnosticTestsForTestBooking =
    db.StatusOfDiagnosticTestsForTestBooking;
  const PathologyTest = db.PathologyTest;
  try {
    let exchangeRates;

    if (!exchangeRates) {
      exchangeRates = await getExchangeRates();
    }

    const bookings = await PathologyTest.findAll({
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

// router.get('/selectedPackagePatients/:selectedPackageId', async(req, res)=>{
//   try {
//     const id = req.params.selectedPackageId
//   const database = req.headers.userDatabase;
//   const connectionList = await getConnectionList(database);
//   const db = connectionList[database];
//   const PathologyTest = db.PathologyTest;

//   const data = await PathologyTest.findAll({where : {selectedPackageID : id}})
//   res.send(data)
//   } catch (error) {
//     console.log(error)
//     res.status(500).send({message:"Something went wrong"})
//   }

// })

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
