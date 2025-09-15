// controllers/doctorPayment.controller.js
const { getConnectionList } = require("../model/index.model3");

// const getUnpaidPayments = async (req, res) => {
//   try {
//     const database = req.headers.userDatabase;
//     const connectionList = await getConnectionList(database);
//     const db = connectionList[database];
//     const DoctorPaymentHistory = db.doctorPaymentHistory;

//     const unpaid = await DoctorPaymentHistory.findAll({
//       where: { status: "Unpaid" },
//     });
//     res.status(200).json(unpaid);
//   } catch (err) {
//     console.error("Get unpaid error:", err);
//     res.status(500).json({ error: "Failed to fetch unpaid payments" });
//   }
// };

// doctorPayment.controller.js
const makePayments = async (req, res) => {
  try {
    const { doctorId, payments } = req.body; // payments: [{ id, type, amount }]
    const database = req.headers.userDatabase;

    console.log(doctorId, payments, "Raw Data");

    const connectionList = await getConnectionList(database);
    const db = connectionList[database];
    const DoctorPaymentHistory = db.doctorPaymentHistory;

    const records = payments.map((p) => ({
      doctorId,
      consultationId: p.type === "Consultation" ? p.id : null,
      referralId: p.type === "Referral" ? p.id : null, // 👈 NEW (store consultationId in referralId for referrals)
      pathologyId: p.type === "Pathology" ? p.id : null,
      diagnosisId: p.type === "Diagnosis" ? p.id : null,
      paidAmount: p.amount,
      paymentDateTime: new Date(),
      status: "Paid",
    }));

    await DoctorPaymentHistory.bulkCreate(records);

    res.status(200).json({ message: "Payments recorded successfully" });
  } catch (err) {
    console.error("Error saving payments:", err);
    res.status(500).json({ error: "Failed to record payments" });
  }
};

