import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import Datepickrange from "./DateRangeCalender";
import Translation from "../translations/PatientListCounter.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

const PatientsLists = () => {
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
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });

  const [patients, setPatients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getallPaitents`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const fullName =
      `${patient.firstName} ${patient.middleName} ${patient.lastName}`.toLowerCase();
    const phoneNumberP = patient.phoneNumberP.toString(); // Convert phoneNumberP to string

    const searchValueLower = searchValue.toLowerCase();

    return (
      (fullName.includes(searchValueLower) ||
        phoneNumberP.includes(searchValueLower)) &&
      (startDate === "" || new Date(patient.createdAt) >= startDate) &&
      (endDate === "" || new Date(patient.createdAt) <= endDate)
    );
  });

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleUpdateClick = (id) => {
    // Handle update click logic here
  };

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  if (!currentUser) {
    return <h3>Access Denied</h3>;
  }

  if (currentUser && !currentUser.roles.includes("ROLE_NURSE")) {
    // Redirect or show error message when the user is not a nurse
    return <h2>Nurse role is required!</h2>;
    // You can handle the redirection or error message display as per your requirement
  }

  const style = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    fontSize: "12px",
  };

  const h1Style = {
    fontSize: "16px",
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

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
        <h2 style={h1Style}>{t("PatientsList")}</h2>
      </header>
      <br />
      <Form>
        <Row>
          <Col sm={3}>
            <Form.Label style={{ fontSize: "12px", fontWeight: "bold" }}>
              {t("searchbyNameOrPhone")}
            </Form.Label>
            <Form.Control
              style={{ fontSize: "12px" }}
              type="text"
              placeholder={t("searchbyNameOrPhone")}
              value={searchValue}
              onChange={handleSearchChange}
            />
          </Col>
          <Col sm={1}></Col>
          <Col sm={2}>
            <Datepickrange
              onSetDate={handleSetDate}
              onClearDate={handleClearDate}
            />
          </Col>
        </Row>
      </Form>

      <br />
      <Table
        style={{ verticalAlign: "middle", textAlign: "center" }}
        responsive
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>{t("patientDataTable.id")}</th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("patientDataTable.patientName")}
            </th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("patientDataTable.contactNumber")}
            </th>
            <th style={{ textAlign: "center" }}>
              {t("patientDataTable.gender")}
            </th>
            <th style={{ textAlign: "center" }}>{t("patientDataTable.age")}</th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("patientDataTable.registrationDate")}
            </th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("patientDataTable.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.map((patient, index) => (
            <tr key={patient.id}>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {patient.id}
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {patient.mr} {patient.firstName} {patient.middleName}{" "}
                {patient.lastName}
              </td>

              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {patient.phoneNumberP}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {patient.gender}
              </td>
              {/* <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {patient.weight}KG
              </td> */}
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {patient.age} {patient?.ageOption ? patient?.ageOption : ""}
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {formatDateInSelectedLanguage(new Date(patient.createdAt))}
              </td>
              {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                Dr. {patient.DFirstName} {patient.DLastName}
              </td> */}
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                <Link
                  to={`/${extractedPart}/NurseOnePatientPrescription/${patient.id}`}
                >
                  <Button
                    title={t("ViewPrescription")}
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "12px",
                      marginTop: "10px",
                      marginLeft: "10px",
                      padding: "4px 5px",
                    }}
                    variant="secondary"
                  >
                    <FaRegEye />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <br></br>
      <Row className="justify-content-center align-items-center">
        <Col xs="auto" className="mx-0 px-0">
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
        </Col>
        <Col xs="auto" className="mx-0 px-0">
          <span className="mx-2">
            Page {currentPage} of{" "}
            {Math.ceil(filteredPatients.length / patientsPerPage)}
          </span>
        </Col>
        <Col xs="auto" className="mx-0 px-0">
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={handleNextPage}
            disabled={indexOfLastPatient >= filteredPatients.length}
          >
            Next
          </Button>
        </Col>
      </Row>
      <br></br>
    </Container>
  );
};

export default PatientsLists;
