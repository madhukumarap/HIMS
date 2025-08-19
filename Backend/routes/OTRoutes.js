const OTSchedulePatientController = require('../Controller/OTPatientController');

// router
const router = require('express').Router();


router.post("/OTSchedulePatient", OTSchedulePatientController.OTSchedulePatient)
router.get("/getAllOtSheduledPatient", OTSchedulePatientController.getAllOtSheduledPatient)

router.delete("/deleteOTData/:id", OTSchedulePatientController.deleteOTData);

router.put("/UpdateOTData/:id", OTSchedulePatientController.UpdateOTData)


router.post("/OTNameNumberCreate", OTSchedulePatientController.CreateOTNameAndNumber)
router.get("/GetOTNameList", OTSchedulePatientController.GetListOfOTName)

router.delete("/DeleteOTNameNumber/:id", OTSchedulePatientController.DeleteOTNameAndNumber);

router.put("/UpdateOTNameNumber/:id", OTSchedulePatientController.UpdateOtNameAndNumber)


module.exports = router