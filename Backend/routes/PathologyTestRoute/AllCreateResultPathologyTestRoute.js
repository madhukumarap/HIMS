const express = require("express");
const router = express.Router();
const T3T4TSHTestController = require("../../Controller/PathologyController/T3T4TSHTestController");

router.post(
  "/createResultT3T4TSHTest",
  T3T4TSHTestController.CreateResultT3T4TSHTest
);

//for blood test for PP
const BloodSugarForPPController = require("../../Controller/PathologyController/BloodSugarForPPController");

router.post(
  "/CreateResultBloodSugarPPTest",
  BloodSugarForPPController.CreateResultBloodSugarPPTest
);

//create result for PlateletCount
const PlateletCountTestController = require("../../Controller/PathologyController/PlateletCountTestController");

router.post(
  "/CreateResultPlateletCountTest",
  PlateletCountTestController.CreateResultPlateletCountTest
);

//create result for PlateletCount
const LipidProfileController = require("../../Controller/PathologyController/LipidProfileController");

router.post(
  "/CreateResultLipidProfileTest",
  LipidProfileController.CreateResultLipidProfileTest
);

//create result for BloodSugarForFasting
const BloodSugarForFastingController = require("../../Controller/PathologyController/BloodSugarForFastingController");

router.post(
  "/CreateResultBloodSugarForFastingTest",
  BloodSugarForFastingController.CreateResultBloodSugarForFastingTest
);
module.exports = router;
