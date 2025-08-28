import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import AuthService from "../../services/auth.service";

const DownloadDoctorReferalEarningsReport = ({ doctor, patients, dateRange, enterCodes }) => {
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

  // Filter patients by date range if provided
  const filterPatientsByDateRange = () => {
    if (!dateRange.startDate && !dateRange.endDate) return patients;
    
    const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const end = dateRange.endDate ? new Date(dateRange.endDate) : null;
    
    return patients.filter(patient => {
      let patientDate;
      
      // Handle different date fields for different referral types
      if (patient.bookingStartDate) {
        patientDate = new Date(patient.bookingStartDate);
      } else if (patient.PaymentDate) {
        patientDate = new Date(patient.PaymentDate);
      } else if (patient.createdAt) {
        patientDate = new Date(patient.createdAt);
      } else {
        return true;
      }
      
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

  // Calculate referral fee based on type and enter codes
  const calculateReferralFee = (referral) => {
    // For consultation referrals
    if (referral.type === "Consultation") {
      return parseFloat(doctor.referralFee) || 0;
    }
    // For diagnostics and pathology referrals
    else if (referral.commissionValue) {
      // Find the enter code
      const enterCode = enterCodes.find(code => code.codeType === referral.commissionValue);
      if (enterCode) {
        // Extract percentage value (e.g., "10%" -> 10)
        const percentage = parseFloat(enterCode.value);
        const amount = parseFloat(referral.PaidAmount) || parseFloat(referral.TotalFees) || 0;
        return (amount * percentage) / 100;
      }
    }
    return 0;
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
        doc.save(`Doctor_Referral_Earnings_Report_${doctor.id}.pdf`);
      };
    } else {
      // Generate without logo if not available
      addHospitalInfo(hospital);
      addDoctorEarningsInfo(filteredPatients);
      addPatientTable(filteredPatients);
      addPageNumbers(doc);
      doc.save(`Doctor_Referral_Earnings_Report_${doctor.id}.pdf`);
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
        "Doctor Referral Earnings Report",
        doc.internal.pageSize.getWidth() / 2,
        55 + titleHeight / 2,
        { align: "center" }
      );

      // Add date range info if filtered
      if (dateRange.startDate || dateRange.endDate) {
        doc.setTextColor("#000000");
        doc.setFontSize(10);
        const dateRangeText = `Date Range: ${dateRange.startDate || 'Start'} to ${dateRange.endDate || 'End'}`;
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
      doc.text(
        `Referral Fee: ${doctor.referralFee} ${doctor.consultationCurrency}`,
        20,
        105
      );

      // Add enter code information
      if (enterCodes && enterCodes.length > 0) {
        doc.text("Commission Rates:", 20, 115);
        enterCodes.forEach((code, index) => {
          doc.text(`${code.codeType}: ${code.value}`, 20, 120 + (index * 5));
        });
      }

      doc.line(0, 130, doc.internal.pageSize.getWidth(), 130);

      // Calculate total earnings
      const totalEarnings = filteredPatients.reduce((sum, patient) => {
        return sum + calculateReferralFee(patient);
      }, 0);

      // Count referrals by type
      const consultationCount = filteredPatients.filter(p => p.type === "Consultation").length;
      const diagnosticsCount = filteredPatients.filter(p => p.type === "Diagnostics").length;
      const pathologyCount = filteredPatients.filter(p => p.type === "Pathology").length;

      doc.setFontSize(12);
      doc.text("Earnings Summary:", 20, 145);
      doc.setFontSize(9);
      doc.text(`Total Referrals: ${filteredPatients.length}`, 20, 155);
      doc.text(`- Consultations: ${consultationCount}`, 25, 160);
      doc.text(`- Diagnostics: ${diagnosticsCount}`, 25, 165);
      doc.text(`- Pathology: ${pathologyCount}`, 25, 170);
      doc.text(
        `Total Earnings: ${totalEarnings.toFixed(2)} ${doctor.consultationCurrency}`,
        20,
        175
      );
    }

    function addPatientTable(filteredPatients) {
      const tableData = filteredPatients.map((patient, index) => {
        const referralFee = calculateReferralFee(patient);
        let date = "";
        let amountPaid = 0;
        let currency = "INR";

        if (patient.type === "Consultation") {
          date = new Date(patient.bookingStartDate).toLocaleDateString();
          amountPaid = parseFloat(patient.amount) || 0;
          currency = patient.Currency || "INR";
        } else {
          date = new Date(patient.PaymentDate || patient.createdAt).toLocaleDateString();
          amountPaid = parseFloat(patient.PaidAmount) || parseFloat(patient.TotalFees) || 0;
          currency = patient.Currency || "INR";
        }

        return [
          index + 1,
          patient.type,
          patient.PatientName,
          patient.PatientPhone || patient.PatientPhoneNo,
          patient.type === "Consultation" ? patient.visitType : (patient.selectedTests || patient.PackageName || "N/A"),
          `${amountPaid.toFixed(2)} ${currency}`,
          `${referralFee.toFixed(2)} ${doctor.consultationCurrency}`,
          date,
          patient.paymentStatus || patient.PaymentStatus,
        ];
      });

      doc.autoTable({
        head: [
          [
            "Sr.No",
            "Type",
            "Patient Name",
            "Phone",
            "Procedure/Visit Type",
            "Amount Paid",
            "Doctor's Referral Fee",
            "Date",
            "Payment Status",
          ],
        ],
        body: tableData,
        startY: 185,
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
      title="Download Referral Earnings Report"
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

export default DownloadDoctorReferalEarningsReport;