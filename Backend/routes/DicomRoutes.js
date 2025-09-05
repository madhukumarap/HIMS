// routes/dicom.routes.js
const express = require("express");
const dicomController = require("../Controller/Dicom/dicomController");
const authJwt = require("../middleware/authJwt");

const router = express.Router();

// middleware for headers
router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "token, Origin, Content-Type, Accept"
  );
  next();
});

// 📌 Upload DICOM file
router.post(
  "/upload",
  [authJwt.verifyToken],
  dicomController.upload,
  dicomController.handleMulterError, // Add error handling middleware
  dicomController.uploadDicomFileHandler
);

// 📌 List DICOM files
router.get("/getDicom", [authJwt.verifyToken], dicomController.listDicomFiles);

// 📌 Get DICOM record
router.get("/:id", [authJwt.verifyToken], dicomController.getDicomRecord);

// 📌 Get DICOM tags
router.get("/:id/tags", [authJwt.verifyToken], dicomController.getDicomTags);

// 📌 Download DICOM
router.get("/:id/download", [authJwt.verifyToken], dicomController.downloadDicom);

// 📌 Get study details
router.get("/study/:studyId", [authJwt.verifyToken], dicomController.getStudyDetails);

// 📌 Search studies
router.post("/studies/search", [authJwt.verifyToken], dicomController.findStudies);

module.exports = router;