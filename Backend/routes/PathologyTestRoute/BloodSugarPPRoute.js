const express = require("express");
const router = express.Router();
const BloodSugarForPPController = require("../../Controller/PathologyController/BloodSugarForPPController");

router.post(
  "/CreateResultBloodSugarPPTest",
  BloodSugarForPPController.CreateResultBloodSugarPPTest
);
module.exports = router;
