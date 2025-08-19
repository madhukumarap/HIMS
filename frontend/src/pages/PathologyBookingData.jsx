import jsPDF from "jspdf";
import Select from "react-select";
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Col, Button, Table, Card } from "react-bootstrap";
import axios from "axios";
import Datepickrange from "./DateRangeCalender";
import BookingCalendar from "./DoctorsAppointmentsCalender";
import { IoPrintSharp } from "react-icons/io5";
import {
  FaPencilAlt,
  FaPlus,
  FaTrashAlt,
  FaRegEye,
  FaDownload,
} from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../services/auth.service";
import Translation from "../translations/PathologyBookingData.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { CurrencyContext } from "../context/CurrencyProvider";

//report generate Modal for all test
function Pathologytest() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();

  const locales = { enIN, fr };
  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

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

  const [dataTotal, setDataTotal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/PathologyTotalfees`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setDataTotal(response.data);
        //setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // setLoading(false);
      }
    };

    fetchData();
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState([]);

  const [testNames, setTestNames] = useState([]);
  const [enterCodeData, setEnterCodeData] = useState([]);
  const handleCloseCalendarModal = () => {
    setShowCalendarModal(false);
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
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllPathologyTests`, {
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

  const generatebill = async (rowData) => {
    console.log(rowData);
    //alert(rowData.PaymentStatus);
    if (rowData.PaymentStatus === "Not-Paid") {
      toast.error("Payment Not Paid");
      return;
    }
    const hospitalResponse = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
      {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      }
    );

    const hospitalData = hospitalResponse.data.data; // Assuming the hospital data is in the 'data' property

    const pdf = new jsPDF();
    pdf.setFontSize(12);

    // Add Hospital Name and Address
    // Add Hospital Name and Logo
    const hospitalName = hospitalData.hospitalName;
    const hospitalLogoBase64 = hospitalData.logo; // Assuming the logo is provided as a base64 string
    const hospitalAddressLine1 = hospitalData.address;
    const hospitalAddressLine2 = `${hospitalData.pincode}, India`;
    const email = `Mail: ${hospitalData.email}`;
    const landline = `Tel: ${hospitalData.landline}`;
    // Create a new Image object for the hospital logo
    const hospitalLogo = new Image();
    hospitalLogo.src = `data:image/png;base64,${hospitalLogoBase64}`; // Embed the base64 image data

    // Wait for the hospital logo to load before rendering the PDF
    hospitalLogo.onload = function () {
      // Add the hospital logo as an image to the PDF
      pdf.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);

      pdf.text(hospitalName, 20, 20);
      pdf.text(hospitalAddressLine1, 20, 30);
      pdf.text(hospitalAddressLine2, 20, 35);
      pdf.text(landline, 20, 40);
      pdf.text(email, 20, 45);
      pdf.setFillColor("#48bcdf");
      const titleText = t("Receipt.TestBookingReceipt");
      const titleHeight = 10;
      pdf.rect(0, 53, pdf.internal.pageSize.getWidth(), titleHeight, "F");
      pdf.setTextColor("#ffffff"); // Set text color to white
      pdf.setFontSize(16); // Adjust font size as needed
      pdf.text(
        titleText,
        pdf.internal.pageSize.getWidth() / 2,
        55 + titleHeight / 2,
        {
          align: "center",
        }
      );

      pdf.setTextColor("#000000"); // Set text color to black

      const patientInfo = `${t("Receipt.patientName")}: ${
        rowData?.PatientName
      }`;
      const patientPhone = `${t("Receipt.patientPhone")}: ${
        rowData?.PatientPhoneNo
      }`;
      const createdAT = `${t(
        "Receipt.bookingDate"
      )}: ${formatDateInSelectedLanguage(new Date(rowData?.createdAt))}`;
      const doctorInfo = `${t("Receipt.doctorName")}: Dr ${
        rowData?.DoctorName
      }`;

      const doctorPhone = `${t("Receipt.doctorPhone")}: ${
        rowData?.DoctorPhone
      }`;

      const paymentStatus = `${t(
        "Receipt.paymentStatus"
      )}: ${rowData?.PaymentStatus?.toUpperCase()}`;
      const paymentDateTime = rowData?.PaymentDate
        ? `${t("Receipt.paymentDate")}:  ${formatDateInSelectedLanguage(
            new Date(rowData?.PaymentDate)
          )}`
        : `${t("Receipt.paymentDate")}: MM-DD-YYYY`;

      const amount = `${t("Receipt.amount")}: ${convertCurrency(
        rowData?.PaidAmount,
        rowData?.Currency,
        selectedGlobalCurrency
      )} ${selectedGlobalCurrency}`;
      const selectedTest = `${t("Receipt.selectedTest")}: ${
        rowData?.selectedTests
      }`;
      pdf.setFontSize(12);

      // Define the coordinates for the first column (patient details)
      const col1X = 20;
      const col1Y = 80;
      const col1Spacing = 10;

      // Define the coordinates for the second column (doctor details)
      const col2X = 130; // Adjust this value to create space between columns
      const col2Y = 80;

      pdf.text(t("Receipt.patientDetails"), col1X, col1Y);
      pdf.text(patientInfo, col1X, col1Y + col1Spacing);
      pdf.text(patientPhone, col1X, col1Y + 2 * col1Spacing);
      pdf.text(createdAT, col1X, col1Y + 3 * col1Spacing);

      pdf.text(t("Receipt.doctorDetails"), col2X, col2Y);
      pdf.text(doctorInfo, col2X, col2Y + col1Spacing);
      pdf.text(doctorPhone, col2X, col2Y + 2 * col1Spacing);
      pdf.line(0, 120, 210, 120);

      pdf.text(selectedTest, 20, 140);
      pdf.text(paymentStatus, 20, 150);
      pdf.text(paymentDateTime, 20, 160);
      pdf.text(amount, 20, 170);

      pdf.setFillColor("#48bcdf");
      pdf.rect(0, 270, pdf.internal.pageSize.getWidth(), 10, "F");
      pdf.setTextColor("#ffffff");
      //pdf.setTextColor("#000000");
      pdf.setFontSize(12);

      pdf.text(
        "Powered by mediAI",
        pdf.internal.pageSize.getWidth() / 2 - 17,
        277
      );
      // Save the bill as a PDF file
      pdf.save("Receipt.pdf");
    };
  };

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

  const [
    showReportModalBloodSugarFasting,
    setShowReportModalBloodSugarFasting,
  ] = useState(false);
  const [selectedReportData, setSelectedReportData] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null); // To store the ID of the booking being deleted
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // alert(showReportModalBloodForPP);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const handleOpenCalendarModal = () => {
    setShowCalendarModal(true);
  };

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

  //

  const [tableName, setTableName] = useState("");
  const [PatientTestBookingID, setPatientTestBookingID] = useState("");

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

  useEffect(() => {
    const T3T4Result =
      selectedReportData && selectedReportData?.selectedTests === "T3 T4 TSH1";

    if (T3T4Result) {
      setShowReportModalBloodSugarFasting(false); // Ensure other modals are hidden
    } else if (true && selectedReportData?.selectedTests) {
      setShowReportModalBloodSugarFasting(true);
    } else {
      console.log("Manage The Test Result Fields first");
      setShowReportModalBloodSugarFasting(false);
    }
  }, [selectedReportData]);

  const fetchBookings = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllBookingsTest`, {
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

  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/deleteTestBooking/${bookingId}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      toast.success(t("DeletedSuccess"));
      fetchBookings(); // Refetch bookings after deletion
    } catch (error) {
      toast.error("Failed to delete booking");
      console.error(error);
    }
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
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_RECEPTIONIST")
  ) {
    return "Access Denied";
  }

  const datePickerStyle = {
    fontSize: "12px",
  };
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
        <h2 style={{ fontSize: "16px" }}>{t("pathologyAppointment")}</h2>
      </header>
      {/* <br /> */}
      {/* <Button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        onClick={handleOpenCalendarModal}
      >
        {t("bookAppointment")}
      </Button> */}
      {/* <button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        className="btn btn-secondary"
        onClick={() => setShowModal(true)}
      >
        Test Registration
      </button>{" "}
       */}
      {/* <Button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        onClick={() => {
          navigate("/sampleHomeCollectionForm");
        }}
      >
        Sample Home Collection
      </Button> */}
      {/* <Button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        onClick={() => {
          navigate("/pathalogytestManagement");
        }}
      >
        Pathalogy test Management
      </Button> */}
      {/* <Button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        onClick={() => {
          navigate("/CommissionCodeData");
        }}
      >
        Referral type code
      </Button> */}
      <br></br> <br></br>
      <div className="row mb-3">
        <div className="col-md-3 col-sm-12">
          <label
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              marginBottom: "10px",
            }}
          >
            {t("searchbypatientnameorPhone")}
          </label>
          <input
            style={{ fontSize: "12px", marginTop: "10px" }}
            type="text"
            className="form-control"
            placeholder={
              t("searchPatientByNameorPhone") ||
              "Search patient by Name or Phone"
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>
        <br></br>
      </div>
      <br></br>
      <div className="col-md-4col-12">
        <p>
          {t("TotalCollectedAmount")}:
          <strong> {dataTotal?.totalFeesUSD} USD </strong>,
          <strong> {dataTotal?.totalFeesEUR} EUR </strong>,
          <strong> {dataTotal?.totalFeesINR} INR </strong>,
          <strong> {dataTotal?.totalFeesCDF} CDF </strong>
        </p>
      </div>
      {isMobile ? (
        <div className="row">
          {filteredBookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((booking, index) => (
              <div className="col-md-4 mb-3" key={booking.id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{booking.PatientName}</h5>
                    <p className="card-text">
                      Referral Doctor:{" "}
                      {booking.DoctorName !== "NA NA NA"
                        ? `Dr. ${booking.DoctorName}`
                        : "NA"}
                    </p>
                    <p className="card-text">
                      Referral Type: {booking.commissionValue}
                    </p>
                    <p className="card-text">
                      Patient Phone: {booking.PatientPhoneNo}
                    </p>
                    <p className="card-text">Status: {booking.status}</p>
                    <p className="card-text">
                      Payment Status: {booking.PaymentStatus}
                    </p>
                    <p className="card-text">
                      Payment Date:{" "}
                      {booking.PaymentDate !== null
                        ? formatDateInSelectedLanguage(
                            new Date(booking.PaymentDate)
                          )
                        : "NA"}
                    </p>
                    <p className="card-text">
                      Test Fees:
                      {booking.testFees}
                      {convertCurrency(
                        booking.testFees,
                        booking.Currency,
                        selectedGlobalCurrency
                      )}
                    </p>
                    <p className="card-text">
                      Registration Date:{" "}
                      {formatDateInSelectedLanguage(
                        new Date(booking.createdAt)
                      )}
                    </p>
                    <button
                      title="Delete"
                      className="btn btn-secondary mr-2"
                      onClick={() => {
                        setSelectedBookingId(booking.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      title="Download as pdf"
                      className="btn btn-secondary"
                      onClick={() => generatebill(booking)}
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
                {t("pathologybookingdataTable.srno")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.patientName")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.referralDoctor")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.referralType")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.patientPhone")}
              </th>
              <th style={{ textAlign: "center", textAlign: "center" }}>
                {t("pathologybookingdataTable.status")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.paymentStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.paymentDate")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("Paid")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.testFees")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.registrationDate")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((booking, index) => (
                <tr key={booking.id}>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {index + 1}
                  </td>
                  {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {booking.lapName}
                </td> */}
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

                  <td style={{ textAlign: "center" }}>
                    {booking.PatientPhoneNo}
                  </td>
                  {/* <td style={{ whiteSpace: "nowrap" }}>
                  {booking.instrumentsUsed}
                </td> */}
                  <td style={{ whiteSpace: "nowrap" }}>{booking.status}</td>
                  {/* <td style={{ textAlign: "center" }}>
                  <button
                    style={{ fontSize: "13px", padding: "4px 5px" }}
                    className="btn btn-secondary mr-2"
                    onClick={() => handleAddResult2(booking)}
                  >
                    <FaRegEye />
                  </button>
                </td> */}
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {booking.PaymentStatus}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {booking.PaymentDate !== null
                      ? formatDateInSelectedLanguage(
                          new Date(booking.PaymentDate)
                        )
                      : "NA"}{" "}
                  </td>
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {booking.PaidAmount
                      ? `${convertCurrency(
                          booking.PaidAmount,
                          booking.Currency,
                          selectedGlobalCurrency
                        )} ${selectedGlobalCurrency}`
                      : "NA"}
                  </th>
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {booking.TotalFees
                      ? `${convertCurrency(
                          booking.TotalFees,
                          booking.Currency,
                          selectedGlobalCurrency
                        )} ${selectedGlobalCurrency}`
                      : "NA"}
                  </th>
                  <td>
                    {" "}
                    {formatDateInSelectedLanguage(new Date(booking.createdAt))}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    <button
                      title={t("pathologybookingdataTable.delete") || "Delete"}
                      style={{ fontSize: "12px", padding: "4px 5px" }}
                      className="btn btn-secondary mr-2"
                      onClick={() => {
                        setSelectedBookingId(booking.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                    {/* </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}> */}
                    <button
                      title={
                        t("pathologybookingdataTable.downloadAsPdf") ||
                        "Download as pdf"
                      }
                      style={{
                        fontSize: "12px",
                        padding: "4px 5px",
                        marginTop: "0px",
                      }}
                      className="btn btn-secondary mr-2"
                      onClick={() => generatebill(booking)}
                    >
                      <FaDownload />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
      <Modal
        style={{ marginTop: "20px", fontSize: "13px" }}
        centered
        backdrop="static"
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("ConfirmDelete")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("AreYouSureyouWanttoDeletethisTestBooking")}</Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "13px" }}
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            {t("Cancel")}
          </Button>
          <Button
            style={{ fontSize: "13px" }}
            variant="danger"
            onClick={() => {
              handleDelete(selectedBookingId);
              setShowDeleteModal(false);
            }}
          >
            {t("Delete")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        backdrop="static"
        size="lg" // Add this prop to set the modal size to extra large
        dialogClassName="modal-120w" // Add your custom class for modal width
        show={showCalendarModal}
        onHide={handleCloseCalendarModal}
        style={{ marginTop: "20px" }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            Appointment Booking Calendar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BookingCalendar onClose={handleCloseCalendarModal} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCalendarModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Pathologytest;
