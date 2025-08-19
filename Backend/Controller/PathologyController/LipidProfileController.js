const db = require("../../model/index.model");
const PathologyTest = db.PathologyTest;
const Patient = db.paitentReg;
const LipidProfileModel = db.LipidProfileModel;

const CreateResultLipidProfileTest = async (req, res) => {
  try {
    // Parse data from req.body and create a new record
    const {
      Sr_Cholesterol,
      HDL_Cholesterol,
      Sr_Triglycerides,
      LDL_Cholesterol,
      VLDL,
      Cholesterol_HDL,
      LDL_HDL,
      resultDate,
      Remarks,
    } = req.body;
    console.log("LipidProfileResult: " + req.body);
    const newLipidProfile = await LipidProfileModel.create({
      PatientID: req.body.selectedReportData.PatientID,
      TestManagementID: req.body.selectedReportData.TestManagementID, //need to change
      PatientTestBookingID: req.body.selectedReportData.id,
      Sr_Cholesterol,
      HDL_Cholesterol,
      Sr_Triglycerides,
      LDL_Cholesterol,
      VLDL,
      Cholesterol_HDL,
      LDL_HDL,
      resultDate,
      Remarks,
    });

    res.status(201).json({
      message: "Lipid Profile data created successfully",
      data: newLipidProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while creating Lipid Profile data",
    });
  }
};

module.exports = {
  CreateResultLipidProfileTest,
};
