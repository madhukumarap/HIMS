import jsPDF from "jspdf";
import { IoPrintSharp, IoDownload, IoCloudDownload } from "react-icons/io5";
import Select from "react-select";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Col, Button, Table, Card } from "react-bootstrap";
import axios from "axios";
import Datepickrange from "../DateRangeCalender";
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
import AddResultModalForBloodSugarForFastingTest from "../DiagnosticsComponent/AddResultDiagnosticReport";
import DownloadPDFButton from "../DiagnosticsComponent/DownloadResultDiagnosticReport";
import UploadDiagnosticImages from "../DiagnosticsComponent/UploadDiagnosticImages";
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../../services/auth.service";
import Translation from "../../translations/CloudImage.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

function DiagnosticsBooking() {
  const currentUser = AuthService.getCurrentUser();

  const navigate = useNavigate();
  const [testBookingID, setTestBookingID] = useState(null);
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
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    status: "Registered",
    id: null,
    lapName: "NA",
    PatientID: "",
    remarks: "",
    instrumentsUsed: "",
    selectedTests: [],
    selectedPatient: "",
    testFees: "",
    results: "",
    TestManagementID: "",
    commissionType: "NA",
    paymentStatus: "",
    paymentDate: "",
    commissionValue: "NA",
  });

  const [testNames, setTestNames] = useState([]);
  const [enterCodeData, setEnterCodeData] = useState([]);
  const [selectedReportData, setSelectedReportData] = useState(null);

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
  const handleAddResult = (booking) => {
    console.log("Selected Report Data:", booking);
    setSelectedReportData(booking);
    //alert(JSON.stringify(booking));
  };

  const handleGenerateReportNew = (testBookingID) => {
    if (testBookingID.status !== "Completed") {
      toast.error(t("ResultNotFound"));
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
    !currentUser.roles.includes("ROLE_ADMIN")
  ) {
    return "Access Denied";
  }

  return (
    <div style={{ fontSize: "12px" }} className="container">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{t("ImageStoragePatientList")}</h2>
      </header>
      <br />
      <br></br> <br></br>
      <div className="row mb-3">
        <div className="col-md-3 col-12">
          <label
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            {t("SearchByPatientNameOrPhone")}
            <input
              style={{ fontSize: "12px", marginTop: "10px" }}
              type="text"
              className="form-control"
              placeholder={t("SearchByPatientNameOrPhone")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="col-md-3 col-12">
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>
      </div>
      <br></br>
      {isMobile ? (
        <div>
          {filteredBookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((booking, index) => (
              <div className="card mb-3" key={booking.id}>
                <div className="card-body">
                  <h5 className="card-title">
                    {t("PatientName")}: {booking.PatientName}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {t("ReferralDoctor")}:{" "}
                    {booking.DoctorName !== "NA NA NA"
                      ? `Dr. ${booking.DoctorName}`
                      : "NA"}
                  </h6>
                  <p className="card-text">
                    {t("PatientPhone")}: {booking.PatientPhoneNo}
                  </p>
                  {/* <p className="card-text">
    {t("AuthorizationStatus")}: {booking.Authorization}
  </p> */}
                  <p className="card-text">
                    {t("RegistrationDate")}:{" "}
                    {formatDateInSelectedLanguage(new Date(booking.createdAt))}
                  </p>

                  <div className="d-flex  mt-3">
                    <UploadDiagnosticImages
                      testBookingID={booking.id}
                      SelectedTest={booking.selectedTests}
                    />
                    <button
                      title={t("AddResult")}
                      style={{
                        fontSize: "12px",
                        marginLeft: "10px",
                        padding: "4px 5px",
                      }}
                      className="btn btn-secondary mr-2"
                      onClick={() => handleAddResult(booking)}
                    >
                      <FaPlusSquare />
                    </button>
                    <button
                      title={t("DownloadReport")}
                      style={{
                        fontSize: "12px",
                        marginLeft: "10px",
                        padding: "4px 5px",
                      }}
                      className="btn btn-secondary"
                      onClick={() => handleGenerateReportNew(booking)}
                    >
                      <FaDownload />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("cloudImageTable.SrNo")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("LabName")}</th> */}
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("TestName")}</th> */}
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("cloudImageTable.PatientName")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("cloudImageTable.ReferralDoctor")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("cloudImageTable.ReferralType")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("cloudImageTable.PatientPhone")}
              </th>
              {/*               <th style={{ textAlign: "center" }}>{t("InstrumentsUsed")}</th> */}
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("Remarks")}</th> */}

              {/*               <th style={{ textAlign: "center" }}>{t("Results")}</th> */}
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("PaymentStatus")}</th>
  <th style={{ whiteSpace: "nowrap" }}>{t("PaymentDate")}</th>
  
  <th style={{ whiteSpace: "nowrap" }}>{t("TestFees")}</th> */}
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("cloudImageTable.AuthorizationStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("cloudImageTable.RegistrationDate")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("UploadImages")}</th> */}

              <th style={{ whiteSpace: "nowrap" }}>{t("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((booking, index) => (
                <tr key={booking.id}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>

                  {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {booking.selectedTests}
                </td> */}
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {booking.PatientName}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {booking.DoctorName !== "NA NA NA"
                      ? `Dr. ${booking.DoctorName}`
                      : "NA"}
                  </td>
                  <td
                    style={{
                      whiteSpace: "nowrap",
                      textAlign: "center",
                      textAlign: "center",
                    }}
                  >
                    {booking.commissionValue}
                  </td>

                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {booking.PatientPhoneNo}
                  </td>

                  {/* <td style={{ textAlign: "center" }}>{booking.remarks}</td> */}
                  {/* <td style={{ whiteSpace: "nowrap" }}>{booking.status}</td> */}

                  {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {booking.PaymentStatus}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {booking.PaymentDate !== null ? booking.PaymentDate : "NA"}
                </td>

                <th style={{ textAlign: "center" }}>
                  <span>&#8377;</span>
                  {booking.testFees}
                </th> */}
                  <td style={{ textAlign: "center" }}>
                    {booking.Authorization}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {formatDateInSelectedLanguage(new Date(booking.createdAt))}
                  </td>

                  <td style={{ display: "flex", textAlign: "center" }}>
                    <UploadDiagnosticImages
                      testBookingID={booking.id}
                      SelectedTest={booking.selectedTests}
                    />
                    {/* </td>
  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}> */}
                    <button
                      title={t("AddResult")}
                      style={{ fontSize: "12px", padding: "4px 5px" }}
                      className="btn btn-secondary mr-2"
                      onClick={() => handleAddResult(booking)}
                    >
                      <FaPlusSquare />
                    </button>

                    <button
                      title={t("DownloadReport")}
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
              ))}
          </tbody>
        </Table>
      )}
      <AddResultModalForBloodSugarForFastingTest
        showFieldModal={showReportModalBloodSugarFasting}
        handleCloseFieldModal={() => {
          setShowReportModalBloodSugarFasting(false);
          setSelectedReportData(null);
          // window.location.reload();
        }}
        selectedReportData={selectedReportData}
      />
      {testBookingID && <DownloadPDFButton testBookingID={testBookingID} />}
    </div>
  );
}

export default DiagnosticsBooking;
