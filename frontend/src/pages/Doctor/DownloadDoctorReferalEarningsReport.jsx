import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import AuthService from "../../services/auth.service";

const DownloadDoctorReferalEarningsReport = ({ doctor, patients }) => {
  const currentUser = AuthService.getCurrentUser();
  const [hospitalData, setHospitalData] = useState(null);

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
      return response.data.data; // return directly
    } catch (error) {
      console.error("Error fetching hospital data:", error);
      return null;
    }
  };

  const downloadDoctorEarningsReport = async () => {
    const hospital = await fetchHospitalData(); // get hospital data here

    const doc = new jsPDF();
    let pageNumber = 1;

    // If hospital and logo exist
    if (hospital && hospital.logo) {
      const hospitalLogoBase64 = hospital.logo;
      const hospitalLogo = new Image();
      hospitalLogo.src = `data:image/png;base64,${hospitalLogoBase64}`;

      hospitalLogo.onload = () => {
        doc.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);
        addHospitalInfo(hospital);
        addDoctorEarningsInfo();
        addPatientTable();
        addPageNumbers(doc, pageNumber);
        doc.save(`Doctor_Referal_Earnings_Report_${doctor.id}.pdf`);
      };
    } else {
      // Generate without logo if not available
      addHospitalInfo(hospital);
      addDoctorEarningsInfo();
      addPatientTable();
      addPageNumbers(doc, pageNumber);
      doc.save(`Doctor_Referal_Earnings_Report_${doctor.id}.pdf`);
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

    function addDoctorEarningsInfo() {
      // Add title
      doc.setFillColor("#48bcdf");
      const titleHeight = 10;
      doc.rect(0, 53, doc.internal.pageSize.getWidth(), titleHeight, "F");
      doc.setTextColor("#ffffff");
      doc.setFontSize(16);
      doc.text(
        "Doctor Referal Earnings Report",
        doc.internal.pageSize.getWidth() / 2,
        55 + titleHeight / 2,
        { align: "center" }
      );

      doc.setTextColor("#000000");
      doc.setFontSize(12);

      // Add doctor information
      doc.text("Doctor Information:", 20, 70);
      doc.setFontSize(9);
      doc.text(
        `Name: Dr. ${doctor.FirstName} ${doctor.MiddleName} ${doctor.LastName}`,
        20,
        80
      );
      doc.text(`Email: ${doctor.email}`, 20, 85);
      doc.text(`Phone: ${doctor.countryCode} ${doctor.phoneNo}`, 20, 90);
      doc.text(`Registration No: ${doctor.registrationNo}`, 20, 95);
      doc.text(
        `Referal Fee: ${doctor.referralFee} ${doctor.consultationCurrency}`,
        20,
        100
      );

      doc.line(0, 105, doc.internal.pageSize.getWidth(), 105);

      // Calculate total earnings
      const totalEarnings = patients.reduce((sum, patient) => {
        return sum + (parseFloat(doctor.referralFee) || 0);
      }, 0);

      doc.setFontSize(12);
      doc.text("Earnings Summary:", 20, 115);
      doc.setFontSize(9);
      doc.text(`Total Referals: ${patients.length}`, 20, 125);
      doc.text(
        `Total Earnings: ${totalEarnings.toFixed(2)} ${
          doctor.consultationCurrency
        }`,
        20,
        130
      );
    }

    function addPatientTable() {
      const tableData = patients.map((patient, index) => [
        index + 1,
        patient.PatientName,
        patient.PatientPhone,
        patient.visitType,
        patient.reason,
        `${patient.amount} ${patient.Currency}`,
        `${doctor.referralFee} ${doctor.consultationCurrency}`,
        new Date(patient.bookingStartDate).toLocaleDateString(),
        // patient.paymentStatus,
      ]);

      doc.autoTable({
        head: [
          [
            "Sr.No",
            "Patient Name",
            "Phone",
            "Visit Type",
            "Reason",
            "Amount Paid",
            "Doctor's Referal Fee",
            "Consultation Date",
            // "Payment Status",
          ],
        ],
        body: tableData,
        startY: 140,
        styles: {
          fontSize: 10,
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

    function addPageNumbers(doc, pageNumber) {
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
      title="Download Referal Earnings Report"
      style={{
        fontSize: "12px",
        padding: "4px 5px",
        marginTop: "0px",
        backgroundColor: "#1111",
        color: "black",
      }}
      className="btn btn-secondary mr-2"
      onClick={downloadDoctorEarningsReport}
    >
      <FaDownload />
    </button>
  );
};

export default DownloadDoctorReferalEarningsReport;
