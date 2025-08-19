const db = require("../../model/index.model");
const PathologyTest = db.PathologyTest;
const Patient = db.paitentReg;
const BloodSugarForFasting = db.BloodSugarForFasting;

const CreateResultBloodSugarForFastingTest = async (req, res) => {
  try {
    const {
      Urine_Sugar,
      Urine_Acetone,
      Post_Lunch_Blood_Sugar,
      resultDate,
      Remarks,
    } = req.body;

    const newBloodSugarForFasting = await BloodSugarForFasting.create({
      PatientID: req.body.selectedReportData.PatientID,
      TestManagementID: req.body.selectedReportData.TestManagementID,
      PatientTestBookingID: req.body.selectedReportData.id,
      Urine_Sugar,
      Urine_Acetone,
      Post_Lunch_Blood_Sugar,
      resultDate,
      Remarks,
    });

    res.status(201).json({
      message: "Blood Sugar for Fasting data created successfully",
      data: newBloodSugarForFasting,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating Blood Sugar data" });
  }
};

module.exports = {
  CreateResultBloodSugarForFastingTest,
};
