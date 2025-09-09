import jsPDF from "jspdf";
import { format, isDate } from "date-fns";

const generatePatientReportPDF = (typeData, hospitalData, pathologyTest, selectedTests, doctor, results, medicineData) => {
  console.log(hospitalData, pathologyTest, selectedTests, doctor, results, medicineData);
  const normalize = (str) => str.toLowerCase().replace(/[\s()]+/g, "");

// Create mapping dynamically
const mappedResults = {};

selectedTests.forEach(testName => {
    const normalizedName = normalize(testName);

    // Find matching key in results dynamically
    const matchedKey = Object.keys(results).find(key => normalize(key).includes(normalizedName));

    mappedResults[testName] = matchedKey ? results[matchedKey] : null;
});

console.log(mappedResults);

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
  
  yPosition = Math.max(yPosition, yRight) + 15;
  addLine(yPosition);
  yPosition += 10;

  // Patient Information
  addText("Patient Information", 15, yPosition, {
    fontSize: 14,
    color: [105, 105, 105]
  });
  yPosition += 4;
  addLine(yPosition);
  yPosition += 5;

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
 addText("Doctor Details", 15, yPosition, {
    fontSize: 14,
    color: [105, 105, 105]
  });
  yPosition += 5;
  addLine(yPosition);
  yPosition += 5;

  addText("Doctor Name", col1, yPosition, {fontStyle: 'bold'});
  addText(`${doctor?.FirstName || pathologyTest?.DoctorName} ${doctor?.LastName || ""}`, col2, yPosition);


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
  yPosition += 5;
if (mappedResults) {
    doc.setFontSize(14);
    doc.setTextColor(105, 105, 105);
    yPosition += 10;

    const testResultsData = [];

    // Function to determine unit & reference dynamically
    const getReferenceAndUnit = (fieldName) => {
        fieldName = fieldName.toLowerCase();

        if (fieldName.includes("glucose") ||fieldName.includes("Glucose")|| fieldName.includes("sugar") ||fieldName.includes("Sugar") || fieldName.includes("blood") ||fieldName.includes("Blood")) {
            return { referenceRange: "70-140", unit: "mg/dL" };
        } else if (fieldName.includes("kidney")) {
            return { referenceRange: "Normal", unit: "" };
        } else {
            return { referenceRange: "70-150", unit: "mg/dL" };
        }
    };

    // Function to check if value is abnormal dynamically
    const isAbnormalValue = (fieldName, value) => {
        if (!value || value === "N/A" || isNaN(value)) return false;
        fieldName = fieldName.toLowerCase();
        const numericValue = parseFloat(value);

        if (fieldName.includes("blood") || fieldName.includes("sugar") || fieldName.includes("glucose")) {
            // General ranges for blood/glucose-related tests
            if (fieldName.includes("fasting")) {
                return numericValue >= 126; // Fasting abnormal threshold
            }
            return numericValue >= 200; // Post-meal abnormal threshold
        }
        if (fieldName.includes("kidney")) {
            return value !== "Normal" && value !== "normal";
        }
        return false;
    };

    // Process each test dynamically from mappedResults
    Object.keys(mappedResults).forEach(testName => {
        const resultData = mappedResults[testName];
        if (!resultData) return;

        // Dynamically pick the first numeric or relevant field from resultData
        const valueField = Object.keys(resultData).find(key =>
            typeof resultData[key] === "string" &&
            (/\d/.test(resultData[key]) || key.toLowerCase().includes("kidney"))
        );

        const value = valueField ? resultData[valueField] : "N/A";
        const { referenceRange, unit } = getReferenceAndUnit(valueField || "70 - 150");
        const abnormal = isAbnormalValue(valueField || "", value);
        const indicator = abnormal ? "Abnormal" : "Normal";

        testResultsData.push([
            testName,
            value,
            referenceRange,
            unit,
            indicator,
            abnormal
        ]);
    });

    // Create the dynamic test results table
    if (testResultsData.length > 0) {
        doc.autoTable({
            startY: yPosition,
            head: [["Test Name", "Result", "Unit", "Reference Range", "Indicator"]],
            body: testResultsData.map(row => [row[0], row[1], row[3], row[2], row[4]]),
            theme: 'grid',
            headStyles: {
                fillColor: [220, 220, 220],
                textColor: [0, 0, 0],
                fontStyle: 'bold'
            },
            styles: { fontSize: 10 },
            margin: { left: 15 },
            didDrawCell: (data) => {
                const rowIndex = data.row.index;
                const isAbnormal = testResultsData[rowIndex][5];

                if ((data.column.index === 1 || data.column.index === 4) && isAbnormal) {
                    doc.setFont(undefined, 'bold');
                    doc.setTextColor(255, 0, 0);
                }
            },
            willDrawCell: () => {
                doc.setFont(undefined, 'normal');
                doc.setTextColor(0, 0, 0);
            }
        });

        yPosition = doc.lastAutoTable.finalY + 15;
    }

    // Add dynamic comments section
    let comments = [];
    Object.keys(mappedResults).forEach(testName => {
        const resultData = mappedResults[testName];
        if (resultData && resultData.Comment) {
            comments.push(`${testName}: ${resultData.Comment}`);
        }
    });

    if (comments.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(105, 105, 105);
    doc.text("Comments:", 15, yPosition);
    yPosition += 8;

    comments.forEach((comment, index) => {
        checkPageBreak(20);

        // Split the comment into lines if it's too long
        const formattedComment = doc.splitTextToSize(comment, pageWidth - 30);

        // Set proper font and color for the comment
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(formattedComment, 20, yPosition);

        // Increase yPosition based on actual text height, without adding extra space
        yPosition += formattedComment.length * 5;

        // Add small spacing ONLY between comments (not after the last one)
        if (index < comments.length - 1) {
            yPosition += 3;
        }
    });

    yPosition += 5;
}

}


  // Important Instructions
  checkPageBreak(50);
  addText("IMPORTANT INSTRUCTIONS", pageWidth / 2.5, yPosition, {
    fontSize: 14,
    align: 'right',
    color: [0, 0, 0],
    fontStyle: 'bold'
  });
  yPosition += 10;
  
  const diabetesInfo = [
    "1. The diagnosis of Diabetes requires a fasting plasma glucose of > or = 126 mg/dL .",
    "2. The  random / 2 hr post glucose value of > or = 200 mg/dL on at least 2 occasions.",
    "3. Very low glucose levels cause severe CNS dysfunction",
    "4. Very high glucose levels (>450 mg/dL in adults) may result in Diabetic Ketoacidosis & is considered critical"
  ];

  diabetesInfo.forEach(info => {
    checkPageBreak(20);
    const formattedInfo = doc.splitTextToSize(info, pageWidth - 30);
    addText(formattedInfo, 20, yPosition);
    yPosition += (formattedInfo.length * 7) + 2;
  });

  yPosition += 5;

  // Check if we need a new page
  checkPageBreak(50);

  // Doctor Details
  
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

  yPosition += 5;

  // Footer
  const footerY = pageHeight - 20;
    
  // Add copyright text
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