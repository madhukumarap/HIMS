const HospitalAdmission = require("../Controller/HospitalAdmission");

// router
const router = require("express").Router();

router.post(
  "/CreateHospitalAdmission",
  HospitalAdmission.createHospitalAdmission
);

router.get(
  "/getHospitalAdmissionList",
  HospitalAdmission.getAllHospitalAdmissions
);
router.get("/getHospitalBillingData", HospitalAdmission.getAllBillingData);

router.post("/check-bed-availability", HospitalAdmission.checkBedAavailability);
router.post("/getBedsListWithStatus", HospitalAdmission.getBedsListWithStatus);
router.put(
  "/hospitalAdmissions/:admissionId",
  HospitalAdmission.updateHospitalAdmissionById
);
router.post(
  "/UpdateStatus-Of-AdmittedPatient",
  HospitalAdmission.updateAdmittedPatientStatus
);
router.post(
  "/UpdateStatus-Of-Discharge-AdmittedPatient",
  HospitalAdmission.updateAdmittedPatientDischargeDetails
);
router.get(
  "/hospitalAdmissions/:admissionId",
  HospitalAdmission.getHospitalAdmissionById
);
router.post(
  "/updatePayment/:admissionId",
  HospitalAdmission.updatePayment
);
router.get(
  "/totalExpenses/:admissionId",
  HospitalAdmission.totalExpenses
);

router.post(
  "/updateAdmittedPatientDischargeSummary",
  HospitalAdmission.updateAdmittedPatientDischargeSummary
);
router.post(
  "/HospitalAdminSaveTreatmentPlan",
  HospitalAdmission.HospitalAdminSaveTreatmentPlan
);
router.get(
  "/getOnePrescriptionForIn-patient/:admissionID",
  HospitalAdmission.getOnePrescriptionForInPatient
);

module.exports = router;
