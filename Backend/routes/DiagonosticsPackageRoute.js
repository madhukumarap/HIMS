const TestPackageController = require("../Controller/DiagnosticspackageController");

// router
const router = require("express").Router();

router.post(
  "/diagnosticscreatePackageTest",
  TestPackageController.CreatePackageTest
);
router.get(
  "/DiagnosticsGetAllPackagesWithTests",
  TestPackageController.GetAllPackagesWithTests
);

router.get(
  "/DiagnosticsSelectedTests/:TestPackageID",
  TestPackageController.GetSelectedTestsByPackageID
);
router.put(
  "/DiagnosticsUpdatePackageTest/:id",
  TestPackageController.UpdatePackageTest
);
router.delete(
  "/DiagnosticsDeletePackageTest/:id",
  TestPackageController.DeletePackage
);

module.exports = router;
