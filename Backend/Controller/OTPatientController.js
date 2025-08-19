const db = require("../model/index.model.js");
const moment = require("moment");
const otSchedule = db.otSchedule;
const OTNameAndNumber = db.otNameandnumber;
const { getConnectionList } = require("../model/index.model3");

const OTSchedulePatient = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const otSchedule = db.otSchedule;
  const OTNameAndNumber = db.otNameandnumber;
  try {
    console.log(req.body);
    const otDateTime = req.body.otDateTime;
    const UpToOtDateTime = req.body.duration;
    // console.log(UpToOtDateTime)

    const hour = moment(otDateTime).hours();
    const minute = moment(otDateTime).minutes();

    // Change the time of otDateTime
    const newDateTime = moment(otDateTime).set({
      hour: hour,
      minute: minute,
    });

    const formattedDateTime = newDateTime.format("MM/DD/YYYY, hh:mm A");
    req.body.otDateTime = formattedDateTime;

    //UpToOtDate

    const date = moment(otDateTime);
    const updatedDate = date.add(UpToOtDateTime, "minutes");
    const formattedDate = updatedDate.format("MM/DD/YYYY, h:mm A");

    req.body.duration = formattedDate;

    console.log(formattedDate);
    const formData = req.body;
    const { selectedPatient, admissionID, ...scheduleData } = formData;
    const patientId = selectedPatient.patientId;
    const patientName = selectedPatient.patientName.trim();
    const patientContactNumber = selectedPatient.patientContactNumber;

    const newSchedule = await otSchedule.create({
      ...scheduleData,
      patientId,
      admissionID,
      patientName,
      patientContactNumber,
      UpToOtTime: formattedDate,
    });
    console.log("OT schedule saved successfully:", newSchedule.toJSON());
    res.status(200).json({ message: "OT schedule saved successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to save OT schedule." });
  }
};

const getAllOtSheduledPatient = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const otSchedule = db.otSchedule;
  const OTNameAndNumber = db.otNameandnumber;
  try {
    const otpatients = await otSchedule.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(otpatients);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to retrieve OT patients." });
  }
};

const deleteOTData = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const otSchedule = db.otSchedule;
  const OTNameAndNumber = db.otNameandnumber;
  const id = req.params.id; // Assuming the ID is passed as a route parameter

  try {
    const deletedRows = await otSchedule.destroy({
      where: { id: id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "OT schedule not found" });
    }

    return res
      .status(200)
      .json({ message: "OT schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting OT schedule:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const { Op } = require("sequelize");

const UpdateOTData = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const otSchedule = db.otSchedule;
  const OTNameAndNumber = db.otNameandnumber;
  const { id } = req.params;
  const updatedData = req.body;
  console.log(updatedData);
  try {
    // Find the OT record by ID
    const otRecord = await otSchedule.findByPk(id);

    if (!otRecord) {
      return res.status(404).json({ message: "OT record not found" });
    }

    // Update the OT record with the new data
    await otRecord.update(updatedData);

    return res.status(200).json({ message: "OT record updated successfully" });
  } catch (error) {
    console.error("Error updating OT data:", error);
    return res.status(500).json({ message: "Error updating OT data" });
  }
};

const CreateOTNameAndNumber = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const otSchedule = db.otSchedule;
  const OTNameAndNumber = db.otNameandnumber;
  try {
    const { OTName, OTNumber } = req.body;
    const newOTNameAndNumber = await OTNameAndNumber.create({
      OTName,
      OTNumber,
    });
    res.status(200).json(newOTNameAndNumber);
  } catch (error) {
    res.status(500).json({ error: "Failed to create OTNameAndNumber." });
  }
};

const GetListOfOTName = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const otSchedule = db.otSchedule;
  const OTNameAndNumber = db.otNameandnumber;
  try {
    const otNameAndNumbers = await OTNameAndNumber.findAll();
    res.json(otNameAndNumbers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch OTNameAndNumbers." });
  }
};

const DeleteOTNameAndNumber = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const otSchedule = db.otSchedule;
  const OTNameAndNumber = db.otNameandnumber;
  try {
    const { id } = req.params;
    const deletedRowCount = await OTNameAndNumber.destroy({ where: { id } });
    if (deletedRowCount > 0) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "OTNameAndNumber not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete OTNameAndNumber." });
  }
};

const UpdateOtNameAndNumber = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const otSchedule = db.otSchedule;
  const OTNameAndNumber = db.otNameandnumber;
  try {
    const { id } = req.params;
    const { OTName, OTNumber } = req.body;
    const [updatedRowsCount] = await OTNameAndNumber.update(
      { OTName, OTNumber },
      { where: { id } }
    );
    if (updatedRowsCount > 0) {
      res
        .status(200)
        .json({ message: "OTNameAndNumber updated successfully." });
    } else {
      res.status(404).json({ error: "OTNameAndNumber not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update OTNameAndNumber." });
  }
};

module.exports = {
  OTSchedulePatient,
  getAllOtSheduledPatient,
  deleteOTData,
  UpdateOTData,
  UpdateOtNameAndNumber,
  DeleteOTNameAndNumber,
  CreateOTNameAndNumber,
  GetListOfOTName,
};
