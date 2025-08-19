import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Table, Card } from "react-bootstrap";
import { FaDownload, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router";
import Modal from "react-bootstrap/Modal";
import jsPDF from "jspdf";
import AuthService from "../services/auth.service";
import { IoPrintSharp } from "react-icons/io5";
import Translation from "../translations/PathologyBookingData.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { CurrencyContext } from "../context/CurrencyProvider";
import { HospitalContext } from "../context/HospitalDataProvider";

const DoctorConsaltationBills = () => {
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
  const [appointments, setAppointments] = useState([]);
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
    fetchAppointments();
  }, []);
  function formatDate2(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
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

      const amount = `${t("Receipt.amount")}: ${convertCurrency(
        rowData?.TotalFees,
        rowData?.Currency,
        selectedGlobalCurrency
      ).toFixed(2)} ${selectedGlobalCurrency}`;

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
  const navigate = useNavigate();
  const goBackBtn = () => {
    navigate("/PatientBill");
  };
  // const navigate = useNavigate()
  const pathologyTest = () => {
    navigate(`/${extractedPart}/pathologyBills`);
  };
  const consaltationTest = () => {
    navigate(`/${extractedPart}/doctorConsaltationBills`);
  };
  const diagonosticsTest = () => {
    navigate(`/${extractedPart}/diagonosticsBills`);
  };
  return (
    <div
      style={{
        width: "98%",
        height: "100%",
        margin: "0 auto",
        fontSize: "12px",
      }}
    >
      <div>
        <Button
          variant="secondary"
          style={{
            fontSize: "12px",
          }}
          onClick={pathologyTest}
          as="input"
          type="button"
          value={t("Pathology")}
        />{" "}
        <Button
          variant="secondary"
          style={{
            fontSize: "12px",
          }}
          onClick={consaltationTest}
          as="input"
          type="button"
          value={t("Consultation")}
        />{" "}
        <Button
          variant="secondary"
          style={{
            fontSize: "12px",
          }}
          onClick={diagonosticsTest}
          as="input"
          type="button"
          value={t("Diagnostic")}
        />
      </div>{" "}
      <br></br>
      {/* <Button onClick={goBackBtn} className='mt-0 mb-3'>Back</Button> */}
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{t("DoctorConsultationBills")}</h2>
      </header>
      <br />
      {isMobile ? (
        <div>
          {appointments.map((appointment, index) => {
            if (+currentUser.phoneNumber === appointment.PatientPhone) {
              return (
                <div className="card mb-3" key={appointment.id}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title">
                        {t("pathologybookingdataTable.patientName")}:{" "}
                        {appointment.PatientName}
                      </h5>
                      <button
                        title={t("downloadAsPdf")}
                        style={{
                          fontSize: "12px",
                          padding: "4px 5px",
                          marginTop: "0px",
                        }}
                        className="btn btn-secondary"
                        onClick={() => generateBill(appointment)}
                      >
                        <IoPrintSharp />
                      </button>
                    </div>{" "}
                    <p className="card-text">
                      {t("pathologybookingdataTable.patientPhone")}:
                      {appointment.PatientPhone}
                    </p>
                    <p className="card-text">
                      {t("pathologybookingdataTable.paymentStatus")}:{" "}
                      {t(appointment.paymentStatus.toUpperCase())}
                    </p>
                    <p className="card-text">
                      {t("pathologybookingdataTable.testFees")}: ₹
                      {appointment.amount}.00
                    </p>
                    <p className="card-text">
                      {t("pathologybookingdataTable.paymentDate")}:{" "}
                      {formatDateInSelectedLanguage(
                        new Date(appointment.paymentDateTime)
                      ) || t("NA")}
                    </p>
                    <p className="card-text">
                      {t("pathologybookingdataTable.registrationDate")}:{" "}
                      {formatDateInSelectedLanguage(
                        new Date(appointment.createdAt)
                      )}
                    </p>
                  </div>
                </div>
              );
            }
          })}
        </div>
      ) : (
        <Table responsive style={{ fontSize: "12px" }} striped bordered hover>
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.srno")}
              </th>

              {/*               <th style={{ textAlign: "center" }}>Patient ID</th> */}
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.patientName")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.patientPhone")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
    Doctor Name
  </th>
  <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
    Doctor Phone
  </th>

  <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
    Booking Start-End Time
  </th> */}
              {/* <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
    Booking End Date
  </th> */}
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.paymentStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.testFees")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.paymentDate")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.registrationDate")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.downloadAsPdf")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
    Print Receipt
  </th>
  <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
    View Image
  </th> */}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => {
              console.log(appointment);
              if (+currentUser.phoneNumber === appointment.PatientPhone) {
                return (
                  <tr key={appointment.id}>
                    {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
        {index + 1 + (currentPage - 1) * reportsPerPage}
       </td> */}
                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                      {index + 1}
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
                      {formatDateInSelectedLanguage(
                        new Date(appointment.paymentDateTime)
                      ) || t("NA")}
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
                        title="Download As Pdf"
                        style={{
                          fontSize: "12px",
                          padding: "4px 5px",
                          marginTop: "0px",
                        }}
                        className="btn btn-secondary "
                        onClick={() => generateBill(appointment)}
                      >
                        <IoPrintSharp />
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
                );
              }
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default DoctorConsaltationBills;
