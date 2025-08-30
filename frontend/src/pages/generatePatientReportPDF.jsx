import jsPDF from "jspdf";
import { format, isDate } from "date-fns";

const generatePatientReportPDF = (typeData,hospitalData, pathologyTest, selectedTests, doctor, results, medicineData) => {
  console.log(hospitalData, pathologyTest, selectedTests, doctor, results, medicineData);
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;
  
  // Helper function to add text with styling
  const addText = (text, x, y, options = {}) => {
    const { fontSize = 10, fontStyle = 'normal', align = 'left', color = [0, 0, 0] } = options;
    doc.setFontSize(fontSize);
    doc.setFont(undefined, fontStyle);
    doc.setTextColor(...color);
    
    // Convert to string if not already
    const textString = String(text);
    doc.text(textString, x, y, { align });
  };

  // Helper function to add line
  const addLine = (y) => {
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, pageWidth - 15, y);
  };

  // Helper function to format dates
  const formatDateSafely = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : format(date, "dd-MMM-yyyy");
  };
if (hospitalData?.logo) {
    try {
      // Add hospital logo (resize to appropriate dimensions)
      const logoWidth = 30;
      const logoHeight = 30;
      doc.addImage(hospitalData.logo, 'PNG', 15, 10, logoWidth, logoHeight);
      
      // Adjust header position to account for logo
      yPosition = Math.max(yPosition, 10 + logoHeight + 5);
    } catch (error) {
      console.error("Error adding logo:", error);
    }
  }
  // Header
  // addText(hospitalData?.hospitalName || "City Care Hospital", pageWidth / 2, yPosition, {
  //   fontSize: 18,
  //   align: 'center',
  //   color: [0, 0, 255]
  // });
  yPosition += 8;
  
  // addText("Patient Diagnosis Report", pageWidth / 2, yPosition, {
  //   fontSize: 16,
  //   align: 'center',
  //   color: [0, 128, 0]
  // });
  yPosition += 15;

  // Hospital & Report Info
  const hospitalInfoX = 15;
  const reportInfoX = pageWidth - 15;
  
  addText(`Hospital Name: ${hospitalData?.hospitalName || "N/A"}`, hospitalInfoX, yPosition);
  if (hospitalData?.city) {
    yPosition += 7;
    addText(`City: ${hospitalData?.city || "N/A"}`, hospitalInfoX, yPosition);
  }
  yPosition += 7;
  addText(`Hospital Address: ${hospitalData?.address || "N/A"}`, hospitalInfoX, yPosition);
  yPosition += 7;
  addText(`Contact: ${hospitalData?.landline || "N/A"}`, hospitalInfoX, yPosition);
  yPosition += 7;
  addText(`Email: ${hospitalData?.email || "N/A"}`, hospitalInfoX, yPosition);
  
  // Reset yPosition for right-aligned content
  let yRight = 30;
  addText(`Report ID: ${pathologyTest?.id || "N/A"}`, reportInfoX, yRight, {align: 'right'});
  yRight += 7;
  addText(`Date: ${pathologyTest?.createdAt ? new Date(pathologyTest.createdAt).toLocaleDateString() : "N/A"}`, reportInfoX, yRight, {align: 'right'});
  yRight += 7;
  addText(`Doctor: ${doctor?.FirstName || ""} ${doctor?.LastName || ""}`, reportInfoX, yRight, {align: 'right'});
  
  yPosition = Math.max(yPosition, yRight) + 15;
  addLine(yPosition);
  yPosition += 10;

  // Patient Information
  addText("Patient Information", 15, yPosition, {
    fontSize: 14,
    color: [105, 105, 105]
  });
  yPosition += 8;
  addLine(yPosition);
  yPosition += 10;

  // Patient details in table-like format
  const col1 = 15;
  const col2 = 60;
  const col3 = 110;
  const col4 = 150;
  
  addText("Patient Name", col1, yPosition, {fontStyle: 'bold'});
  addText(pathologyTest?.PatientName || "N/A", col2, yPosition);
  addText("Age", col3, yPosition, {fontStyle: 'bold'});
  addText(String(pathologyTest?.Age || "N/A"), col4, yPosition);
  yPosition += 7;
  
  addText("Gender", col1, yPosition, {fontStyle: 'bold'});
  addText(pathologyTest?.Gender || "N/A", col2, yPosition);
  addText("Patient ID", col3, yPosition, {fontStyle: 'bold'});
  addText(String(pathologyTest?.PatientID || "N/A"), col4, yPosition);
  yPosition += 7;
  
  addText("Contact", col1, yPosition, {fontStyle: 'bold'});
  addText(pathologyTest?.PatientPhoneNo || "N/A", col2, yPosition);
  addText("Address", col3, yPosition, {fontStyle: 'bold'});
  addText(pathologyTest?.Address || "N/A", col4, yPosition);
  yPosition += 15;

  // Check if we need a new page
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 15;
  }

  // Medicine Details (if available)
  if (medicineData && medicineData.length > 0) {
    addText("Medicine Details", 15, yPosition, {
      fontSize: 14,
      color: [105, 105, 105]
    });
    yPosition += 8;
    addLine(yPosition);
    yPosition += 10;

    // Table headers
    addText("Medicine Name", col1, yPosition, {fontStyle: 'bold'});
    // addText("Batch No", col2, yPosition, {fontStyle: 'bold'});
    addText("Expiry Date", col3, yPosition, {fontStyle: 'bold'});
    addText("Qty", col4, yPosition, {fontStyle: 'bold'});
    yPosition += 7;

    addText("Unit Price", col1, yPosition, {fontStyle: 'bold'});
    addText("Total Cost", col2, yPosition, {fontStyle: 'bold'});
    // addText("Currency", col3, yPosition, {fontStyle: 'bold'});
    // addText("Dispense ID", col4, yPosition, {fontStyle: 'bold'});
    yPosition += 7;

    addLine(yPosition);
    yPosition += 5;

    // Medicine items
    medicineData.forEach((medicine, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 15;
        
        // Add table headers again on new page
        addText("Medicine Name", col1, yPosition, {fontStyle: 'bold'});
        // addText("Batch No", col2, yPosition, {fontStyle: 'bold'});
        addText("Expiry Date", col3, yPosition, {fontStyle: 'bold'});
        addText("Qty", col4, yPosition, {fontStyle: 'bold'});
        yPosition += 7;

        addText("Unit Price", col1, yPosition, {fontStyle: 'bold'});
        addText("Total Cost", col2, yPosition, {fontStyle: 'bold'});
        // addText("Currency", col3, yPosition, {fontStyle: 'bold'});
        // addText("Dispense ID", col4, yPosition, {fontStyle: 'bold'});
        yPosition += 7;

        addLine(yPosition);
        yPosition += 5;
      }

      addText(medicine.MedicineName || "N/A", col1, yPosition);
      // addText(medicine.BatchNumber || "N/A", col2, yPosition);
      addText(formatDateSafely(medicine.ExpiryDate), col3, yPosition);
      addText(medicine.Quantity || "N/A", col4, yPosition);
      yPosition += 7;

      addText(`${medicine.UnitPrice || "0.00"}`, col1, yPosition);
      addText(`${medicine.EachmedicineCost || "0.00"}`, col2, yPosition);
      // addText(medicine.EachMedicineCurrency || "N/A", col3, yPosition);
      // addText(medicine.DispenseID || "N/A", col4, yPosition);
      yPosition += 10;

      // Add line between items (except after last item)
      if (index < medicineData.length - 1) {
        addLine(yPosition);
        yPosition += 5;
      }
    });

    yPosition += 15;
  }

  // Check if we need a new page
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 15;
  }

  // Diagnosis Details
  addText("Diagnosis Details", 15, yPosition, {
    fontSize: 14,
    color: [105, 105, 105]
  });
  yPosition += 8;
  addLine(yPosition);
  yPosition += 10;

  addText("Test Name", col1, yPosition, {fontStyle: 'bold'});
  addText(pathologyTest?.selectedTests || "N/A", col2, yPosition);
  addText("Procedure", col3, yPosition, {fontStyle: 'bold'});
  addText(pathologyTest?.procedure || "N/A", col4, yPosition);
  yPosition += 7;

  addText("Status", col1, yPosition, {fontStyle: 'bold'});
  addText(pathologyTest?.status || "N/A", col2, yPosition);
  addText("Authorization", col3, yPosition, {fontStyle: 'bold'});
  addText(pathologyTest?.Authorization || "N/A", col4, yPosition);
  yPosition += 7;

  // Test Results
  if (results) {
    yPosition += 7;
    addText("Test Results", col1, yPosition, {fontStyle: 'bold', fontSize: 12});
    yPosition += 10;
    
    // Ultrasound Abdomen Results
    if (results.ultrasoundabdomenresultmodels) {
      const abdomenResults = results.ultrasoundabdomenresultmodels;
      addText("Kidney:", col1, yPosition, {fontStyle: 'bold'});
      addText(abdomenResults.Kidney || "N/A", col2, yPosition);
      yPosition += 7;
      
      addText("Comments:", col1, yPosition, {fontStyle: 'bold'});
      // Handle multi-line comments
      const comments = abdomenResults.Comment || "No comments";
      const splitComments = doc.splitTextToSize(comments, pageWidth - 30);
      addText(splitComments, col1, yPosition + 7);
      yPosition += (splitComments.length * 7) + 7;
    }
  }
  yPosition += 15;

  // Check if we need a new page
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 15;
  }

  // Payment Details
  addText("Payment Details", 15, yPosition, {
    fontSize: 14,
    color: [105, 105, 105]
  });
  yPosition += 8;
  addLine(yPosition);
  yPosition += 10;

  addText("Total Fees", col1, yPosition, {fontStyle: 'bold'});
  addText(`${pathologyTest?.Currency || "INR"} ${pathologyTest?.TotalFees || "0.00"}`, col2, yPosition);
  addText("Paid Amount", col3, yPosition, {fontStyle: 'bold'});
  addText(`${pathologyTest?.Currency || "INR"} ${pathologyTest?.PaidAmount || "0.00"}`, col4, yPosition);
  yPosition += 7;

  addText("Payment Status", col1, yPosition, {fontStyle: 'bold'});
  addText(pathologyTest?.PaymentStatus || "N/A", col2, yPosition);
  addText("Payment Date", col3, yPosition, {fontStyle: 'bold'});
  addText(pathologyTest?.PaymentDate || "N/A", col4, yPosition);
  yPosition += 7;

  if (pathologyTest?.commissionType) {
    addText("Commission Type", col1, yPosition, {fontStyle: 'bold'});
    addText(pathologyTest.commissionType === "1" ? "Percentage" : "Fixed", col2, yPosition);
    yPosition += 7;
    
    addText("Commission Value", col1, yPosition, {fontStyle: 'bold'});
    addText(pathologyTest.commissionValue || "N/A", col2, yPosition);
    yPosition += 7;
  }
  yPosition += 15;

  // Check if we need a new page
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 15;
  }

  // Doctor Details
  addText("Doctor Details", 15, yPosition, {
    fontSize: 14,
    color: [105, 105, 105]
  });
  yPosition += 8;
  addLine(yPosition);
  yPosition += 10;

  addText("Doctor Name", col1, yPosition, {fontStyle: 'bold'});
  addText(`${doctor?.FirstName || ""} ${doctor?.LastName || ""}`, col2, yPosition);
  addText("Registration No", col3, yPosition, {fontStyle: 'bold'});
  addText(doctor?.registrationNo || "N/A", col4, yPosition);
  yPosition += 7;

  addText("Email", col1, yPosition, {fontStyle: 'bold'});
  addText(doctor?.email || "N/A", col2, yPosition);
  addText("Phone", col3, yPosition, {fontStyle: 'bold'});
  addText(`${doctor?.countryCode || ""} ${doctor?.phoneNo || "N/A"}`, col4, yPosition);
  yPosition += 7;

  addText("Address", col1, yPosition, {fontStyle: 'bold'});
  addText(doctor?.address || "N/A", col2, yPosition);
  yPosition += 15;

  // Check if we need a new page
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 15;
  }

  // Additional Remarks
  if (pathologyTest?.remarks || pathologyTest?.feedback) {
    addText("Additional Information", 15, yPosition, {
      fontSize: 14,
      color: [105, 105, 105]
    });
    yPosition += 8;
    addLine(yPosition);
    yPosition += 10;

    if (pathologyTest?.remarks) {
      addText("Remarks:", col1, yPosition, {fontStyle: 'bold'});
      const remarks = doc.splitTextToSize(pathologyTest.remarks, pageWidth - 30);
      addText(remarks, col1, yPosition + 7);
      yPosition += (remarks.length * 7) + 10;
    }

    if (pathologyTest?.feedback) {
      addText("Feedback:", col1, yPosition, {fontStyle: 'bold'});
      const feedback = doc.splitTextToSize(pathologyTest.feedback, pageWidth - 30);
      addText(feedback, col1, yPosition + 7);
      yPosition += (feedback.length * 7) + 10;
    }
  }
  
  // Footer
  const footerY = pageHeight - 20;
  addText(`Note: This report is generated electronically and does not require a signature.`, 
    pageWidth / 2, footerY - 10, {
    fontSize: 10,
    align: 'center',
    color: [128, 128, 128]
  });
  
  addText(`© ${new Date().getFullYear()} ${hospitalData?.hospitalName || "City Care Hospital"} | All Rights Reserved`, 
    pageWidth / 2, footerY, {
    fontSize: 10,
    align: 'center',
    color: [105, 105, 105]
  });

  // Save the PDF
  const fileName = `${pathologyTest?.PatientName || 'patient'}-${pathologyTest?.id}-${typeData}-${formatDateSafely(pathologyTest?.createdAt)}-report.pdf`;
  doc.save(fileName);
};

export default generatePatientReportPDF;