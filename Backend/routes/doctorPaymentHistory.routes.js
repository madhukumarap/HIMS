// routes/doctorPaymentHistory.routes.js
const express = require("express");
const router = express.Router();
const doctorPaymentController = require("../Controller/doctorPaymentHistoryController");

// post the payments
router.post("/pay", doctorPaymentController.makePayments);

// get the data for paymnets
router.get("/pending/:doctorId", doctorPaymentController.getPendingPayments);

// get the data to recognise weather its paid or not
router.get(
  "/payment-status/:doctorId",
  doctorPaymentController.getDoctorPaymentHistory
);

module.exports = router;
