const db = require("../../model/index.model");
const PathologyTest = db.PathologyTest;
const Patient = db.paitentReg;
const BloodSugerForPP = db.BloodSugerForPP;

const CreateResultBloodSugarPPTest = async (req, res) => {
  try {
    // Parse data from req.body and create a new record
    const {
      Chloride,
      Colour,
      Quantity,
      Appearance,
      Coagulum,
      Blood,
      Proteins,
      Total_W_B_C_Count,
      Polymorphs,
      Lymphocytes,
      RBC_S,
      Z_N_Stain,
      Cram_s_Smear,
      Sugar,
      resultDate,
      Remarks,
    } = req.body;

    console.log(req.body);
    // return;
    const newBloodSugerForPP = await BloodSugerForPP.create({
      PatientID: req.body.selectedReportData.PatientID,
      TestManagementID: req.body.selectedReportData.TestManagementID, //need to change
      PatientTestBookingID: req.body.selectedReportData.id,
      Chloride,
      Colour,
      Quantity,
      Appearance,
      Coagulum,
      Blood,
      Proteins,
      Total_W_B_C_Count,
      Polymorphs,
      Lymphocytes,
      RBC_S,
      Z_N_Stain,
      Cram_s_Smear,
      Sugar,
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
  CreateResultBloodSugarPPTest,
};
