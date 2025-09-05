import jsPDF from "jspdf";
import { format, isDate } from "date-fns";

const generatePatientReportPDF = (typeData, hospitalData, pathologyTest, selectedTests, doctor, results, medicineData) => {
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
    return isNaN(date.getTime()) ? "N/A" : format(date, "dd-MMM-yyyy HH:mm");
  };

  // Helper function to check page break
  const checkPageBreak = (requiredSpace = 20) => {
    if (yPosition > pageHeight - requiredSpace) {
      doc.addPage();
      yPosition = 15;
      return true;
    }
    return false;
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
    // fontSize: 18,
    // align: 'center',
    // color: [0, 0, 255]
  // });
  yPosition += 8;
  
  // addText("Patient Diagnosis Report", pageWidth / 2, yPosition, {
    // fontSize: 16,
    // align: 'center',
    // color: [0, 128, 0]
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
  checkPageBreak(50);

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
    addText("Expiry Date", col3, yPosition, {fontStyle: 'bold'});
    addText("Qty", col4, yPosition, {fontStyle: 'bold'});
    yPosition += 7;

    addText("Unit Price", col1, yPosition, {fontStyle: 'bold'});
    addText("Total Cost", col2, yPosition, {fontStyle: 'bold'});
    yPosition += 7;

    addLine(yPosition);
    yPosition += 5;

    // Medicine items
    medicineData.forEach((medicine, index) => {
      // Check if we need a new page
      checkPageBreak(30);
      
      addText(medicine.MedicineName || "N/A", col1, yPosition);
      addText(formatDateSafely(medicine.ExpiryDate), col3, yPosition);
      addText(medicine.Quantity || "N/A", col4, yPosition);
      yPosition += 7;

      addText(`${medicine.UnitPrice || "0.00"}`, col1, yPosition);
      addText(`${medicine.EachmedicineCost || "0.00"}`, col2, yPosition);
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
  checkPageBreak(50);

  // Diagnosis Details
   doc.setFontSize(14);
  doc.setTextColor(105, 105, 105);
  doc.text("Diagnosis Details", 15, yPosition);
  yPosition += 10;

  const diagnosisData = [
    ["Test Name", pathologyTest?.selectedTests || "N/A", "Procedure", pathologyTest?.procedure || "N/A"],
    ["Status", pathologyTest?.status || "N/A", "Authorization", pathologyTest?.Authorization || "N/A"]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [["Field", "Value", "Field", "Value"]],
    body: diagnosisData,
    theme: 'grid',
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 30 },
      1: { cellWidth: 50 },
      2: { fontStyle: 'bold', cellWidth: 30 },
      3: { cellWidth: 50 }
    },
    margin: { left: 15 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Test Results Tables
  if (results) {
    doc.setFontSize(14);
    doc.setTextColor(105, 105, 105);
    doc.text("Test Results", 15, yPosition);
    yPosition += 10;

    // Ultrasound Abdomen Results
    if (results.ultrasoundabdomenresultmodels) {
      const abdomenResults = results.ultrasoundabdomenresultmodels;
      
      const abdomenData = [
        ["Kidney", abdomenResults.Kidney || "N/A"]
      ];

      doc.autoTable({
        startY: yPosition,
        head: [["Test", "Result"]],
        body: abdomenData,
        theme: 'grid',
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        styles: { fontSize: 10 },
        margin: { left: 15 }
      });

      yPosition = doc.lastAutoTable.finalY + 10;

      // Comments as a separate table
      if (abdomenResults.Comment) {
        const commentData = [
          ["Comments", abdomenResults.Comment || "No comments"]
        ];

        doc.autoTable({
          startY: yPosition,
          body: commentData,
          theme: 'grid',
          styles: { fontSize: 10 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 25 },
            1: { cellWidth: 'auto' }
          },
          margin: { left: 15 }
        });

        yPosition = doc.lastAutoTable.finalY + 15;
      }
    }
    
    // Multiple test results table
    if (Array.isArray(results)) {
      const testResultsData = results.map(test => [
        test.testName || "N/A",
        test.TestStatus || "N/A",
        test.TestSamplecollectedDateTime ? formatDateSafely(test.TestSamplecollectedDateTime) : "N/A",
        test.TestCompletedDateTime ? formatDateSafely(test.TestCompletedDateTime) : "N/A"
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [["Test Name", "Status", "Sample Collected", "Completed"]],
        body: testResultsData,
        theme: 'grid',
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        styles: { fontSize: 9 }, // Smaller font to fit more data
        margin: { left: 15 },
        pageBreak: 'auto'
      });

      yPosition = doc.lastAutoTable.finalY + 15;
    }
  }


  // Check if we need a new page
  checkPageBreak(50);

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
  checkPageBreak(50);

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
  checkPageBreak(50);

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
      // Check page break before adding remarks
      checkPageBreak(30);
      
      addText("Remarks:", col1, yPosition, {fontStyle: 'bold'});
      const remarks = doc.splitTextToSize(pathologyTest.remarks, pageWidth - 30);
      
      // Calculate height needed for remarks
      const remarksHeight = remarks.length * 7;
      
      // Check if we need a new page for remarks
      if (yPosition + remarksHeight > pageHeight - 20) {
        doc.addPage();
        yPosition = 15;
      }
      
      addText(remarks, col1, yPosition + 7);
      yPosition += remarksHeight + 10;
    }

    if (pathologyTest?.feedback) {
      // Check page break before adding feedback
      checkPageBreak(30);
      
      addText("Feedback:", col1, yPosition, {fontStyle: 'bold'});
      const feedback = doc.splitTextToSize(pathologyTest.feedback, pageWidth - 30);
      
      // Calculate height needed for feedback
      const feedbackHeight = feedback.length * 7;
      
      // Check if we need a new page for feedback
      if (yPosition + feedbackHeight > pageHeight - 20) {
        doc.addPage();
        yPosition = 15;
      }
      
      addText(feedback, col1, yPosition + 7);
      yPosition += feedbackHeight + 10;
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