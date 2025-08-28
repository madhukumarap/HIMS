import jsPDF from "jspdf";
import { format, isDate } from "date-fns";

const generatePatientReportPDF1 = (rowData, typeData, hospitalData, medicineData, inventoryData) => {
  console.log("PDF Data:", rowData, hospitalData, medicineData, inventoryData);
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
  addText(hospitalData?.hospitalName || "City Care Hospital", pageWidth / 2, yPosition, {
    fontSize: 18,
    align: 'center',
    color: [0, 0, 255]
  });
  yPosition += 8;
  
  addText("Patient Medical Report", pageWidth / 2, yPosition, {
    fontSize: 16,
    align: 'center',
    color: [0, 128, 0]
  });
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
  addText(`Report ID: ${rowData?.id || "N/A"}`, reportInfoX, yRight, {align: 'right'});
  yRight += 7;
  addText(`Date: ${rowData?.date ? formatDateSafely(rowData.date) : "N/A"}`, reportInfoX, yRight, {align: 'right'});
  yRight += 7;
  addText(`Type: ${typeData || "Appointment"}`, reportInfoX, yRight, {align: 'right'});
  
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
  addText(rowData?.patientName || "N/A", col2, yPosition);
  addText("Phone", col3, yPosition, {fontStyle: 'bold'});
  addText(rowData?.phone || "N/A", col4, yPosition);
  yPosition += 7;
  
  addText("Doctor Name", col1, yPosition, {fontStyle: 'bold'});
  addText(rowData?.doctorName || "N/A", col2, yPosition);
  addText("Doctor Mobile", col3, yPosition, {fontStyle: 'bold'});
  addText(rowData?.doctorMobile || "N/A", col4, yPosition);
  yPosition += 7;
  
  addText("Status", col1, yPosition, {fontStyle: 'bold'});
  addText(rowData?.status || "N/A", col2, yPosition);
  addText("Payment Status", col3, yPosition, {fontStyle: 'bold'});
  addText(rowData?.paymentStatus || "N/A", col4, yPosition);
  yPosition += 7;
  
  addText("Referral Type", col1, yPosition, {fontStyle: 'bold'});
  addText(rowData?.referralType || "N/A", col2, yPosition);
  addText("Amount", col3, yPosition, {fontStyle: 'bold'});
  addText(`${rowData?.currency || "INR"} ${rowData?.amount || "0.00"}`, col4, yPosition);
  yPosition += 15;

  // Check if we need a new page
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 15;
  }

  // Appointment Details
  addText("Appointment Details", 15, yPosition, {
    fontSize: 14,
    color: [105, 105, 105]
  });
  yPosition += 8;
  addLine(yPosition);
  yPosition += 10;

  if (rowData?.remarks) {
    addText("Remarks:", col1, yPosition, {fontStyle: 'bold'});
    const remarks = doc.splitTextToSize(rowData.remarks, pageWidth - 30);
    addText(remarks, col1, yPosition + 7);
    yPosition += (remarks.length * 7) + 15;
  }

  // Medicine Details (if available)
  if (medicineData && medicineData.length > 0) {
    addText("Prescribed Medicines", 15, yPosition, {
      fontSize: 14,
      color: [105, 105, 105]
    });
    yPosition += 8;
    addLine(yPosition);
    yPosition += 10;

    // Table headers
    addText("Medicine Name", col1, yPosition, {fontStyle: 'bold'});
    addText("Batch No", col2, yPosition, {fontStyle: 'bold'});
    addText("Expiry Date", col3, yPosition, {fontStyle: 'bold'});
    addText("Qty", col4, yPosition, {fontStyle: 'bold'});
    yPosition += 7;

    addText("Unit Price", col1, yPosition, {fontStyle: 'bold'});
    addText("Total Cost", col2, yPosition, {fontStyle: 'bold'});
    addText("Currency", col3, yPosition, {fontStyle: 'bold'});
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
        addText("Batch No", col2, yPosition, {fontStyle: 'bold'});
        addText("Expiry Date", col3, yPosition, {fontStyle: 'bold'});
        addText("Qty", col4, yPosition, {fontStyle: 'bold'});
        yPosition += 7;

        addText("Unit Price", col1, yPosition, {fontStyle: 'bold'});
        addText("Total Cost", col2, yPosition, {fontStyle: 'bold'});
        addText("Currency", col3, yPosition, {fontStyle: 'bold'});
        yPosition += 7;

        addLine(yPosition);
        yPosition += 5;
      }

      addText(medicine.MedicineName || "N/A", col1, yPosition);
      addText(medicine.BatchNumber || "N/A", col2, yPosition);
      addText(formatDateSafely(medicine.ExpiryDate), col3, yPosition);
      addText(medicine.Quantity || "N/A", col4, yPosition);
      yPosition += 7;

      addText(`${medicine.UnitPrice || "0.00"}`, col1, yPosition);
      addText(`${medicine.EachmedicineCost || "0.00"}`, col2, yPosition);
      addText(medicine.EachMedicineCurrency || "INR", col3, yPosition);
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

  // Inventory Details (if available)
  if (inventoryData && inventoryData.length > 0) {
    addText("Inventory Details", 15, yPosition, {
      fontSize: 14,
      color: [105, 105, 105]
    });
    yPosition += 8;
    addLine(yPosition);
    yPosition += 10;

    // Table headers for inventory
    const invCol1 = 15;
    const invCol2 = 50;
    const invCol3 = 80;
    const invCol4 = 110;
    const invCol5 = 140;
    const invCol6 = 170;
    
    addText("Item Name", invCol1, yPosition, {fontStyle: 'bold'});
    addText("SKU", invCol2, yPosition, {fontStyle: 'bold'});
    addText("Batch No", invCol3, yPosition, {fontStyle: 'bold'});
    addText("Expiry", invCol4, yPosition, {fontStyle: 'bold'});
    addText("Qty", invCol5, yPosition, {fontStyle: 'bold'});
    addText("Price", invCol6, yPosition, {fontStyle: 'bold'});
    yPosition += 7;
    
    addLine(yPosition);
    yPosition += 5;

    // Inventory items
    inventoryData.forEach((item, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 15;
        
        // Add table headers again on new page
        addText("Item Name", invCol1, yPosition, {fontStyle: 'bold'});
        addText("SKU", invCol2, yPosition, {fontStyle: 'bold'});
        addText("Batch No", invCol3, yPosition, {fontStyle: 'bold'});
        addText("Expiry", invCol4, yPosition, {fontStyle: 'bold'});
        addText("Qty", invCol5, yPosition, {fontStyle: 'bold'});
        addText("Price", invCol6, yPosition, {fontStyle: 'bold'});
        yPosition += 7;
        
        addLine(yPosition);
        yPosition += 5;
      }

      addText(item.itemName || "N/A", invCol1, yPosition);
      addText(item.SKU || "N/A", invCol2, yPosition);
      addText(item.batchNo || "N/A", invCol3, yPosition);
      addText(formatDateSafely(item.expiryDate), invCol4, yPosition);
      addText(item.balanceQuantity || "0", invCol5, yPosition);
      addText(`${item.Currency || "INR"} ${item.unitPrice || "0.00"}`, invCol6, yPosition);
      yPosition += 7;
      
      // Add line between items (except after last item)
      if (index < inventoryData.length - 1) {
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

  // Payment Details
  addText("Payment Details", 15, yPosition, {
    fontSize: 14,
    color: [105, 105, 105]
  });
  yPosition += 8;
  addLine(yPosition);
  yPosition += 10;

  addText("Total Fees", col1, yPosition, {fontStyle: 'bold'});
  addText(`${rowData?.currency || "INR"} ${rowData?.totalFees || "0.00"}`, col2, yPosition);
  addText("Paid Amount", col3, yPosition, {fontStyle: 'bold'});
  addText(`${rowData?.currency || "INR"} ${rowData?.amount || "0.00"}`, col4, yPosition);
  yPosition += 7;

  addText("Payment Status", col1, yPosition, {fontStyle: 'bold'});
  addText(rowData?.paymentStatus || "N/A", col2, yPosition);
  addText("Payment Date", col3, yPosition, {fontStyle: 'bold'});
  addText(formatDateSafely(rowData?.date), col4, yPosition);
  yPosition += 15;

  // Footer
  const footerY = pageHeight - 10;
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
  const fileName = `${rowData?.patientName || 'patient'}-${rowData?.id}-${typeData}-${formatDateSafely(rowData?.date)}-report.pdf`;
  doc.save(fileName);
};

export default generatePatientReportPDF1;