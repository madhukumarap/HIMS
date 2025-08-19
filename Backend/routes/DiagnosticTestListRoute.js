// routes/testRoutes.js

const express = require("express");
const router = express.Router();
const testController = require("../Controller/DiagnosticTestListController");
const db = require("../model/index.model");
const { getConnectionList } = require("../model/index.model3");

const DiagnosticTestResultImages = db.DiagnosticTestResultImages;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create a new test
router.post("/createDiagnosticTest", testController.createTest);

// Get all tests
router.get("/getAllDiagnosticTests", testController.getAllTests);
router.put("/updateDiagnosticTest/:id", testController.updateTest);
router.delete("/deleteDiagnosticTest/:id", testController.deleteTest);
router.get(
  "/getAllTestsBothPathologyandDiagnostic",
  testController.getAllTestsBothPathologyandDiagnostic
);

////////////////////////
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Create a folder named "uploads" in your project
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
router.post(
  "/uploadTestImages",
  upload.array("images", 10),
  async (req, res) => {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const DiagnosticTestResultImages = db.DiagnosticTestResultImages;
    try {
      const { testBookingID, testName, testType } = req.body;

      const images = req.files.map((file) => {
        return {
          testBookingID,
          testName,
          testType,
          imagePath: file.path,
        };
      });

      await DiagnosticTestResultImages.bulkCreate(images);

      res.json({ success: true, message: "Images uploaded successfully" });
    } catch (error) {
      console.error("Error uploading images:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to upload images." });
    }
  }
);
/////////////////////////

router.get("/getImagesByTestBookingIDAndTestName", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DiagnosticTestResultImages = db.DiagnosticTestResultImages;
  try {
    const { testBookingID, testName } = req.query;

    console.log("TestNames: " + testName + " " + testBookingID);
    //  return;

    const images = await DiagnosticTestResultImages.findAll({
      where: {
        testName,
        testBookingID,
      },
    });

    console.log("Images: " + images);
    const imagesWithBase64 = await Promise.all(
      images.map(async (image) => {
        const imagePath = image.imagePath;
        const imageBuffer = fs.readFileSync(imagePath);
        const imageBase64 = imageBuffer.toString("base64");
        return {
          id: image.id,
          testBookingID: image.testBookingID,
          testName: image.testName,
          testType: image.testType,
          imagePath: `data:image/png;base64,${imageBase64}`, // include appropriate MIME type
        };
      })
    );
    console.log("hello");
    res.json({ success: true, data: imagesWithBase64 });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ success: false, error: "Failed to fetch images." });
  }
});
////////////////////////
module.exports = router;
