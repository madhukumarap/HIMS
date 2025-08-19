const express = require("express");
const router = express.Router();
const PathologyTestReferralCon = require("../Controller/PathalogyTestReferralController.js");

// Create a new booking
router.post(
  "/createPathologyTestReferral",
  PathologyTestReferralCon.createPathologyTestReferral
);
router.get(
  "/getAllPathologyTestReferral",
  PathologyTestReferralCon.getAllPathologyTestReferral
);

// Update a referral by ID
router.put(
  "/updatePathologyTestReferral/:id",
  PathologyTestReferralCon.updatePathologyTestReferral
);

// Delete a referral by ID
router.delete(
  "/deletePathologyTestReferral/:id",
  PathologyTestReferralCon.deletePathologyTestReferral
);

module.exports = router;
