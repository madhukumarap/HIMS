const db = require("../model/index.model");

const HospitalRooms = db.HospitalRooms;
const BedsHospitalRoom = db.BedsHospitalRoom;
const { Op } = require("sequelize");
const { getConnectionList } = require("../model/index.model3");

const addRoom = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalRooms = db.HospitalRooms;
  const BedsHospitalRoom = db.BedsHospitalRoom;
  try {
    const { department, name, type, number, status, currency, beds } = req.body;

    // Check if any bed with the same BedNumber already exists
    const existingBed = await BedsHospitalRoom.findOne({
      where: { BedNumber: { [Op.in]: beds.map((bed) => bed.bedNumber) } },
    });

    if (existingBed) {
      return res
        .status(400)
        .send(`BedNumber ${existingBed.BedNumber} already exists.`);
    }
    const totalCost = beds.reduce((sum, bed) => sum + Number(bed.bedPrice), 0);

    const number_of_beds = beds.length;
    const bedCost = number_of_beds > 0 ? totalCost / number_of_beds : 0;

    // Create a new HospitalRooms instance
    const room = new HospitalRooms({
      department,
      name,
      type,
      number,
      number_of_beds,
      currency,
      totalCost,
      bedCost,
      status,
    });

    // Save the room to the database
    const savedRoom = await room.save();

    if (beds && beds.length > 0) {
      const bedsData = beds.map((bed) => ({
        BedNumber: bed.bedNumber,
        BedType: bed.bedType,
        BedPrice: bed.bedPrice,
        HospitalRoomID: savedRoom.id,
        Currency: currency,
        BedStatus: bed.bedStatus,
        HospitalRoomNumber: number,
      }));

      await BedsHospitalRoom.bulkCreate(bedsData);
    }

    res.send(savedRoom);
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).send("Internal Server Error");
  }
};
const editRoom = async (req, res) => {
  try {
    const database = req.headers.userDatabase;
    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const HospitalRooms = db.HospitalRooms;
    const BedsHospitalRoom = db.BedsHospitalRoom;
    const {
      department,
      name,
      type,
      number,
      beds,
      number_of_beds,
      status,
      currency,
      totalCost,
    } = req.body;
    const id = req.params.id;

    const room = await HospitalRooms.findByPk(id);

    if (!room) {
      res.status(400).send({ message: `Could not find room with ID: ${id} ` });
    } else {
      room.department = department;
      room.name = name;
      room.type = type;
      room.number = number;
      room.number_of_beds = beds.length;
      room.status = status;
      room.currency = currency;
      room.totalCost = totalCost;

      // Recalculate bedCost based on the updated totalCost and number_of_beds
      room.bedCost =
        room.number_of_beds > 0 ? totalCost / room.number_of_beds : 0;

      // Remove existing beds associated with the room
      await BedsHospitalRoom.destroy({
        where: { HospitalRoomID: room.id },
      });

      // Add new beds if provided
      if (beds && beds.length > 0) {
        const newBeds = beds.map((bed) => ({
          BedNumber: bed.bedNumber,
          BedType: bed.bedType,
          BedPrice: bed.bedPrice,
          HospitalRoomID: room.id,
          BedStatus: bed.bedStatus,
          Currency: currency,
          HospitalRoomNumber: number,
        }));

        await BedsHospitalRoom.bulkCreate(newBeds);
      }

      const updated = await room.save();
      res.send(updated);
    }
  } catch (error) {
    console.error("Error editing room:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteRoom = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalRooms = db.HospitalRooms;
  const BedsHospitalRoom = db.BedsHospitalRoom;
  const id = req.params.id;

  const room = await HospitalRooms.findByPk(id);

  if (!room) {
    res.status(400).send({ message: "Room not found" });
  } else {
    await room.destroy();
    res.send({ message: "Room deleted successfully" });
  }
};

const getAllRooms = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalRooms = db.HospitalRooms;
  const BedsHospitalRoom = db.BedsHospitalRoom;
  try {
    const rooms = await HospitalRooms.findAll();

    // Fetch beds for each room
    const roomsWithBeds = await Promise.all(
      rooms.map(async (room) => {
        const beds = await BedsHospitalRoom.findAll({
          where: { HospitalRoomID: room.id },
        });

        // Extract bed information
        const bedDetails = beds.map((bed) => ({
          bedNumber: bed.BedNumber,
          bedType: bed.BedType,
          bedPrice: bed.BedPrice,
          BedStatus: bed.BedStatus,
        }));

        // Combine room and bed information
        return {
          id: room.id,
          department: room.department,
          name: room.name,
          type: room.type,
          number: room.number,
          createdAt: room.createdAt,
          number_of_beds: room.number_of_beds,
          status: room.status,
          currency: room.currency,
          totalCost: room.totalCost,
          bedCost: room.bedCost,
          beds: bedDetails,
        };
      })
    );

    res.send(roomsWithBeds);
  } catch (error) {
    console.error("Error fetching rooms with beds:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getBedsList = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const HospitalRooms = db.HospitalRooms;
  const BedsHospitalRoom = db.BedsHospitalRoom;
  try {
    // Fetch all beds from the database
    const bedsList = await BedsHospitalRoom.findAll();

    // Return the list of beds as JSON response
    res.json(bedsList);
  } catch (error) {
    console.error("Error getting beds list:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addRoom,
  editRoom,
  deleteRoom,
  getAllRooms,
  getBedsList,
};
