const express = require("express");
const router = express.Router();
const dicomController = require("../Controller/Dicom/dicomController.js");

router.post(
  "/upload",
  dicomController.upload,
  dicomController.uploadDicomFileHandler
);
router.get("/",  dicomController.listDicomFiles);
router.get("/:id", dicomController.getDicomRecord);
router.get("/:id/tags",  dicomController.getDicomTags);
router.get("/:id/download", dicomController.downloadDicom);
router.get("/study/:studyId", dicomController.getStudyDetails);
router.post("/find",  dicomController.findStudies);

module.exports = router;
