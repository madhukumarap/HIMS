import jsPDF from "jspdf";
import { IoPrintSharp, IoDownload, IoCloudDownload } from "react-icons/io5";
import Select from "react-select";
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Col, Button, Table, Card } from "react-bootstrap";
import axios from "axios";
import Datepickrange from "./DateRangeCalender";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  FaPencilAlt,
  FaPlus,
  FaTrashAlt,
  FaRegEye,
  FaPlusSquare,
  FaDownload,
} from "react-icons/fa";
import DownloadPDFButton from "./DiagnosticsComponent/DownloadResultDiagnosticReport";
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../services/auth.service";
import Translation from "../translations/Pathologytest.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { CurrencyContext } from "../context/CurrencyProvider";

function DiagnosticsBookingForPatient() {
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  const navigate = useNavigate();
  const [testBookingID, setTestBookingID] = useState(null);
  const [selectedPackageID, setSelectedPackageID] = useState(null);
  const [PackageSelectedTests, setPackageSelectedTests] = useState([]);
  const [packages, setPackages] = useState([]);
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
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState([]);

  const [testNames, setTestNames] = useState([]);
  const [enterCodeData, setEnterCodeData] = useState([]);
  const [selectedReportData, setSelectedReportData] = useState(null);
  /////////////////////////////////////////////////////////////////////////////////////
  const [selectedTestBooking, setSelectedTestBooking] = useState(null);
  const [showTestNamesModal, setShowTestNamesModal] = useState(false);

  // Create a function to handle the View button click
  const [testStatuses, setTestStatuses] = useState([]);

  // Function to fetch test statuses
  const fetchTestStatuses = async (bookingId) => {
    try {
      // alert(bookingId);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/DiagnosticTestStatuses/${bookingId}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setTestStatuses(data);
      console.log("testStatuses", testStatuses);
      // alert(JSON.stringify(testStatuses));
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };
  const handleViewTestNames = (testBooking) => {
    setSelectedTestBooking(testBooking);
    const bookingId = testBooking.id;

    // Fetch test statuses
    fetchTestStatuses(bookingId);
    //alert();
    setShowTestNamesModal(true);
  };
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/DiagnosticsGetAllPackagesWithTests`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAddResult = (booking) => {
    if (booking?.PaymentStatus === "Not-Paid") {
      toast.error("Payment Not Paid for this Patient");
      return;
    }
    console.log("Selected Report Data:", booking);
    setSelectedReportData(booking);
    //alert(JSON.stringify(booking));
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
  const handleGenerateReportNew = (testBookingID) => {
    if (testBookingID.status !== "Completed") {
      toast.error("Result Not Found");
      return;
    }
    setTestBookingID(testBookingID.id);
  };
  const [
    showReportModalBloodSugarFasting,
    setShowReportModalBloodSugarFasting,
  ] = useState(false);
  useEffect(() => {
    if (true && selectedReportData?.selectedTests) {
      setShowReportModalBloodSugarFasting(true);
    } else {
      console.log("Manage The Test Result Fields first");
      setShowReportModalBloodSugarFasting(false);
    }
  }, [selectedReportData]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllDiagnosticTests`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setTestNames(response?.data?.tests || []);
        //alert(JSON.stringify(testNames));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetchEnterCodeData();
  }, []);

  function formatDate2(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const fetchEnterCodeData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/GetEnterCodeList`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setEnterCodeData(data);
    } catch (error) {
      console.error("Error fetching Enter Code data:", error);
    }
  };

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [SelectedTests, setSelectedTests] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null); // To store the ID of the booking being deleted
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // alert(showReportModalBloodForPP);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  const filteredBookings = bookings.filter((booking) => {
    const isNameMatch =
      booking.PatientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.PatientPhoneNo.toString().includes(searchQuery) &&
        searchQuery.trim() !== "");

    const isDateMatch =
      (!startDate || new Date(booking.createdAt) >= startDate) &&
      (!endDate || new Date(booking.createdAt) <= endDate);

    return isNameMatch && isDateMatch;
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDoctorData`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const [reportselectedTest, setReportSelectedTest] = useState("");

  const fetchBookings = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getDiagnosticsBooking`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setBookings(response.data.bookings);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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

  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser) {
    return "Access Denied";
  }
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_DIAGNOSTICTECHNICIAN") &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_PATIENT")
  ) {
    return "Access Denied";
  }
  const DiagnosticsBookingForPatient = () => {
    navigate(`/${extractedPart}/DiagnosticsBookingForPatient`);
  };
  const PathologytestOwnReport = () => {
    navigate(`/${extractedPart}/PathologytestOwnReport`);
  };

  return (
    <div style={{ fontSize: "12px" }} className="container">
      <div>
        <Button
          style={{
            fontSize: "12px",
          }}
          variant="secondary"
          onClick={DiagnosticsBookingForPatient}
          as="input"
          type="button"
          value={t("DiagnosticTest")}
        />{" "}
        <Button
          variant="secondary"
          style={{
            fontSize: "12px",
          }}
          onClick={PathologytestOwnReport}
          as="input"
          type="button"
          value={t("PathologyTest")}
        />{" "}
      </div>
      <br></br>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{t("MyTestBookings(Diagnostic)")}</h2>
      </header>
      <br></br>

      <br></br>
      {isMobile ? (
        <div>
          {filteredBookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((booking, index) => {
              if (+currentUser.phoneNumber === booking.PatientPhoneNo) {
                return (
                  <div className="card mb-3" key={booking.id}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h5 className="card-title">
                          {t("PatientName")}: {booking.PatientName}
                        </h5>
                        <button
                          title={t("pathologyPatientListTable.DownloadReport")}
                          style={{
                            whiteSpace: "nowrap",
                            fontSize: "12px",
                            height: "50%",
                            padding: "4px 5px",
                          }}
                          className="btn btn-secondary"
                          onClick={() => handleGenerateReportNew(booking)}
                        >
                          <FaDownload />
                        </button>
                      </div>
                      <p className="card-text">
                        {t("pathologyPatientListTable.TestName")}:{" "}
                        <button
                          title={t("pathologyPatientListTable.ViewTests")}
                          style={{ fontSize: "13px", padding: "4px 5px" }}
                          className="btn btn-secondary"
                          onClick={() => handleViewTestNames(booking)}
                        >
                          <FaRegEye />
                        </button>
                      </p>

                      <p className="card-text">
                        {t("pathologyPatientListTable.PatientPhone")}:
                        {booking.PatientPhoneNo}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.PaymentStatus")}:{" "}
                        {booking.PaymentStatus}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.PaymentDate")}:{" "}
                        {booking.PaymentDate !== null
                          ? formatDateInSelectedLanguage(
                              new Date(booking.PaymentDate)
                            )
                          : "NA"}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.TestFees")}:{" "}
                        {convertCurrency(
                          booking.TotalFees,
                          booking.Currency,
                          selectedGlobalCurrency
                        )}{" "}
                        {selectedGlobalCurrency}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.AuthorizationStatus")}:{" "}
                        {booking.Authorization}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.RegistrationDate")}:{" "}
                        {new Date(booking.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })}
        </div>
      ) : (
        <Table
          style={{ textAlign: "center" }}
          striped
          bordered
          hover
          responsive
        >
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyPatientListTable.SrNo")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyPatientListTable.TestName")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyPatientListTable.PatientName")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyPatientListTable.PatientPhone")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyPatientListTable.Remarks")}
              </th> */}
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyPatientListTable.PaymentStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyPatientListTable.PaymentDate")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyPatientListTable.TestFees")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyPatientListTable.AuthorizationStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyPatientListTable.RegistrationDate")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyPatientListTable.Action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((booking, index) => {
                console.log(
                  `currentUser.phoneNumber: ${currentUser.phoneNumber}`
                );
                console.log(
                  `booking.PatientPhoneNo: ${booking.PatientPhoneNo}`
                );
                if (+currentUser.phoneNumber === booking.PatientPhoneNo) {
                  console.log("Matching!");
                  return (
                    <tr key={booking.id}>
                      <td style={{ textAlign: "center" }}>{index + 1}</td>

                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        <button
                          title="View Tests"
                          style={{ fontSize: "13px", padding: "4px 5px" }}
                          className="btn btn-secondary"
                          onClick={() => handleViewTestNames(booking)}
                        >
                          <FaRegEye />
                        </button>
                      </td>
                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        {booking.PatientName}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {booking.PatientPhoneNo}
                      </td>

                      {/* <td style={{ textAlign: "center" }}>{booking.remarks}</td> */}
                      {/* <td style={{ whiteSpace: "nowrap" }}>{booking.status}</td> */}

                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        {booking.PaymentStatus}
                      </td>
                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        {booking.PaymentDate !== null
                          ? formatDateInSelectedLanguage(
                              new Date(booking.PaymentDate)
                            )
                          : "NA"}
                      </td>

                      <th style={{ textAlign: "center" }}>
                        {convertCurrency(
                          booking.TotalFees,
                          booking.Currency,
                          selectedGlobalCurrency
                        )}{" "}
                        {selectedGlobalCurrency}
                      </th>
                      <td style={{ textAlign: "center" }}>
                        {booking.Authorization}
                      </td>
                      <td>
                        {formatDateInSelectedLanguage(
                          new Date(booking.createdAt)
                        )}
                      </td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        {"  "}{" "}
                        <button
                          title={t("pathologyPatientListTable.DownloadReport")}
                          style={{
                            whiteSpace: "nowrap",
                            fontSize: "12px",
                            padding: "4px 5px",
                          }}
                          className="btn btn-secondary mr-2"
                          onClick={() => handleGenerateReportNew(booking)}
                        >
                          <FaDownload />
                        </button>
                      </td>
                    </tr>
                  );
                }
              })}

            {filteredBookings.every(
              (booking) => +currentUser.phoneNumber !== booking.PatientPhoneNo
            ) && (
              <tr>
                <td colSpan="12">No Tests Data Found!</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      {testBookingID && <DownloadPDFButton testBookingID={testBookingID} />}
      <Modal
        style={{ marginTop: "20px" }}
        centered
        size="lg"
        backdrop="static"
        show={showTestNamesModal}
        onHide={() => setShowTestNamesModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("TestNamesForPatient")}:{selectedTestBooking?.PatientName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isMobile ? (
            <div>
              {testStatuses.map((status, index) => (
                <div className="card mb-3" key={index}>
                  <div className="card-body">
                    <h5 className="card-title">
                      {t("pathologyStatusModalTable.TestName")}:{" "}
                      {status.testName}
                    </h5>
                    <p className="card-text">
                      {t("pathologyStatusModalTable.CurrentStatus")}:{" "}
                      {status.TestStatus}
                    </p>
                    <p className="card-text">
                      {t("pathologyStatusModalTable.RegisteredDate")}:{" "}
                      {new Date(status.TestRegisteredDateTime).toLocaleString()}
                    </p>
                    <p className="card-text">
                      {t("pathologyStatusModalTable.SampleCollectedDate")}:{" "}
                      {status.TestSamplecollectedDateTime
                        ? new Date(
                            status.TestSamplecollectedDateTime
                          ).toLocaleString()
                        : t("common:N/A")}
                    </p>
                    <p className="card-text">
                      {t("pathologyStatusModalTable.CompletedDate")}:{" "}
                      {status.TestCompletedDateTime
                        ? new Date(
                            status.TestCompletedDateTime
                          ).toLocaleString()
                        : t("common:N/A")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table style={{ fontSize: "14px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>
                    {t("pathologyStatusModalTable.TestName")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("pathologyStatusModalTable.CurrentStatus")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("pathologyStatusModalTable.RegisteredDate")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("pathologyStatusModalTable.SampleCollectedDate")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("pathologyStatusModalTable.CompletedDate")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {testStatuses.map((status, index) => (
                  <tr key={index}>
                    <td>{status.testName}</td>
                    <td>{status.TestStatus}</td>
                    <td>
                      {new Date(status.TestRegisteredDateTime).toLocaleString()}
                    </td>
                    <td>
                      {status.TestSamplecollectedDateTime
                        ? new Date(
                            status.TestSamplecollectedDateTime
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      {status.TestCompletedDateTime
                        ? new Date(
                            status.TestCompletedDateTime
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DiagnosticsBookingForPatient;
