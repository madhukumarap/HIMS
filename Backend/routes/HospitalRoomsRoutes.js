const express = require("express");
const HospitalRoomsController = require("../Controller/HospitalRoomsController");

const router = express.Router();

router.post("/add-hospital-room", HospitalRoomsController.addRoom);
router.get("/hospital-rooms", HospitalRoomsController.getAllRooms);
router.post("/hospital-rooms/:id", HospitalRoomsController.editRoom);
router.delete("/hospital-rooms/:id", HospitalRoomsController.deleteRoom);
//get list of beds
router.get("/get-bedsList", HospitalRoomsController.getBedsList);
module.exports = router;
