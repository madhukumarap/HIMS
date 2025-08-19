const db = require("../model/index.model.js");
const PathologyTestReferral = db.PathologyTestReferral;
const PathologyTestPatient = db.PathologyTest;
const Doctor = db.doctor;
const { Op } = require("sequelize"); // Import Op from Sequelize
const PathologyTest = db.PathologyTest;

const createPathologyTestReferral = async (req, res) => {
  try {
    const { doctor, patient, bookingDate, formData, bookingTime, remarks } =
      req.body;
    console.log(req.body);
    // return;
    const fetchedPatient = await PathologyTestPatient.findByPk(patient);
    const fetchedDoctor = await Doctor.findByPk(doctor);
    const booking = await PathologyTest.findByPk(patient);

    // console.log(booking);
    // return;
    if (!fetchedPatient || !fetchedDoctor) {
      return res
        .status(404)
        .json({ success: false, error: "Patient or doctor not found" });
    }

    console.log(bookingDate + " " + bookingTime);
    const existingReferral = await PathologyTestReferral.findOne({
      where: {
        bookingDate,
        bookingTime,
      },
    });

    console.log(existingReferral);
    if (existingReferral) {
      console.log("Already present booking");
      res.status(400).json({
        success: false,
        error: "Referral with same date and time already exists",
      });
    }

    const referral = await PathologyTestReferral.create({
      doctorId: doctor,
      PatientName: fetchedPatient.PatientName,
      PatientPhone: fetchedPatient.PatientPhoneNo,
      DoctorName:
        "Dr " +
        fetchedDoctor.FirstName +
        " " +
        fetchedDoctor.MiddleName +
        " " +
        fetchedDoctor.LastName,
      DoctorPhone: fetchedDoctor.phoneNo,
      patientId: patient,
      bookingDate,
      bookingTime,
      commissionType: formData.commissionType,
      commissionValue: formData.commissionValue,
      remarks,
    });

    // booking.commissionType = formData.commissionType;
    // booking.commissionValue = formData.commissionValue;
    // booking.DoctorName =
    //   "Dr. " +
    //   fetchedDoctor.FirstName +
    //   " " +
    //   fetchedDoctor.MiddleName +
    //   " " +
    //   fetchedDoctor.LastName;
    // booking.DoctorPhone = fetchedDoctor.phoneNo;
    // booking.doctorId = doctor;
    await booking.save();
    res.json({ success: true, referralId: referral.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error saving referral" });
  }
};

const getAllPathologyTestReferral = async (req, res) => {
  try {
    const referrals = await PathologyTestReferral.findAll();
    res.json({ success: true, referrals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error fetching referrals" });
  }
};

// Controller: PathalogyTestReferralController.js

const updatePathologyTestReferral = async (req, res) => {
  try {
    const referralId = req.params.id;
    const { doctor, patient, bookingDate, formData, bookingTime, remarks } =
      req.body;

    const fetchedReferral = await PathologyTestReferral.findByPk(referralId);
    if (!fetchedReferral) {
      return res
        .status(404)
        .json({ success: false, error: "Referral not found" });
    }

    const fetchedPatient = await PathologyTestPatient.findByPk(patient);
    //const fetchedDoctor = await Doctor.findByPk(doctor);

    if (!fetchedPatient || !fetchedDoctor) {
      return res
        .status(404)
        .json({ success: false, error: "Patient or doctor not found" });
    }

    const existingReferral = await PathologyTestReferral.findOne({
      where: {
        id: { [Op.not]: referralId }, // Exclude the current referral being updated
        bookingDate,
        bookingTime,
      },
    });

    if (existingReferral) {
      return res.status(400).json({
        success: false,
        error: "Referral with same date and time already exists",
      });
    }

    fetchedReferral.doctorId = doctor;
    fetchedReferral.PatientName = fetchedPatient.PatientName;
    fetchedReferral.PatientPhone = fetchedPatient.PatientPhoneNo;
    fetchedReferral.DoctorName =
      fetchedDoctor.FirstName +
      " " +
      fetchedDoctor.MiddleName +
      " " +
      fetchedDoctor.LastName;
    fetchedReferral.DoctorPhone = fetchedDoctor.phoneNo;
    fetchedReferral.patientId = patient;
    fetchedReferral.bookingDate = bookingDate;
    fetchedReferral.bookingTime = bookingTime;
    fetchedReferral.remarks = remarks;
    fetchedReferral.commissionType = formData.commissionType;
    fetchedReferral.commissionValue = formData.commissionValue;
    await fetchedReferral.save();

    const booking = await PathologyTest.findByPk(patient);

    booking.commissionType = formData.commissionType;
    booking.commissionValue = formData.commissionValue;
    // booking.DoctorName =
    //   "Dr. " +
    //   fetchedDoctor.FirstName +
    //   " " +
    //   fetchedDoctor.MiddleName +
    //   " " +
    //   fetchedDoctor.LastName;
    // booking.DoctorPhone = fetchedDoctor.phoneNo;
    // booking.doctorId = doctor;
    await booking.save();
    res.json({ success: true, message: "Referral updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error updating referral" });
  }
};

const deletePathologyTestReferral = async (req, res) => {
  try {
    const referralId = req.params.id;

    const fetchedReferral = await PathologyTestReferral.findByPk(referralId);
    if (!fetchedReferral) {
      return res
        .status(404)
        .json({ success: false, error: "Referral not found" });
    }

    await fetchedReferral.destroy();

    res.json({ success: true, message: "Referral deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error deleting referral" });
  }
};

module.exports = {
  createPathologyTestReferral,
  getAllPathologyTestReferral,
  updatePathologyTestReferral,
  deletePathologyTestReferral,
};
