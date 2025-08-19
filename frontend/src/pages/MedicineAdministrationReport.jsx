import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Row, Col, Table, Card } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Datepickrange from "./DateRangeCalender";
import Translation from "../translations/MedicineAdministrationReport.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { t } = useTranslation();
  const locales = { enIN, fr };
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

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
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10); // You can adjust this number as needed
  const handleSetDate = (start, end) => {
    setStartDate(new Date(start));
    setEndDate(new Date(end));
    filterPrescriptions(filterName, start, end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

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

  useEffect(() => {
    // Fetch prescription data from backend
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/listPrescription`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setPrescriptions(data);
      setFilteredPrescriptions(data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const handleFilterChange = (event) => {
    setFilterName(event.target.value);
    filterPrescriptions(event.target.value, startDate, endDate);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    filterPrescriptions(filterName, event.target.value, endDate);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    filterPrescriptions(filterName, startDate, event.target.value);
  };

  const filterPrescriptions = (name, start, end) => {
    let filtered = prescriptions;

    if (name) {
      filtered = filtered.filter(
        (p) =>
          p.PatientName.toLowerCase().includes(name.toLowerCase()) ||
          p.phoneNumberP.toString().includes(name)
      );
    }

    if (start) {
      // Convert start date to UTC
      const startUTC = new Date(
        start.getUTCFullYear(),
        start.getUTCMonth(),
        start.getUTCDate(),
        0,
        0,
        0
      );

      filtered = filtered.filter(
        (p) => new Date(p.createdAt).getTime() >= startUTC.getTime()
      );
    }

    if (end) {
      // Convert end date to UTC
      const endUTC = new Date(
        end.getUTCFullYear(),
        end.getUTCMonth(),
        end.getUTCDate(),
        23,
        59,
        59
      );

      filtered = filtered.filter(
        (p) => new Date(p.createdAt).getTime() <= endUTC.getTime()
      );
    }

    // Log the filtered prescriptions after filtering
    console.log("Filtered Prescriptions:", filtered);

    setFilteredPrescriptions(filtered);
  };

  const sortPrescriptions = () => {
    const sorted = [...filteredPrescriptions].sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    setFilteredPrescriptions(sorted);
  };

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const style = {
    width: "98%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    //margin: "0 auto" /* Optional: Centers the page horizontally */,
    marginLeft: "10px",
    fontSize: "12px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "14px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "16px" /* Adjust the font size for <h3> */,
  };

  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  if (
    !currentUser ||
    (!currentUser.roles.includes("ROLE_ADMIN") &&
      !currentUser.roles.includes("ROLE_PHARMACIST"))
  ) {
    return "Access Denied";
  }

  const convertArrayOfObjectsToCSV = (data) => {
    const csvHeader = Object.keys(data[0]).join(",") + "\n";
    const csvRows = data.map((row) => Object.values(row).join(",") + "\n");
    return csvHeader + csvRows.join("");
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/listPrescription`,
        {
          responseType: "json", // Set response type to JSON
        },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      const csvData = convertArrayOfObjectsToCSV(response.data);

      const downloadUrl = URL.createObjectURL(
        new Blob([csvData], { type: "text/csv" })
      );

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "PatientPrescriptionList.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(
        "Data exported successfully!",
        { position: toast.POSITION.TOP_RIGHT },
        {
          style: { fontSize: "12px" },
        }
      );
    } catch (error) {
      toast.error("Failed to export data", {
        style: { fontSize: "12px" },
      });
      console.error("Error:", error);
    }
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredPrescriptions.slice(
    indexOfFirstReport,
    indexOfLastReport
  );
  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div style={style}>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("patientPrescriptionRecords")}</h2>
      </header>
      <br></br>
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="form-group">
            <label style={{ fontWeight: "bold", marginBottom: "8px" }}>
              {t("searchByPatientNameOrPhoneNumber")}
            </label>
            <input
              style={{ fontSize: "12px" }}
              type="text"
              placeholder={t("searchByPatientNameOrPhoneNumber")}
              className="form-control"
              value={filterName}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="col-md-1 mb-1"></div>
        <div className="col-md-2 mb-2">
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>

        <div className="col-md-6 mb-6">
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="secondary"
              style={{
                fontSize: "12px",
                padding: "4px 5px",
                marginLeft: "10px",
              }}
              onClick={handleExportData}
            >
              {t("downloadAsCSV")}
            </Button>
          </div>
        </div>
      </div>
      {/* <button className="btn btn-secondary" onClick={sortPrescriptions}>
        Sort by Date
      </button> */}
      <br></br>
      {isMobile ? (
        <div className="table-responsive">
          {currentReports.map((prescription, index) => (
            <Card key={prescription.id} className="mb-3">
              <Card.Body>
                <Card.Title>{prescription.PatientName}</Card.Title>
                <Card.Text>
                  {t("prescriptionTable.prescriptionID")}:{" "}
                  {prescription.prescriptionId}
                  <br />
                  {t("prescriptionTable.patientPhoneNo")}:{" "}
                  {prescription.phoneNumberP}
                  <br />
                  {t("prescriptionTable.prescribedDoctor")}:{" "}
                  {prescription.PrescribedDoctor}
                  <br />
                  {t("prescriptionTable.registrationNumber")}:{" "}
                  {prescription.RegistrationNo}
                  <br />
                  {t("prescriptionTable.doctorPhoneNo")}: {prescription.PhoneNo}
                  <br />
                  {t("prescriptionTable.clinicalDiagnosis")}:{" "}
                  {prescription.clinicalDiagnosis}
                  <br />
                  {t("prescriptionTable.prescriptionDate")}:{" "}
                  {formatDateInSelectedLanguage(
                    new Date(prescription.createdAt)
                  )}
                </Card.Text>

                <Link
                  to={`/${extractedPart}/ViewMedicationReport/${prescription.id}`}
                >
                  <Button
                    style={{ fontSize: "12px", padding: "4px 5px" }}
                    variant="secondary"
                  >
                    View Report <FaRegEye />
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="table-responsive">
          <Table
            style={{ verticalAlign: "middle", textAlign: "center" }}
            responsive
            bordered
            hover
          >
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>
                  {t("prescriptionTable.id")}
                </th>
                <th style={{ textAlign: "center" }}>
                  {t("prescriptionTable.prescriptionID")}
                </th>
                <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {t("prescriptionTable.patientName")}
                </th>
                <th style={{ whiteSpace: "nowrap" }}>
                  {t("prescriptionTable.patientPhoneNo")}
                </th>
                <th style={{ whiteSpace: "nowrap" }}>
                  {t("prescriptionTable.prescribedDoctor")}
                </th>
                <th style={{ whiteSpace: "nowrap" }}>
                  {t("prescriptionTable.registrationNumber")}
                </th>
                <th style={{ whiteSpace: "nowrap" }}>
                  {t("prescriptionTable.doctorPhoneNo")}
                </th>
                <th style={{ whiteSpace: "nowrap" }}>
                  {t("prescriptionTable.clinicalDiagnosis")}
                </th>
                {/*               <th style={{ textAlign: "center" }}>{t("prescriptionTable.status")}</th> */}
                <th style={{ whiteSpace: "nowrap" }}>
                  {t("prescriptionTable.prescriptionDate")}
                </th>
                <th style={{ whiteSpace: "nowrap" }}>
                  {t("prescriptionTable.medicationAdministration")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((prescription, index) => (
                <tr key={prescription.id}>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {" "}
                    {index + 1 + (currentPage - 1) * reportsPerPage}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {prescription.prescriptionId}
                  </td>

                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {prescription.PatientName}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {prescription.phoneNumberP}
                  </td>
                  {/* <td>{prescription.image}</td> */}
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {prescription.PrescribedDoctor}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {prescription.RegistrationNo}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {prescription.PhoneNo}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {prescription.clinicalDiagnosis}
                  </td>
                  {/* <td>{prescription.status}</td> */}
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {formatDateInSelectedLanguage(
                      new Date(prescription.createdAt)
                    )}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    <Link
                      to={`/${extractedPart}/ViewMedicationReport/${prescription.id}`}
                    >
                      <button
                        title={t("ViewReport")}
                        style={{
                          fontSize: "12px",
                          marginTop: "10px",
                          marginLeft: "10px",
                          padding: "4px 8px",
                        }}
                        className="btn btn-secondary mr-2"
                      >
                        <FaRegEye />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <br></br>
      <Row className="justify-content-center align-items-center">
        <Col xs="auto" className="mx-0 px-0">
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            {t("prescriptionTable.previous")}
          </Button>
        </Col>
        <Col xs="auto" className="mx-0 px-0">
          <span className="mx-2">
            Page {currentPage} of{" "}
            {Math.ceil(filteredPrescriptions.length / reportsPerPage)}
          </span>
        </Col>
        <Col xs="auto" className="mx-0 px-0">
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={handleNextPage}
            disabled={indexOfLastReport >= filteredPrescriptions.length}
          >
            {t("prescriptionTable.next")}
          </Button>
        </Col>
      </Row>
      <br></br>
    </div>
  );
};

export default PrescriptionList;
