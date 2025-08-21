import { FaDownload } from "react-icons/fa";
import { IoPrintSharp } from "react-icons/io5";
import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import jsPDF from "jspdf";
import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./print.css";
import BookingCalendar from "./DoctorsAppointmentsCalender";
import moment from "moment";
import Datepickrange from "./DateRangeCalender";
import { useNavigate } from "react-router-dom";
import Translation from "../translations/DoctorAppointmentMScreen.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

import AuthService from "../services/auth.service";

import { Container, Row, Col, Table, Card } from "react-bootstrap";
import { CurrencyContext } from "../context/CurrencyProvider";

const DoctorsAppointments = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const locales = { enIN, fr };
  localStorage.removeItem("reloadCounts");
  const [dataTotal, setDataTotal] = useState(null);
  const currentUser = AuthService.getCurrentUser();

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
    // const intervalId = setInterval(initializei18n, 1000);
    // return () => clearInterval(intervalId);
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/ConsultantTotalfees`,
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

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [refresh, setRefresh] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  // Function to check if the screen size is mobile
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 200);
  };

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    i18n.changeLanguage(event.target.value);
    //alert(translationData);
    console.log("Selected language:", event.target.value);
  };

  useEffect(() => {
    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  const [selectedAppointmentImage, setSelectedAppointmentImage] =
    useState(null);
  const [showImageViewer, setShowImageViewer] = useState(false);

  const handleDownloadImage = () => {
    try {
      const link = document.createElement("a");
      link.href = `${selectedAppointmentImage}`;
      link.download = "appointment_image.png"; // Make sure this matches the actual file type
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleViewImage = (appointmentId) => {
    const selectedAppointment = appointments.find(
      (app) => app.id === appointmentId
    );
    setSelectedAppointmentImage(selectedAppointment?.image);
    //alert(JSON.stringify(selectedAppointmentImage));
    console.log(JSON.stringify(selectedAppointmentImage));
    setShowImageViewer(true);
  };
  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };
  const handleOpenCalendarModal = () => {
    setShowCalendarModal(true);
  };

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
  const handleCloseCalendarModal = () => {
    setShowCalendarModal(false);
    setRefresh(true);
    window.location.reload();
  };

  const handleDeleteAppointment = (appointmentId) => {
    // console.log("appointmentId=", appointmentId)
    // alert(appointmentId)
    setAppointmentToDelete(appointmentId);
    setShowDeleteModal(true);
  };

  const generateBill = async (rowData) => {
    console.log("rowData=", rowData);
    const hospitalResponse = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
      {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      }
    );

    console.log("hospitalResponse=", hospitalResponse);
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
      const titleText = t("Receipt.ConsultantBookingReceipt"); // Use the translation key
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

      const patientInfo = `${t("Receipt.patientDetails")}: ${
        rowData.PatientName
      }`;
      const patientPhone = `${t("Receipt.patientPhone")}: ${
        rowData.PatientPhone
      }`;
      const createdAT = `${t(
        "Receipt.bookingDate"
      )}: ${formatDateInSelectedLanguage(new Date(rowData.createdAt))}`;
      const doctorInfo = `${t("Receipt.doctorDetails")}: Dr ${
        rowData.DoctorName
      }`;
      const doctorPhone = `${t("Receipt.doctorPhone")}: ${rowData.DoctorPhone}`;
      const bookingStartEnd = `${t(
        "Receipt.ConsultantBookingReceipt"
      )}: ${formatDateInSelectedLanguage(
        new Date(rowData.bookingStartDate)
      )} ${new Date(rowData.bookingStartDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${new Date(rowData.bookingEndDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
      const paymentStatus = `${t(
        "Receipt.paymentStatus"
      )}: ${rowData.paymentStatus.toUpperCase()}`;
      const paymentDateTime = rowData?.paymentDateTime
        ? `${t("Receipt.paymentDate")}: ${formatDateInSelectedLanguage(
            new Date(rowData.paymentDateTime)
          )}`
        : `${t("Receipt.paymentDate")}: MM-DD-YYYY`;
      const amount = `${t("Receipt.amount")}: ${rowData?.amount}.00 INR`;

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

      pdf.text(bookingStartEnd, 20, 140);
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

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllDoctorsAppointments`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [refresh]);

  const confirmDeleteAppointment = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/deleteAppointment/${appointmentToDelete}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setShowDeleteModal(false);
      setAppointments(
        appointments.filter((app) => app.id !== appointmentToDelete)
      );
      setAppointmentToDelete(null);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const startDateMatch = startDate
      ? new Date(appointment.bookingStartDate) >= new Date(startDate)
      : true;
    const endDateMatch = endDate
      ? new Date(appointment.bookingEndDate) <= new Date(endDate)
      : true;
    const nameMatch = appointment.PatientName.toLowerCase().includes(
      searchName.toLowerCase()
    );
    return startDateMatch && endDateMatch && nameMatch;
  });

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredAppointments.slice(
    indexOfFirstReport,
    indexOfLastReport
  );

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  function formatDate2(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // localStorage.setItem("reloadCount1", "0");
  // const reloadCount = localStorage.getItem("reloadCount2");
  // if (reloadCount !== "1") {
  // //  window.location.reload();
  //   localStorage.setItem("reloadCount2", "1");
  // }

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
    !currentUser.roles.includes("ROLE_RECEPTIONIST") &&
    !currentUser.roles.includes("ROLE_DOCTOR")
  ) {
    return "Access Denied";
  }

  return (
    <div
      style={{
        width: "98%",
        height: "100%",
        margin: "0 auto",
        fontSize: "12px",
      }}
    >
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}> {t("doctorsAppointment")}</h2>
      </header>
      <br />
      <Button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        onClick={handleOpenCalendarModal}
      >
        {t("bookAppointment")}
      </Button>
      {/* <Button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        onClick={() => {
          navigate("/PathologyBookingData");
        }}
      >
        Pathology Booking Data
      </Button> */}
      <Modal
        backdrop="static"
        size="lg"
        dialogClassName="modal-120w"
        show={showCalendarModal}
        onHide={handleCloseCalendarModal}
        style={{ marginTop: "20px" }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("AppointmentBookingCalendar")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BookingCalendar onClose={handleCloseCalendarModal} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCalendarModal}>
            {t("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
      <br></br>
      <br></br>
      <div className="row mb-3">
        <div className="col-md-3 col-sm-12 mb-2">
          <label
            style={{
              fontSize: "12px",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            {t("searchByPatientName")}
          </label>
          <input
            style={{ fontSize: "12px" }}
            type="text"
            className="form-control"
            placeholder={t("searchByPatientName")}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-md-1"></div>
        <div style={{ fontSize: "12px" }} className="col-md-2 col-sm-12">
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>
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
        <div style={{ textAlign: "left" }}>
          {currentReports.map((appointment, index) => (
            <Card key={appointment.id} style={{ marginBottom: "10px" }}>
              <Card.Body>
                <Card.Title>
                  <strong>{t("patientTable.patientName")}:</strong>{" "}
                  {appointment.PatientName}
                </Card.Title>

                <Card.Text>
                  <strong>{t("patientTable.patientPhone")}:</strong>
                  {appointment.PatientPhone}
                </Card.Text>
                <Card.Text>
                  <strong>{t("patientTable.doctorName")}:</strong> Dr{" "}
                  {appointment.DoctorName}
                </Card.Text>
                <Card.Text>
                  <strong>{t("patientTable.doctorPhone")}:</strong>
                  {appointment.DoctorPhone}
                </Card.Text>
                <Card.Text>
                  <strong>{t("patientTable.bookingstartendTime")}:</strong>{" "}
                  {appointment.bookingStartDate}-{" "}
                  {new Date(appointment.bookingEndDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Card.Text>
                <Card.Text>
                  <strong>{t("patientTable.paymentStatus")}:</strong>{" "}
                  {appointment.paymentStatus.toUpperCase()}
                </Card.Text>
                <Card.Text>
                  <strong>{t("patientTable.fees")}:</strong> ₹{" "}
                  {convertCurrency(
                    appointment.amount,
                    appointment?.Currency,
                    selectedGlobalCurrency
                  )}{" "}
                  {selectedGlobalCurrency}
                </Card.Text>
                <Card.Text>
                  <strong>{t("patientTable.paymentDateTime")}:</strong>{" "}
                  {appointment.paymentDateTime
                    ? appointment.paymentDateTime
                    : "NA"}
                </Card.Text>
                <Card.Text>
                  <strong>{t("patientTable.registrationDate")}:</strong>{" "}
                  {formatDateInSelectedLanguage(
                    new Date(appointment.createdAt)
                  )}
                </Card.Text>

                <Button
                  title={t("delete") || "Delete"}
                  style={{
                    fontSize: "12px",
                    backgroundColor: "#1111",
                    color: "black",
                    padding: "4px 5px",
                  }}
                  variant="danger"
                  onClick={() => handleDeleteAppointment(appointment.id)}
                >
                  <FaTrashAlt />
                </Button>
                <Button
                  title={t("downloadAsPdf") || "Download As Pdf"}
                  style={{
                    fontSize: "12px",
                    padding: "4px 5px",
                    marginTop: "0px",
                    backgroundColor: "#1111",
                    color: "black",
                    marginLeft: "5px",
                  }}
                  className="btn btn-secondary"
                  onClick={() => generateBill(appointment)}
                >
                  <FaDownload />
                </Button>
                <Button
                  title={t("viewImage") || "View Image"}
                  style={{
                    fontSize: "12px",
                    padding: "4px 5px",
                    marginTop: "0px",
                    backgroundColor: "#1111",
                    color: "black",
                    marginLeft: "5px",
                  }}
                  disabled={!(appointment?.image.length > 2000)}
                  className="btn btn-secondary"
                  onClick={() => handleViewImage(appointment.id)}
                >
                  <FaRegEye />
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Table responsive style={{ fontSize: "12px" }} striped bordered hover>
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("patientTable.srno")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("patientTable.patientName")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("patientTable.patientPhone")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("patientTable.doctorName")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("patientTable.doctorPhone")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("patientTable.bookingstartendTime")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("patientTable.paymentStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("patientTable.fees")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("patientTable.paymentDateTime")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("patientTable.registrationDate")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("patientTable.action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((appointment, index) => (
              <tr key={appointment.id}>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {index + 1 + (currentPage - 1) * reportsPerPage}
                </td>

                {/* <td>{appointment.patientId}</td> */}
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {appointment.PatientName}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {appointment.PatientPhone}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  Dr {appointment.DoctorName}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {appointment.DoctorPhone}
                </td>

                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(
                    new Date(appointment.bookingStartDate)
                  )}{" "}
                  {new Date(appointment.bookingStartDate).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                  -{" "}
                  {new Date(appointment.bookingEndDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {appointment.paymentStatus.toUpperCase()}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {convertCurrency(
                    appointment?.amount,
                    appointment.Currency,
                    selectedGlobalCurrency
                  )}{" "}
                  {selectedGlobalCurrency}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {appointment.paymentDateTime
                    ? formatDateInSelectedLanguage(
                        new Date(appointment.paymentDateTime)
                      )
                    : "NA"}
                </td>

                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(
                    new Date(appointment.createdAt)
                  )}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  <Button
                    title={t("patientTable.delete")}
                    style={{
                      fontSize: "12px",
                      backgroundColor: "#1111",
                      color: "black",
                      padding: "4px 5px",
                    }}
                    variant="danger"
                    onClick={() => handleDeleteAppointment(appointment.id)}
                  >
                    <FaTrashAlt />
                  </Button>
                  {/* </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}> */}
                  <button
                    title={t("patientTable.downloadAsPdf")}
                    style={{
                      fontSize: "12px",
                      padding: "4px 5px",
                      marginTop: "0px",
                      backgroundColor: "#1111",
                      color: "black",
                    }}
                    className="btn btn-secondary"
                    onClick={() => generateBill(appointment)}
                  >
                    <FaDownload />
                  </button>
                  {/* </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}> */}
                  <button
                    title="View Image"
                    style={{
                      fontSize: "12px",
                      padding: "4px 5px",
                      marginTop: "0px",
                      backgroundColor: "#1111",
                      color: "black",
                    }}
                    disabled={!(appointment?.image?.length > 2000)}
                    className="btn btn-secondary"
                    onClick={() => handleViewImage(appointment.id)}
                  >
                    <FaRegEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal
        style={{ fontSize: "12px", marginTop: "20px" }}
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            Delete Appointment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this appointment?
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            style={{ fontSize: "12px" }}
            variant="danger"
            onClick={confirmDeleteAppointment}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <br></br>{" "}
      <div
        className="justify-content-center align-items-center"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div className="mx-0 px-0">
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            {t("previous")}
          </Button>
        </div>
        <div className="mx-2">
          Page {currentPage} of{" "}
          {Math.ceil(filteredAppointments.length / reportsPerPage)}
        </div>
        <div className="mx-0 px-0">
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={handleNextPage}
            disabled={indexOfLastReport >= filteredAppointments.length}
          >
            {t("next")}
          </Button>
        </div>
      </div>
      <Modal
        show={showImageViewer}
        onHide={() => {
          setShowImageViewer(false);
        }}
        style={{ marginTop: "20px" }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            View Attached Image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointmentImage && (
            <img
              src={selectedAppointmentImage}
              alt="Captured"
              style={{ width: "100%" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedAppointmentImage && (
            <button
              title="Download Image"
              style={{
                fontSize: "12px",
                padding: "4px 5px",
                marginTop: "0px",
              }}
              className="btn btn-secondary"
              onClick={handleDownloadImage}
            >
              <FaDownload />
            </button>
          )}
        </Modal.Footer>
      </Modal>
      <br></br>
    </div>
  );
};

export default DoctorsAppointments;
