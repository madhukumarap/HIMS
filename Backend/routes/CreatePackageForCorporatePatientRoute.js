const TestPackageController = require("../Controller/CorporatePatientListPackageController");

// router
const router = require("express").Router();

router.post(
  "/assignPackageTocorporatePatient",
  TestPackageController.CreatePackageForCorporatePatient
);
router.get(
  "/getAllCorporatePatientWithHealthPackage",
  TestPackageController.getAllPackageForCorporatePatient
);
router.delete(
  "/deletePatientPackageCorporate/:id",
  TestPackageController.deletePackageById
);
module.exports = router;
