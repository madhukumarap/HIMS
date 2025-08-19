// routes/testRoutes.js

const express = require("express");
const router = express.Router();
const testController = require("../Controller/PathologyTestManageController");

// Create a new test
router.post("/createPathologyTest", testController.createTest);

// Get all tests
router.get("/getAllPathologyTests", testController.getAllTests);
router.put("/updatePathologyTest/:id", testController.updateTest);
router.delete("/deletePathologyTest/:id", testController.deleteTest);

//////lab Category API/////////
router.post("/LabCategoryCreate", testController.CreateLabCategory);
router.get("/GetLabCategoryList", testController.GetListOfLabCategories);
router.delete("/DeleteLabCategory/:id", testController.DeleteLabCategory);
router.put("/UpdateLabCategory/:id", testController.UpdateLabCategory);

////// Specimen API //////

// Create a new Specimen
router.post("/SpecimenCreate", testController.CreateSpecimen);

// Get the list of Specimens
router.get("/GetListOfSpecimens", testController.GetListOfSpecimens);

// Delete a Specimen by ID
router.delete("/DeleteSpecimen/:id", testController.DeleteSpecimen);

// Update a Specimen by ID
router.put("/UpdateSpecimen/:id", testController.UpdateSpecimen);
// Get list of specimens with category
router.get("/getSpecimenWithCategory", testController.getSpecimenWithCategory);

module.exports = router;
