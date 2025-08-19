const Sequelize = require("sequelize");
const { Op } = Sequelize;
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const db = require("../model/index.model");
const User = db.user;
const { getConnectionList } = require("../model/index.model3");
const schedule = require("node-schedule");
const mysqldump = require("mysqldump");
const timestamp = require("time-stamp");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hims.pharmacy.tech@gmail.com",
    pass: "uliiksvpjxgfeizf",
  },
});

router.post("/sendReminder/:prescription_Id", async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const PaisentPrescription = db.paisentprescription;
  const Medecines = db.paitentMedicines;
  const Patient = db.paitentReg;
  const DoctorModel = db.doctor;
  const prescription_Id = req.params.prescription_Id;

  try {
    const data = await PaisentPrescription.findOne({
      include: [
        {
          model: Medecines,
          as: "medicines",
        },
      ],
      where: { id: prescription_Id },
    });

    const patient = await Patient.findByPk(data.patient_Id);
    const doctor = await DoctorModel.findByPk(data.doctor_Id);

    if (!patient || !doctor) {
      return res.status(404).json({ message: "Patient or Doctor not found" });
    }

    const {
      prescriptionId,
      PatientName,
      phoneNumberP,
      PrescribedDoctor,
      DoctorEmail,
      clinicalDiagnosis,
      revisitDate,
      emailSentDetails,
    } = data;

    // Composing email for both patient and doctor
    const mailOptions = {
      from: "hims.pharmacy.tech@gmail.com",
      to: [patient.email, DoctorEmail].join(","),
      subject: `Next Consultation Reminder ReVisitDate ${revisitDate}`,
      html: `
        <h3>Dear ${PatientName},</h3>
        <p>This is a reminder for your next consultation with Dr. ${PrescribedDoctor}.</p>
        <p>Prescription ID: ${prescriptionId}</p>
        <p>Clinical Diagnosis: ${clinicalDiagnosis}</p>
        <p>Thank you and see you at your appointment!</p>
      `,
    };

    // Sending the email
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log("Error sending reminder email:", error);
        res.status(500).json({ message: "Error sending reminder email" });
      } else {
        console.log("Reminder email sent:", info.response);

        // Update emailSentStatus to 'sent'
        try {
          await PaisentPrescription.update(
            {
              emailSentStatus: "sent",
              emailSentDetails: emailSentDetails
                ? emailSentDetails + "," + new Date()
                : "" + new Date(),
            },
            { where: { id: prescription_Id } }
          );

          console.log("Email sent status updated to 'sent'");
        } catch (updateError) {
          console.error("Error updating emailSentStatus:", updateError.message);
        }

        res.status(200).json({ message: "Reminder email sent successfully" });
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Error processing reminder" });
  }
});

//call in a day once
const CallEvery12Hours = schedule.scheduleJob("0 */12 * * *", async () => {
  console.log(
    "reminder email for consultation 00:00:00:",
    new Date().toLocaleTimeString()
  );

  const hospitals = await db.HospitalMain.findAll();

  // Use map to create an array of promises
  const reminderPromises = hospitals.map(async (hospital) => {
    const connectionList = await getConnectionList(hospital.databaseName);
    const db = connectionList[hospital.databaseName];
    const PrescriptionTable = db.paisentprescription;
    const connection = db.connection;
    try {
      // Find all prescriptions for the hospital
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set the time to midnight

      const maxRevisitDate = new Date();
      maxRevisitDate.setDate(currentDate.getDate() + 3);
      maxRevisitDate.setHours(0, 0, 0, 0); // Set the time to midnight for the date 2 days from now

      const prescriptions = await PrescriptionTable.findAll({
        where: {
          revisitDate: {
            [Op.gte]: currentDate,
            [Op.lte]: maxRevisitDate,
          },
          emailSentStatus: "notsent",
          revisit: "yes",
        },
      });
      console.log("Allprescriptions: " + JSON.stringify(prescriptions));
      //   return;
      // Iterate over each prescription and send a reminder email
      const reminderEmailPromises = prescriptions.map(async (prescription) => {
        const patient = await db.paitentReg.findByPk(prescription.patient_Id);
        const doctor = await db.doctor.findByPk(prescription.doctor_Id);

        if (!patient || !doctor) {
          console.log(
            "Patient or Doctor not found for prescription ID:",
            prescription.id
          );
          return;
        }

        const {
          prescriptionId,
          PatientName,
          PrescribedDoctor,
          DoctorEmail,
          clinicalDiagnosis,
          revisitDate,
          emailSentDetails,
        } = prescription;

        // Composing email for both patient and doctor
        const mailOptions = {
          from: "hims.pharmacy.tech@gmail.com",
          to: [patient.email, DoctorEmail].join(","),
          subject: `Next Consultation Reminder ReVisitDate ${revisitDate}`,
          html: `
            <h3>Dear ${PatientName},</h3>
            <p>This is a reminder for your next consultation with Dr. ${PrescribedDoctor}.</p>
            <p>Prescription ID: ${prescriptionId}</p>
            <p>Clinical Diagnosis: ${clinicalDiagnosis}</p>
            <p>Thank you and see you at your appointment!</p>
          `,
        };

        // Sending the email
        try {
          // Sending the email
          const sendEmailResult = await transporter.sendMail(mailOptions);

          // Update emailSentStatus if email is sent successfully
          if (sendEmailResult.accepted.length > 0) {
            // Update emailSentStatus to 'yes'

            await PaisentPrescription.update(
              {
                emailSentStatus: "sent",
                emailSentDetails: emailSentDetails
                  ? emailSentDetails + "," + new Date()
                  : "" + new Date(),
              },
              { where: { id: prescription.id } }
            );

            console.log(
              `Reminder email sent for prescription ID ${prescription.id}:`,
              sendEmailResult
            );
          } else {
            console.log(
              `Reminder email failed for prescription ID ${prescription.id}:`,
              sendEmailResult
            );
          }
        } catch (error) {
          console.error(
            `Error sending reminder email for prescription ID ${prescription.id}:`,
            error
          );
        }
      });

      // Wait for all reminder emails to be sent
      await Promise.all(reminderEmailPromises);
    } catch (error) {
      console.error(
        "Error processing reminders for hospital:",
        hospital.databaseName,
        error.message
      );
    }
  });

  // Wait for all hospital reminders to be processed
  await Promise.all(reminderPromises);
});

const getCurrentTimeString = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

module.exports = router;
