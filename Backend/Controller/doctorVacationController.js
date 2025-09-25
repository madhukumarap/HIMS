const db = require("../model/index.model.js");
const { getConnectionList } = require("../model/index.model3.js");
const moment = require("moment");

const getAllVacations = async (req, res) => {
  console.log("entry to backend");

  const database = req.headers.userDatabase; // this already comes with request
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DoctorVacation = db.doctorVacation; // must exist after model registration

  try {
    if (!DoctorVacation) {
      return res
        .status(500)
        .json({ success: false, error: "Model not registered" });
    }

    const vacations = await DoctorVacation.findAll();
    res.status(200).json({ success: true, vacations });
  } catch (error) {
    console.error("Error fetching vacations:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch vacations." });
  }
};

const createVacation = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DoctorVacation = db.doctorVacation;

  try {
    const { doctorId, doctorEmail, startDate, endDate, reason } = req.body;

    // Convert to Date
    const start = moment(startDate).startOf("day").format("YYYY-MM-DD");
    const end = moment(endDate).endOf("day").format("YYYY-MM-DD");

    // ✅ Check for overlap
    const existing = await DoctorVacation.findOne({
      where: {
        doctorId,
        [db.Sequelize.Op.or]: [
          {
            startDate: { [db.Sequelize.Op.between]: [start, end] },
          },
          {
            endDate: { [db.Sequelize.Op.between]: [start, end] },
          },
          {
            [db.Sequelize.Op.and]: [
              { startDate: { [db.Sequelize.Op.lte]: start } },
              { endDate: { [db.Sequelize.Op.gte]: end } },
            ],
          },
        ],
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already have a vacation during these dates.",
      });
    }

    const vacation = await DoctorVacation.create({
      doctorId,
      doctorEmail,
      startDate: start,
      endDate: end,
      reason,
    });

    res.status(201).json({ success: true, vacation });
  } catch (error) {
    console.error("Error creating vacation:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create vacation." });
  }
};

const updateVacation = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DoctorVacation = db.doctorVacation;

  try {
    const { id } = req.params;
    const { startDate, endDate, reason } = req.body;

    const vacation = await DoctorVacation.findByPk(id);
    if (!vacation) {
      return res
        .status(404)
        .json({ success: false, message: "Vacation not found." });
    }

    const start = startDate ? moment(startDate).toDate() : vacation.startDate;
    const end = endDate ? moment(endDate).toDate() : vacation.endDate;

    // ✅ Check for overlap excluding current record
    const existing = await DoctorVacation.findOne({
      where: {
        doctorId: vacation.doctorId,
        id: { [db.Sequelize.Op.ne]: id },
        [db.Sequelize.Op.or]: [
          {
            startDate: { [db.Sequelize.Op.between]: [start, end] },
          },
          {
            endDate: { [db.Sequelize.Op.between]: [start, end] },
          },
          {
            [db.Sequelize.Op.and]: [
              { startDate: { [db.Sequelize.Op.lte]: start } },
              { endDate: { [db.Sequelize.Op.gte]: end } },
            ],
          },
        ],
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already have a vacation during these dates.",
      });
    }

    vacation.startDate = start;
    vacation.endDate = end;
    vacation.reason = reason || vacation.reason;

    await vacation.save();

    res.status(200).json({ success: true, vacation });
  } catch (error) {
    console.error("Error updating vacation:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to update vacation." });
  }
};

const deleteVacation = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const DoctorVacation = db.doctorVacation;

  try {
    const { id } = req.params;
    const vacation = await DoctorVacation.findByPk(id);
    if (!vacation) {
      return res
        .status(404)
        .json({ success: false, message: "Vacation not found." });
    }

    await vacation.destroy();
    res.status(200).json({ success: true, message: "Vacation deleted." });
  } catch (error) {
    console.error("Error deleting vacation:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to delete vacation." });
  }
};

module.exports = {
  getAllVacations,
  createVacation,
  updateVacation,
  deleteVacation,
};
