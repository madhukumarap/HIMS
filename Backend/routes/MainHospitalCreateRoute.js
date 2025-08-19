const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
const db = require("../model/index.model");
const { CreateDatabaseandTables } = require("../model/index.model2");
const { Sequelize } = require('sequelize');
const dbConfig = require("../config/db.config");

router.post("/save-hospital-Main", async (req, res) => {
  console.log("Reg.Body: ", req.body);

  const { hospitalName, currentUrl, allowed_users, allowedUsers, contactPersonName, hospitalEmailId, contactNumber  } = req.body;

  // Handle both naming conventions
  const allowedUsersValue = allowed_users || allowedUsers;

  // Validate allowed_users
  if (!allowedUsersValue || isNaN(allowedUsersValue) || allowedUsersValue < 1) {
    return res.status(400).json({
      message: "Allowed users must be a number greater than 0",
    });
  }
  // Validate contactPersonName
  if (!contactPersonName || typeof contactPersonName !== "string") {
    return res.status(400).json({
      message: "Hospital contact person name is required",
    });
  }
  // Validate hospitalEmailId
  if (!hospitalEmailId || typeof hospitalEmailId !== "string") {
    return res.status(400).json({
      message: "Hospital Email Id is required",
    })
  }
  // Validate hospitalName
  if (!hospitalName || typeof hospitalName !== "string") {
    return res.status(400).json({
      message: "Hospital name is required",
    });
  }

  const newGuid = uuidv4();
  const hospitalNamewithdot = hospitalName.replace(/\s+/g, ".");
  const hospitalNamewithUnderscore = hospitalName.replace(/\s+/g, "_");

  const urlParts = currentUrl.split("mediai/");
  const baseUrl = urlParts.length > 1 ? urlParts[0] + "mediai" : currentUrl;
  const databaseName = `${hospitalNamewithUnderscore}_${newGuid.replace(
    /-/g,
    ""
  )}`;

  try {
    // Check if hospital already exists
    const existingHospital = await db.HospitalMain.findOne({
      where: { name: hospitalNamewithdot.toLowerCase() },
    });

    if (existingHospital) {
      return res.status(400).json({
        message: "Hospital already exists with this name",
      });
    }

    // Check if database already exists
    const existingDatabase = await db.sequelize.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${databaseName.toLowerCase()}'`
    );

    if (existingDatabase[0].length > 0) {
      return res.status(400).json({
        message: "Database already exists",
      });
    }

    // Create new database
    await db.sequelize.query(
      `CREATE DATABASE \`${databaseName.toLowerCase()}\``
    );

    // Initialize new database with tables
    const newdb = CreateDatabaseandTables(
      databaseName.toLowerCase(),
      hospitalNamewithdot
    );

    await waitTwoSeconds();

    // Create hospital in the new database
    await newdb.Hospital.create({
      hospitalName: hospitalName,
      address: "NA",
      city: "NA",
      pincode: 0,
      registrationNo: "NA",
      email: hospitalEmailId,
      hospitalAdminEmail: hospitalEmailId,
      phone: contactNumber,
      HospitalUserName:contactPersonName,
    });

    // Save hospital details in the main database
    const newHospital = await db.HospitalMain.create({
      hospitalName: hospitalName,
      hospitalURL: baseUrl + "/" + hospitalNamewithdot,
      HospitalGUID: newGuid,
      name: hospitalNamewithdot.toLowerCase(),
      databaseName: databaseName.toLowerCase(),
      allowed_users: allowedUsersValue, // Use the extracted value here
    });

    console.log("Hospital created successfully:", newHospital);
    res.status(201).json({
      message: "Hospital created successfully",
      hospital: newHospital,
    });
  } catch (error) {
    console.error("Error creating hospital:", error);

    // Clean up if database was created but other operations failed
    try {
      await db.sequelize.query(
        `DROP DATABASE IF EXISTS \`${databaseName.toLowerCase()}\``
      );
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError);
    }

    res.status(500).json({
      message: "Failed to create hospital",
      error: error.message,
    });
  }
});

