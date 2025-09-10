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


  // Diagnosis Details
  doc.setFontSize(14);
  doc.setTextColor(105, 105, 105);
  doc.text("Diagnosis Details", 15, yPosition);
  yPosition += 5;
if (mappedResults) {
    doc.setFontSize(14);
    doc.setTextColor(105, 105, 105);
    yPosition += 10;

const getReferenceAndUnit = (fieldName) => {
    fieldName = fieldName.toLowerCase();

    // ✅ Glucose & Sugar Tests
    if (fieldName.includes("glucose") || fieldName.includes("sugar") || fieldName.includes("blood glucose")) {
        return { referenceRange: "70 - 140", unit: "mg/dL" };
    }

    // ✅ Electrolytes
    else if (fieldName.includes("sodium")) {
        return { referenceRange: "135 - 145", unit: "mmol/L" };
    }
    else if (fieldName.includes("potassium")) {
        return { referenceRange: "3.5 - 5.1", unit: "mmol/L" };
    }
    else if (fieldName.includes("chloride")) {
        return { referenceRange: "98 - 107", unit: "mmol/L" };
    }
    else if (fieldName.includes("calcium")) {
        return { referenceRange: "8.5 - 10.5", unit: "mg/dL" };
    }
    else if (fieldName.includes("magnesium")) {
        return { referenceRange: "1.7 - 2.2", unit: "mg/dL" };
    }
    else if (fieldName.includes("phosphorus")) {
        return { referenceRange: "2.5 - 4.5", unit: "mg/dL" };
    }

    // ✅ Kidney Function Tests
    else if (fieldName.includes("creatinine")) {
        return { referenceRange: "0.6 - 1.3", unit: "mg/dL" };
    }
    else if (fieldName.includes("bun") || fieldName.includes("urea")) {
        return { referenceRange: "7 - 20", unit: "mg/dL" };
    }
    else if (fieldName.includes("uric acid")) {
        return { referenceRange: "3.5 - 7.2", unit: "mg/dL" };
    }

    // ✅ Liver Function Tests
    else if (fieldName.includes("sgpt") || fieldName.includes("alt")) {
        return { referenceRange: "7 - 56", unit: "U/L" };
    }
    else if (fieldName.includes("sgot") || fieldName.includes("ast")) {
        return { referenceRange: "10 - 40", unit: "U/L" };
    }
    else if (fieldName.includes("bilirubin")) {
        return { referenceRange: "0.3 - 1.2", unit: "mg/dL" };
    }
    else if (fieldName.includes("alkaline phosphatase")) {
        return { referenceRange: "44 - 147", unit: "U/L" };
    }
    else if (fieldName.includes("albumin")) {
        return { referenceRange: "3.5 - 5.0", unit: "g/dL" };
    }

    // ✅ Lipid Profile
    else if (fieldName.includes("total cholesterol") || (fieldName.includes("cholesterol") && !fieldName.includes("hdl") && !fieldName.includes("ldl") && !fieldName.includes("vldl"))) {
        return { referenceRange: "< 200", unit: "mg/dL" };
    }
    else if (fieldName.includes("hdl")) {
        return { referenceRange: "≥ 40 (men), ≥ 50 (women)", unit: "mg/dL" };
    }
    else if (fieldName.includes("ldl")) {
        return { referenceRange: "< 100 (optimal)", unit: "mg/dL" };
    }
    else if (fieldName.includes("vldl")) {
        return { referenceRange: "5 - 30", unit: "mg/dL" };
    }
    else if (fieldName.includes("triglyceride")) {
        return { referenceRange: "< 150", unit: "mg/dL" };
    }
    else if (fieldName.includes("cholesterol/hdl ratio") || fieldName.includes("hdl ratio")) {
        return { referenceRange: "< 5.0 (ideal < 3.5)", unit: "ratio" };
    }

    // ✅ Thyroid Function Tests
    else if (fieldName.includes("tsh")) {
        return { referenceRange: "0.4 - 4.0", unit: "µIU/mL" };
    }
    else if (fieldName.includes("t3")) {
        return { referenceRange: "80 - 200", unit: "ng/dL" };
    }
    else if (fieldName.includes("t4")) {
        return { referenceRange: "4.5 - 11.2", unit: "µg/dL" };
    }

    // ✅ CBC (Complete Blood Count)
    else if (fieldName.includes("hemoglobin") || fieldName.includes("hb")) {
        return { referenceRange: "12 - 16", unit: "g/dL" };
    }
    else if (fieldName.includes("rbc")) {
        return { referenceRange: "4.7 - 6.1", unit: "mill/µL" };
    }
    else if (fieldName.includes("wbc") || fieldName.includes("white blood cell")) {
        return { referenceRange: "4,000 - 11,000", unit: "/µL" };
    }
    else if (fieldName.includes("platelet")) {
        return { referenceRange: "150,000 - 450,000", unit: "/µL" };
    }
    else if (fieldName.includes("mcv")) {
        return { referenceRange: "80 - 100", unit: "fL" };
    }

    // ✅ Vitamin Tests
    else if (fieldName.includes("vitamin d")) {
        return { referenceRange: "20 - 50", unit: "ng/mL" };
    }
    else if (fieldName.includes("vitamin b12")) {
        return { referenceRange: "200 - 900", unit: "pg/mL" };
    }

    // ✅ Final Fallback → Default Range
    return { referenceRange: "N/A", unit: "" };
};

    // Function to check if value is abnormal dynamically
     const isAbnormalValue = (fieldName, value) => {
        if (!value || value === "N/A" || isNaN(value)) return false;
        const numericValue = parseFloat(value);
        fieldName = fieldName.toLowerCase();

        if (fieldName.includes("glucose") || fieldName.includes("sugar") || fieldName.includes("blood")) {
            return numericValue < 70 || numericValue > 140;
        }
        if (fieldName.includes("sodium")) {
            return numericValue < 135 || numericValue > 145;
        }
        if (fieldName.includes("calcium")) {
            return numericValue < 8.5 || numericValue > 10.5;
        }
        return false;
    };

    // Process each test dynamically from mappedResults
    const testResultsData = [];
    Object.keys(mappedResults).forEach(testName => {
        const resultData = mappedResults[testName];
        if (!resultData) return;

        Object.keys(resultData).forEach(field => {
            if (["id", "PatientID", "TestManagementID", "Comment", "PatientTestBookingID", "createdAt", "updatedAt"].includes(field)) {
                return;
            }

            const value = resultData[field] || "N/A";
            const { referenceRange, unit } = getReferenceAndUnit(field);
            const abnormal = isAbnormalValue(field, value);
            const indicator = abnormal ? "Abnormal" : "Normal";

            testResultsData.push([
                testName,
                field,
                value,
                unit,
                referenceRange,
                indicator,
                abnormal
            ]);
        });
    });


    // Create the dynamic test results table
    if (testResultsData.length > 0) {
        doc.autoTable({
            startY: yPosition,
            head: [["Test Name", "Parameter","Result", "Unit", "Reference Range", "Indicator"]],
body: testResultsData.map(row => [
    row[0], // Test Name
    row[1], // Parameter
    row[2], // Result ✅ FIXED
    row[3], // Unit
    row[4], // Reference Range ✅ FIXED
    row[5]  // Indicator (Normal / Abnormal) ✅ FIXED
]),
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
  // Check page break before adding feedback heading
  checkPageBreak(30);

  // Add "Feedback:" label
  addText("Feedback:", col1, yPosition, { fontStyle: 'bold' });

  const feedbackLines = doc.splitTextToSize(pathologyTest.feedback, pageWidth - 30);
  const lineHeight = 7;

  // Start slightly below the heading
  yPosition += 7;

  // Loop through each line and handle page breaks properly
  feedbackLines.forEach((line) => {
    // Check if there's enough space on the current page
    if (yPosition + lineHeight > pageHeight - 20) {
      doc.addPage();
      yPosition = 15; // Reset Y position for new page
    }

    // Add the feedback line
    addText(line, col1, yPosition);
    yPosition += lineHeight;
  });

  // Add some spacing after feedback
  yPosition += 10;
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