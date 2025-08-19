const TestPackageController = require("../Controller/HealthTestPackageController");

// router
const router = require("express").Router();

router.post(
  "/createHealthPackageTest",
  TestPackageController.CreatePackageTest
);
router.get(
  "/GetAllHealthPackagesWithTests",
  TestPackageController.GetAllPackagesWithTests
);

router.get(
  "/selectedTestsHealthPackage/:TestPackageID",
  TestPackageController.GetSelectedTestsByPackageID
);
router.put(
  "/updateHealthPackageTest/:id",
  TestPackageController.UpdatePackageTest
);
router.delete(
  "/deleteHealthPackageTest/:id",
  TestPackageController.DeletePackage
);

module.exports = router;
