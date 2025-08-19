import {
  FaPencilAlt,
  FaPlus,
  FaTrashAlt,
  FaRegEye,
  FaStreetView,
  FaMoneyBillAlt,
  FaMoneyBill,
  FaHornbill,
  FaRegMoneyBillAlt,
} from "react-icons/fa";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import Datepickrange from "./DateRangeCalender";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Container,
  Modal,
  Button,
  Form,
  Table,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import AuthService from "../services/auth.service";

import Translation from "../translations/DispensedReportsList.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

const DispensedReportsList = () => {
  const [dispensedReports, setDispensedReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  ///
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
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  ///

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  localStorage.setItem("sidebarClose", "0");

  useEffect(() => {
    fetchDispensedReports();
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  // Function to check if the screen size is mobile
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 200);
  };

  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  const fetchDispensedReports = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/findAllDispensedList`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      console.log(response.data);
      setDispensedReports(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataAndDownloadPDF = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/findAllDispensedList`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      ); // Replace with your API endpoint
      const dispensedReports = response.data;

      // Create a new PDF document
      const doc = new jsPDF();

      // Define the table headers
      const headers = [
        "ID",
        "Patient Name",
        "Dispense ID",

        "Dispensed Date",
        "Total Medicine Amount",
      ];

      // Define the table rows
      const rows = dispensedReports.map((report) => [
        report.id,
        report.PatientName,
        report.DispenseID,

        formatDate(report.createdAt),
        ` ${report.totalMedicineAmount} INR`,
      ]);

      // Set the table position and style
      const tableX = 10;
      const tableY = 20;
      const tableOptions = {
        startY: tableY,
        styles: { fontSize: 10 },
        headStyles: { lineWidth: 0.5 },
        bodyStyles: { lineWidth: 0.5 },
        footStyles: { lineWidth: 0.5 },
        margin: { top: 10 },
      };

      // Add the table to the PDF document
      const title = "Dispensed Reports List";
      const titleX = doc.internal.pageSize.getWidth() / 2;
      doc.setFontSize(16);
      doc.text(title, titleX, 10, { align: "center" });

      doc.autoTable(headers, rows, tableOptions);

      // Save the PDF document
      doc.save("dispensed_reports.pdf");
    } catch (error) {
      console.error(error);
    }
  };

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filteredReports = dispensedReports.filter(
    (report) =>
      report.PatientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (startDate === "" || new Date(report.createdAt) >= startDate) &&
      (endDate === "" || new Date(report.createdAt) <= endDate)
  );

  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser) {
    return "Access Denied";
  }
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_PHARMACIST")
  ) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return "Access Denied";
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
    fontSize: "13px" /* Adjust the font size for <h3> */,
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );
  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleViewImage = (imageSrc) => {
    setSelectedImageSrc(imageSrc);
    console.log(selectedImageSrc);
    setShowImageModal(true);
  };
  const handleClose = () => {
    setShowImageModal(false);
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = selectedImageSrc;
    link.download = "prescription_image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container style={style} className="mt-3">
      {/* <h2 style={h1Style} className="my-4 text-center">Dispensed Reports List</h2> */}
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("dispensedReportsList")}</h2>
      </header>{" "}
      <br></br>
      <Row>
        <Col xs={12} sm={6} md={3} lg={3}>
          <Form.Group controlId="searchForm">
            <Form.Label style={{ fontWeight: "bold", marginBottom: "8px" }}>
              {t("searchByPatientName")}
            </Form.Label>
            <Form.Control
              style={{ fontSize: "12px" }}
              type="text"
              placeholder={t("searchByPatientName")}
              value={searchTerm}
              onChange={handleSearch}
            />
          </Form.Group>
        </Col>
        <Col xs={12} sm={6} md={2} lg={2}></Col>

        <Col xs={12} sm={6} md={2} lg={2}>
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </Col>
        <Col xs={12} sm={6} md={3} lg={3}></Col>

        <Col
          xs={12}
          sm={6}
          md={2}
          lg={2}
          className="d-flex justify-content-end"
        >
          <button
            style={{
              fontSize: "12px",
              marginTop: "25px",
              padding: "4px 5px",
            }}
            className="btn btn-secondary"
            onClick={fetchDataAndDownloadPDF}
          >
            {t("downloadAsPDF")}
          </button>
        </Col>
      </Row>
      <br />
      {isMobile ? (
        <div className="row">
          {currentReports.map((report, index) => (
            <div className="col-md-4 mb-3" key={report.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {t("dispensedReportsListTable.patientName")}:{" "}
                    {report.PatientName}
                  </h5>
                  <p className="card-text">
                    {t("dispensedReportsListTable.dispenseID")}:{" "}
                    {report.DispenseID}
                  </p>
                  <p className="card-text">
                    {t("dispensedReportsListTable.prescriptionID")}:{" "}
                    {report.PrescriptionID}
                  </p>
                  <p className="card-text">
                    {t("dispensedReportsListTable.prescriptionDate")}:{" "}
                    {formatDateInSelectedLanguage(
                      new Date(report.PrescriptionDate)
                    )}
                  </p>
                  <p className="card-text">
                    {t("dispensedReportsListTable.registrationDate")}:{" "}
                    {formatDateInSelectedLanguage(new Date(report.createdAt))}
                  </p>
                  <p className="card-text">
                    {t("dispensedReportsListTable.totalMedicineAmount")}:{" "}
                    <strong>
                      <span>&#8377;</span> {report.totalMedicineAmount}
                    </strong>
                  </p>
                  <p className="card-text">
                    {t("dispensedReportsListTable.prescriptionType")}:{" "}
                    {report.PrescriptionType}
                  </p>
                  <div className="d-flex justify-content-center">
                    {report.prescriptionImage ? (
                      <button
                        title="View Image"
                        style={{
                          fontSize: "12px",
                          padding: "4px 5px",
                          marginRight: "10px",
                        }}
                        className="btn btn-secondary"
                        onClick={() =>
                          handleViewImage(report.prescriptionImage)
                        }
                      >
                        <FaRegEye />
                      </button>
                    ) : (
                      <div style={{ marginRight: "10px" }}>NA</div>
                    )}
                    <Link
                      to={`/${extractedPart}/dispensedPatient/${report.id}/${report.prescription_Id}`}
                    >
                      <button
                        title="View Bill"
                        style={{ fontSize: "12px", padding: "4px 5px" }}
                        className="btn btn-secondary"
                      >
                        <FaRegMoneyBillAlt />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table
          style={{ verticalAlign: "middle", textAlign: "center" }}
          responsive
          bordered
          hover
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>
                {t("dispensedReportsListTable.srNo")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("dispensedReportsListTable.patientName")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("dispensedReportsListTable.dispenseID")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("dispensedReportsListTable.prescriptionID")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("dispensedReportsListTable.prescriptionDate")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("dispensedReportsListTable.registrationDate")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("dispensedReportsListTable.totalMedicineAmount")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("dispensedReportsListTable.prescriptionType")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("dispensedReportsListTable.prescriptionImage")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("dispensedReportsListTable.view")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((report, index) => (
              <tr key={report.id}>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {index + 1 + (currentPage - 1) * reportsPerPage}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {report.PatientName}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {report.DispenseID}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {report.PrescriptionID}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(
                    new Date(report.PrescriptionDate)
                  )}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(new Date(report.createdAt))}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  <strong>
                    {" "}
                    {report.TotalFees} {report.Currency}
                  </strong>
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {report.PrescriptionType}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {report.prescriptionImage ? (
                    <button
                      title="View Image"
                      style={{
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                        padding: "4px 5px",
                        marginTop: "10px",
                        marginLeft: "10px",
                        padding: "4px 5px",
                      }}
                      className="btn btn-secondary"
                      onClick={() => handleViewImage(report.prescriptionImage)}
                    >
                      <FaRegEye />
                    </button>
                  ) : (
                    "NA"
                  )}
                </td>

                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  <Link
                    to={`/${extractedPart}/dispensedPatient/${report.id}/${report.prescription_Id}`}
                  >
                    <button
                      title="View Bill"
                      style={{
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                        marginTop: "10px",
                        marginLeft: "10px",
                        padding: "4px 5px",
                      }}
                      className="btn btn-secondary"
                    >
                      <FaRegMoneyBillAlt />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal
        show={showImageModal}
        centered
        style={{ marginTop: "20px" }}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "12px" }}>
            {t("dispensedReportsListTable.prescriptionImage")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={`data:image/png;base64,${selectedImageSrc}`}
            alt="Prescription"
            style={{ width: "100%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={handleClose}
          >
            {t("close")}
          </Button>
          {/* <Button variant="secondary" onClick={handleDownloadImage}>
            Download
          </Button> */}
        </Modal.Footer>
      </Modal>
      <br></br>
      <Row className="justify-content-center align-items-center">
        <Col xs="auto" className="mx-0 px-0">
          <Button
            style={{ fontSize: "12px" }}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            variant="secondary"
          >
            {t("previous")}
          </Button>
        </Col>
        <Col xs="auto" className="mx-0 px-0">
          <span className="mx-2">
            {t("page")} {currentPage} {t("of")}{" "}
            {Math.ceil(filteredReports.length / reportsPerPage)}
          </span>
        </Col>
        <Col xs="auto" className="mx-0 px-0">
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={handleNextPage}
            disabled={indexOfLastReport >= filteredReports.length}
          >
            {t("next")}
          </Button>
        </Col>
      </Row>
      <br></br>
    </Container>
  );
};

export default DispensedReportsList;
