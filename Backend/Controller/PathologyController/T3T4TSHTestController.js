const db = require("../../model/index.model");
const PathologyTest = db.PathologyTest;
const Patient = db.paitentReg;
const T3T4TSHTestRoute = db.T3T4TSHTestModel;

const CreateResultT3T4TSHTest = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      T3_Tri_iodothyronine,
      T4_Thyroxine,
      TSH_Thyroid_Stimulating_Hormone,
      Remarks,
      selectedReportData,
      resultDate,
    } = req.body;

    console.log(req.body);
    // Create a new record in the T3T4TSHTestModel (assuming this is your Mongoose model)
    const newTestResult = new T3T4TSHTestRoute({
      PatientID: req.body.selectedReportData.PatientID,
      TestManagementID: req.body.selectedReportData.TestManagementID, //need to change
      PatientTestBookingID: req.body.selectedReportData.id,
      T3_Tri_iodothyronine,
      T4_Thyroxine,
      TSH_Thyroid_Stimulating_Hormone,
      Remarks,
      selectedReportData,
      resultDate,
    });

    // Save the new record to the database
    await newTestResult.save();

    // Respond with a success message
    res.status(200).json({ message: "Result saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  CreateResultT3T4TSHTest,
};
