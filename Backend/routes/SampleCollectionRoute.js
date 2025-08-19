const express = require("express");
const router = express.Router();
const SampleCollectionController = require("../Controller/SampleCollectionController");

// Create a new booking
router.post(
  "/testSampleBooking",
  SampleCollectionController.createSampleBooking
);
router.get(
  "/getAllSampleBookingsTest",
  SampleCollectionController.getAllSampleBookings
);
router.put(
  "/updateSampleBooking/:id",
  SampleCollectionController.updateSampleBooking
);
router.delete(
  "/deleteSampleTestBooking/:id",
  SampleCollectionController.deleteSampleBooking
);

router.put(
  "/updateSampleBookingBarcodeValue/:id",
  SampleCollectionController.reCollectionSample
);
router.put(
  "/updateSampleBookingRecollectionDate/:reCollectionId",
  SampleCollectionController.reCollectionSampleDate
);
module.exports = router;
