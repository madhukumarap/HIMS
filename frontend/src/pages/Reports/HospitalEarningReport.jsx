import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import AuthService from "../../services/auth.service";
import { currencySymbols } from "../../utils.js";

const HospitalEarningReport = () => {
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

  const generateHospitalEarningsReport = async (
    bookings,
    diagnosticBookings,
    appointmentBookings,
    startDate,
    endDate,
    selectedGlobalCurrency,
    convertCurrency,
    hospitalData,
    hospitalOverAllAmount
  ) => {
    const hospital = await fetchHospitalData();
    console.log(hospital,"hospital")
    const doc = new jsPDF();
    let pageNumber = 1;

    // Filter bookings by date range
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= startDate && bookingDate <= endDate;
    });

    const filteredDiagnosticBookings = diagnosticBookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= startDate && bookingDate <= endDate;
    });

    const filteredAppointmentBookings = appointmentBookings.filter((booking) => {
      const bookingDate = new Date(booking.paymentDateTime || booking.createdAt);
      return bookingDate >= startDate && bookingDate <= endDate;
    });

    // Calculate totals
    
    // If hospital and logo exist
    if (hospital && hospital.logo) {
  const hospitalLogo = new Image();
  
  // Check if the logo is a base64 string or a URL
  if (hospital.logo.startsWith('http') || hospital.logo.startsWith('https')) {
    // It's a URL - use it directly
    hospitalLogo.src = hospital.logo;
  } else {
    // It's a base64 string - add the data URI prefix
    hospitalLogo.src = `data:image/png;base64,${hospital.logo}`;
  }

  hospitalLogo.onload = () => {
    doc.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);
    addHospitalInfo(hospital);
    addEarningsSummary(hospitalOverAllAmount);
    addDetailedData(
      filteredBookings,
      filteredDiagnosticBookings,
      filteredAppointmentBookings,
      selectedGlobalCurrency,
      convertCurrency,
      hospitalData
    );
    addPageNumbers(doc, pageNumber);
    doc.save(`Hospital_Earnings_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };
  
  hospitalLogo.onerror = () => {
    // If image fails to load, continue without the logo
    console.error("Failed to load hospital logo");
    addHospitalInfo(hospital);
    addEarningsSummary(hospitalOverAllAmount);
    addDetailedData(
      filteredBookings,
      filteredDiagnosticBookings,
      filteredAppointmentBookings,
      selectedGlobalCurrency,
      convertCurrency,
      hospitalData
    );
    addPageNumbers(doc, pageNumber);
    doc.save(`Hospital_Earnings_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };
}else {
      // Generate without logo if not available
      addHospitalInfo(hospital);
      addEarningsSummary(hospitalOverAllAmount);
      addDetailedData(
        filteredBookings,
        filteredDiagnosticBookings,
        filteredAppointmentBookings,
        selectedGlobalCurrency,
        convertCurrency,
        hospitalData
      );
      addPageNumbers(doc, pageNumber);
      doc.save(`Hospital_Earnings_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    }

    function addHospitalInfo(hospitalData) {
  if (hospitalData) {
    let yPosition = 20;
    doc.setFontSize(12);

    // Hospital Name
    if (hospitalData.hospitalName && hospitalData.hospitalName !== "NA") {
      doc.setFontSize(14);
      doc.text(`Hospital Name: ${hospitalData.hospitalName}`, 20, yPosition);
      yPosition += 10;
    }

    doc.setFontSize(12);
    
    // Address
    if (hospitalData.address && hospitalData.address !== "NA") {
      doc.text(`Address: ${hospitalData.address}`, 20, yPosition);
      yPosition += 8;
    }

    // City
    if (hospitalData.city && hospitalData.city !== "NA") {
      doc.text(`City: ${hospitalData.city}`, 20, yPosition);
      yPosition += 8;
    }

    // Pincode
    if (hospitalData.pincode && hospitalData.pincode !== "0" && hospitalData.pincode !== "NA") {
      doc.text(`Pincode: ${hospitalData.pincode}`, 20, yPosition);
      yPosition += 8;
    }

    // Phone
    if (hospitalData.phone && hospitalData.phone !== 0 && hospitalData.phone !== "NA") {
      doc.text(`Phone: ${hospitalData.phone}`, 20, yPosition);
      yPosition += 8;
    }

    // Landline
    if (hospitalData.landline && hospitalData.landline !== "NA") {
      doc.text(`Landline: ${hospitalData.landline}`, 20, yPosition);
      yPosition += 8;
    }

    // Email
    if (hospitalData.email && hospitalData.email !== "NA") {
      doc.text(`Email: ${hospitalData.email}`, 20, yPosition);
      yPosition += 8;
    }

    // Registration Number
    if (hospitalData.registrationNo && hospitalData.registrationNo !== "NA") {
      doc.text(`Registration No: ${hospitalData.registrationNo}`, 20, yPosition);
      yPosition += 8;
    }
  }
}
function addEarningsSummary(hospitalOverAllAmount) {
  // Extract totals from the overAllAmount array
  const pathologyTotalObj = hospitalOverAllAmount[0]?.find(item => item.Pathology_Total);
  const diagnosticTotalObj = hospitalOverAllAmount[1]?.find(item => item.Diagnostic_Total);
  const consultationTotalObj = hospitalOverAllAmount[2]?.find(item => item.Consultation_Total);

  const pathologyTotal = pathologyTotalObj ? pathologyTotalObj.Pathology_Total : "0.00";
  const diagnosticTotal =  diagnosticTotalObj ? diagnosticTotalObj.Diagnostic_Total : "0.00";
  const consultationTotal =  consultationTotalObj ? consultationTotalObj.Consultation_Total : "0.00";
  
  // Calculate grand total from the extracted values
  const grandTotal =    hospitalOverAllAmount[3]?.find(item => item.Grand_total);
  const grandTotalAmount = grandTotal ? grandTotal.Grand_total : "0.00"
  // Get currency symbol

  // Add title
  doc.setFillColor("#48bcdf");
  const titleHeight = 10;
  doc.rect(0, 53, doc.internal.pageSize.getWidth(), titleHeight, "F");
  doc.setTextColor("#ffffff");
  doc.setFontSize(16);
  doc.text(
    "Hospital Earnings Report",
    doc.internal.pageSize.getWidth() / 2,
    55 + titleHeight / 2,
    { align: "center" }
  );

  doc.setTextColor("#000000");
  doc.setFontSize(12);

  // Add date range
  doc.text(`Date Range: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`, 20, 70);
  
  // Add summary information
  doc.text("Earnings Summary:", 20, 80);
  doc.setFontSize(10);
  
  // Total Earnings
  doc.text(
    `Total Earnings:  INR${grandTotalAmount}`,
    20,
    90
  );
  
  // Department-wise earnings
  doc.text(
    `Pathology Earnings: INR${pathologyTotal}`,
    20,
    100
  );
  
  doc.text(
    `Diagnostic Earnings: INR${diagnosticTotal}`,
    20,
    110
  );
  
  doc.text(
    `Consultation Earnings: INR${consultationTotal}`,
    20,
    120
  );

  doc.line(0, 130, doc.internal.pageSize.getWidth(), 130);
}

    function addDetailedData(bookings, diagnosticBookings, appointmentBookings, selectedGlobalCurrency, convertCurrency, hospitalData) {
      // Prepare data for the table
      const tableData = [];
    // console.log(appointmentBookings,"appointmentBookings")
      // Pathology bookings
      bookings.forEach((booking, index) => {
        tableData.push([
          "Pathology",
          booking.PatientName || "N/A",
          new Date(booking.createdAt).toLocaleDateString(),
          booking.selectedTests || "N/A",
          `${selectedGlobalCurrency} ${booking.PaidAmount}`,
          booking.status || "N/A"
        ]);
      });
      
      // Diagnostic bookings
      diagnosticBookings.forEach((booking, index) => {
        const amount = Number(convertCurrency(booking.PaidAmount || booking.testFees || 0, hospitalData.baseCurrency, selectedGlobalCurrency));
        tableData.push([
          "Diagnostic",
          booking.PatientName || "N/A",
          new Date(booking.createdAt).toLocaleDateString(),
          booking.selectedTests || "N/A",
          `${selectedGlobalCurrency} ${booking.PaidAmount}`,
          booking.status || "N/A"
        ]);
      });
      
      // Appointment bookings
      appointmentBookings.forEach((booking, index) => {
        const amount = Number(convertCurrency(booking.amount || 0, hospitalData.baseCurrency, selectedGlobalCurrency));
        tableData.push([
          "Consultation",
          booking.PatientName || "N/A",
          new Date(booking.paymentDateTime || booking.createdAt).toLocaleDateString(),
          booking.reason || "N/A",
          `${selectedGlobalCurrency} ${booking.amount}`,
          booking.paymentStatus || "N/A"
        ]);
      });

      doc.autoTable({
        head: [
          ["Department", "Patient Name", "Date", "Service", "Amount", "Status"]
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

  // Helper functions
  const calculateTotalEarnings = (bookings, diagnosticBookings, appointmentBookings) => {
    let total = 0;
    
    // Pathology earnings
    bookings.forEach(booking => {
      total += parseFloat(booking.PaidAmount || booking.testFees || 0);
    });
    
    // Diagnostic earnings
    diagnosticBookings.forEach(booking => {
      total += parseFloat(booking.PaidAmount || booking.testFees || 0);
    });
    
    // Appointment earnings
    appointmentBookings.forEach(booking => {
      total += parseFloat(booking.amount || 0);
    });
    
    return total;
  };

  const calculateDepartmentEarnings = (bookings, diagnosticBookings, appointmentBookings) => {
    const departments = {
      pathology: 0,
      diagnostic: 0,
      consultation: 0
    };
    
    // Pathology earnings
    bookings.forEach(booking => {
      departments.pathology += parseFloat(booking.PaidAmount || booking.testFees || 0);
    });
    
    // Diagnostic earnings
    diagnosticBookings.forEach(booking => {
      departments.diagnostic += parseFloat(booking.PaidAmount || booking.testFees || 0);
    });
    
    // Consultation earnings
    appointmentBookings.forEach(booking => {
      departments.consultation += parseFloat(booking.amount || 0);
    });
    
    return departments;
  };

  return { generateHospitalEarningsReport };
};

export default HospitalEarningReport;