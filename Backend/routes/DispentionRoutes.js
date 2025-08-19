// import controllers inventry
const dispentionController = require("../Controller/DispentionController");
const db = require("../model/index.model.js");
const DispentionReport = db.dispensedReport;
const { Sequelize, DataTypes } = require("sequelize");
const Inventory = db.Inventry;
const { Op } = require("sequelize");
const DispensedMedicine = db.dispensedMedicine;
const DailyQuantityOutReport = db.dailyQuantityOut;
const fs = require("fs");
const cors = require("cors");
const { getConnectionList } = require("../model/index.model3");
// router
const router = require("express").Router();

//post dispensed data
router.post("/saveDispensedData", dispentionController.saveDispensedData);

//
router.get(
  "/GetDispensedListOfPr/:id",
  dispentionController.GetDispensedListOfPr
);
//get list
router.get("/findAllDispensedList", dispentionController.findAllDispensedList);

//get one dispensed patient with all his medicine
router.get(
  "/findOneDispensedList/:id",
  dispentionController.findOneDispensedList
);

//
router.post("/saveDispensedDatas", dispentionController.medicindeAdminReport);

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/saveDispensedDataOutside",
  upload.single("prescriptionImage"),
  async (req, res) => {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const DispensedMedicine = db.dispensedMedicine;
    const DailyQuantityOutReport = db.dailyQuantityOut;
    const Inventory = db.Inventry;
    const DispentionReport = db.dispensedReport;

    try {
      const {
        patientName,
        patientContact,
        doctorName,
        doctorRegNo,
        dispenseID,
        totalMedicineAmount,
        hospitalName,
        prescriptionDate,
        prescriptionType,
        TotalFees,
        Currency,
      } = req.body;

      const prescriptionImage = req.file;
      console.log(req.body);
      //return;
      let prescriptionImageBuffer = null;

      if (prescriptionImage) {
        prescriptionImageBuffer = await fs.promises.readFile(
          prescriptionImage.path
        );
      } else {
        console.log("Image file does not exist.");
      }

      console.log(
        " req.body.totalMedicineAmount: ",
        req.body.totalMedicineAmount[0]
      );
      //return;
      const savedDispensedData = await DispentionReport.create({
        PatientName: patientName,
        PatientContactNumber: patientContact,
        totalMedicineAmount: req.body.totalMedicineAmount[0],
        DispenseID: "DID" + req.body.dispenseID,
        PriscribedDoctor: doctorName,
        DoctorRegNo: doctorRegNo,
        // totalMedicineAmount,
        patient_Id: "0",
        doctor_Id: "0",
        prescription_Id: "0",
        PrescriptionID: "0",
        HospitalName: hospitalName,
        PrescriptionDate: prescriptionDate,
        PrescriptionType: "Outside-Hospital",
        prescriptionImage: prescriptionImageBuffer,
        TotalFees,
        Currency,
      });
      const ordersString = req.body.orders;
      const orders = JSON.parse(ordersString); //return;
      //update prescription status

      // Save each order separately
      for (const order of orders) {
        const { itemName, unitPrice, Currency, batchNo, expiryDate } =
          order.item;
        console.log(order.item);
        console.log(order.quantity);

        const eachmedicineCost = unitPrice * order.quantity;

        const bulkData = {
          MedicineName: itemName,
          UnitPrice: unitPrice,
          BatchNumber: batchNo,
          ExpiryDate: expiryDate,
          Quantity: order.quantity,
          EachmedicineCost: eachmedicineCost,
          EachMedicineCurrency: Currency,
          PatientName: savedDispensedData.PatientName,
          DispenseTableID: savedDispensedData.id,
          prescription_Id: "0",
          DispenseID: savedDispensedData.DispenseID,
          patient_Id: "0",
        };

        // Adjust inventory after dispensing medicine
        try {
          const row = await Inventory.findOne({
            where: { batchNo: bulkData.BatchNumber },
          });
          if (row) {
            row.balanceQuantity = row.balanceQuantity - bulkData.Quantity;
            row.quantityOut = row.quantityOut + bulkData.Quantity;
            await row.save();
            console.log("Row updated successfully.");
          } else {
            console.log("Row not found.");
          }
        } catch (error) {
          console.error("Error updating row:", error);
        }

        await DispensedMedicine.create(bulkData);
      }
      console.log(
        "//////////////////////////////////2///////////////////////////////////"
      );

      // Update the DailyQuantityOutReport table
      for (const order of orders) {
        const { itemName, batchNo, expiryDate } = order.item;
        const quantity = order.quantity;

        const existingQuantityOut = await DailyQuantityOutReport.findOne({
          where: {
            BatchNumber: batchNo,
            dateOut: new Date().toISOString().split("T")[0], // Today's date
          },
        });

        if (existingQuantityOut) {
          // Update the quantity if the batchNo and date combination exists
          existingQuantityOut.Quantity += quantity;
          await existingQuantityOut.save();

          const averageMonthlyQuantityOut =
            await DailyQuantityOutReport.findOne({
              attributes: [
                [
                  Sequelize.literal("SUM(Quantity) / 30"),
                  "AverageMonthlyQuantityOut",
                ],
              ],
              where: {
                BatchNumber: batchNo,
                dateOut: {
                  [Sequelize.Op.gte]: Sequelize.literal(
                    "DATE_SUB(NOW(), INTERVAL 30 DAY)"
                  ),
                },
              },
            });

          const averageWeeklyQuantityOut = await DailyQuantityOutReport.findOne(
            {
              attributes: [
                [
                  Sequelize.literal("SUM(Quantity)/7 "),
                  "AverageWeeklyQuantityOut",
                ],
              ],
              where: {
                BatchNumber: batchNo,
                dateOut: {
                  [Sequelize.Op.gte]: Sequelize.literal(
                    "DATE_SUB(NOW(), INTERVAL 7 DAY)"
                  ),
                },
              },
            }
          );

          // Access the calculated values
          const averageMonthlyQuantity = averageMonthlyQuantityOut.getDataValue(
            "AverageMonthlyQuantityOut"
          );
          const averageWeeklyQuantity = averageWeeklyQuantityOut.getDataValue(
            "AverageWeeklyQuantityOut"
          );
          console.log(
            averageMonthlyQuantity + "  TO  " + averageWeeklyQuantity
          );

          // Update the record in the database with the calculated values
          existingQuantityOut.AverageMonthlyQuantityOut =
            averageMonthlyQuantity;
          existingQuantityOut.AverageWeeklyQuantityOut = averageWeeklyQuantity;
          await existingQuantityOut.save();
          console.log(
            "//////////////////////////////////3///////////////////////////////////"
          );

          const inventoryRecord = await Inventory.findOne({
            where: {
              batchNo: batchNo,
            },
          });

          if (inventoryRecord) {
            // Calculate AverageMonthlyQuantityOut and AverageWeeklyQuantityOut

            // Update the record in the database with the calculated values
            inventoryRecord.AverageMonthlyQuantityOut = averageMonthlyQuantity;
            inventoryRecord.AverageWeeklyQuantityOut = averageWeeklyQuantity;
            inventoryRecord.dateOut = new Date().toISOString().split("T")[0];
            console.log(
              "now" +
                inventoryRecord.AverageMonthlyQuantityOut +
                " " +
                inventoryRecord.AverageWeeklyQuantityOut
            );
            await inventoryRecord.save();

            // console.log('AverageWeeklyQuantityOut:', averageWeeklyQuantity);
          } else {
            console.log("Inventory record not found.");
          }
        } else {
          // Create a new record if the batchNo and date combination is not found
          const newQuantityOut = await DailyQuantityOutReport.create({
            ItemName: itemName,
            BatchNumber: batchNo,
            ExpiryDate: expiryDate,
            UnitPrice: order.unitPrice,
            Quantity: quantity,
            dateOut: new Date().toISOString().split("T")[0], // Today's date
          });

          // Calculate AverageMonthlyQuantityOut and AverageWeeklyQuantityOut for the newly created record
          const averageMonthlyQuantityOut =
            await DailyQuantityOutReport.findOne({
              attributes: [
                [
                  Sequelize.literal("SUM(Quantity) / 30"),
                  "AverageMonthlyQuantityOut",
                ],
              ],
              where: {
                BatchNumber: batchNo,
                dateOut: {
                  [Sequelize.Op.gte]: Sequelize.literal(
                    "DATE_SUB(NOW(), INTERVAL 30 DAY)"
                  ),
                },
              },
            });

          const averageWeeklyQuantityOut = await DailyQuantityOutReport.findOne(
            {
              attributes: [
                [
                  Sequelize.literal("SUM(Quantity) /7"),
                  "AverageWeeklyQuantityOut",
                ],
              ],
              where: {
                BatchNumber: batchNo,
                dateOut: {
                  [Sequelize.Op.gte]: Sequelize.literal(
                    "DATE_SUB(NOW(), INTERVAL 7 DAY)"
                  ),
                },
              },
            }
          );

          // Access the calculated values
          const averageMonthlyQuantity = averageMonthlyQuantityOut.getDataValue(
            "AverageMonthlyQuantityOut"
          );
          const averageWeeklyQuantity = averageWeeklyQuantityOut.getDataValue(
            "AverageWeeklyQuantityOut"
          );
          console.log(
            averageMonthlyQuantity + "  TO  " + averageWeeklyQuantity
          );

          newQuantityOut.AverageMonthlyQuantityOut = averageMonthlyQuantity;
          newQuantityOut.AverageWeeklyQuantityOut = averageWeeklyQuantity;
          await newQuantityOut.save();
          console.log(
            "//////////////////////////////////4///////////////////////////////////"
          );

          // console.log('Created new record:');
          // console.log('AverageMonthlyQuantityOut:', averageMonthlyQuantity);
          // console.log('AverageWeeklyQuantityOut:', averageWeeklyQuantity);

          const inventoryRecord = await Inventory.findOne({
            where: {
              batchNo: batchNo,
            },
          });

          if (inventoryRecord) {
            // Calculate AverageMonthlyQuantityOut and AverageWeeklyQuantityOut

            // Access the calculated values
            //   const averageMonthlyQuantity = averageMonthlyQuantityOut.getDataValue('AverageMonthlyQuantityOut');
            //  const averageWeeklyQuantity = averageWeeklyQuantityOut.getDataValue('AverageWeeklyQuantityOut');

            // Update the record in the database with the calculated values
            inventoryRecord.AverageMonthlyQuantityOut = averageMonthlyQuantity;
            inventoryRecord.AverageWeeklyQuantityOut = averageWeeklyQuantity;
            inventoryRecord.dateOut = new Date().toISOString().split("T")[0];
            await inventoryRecord.save();

            // console.log('Updated inventory record:');
            // console.log('AverageMonthlyQuantityOut:', averageMonthlyQuantity);
            // console.log('AverageWeeklyQuantityOut:', averageWeeklyQuantity);
          } else {
            console.log("Inventory record not found.");
          }
        }
      }
      console.log(
        "//////////////////////////////////Last///////////////////////////////////"
      );
      res.status(200).json("success");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
