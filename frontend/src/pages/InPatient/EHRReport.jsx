import React, { useState } from "react";
import Webcam from "react-webcam";
import Select from "react-select";
import { useEffect, useRef, Component } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Card, Row, Col, Container, Modal, Button } from "react-bootstrap";
import DischargePatient from "./DischargedPatient";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Translation from "../../translations/EHRReport.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import "moment/locale/fr";
import { registerLocale } from "react-datepicker";
import AuthService from "../../services/auth.service";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "moment/locale/fr";
import {
  FaCalendar,
  FaCartPlus,
  FaDownload,
  FaPenAlt,
  FaPlus,
} from "react-icons/fa";
import DownloadPDFButton from "../DiagnosticsComponent/DownloadResultDiagnosticReport";
import DownloadPDFButtonPathology from "../PathologyAllTest/PathologyTestReportAllTest";
const localizer = momentLocalizer(moment);

const EHRReport = () => {
  const currentUser = AuthService.getCurrentUser();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const locales = { enIN, fr };
  const [selectedPatient, setSelectedPatient] = useState(undefined);
  const [diagnosticTestData, setDiagnosticTestData] = useState([]);
  const [PathologyTestData, setPathologyTestData] = useState([]);
  const [selectedAdmittedPatient, setSelectedAdmittedPatient] = useState({});
  const [DiagnosticID, setDiagnosticID] = useState(null);

  const [PathologyID, setPathologyID] = useState(null);
  registerLocale("fr", fr);
  registerLocale("en", enIN);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
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

  const [admissionID, SetAdmissionID] = useState(null);
  const [hospitalAdmissions, setHospitalAdmissions] = useState([]);
  const [lastRecord, setLastRecord] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [patientData, setPatientData] = useState([]);

  const fetchDataFromPathology = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getHospitalBillingData`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPatientData(response.data);
      })
      .catch((error) => {
        console.log("error 25 : ", error);
      });
  };
  useEffect(() => {
    // alert(admissionID);
    if (admissionID > 0) {
      //alert("Hii");
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }/api/listOfInpatientTestonAdmissionIDDiagnostic/${admissionID}`;

      axios
        .get(apiUrl, {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        })
        .then((response) => {
          //alert(response.data);
          setDiagnosticTestData(response.data);
        })
        .catch((error) => {
          console.error("Test Completed:", error);
        });
    }
  }, [admissionID]);
  useEffect(() => {
    // alert(admissionID);
    if (admissionID > 0) {
      //alert("Hii");
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }/api/listOfInpatientTestonAdmissionIDPathology/${admissionID}`;

      axios
        .get(apiUrl, {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        })
        .then((response) => {
          // alert(response.data);
          setPathologyTestData(response.data);
        })
        .catch((error) => {
          console.error("Test Completed:", error);
        });
    }
  }, [admissionID]);
  useEffect(() => {
    fetchDataFromPathology();
  }, []);
  const fetchPatientDetails = async (patientId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getOnePaisentReg/${patientId}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setPatientDetails(response.data);
      const length = response.data?.patientPrecription.length - 1;
      // alert(
      //   JSON.stringify(
      //     response.data?.patientPrecription[
      //       response.data?.patientPrecription.length - 1
      //     ].clinicalDiagnosis
      //   )
      // );
      setLastRecord(response.data?.patientPrecription.length - 1);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  useEffect(() => {
    if (selectedPatient) {
      const parsedPatient = selectedPatient;
      //   alert(parsedPatient.PatientID);
      //   return;
      fetchPatientDetails(parsedPatient.PatientID);
    } else {
      setPatientDetails(null);
    }
  }, [selectedPatient]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getHospitalAdmissionList`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setHospitalAdmissions(response.data?.data);
      })
      .catch((error) => {
        console.error("Error fetching hospital admissions:", error);
      });
  }, []);

  const handleGenerateReportNewDiagnostic = (test) => {
    // alert(test.TestStatus);
    SetAdmissionID(test.admissionID);
    if (test.TestStatus !== "Test Completed") {
      toast.error(t("ResultNotFound"));
      return;
    }
    setDiagnosticID(test.DiagnosticTestBookingId);
  };
  const handleGenerateReportNewPathology = (test) => {
    //  alert(test.TestStatus);
    SetAdmissionID(test.admissionID);
    if (test.TestStatus !== "Test Completed") {
      toast.error(t("ResultNotFound"));
      return;
    }
    setPathologyID(test.PathologyTestBookingId);
  };

  const [prescriptionData, setPrescriptionData] = useState(null);
  const handleFetchPrescriptionData = (admissionId) => {
    //alert(admissionId);
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/getOnePrescriptionForIn-patient/${admissionId}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        setPrescriptionData(response.data?.prescription);
        // Show the modal with prescription data here
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(`${t("Error")}: ${error.response.data.message}`);
          setPrescriptionData(null);
        } else {
          toast.error(t("AnErrorOccurredWhileFetchingPrescriptionData"));
        }
        setPrescriptionData(null);
        console.error("Error fetching prescription data:", error);
      });
  };
  useEffect(() => {
    if (admissionID) handleFetchPrescriptionData(admissionID);
  }, [admissionID]);
  const style = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    fontSize: "12px",
    paddingLeft: 0,
  };
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    // window.location.replace("/");
    return "Access Denied";
  }
  return (
    <>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {t("EHRReport")}
      </header>
      <br />
      <div style={{ marginLeft: "1%", marginRight: "1%" }} className="row my-4">
        <div className="col-md-3 ">
          <Select
            menuPortalTarget={document.body}
            menuPosition={"fixed"}
            placeholder={t("SelectPatient")}
            styles={{
              control: (provided, state) => ({
                ...provided,
                fontSize: "12px",
                width: "100%",
              }),
            }}
            options={[
              { value: "", label: t("SelectPatient") },
              ...hospitalAdmissions.map((patient) => ({
                value: JSON.stringify(patient),
                label: patient.PatientName,
              })),
            ]}
            onChange={(selectedOption) => {
              if (selectedOption.value === "") {
                setSelectedPatient("");
              } else {
                const patient = JSON.parse(selectedOption.value);
                setSelectedPatient(patient);
                setSelectedAdmittedPatient(patient);
                SetAdmissionID(patient?.id);
              }
            }}
          />
        </div>
      </div>

      {patientDetails && (
        <>
          <div
            style={{
              border: "1px solid black",
              padding: "20px",
              marginLeft: "2%",
              marginRight: "2%",
            }}
          >
            <Container style={style} className="mt-0">
              <table className="table">
                <tbody>
                  <span style={{ textDecoration: "underline" }}>
                    <strong>{t("ehrreportTable.DemographicsDetails")}:</strong>
                  </span>

                  <br></br>
                  <tr>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.PatientID")}
                    </th>
                    <td>{patientDetails.id}</td>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.PatientName")}
                    </th>
                    <td>
                      {`${patientDetails?.mr} `}
                      {`${patientDetails?.firstName} `}
                      {`${patientDetails?.middleName} `}
                      {`${patientDetails?.lastName}`}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.Gender")}
                    </th>
                    <td>{patientDetails.gender}</td>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.ContactNumber")}
                    </th>
                    <td>{patientDetails?.phoneNumberP}</td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.Address")}
                    </th>
                    <td>{patientDetails?.address}</td>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.RegistrationDate")}
                    </th>
                    <td>{patientDetails?.createdAt}</td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.Age")}
                    </th>
                    <td>
                      {patientDetails?.age} {patientDetails?.ageOption}
                    </td>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.Weight")}
                    </th>
                    <td>{patientDetails?.weight} Kg</td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.MedicalHistory")}
                    </th>
                    <td>
                      {
                        patientDetails?.patientPrecription[lastRecord]
                          ?.medicalHistory
                      }{" "}
                    </td>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.Allergies")}
                    </th>
                    <td>
                      {
                        patientDetails?.patientPrecription[lastRecord]
                          ?.Allergies
                      }{" "}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.ClinicalDiagnosis")}
                    </th>
                    <td>
                      {
                        patientDetails?.patientPrecription[lastRecord]
                          ?.clinicalDiagnosis
                      }{" "}
                    </td>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.SocialLifestyle")}
                    </th>
                    <td>
                      {
                        patientDetails?.patientPrecription[lastRecord]
                          ?.socialLifestyle
                      }{" "}
                    </td>
                  </tr>

                  <br></br>
                  <span style={{ textDecoration: "underline" }}>
                    <strong>{t("ehrreportTable.VitalSigns")}:</strong>
                  </span>

                  <br></br>
                  <tr>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.BloodPressure")}
                    </th>
                    <td>
                      {
                        patientDetails?.patientPrecription[lastRecord]
                          ?.bloodPressure
                      }{" "}
                    </td>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.respiratoryRate")}
                    </th>
                    <td>
                      {
                        patientDetails?.patientPrecription[lastRecord]
                          ?.respiratoryRate
                      }{" "}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.heartRate")}
                    </th>
                    <td>
                      {
                        patientDetails?.patientPrecription[lastRecord]
                          ?.heartRate
                      }{" "}
                    </td>
                    <th style={{ textAlign: "center" }}>
                      {t("ehrreportTable.Temperature")}
                    </th>
                    <td>
                      {
                        patientDetails?.patientPrecription[lastRecord]
                          ?.temperature
                      }{" "}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Container>
          </div>
          <br></br>
          <div
            style={{
              border: "1px solid black",
              padding: "20px",
              marginLeft: "2%",
              marginRight: "2%",
            }}
          >
            <Container style={style} className="mt-0">
              <table className="table">
                <tbody>
                  <tr>
                    <span style={{ textDecoration: "underline" }}>
                      <strong>{t("ehrreportTable.DiagnosticSummary")}:</strong>
                    </span>
                  </tr>
                  <tr>
                    <br></br>
                    {diagnosticTestData && diagnosticTestData.length > 0 ? (
                      <Table
                        className="table-striped table-hover table-bordered"
                        style={{
                          verticalAlign: "middle",
                          textAlign: "center",
                          fontSize: "12px",
                        }}
                        bordered
                        striped
                        responsive
                      >
                        <Thead>
                          <Tr>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.TestID")}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.TestName")}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.TestStatus")}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.TestBookingID")}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.TestRegisteredDateTime")}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.TestCompletedDateTime")}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.AdmissionID")}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.DownloadReport")}
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {diagnosticTestData.map((test) => (
                            <Tr key={test.id}>
                              <Td style={{ textAlign: "center" }}>
                                {test.TestID}
                              </Td>
                              <Td style={{ textAlign: "center" }}>
                                {test.testName}
                              </Td>
                              <Td style={{ textAlign: "center" }}>
                                {test.TestStatus}
                              </Td>
                              <Td style={{ textAlign: "center" }}>
                                {test.DiagnosticTestBookingId}
                              </Td>

                              <Td style={{ textAlign: "center" }}>
                                {formatDateInSelectedLanguage(
                                  new Date(test.TestRegisteredDateTime)
                                )}
                              </Td>
                              <Td style={{ textAlign: "center" }}>
                                {formatDateInSelectedLanguage(
                                  new Date(test.TestCompletedDateTime)
                                )}
                              </Td>
                              <Td style={{ textAlign: "center" }}>
                                {test.admissionID}
                              </Td>
                              <Td style={{ textAlign: "center" }}>
                                <button
                                  style={{
                                    fontSize: "12px",
                                    padding: "4px 5px",
                                  }}
                                  title={"DownloadReport"}
                                  className="btn btn-secondary"
                                  onClick={() => {
                                    handleGenerateReportNewDiagnostic(test);
                                  }}
                                >
                                  <FaDownload />
                                </button>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    ) : (
                      <div>Diagnostic Test Data Not Found</div>
                    )}
                  </tr>
                </tbody>
              </table>
            </Container>
          </div>

          <br></br>
          <div
            style={{
              border: "1px solid black",
              padding: "20px",
              marginLeft: "2%",
              marginRight: "2%",
            }}
          >
            <Container style={style} className="mt-0">
              <table className="table">
                <tbody>
                  <tr>
                    <span style={{ textDecoration: "underline" }}>
                      <strong>{t("AdmissionSummary")}:</strong>
                    </span>
                    <br></br>
                    {/* <>Treatment Plan Not Found</> */}
                  </tr>
                  <tr>
                    <br></br>
                    <Table
                      className="table-striped table-hover table-bordered"
                      style={{
                        verticalAlign: "middle",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                      bordered
                      striped
                      responsive
                    >
                      <Thead>
                        <Tr>
                          <Th style={{ textAlign: "center" }}>
                            {t("ehrreportTable.AdmissionID")}
                          </Th>
                          <Th style={{ textAlign: "center" }}>
                            {t(
                              "AdmissionAndDischargeManagementTable.admissionDate"
                            )}
                          </Th>
                          <Th style={{ textAlign: "center" }}>
                            {t("DoctorConsulation")}
                          </Th>
                          <Th style={{ textAlign: "center" }}>
                            {t("Admittedby")}
                          </Th>

                          <Th style={{ textAlign: "center" }}>{t("Reason")}</Th>
                          <Th style={{ textAlign: "center" }}>
                            {t("Diagnosis")}
                          </Th>
                          <Th style={{ textAlign: "center" }}>
                            {t("TreatmentPlan")}
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {
                          <Tr>
                            <Td style={{ textAlign: "center" }}>
                              {selectedAdmittedPatient?.id}
                            </Td>
                            <Td style={{ textAlign: "center" }}>
                              {selectedAdmittedPatient?.AdmissionDate}
                            </Td>
                            <Td style={{ textAlign: "center" }}>
                              {prescriptionData?.PrescribedDoctor}
                            </Td>
                            <Td style={{ textAlign: "center" }}>
                              Dr {selectedAdmittedPatient?.AdmittingPhysician}
                            </Td>
                            <Td style={{ textAlign: "center" }}>
                              {selectedAdmittedPatient?.ReasonForAdmission}
                            </Td>
                            <Td style={{ textAlign: "center" }}>
                              {
                                patientDetails?.patientPrecription[lastRecord]
                                  ?.clinicalDiagnosis
                              }
                            </Td>
                            <Td style={{ textAlign: "center" }}>
                              {selectedAdmittedPatient?.TreatmentPlan}
                            </Td>
                          </Tr>
                        }
                      </Tbody>
                    </Table>
                  </tr>
                </tbody>
              </table>
            </Container>
          </div>

          <br></br>
          <div
            style={{
              border: "1px solid black",
              padding: "20px",
              marginLeft: "2%",
              marginRight: "2%",
            }}
          >
            <Container style={style} className="mt-0">
              <table className="table">
                <tbody>
                  <tr>
                    <span style={{ textDecoration: "underline" }}>
                      <strong>
                        {t("ehrreportTable.DischargeTreatmentSummary")}:
                      </strong>
                    </span>
                  </tr>
                  <br></br>
                  {admissionID && (
                    <DischargePatient admissionIDEHR={admissionID} />
                  )}
                </tbody>
              </table>
            </Container>
          </div>
          <br></br>
          <br></br>
          <div
            style={{
              border: "1px solid black",
              padding: "20px",
              marginLeft: "2%",
              marginRight: "2%",
            }}
          >
            <Container style={style} className="mt-0">
              <table className="table">
                <tbody>
                  <tr>
                    <span style={{ textDecoration: "underline" }}>
                      <strong>{t("ehrreportTable.PathologySummary")}:</strong>
                    </span>
                  </tr>
                  <tr>
                    <br></br>
                    {prescriptionData && PathologyTestData.length > 0 ? (
                      <div class="table-responsive">
                        <Table
                          className="table-striped  table-hover table-bordered"
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                          bordered
                          striped
                          responsive
                        >
                          <Thead>
                            <Tr>
                              <Th style={{ textAlign: "center" }}>
                                {t("ehrreportTable.TestID")}
                              </Th>
                              <Th style={{ textAlign: "center" }}>
                                {t("ehrreportTable.TestName")}
                              </Th>
                              <Th style={{ textAlign: "center" }}>
                                {t("ehrreportTable.TestStatus")}
                              </Th>
                              <Th style={{ textAlign: "center" }}>
                                {t("ehrreportTable.TestBookingID")}
                              </Th>
                              <Th style={{ textAlign: "center" }}>
                                {t("ehrreportTable.TestRegisteredDateTime")}
                              </Th>
                              <Th style={{ textAlign: "center" }}>
                                {t("ehrreportTable.TestCompletedDateTime")}
                              </Th>
                              <Th style={{ textAlign: "center" }}>
                                {t("ehrreportTable.AdmissionID")}
                              </Th>
                              <Th style={{ textAlign: "center" }}>
                                {t("ehrreportTable.DownloadReport")}
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {PathologyTestData?.map((test) => (
                              <Tr key={test.id}>
                                <Td style={{ textAlign: "center" }}>
                                  {test.TestID}
                                </Td>
                                <Td style={{ textAlign: "center" }}>
                                  {test.testName}
                                </Td>
                                <Td style={{ textAlign: "center" }}>
                                  {test.TestStatus}
                                </Td>
                                <Td style={{ textAlign: "center" }}>
                                  {test.PathologyTestBookingId}
                                </Td>

                                <Td style={{ textAlign: "center" }}>
                                  {formatDateInSelectedLanguage(
                                    new Date(test.TestRegisteredDateTime)
                                  )}
                                </Td>
                                <Td style={{ textAlign: "center" }}>
                                  {formatDateInSelectedLanguage(
                                    new Date(test.TestCompletedDateTime)
                                  )}
                                </Td>
                                <Td style={{ textAlign: "center" }}>
                                  {test.admissionID}
                                </Td>
                                <Td style={{ textAlign: "center" }}>
                                  <button
                                    style={{
                                      fontSize: "12px",
                                      padding: "4px 5px",
                                    }}
                                    title={t("ehrreportTable.DownloadReport")}
                                    className="btn btn-secondary"
                                    onClick={() => {
                                      handleGenerateReportNewPathology(test);
                                    }}
                                  >
                                    <FaDownload />
                                  </button>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </div>
                    ) : (
                      <div>{t("ehrreportTable.PathologyTestDataNotFound")}</div>
                    )}
                  </tr>
                </tbody>
              </table>
            </Container>
          </div>

          <br></br>
          <div
            style={{
              border: "1px solid black",
              padding: "20px",
              marginLeft: "2%",
              marginRight: "2%",
            }}
          >
            <Container style={style} className="mt-0">
              <Table>
                <Tbody>
                  <tr>
                    <span style={{ textDecoration: "underline" }}>
                      <strong>
                        {t("EPrescriptionPrescribedDoctor")}:{" "}
                        {prescriptionData?.PrescribedDoctor}):
                      </strong>
                    </span>
                  </tr>
                  <tr>
                    <br></br>
                    {prescriptionData?.medicines &&
                    prescriptionData.medicines.length > 0 ? (
                      <Table
                        className="table-striped  table-hover table-bordered"
                        style={{
                          verticalAlign: "middle",
                          textAlign: "center",
                          fontSize: "12px",
                        }}
                        bordered
                        striped
                        responsive
                      >
                        <Thead>
                          <Tr>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.Name")}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.DosageAmount")}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.ClinicalAdvice")}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.StartDate")}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.Duration")}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {t("ehrreportTable.Quantity")}
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {prescriptionData.medicines.map((medicine) => (
                            <Tr key={medicine.id}>
                              <Td style={{ textAlign: "center" }}>
                                {medicine.medicineName}
                              </Td>
                              <Td style={{ textAlign: "center" }}>
                                {medicine.dosageAmount}
                              </Td>
                              <Td style={{ textAlign: "center" }}>
                                {medicine.food}
                              </Td>
                              <Td style={{ textAlign: "center" }}>
                                {medicine.startDate}
                              </Td>
                              <Td style={{ textAlign: "center" }}>
                                {medicine.weekly}
                              </Td>
                              <Td style={{ textAlign: "center" }}>
                                {medicine.quantity}
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    ) : (
                      <div>{t("Noprescriptionavailable")}</div>
                    )}
                  </tr>
                </Tbody>
              </Table>
            </Container>
          </div>

          {DiagnosticID && <DownloadPDFButton testBookingID={DiagnosticID} />}
          {PathologyID && (
            <DownloadPDFButtonPathology testBookingID={PathologyID} />
          )}

          <br></br>
          <br></br>
        </>
      )}
    </>
  );
};

export default EHRReport;
