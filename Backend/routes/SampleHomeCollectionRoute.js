const express = require("express");
const router = express.Router();
const SampleCollectionController = require("../Controller/SampleHomeCollectionController");

// Create a new booking
router.post(
  "/testHomeSampleBooking",
  SampleCollectionController.createSampleHomeBooking
);
router.get(
  "/getAllHomeSampleBookingsTest",
  SampleCollectionController.getAllSampleHomeBookings
);
router.put(
  "/updateHomeSampleBooking/:id",
  SampleCollectionController.updateSampleHomeBooking
);
router.delete(
  "/deleteHomeSampleTestBooking/:id",
  SampleCollectionController.deleteSampleHomeBooking
);

router.put(
  "/updateHomeSampleBookingRecollection/:reCollectionId",
  SampleCollectionController.reCollectionSampleHome
);
module.exports = router;
