// Controller/Dicom/DicomController.js
const orthanc = require("./orthancService.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { getConnectionList } = require("../../model/index.model3.js");
const { QueryTypes } = require("sequelize");
const { type } = require("os");

// Configure multer with better error handling
const upload = multer({
  dest: path.join(__dirname, "..", "..", "tmp"),
  limits: {
    fileSize: 500 * 1024 * 1024, // Increase to 500MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Accept DICOM files and other medical imaging formats
    const allowedTypes = [
      "application/dicom",
      "application/octet-stream",
      "image/dicom",
      "image/x-dicom",
    ];

    if (
      allowedTypes.includes(file.mimetype) ||
      file.originalname.toLowerCase().endsWith(".dcm")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only DICOM files are allowed"), false);
    }
  },
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "File too large. Maximum size is 500MB",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "Too many files. Only one file allowed",
      });
    }
  }
  next(err);
};

async function listDicomFiles(req, res) {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DicomFile = db.DicomFile;

  try {
    const { patientId, testBookingID } = req.query;
    console.log(patientId, testBookingID, "patientId, testBookingID")
    console.log(req.user, "req.user in listDicomFiles");
    // Admin can see all if no specific filters
    const isAll =
      req.user && req.user.role === "Admin" && req.query.all === "1";

    // Build where clause
    let where = {};

    if (!isAll) {
      // For non-admin OR when specific filters are provided
      if (patientId) {
        where.patientId = patientId;
      }

      if (testBookingID) {
        where.testBookingID = testBookingID;
      }

      // If no filters provided for non-admin, return empty or handle as needed
      if (Object.keys(where).length === 0 && !isAll) {
        return res.json({ count: 0, rows: [] });
      }
    }
    console.log(where, "where clause for listing DICOM files");
    const rows = await DicomFile.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.json({ count: rows.length, rows });
  } catch (err) {
    console.error("List DICOM files error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}
async function getReportedDicom(req, res){
  const {email} = req.query;
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DicomFile = db.DicomFile;
  
  try {
    const doctorData = await db.sequelize.query(
      `SELECT * FROM doctors WHERE email = ?`,
      {
        replacements: [email],
        type: QueryTypes.SELECT
      }
    );
    
    const doctorID = doctorData.length > 0 ? doctorData[0].id : null;
    
    if (!doctorID) {
      return res.json({
        message: 'Doctor not found with the provided email',
        success: false,
        data: []
      });
    }
    
    const rows = await DicomFile.findAll({
      where: {
        report_forward_to: doctorID
      },
      order: [['createdAt', 'DESC']] // Optional: order by creation date descending
    });
    
    if(rows.length === 0){
      return res.json({
        message: 'No Reported Cases Found',
        success: false,
        data: []
      });
    }
    
    // Return all rows, not just the first one
    const allCases = rows.map(row => row.dataValues);
    
    return res.json({
      message: `Found ${rows.length} reported case(s)`,
      success: true,
      data: allCases
    });
    
  } catch (error) {
    console.error('Error fetching reported DICOM files:', error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error.message
    });
  }
}
async function getDicomRecord(req, res) {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const DicomFile = db.DicomFile;

    const id = req.params.id;
    const rec = await DicomFile.findByPk(id);

    if (!rec) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Check permissions - adjust based on your role setup
    const isAdmin = req.role === "Admin" || req.userRole === "Admin" || req.userRole === "doctor";
    // if (!isAdmin && rec.userId !== req.userId) {
    //   return res.status(403).json({ message: "Forbidden" });
    // }

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
    console.error("Get DICOM record error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

async function getDicomTags(req, res) {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const DicomFile = db.DicomFile;

    const id = req.params.id;
    const rec = await DicomFile.findByPk(id);

    if (!rec) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Check permissions
    console.log(req.role,req.userRole,rec.userId,req.userId, "req.rolereq.userRolerec.userIdreq.userId")
    const isAdmin = req.role === "Admin" || req.userRole === "Admin" || req.userRole === "doctor";
    // if (!isAdmin && rec.userId !== req.userId) {
    //   return res.status(403).json({ message: "Forbidden" });
    // }

    if (!rec.orthancInstanceId) {
      return res.status(400).json({ message: "No orthanc instance id stored" });
    }

    const tags = await orthanc.getInstanceTags(rec.orthancInstanceId);
    return res.json({ tags });
  } catch (err) {
    console.error("Get DICOM tags error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

async function downloadDicom(req, res) {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const DicomFile = db.DicomFile;

    const id = req.params.id;
    const rec = await DicomFile.findByPk(id);

    if (!rec) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (!rec.orthancInstanceId) {
      return res.status(400).json({ message: "No orthanc instance id stored" });
    }

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
    console.error("Download DICOM error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

async function getStudyDetails(req, res) {
  try {
    const studyId = req.params.studyId;

    if (!studyId) {
      return res.status(400).json({ message: "studyId required" });
    }

    const data = await orthanc.getStudy(studyId);
    return res.json({ study: data });
  } catch (err) {
    console.error("Get study details error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

async function findStudies(req, res) {
  try {
    const q = req.body || {};
    const data = await orthanc.searchStudies(q);
    return res.json({ result: data });
  } catch (err) {
    console.error("Find studies error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

async function uploadDicomFileHandler(req, res) {
  let filePath = null;

  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];

  try {
    console.log("Upload request received");

    // Use req.userId (which is set by your auth middleware)
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    filePath = req.file.path;

    // Read file buffer
    const buffer = fs.readFileSync(filePath);
    console.log("File read successfully, size:", buffer.length, "bytes");

    // Upload to Orthanc
    let orthancResp;
    try {
      orthancResp = await orthanc.uploadDicom({
        buffer: buffer,
        useLocal: !!req.body.useLocal,
      });
      console.log("✅ Orthanc upload successful:", orthancResp);
    } catch (uploadError) {
      console.log(uploadError);
      console.error("❌ Orthanc upload failed:", uploadError.message);
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(502).json({
        message: "Failed to upload to Orthanc",
        error: uploadError.message,
      });
    }

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

    const DicomFile = db.DicomFile;

    console.log(req.body.testBookingID, "orthancResp");

    // Save in DB - use req.userId instead of req.user.id
    const rec = await DicomFile.create({
      userId: req.userId,
      patientId: req.body.patientId || null,
      doctorId: req.body.doctorId || null,
      testBookingID: req.body.testBookingID || null,
      consultationId: req.body.consultationId || null,
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
    console.error("Upload error:", err);
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return res
      .status(500)
      .json({ message: "Upload error", error: err.message });
  }
}
async function reportCommentOnDicom(req, res) {
  const { comment, dicom_id,user_id } = req.body;  
  // Validate required fields
  if (!comment || !dicom_id) {
    return res.status(400).json({
      success: false,
      message: 'Comment and DICOM ID are required'
    });
  }
  
  // Validate comment length
  if (comment.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Comment exceeds maximum length of 1000 characters'
    });
  }
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  
  const DicomFile = db.DicomFile;
  
  try {
    // Find and update the DICOM file
    const [updatedRows] = await DicomFile.update(
      { 
        comments: comment.trim(),
        reported_by: user_id, // Assuming user info is in req.user
      },
      { 
        where: { id: dicom_id },
        returning: true // For PostgreSQL, use this to get the updated record
      }
    );
    
    if (updatedRows === 0) {
      return res.json({
        success: false,
        message: 'DICOM file not found'
      });
    }
    
    // Fetch the updated record
    const updatedDicomFile = await DicomFile.findOne({
      where: { id: dicom_id }
    });
    console.log(updatedDicomFile,"updatedDicomFileupdatedDicomFile")
    console.log('Comment saved successfully for DICOM file:', dicom_id);
    return res.json({
      message: 'Comment saved successfully',
      
    });
    
    
  } catch (error) {
    console.error('Error saving comment:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to save comment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}
async function reportForward(req, res) {
  // { dicomId: 7, doctorId: 3, fromDoctor: 1 } reportForwardreportForwardreportForward
  const {dicomId, doctorId,fromDoctor } = req.body;
  if (!doctorId || !dicomId || !fromDoctor) {
    return res.json({
      success: false,
      message: 'toDoctorID,fromDoctorID and DICOM ID are required'
    });
  }
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  
  const DicomFile = db.DicomFile;
  try {
    // Find and update the DICOM file
    const [updatedRows] = await DicomFile.update(
      { 
        report_forward_from: fromDoctor,
        report_forward_to: doctorId, // Assuming user info is in req.user
      },
      { 
        where: { id: dicomId },
        returning: true // For PostgreSQL, use this to get the updated record
      }
    );
    
    if (updatedRows === 0) {
      return res.json({
        success: false,
        message: 'DICOM file not found'
      });
    }
    
    // Fetch the updated record
    const updatedDicomFile = await DicomFile.findOne({
      where: { id: dicomId }
    });
    console.log(updatedDicomFile,"updatedDicomFileupdatedDicomFile")
    console.log('Report forwarded successfully for DICOM file:', dicomId);
    return res.json({
      message: 'Report forwarded successfully for DICOM file:', dicomId,
    });
    
    
  } catch (error) {
    console.error('Error saving Report forwarding:', error);
    
    return res.json({
      success: false,
      message: 'Failed to save Report forwarding',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }

}
// Export all functions
module.exports = {
  listDicomFiles,
  getDicomRecord,
  getDicomTags,
  downloadDicom,
  getStudyDetails,
  findStudies,
  uploadDicomFileHandler,
  upload: upload.single("file"),
  handleMulterError,
  reportCommentOnDicom,
  reportForward,
  getReportedDicom
};
