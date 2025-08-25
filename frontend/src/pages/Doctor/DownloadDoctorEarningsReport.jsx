import React from "react";
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
}) => {
  const currentUser = AuthService.getCurrentUser();

  const fetchHospitalData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching hospital data:", error);
      return null;
    }
  };

  console.log(doctor, "doctor");

  // Function to get applicable fee for a patient
  const getApplicableFee = (doctorId, consultationDate) => {
    const doctorFeeHistory = doctorFees.filter(
      (fee) => fee.doctorId === doctorId
    );

    if (doctorFeeHistory.length === 0) return 0;

    // Sort fees by feeUpdatedAt date (newest first)
    const sortedFees = doctorFeeHistory.sort(
      (a, b) => new Date(b.feeUpdatedAt) - new Date(a.feeUpdatedAt)
    );

    // Find the fee that was applicable at the time of consultation
    const consultationDateTime = new Date(consultationDate);

    for (const fee of sortedFees) {
      const feeUpdatedAt = new Date(fee.feeUpdatedAt);
      if (consultationDateTime >= feeUpdatedAt) {
        return parseFloat(fee.consultationFee);
      }
    }

    // If no fee found that was updated before consultation, use the oldest fee
    const oldestFee = sortedFees[sortedFees.length - 1];
    return parseFloat(oldestFee.consultationFee);
  };

  // Filter patients by date range if provided
  const filterPatientsByDateRange = () => {
    if (!dateRange.startDate && !dateRange.endDate) return patients;

    const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

    return patients.filter((patient) => {
      const patientDate = new Date(patient.bookingStartDate);

      if (start && end) {
        return patientDate >= start && patientDate <= end;
      } else if (start) {
        return patientDate >= start;
      } else if (end) {
        return patientDate <= end;
      }
      return true;
    });
  };

  const downloadDoctorEarningsReport = async () => {
    const hospital = await fetchHospitalData();
    const filteredPatients = filterPatientsByDateRange();

    if (filteredPatients.length === 0) {
      alert("No data available for the selected date range");
      return;
    }

    const doc = new jsPDF();

    // If hospital and logo exist
    if (hospital && hospital.logo) {
      const hospitalLogoBase64 = hospital.logo;
      const hospitalLogo = new Image();
      hospitalLogo.src = `data:image/png;base64,${hospitalLogoBase64}`;

      hospitalLogo.onload = () => {
        doc.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);
        addHospitalInfo(hospital);
        addDoctorEarningsInfo(filteredPatients);
        addPatientTable(filteredPatients);
        addPageNumbers(doc);
        doc.save(`Doctor_Consultation_Earnings_Report_${doctor.id}.pdf`);
      };
    } else {
      // Generate without logo if not available
      addHospitalInfo(hospital);
      addDoctorEarningsInfo(filteredPatients);
      addPatientTable(filteredPatients);
      addPageNumbers(doc);
      doc.save(`Doctor_Consultation_Earnings_Report_${doctor.id}.pdf`);
    }

    function addHospitalInfo(hospitalData) {
      if (hospitalData) {
        const hospitalName = hospitalData.hospitalName || "";
        const hospitalAddressLine1 = hospitalData.address || "";
        const hospitalAddressLine2 = hospitalData.pincode
          ? `${hospitalData.pincode}, India`
          : "";
        const email = hospitalData.email ? `Mail: ${hospitalData.email}` : "";
        const landline = hospitalData.landline
          ? `Tel: ${hospitalData.landline}`
          : "";

        doc.setFontSize(16);
        doc.text(hospitalName, 20, 20);
        doc.setFontSize(12);
        if (hospitalAddressLine1) doc.text(hospitalAddressLine1, 20, 30);
        if (hospitalAddressLine2) doc.text(hospitalAddressLine2, 20, 35);
        if (landline) doc.text(landline, 20, 40);
        if (email) doc.text(email, 20, 45);
      }
    }

    function addDoctorEarningsInfo(filteredPatients) {
      // Add title
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

      // Add date range info if filtered
      if (dateRange.startDate || dateRange.endDate) {
        doc.setTextColor("#000000");
        doc.setFontSize(10);
        const dateRangeText = `Date Range: ${
          dateRange.startDate || "Start"
        } to ${dateRange.endDate || "End"}`;
        doc.text(dateRangeText, 20, 70);
      }

      doc.setTextColor("#000000");
      doc.setFontSize(12);

      // Add doctor information
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

      // Calculate total earnings with applicable fees
      let totalEarnings = 0;
      filteredPatients.forEach((patient) => {
        const applicableFee = getApplicableFee(
          doctor.id,
          patient.bookingStartDate
        );
        totalEarnings += applicableFee;
      });

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
        const applicableFeeRecord = doctorFees
          .filter((fee) => fee.doctorId === doctor.id)
          .find(
            (fee) =>
              new Date(patient.bookingStartDate) >= new Date(fee.feeUpdatedAt)
          );

        return [
          index + 1,
          patient.PatientName,
          patient.PatientPhone,
          patient.visitType,
          patient.reason,
          `${patient.amount} ${patient.Currency}`,
          `${applicableFee} ${
            applicableFeeRecord?.consultationCurrency || "INR"
          }`,
          new Date(patient.bookingStartDate).toLocaleDateString(),
          patient.paymentStatus,
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
          ],
        ],
        body: tableData,
        startY: 140,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [72, 188, 223],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
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

        // Add footer
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
      style={{
        fontSize: "12px",
        padding: "4px 5px",
        marginTop: "25px",
        backgroundColor: "#1111",
        color: "black",
      }}
      className="btn btn-secondary mr-2"
      onClick={downloadDoctorEarningsReport}
    >
      <FaDownload /> Download Report
    </button>
  );
};

export default DownloadDoctorEarningsReport;
