import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Container, Modal, Button } from "react-bootstrap";
import AuthService from "../services/auth.service";
import { MdAssignmentAdd } from "react-icons/md";
import Translation from "../translations/OnePatientPrescription.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

function PrescriptionDetails(props) {
  const { id } = useParams();
  const [patient, setPatient] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState("");
  const { t } = useTranslation();
  localStorage.removeItem("reloadCounts");
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

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
  const [showSocialLifestyle, setShowSocialLifestyle] = useState(false);
  const [showClinicalDiagnosis, setShowClinicalDiagnosis] = useState(false);
  const [showAllergies, setShowAllergies] = useState(false);
  const [socialLifestyle, setSocialLifestyle] = useState("");
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState("");
  const [allergies, setAllergies] = useState("");

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
  const handleOpenSocialLifestyle = () => {
    setShowSocialLifestyle(true);
  };

  const handleCloseSocialLifestyle = () => {
    setShowSocialLifestyle(false);
  };

  const handleOpenClinicalDiagnosis = () => {
    setShowClinicalDiagnosis(true);
  };

  const handleCloseClinicalDiagnosis = () => {
    setShowClinicalDiagnosis(false);
  };

  const handleOpenAllergies = () => {
    setShowAllergies(true);
  };

  const handleCloseAllergies = () => {
    setShowAllergies(false);
  };

  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getOnePaisentReg/${id}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setPatient(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPatient();
  }, [1]);

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const handleViewMedicalHistory = (history) => {
    setMedicalHistory(history);
    setShowModal(true);
  };

  const handleViewSocialLifestyle = (lifestyle) => {
    setSocialLifestyle(lifestyle);
    setShowSocialLifestyle(true);
  };

  const handleViewClinicalDiagnosis = (diagnosis) => {
    setClinicalDiagnosis(diagnosis);
    setShowClinicalDiagnosis(true);
  };

  const handleViewAllergies = (allergies) => {
    setAllergies(allergies);
    setShowAllergies(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setMedicalHistory("");
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

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
    !currentUser.roles.includes("ROLE_DOCTOR") &&
    !currentUser.roles.includes("ROLE_NURSE")
  ) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return "Access Denied!";
    // You can handle the redirection or error message display as per your requirement
  }

  const style = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    fontSize: "12px",
    paddingLeft: 0,
  };

  const h1Style = {
    fontSize: "16px",

    textAlign: "center",
  };

  const h2Style = {
    fontSize: "14px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "13px" /* Adjust the font size for <h3> */,
  };

  return (
    <>
      {/* <div className="center container" style={h1Style}>
        <h2>Patient Prescription List</h2>
      </div> */}

      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("PatientPrescriptionList")}</h2>
      </header>
      <br></br>
      {/* <Container style={style} className="d-flex mt-5 justify-content-center">
        <h2 style={h2Style} className="text-left col-6">Patient Details: </h2>

        <Row className="text-left col-6">
          {patient && (
            <Col className="my-3">
              <div>
                <p>
                  <strong>Patient ID:</strong> {`${patient.id} `}  <strong>, Registration Date:</strong> {formatDate(patient.createdAt)}
                </p>
                <p>
                  <strong>Patient Name:</strong> {`${patient.firstName} `}{`${patient.middleName} `} {`${patient.lastName}`} {" "} <strong>, Age:</strong> {patient.age} {'                  '}
                  <strong>Gender:</strong> {patient.gender}
                </p>
                <p>
                  <strong>Contact Number:</strong> {patient.phoneNumberP}{" "} <strong>, Email Address:</strong> {patient.email}
                </p>

                <p>
                  <strong>Weight:</strong> {patient.weight}Kg. {'  '}
                  <strong>Height:</strong> {patient.height}cm.
                </p>
              </div>
            </Col>
          )}
        </Row>
      </Container> */}

      <Container style={style} className="mt-0">
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Card style={{ border: "none" }}>
              <Card.Body>
                <Card.Title style={{ fontSize: "13px" }}>
                  {t("PatientDetails")}
                </Card.Title>
                <br />
                <Card.Text>
                  <p>
                    <strong>{t("PatientID")}:</strong> {patient.id},{" "}
                    <strong>{t("PatientName")}:</strong>{" "}
                    {`${patient.firstName} `}
                    {`${patient.middleName} `}
                    {`${patient.lastName}`} ,<strong>{t("Gender")}:</strong>{" "}
                    {patient.gender}
                  </p>
                  <p>
                    <strong>{t("ContactNumber")}:</strong>
                    {patient.phoneNumberP}{" "}
                    <strong>, {t("EmailAddress")}:</strong> {patient.email}
                  </p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card style={{ border: "none" }}>
              <Card.Body>
                <Card.Title style={h3Style}> </Card.Title>
                <Card.Text>
                  <p>
                    <strong>{t("RegistrationDate")}:</strong>{" "}
                    {patient.createdAt}
                  </p>
                  <p>
                    <strong>{t("Age")}:</strong> {patient.age}{" "}
                    <strong>,{t("Weight")}:</strong> {patient.weight}Kg.{" "}
                    <strong>{t("Height")}:</strong> {patient.height}cm.
                  </p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <div className="container mt-3">
        <h3 style={h3Style}>{t("PrescriptionList")}:</h3>
        {isMobile ? (
          <div style={style} className="table-responsive">
            {patient.patientPrecription &&
              patient.patientPrecription
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((prescription) => (
                  <Card key={prescription.id} className="mb-3">
                    <Card.Body>
                      <Card.Title>
                        <>{t("DoctorName")}:</> {prescription.PrescribedDoctor}
                      </Card.Title>
                      <Card.Text>
                        <strong> {t("PrescriptionID")}:</strong>{" "}
                        {prescription.prescriptionId}
                        <br />
                        <strong>{t("RegNo")}:</strong>{" "}
                        {prescription.RegistrationNo}
                        <br />
                        <strong>{t("PhoneNo")}:</strong> {prescription.PhoneNo}
                        <br />
                        <div className="d-flex justify-content-between">
                          <strong>{t("MedicalHistory")}:</strong>{" "}
                          <button
                            style={{ fontSize: "12px" }}
                            className="btn btn-link"
                            onClick={() =>
                              handleViewMedicalHistory(
                                prescription.medicalHistory
                              )
                            }
                          >
                            {t("View")}
                          </button>
                        </div>
                        <div className="d-flex justify-content-between">
                          <strong>{t("SocialLifestyle")}:</strong>{" "}
                          <button
                            style={{ fontSize: "12px" }}
                            className="btn btn-link"
                            onClick={() =>
                              handleViewSocialLifestyle(
                                prescription.socialLifestyle
                              )
                            }
                          >
                            {t("View")}
                          </button>
                        </div>
                        <div className="d-flex justify-content-between">
                          <strong>{t("ClinicalDiagnosis")}:</strong>{" "}
                          <button
                            style={{ fontSize: "12px" }}
                            className="btn btn-link"
                            onClick={() =>
                              handleViewClinicalDiagnosis(
                                prescription.clinicalDiagnosis
                              )
                            }
                          >
                            {t("View")}
                          </button>
                        </div>
                        <div className="d-flex justify-content-between">
                          <strong>{t("Allergies")}:</strong>{" "}
                          <button
                            style={{ fontSize: "12px" }}
                            className="btn btn-link"
                            onClick={() =>
                              handleViewAllergies(prescription.allergies)
                            }
                          >
                            {t("View")}
                          </button>
                        </div>
                        <strong>{t("PrescriptionDate")}:</strong>{" "}
                        {formatDateInSelectedLanguage(
                          new Date(prescription.createdAt)
                        )}
                        <br />
                        <br />
                        <div className="d-flex justify-content-center">
                          <Link
                            to={`/${extractedPart}/patientMedecines/${patient.id}/${prescription.id}`}
                          >
                            <Button
                              variant="secondary"
                              size="lg"
                              className="mr-2"
                            >
                              <FaRegEye /> {t("ViewPrescription")}
                            </Button>
                          </Link>
                          <Link
                            to={`/${extractedPart}/ViewMedicationReport/${prescription.id}`}
                          >
                            <Button variant="secondary" size="lg">
                              <MdAssignmentAdd /> {t("ViewReport")}
                            </Button>
                          </Link>
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
          </div>
        ) : (
          <div style={style} className="table-responsive">
            <table
              style={{ verticalAlign: "middle", textAlign: "center" }}
              className="table table-bordered"
            >
              <thead>
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>
                    {t("patientPrescriptionTable.PrescriptionID")}
                  </th>
                  <th style={{ whiteSpace: "nowrap" }}>{t("DoctorName")}</th>
                  <th style={{ textAlign: "center" }}>
                    {t("patientPrescriptionTable.RegNo")}
                  </th>
                  <th style={{ whiteSpace: "nowrap" }}>{t("PhoneNo")}</th>
                  <th style={{ whiteSpace: "nowrap" }}>
                    {t("patientPrescriptionTable.MedicalHistory")}
                  </th>
                  <th style={{ whiteSpace: "nowrap" }}>
                    {t("patientPrescriptionTable.SocialLifestyle")}
                  </th>
                  <th style={{ whiteSpace: "nowrap" }}>
                    {t("patientPrescriptionTable.ClinicalDiagnosis")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("patientPrescriptionTable.Allergies")}
                  </th>
                  <th style={{ whiteSpace: "nowrap" }}>
                    {t("patientPrescriptionTable.PrescriptionDate")}
                  </th>
                  <th style={{ whiteSpace: "nowrap" }}>
                    {t("patientPrescriptionTable.ViewDetails")}
                  </th>
                  <th style={{ whiteSpace: "nowrap" }}>
                    {t("patientPrescriptionTable.MedicationAdministration")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {patient.patientPrecription &&
                  patient.patientPrecription
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    ) // Sort the array in descending order based on createdAt
                    .map((prescription) => (
                      <tr key={prescription.id}>
                        <td style={{ textAlign: "center" }}>
                          {prescription.prescriptionId}
                        </td>
                        <td
                          style={{ textAlign: "center" }}
                        >{`${prescription.PrescribedDoctor} `}</td>
                        <td style={{ textAlign: "center" }}>
                          {prescription.RegistrationNo}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {""}
                          {prescription.PhoneNo}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            style={{ fontSize: "12px" }}
                            className="btn btn-link"
                            onClick={() =>
                              handleViewMedicalHistory(
                                prescription.medicalHistory
                              )
                            }
                          >
                            {t("View")}
                          </button>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            style={{ fontSize: "12px" }}
                            className="btn btn-link"
                            onClick={() =>
                              handleViewSocialLifestyle(
                                prescription.socialLifestyle
                              )
                            }
                          >
                            {t("View")}
                          </button>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            style={{ fontSize: "12px" }}
                            className="btn btn-link"
                            onClick={() =>
                              handleViewClinicalDiagnosis(
                                prescription.clinicalDiagnosis
                              )
                            }
                          >
                            {t("View")}
                          </button>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            style={{ fontSize: "12px" }}
                            className="btn btn-link"
                            onClick={() =>
                              handleViewAllergies(prescription.allergies)
                            }
                          >
                            {t("View")}
                          </button>
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {formatDateInSelectedLanguage(
                            new Date(prescription.createdAt)
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <Link
                            to={`/${extractedPart}/patientMedecines/${patient.id}/${prescription.id}`}
                          >
                            <button
                              title={t("ViewPrescription")}
                              style={{
                                fontSize: "12px",
                                marginTop: "10px",
                                padding: "4px 5px",
                                marginLeft: "10px",
                              }}
                              className="btn btn-secondary mr-2"
                            >
                              <FaRegEye />
                            </button>
                          </Link>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <Link
                            to={`/${extractedPart}/ViewMedicationReport/${prescription.id}`}
                          >
                            <button
                              title={t("ViewReport")}
                              style={{
                                fontSize: "12px",
                                marginTop: "10px",
                                padding: "4px 5px",
                                marginLeft: "10px",
                              }}
                              className="btn btn-secondary mr-2"
                            >
                              <FaRegEye />
                            </button>
                          </Link>
                          <Link
                            to={`/${extractedPart}/PatientMedication/${prescription.id}`}
                          >
                            <button
                              title="UpdateMedication"
                              style={{
                                fontSize: "10px",
                                marginTop: "10px",
                                marginLeft: "10px",
                              }}
                              className="btn btn-secondary"
                            >
                              <FaPencilAlt />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
        }}
      >
        <Link to={`/${extractedPart}/PatientDataNurse`}>
          <button
            style={{ fontSize: "13px", padding: "4px 5px" }}
            className="btn btn-primary btn-sm"
          >
            {t("GoBack")}
          </button>
        </Link>
      </div>

      <Modal style={style} show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title style={h1Style}>{t("MedicalHistory")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{medicalHistory}</Modal.Body>
        <Modal.Footer>
          <Button
            style={h3Style}
            variant="secondary"
            onClick={handleCloseModal}
          >
            {t("Close")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        style={style}
        show={showSocialLifestyle}
        onHide={handleCloseSocialLifestyle}
      >
        <Modal.Header closeButton>
          <Modal.Title style={h1Style}>{t("SocialLifestyle")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{socialLifestyle}</Modal.Body>
        <Modal.Footer>
          <Button
            style={h3Style}
            variant="secondary"
            onClick={handleCloseSocialLifestyle}
          >
            {t("Close")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        style={style}
        show={showClinicalDiagnosis}
        onHide={handleCloseClinicalDiagnosis}
      >
        <Modal.Header closeButton>
          <Modal.Title style={h1Style}>{t("ClinicalDiagnosis")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{clinicalDiagnosis}</Modal.Body>
        <Modal.Footer>
          <Button
            style={h3Style}
            variant="secondary"
            onClick={handleCloseClinicalDiagnosis}
          >
            {t("Close")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal style={style} show={showAllergies} onHide={handleCloseAllergies}>
        <Modal.Header closeButton>
          <Modal.Title style={h1Style}>{t("Allergies")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{allergies}</Modal.Body>
        <Modal.Footer>
          <Button
            style={h3Style}
            variant="secondary"
            onClick={handleCloseAllergies}
          >
            {t("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PrescriptionDetails;
