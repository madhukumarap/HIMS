const db = require("../../model/index.model");
const PathologyTest = db.PathologyTest;
const Patient = db.paitentReg;
const PlateletCountTestModel = db.PlateletCountTestModel;

const CreateResultPlateletCountTest = async (req, res) => {
  try {
    // Parse data from req.body and create a new record
    const { Platelet_Count, Smear_Examination, resultDate, Remarks } = req.body;

    console.log(req.body);
    // return;
    const newBloodSugerForPP = await PlateletCountTestModel.create({
      PatientID: req.body.selectedReportData.PatientID,
      TestManagementID: req.body.selectedReportData.TestManagementID, //need to change
      PatientTestBookingID: req.body.selectedReportData.id,
      Smear_Examination,
      Platelet_Count,
      resultDate,
      Remarks,
    });

    res.status(201).json({
      message: "Blood Sugar data created successfully",
      data: newBloodSugerForPP,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating Blood Sugar data" });
  }
};

module.exports = {
  CreateResultPlateletCountTest,
};
