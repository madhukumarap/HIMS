import JsBarcode from "jsbarcode";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { Modal, Form, Col, Button, Table } from "react-bootstrap";
import Translation from "../../translations/Pathologytest.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import AuthService from "../../services/auth.service";
import { toast } from "react-toastify";

const DownloadPDFButton = ({ testBookingID }) => {
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();

  const locales = { enIN, fr };

  useEffect(() => {
    const initializei18n = () => {
      const resources = {
        en: {
          translation: Translation["en"],
        },
        fr: {
          translation: Translation["fr"],
        },
      };

      const storedLanguage = localStorage.getItem("SelectedLanguage");
      const defaultLanguage = storedLanguage || "en";

      i18n.use(initReactI18next).init({
        resources,
        lng: defaultLanguage,
        fallbackLng: "en",
        interpolation: {
          escapeValue: false,
          format: (value, format, lng) => {
            if (isDate(value)) {
              const locale = locales[lng];
              return formatDate(value, format, { locale });
            }
          },
        },
      });
    };

    initializei18n();
    // const intervalId = setInterval(initializei18n, 1000);
    // return () => clearInterval(intervalId);
  }, []);

  const [testResults, setTestResults] = useState(null);
  const [normalValues, setNormalValues] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [PathologyTest, setPathologyTest] = useState(null);
  const [testNames, setTestNames] = useState(null);
  const [testNamesStatus, setTestNamesStatus] = useState(null);

  const [showModal, setShowModal] = useState(true);
  const [Doctor, setDoctor] = useState(null);
  const [DoctorSign, setDoctorSign] = useState("");
  const handleModalClose = () => {
    setShowModal(false);
    window.location.reload();
  };
  const handleModalShow = () => setShowModal(true);

  const fetchTestStatuses = async (testBookingID) => {
    try {
      // alert(bookingId);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/PathologyTestStatuses/${testBookingID}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setTestNamesStatus(data);
      console.log("testStatuses", testNamesStatus);
      // alert(JSON.stringify(testStatuses));
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const fetchData = async (testBookingID) => {
    try {
      // Fetch test results (which already includes Doctor data)
      const testResponse = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/getLastRecordByPatientTestBookingIDForMultipleTest/${testBookingID}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      if (!testResponse.ok) {
        throw new Error(`Failed to fetch test data: ${testResponse.status}`);
      }

      const testData = await testResponse.json();

      console.log(testData, "testData");

      setPathologyTest(testData.pathologyTest);
      setTestNames(testData.selectedTestsArray);

      const filteredResults = Object.fromEntries(
        Object.entries(testData.results).filter(
          ([key, value]) => value !== null
        )
      );

      setTestResults(filteredResults);

      // Use the Doctor data that came with the test response
      setDoctor(testData.Doctor);
      setDoctorSign(testData.Doctor?.signatureImage);

      // Fetch hospital data
      const hospitalResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      if (!hospitalResponse.ok) {
        console.error("Failed to fetch hospital data");
      } else {
        const hospitalData = await hospitalResponse.json();
        setHospitalData(hospitalData.data);
      }
    } catch (error) {
      console.error("Error in fetchData:", error);
      toast.error(error.message || "Failed to fetch data");
    }
  };

  const fetchNormalValues = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/testmanagementnormalvalues`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      //alert(data);
      setNormalValues(data);
    } catch (error) {
      console.error("Error fetching normal values:", error);
    }
  };

  useEffect(() => {
    if (testBookingID) {
      fetchData(testBookingID);
      fetchTestStatuses(testBookingID);
    }
    fetchNormalValues();
  }, [testBookingID]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    let pageNumber = 1;
    // alert(JSON.stringify(PathologyTest));

    if (testResults && normalValues) {
      let index = 0;
      //  testNames.forEach((testName) => {
      Object.entries(testResults).forEach(
        ([testNamess, testResult], currentIndex, array) => {
          // Check if the testResult object is empty
          if (Object.keys(testResult).length === 0) {
            return; // Skip empty testResult objects
          }

          const tableData = Object.entries(testResult).map(([key, value]) => {
            const matchingNormalValue = normalValues.find(
              (item) => item.fieldName === key
            );

            const minimumRange =
              matchingNormalValue?.minimumRange !== null
                ? matchingNormalValue?.minimumRange
                : "N/A";
            const maximumRange =
              matchingNormalValue?.maximumRange !== null
                ? matchingNormalValue?.maximumRange
                : "N/A";
            const unitOfMeasurements =
              matchingNormalValue?.unitOfMeasurements !== null
                ? matchingNormalValue?.unitOfMeasurements
                : "N/A";

            if (matchingNormalValue) {
              return [
                key,
                value !== null ? value : "N/A",
                `${minimumRange} - ${maximumRange}`,
                unitOfMeasurements,
              ];
            }

            return [key, value !== null ? value : "N/A", "N/A", "N/A"];
          });

          console.log(tableData, "tableData");

          if (tableData.length > 0) {
            doc.setFontSize(12);

            const addHospitalInfo = () => {
              const hospitalName = hospitalData?.hospitalName || "N/A";
              const hospitalAddressLine1 = hospitalData?.address || "N/A";
              const hospitalAddressLine2 = `${
                hospitalData?.pincode || "N/A"
              }, India`;
              const email = `Mail: ${hospitalData?.email || "N/A"}`;
              const landline = `Tel: ${hospitalData?.landline || "N/A"}`;

              // Only add logo if it exists
              if (hospitalData?.logo) {
                const hospitalLogo = new Image();
                hospitalLogo.src = `data:image/png;base64,${hospitalData.logo}`;
                doc.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);
              }

              doc.text(hospitalName, 20, 20);
              doc.text(hospitalAddressLine1, 20, 30);
              doc.text(hospitalAddressLine2, 20, 35);
              doc.text(landline, 20, 40);
              doc.text(email, 20, 45);
            };

            addHospitalInfo();
            doc.setFillColor("#48bcdf");
            const titleText = `${testNames[index]} Test Report`; // Update the title as needed
            index++;
            const titleHeight = 10;
            doc.rect(0, 53, doc.internal.pageSize.getWidth(), titleHeight, "F");
            doc.setTextColor("#ffffff"); // Set text color to white
            doc.setFontSize(16); // Adjust font size as needed
            doc.text(
              titleText,
              doc.internal.pageSize.getWidth() / 2,
              55 + titleHeight / 2,
              {
                align: "center",
              }
            );

            doc.setTextColor("#0a0b0b");
            doc.setFontSize(14);
            // Add Patient Information on the left side
            doc.text("Patient Information:", 20, 70);
            doc.setFontSize(12);
            doc.text(`Patient ID: ${PathologyTest?.PatientID}`, 20, 80);
            doc.text(`Patient Name: ${PathologyTest?.PatientName}`, 20, 90);
            doc.text(
              `Patient Phone: ${PathologyTest?.PatientPhoneNo}`,
              20,
              100
            );
            doc.text(
              `Registered Date: ${new Date(
                PathologyTest?.createdAt
              ).toLocaleDateString()}`,
              20,
              110
            );

            // Add Test Information on the right
            doc.setTextColor("#0a0b0b");

            doc.setFontSize(14);
            doc.text(
              "Test Information:",
              doc.internal.pageSize.getWidth() / 2 + 15,
              70
            );
            doc.setFontSize(12);
            doc.text(
              `Status: ${testNamesStatus[index - 1]?.TestStatus}`,
              doc.internal.pageSize.getWidth() / 2 + 15,
              80
            );

            doc.text(
              `Collected Date: ${new Date(
                testNamesStatus[index - 1]?.TestSamplecollectedDateTime
              ).toLocaleString()}`,
              doc.internal.pageSize.getWidth() / 2 + 15,
              90
            );
            doc.text(
              `Completed Date: ${new Date(
                testNamesStatus[index - 1]?.TestCompletedDateTime
              ).toLocaleString()}`,
              doc.internal.pageSize.getWidth() / 2 + 15,
              100
            );
            doc.line(0, 114, doc.internal.pageSize.getWidth(), 114);

            doc.line(
              0,
              doc.internal.pageSize.getHeight() - 40,
              doc.internal.pageSize.getWidth(),
              doc.internal.pageSize.getHeight() - 40
            );
            doc.text(
              ` Dr ${PathologyTest?.DoctorName.replace(/\bNA\b/g, "").trim()}`,
              doc.internal.pageSize.getWidth() - 70,
              doc.internal.pageSize.getHeight() - 17
            );
            // doc.text(
            //   `(MD Pathologist)`,
            //   doc.internal.pageSize.getWidth() - 70,
            //   doc.internal.pageSize.getHeight() - 22
            // );
            if (DoctorSign) {
              const DoctorSigns = new Image();
              DoctorSigns.src = `data:image/png;base64,${DoctorSign}`; // Embed the base64 image data
              const addSign = () => {
                doc.addImage(
                  DoctorSigns,
                  "PNG",
                  doc.internal.pageSize.getWidth() - 68,
                  doc.internal.pageSize.getHeight() - 35,
                  30,
                  10
                );
              };

              addSign();
            } else {
              doc.text(
                "Sign: __________",
                doc.internal.pageSize.getWidth() - 70,
                doc.internal.pageSize.getHeight() - 25
              );
            }

            doc.setTextColor("#000000"); // Set text color to black
            doc.setFontSize(10);
            doc.text(
              `Page ${pageNumber}`,
              doc.internal.pageSize.getWidth() / 2 - 10,
              doc.internal.pageSize.getHeight() - 20
            );

            pageNumber++; // Increment page number

            const dateObject = new Date(PathologyTest?.updatedAt);

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
            doc.addImage(
              barcodeImage,
              "PNG",
              20,
              doc.internal.pageSize.getHeight() - 35,
              40,
              15
            );

            doc.setFillColor("#48bcdf");
            doc.rect(
              0,
              doc.internal.pageSize.getHeight() - 13,
              doc.internal.pageSize.getWidth(),
              10,
              "F"
            );
            doc.setTextColor("#ffffff");
            //pdf.setTextColor("#000000");
            doc.setFontSize(12);

            doc.text(
              "Powered by mediAI",
              doc.internal.pageSize.getWidth() / 2 - 20,
              doc.internal.pageSize.getHeight() - 7
            );

            doc.setTextColor("#0a0b0b");
            // Assuming tableData is an array of arrays with [key, value] pairs
            const modifiedTableData = tableData.map(([key, value]) => {
              const matchingNormalValue = normalValues.find(
                (item) => item.fieldName === key
              );

              if (matchingNormalValue) {
                const modifiedKey = key.replace(/_/g, " "); // Replace all underscores with spaces
                const minimumRange =
                  matchingNormalValue.minimumRange !== null
                    ? matchingNormalValue.minimumRange
                    : "NA";
                const maximumRange =
                  matchingNormalValue.maximumRange !== null
                    ? matchingNormalValue.maximumRange
                    : "NA";
                const unitOfMeasurements =
                  matchingNormalValue.unitOfMeasurements !== null
                    ? matchingNormalValue.unitOfMeasurements
                    : "NA";

                return [
                  modifiedKey,
                  value,
                  `${minimumRange} - ${maximumRange}`,
                  unitOfMeasurements,
                ];
              }

              return [key, value, "NA", "NA"];
            });

            // Then pass modifiedTableData to autoTable
            doc.autoTable({
              head: [["Fields", "Results", "Normal Values", "Units"]],
              body: modifiedTableData.filter(([key, value]) => {
                const excludedKeys = [
                  "id",
                  "PatientID",
                  "TestManagementID",
                  "PatientTestBookingID",
                  "createdAt",
                  "updatedAt",
                ];
                return !excludedKeys.includes(key);
              }),
              startY: 120,
              styles: {
                fontSize: 12,
              },
            });

            if (currentIndex !== array.length - 1) {
              doc.addPage(); // Add a page after each test, except for the last one
            }
          }
        }
      );
    } else {
      console.warn(
        "testResults or normalValues is null or undefined. Skipping PDF generation."
      );
    }

    doc.save("testResults.pdf");
  };

  // console.log("testResults:", testResults);
  // console.log("normalValues:", normalValues);

  return (
    <div>
      <Modal
        centered
        style={{ fontSize: "20px" }}
        show={showModal}
        onHide={handleModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("DownloadAllTestReportInPDF")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Title style={{ fontSize: "14px" }}>
            {t("PatientName")}: {PathologyTest?.PatientName}
          </Modal.Title>
          <Modal.Title style={{ fontSize: "14px" }}>
            {t("Tests")}: {PathologyTest?.selectedTests}
          </Modal.Title>
        </Modal.Body>
        <Modal.Body>
          {testResults && normalValues && (
            <div>
              <Button
                style={{ fontSize: "12px" }}
                variant="success"
                onClick={downloadPDF}
              >
                {t("DownloadReport")}
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DownloadPDFButton;
