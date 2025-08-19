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

import AuthService from "../services/auth.service";

import { Container, Row, Col, Table, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import Translation from "../translations/BillingForConsultation/BillingForConsultation.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { CurrencyContext } from "../context/CurrencyProvider";

const DoctorsAppointments = () => {
  const currentUser = AuthService.getCurrentUser();

  const navigate = useNavigate();
  const [isCardView, setIsCardView] = useState(true);
  const { t } = useTranslation();

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
    const intervalId = setInterval(initializei18n, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  const toggleView = () => {
    setIsCardView(!isCardView);
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

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const [selectedAppointmentImage, setSelectedAppointmentImage] =
    useState(null);
  const [showImageViewer, setShowImageViewer] = useState(false);

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${selectedAppointmentImage}`;
    link.download = "appointment_image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [dataTotal, setDataTotal] = useState(null);
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

  const handleViewImage = (appointmentId) => {
    const selectedAppointment = appointments.find(
      (app) => app.id === appointmentId
    );
    setSelectedAppointmentImage(selectedAppointment.image);
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

  const handleCloseCalendarModal = () => {
    setShowCalendarModal(false);
  };

  const handleDeleteAppointment = (appointmentId) => {
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
      const amount = `${t("Receipt.amount")}: ${rowData?.amount} ${
        rowData?.Currency
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

  // const formatDate = (dateString) => {
  //   const formattedDate = moment(
  //     dateString,
  //     "ddd MMM DD YYYY HH:mm:ss [GMT] ZZ"
  //   ).format("MM/DD/YYYY, hh:mm A");
  //   return formattedDate;
  // };
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
      console.log("Fetched appointments:", response.data.appointments); // Log fetched data
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
        <h2 style={{ fontSize: "16px" }}> {t("billingforconsultation")}</h2>
      </header>
      {/* <br /> */}
      {/* <Button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        onClick={handleOpenCalendarModal}
      >
        Book Appointment
      </Button> */}
      {/* <Button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        onClick={() => {
          navigate("/PathologyBookingData");
        }}
      >
        Pathology Booking Data
      </Button> */}
      <br></br>
      <br></br>
      <div>
        <div className="row mb-3">
          <div className="col-md-4 col-sm-12 mb-3">
            <label
              style={{
                fontSize: "12px",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              {t("searchbyPatientName")}
            </label>
            <input
              style={{ fontSize: "12px" }}
              type="text"
              className="form-control"
              placeholder={t("searchbyPatientName") || "Search by patient name"}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div className="col-md-4 col-sm-12 mb-3">
            <Datepickrange
              onSetDate={handleSetDate}
              onClearDate={handleClearDate}
            />
          </div>
          {/* Uncomment the code below if needed */}
          {/* <div
    style={{ fontSize: "18px", marginTop: "25px" }}
    className="col-2"
  >
    <input
      type="checkbox"
      id="toggleView"
      checked={isCardView}
      onChange={toggleView}
    />
    <label
      htmlFor="toggleView"
      style={{ marginLeft: "10px", marginTop: "-10px" }}
    >
      Grid View
    </label>
  </div> */}
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
        <CardViewAppointments
          appointments={currentReports}
          generateBill={generateBill}
          formatDateInSelectedLanguage={formatDateInSelectedLanguage}
          Translation={Translation}
        />
      ) : (
        <Table responsive style={{ fontSize: "12px" }} striped bordered hover>
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("billingConsultationTable.serialNumber")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("billingConsultationTable.patientName")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("billingConsultationTable.patientPhone")}
              </th>
              {/* Uncomment and include additional headers using the t function */}
              {/* 
      <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
        {t("billingConsultationTable.doctorName")}
      </th>
      <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
        {t("billingConsultationTable.doctorPhone")}
      </th>
      <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
        {t("billingConsultationTable.bookingStartEndTime")}
      </th>
      <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
        {t("billingConsultationTable.bookingEndDate")}
      </th>
      */}
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("billingConsultationTable.paymentStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("billingConsultationTable.fees")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("billingConsultationTable.paymentdate&time")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("billingConsultationTable.registrationDate")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("billingConsultationTable.printBill")}
              </th>
              {/* Add additional table headers as needed */}
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
                {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                Dr {appointment.DoctorName}
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {appointment.DoctorPhone}
              </td>

              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {appointment.bookingStartDate}-{" "}
                {new Date(appointment.bookingEndDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td> */}
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {appointment.paymentStatus.toUpperCase()}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {convertCurrency(
                    appointment.amount,
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
                  {/* <Button
                  title="Delete"
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
                </Button> */}
                  {/* </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}> */}
                  <button
                    title={t("billingConsultationTable.downloadAsPDF")}
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
                  {/* <button
                  title="View Image"
                  style={{
                    fontSize: "12px",
                    padding: "4px 5px",
                    marginTop: "0px",
                    backgroundColor: "#1111",
                    color: "black",
                  }}
                  className="btn btn-secondary"
                  onClick={() => handleViewImage(appointment.id)}
                >
                  <FaRegEye />
                </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal
        style={{ fontSize: "12px" }}
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        style={{ marginTop: "20px" }}
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
            Previous
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
            Next
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
              src={`data:image/jpeg;base64,${selectedAppointmentImage}`}
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

const CardViewAppointments = ({
  appointments,
  Translation,
  generateBill,
  formatDateInSelectedLanguage,
}) => {
  const { t } = useTranslation();

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
        },
      });
    };

    initializei18n();
  }, []);

  return (
    <Row>
      {appointments.map((appointment, index) => (
        <Col key={appointment.id} md={3} sm={6}>
          <Card style={{ width: "98%", margin: "10px", maxWidth: "100%" }}>
            <Card.Body>
              <Card.Title>{appointment.PatientName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {appointment.PatientPhone}
              </Card.Subtitle>
              <Card.Text>
                {t("billingConsultationTable.paymentStatus")}:{" "}
                {appointment.paymentStatus.toUpperCase()}
              </Card.Text>
              <Card.Text>
                {" "}
                {appointment.amount} {appointment.Currency}
              </Card.Text>
              <Card.Text>
                {t("billingConsultationTable.paymentdate&time") ||
                  "Payment Date & Time"}
                :{" "}
                {appointment.paymentDateTime
                  ? appointment.paymentDateTime
                  : "NA"}
              </Card.Text>
              <Card.Text>
                {t("billingConsultationTable.registrationDate")}:{" "}
                {formatDateInSelectedLanguage(new Date(appointment.createdAt))}
              </Card.Text>
              <Button
                title="Download As Pdf"
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
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
export default DoctorsAppointments;
