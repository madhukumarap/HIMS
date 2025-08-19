import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Card, Row, Col, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import Translation from "../translations/ViewDispensedOnePatient.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

const CashMemo = () => {
  const { id } = useParams();
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

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
    //
    initializei18n();
    const intervalId = setInterval(initializei18n, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };
  const { prescription_Id } = useParams();

  const [dispensedReport, setDispensedReport] = useState(null);
  const [prescribedMedicine, setPrescribedMedicine] = useState([]);
  const stringSimilarity = require("string-similarity"); // Import the string similarity library

  const updatedDispensedMedicines = (
    dispensedMedicines,
    prescribedMedicine
  ) => {
    return dispensedMedicines.map((medicine) => {
      const matchingPrescribedMedicine = prescribedMedicine.find(
        (prescribedMed) =>
          stringSimilarity.compareTwoStrings(
            prescribedMed.medicineName.toLowerCase(),
            medicine.MedicineName.toLowerCase()
          ) >= 0.5 // Set the similarity threshold to 50%
      );

      if (matchingPrescribedMedicine) {
        //   alert(`Dosage Amount: ${matchingPrescribedMedicine.dosageAmount}`);
        //   alert(`Food: ${matchingPrescribedMedicine.food}`);
        return { ...medicine, ...matchingPrescribedMedicine };
      }

      return medicine;
    });
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  const sidebarClose = localStorage.getItem("sidebarClose");
  if (sidebarClose !== "1") {
    window.location.reload();
    localStorage.setItem("sidebarClose", "1");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/findOneDispensedList/${id}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setDispensedReport(response.data);

        const prescribedResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getMedicineList/${prescription_Id}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setPrescribedMedicine(prescribedResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dispensedReport && prescribedMedicine) {
      const updatedMedicines = updatedDispensedMedicines(
        dispensedReport.dispensedmedicines,
        prescribedMedicine
      );
      setDispensedReport((prevReport) => ({
        ...prevReport,
        dispensedmedicines: updatedMedicines,
      }));
    }
  }, [dispensedReport, prescribedMedicine]);

  if (!dispensedReport) {
    return <div>Loading...</div>;
  }

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const handlePrint2 = () => {
    window.print();
  };

  const handlePrint = (medicineId) => {
    const medicine = dispensedReport.dispensedmedicines.find(
      (m) => m.id === medicineId
    );

    const printContents = `
    <html>
        <head>
            <title>Print Label</title>
            <style>
                @media print {
                    body {
                        transform: scale(0.5);
                        transform-origin: top left;
                        width: 70mm;
                        height: 35mm;
                        margin: 0;
                        padding: 0;
                    }
                }

                body {
                    font-family: Arial, sans-serif;
                    width: 70mm;
                    height: 35mm;
                }

                h3 {
                    margin-top: 0;
                }

                p {
                    margin-bottom: 5px;
                }

                strong {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h3>Medicine Details:</h3>
            <p><strong>Patient Name:</strong> ${dispensedReport.PatientName}</p>
            <p><strong>Medicine Name:</strong> ${medicine.MedicineName}</p>
            <p><strong>Batch Number:</strong> ${medicine.BatchNumber}</p>
            <p><strong>Expiry Date:</strong> ${formatDateInSelectedLanguage(
              new Date(medicine.ExpiryDate)
            )}</p>
           
            <p><strong>Dispense Date:</strong> ${formatDateInSelectedLanguage(
              new Date(dispensedReport.createdAt)
            )}</p>
        </body>
    </html>
`;

    // <p><strong>Dosage Amount:</strong> ${medicine.dosageAmount}</p>
    // <p>
    //   <strong>Medication Advice:</strong> ${medicine.food}
    // </p>;
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(printContents);
    printWindow.document.close();

    printWindow.print();
  };

  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_PHARMACIST")
  ) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return <h6>Access Denied!</h6>;
    // You can handle the redirection or error message display as per your requirement
  }

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "14px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "12px" /* Adjust the font size for <h3> */,
  };

  return (
    <div style={style} className="cash-memo">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("PharmacyBill")}</h2>
        {/* <p>Bangalore, India</p> */}
      </header>

      <Container className="mt-2">
        <Row>
          <Col>
            <Card className="border-0">
              <Card.Body>
                <Card.Title style={h3Style}>{t("patientDetails")}</Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {dispensedReport.PatientName}
                  <br />
                  <strong>{t("patientID")}</strong> {dispensedReport.patient_Id}{" "}
                  <br />
                  <br />
                  <strong>{t("doctorName")}</strong>{" "}
                  {dispensedReport.PriscribedDoctor}
                  <br />
                  <strong>{t("doctorRegistrationNumber")}</strong>{" "}
                  {dispensedReport.DoctorRegNo}
                  <br />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="border-0">
              <Card.Body>
                <Card.Title style={h3Style}>{t("dispenseDetails")}</Card.Title>
                <Card.Text>
                  <strong>{t("dispenseID")}:</strong>{" "}
                  {dispensedReport.DispenseID}
                  <br />
                  <strong>{t("prescriptionID")}:</strong>{" "}
                  {dispensedReport.PrescriptionID}
                  <br />
                  <strong>{t("prescriptionDate")}:</strong>{" "}
                  {formatDateInSelectedLanguage(
                    new Date(dispensedReport.PrescriptionDate)
                  )}
                  <br />
                  <strong>{t("dispenseDate")}:</strong>{" "}
                  {formatDateInSelectedLanguage(
                    new Date(dispensedReport.createdAt)
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="border-0">
          <Card.Body>
            <Card.Title style={h3Style}>{t("orderDetails")}</Card.Title>
            <Table
              style={{ verticalAlign: "middle", textAlign: "center" }}
              responsive
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>{t("medicineName")}</th>
                  <th style={{ textAlign: "center" }}>{t("batchNumber")}</th>
                  <th style={{ textAlign: "center" }}>{t("expiryDate")}</th>
                  <th style={{ textAlign: "center" }}>{t("unitPrice")}</th>
                  <th style={{ textAlign: "center" }}>{t("quantity")}</th>
                  <th style={{ textAlign: "center" }}>
                    {t("eachMedicineCost")}
                  </th>
                  {/*               <th style={{ textAlign: "center" }}>{t("dosageAmount")}</th>
              <th style={{ textAlign: "center" }}>{t("medicationAdvice")}</th> */}
                  <th style={{ textAlign: "center" }}>{t("printLabel")}</th>
                </tr>
              </thead>
              <tbody>
                {dispensedReport.dispensedmedicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td>{medicine.MedicineName}</td>
                    <td>{medicine.BatchNumber}</td>
                    <td>
                      {formatDateInSelectedLanguage(
                        new Date(medicine.ExpiryDate)
                      )}
                    </td>
                    <td>{medicine.UnitPrice}</td>
                    <td>{medicine.Quantity}</td>
                    <td>
                      {" "}
                      {medicine.EachmedicineCost}{" "}
                      {medicine.EachMedicineCurrency}
                    </td>
                    {/* <td>{medicine.dosageAmount}</td>
                    <td>{medicine.food}</td> */}
                    <td>
                      <Button
                        style={{
                          verticalAlign: "middle",
                          textAlign: "center",
                          fontSize: "12px",
                          marginTop: "0",
                          padding: "4px 5px",
                        }}
                        variant="secondary"
                        onClick={() => handlePrint(medicine.id)}
                      >
                        {t("printLabel")}
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr className="text-dark">
                  <td colSpan="5" className="text-right">
                    <strong>
                      {t("totalCost")}({t("Paidin")} {dispensedReport.Currency})
                    </strong>
                  </td>
                  <td>
                    <strong>
                      {" "}
                      {dispensedReport.TotalFees} {dispensedReport.Currency}{" "}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Card className="border-0 mt-4">
          <Card.Body>
            <Card.Text>
              {t("thankYouForVisiting")}
              <br />
              <br /> <br />
              {t("signature")}
              <br />
              <br />
              {t("stamp")}
            </Card.Text>
          </Card.Body>
        </Card>

        <Container className="text-center mt-4">
          <Button
            style={{ fontSize: "12px", padding: "4px 5px" }}
            onClick={handlePrint2}
            variant="secondary"
          >
            {t("print")}
          </Button>
          <Link to={`/${extractedPart}/DispensedReportsList`}>
            <button
              style={{
                fontSize: "12px",
                marginTop: "0px",
                marginLeft: "20px",
                padding: "4px 5px",
              }}
              className="btn btn-secondary btn-sm"
            >
              {t("goBack")}
            </button>
          </Link>
        </Container>
        <br></br>
      </Container>

      <style>
        {`
    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }

    .text-right {
      text-align: right;
    }

    @media print {
      .navbar,
      .sidebar,
      .text-center,
      button,
      input:not([type="hidden"]) {
        display: none !important;
      }

      th:nth-child(9),
      td:nth-child(9) {
        display: none;
      }
    }

     @media print {
    .sidebar {
      display: none !important;
    }
  }
  `}
      </style>
    </div>
  );
};

export default CashMemo;
