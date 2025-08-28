const db = require("../model/index.model.js");
const DispentionReport = db.dispensedReport;
const { Sequelize, DataTypes } = require("sequelize");
const Inventory = db.Inventry;
const { Op } = require("sequelize");
const DispensedMedicine = db.dispensedMedicine;
const adminReport = db.medicineAdmin;
const DailyQuantityOutReport = db.dailyQuantityOut;
const PaisentPrescription = db.paisentprescription;
const { getConnectionList } = require("../model/index.model3");

const GetDispensedListOfPr = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DispensedMedicine = db.dispensedMedicine;
  const DailyQuantityOutReport = db.dailyQuantityOut;
  const Inventory = db.Inventry;
  const DispentionReport = db.dispensedReport;
  const PaisentPrescription = db.paisentprescription;
  const adminReport = db.medicineAdmin;
  try {
    const prescriptionId = req.params.id;
    const data = await DispentionReport.findAll({
      where: {
        prescription_Id: prescriptionId,
      },
    });
    console.log(data,"medicine data")
    const lastDispenseData = data;
    const dispenseTableId = req.params.dispenseTableId;
    const patId = lastDispenseData && lastDispenseData.length > 0 ? lastDispenseData[0].prescription_Id : prescriptionId;
    console.log(patId,"patIdpatIdpatIdpatId")
    const data2 = await DispensedMedicine.findAll({
      where: {
        patient_Id: patId,
      },
    });

    res.status(200).json(data2);
  } catch (error) {
    console.error("Error while retrieving data by prescription ID:", error);
    res.status(500).json({
      message: "Failed to retrieve data",
      error: error.message,
    });
  }
};

