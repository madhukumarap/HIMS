import JsBarcode from "jsbarcode";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { Modal, Form, Col, Button, Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import Translation from "../../translations/DiagnosticsBookingManagement.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import AuthService from "../../services/auth.service";

const DownloadPDFButton = ({ testBookingID }) => {
  let newtestBookingID = testBookingID;
  // alert(newtestBookingID);
  const currentUser = AuthService.getCurrentUser();

  const { t } = useTranslation();

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
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };
  const [testResults, setTestResults] = useState(null);
  const [normalValues, setNormalValues] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [PathologyTest, setPathologyTest] = useState(null);
  const [testNames, setTestNames] = useState(null);
  const [Doctor, setDoctor] = useState(null);
  const [DoctorSign, setDoctorSign] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [testNamesStatus, setTestNamesStatus] = useState(null);

  const [showModal, setShowModal] = useState(true);
  const handleModalClose = () => {
    setShowModal(false);
    window.location.reload();
  };
  const handleModalShow = () => setShowModal(true);

  /////////////////////
  const [tableData, setTableData] = useState([]);

  const handleDownloadPDFImages = () => {
    if (!selectedTest) {
      toast.error(t("PleaseSelectTest"));
      return;
    }

    if (!tableData || tableData.length === 0) {
      toast.error(t("Noimagesfound"));
      return;
    }

    const doc = new jsPDF();

    tableData.forEach((item, index) => {
      if (item.imagePath) {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);

          const dataURL = canvas.toDataURL("image/png");

          doc.addImage(dataURL, "JPEG", 10, 10, 190, 277); // Adjust coordinates and size as needed

          if (index !== tableData.length - 1) {
            doc.addPage();
          } else {
            toast.success(t("Saved"));
            doc.save("images.pdf");
          }
        };

        img.src = item.imagePath;
      }
    });
  };

  const fetchTestStatuses = async (testBookingID) => {
    try {
      // alert(bookingId);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/DiagnosticTestStatuses/${testBookingID}`,
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

  const fetchDataUploadImagesforSelectedTest = async (
    testBookingID,
    selectedTest
  ) => {
    try {
      //  alert(selectedTest);
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/getImagesByTestBookingIDAndTestName?testBookingID=${testBookingID}&testName=${selectedTest}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setTableData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (testBookingID && selectedTest) {
      // Check if selectedTest is available
      fetchDataUploadImagesforSelectedTest(testBookingID, selectedTest); // Call fetchColumns with selectedTest
    }
  }, [testBookingID, selectedTest]);
  const handleTestSelect = (e) => {
    const selectedTest = e.target.value;
    setSelectedTest(selectedTest);
    if (!selectedTest) {
      setTableData([]);
    }
    // alert(selectedTest);
    // setFormData({});
  };
  //////////////////////////
  const fetchData = async (testBookingID) => {
    try {
      // alert(testBookingID);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/getLastRecordByPatientTestBookingIDForMultipleTestDiagnostic/${testBookingID}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      // alert(JSON.stringify(data));
      setPathologyTest(data.pathologyTest);
      //alert(data.selectedTestsArray);
      setTestNames(data.selectedTestsArray);
      setDoctor(data.doctor);
      //alert(Doctor.signatureImage);

      console.log("data?.results:", data?.results);

      const filteredResults = Object.fromEntries(
        Object.entries(data?.results).filter(([key, value]) => value !== null)
      );

      console.log("filteredResults:", filteredResults);

      //alert(filteredResults);

      setTestResults(filteredResults);
      // alert(JSON.stringify(PathologyTest));
      const response2 = await fetch(
        `${import.meta.env.VITE_API_URL}/api/getDoctorByIdsign/${
          data?.pathologyTest?.doctorId
        }`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response2.status}`);
      }

      const data2 = await response2.json();
      // alert(JSON.stringify(data));
      setDoctor(data2);
      setDoctorSign(data2.signatureImage);
      console.log("Imagedata: " + DoctorSign);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setHospitalData(data.data);
    } catch (error) {
      console.error("Error fetching hospital data:", error);
    }
    // try {
    //   // alert(JSON.stringify(PathologyTest));
    //   const response = await fetch(
    //     `${import.meta.env.VITE_API_URL}/api/getDoctorByIdsign/${Doctor.id}`,
    //     {
    //       headers: {
    //         Authorization: `${currentUser?.Token}`,
    //       },
    //     }
    //   );

    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }

    //   const data = await response.json();
    //   // alert(JSON.stringify(data));
    //   setDoctor(data);
    //   setDoctorSign(Doctor.signatureImage);
    //   //alert(JSON.stringify(Doctor.signatureImage.data));
    // } catch (error) {
    //   toast.error("error: " + error);
    //   console.error("Error fetching hospital data:", error);
    // }
  };

  useEffect(() => {
    if (testBookingID) {
      fetchData(testBookingID);
      fetchTestStatuses(testBookingID);
    }
  }, [testBookingID]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    let pageNumber = 1;
    fetchData(testBookingID);
    // alert(JSON.stringify(PathologyTest));
    if (testResults) {
      let index = 0;

      //  testNames.forEach((testName) => {
      Object.entries(testResults).forEach(
        ([testNamess, testResult], currentIndex, array) => {
          // Check if the testResult object is empty
          if (Object.keys(testResult).length === 0) {
            return; // Skip empty testResult objects
          }

          const tableData = Object.entries(testResult).map(([key, value]) => {
            return [key, value];
          });

          if (tableData.length > 0) {
            doc.setFontSize(12);

            // alert(index);
            const hospitalLogoBase64 = hospitalData.logo; // Assuming the logo is provided as a base64 string
            const hospitalLogo = new Image();
            hospitalLogo.src = `data:image/png;base64,${hospitalLogoBase64}`; // Embed the base64 image data
            const addHospitalInfo = () => {
              const hospitalName = hospitalData.hospitalName;
              const hospitalAddressLine1 = hospitalData.address;
              const hospitalAddressLine2 = `${hospitalData.pincode}, India`;
              const email = `Mail: ${hospitalData.email}`;
              const landline = `Tel: ${hospitalData.landline}`;
              doc.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);
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
              `Completed Date: ${new Date(
                testNamesStatus[index - 1]?.TestCompletedDateTime
              ).toLocaleString()}`,
              doc.internal.pageSize.getWidth() / 2 + 15,
              100
            );
            doc.text(
              `Lab Name: LAB01`,
              doc.internal.pageSize.getWidth() / 2 + 15,
              90
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
            //   `${Doctor?.registrationNo}`,
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

            doc.setTextColor("#0a0b0b");
            doc.autoTable({
              head: [["Parameters and Results", ""]],
              body: tableData
                .filter(([key, value]) => {
                  // Exclude specific keys from the table
                  const excludedKeys = [
                    "id",
                    "PatientID",
                    "TestManagementID",
                    "PatientTestBookingID",
                    "createdAt",
                    "updatedAt",
                    "Comment",
                  ];
                  return !excludedKeys.includes(key);
                })
                .flatMap(([key, value]) => {
                  // Replace underscores with spaces in the key
                  const modifiedKey = key.replace(/_/g, " ");

                  return [
                    [
                      {
                        content: modifiedKey,
                        styles: {
                          fontStyle: "bold",
                          textColor: [72, 188, 220],
                        },
                      },
                    ], // Key in bold
                    [value], // Value
                    createHorizontalLine(), // Horizontal line
                  ];
                }),
              startY: 120,
              styles: {
                fontSize: 12,
              },
              alternateRowStyles: {
                fillColor: [255, 255, 255],
              },
              bodyStyles: {
                textColor: [10, 11, 11],
              },
              margin: { top: 15, bottom: 45 },
            });

            function createHorizontalLine() {
              return {
                content: "\n",
                styles: { cellPadding: 0, fontSize: 0 }, // Minimal padding and font size
                rowSpan: 1,
              };
            }

            if (currentIndex !== array.length - 1) {
              doc.addPage(); // Add a page after each test, except for the last one
            }
          }
        }
      );
    } else {
      console.warn(
        "testResults  is null or undefined. Skipping PDF generation."
      );
    }
    const totalPages = doc.internal.getNumberOfPages();
    const addPageNumber = (doc, pageNumber) => {
      doc.setFontSize(10);
      doc.setTextColor("#000000"); // Set text color to black
      doc.text(
        `Page ${pageNumber}`,
        doc.internal.pageSize.getWidth() / 2 - 10,
        doc.internal.pageSize.getHeight() - 20
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
    };

    // Add page numbers
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addPageNumber(doc, i);
    }
    doc.save("testResults.pdf");
  };

  return (
    <div>
      <Modal
        size="lg"
        style={{ marginTop: "20px" }}
        centered
        show={showModal}
        onHide={handleModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("DownloadAllTestReportInPDF")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-4">
              <Modal.Title style={{ fontSize: "14px" }}>
                {t("PatientName")}:{PathologyTest?.PatientName}
              </Modal.Title>
              <Modal.Title style={{ fontSize: "14px" }}>
                {t("Tests")}:{PathologyTest?.selectedTests}
              </Modal.Title>
            </div>
            <div className=" col-4 d-flex justify-content-center align-items-center ">
              <Button
                style={{ fontSize: "12px" }}
                variant="secondary"
                onClick={downloadPDF}
              >
                {t("DownloadPDFButton")}
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Body>
          {testResults && (
            <div>
              <br></br>
              <hr />

              <Form>
                <Form.Group className="row d-flex" controlId="selectTest">
                  {" "}
                  <div className="col-4 d-flex flex-column justify-content-center align-items-center ">
                    <Form.Label
                      style={{ fontSize: "12px", fontWeight: "bold" }}
                    >
                      {t("SelectTesttoDownloadResultImages")}
                    </Form.Label>
                    <Form.Select
                      as="select"
                      style={{ fontSize: "12px" }}
                      onChange={handleTestSelect}
                      value={selectedTest}
                    >
                      <option value="">{t("SelectTest")}</option>
                      {testNames?.map((test, index) => (
                        <option key={index} value={test}>
                          {test}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="col-4 mx-2 d-flex justify-content-center align-items-center">
                    <Button
                      className="mt-2"
                      style={{ fontSize: "12px" }}
                      variant="secondary"
                      onClick={handleDownloadPDFImages}
                    >
                      {t("DownloadImagePDFButton")}
                    </Button>
                  </div>
                </Form.Group>
              </Form>
              <hr />
              <br></br>

              {/* {DoctorSign && (
                <img
                  src={`data:image/jpg;base64,${DoctorSign}`}
                  alt="Captured"
                  style={{ width: "100%" }}
                />
              )} */}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DownloadPDFButton;
