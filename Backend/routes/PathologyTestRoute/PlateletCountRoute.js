const express = require("express");
const router = express.Router();
const PlateletCountTestController = require("../../Controller/PathologyController/PlateletCountTestController");

router.post(
  "/CreateResultPlateletCountTest",
  PlateletCountTestController.CreateResultPlateletCountTest
);
module.exports = router;
