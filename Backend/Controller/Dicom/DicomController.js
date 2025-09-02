// const { DicomFile, User } = require("../models/index.model");
const db = require("../../model/index.model.js");
const orthanc = require("./orthancService.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configure multer to store in a temp folder
const upload = multer({
  dest: path.join(__dirname, "..", "..", "tmp"),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
});

async function listDicomFiles(req, res) {
  try {
    const isAll =
      req.user && req.user.role === "Admin" && req.query.all === "1";
    const where = isAll ? {} : { userId: req.user.id };
    const rows = await db.Dicom_files.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    return res.json({ count: rows.length, rows });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}

async function getDicomRecord(req, res) {
  try {
    const id = req.params.id;
    const rec = await db.Dicom_files.findByPk(id);
    if (!rec) return res.status(404).json({ message: "Record not found" });
    if (req.user.role !== "Admin" && rec.userId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });
    const instanceId = rec.orthancInstanceId;
    let orthancData = null;
    if (instanceId) {
      try {
        orthancData = await orthanc.getInstance(instanceId);
      } catch (e) {
        orthancData = { error: e.message };
      }
    }
    return res.json({ record: rec, orthanc: orthancData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}

async function getDicomTags(req, res) {
  try {
    const id = req.params.id;
    const rec = await db.Dicom_files.findByPk(id);
    if (!rec) return res.status(404).json({ message: "Record not found" });
    if (req.user.role !== "Admin" && rec.userId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });
    if (!rec.orthancInstanceId)
      return res.status(400).json({ message: "No orthanc instance id stored" });
    const tags = await orthanc.getInstanceTags(rec.orthancInstanceId);
    return res.json({ tags });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}

async function downloadDicom(req, res) {
  try {
    const id = req.params.id;
    const rec = await db.Dicom_files.findByPk(id);
    if (!rec) return res.status(404).json({ message: "Record not found" });
    if (!rec.orthancInstanceId)
      return res.status(400).json({ message: "No orthanc instance id stored" });
    const streamResp = await orthanc.downloadInstanceFileToStream(
      rec.orthancInstanceId
    );
    res.setHeader("Content-Type", "application/dicom");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${rec.orthancInstanceId}.dcm"`
    );
    streamResp.data.pipe(res);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}

async function getStudyDetails(req, res) {
  try {
    const studyId = req.params.studyId;
    if (!studyId) return res.status(400).json({ message: "studyId required" });
    const data = await orthanc.getStudy(studyId);
    return res.json({ study: data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}

async function findStudies(req, res) {
  try {
    const q = req.body || {};
    const data = await orthanc.searchStudies(q);
    return res.json({ result: data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}

async function uploadDicomFileHandler(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { patientId, doctorId, consultationId, useLocal } = req.body;
    const filePath = req.file.path;

    // Read file buffer
    const buffer = fs.readFileSync(filePath);

    // Upload to Orthanc
    const orthancResp = await orthanc.uploadDicom({
      buffer,
      useLocal: !!useLocal,
    });

    const orthancInstanceId = orthancResp.ID || orthancResp;
    let orthancStudyId = null;
    if (orthancResp.ParentStudy) orthancStudyId = orthancResp.ParentStudy;
    if (
      !orthancStudyId &&
      orthancResp.MainDicomTags &&
      orthancResp.MainDicomTags.StudyInstanceUID
    ) {
      orthancStudyId = orthancResp.MainDicomTags.StudyInstanceUID;
    }

    // Save in DB
    const rec = await db.Dicom_files.create({
      userId: req.user.id,
      patientId: patientId || null,
      doctorId: doctorId || null,
      consultationId: consultationId || null,
      orthancInstanceId: orthancInstanceId || null,
      orthancStudyId: orthancStudyId || null,
      metadata: orthancResp,
    });

    // Cleanup temp
    fs.unlinkSync(filePath);

    return res.json({
      message: "Uploaded to Orthanc and saved record",
      dicomFile: rec,
      orthanc: orthancResp,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Upload error", error: err.message });
  }
}

module.exports = {
  listDicomFiles,
  getDicomRecord,
  getDicomTags,
  downloadDicom,
  getStudyDetails,
  findStudies,
  uploadDicomFileHandler,
  upload: upload.single("file"),
};
