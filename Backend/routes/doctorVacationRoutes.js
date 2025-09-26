const express = require("express");
const router = express.Router();
const {
  getAllVacations,
  createVacation,
  updateVacation,
  deleteVacation,
} = require("../Controller/doctorVacationController");

router.get("/get", getAllVacations);
router.post("/", createVacation);
router.put("/:id", updateVacation);
router.delete("/:id", deleteVacation);

module.exports = router;