const getPendingPayments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const database = req.headers.userDatabase;

    const connectionList = await getConnectionList(database);
    const db = connectionList[database];

    const DoctorsAppointment = db.DoctorsAppointment;
    const PathologyTest = db.PathologyTest;
    const DiagnosticsBookingModel = db.DiagnosticsBookingModel;
    const DoctorFees = db.DoctorFee;
    const CommissionCodes = db.CommissionCodeData;

    // 1. Fetch all fees history for doctor
    const feeHistory = await DoctorFees.findAll({
      where: { doctor_id: doctorId },
      order: [["updatedAt", "ASC"]],
    });

    // 2. Fetch commission codes
    const codes = await CommissionCodes.findAll();

    // 3. Get already paid records (Consultations, Referrals, Pathology, Diagnosis)
    let paidConsultIds = new Set();
    let paidReferralIds = new Set();
    let paidPathIds = new Set();
    let paidDiagIds = new Set();

    try {
      const [paidRecords] = await db.sequelize.query(
        "SELECT consultationId, referralId, pathologyId, diagnosisId FROM doctor_payment_history WHERE doctorId = ?",
        { replacements: [doctorId] }
      );

      paidConsultIds = new Set(
        paidRecords.map((r) => r.consultationId).filter(Boolean)
      );
      paidReferralIds = new Set(
        paidRecords.map((r) => r.referralId).filter(Boolean)
      );
      paidPathIds = new Set(
        paidRecords.map((r) => r.pathologyId).filter(Boolean)
      );
      paidDiagIds = new Set(
        paidRecords.map((r) => r.diagnosisId).filter(Boolean)
      );
    } catch (error) {
      console.log("Error fetching paid records, assuming none:", error.message);
    }

    // helper: get applicable consultation/referral fee by booking date
    const getApplicableFee = (dateStr, type = "consultation") => {
      if (!feeHistory.length) {
        return type === "consultation" ? 200 : 100; // Default
      }
      const date = new Date(dateStr);

      // find latest fee before consultation date
      let applicable = feeHistory
        .filter((f) => new Date(f.createdAt) <= date)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      if (!applicable) {
        applicable = feeHistory.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )[0];
      }

      return type === "consultation"
        ? parseFloat(applicable.consultationFee || 0)
        : parseFloat(applicable.referralFee || 0);
    };

    // helper: get commission % from codes
    const getCommission = () => {
      if (!codes.length) return 10;
      return parseFloat(codes[0].value) || 10;
    };

    // --- Consultations (main + referral) ---
    const consultations = await DoctorsAppointment.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { doctorId: doctorId },
          { referralDoctorId: doctorId },
        ],
      },
      attributes: [
        "id",
        "PatientName",
        "PatientPhone",
        "amount",
        "Currency",
        "bookingStartDate",
        "referralDoctorId",
        "doctorId",
      ],
    });

    let unpaid = [];

    consultations.forEach((c) => {
      const mainDoctorId = Number(c.dataValues.doctorId);
      const refDoctorId = Number(c.dataValues.referralDoctorId || 0);
      const targetDoctorId = Number(req.params.doctorId);

      // --- Main Consultation Payment ---
      if (
        mainDoctorId === targetDoctorId &&
        !paidConsultIds.has(c.dataValues.id)
      ) {
        const fee = getApplicableFee(
          c.dataValues.bookingStartDate,
          "consultation"
        );
        unpaid.push({
          id: c.dataValues.id,
          type: "Consultation",
          doctorId: targetDoctorId,
          patientName: c.dataValues.PatientName,
          phone: c.dataValues.PatientPhone,
          amount: fee,
          date: c.dataValues.bookingStartDate,
          currency: c.dataValues.Currency || "INR",
        });
      }

      // --- Referral Payment ---
      if (
        refDoctorId === targetDoctorId &&
        !paidReferralIds.has(c.dataValues.id)
      ) {
        const referralFee = getApplicableFee(
          c.dataValues.bookingStartDate,
          "referral"
        );
        unpaid.push({
          id: c.dataValues.id,
          type: "Referral",
          doctorId: targetDoctorId,
          patientName: c.dataValues.PatientName,
          phone: c.dataValues.PatientPhone,
          amount: referralFee,
          date: c.dataValues.bookingStartDate,
          currency: c.dataValues.Currency || "INR",
        });
      }
    });

    // --- Pathology ---
    const pathologies = await PathologyTest.findAll({
      where: { doctorId },
      attributes: [
        "id",
        "PatientName",
        "PatientPhoneNo",
        "PaidAmount",
        "TotalFees",
        "Currency",
        "PaymentDate",
        "selectedTests",
        "commissionType",
      ],
    });

    pathologies.forEach((p) => {
      if (!paidPathIds.has(p.id)) {
        const percentage = getCommission();
        const baseAmount =
          parseFloat(p.PaidAmount) || parseFloat(p.TotalFees) || 0;
        const fee = (baseAmount * percentage) / 100;

        unpaid.push({
          id: p.id,
          type: "Pathology",
          patientName: p.PatientName,
          phone: p.PatientPhoneNo,
          amount: fee,
          date: p.PaymentDate,
          currency: p.Currency || "INR",
          testName: p.selectedTests || "N/A",
        });
      }
    });

    // --- Diagnostics ---
    const diagnostics = await DiagnosticsBookingModel.findAll({
      where: { doctorId },
      attributes: [
        "id",
        "PatientName",
        "PatientPhoneNo",
        "PaidAmount",
        "TotalFees",
        "Currency",
        "PaymentDate",
        "selectedTests",
        "commissionType",
      ],
    });

    diagnostics.forEach((d) => {
      if (!paidDiagIds.has(d.id)) {
        const percentage = getCommission();
        const baseAmount =
          parseFloat(d.PaidAmount) || parseFloat(d.TotalFees) || 0;
        const fee = (baseAmount * percentage) / 100;

        unpaid.push({
          id: d.id,
          type: "Diagnosis",
          patientName: d.PatientName,
          phone: d.PatientPhoneNo,
          amount: fee,
          date: d.PaymentDate,
          currency: d.Currency || "INR",
          testName: d.selectedTests || "N/A",
        });
      }
    });

    return res.status(200).json(unpaid);
  } catch (err) {
    console.error("Error fetching pending payments:", err);
    res.status(500).json({ error: "Failed to fetch pending payments" });
  }
};

const getDoctorPaymentHistory = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const database = req.headers.userDatabase;

    const connectionList = await getConnectionList(database);
    const db = connectionList[database];

    // Get all payments for this doctor
    const [paymentHistory] = await db.sequelize.query(
      `SELECT id, doctorId, consultationId, referralId, pathologyId, diagnosisId, 
              paidAmount, paymentDateTime, status, createdAt, updatedAt
       FROM doctor_payment_history
       WHERE doctorId = ?
       ORDER BY paymentDateTime DESC`,
      { replacements: [doctorId] }
    );

    res.status(200).json(paymentHistory);
  } catch (err) {
    console.error("Error fetching doctor payment history:", err);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
};

module.exports = {
  makePayments,
  getPendingPayments,
  getDoctorPaymentHistory,
};
