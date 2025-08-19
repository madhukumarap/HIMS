const express = require("express");
const enterCodeController = require("../Controller/CommissionCodeDataController");

const router = express.Router();

router.post(
  "/EnterCodeTypeValueCreate",
  enterCodeController.createEnterCodeTypeValue
);
router.get("/GetEnterCodeList", enterCodeController.getEnterCodeList);
router.put(
  "/UpdateEnterCodeTypeValue/:id",
  enterCodeController.updateEnterCodeTypeValue
);
router.delete(
  "/DeleteEnterCodeTypeValue/:id",
  enterCodeController.deleteEnterCodeTypeValue
);

module.exports = router;
