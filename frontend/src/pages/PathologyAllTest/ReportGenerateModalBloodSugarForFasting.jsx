import JsBarcode from "jsbarcode";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../print.css";
import jsPDF from "jspdf";
import axios from "axios";
import AuthService from "../../services/auth.service";

function ReportModal({ show, handleClose, reportData, ReporttestName }) {
  //
  const [normalValues, setNormalValues] = useState({});
  const [normalValuesPDF, setNormalValuesPDF] = useState({});
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if (reportData?.lastRecord?.TestManagementID) {
      // Fetch normal values when the component mounts
      fetchNormalValues();
      fetchNormalValuesPDF();
    }
  }, [reportData?.lastRecord?.TestManagementID]);

  const reportDataTest = reportData?.bookings;
  console.log("reportDataTest:", reportData);
  //const [ reportData ,setSelectedReportData]=useState(null);
  if (!reportData) {
    return;
  }
  if (reportData?.lastRecord) {
    const reportResultData = reportData?.lastRecord;
    console.log(reportResultData);
    console.log("BloodSugarForFastingModelData" + reportResultData);
  }

  const fetchNormalValues = async () => {
    try {
      // alert(reportData?.lastRecord?.TestManagementID);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/testmanagementnormalvalues/${
          reportData?.lastRecord?.TestManagementID
        }`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = response.data;
      // alert(JSON.stringify(data));
      // Convert the data into an object with test keys as properties
      const normalValuesObject = {};
      data.forEach((item) => {
        normalValuesObject[item.fieldName] = {
          minimumRange: item.minimumRange,
          maximumRange: item.maximumRange,
          unitOfMeasurements: item.unitOfMeasurements,
        };
      });
      // alert(JSON.stringify(normalValuesObject));
      setNormalValues(normalValuesObject);
    } catch (error) {
      console.error("Error fetching normal values: " + error);
    }
  };
  const fetchNormalValuesPDF = async () => {
    try {
      // alert(reportData?.lastRecord?.TestManagementID);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/testmanagementnormalvalues/${
          reportData?.lastRecord?.TestManagementID
        }`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = response.data;

      setNormalValuesPDF(data);
    } catch (error) {
      console.error("Error fetching normal values: " + error);
    }
  };

  const getNormalValue = (testKey) => {
    switch (testKey) {
      default:
        return "NA";
    }
  };

  /////////////////////////////////////////////
  const handlePrint = async () => {
    const hospitalResponse = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
      {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      }
    );

    const hospitalData = hospitalResponse.data.data; // Assuming the hospital data is in the 'data' property

    const pdf = new jsPDF();
    pdf.setFontSize(12);

    // Add Hospital Name and Address
    // Add Hospital Name and Logo
    const hospitalName = hospitalData.hospitalName;
    const hospitalLogoBase64 = hospitalData.logo; // Assuming the logo is provided as a base64 string
    const hospitalAddressLine1 = hospitalData.address;
    const hospitalAddressLine2 = `${hospitalData.pincode}, India`;
    const email = `Mail: ${hospitalData.email}`;
    const landline = `Tel: ${hospitalData.landline}`;
    // Create a new Image object for the hospital logo
    const hospitalLogo = new Image();
    hospitalLogo.src = `data:image/png;base64,${hospitalLogoBase64}`; // Embed the base64 image data

    // Wait for the hospital logo to load before rendering the PDF
    hospitalLogo.onload = function () {
      // Add the hospital logo as an image to the PDF
      pdf.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);

      pdf.text(hospitalName, 20, 20);
      pdf.text(hospitalAddressLine1, 20, 30);
      pdf.text(hospitalAddressLine2, 20, 35);
      pdf.text(landline, 20, 40);
      pdf.text(email, 20, 45);
      pdf.setFillColor("#48bcdf");
      const titleText = `${ReporttestName} Test Report`; // Update the title as needed
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
      pdf.setTextColor("#0a0b0b");

      pdf.setFontSize(16);
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
        `Lab Name: LAB01`,
        pdf.internal.pageSize.getWidth() / 2 + 15,
        90
      );
      pdf.text(
        `Authorization Status: ${reportDataTest?.Authorization}`,
        pdf.internal.pageSize.getWidth() / 2 + 15,
        100
      );
      // pdf.text(
      //   `Doctor Feedback: ${reportDataTest?.feedback}`,
      //   pdf.internal.pageSize.getWidth() / 2 + 15,
      //   110
      // );
      console.log("Report ALL Data: " + JSON.stringify(reportData));

      // pdf.text(
      //   `Remarks: ${reportDataTest?.remarks}`,
      //   pdf.internal.pageSize.getWidth() / 2 + 15,
      //   110
      // );

      // Add Results
      pdf.line(0, 118, pdf.internal.pageSize.getWidth(), 118);

      const tests = Object.keys(reportData?.lastRecord || {}).map((key) => ({
        test: key,
        result: reportData?.lastRecord[key] || "",
      }));

      // Set column widths
      const col1Width = 90;
      const col2Width = 30;
      const col3Width = 70;

      const normalValuesArray = Object.values(normalValuesPDF);

      // Define header row and set font to bold
      pdf.setFont("helvetica");
      pdf.text("TEST", 20, 130);
      pdf.text("RESULT", 85, 130);
      pdf.text("NORMAL VALUES", 150, 130);

      // Add the test data in a tabular format
      let startY = 140;
      const lineHeight = 10;

      const excludedFields = [
        "id",
        "PatientID",
        "TestManagementID",
        "PatientTestBookingID",
        "createdAt",
        "updatedAt",
        "Remarks",
      ];

      // Filter the tests array to exclude the specified fields
      const filteredTests = tests.filter(
        (test) => !excludedFields.includes(test.test)
      );

      filteredTests.forEach((test) => {
        // Ensure that both test.result and test.normal are strings
        const result = String(test.result);

        // Find the corresponding normal values based on the test's fieldName
        const normalValue = normalValuesArray.find(
          (item) => item.fieldName === test.test
        );

        // Log the test and fieldName values for debugging
        console.log("Test:", test.test);
        console.log(
          "fieldName:",
          normalValue ? normalValue.fieldName : "Not found"
        );

        // Extract the minimum range, maximum range, and unit of measurement
        const minimumRange =
          normalValue?.minimumRange !== null
            ? normalValue?.minimumRange
            : "N/A";
        const maximumRange =
          normalValue?.maximumRange !== null
            ? normalValue?.maximumRange
            : "N/A";
        const unitOfMeasurement =
          normalValue?.unitOfMeasurements !== null
            ? normalValue?.unitOfMeasurements
            : "N/A";

        // Combine minimum range, maximum range, and unit of measurement into a single line
        const normalValuesText = `${minimumRange} - ${maximumRange} ${unitOfMeasurement}`;

        // Add the text to the PDF
        pdf.text(test.test, 20, startY);
        pdf.text(result !== "null" ? result : "N/A", 85, startY);
        pdf.text(
          normalValuesText !== "null" ? normalValuesText : "N/A",
          150,
          startY
        );

        startY += lineHeight;
      });

      // Add Footer Content
      pdf.setFontSize(10);
      pdf.setTextColor("#0a0b0b");

      // Add Horizontal Line
      pdf.line(
        0,
        pdf.internal.pageSize.getHeight() - 40,
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight() - 40
      );

      // Add Total Cost/Fees
      const totalFees = `Test Fees:  ${reportDataTest?.testFees} INR`;

      // pdf.text(
      //   totalFees,
      //   pdf.internal.pageSize.getWidth() / 2,
      //   pdf.internal.pageSize.getHeight() - 40
      // );

      // pdf.text(
      //   "Thank you for visiting!",
      //   pdf.internal.pageSize.getWidth() / 2,
      //   pdf.internal.pageSize.getHeight() - 40
      // );
      pdf.text(
        `Doctor Name: Dr ${reportData?.bookings?.DoctorName.replace(
          /\bNA\b/g,
          ""
        ).trim()} (MD Pathologist)`,
        20,
        pdf.internal.pageSize.getHeight() - 30
      );
      pdf.text(
        "Signature: ________________________",
        20,
        pdf.internal.pageSize.getHeight() - 20
      );

      const dateObject = new Date(reportData?.lastRecord?.updatedAt);

      // Get individual date and time components
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");
      const hours = String(dateObject.getHours()).padStart(2, "0");
      const minutes = String(dateObject.getMinutes()).padStart(2, "0");
      const seconds = String(dateObject.getSeconds()).padStart(2, "0");

      const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

      const canvas = document.createElement("canvas");

      // Generate the barcode with JsBarcode
      JsBarcode(canvas, formattedDate.toString(), {
        format: "CODE128", // Choose the barcode format that suits your needs
      });

      // Convert the canvas to a data URL
      const barcodeDataUrl = canvas.toDataURL("image/png");

      const barcodeImage = new Image();
      barcodeImage.src = barcodeDataUrl;
      pdf.addImage(
        barcodeImage,
        "PNG",
        pdf.internal.pageSize.getWidth() - 45,
        pdf.internal.pageSize.getHeight() - 35,
        40,
        15
      );

      pdf.setFillColor("#48bcdf");
      pdf.rect(
        0,
        pdf.internal.pageSize.getHeight() - 13,
        pdf.internal.pageSize.getWidth(),
        10,
        "F"
      );
      pdf.setTextColor("#ffffff");
      //pdf.setTextColor("#000000");
      pdf.setFontSize(12);

      pdf.text(
        "Powered by mediAI",
        pdf.internal.pageSize.getWidth() / 2 - 20,
        pdf.internal.pageSize.getHeight() - 7
      );
      // pdf.text(
      //   "Stamp: ___________________________",
      //   pdf.internal.pageSize.getWidth() / 2,
      //   pdf.internal.pageSize.getHeight() - 20
      // );

      // Add Image

      pdf.save("TestReport.pdf");
    };
  };

  return (
    <Modal
      style={{ marginTop: "20px", fontSize: "13px" }}
      centered
      backdrop="static"
      show={show}
      onHide={() => {
        handleClose();
      }}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "16px" }}>
          {ReporttestName} Test Reports
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
          <h2 style={{ fontSize: "16px" }}>Patient Information</h2>
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
            <strong>Lab Name:</strong> {reportDataTest?.lapName} LAB01
          </p>
          <p>
            <strong>Authorization Status:</strong>{" "}
            {reportDataTest?.Authorization}
          </p>
          <p>
            <strong>Authorization feedback:</strong> {reportDataTest?.feedback}
          </p>
          {/* <p>
            <strong>Instruments Used:</strong> {reportDataTest?.instrumentsUsed}
          </p>
          <p>
            <strong>Remarks:</strong> {reportDataTest?.remarks}
          </p> */}
          {/* <p>
            <strong>
              Test Fees: <span>&#8377;</span>
            </strong>{" "}
            {reportDataTest?.testFees}
          </p> */}
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
                <th style={{ textAlign: "center" }}>MINIMUM RANGE</th>
                <th style={{ textAlign: "center" }}>MAXIMUM RANGE</th>
                <th style={{ textAlign: "center" }}>UNIT OF MEASUREMENT</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(reportData?.lastRecord || {}).map(
                ([key, value]) => {
                  // Skip rendering the row for the excluded keys
                  if (
                    [
                      "PatientID",
                      "id",
                      "TestManagementID",
                      "PatientTestBookingID",
                      "createdAt",
                      "updatedAt",
                      "Remarks",
                    ].includes(key)
                  ) {
                    return "NA";
                  }

                  // Use the normalValues object to get the normal range details based on the key
                  const normalValue = normalValues[key];

                  // If normalValue exists, extract the details; otherwise, use placeholders
                  const minimumRange =
                    normalValue?.minimumRange !== null
                      ? normalValue?.minimumRange
                      : "N/A";
                  const maximumRange =
                    normalValue?.maximumRange !== null
                      ? normalValue?.maximumRange
                      : "N/A";
                  const unitOfMeasurement =
                    normalValue?.unitOfMeasurements !== null
                      ? normalValue?.unitOfMeasurements
                      : "N/A";

                  return (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value}</td>
                      <td style={{ textAlign: "center" }}>{minimumRange}</td>
                      <td style={{ textAlign: "center" }}>{maximumRange}</td>
                      <td style={{ textAlign: "center" }}>
                        {unitOfMeasurement}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
          <br />
          <p>
            <strong>Remarks:</strong>{" "}
            {reportData?.BloodSugarForFastingModelData?.Remarks || "NA"}
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
