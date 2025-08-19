import { Dropdown } from "react-bootstrap";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import "./print-styles.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import Datepickrange from "./DateRangeCalender";
import Translation from "../translations/PatientListScreen/PatientListScreen.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

//import { format, isDate } from "date-fns";

const PatientsLists = () => {
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
    const intervalId = setInterval(initializei18n, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  let token = "";
  if (currentUser) {
    token = currentUser.Token;
  }

  const [patients, setPatients] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const today = new Date();

  const [startDate, setStartDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
  );
  const [endDate, setEndDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
  );
  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10); // You can change this number as per your preference
  const [address, setAddress] = useState("");

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
    if (currentUser) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/getlistOfPatientByDoctorEmail/${currentUser.email}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((response) => {
          setPatients(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.PatientName}`.toLowerCase();
    const searchValueLower = searchValue.toLowerCase();
    const createdAt = new Date(patient.createdAt);

    const isNameMatch = fullName.includes(searchValueLower);
    const isPhoneMatch = String(patient.PatientPhone).includes(
      searchValueLower
    );

    const isDateInRange =
      (startDate === "" || createdAt >= new Date(startDate)) &&
      (endDate === "" || createdAt <= new Date(endDate));

    return (isNameMatch || isPhoneMatch) && isDateInRange;
  });

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  //   const formatDate = (dateString) => {
  //     const options = { year: "numeric", month: "long", day: "numeric" };
  //     return new Date(dateString).toLocaleDateString(undefined, options);
  //   };

  if (!currentUser) {
    return <h3>Access Denied</h3>;
  }

  if (currentUser && !currentUser.roles.includes("ROLE_DOCTOR")) {
    // Redirect or show error message when the user is not a doctor
    return "Access Denied";
    // You can handle the redirection or error message display as per your requirement
  }

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }
  const style = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    fontSize: "13px",
  };

  const h1Style = {
    fontSize: "16px",
  };

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <Container style={style} className="mt-4 text-center">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("consultationPatientList")}</h2>
      </header>
      <br />

      <br></br>
      <Form>
        <Row>
          <Col sm={3}>
            <Form.Label style={{ fontWeight: "bold", fontSize: "12px" }}>
              {t("searchByNameOrPhone")}
            </Form.Label>
            <Form.Control
              style={{ fontSize: "12px", marginBottom: "10px" }}
              type="text"
              placeholder={
                t("searchByNameOrPhone") || "Search by name or phone number"
              }
              value={searchValue}
              onChange={handleSearchChange}
            />
          </Col>
          <Col sm={2} className="mt-md-0 mt-sm-4">
            <Datepickrange
              onSetDate={handleSetDate}
              onClearDate={handleClearDate}
            />
          </Col>
        </Row>
      </Form>
      <br />
      {isMobile ? (
        <div>
          {currentPatients
            .filter((patient) => patient.paymentStatus === "paid")
            .map((patient) => (
              <div className="card mb-3" key={patient.id}>
                <div className="card-body">
                  <h5 className="card-title">
                    {" "}
                    Patient Name: {patient.PatientName}
                  </h5>
                  <p className="card-text">Patient ID: {patient.id}</p>
                  <p className="card-text">
                    Patient Number: {patient.PatientPhone}
                  </p>
                  <p className="card-text">
                    Booking Date-time: {patient.bookingStartDate}-{" "}
                    {new Date(patient.bookingEndDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="card-text">
                    Booking Status: {patient.BookingStatus}
                  </p>
                  <p className="card-text">
                    Registration Date: {formatDate(patient.createdAt)}
                  </p>
                  <div className="d-flex justify-content-center">
                    <Link to={`/PaitentPrescription/${patient.id}`}>
                      <button
                        className="btn btn-secondary btn-sm"
                        title="Create Prescription"
                      >
                        <FaPencilAlt />
                      </button>
                    </Link>
                    <Link to={`/OnePatientPrescription/${patient.patientId}`}>
                      <button
                        className="btn btn-secondary btn-sm ml-2"
                        title="View Prescription"
                      >
                        <FaRegEye />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <Table
          style={{
            fontSize: "12px",
            verticalAlign: "middle",
            textAlign: "center",
          }}
          responsive
          striped
          bordered
          hover
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>
                {t("patientTable.serialNumber")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("patientTable.patientName")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("patientTable.patientNumber")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("patientTable.bookingDateTime")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("patientTable.bookingStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("patientTable.registrationDate")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("patientTable.prescription")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPatients
              .filter((patient) => patient.paymentStatus === "paid")
              .map((patient) => (
                <tr key={patient.id}>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {patient.id}
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {patient.PatientName}
                  </td>

                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {patient.PatientPhone}
                  </td>
                  {/* <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  Dr {patient.DoctorName}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {patient.DoctorEmail}
                </td> */}
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {patient.bookingStartDate}-{" "}
                    {new Date(patient.bookingEndDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {patient.BookingStatus}
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {formatDateInSelectedLanguage(new Date(patient.createdAt))}
                  </td>

                  <td
                    style={{
                      color: "black",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    <Link to={`/PaitentPrescription/${patient.id}`}>
                      <Button
                        title="Create Prescription"
                        style={{
                          fontSize: "12px",
                          marginTop: "0px",
                          marginLeft: "10px",
                          padding: "4px 5px",
                        }}
                        className="btn btn-secondary mr-2"
                      >
                        <FaPencilAlt />
                      </Button>
                    </Link>
                    <Link to={`/OnePatientPrescription/${patient.patientId}`}>
                      <Button
                        title="View Prescription"
                        style={{
                          fontSize: "12px",
                          marginTop: "0px",
                          marginLeft: "10px",
                          padding: "4px 5px",
                        }}
                        className="btn btn-secondary mr-2"
                      >
                        <FaRegEye />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
      <br></br>

      <Row className="justify-content-center align-items-center">
        <Col xs="auto" className="mx-0 px-0">
          <Button
            style={{ fontSize: "12px" }}
            className="btn btn-secondary mr-2"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaArrowLeft />
          </Button>
        </Col>
        <Col style={{ marginTop: "10px" }} xs="auto" className="mx-0 px-0">
          <span className="mx-2">
            Page {currentPage} of{" "}
            {Math.ceil(filteredPatients.length / patientsPerPage)}
          </span>
        </Col>
        <Col xs="auto" className="mx-0 px-0">
          <Button
            style={{ fontSize: "12px" }}
            className="btn btn-secondary mr-2"
            onClick={handleNextPage}
            disabled={indexOfLastPatient >= filteredPatients.length}
          >
            <FaArrowRight />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientsLists;
