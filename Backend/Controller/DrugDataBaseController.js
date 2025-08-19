const db = require("../model/index.model");
const AddDrugToDB = db.addDrugToDB;
const AllSubstitute = db.allsubstitute;
const { getConnectionList } = require("../model/index.model3");

const deleteDrugById = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const AddDrugToDB = db.addDrugToDB;
  const AllSubstitute = db.allsubstitute;

  const drugId = req.params.id;

  try {
    // Find the drug by ID in the database
    const drug = await AddDrugToDB.findByPk(drugId);

    if (!drug) {
      return res.status(404).json({
        success: false,
        message: "Drug not found",
      });
    }

    // Delete the drug from the database
    await drug.destroy();

    res.status(200).json({
      success: true,
      message: "Drug deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting drug:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete drug",
    });
  }
};

const addDrug = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const AddDrugToDB = db.addDrugToDB;
  const AllSubstitute = db.allsubstitute;
  try {
    // Get the drug data from the request body
    const {
      medicineName,
      manufacturer,
      saltComposition,
      packaging,
      price,
      storage,
      overview,
      usesBenefits,
      sideEffects,
      howToUse,
      drugWorks,
      safetyAdvice,
      missedDose,
      allSubstitutes,
      quickTips,
      interactionDrugs,
      patientConcerns,
      currency,
    } = req.body;
    console.log(req.body);
    // Create a new Drug model instance with the provided data
    const newDrug = new AddDrugToDB({
      medicineName,
      manufacturer,
      saltComposition,
      packaging,
      price,
      storage,
      overview,
      usesBenefits,
      sideEffects,
      howToUse,
      drugWorks,
      safetyAdvice,
      missedDose,
      Currency: currency,
      quickTips,
      interactionDrugs,
      patientConcerns,
    });

    // Save the new drug to the database
    const savedDrug = await newDrug.save();

    //const allSubstitutes2 = req.body.allSubstitutes;
    const createdSubstitutes = [];
    allSubstitutes.forEach((substitute) => {
      const createdSubstitute = {
        ...substitute,
        medicineId: savedDrug.id,
      };
      createdSubstitutes.push(createdSubstitute);
    });

    const createdSubstitutes2 = await AllSubstitute.bulkCreate(
      createdSubstitutes
    );

    console.log(createdSubstitutes);
    res.status(200).json({
      success: true,
      message: "Drug added successfully",
      data: savedDrug,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add drug",
      error: error.message,
    });
  }
};

const updateDrug = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const AddDrugToDB = db.addDrugToDB;
  const AllSubstitute = db.allsubstitute;
  //console.log(req.body.allSubstitutes);
  //return;
  try {
    const { id } = req.params; // Get the drug ID from the request parameters
    console.log(id);
    // Get the updated drug data from the request body
    const {
      medicineName,
      manufacturer,
      saltComposition,
      packaging,
      price,
      storage,
      overview,
      usesBenefits,
      sideEffects,
      howToUse,
      drugWorks,
      safetyAdvice,
      missedDose,
      currency,
      quickTips,
      interactionDrugs,
      patientConcerns,
    } = req.body;

    // Find the drug by ID in the database
    const drug = await AddDrugToDB.findByPk(id);

    if (!drug) {
      // If the drug is not found, return an error response
      return res.status(404).json({
        success: false,
        message: "Drug not found",
      });
    }

    // Update the drug properties with the new values
    drug.medicineName = medicineName;
    drug.manufacturer = manufacturer;
    drug.saltComposition = saltComposition;
    drug.packaging = packaging;
    drug.price = price;
    drug.storage = storage;
    drug.overview = overview;
    drug.usesBenefits = usesBenefits;
    drug.sideEffects = sideEffects;
    drug.howToUse = howToUse;
    drug.drugWorks = drugWorks;
    drug.safetyAdvice = safetyAdvice;
    drug.missedDose = missedDose;
    drug.quickTips = quickTips;
    drug.interactionDrugs = interactionDrugs;
    drug.patientConcerns = patientConcerns;
    drug.Currency = currency;
    // Save the updated drug to the database
    const updatedDrug = await drug.save();
    const allSubstitutes = req.body.allSubstitutes;
    // Update the associated substitutes if provided
    if (allSubstitutes.length > 0) {
      // Delete existing substitutes for the drug
      await AllSubstitute.destroy({
        where: {
          medicineId: id,
        },
      });

      // Create new substitutes for the drug
      const createdSubstitutes = allSubstitutes.map((substitute) => ({
        ...substitute,
        medicineId: id,
      }));

      await AllSubstitute.bulkCreate(createdSubstitutes);
    }

    res.status(200).json({
      success: true,
      message: "Drug updated successfully",
      data: updatedDrug,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update drug",
      error: error.message,
    });
  }
};

const addDrugSubstitute = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const AddDrugToDB = db.addDrugToDB;
  const AllSubstitute = db.allsubstitute;
  try {
    const drug = req.body.selectedMedicine;
    const allSubstitutes = req.body.allSubstitutes;
    const createdSubstitutes = [];

    for (const substitute of allSubstitutes) {
      const existingSubstitute = await AllSubstitute.findOne({
        where: {
          medicineId: drug.id,
          medicine_Id: substitute.medicine_Id,
        },
      });

      if (existingSubstitute) {
        console.log(
          `Skipping substitute ${substitute.id} as it already exists for drug ${drug.id}`
        );
        continue;
      }

      const createdSubstitute = {
        ...substitute,
        medicineId: drug.id,
      };
      createdSubstitutes.push(createdSubstitute);
    }

    if (createdSubstitutes.length > 0) {
      // await AllSubstitute.destroy({
      //     where: {
      //         medicineId: drug.id
      //     }
      // });

      const createdSubstitutes2 = await AllSubstitute.bulkCreate(
        createdSubstitutes
      );
      console.log(createdSubstitutes2);
    }

    res.status(200).json({
      success: true,
      message: "Drug added successfully",
    });
  } catch (error) {
    // Handle the error here
    console.error("Error while adding drug substitute:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add drug substitute",
      error: error.message,
    });
  }
};

const getAllsubstitute = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const AddDrugToDB = db.addDrugToDB;
  const AllSubstitute = db.allsubstitute;
  try {
    console.log("//////////////////////////////////////////");
    const jwt = require("jsonwebtoken");
    const decodedToken = jwt.decode(req.headers?.authorization);
    console.log(decodedToken);

    const { medicineId } = req.params;

    const medicines = await AllSubstitute.findAll({
      where: {
        medicineId: medicineId,
      },
    });

    // Send the retrieved medicines as the response
    res.json(medicines);
  } catch (error) {
    console.error("Error occurred while finding medicines:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getmedicineInfo = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const AddDrugToDB = db.addDrugToDB;
  const AllSubstitute = db.allsubstitute;
  try {
    const medicineId = req.params.id;

    const medicine = await AddDrugToDB.findByPk(medicineId);

    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    res.json(medicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  updateDrug,
  addDrug,
  addDrugSubstitute,
  deleteDrugById,
  getmedicineInfo,
  getAllsubstitute,
};