const saveDispensedData = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DispensedMedicine = db.dispensedMedicine;
  const DailyQuantityOutReport = db.dailyQuantityOut;
  const Inventory = db.Inventry;
  const DispentionReport = db.dispensedReport;
  const PaisentPrescription = db.paisentprescription;
  const adminReport = db.medicineAdmin;
  try {
    const patientData = req.body.patientData;
    const {
      PatientName,
      patient_Id,
      doctor_Id,
      id,
      createdAt,
      PrescribedDoctor,
      RegistrationNo,
    } = patientData;
    const orders = req.body.orders;
    console.log("Orders----: " + JSON.stringify(orders));
    //  return;
    const savedDispensedData = await DispentionReport.create({
      PatientName,
      patient_Id,
      doctor_Id,
      totalMedicineAmount: req.body.totalMedicineAmount,
      DispenseID: req.body.dispenseID,
      prescription_Id: id,
      PrescriptionID: patientData.prescriptionId,
      PrescriptionDate: createdAt,
      PrescriptionType: "In-Hospital",
      PriscribedDoctor: PrescribedDoctor,
      Currency: req.body.Currency,
      TotalFees: req.body.TotalFees,
      DoctorRegNo: RegistrationNo,
    });

    //update prescription status
    const [updatedRows] = await PaisentPrescription.update(
      { status: 1 },
      { where: { id: id, status: 0 }, returning: true }
    );

    if (updatedRows > 0) {
      // Fetch the updated prescription to get the new status value
      const updatedPrescription = await PaisentPrescription.findByPk(id);

      // Print the updated status on the console
      console.log(`Updated status: ${updatedPrescription.status}`);
    } else {
      console.log("No rows were updated.");
    }

    // Save each order separately
    for (const order of orders) {
      const { itemName, unitPrice, Currency, batchNo, expiryDate } = order.item;
      console.log(order);
      console.log(order.quantity);

      //update prescription table dispense quantity
      const prescription = await PaisentPrescription.findByPk(id);
      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" });
      }

      const currentQuantity = prescription.DispensedMedicineQuantity || 0;
      const updatedQuantity = currentQuantity + order.quantity;
      prescription.DispensedMedicineQuantity = updatedQuantity;

      await prescription.save();

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
        prescription_Id: savedDispensedData.prescription_Id,
        DispenseID: savedDispensedData.DispenseID,
        patient_Id: savedDispensedData.patient_Id,
      };
      console.log("bathcnumber ",bulkData.BatchNumber)
      // Adjust inventory after dispensing medicine
      try {
        const row = await Inventory.findOne({
          where: { batchNo: bulkData.BatchNumber },
        });
        console.log("Row found:", row);
        if (row) {
          row.balanceQuantity = row.balanceQuantity - bulkData.Quantity;
          row.quantityOut = row.quantityOut + bulkData.Quantity;
          await row.save();
          console.log(row,"updated row")
          console.log("Row updated successfully.");
        } else {
          console.log("Row not found.");
        }
      } catch (error) {
        console.error("Error updating row:", error);
      }

      await DispensedMedicine.create(bulkData);
    }

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

      // Calculate AverageMonthlyQuantityOut and AverageWeeklyQuantityOut
      // const averageMonthlyQuantityOut = await DailyQuantityOutReport.findOne({
      //     attributes: [
      //         [Sequelize.literal('SUM(Quantity) / 30'), 'AverageMonthlyQuantityOut'],
      //     ],
      //     where: {
      //         BatchNumber: batchNo,
      //         dateOut: {
      //             [Sequelize.Op.gte]: Sequelize.literal('DATE_SUB(NOW(), INTERVAL 30 DAY)'),
      //         },
      //     },
      // });

      // const averageWeeklyQuantityOut = await DailyQuantityOutReport.findOne({
      //     attributes: [
      //         [Sequelize.literal('SUM(Quantity) '), 'AverageWeeklyQuantityOut'],
      //     ],
      //     where: {
      //         BatchNumber: batchNo,
      //         dateOut: {
      //             [Sequelize.Op.gte]: Sequelize.literal('DATE_SUB(NOW(), INTERVAL 7 DAY)'),
      //         },
      //     },
      // });

      // // Access the calculated values
      // const averageMonthlyQuantity = averageMonthlyQuantityOut.getDataValue('AverageMonthlyQuantityOut');
      // const averageWeeklyQuantity = averageWeeklyQuantityOut.getDataValue('AverageWeeklyQuantityOut');
      // console.log(averageMonthlyQuantity + "  TO  " + averageWeeklyQuantity)

      if (existingQuantityOut) {
        // Update the quantity if the batchNo and date combination exists
        existingQuantityOut.Quantity += quantity;
        await existingQuantityOut.save();

        const averageMonthlyQuantityOut = await DailyQuantityOutReport.findOne({
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

        const averageWeeklyQuantityOut = await DailyQuantityOutReport.findOne({
          attributes: [
            [Sequelize.literal("SUM(Quantity)/7 "), "AverageWeeklyQuantityOut"],
          ],
          where: {
            BatchNumber: batchNo,
            dateOut: {
              [Sequelize.Op.gte]: Sequelize.literal(
                "DATE_SUB(NOW(), INTERVAL 7 DAY)"
              ),
            },
          },
        });

        // Access the calculated values
        const averageMonthlyQuantity = averageMonthlyQuantityOut.getDataValue(
          "AverageMonthlyQuantityOut"
        );
        const averageWeeklyQuantity = averageWeeklyQuantityOut.getDataValue(
          "AverageWeeklyQuantityOut"
        );
        console.log(averageMonthlyQuantity + "  TO  " + averageWeeklyQuantity);

        // Update the record in the database with the calculated values
        existingQuantityOut.AverageMonthlyQuantityOut = averageMonthlyQuantity;
        existingQuantityOut.AverageWeeklyQuantityOut = averageWeeklyQuantity;
        await existingQuantityOut.save();

        // console.log('Updated existing record:');
        // console.log('AverageMonthlyQuantityOut:', averageMonthlyQuantity);
        // console.log('AverageWeeklyQuantityOut:', averageWeeklyQuantity);

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

          // console.log('Updated inventory record:');
          // console.log('AverageMonthlyQuantityOut:', averageMonthlyQuantity);
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
        const averageMonthlyQuantityOut = await DailyQuantityOutReport.findOne({
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

        const averageWeeklyQuantityOut = await DailyQuantityOutReport.findOne({
          attributes: [
            [Sequelize.literal("SUM(Quantity) /7"), "AverageWeeklyQuantityOut"],
          ],
          where: {
            BatchNumber: batchNo,
            dateOut: {
              [Sequelize.Op.gte]: Sequelize.literal(
                "DATE_SUB(NOW(), INTERVAL 7 DAY)"
              ),
            },
          },
        });

        // Access the calculated values
        const averageMonthlyQuantity = averageMonthlyQuantityOut.getDataValue(
          "AverageMonthlyQuantityOut"
        );
        const averageWeeklyQuantity = averageWeeklyQuantityOut.getDataValue(
          "AverageWeeklyQuantityOut"
        );
        console.log(averageMonthlyQuantity + "  TO  " + averageWeeklyQuantity);

        // Access the calculated values
        // const averageMonthlyQuantity = averageMonthlyQuantityOut.getDataValue('AverageMonthlyQuantityOut');
        // const averageWeeklyQuantity = averageWeeklyQuantityOut.getDataValue('AverageWeeklyQuantityOut');

        // Update the newly created record in the database with the calculated values
        newQuantityOut.AverageMonthlyQuantityOut = averageMonthlyQuantity;
        newQuantityOut.AverageWeeklyQuantityOut = averageWeeklyQuantity;
        await newQuantityOut.save();

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

    res.status(200).json("success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const findAllDispensedList = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DispensedMedicine = db.dispensedMedicine;
  const DailyQuantityOutReport = db.dailyQuantityOut;
  const Inventory = db.Inventry;
  const DispentionReport = db.dispensedReport;
  const PaisentPrescription = db.paisentprescription;
  const adminReport = db.medicineAdmin;
  try {
    const dispensedReports = await DispentionReport.findAll({
      attributes: [
        "id",
        "PatientName",
        "patient_Id",
        "doctor_Id",
        "DispenseID",
        "prescription_Id",
        "PrescriptionID",
        "PrescriptionDate",
        "PriscribedDoctor",
        "PrescriptionType",
        "prescriptionImage",
        "DoctorRegNo",
        "totalMedicineAmount",
        "Currency",
        "TotalFees",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    const reportsWithImages = await Promise.all(
      dispensedReports.map(async (report) => {
        const imageBuffer = report?.prescriptionImage;
        const imageBase64 = imageBuffer?.toString("base64");

        return {
          ...report.toJSON(),
          prescriptionImage: imageBase64,
        };
      })
    );

    res.status(200).json(reportsWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const findOneDispensedList = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DispensedMedicine = db.dispensedMedicine;
  const DailyQuantityOutReport = db.dailyQuantityOut;
  const Inventory = db.Inventry;
  const DispentionReport = db.dispensedReport;
  const PaisentPrescription = db.paisentprescription;
  const adminReport = db.medicineAdmin;
  const dispensedReportId = req.params.id; // Assuming the dispensed report ID is passed as a parameter

  try {
    const dispensedReport = await DispentionReport.findOne({
      where: { id: dispensedReportId },
      include: { model: DispensedMedicine, as: "dispensedmedicines" },
    });

    if (!dispensedReport) {
      return res.status(404).json({ error: "Dispensed report not found" });
    }

    res.status(200).json(dispensedReport);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the dispensed report" });
  }
};

const medicindeAdminReport = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DispensedMedicine = db.dispensedMedicine;
  const DailyQuantityOutReport = db.dailyQuantityOut;
  const Inventory = db.Inventry;
  const DispentionReport = db.dispensedReport;
  const PaisentPrescription = db.paisentprescription;
  const adminReport = db.medicineAdmin;
  try {
    const patientData = req.body.patientData;
    const {
      PatientName,
      patient_Id,
      doctor_Id,
      id,
      createdAt,
      PrescribedDoctor,
      RegistrationNo,
    } = patientData;

    const savedDispensedData = {
      PatientName,
      patient_Id,
      doctor_Id,
      totalMedicineAmount: req.body.totalMedicineAmount,
      DispenseID: req.body.dispenseID,
      prescription_Id: id,
      PrescriptionID: patientData.prescriptionId,
      PrescriptionDate: createdAt,
      PriscribedDoctor: PrescribedDoctor,
      DoctorRegNo: RegistrationNo,
    };

    try {
      const orders = req.body.orders;

      // Save each order separately
      for (const order of orders) {
        const { itemName, unitPrice, Unit, expiryDate } = order.item;

        const bulkData = {
          DispeningId: savedDispensedData.DispenseID,
          DispensationDate: new Date(),
          MedicineName: itemName,
          Quantity: order.quantity,
          Unit: order.item.unit,
          PrescriptionId: savedDispensedData.PrescriptionID,
          PrescriptionDate: savedDispensedData.PrescriptionDate,
          PrescribedDoctor: savedDispensedData.PriscribedDoctor,
          PatientName: savedDispensedData.PatientName,
          PatientId: savedDispensedData.patient_Id,
        };

        console.log(bulkData);

        await adminReport.create(bulkData);
      }

      res.status(200).json("success");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while saving the data." });
  }
};

module.exports = {
  GetDispensedListOfPr,
  saveDispensedData,
  findAllDispensedList,
  findOneDispensedList,
  medicindeAdminReport,
};
