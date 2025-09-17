import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import AuthService from "../../services/auth.service";

const DownloadDoctorEarningsReport = ({
  doctor,
  patients,
  doctorFees,
  dateRange,
  paymentStatus,
}) => {
  const currentUser = AuthService.getCurrentUser();

  const fetchHospitalData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
        {
          headers: { Authorization: `${currentUser?.Token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching hospital data:", error);
      return null;
    }
  };

  const getApplicableFee = (doctorId, consultationDate) => {
    const doctorFeeHistory = doctorFees.filter(
      (fee) => fee.doctorId === doctorId
    );
    if (doctorFeeHistory.length === 0) return 0;

    const sortedFees = doctorFeeHistory.sort(
      (a, b) => new Date(b.feeUpdatedAt) - new Date(a.feeUpdatedAt)
    );

    const consultationDateTime = new Date(consultationDate);
    for (const fee of sortedFees) {
      if (consultationDateTime >= new Date(fee.feeUpdatedAt)) {
        return parseFloat(fee.consultationFee);
      }
    }
    return parseFloat(sortedFees[sortedFees.length - 1].consultationFee);
  };

  const filterPatientsByDateRange = () => {
    if (!dateRange.startDate && !dateRange.endDate) return patients;
    const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

    return patients.filter((patient) => {
      const patientDate = new Date(patient.bookingStartDate);
      if (start && end) return patientDate >= start && patientDate <= end;
      if (start) return patientDate >= start;
      if (end) return patientDate <= end;
      return true;
    });
  };

  const getPaymentRecord = (patient) => {
    const doctorPayments = Array.isArray(paymentStatus?.[doctor.id])
      ? paymentStatus[doctor.id]
      : [];
    return doctorPayments.find(
      (p) => Number(p.patientId) === Number(patient.id)
    );
  };

  const downloadDoctorEarningsReport = async () => {
    const hospital = await fetchHospitalData();
    const filteredPatients = filterPatientsByDateRange();

    if (filteredPatients.length === 0) {
      alert("No data available for the selected date range");
      return;
    }

    const doc = new jsPDF();

    // Handle hospital logo
    const addReportContent = () => {
      addHospitalInfo(hospital);
      addDoctorEarningsInfo(filteredPatients);
      addPatientTable(filteredPatients);
      addPageNumbers(doc);
      doc.save(`Doctor_Consultation_Earnings_Report_${doctor.id}.pdf`);
    };

    if (hospital && hospital.logo) {
      const hospitalLogoBase64 = hospital.logo;
      const hospitalLogo = new Image();
      hospitalLogo.src = `data:image/png;base64,${hospitalLogoBase64}`;
      hospitalLogo.onload = () => {
        doc.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);
        addReportContent();
      };
    } else {
      addReportContent();
    }

    function addHospitalInfo(hospitalData) {
      if (!hospitalData) return;
      const { hospitalName, address, pincode, email, landline } = hospitalData;
      doc.setFontSize(16);
      doc.text(hospitalName || "", 20, 20);
      doc.setFontSize(12);
      if (address) doc.text(address, 20, 30);
      if (pincode) doc.text(`${pincode}, India`, 20, 35);
      if (landline) doc.text(`Tel: ${landline}`, 20, 40);
      if (email) doc.text(`Mail: ${email}`, 20, 45);
    }

    function addDoctorEarningsInfo(filteredPatients) {
      doc.setFillColor("#48bcdf");
      const titleHeight = 10;
      doc.rect(0, 53, doc.internal.pageSize.getWidth(), titleHeight, "F");
      doc.setTextColor("#ffffff");
      doc.setFontSize(16);
      doc.text(
        "Doctor Consultation Earnings Report",
        doc.internal.pageSize.getWidth() / 2,
        55 + titleHeight / 2,
        { align: "center" }
      );

      if (dateRange.startDate || dateRange.endDate) {
        doc.setTextColor("#000000");
        doc.setFontSize(10);
        doc.text(
          `Date Range: ${dateRange.startDate || "Start"} to ${
            dateRange.endDate || "End"
          }`,
          20,
          70
        );
      }

      doc.setTextColor("#000000");
      doc.setFontSize(12);
      doc.text("Doctor Information:", 20, 75);
      doc.setFontSize(9);
      doc.text(
        `Name: Dr. ${doctor.FirstName} ${doctor.MiddleName} ${doctor.LastName}`,
        20,
        85
      );
      doc.text(`Email: ${doctor.email}`, 20, 90);
      doc.text(`Phone: ${doctor.countryCode} ${doctor.phoneNo}`, 20, 95);
      doc.text(`Registration No: ${doctor.registrationNo}`, 20, 100);

      doc.line(0, 105, doc.internal.pageSize.getWidth(), 105);

      const totalEarnings = filteredPatients.reduce(
        (sum, patient) =>
          sum + getApplicableFee(doctor.id, patient.bookingStartDate),
        0
      );

      doc.setFontSize(12);
      doc.text("Earnings Summary:", 20, 115);
      doc.setFontSize(9);
      doc.text(`Total Consultations: ${filteredPatients.length}`, 20, 125);
      doc.text(`Total Earnings: ${totalEarnings.toFixed(2)} INR`, 20, 130);
    }

    function addPatientTable(filteredPatients) {
      const tableData = filteredPatients.map((patient, index) => {
        const applicableFee = getApplicableFee(
          doctor.id,
          patient.bookingStartDate
        );
        const paymentRecord = getPaymentRecord(patient);

        return [
          index + 1,
          patient.PatientName,
          patient.PatientPhone,
          patient.visitType,
          patient.reason,
          `${patient.amount} ${patient.Currency || "INR"}`,
          `${applicableFee} INR`,
          new Date(patient.bookingStartDate).toLocaleDateString(),
          paymentRecord ? paymentRecord.status : "Unpaid",
          paymentRecord
            ? new Date(paymentRecord.paymentDateTime).toLocaleDateString()
            : "-",
        ];
      });

      doc.autoTable({
        head: [
          [
            "Sr.No",
            "Patient Name",
            "Phone",
            "Visit Type",
            "Reason",
            "Amount Paid",
            "Doctor's Fee",
            "Consultation Date",
            "Payment Status",
            "Payment Date",
          ],
        ],
        body: tableData,
        startY: 140,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: {
          fillColor: [72, 188, 223],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });
    }

    function addPageNumbers(doc) {
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor("#000000");
        doc.text(
          `Page ${i} of ${totalPages}`,
          doc.internal.pageSize.getWidth() / 2 - 10,
          doc.internal.pageSize.getHeight() - 10
        );

        doc.setFillColor("#48bcdf");
        doc.rect(
          0,
          doc.internal.pageSize.getHeight() - 15,
          doc.internal.pageSize.getWidth(),
          15,
          "F"
        );
        doc.setTextColor("#ffffff");
        doc.setFontSize(12);
        doc.text(
          "Powered by mediAI",
          doc.internal.pageSize.getWidth() / 2 - 20,
          doc.internal.pageSize.getHeight() - 5
        );
      }
    }
  };

  return (
    <button
      title="Download Earnings Report"
      style={{ marginTop: "22px" }}
      className="btn btn-secondary"
      onClick={downloadDoctorEarningsReport}
    >
      <FaDownload /> Download Report
    </button>
  );
};

export default DownloadDoctorEarningsReport;
