const moment = require("moment");
// import controllers inventry
const inventryController = require("../Controller/Inventry.Controller.js");
const db = require("../model/index.model.js");
const { Sequelize, DataTypes } = require("sequelize");
const Inventory = db.Inventry;
const { Op } = require("sequelize");
// router
const router = require("express").Router();
const { getConnectionList } = require("../model/index.model3");

//
router.get("/", (req, res) => {
  res.send("hello");
});
// use routers

//create inventry items

router.post("/createItem", inventryController.createInventryItem);

//put inventry by id
router.put("/inventory/:id", inventryController.updateInventryItem);

router.put("/inventorys/:cellid", (req, res) => {
  console.log(req.body);
});

//get all items
router.get("/getInventryItems", inventryController.getAllItems);

// get by id
router.get("/getInventryItems/:id", inventryController.getItemById);

//delete by id
router.delete("/inventory/:id", inventryController.deleteInventryById);

//get if expiry less than 7
router.get(
  "/getIfExpiryLess-7/:expiryDays",
  inventryController.getIfExpiryLessthan7
);

//get if  expiry more than 7 days
router.get("/getIfExpiryMore-7", inventryController.getIfExpiryMorethan7); //prescriptionId

//search medecine with name
router.get("/getmedecindeDispense", inventryController.getmedecindeDispense);

//despensed data
router.get("/Averagedata", inventryController.Averagedata);

//get Inventory out data
router.get("/getOutData", inventryController.getInventoryOutData);

const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer({ dest: "public/uploads/" });

const csv = require("csv-parser");
const fs = require("fs");

router.post("/UploadInventoryData", upload.single("file"), async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const Inventory = db.Inventry;
    const DailyQuantityOut = db.dailyQuantityOut;
    // Access the uploaded file using req.file
    const file = req.file;
    console.log(file);

    // Process the file and save the data to the database
    const results = [];

    fs.createReadStream(file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        console.log(results);

        for (const result of results) {
          const {
            SKU,
            itemName = medicineName,
            composition,
            description,
            batchNo,
            expiryDate,
            unitPrice,
            unit,
            dateIn,
            quantityIn,
            dateOut,
            quantityOut,
            balanceQuantity,
            Currency,
          } = result;

          // Check if an inventory item with the given batch number already exists
          const existingInventoryItem = await Inventory.findOne({
            where: { batchNo },
          });
          if (existingInventoryItem) {
            console.log(
              `Inventory item with batch number ${batchNo} already exists. Skipping...`
            );
            continue; // Skip to the next iteration
          }
          const existingInventoryItemName = await Inventory.findOne({
            where: { itemName },
          });
          if (existingInventoryItem) {
            console.log(
              `Inventory item with Medicine Name ${itemName} already exists. Skipping...`
            );
            continue; // Skip to the next iteration
          }

          const formattedExpiryDate = moment(expiryDate, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          );
          const formattedDateIn = moment(dateIn, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          );

          // Create a new inventory item
          const inventoryItem = await Inventory.create({
            SKU,
            itemName,
            composition,
            description,
            batchNo,
            expiryDate: formattedExpiryDate,
            unitPrice,
            unit,
            dateIn: formattedDateIn,
            quantityIn,
            dateOut,
            quantityOut: "0",
            balanceQuantity: quantityIn,
            Currency: req.body.BaseCurrency,
          });

          console.log(inventoryItem);
        }

        // Send a success response
        res.status(200).json({ message: "Inventory items saved successfully" });
      });
  } catch (error) {
    // Handle any errors
    console.error("Error saving inventory items:", error);
    res
      .status(500)
      .json({ message: "An error occurred while saving the inventory items" });
  }
});

module.exports = router;
