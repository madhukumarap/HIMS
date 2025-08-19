const HoshospitalAdminController = require("../Controller/HospitalAdminRegistrationController");
// router
const authJwt = require("../middleware/authJwt");

const router = require("express").Router();

router.post(
  "/saveHospitalAdmin",
  [authJwt.verifyToken, authJwt.isSuperAdmin],
  HoshospitalAdminController.SaveHospitalAdmin
);
router.get(
  "/getHospitalAdminList",
  HoshospitalAdminController.getHospitalAdminList
);

router.delete(
  "/DeleteHospitalAdmin/:id",
  HoshospitalAdminController.DeleteHospitalAdmin
);

router.put(
  "/EditHospitalAdminData/:id",
  HoshospitalAdminController.EditHospitalAdminData
);

module.exports = router;
