// routes/doctorPaymentHistory.routes.js
const express = require("express");
const router = express.Router();
const doctorPaymentController = require("../Controller/doctorPaymentHistoryController");

// Get all unpaid payments
router.get("/unpaid", doctorPaymentController.getUnpaidPayments);

// Make payments (bulk update)
router.post("/pay", doctorPaymentController.makePayments);

// Get doctor payment history
router.get("/history/:doctorId", doctorPaymentController.getPaymentHistory);

// router.get("/paidIds/:doctorId", doctorPaymentController.getDoctorPaidIds);

router.get("/pending/:doctorId", doctorPaymentController.getPendingPayments);

router.get(
  "/payment-status/:doctorId",
  doctorPaymentController.getDoctorPaymentHistory
);

module.exports = router;
