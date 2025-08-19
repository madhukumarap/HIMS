import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./print.css";
import jsPDF from "jspdf";
import AuthService from "../services/auth.service";
function ReportModal({ show, handleClose, reportData }) {
  //
  const currentUser = AuthService.getCurrentUser();

  const reportDataTest = reportData?.booking;
  console.log("reportDataTest:", reportDataTest);
  //const [ reportData ,setSelectedReportData]=useState(null);
  if (!reportData) {
    return;
  }
  if (reportData?.T3T4TSHTestModelData) {
    const reportResultData = reportData?.T3T4TSHTestModelData;
    // console.log(reportResultData);
    console.log("T3T4TSHTestModelData" + reportResultData);
  }

  /////////////////////////////////////////////
  const handlePrint = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(12);

    // Add Hospital Name and Address
    const hospitalName = "Hospital Name";
    const hospitalAddressLine1 = "123 Hospital Street";
    const hospitalAddressLine2 = "City, India";
    pdf.text(hospitalName, 20, 20);
    pdf.text(hospitalAddressLine1, 20, 30);
    pdf.text(hospitalAddressLine2, 20, 35);

    pdf.setFillColor("#48bcdf");
    const titleText = "T3 T4 TSH Test Rport";
    const titleHeight = 10;
    pdf.rect(0, 53, pdf.internal.pageSize.getWidth(), titleHeight, "F");
    pdf.setTextColor("#ffffff"); // Set text color to white
    pdf.setFontSize(16); // Adjust font size as needed
    pdf.text(
      titleText,
      pdf.internal.pageSize.getWidth() / 2,
      55 + titleHeight / 2,
      {
        align: "center",
      }
    );

    pdf.setTextColor("#0a0b0b");
    // Add Patient Information on the left side
    pdf.text("Patient Information:", 20, 70);
    pdf.setFontSize(10);
    pdf.text(`Patient ID: ${reportDataTest?.PatientID}`, 20, 80);
    pdf.text(`Patient Name: ${reportDataTest?.PatientName}`, 20, 90);
    pdf.text(`Patient Phone: ${reportDataTest?.PatientPhoneNo}`, 20, 100);
    pdf.text(
      `Created Date: ${new Date(
        reportDataTest?.createdAt
      ).toLocaleDateString()}`,
      20,
      110
    );

    // Add Test Information on the right
    pdf.setFontSize(12);
    pdf.text(
      "Test Information:",
      pdf.internal.pageSize.getWidth() / 2 + 15,
      70
    );
    pdf.setFontSize(10);
    pdf.text(
      `Status: ${reportDataTest?.status}`,
      pdf.internal.pageSize.getWidth() / 2 + 15,
      80
    );
    pdf.text(
      `Lab Name: ${reportDataTest?.lapName}`,
      pdf.internal.pageSize.getWidth() / 2 + 15,
      90
    );
    pdf.text(
      `Instruments Used: ${reportDataTest?.instrumentsUsed}`,
      pdf.internal.pageSize.getWidth() / 2 + 15,
      100
    );
    pdf.text(
      `Remarks: ${reportDataTest?.remarks}`,
      pdf.internal.pageSize.getWidth() / 2 + 15,
      110
    );
    // pdf.text(
    //   `Test Fees: ${reportDataTest?.testFees}`,
    //   pdf.internal.pageSize.getWidth() / 2 + 15,
    //   120
    // );

    // Add Results
    pdf.line(0, 120, pdf.internal.pageSize.getWidth(), 120);
    // pdf.line(5, 5, 5, pdf.internal.pageSize.getHeight() - 5);

    // Define the test data with columns
    const tests = [
      {
        test: "T3 [ Tri - iodothyronine ]",
        result: reportData?.T3T4TSHTestModelData?.T3_Tri_iodothyronine || "",
        normal: "70 - 200 ng / dl",
      },
      {
        test: "T4 [ Thyroxine ]",
        result: reportData?.T3T4TSHTestModelData?.T4_Thyroxine || "",
        normal: "5.0 - 13.0 ug / dl",
      },
      {
        test: "TSH [ Thyroid Stimulating Hormone ]",
        result:
          reportData?.T3T4TSHTestModelData?.TSH_Thyroid_Stimulating_Hormone ||
          "",
        normal: "0.2 - 6.0 uIU / ml",
      },
    ];

    // Set column widths
    const col1Width = 90;
    const col2Width = 30;
    const col3Width = 70;

    // Define header row and set font to bold
    pdf.setFont("helvetica", "bold");
    pdf.text("TEST", 20, 145);
    pdf.text("RESULT", 110, 145);
    pdf.text("NORMAL VALUES", 140, 145);
    pdf.setFont("helvetica", "normal"); // Reset font to normal

    // Add the test data in a tabular format
    let startY = 155;
    const lineHeight = 10;

    tests.forEach((test) => {
      pdf.text(test.test, 20, startY);
      pdf.text(test.result, 110, startY);
      pdf.text(test.normal, 140, startY);
      startY += lineHeight;
    });

    // Add Footer Content
    pdf.setFontSize(10);
    pdf.setTextColor("#0a0b0b");

    // Add Horizontal Line
    pdf.line(
      0,
      pdf.internal.pageSize.getHeight() - 60,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight() - 60
    );

    // Add Total Cost/Fees
    const totalFees = `Test Fees:  ${reportDataTest?.testFees} INR`;

    pdf.text(
      totalFees,
      pdf.internal.pageSize.getWidth() / 2,
      pdf.internal.pageSize.getHeight() - 50
    );

    // Add Signature and Stamp
    pdf.text(
      "Thank you for visiting!",
      pdf.internal.pageSize.getWidth() / 2,
      pdf.internal.pageSize.getHeight() - 40
    );
    pdf.text(
      "Signature: ________________________",
      pdf.internal.pageSize.getWidth() / 2,
      pdf.internal.pageSize.getHeight() - 30
    );
    pdf.text(
      "Stamp: ___________________________",
      pdf.internal.pageSize.getWidth() / 2,
      pdf.internal.pageSize.getHeight() - 20
    );

    // Add Image
    const logoImage = new Image();
    logoImage.src =
      "https://thumbs.dreamstime.com/b/lab-tested-sign-circular-certificated-proven-icon-decorative-laboratory-flask-flat-style-lab-tested-icon-flat-style-212048597.jpg";
    logoImage.onload = function () {
      pdf.addImage(logoImage, "PNG", 160, 15, 30, 30);
      pdf.save("report.pdf");
    };
  };

  return (
    <Modal
      style={{ marginTop: "20px" }}
      centered
      backdrop="static"
      style={{ fontSize: "13px" }}
      show={show}
      onHide={() => {
        handleClose();
      }}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "16px" }}>
          T3 T4 TSH Test Report
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div className="report-container" style={{ width: "48%" }}>
          <h2 style={{ fontSize: "16px" }}>Patient Information:</h2>
          <p>
            <strong>Patient ID:</strong> {reportDataTest?.PatientID}
          </p>
          <p>
            <strong>Patient Name:</strong> {reportDataTest?.PatientName}
          </p>
          {/* <p><strong>Address:</strong> {reportDataTest?.Address}</p> */}
          <p>
            <strong>Patient Phone:</strong> {reportDataTest?.PatientPhoneNo}
          </p>
          <p>
            <strong>Booked Date:</strong>{" "}
            {new Date(reportDataTest?.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="report-container" style={{ width: "48%" }}>
          <h2 style={{ fontSize: "16px" }}>Test Information:</h2>
          <p>
            <strong>Status:</strong> {reportDataTest?.status}
          </p>
          <p>
            <strong>Lab Name:</strong> {reportDataTest?.lapName}
          </p>
          <p>
            <strong>Instruments Used:</strong> {reportDataTest?.instrumentsUsed}
          </p>
          <p>
            <strong>Remarks:</strong> {reportDataTest?.remarks}
          </p>
          <p>
            <strong>
              Test Fees: <span>&#8377;</span>
            </strong>{" "}
            {reportDataTest?.testFees}
          </p>
        </div>
      </Modal.Body>
      <Modal.Body>
        <div className="report-container">
          <h2 style={{ fontSize: "16px" }}>Results:</h2>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>TEST</th>
                <th style={{ textAlign: "center" }}>RESULT</th>
                <th style={{ textAlign: "center" }}>NORMAL VALUES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>T3 [ Tri - iodothyronine ]</td>
                <td>
                  {reportData?.T3T4TSHTestModelData?.T3_Tri_iodothyronine ||
                    "null"}
                </td>
                <td>70 - 200 ng / dl</td>
              </tr>
              <tr>
                <td>T4 [ Thyroxine ]</td>
                <td>
                  {reportData?.T3T4TSHTestModelData?.T4_Thyroxine || "null"}
                </td>
                <td>5.0 - 13.0 ug / dl</td>
              </tr>
              <tr>
                <td>TSH [ Thyroid Stimulating Hormone ]</td>
                <td>
                  {reportData?.T3T4TSHTestModelData
                    ?.TSH_Thyroid_Stimulating_Hormone || "null"}
                </td>
                <td>0.2 - 6.0 uIU / ml</td>
              </tr>
            </tbody>
          </table>
          <br></br>
          <p>
            <strong>Remarks:</strong>{" "}
            {reportData?.T3T4TSHTestModelData?.Remarks || "null"}
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          style={{ fontSize: "13px", padding: "4px 5px" }}
          onClick={handlePrint}
        >
          Download as PDF
        </Button>

        <Button
          variant="secondary"
          style={{
            fontSize: "13px",
            backgroundColor: "#777777",
            margintop: "10px",
            padding: "4px 5px",
          }}
          onClick={() => {
            handleClose(); // Close the modal
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReportModal;
