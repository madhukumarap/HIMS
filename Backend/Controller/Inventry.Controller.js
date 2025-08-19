const db = require("../model/index.model.js");
const { Sequelize, DataTypes } = require("sequelize");
const { Op } = require("sequelize");
const { getConnectionList } = require("../model/index.model3");

// post item

const createInventryItem = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Inventory = db.Inventry;
  const DailyQuantityOut = db.dailyQuantityOut;

  try {
    const {
      SKU,
      itemName,
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
    } = req.body;
    console.log("Currency" + Currency);
    //return;
    //

    let item = await Inventory.findOne({where : {batchNo : batchNo}})

    if(item){
      res.status(400).send({message : "Duplicate entry for batch no "+batchNo+""})
    }else{
      const inventoryItem = await Inventory.create({
        SKU,
        itemName,
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
      });
      
      res.status(200).json(inventoryItem);
    }  
  } catch (error) {
    console.error(error);
    
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteInventryById = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Inventory = db.Inventry;
  const DailyQuantityOut = db.dailyQuantityOut;
  try {
    const id = req.params.id;
    // Find inventory item by ID
    const inventoryItem = await Inventory.findOne({ where: { id: id } });
    if (!inventoryItem) {
      return res.status(404).json({ error: "Inventory item not found" });
    }
    // Delete inventory item
    await inventoryItem.destroy();
    res.status(200).json({ success: "Inventory item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllItems = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Inventory = db.Inventry;
  const DailyQuantityOut = db.dailyQuantityOut;
  try {
    const inventoryItems = await Inventory.findAll();
    res.json(inventoryItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateInventryItem = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Inventory = db.Inventry;
  const DailyQuantityOut = db.dailyQuantityOut;
  const id = req.params.id;
  try {
    const inventoryItem = await Inventory.findByPk(id);
    if (!inventoryItem) {
      return res.status(404).json({ error: "Inventory item not found" });
    }
    const updatedItem = await inventoryItem.update(req.body);
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getItemById = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Inventory = db.Inventry;
  const DailyQuantityOut = db.dailyQuantityOut;
  const inventoryItemId = req.params.id;

  try {
    // Find the inventory item by ID
    const inventoryItem = await Inventory.findByPk(inventoryItemId);

    if (!inventoryItem) {
      return res.status(404).json({ error: "Inventory item not found" });
    }

    // Send the inventory item as JSON
    res.json(inventoryItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// const getIfExpiryLessthan7 = async (req, res) => {

//   try {
//     const today = new Date();
//     const nextWeek = new Date();
//     nextWeek.setDate(nextWeek.getDate() + 7);

//     const inventoryItems = await Inventory.findAll({
//       where: Sequelize.literal(`expiryDate >= CURDATE() AND expiryDate < DATE_ADD(CURDATE(), INTERVAL 7 DAY)`),
//       attributes: ['itemName', 'batchNo', 'expiryDate']
//     });

//     res.json(inventoryItems);
//   } catch (error) {
//     console.error('Error fetching inventory items:', error);
//     res.sendStatus(500);
//   }

// }

const getIfExpiryLessthan7 = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Inventory = db.Inventry;
  const DailyQuantityOut = db.dailyQuantityOut;
  const expiryDays = req.params.expiryDays;
  console.log(expiryDays);
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + parseInt(expiryDays)); // Parse the expiryDays value to an integer

    const inventoryItems = await Inventory.findAll({
      where: {
        expiryDate: {
          [Op.gte]: today,
          [Op.lt]: nextWeek,
        },
      },
      attributes: [
        "itemName",
        "composition",
        "batchNo",
        "expiryDate",
        "balanceQuantity",
      ],
    });

    res.json(inventoryItems);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.sendStat;
  }
};

const getIfExpiryMorethan7 = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Inventory = db.Inventry;
  const DailyQuantityOut = db.dailyQuantityOut;
  const { expiryDays } = req.query;

  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + expiryDays);

    const inventoryItems = await Inventory.findAll({
      where: Sequelize.literal(
        `expiryDate >= CURDATE() AND expiryDate > DATE_ADD(CURDATE(), INTERVAL ${expiryDays} DAY)`
      ),
      attributes: [
        "itemName",
        "batchNo",
        "quantityIn",
        "balanceQuantity",
        "unitPrice",
        "Currency",
        "unit",
        "expiryDate",
      ],
    });

    res.json(inventoryItems);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.sendStatus(500);
  }
};

const getmedecindeDispense = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Inventory = db.Inventry;
  const DailyQuantityOut = db.dailyQuantityOut;
  try {
    const { itemName } = req.query;
    const filteredMedicine = await Inventory.findAll({
      where: {
        itemName: {
          [Sequelize.Op.like]: `%${itemName}%`,
        },
      },
    });
    res.json(filteredMedicine);
  } catch (error) {
    console.error("Error searching medicine:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

const Averagedata = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Inventory = db.Inventry;
  const DailyQuantityOut = db.dailyQuantityOut;
  try {
    const results = await DailyQuantityOut.findAll({
      attributes: [
        "ItemName",
        "BatchNumber",
        [Sequelize.literal("SUM(Quantity)"), "TotalQuantityOut"],
        [Sequelize.literal("SUM(Quantity) / 30"), "AverageQuantityOut"],
        [Sequelize.literal("SUM(Quantity) / 7"), "AverageWeeklyQuantityOut"],
      ],
      where: {
        dateOut: {
          [Sequelize.Op.gte]: Sequelize.literal(
            "DATE_SUB(NOW(), INTERVAL 30 DAY)"
          ),
        },
      },
      group: ["ItemName", "BatchNumber"],
      order: ["BatchNumber"],
    });

    // Print the query results on the console
    console.log(results);
    res.send(results);
    // Close the Sequelize connection
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

const getInventoryOutData = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const Inventory = db.Inventry;
  const DailyQuantityOut = db.dailyQuantityOut;
  try {
    const inventoryOutData = await DailyQuantityOut.findAll();
    res.status(200).json(inventoryOutData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllItems,
  getInventoryOutData,
  createInventryItem,
  deleteInventryById,
  updateInventryItem,
  getItemById,
  getIfExpiryLessthan7,
  getmedecindeDispense,
  Averagedata,
  getIfExpiryMorethan7,
};
