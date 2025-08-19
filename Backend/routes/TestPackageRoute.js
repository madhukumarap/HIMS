const TestPackageController = require("../Controller/TestPackageController");

// router
const router = require("express").Router();

router.post("/createPackageTest", TestPackageController.CreatePackageTest);
router.get(
  "/GetAllPackagesWithTests",
  TestPackageController.GetAllPackagesWithTests
);

router.get(
  "/selectedTests/:TestPackageID",
  TestPackageController.GetSelectedTestsByPackageID
);
router.put("/updatePackageTest/:id", TestPackageController.UpdatePackageTest);
router.delete("/deletePackageTest/:id", TestPackageController.DeletePackage);

module.exports = router;