async function waitTwoSeconds() {
  return new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });
}
async function fetchDataFromAllHospitalDatabases(hospitals) {
  const allHospitalData = [];
  
  for (const hospital of hospitals) {
    try {
      // Create a new Sequelize instance for this hospital's database
      const hospitalDb = new Sequelize(
        hospital.databaseName,
        dbConfig.USER,
        dbConfig.PASSWORD,
        {
          host: dbConfig.HOST,
          dialect: dbConfig.dialect,
          logging: false, // Disable logging for cleaner output
          pool: {
            max: 1, // Limit connections since we'll have many
            min: 0,
            idle: 10000
          }
        }
      );

      // Test the connection
      await hospitalDb.authenticate();
      console.log(`Connected to ${hospital.databaseName}`);

      const hospitalData = await hospitalDb.query(
        'SELECT * FROM hospitals', 
        { type: Sequelize.QueryTypes.SELECT }
      );

      const enrichedData = {
        hospitalId: hospital.id,
        hospitalName: hospital.hospitalName,
        databaseName: hospital.databaseName,
        data: JSON.stringify(hospitalData)
      };

      allHospitalData.push(enrichedData);

      // Close the connection
      await hospitalDb.close();
    } catch (error) {
      console.error(`Error fetching data from ${hospital.databaseName}:`, error);
      allHospitalData.push({
        hospitalId: hospital.id,
        hospitalName: hospital.hospitalName,
        databaseName: hospital.databaseName,
        error: error.message
      });
    }
  }

  return allHospitalData;
}

// router.get("/get-hospitals", async (req, res) => {
//   try {
//     const hospitals = await db.HospitalMain.findAll();
//     const subHospital = await fetchDataFromAllHospitalDatabases(hospitals);
//     console.log("Sub Hospital Data: ", subHospital);
//     res.status(200).send(hospitals);
//   } catch (error) {
//     console.error("Error fetching hospitals:", error);
//     res.status(500).json({ message: "Failed to fetch hospitals" });
//   }
// });

router.get("/get-hospitals", async (req, res) => {
  try {
    const hospitals = await db.HospitalMain.findAll();
    
    const subHospitals = await fetchDataFromAllHospitalDatabases(hospitals);
    
    const enhancedHospitals = hospitals.map(hospital => {
      const subData = subHospitals.find(sh => sh.hospitalId === hospital.id);
      
      const subDataParsed = typeof subData?.data === 'string' 
        ? JSON.parse(subData.data)[0] 
        : subData?.data?.[0];
      
      return {
        ...hospital.get({ plain: true }), // Convert Sequelize instance to plain object
        phone: subDataParsed?.phone || "NA",
        HospitalUserName: subDataParsed?.HospitalUserName || "NA",
        hospitalEmailId: subDataParsed?.hospitalAdminEmail || "NA"
      };
    });
    
    console.log("Enhanced Hospitals Data: ", enhancedHospitals);
    res.status(200).json(enhancedHospitals);
    
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ 
      message: "Failed to fetch hospitals",
      error: error.message 
    });
  }
});
router.delete("/delete-hospital", async (req, res) =>{
  try{
    const { hospitalId, databaseName } = req.body;
    const result = await db.deleteHospital.deleteHospitalAndDatabase(hospitalId);
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.deletedHospital
    });
  }catch(error){
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hospital',
      error: error.message
    });
  }
})
router.put("/hospitals/:id/allowed-users", async (req, res) => {
  try {
    const { id } = req.params;
    const { allowed_users } = req.body;

    if (!allowed_users || isNaN(allowed_users)) {
      return res.status(400).json({ message: "Invalid allowed users value" });
    }

    const hospital = await db.HospitalMain.findByPk(id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    hospital.allowed_users = allowed_users;
    await hospital.save();

    res.json({ message: "Allowed users updated successfully" });
  } catch (error) {
    console.error("Error updating allowed users:", error);
    res.status(500).json({ message: "Failed to update allowed users" });
  }
});
module.exports = router;
