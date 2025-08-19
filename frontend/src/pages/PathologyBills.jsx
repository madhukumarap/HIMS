import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Col, Button, Table, Card } from "react-bootstrap";
import AuthService from "../services/auth.service";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { IoPrintSharp } from "react-icons/io5";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Translation from "../translations/PathologyBookingData.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

const PathologyBills = () => {
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
    const intervalId = setInterval(initializei18n, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };
  console.log("currentuser=", currentUser);

  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
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
  }, []);

  console.log("bookings=", bookings);
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
  // const filteredBookings = bookings.filter((booking) => {
  //  const isNameMatch =
  //   booking.PatientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   (booking.PatientPhoneNo.toString().includes(searchQuery) &&
  //    searchQuery.trim() !== "");

  //  // const isDateMatch =
  //  //  (!startDate || new Date(booking.createdAt) >= startDate) &&
  //  //  (!endDate || new Date(booking.createdAt) <= endDate);

  //  // return isNameMatch && isDateMatch;
  //  return isNameMatch
  // });

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
    if (rowData.PaymentStatus !== "Paid") {
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
      const amount = `${t("Receipt.amount")}: ${rowData?.PaidAmount} ${
        rowData?.Currency
      }`;
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

  //
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
      toast.success("Booking deleted successfully");
      fetchBookings(); // Refetch bookings after deletion
    } catch (error) {
      toast.error("Failed to delete booking");
      console.error(error);
    }
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

  //
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
      {/* </div> */}
      {/* <Button onClick={goBackBtn} className='mt-0 mb-3'>Back</Button> */}
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{t("PathologyBill")}</h2>
      </header>
      {/* <div className="row mb-3">
    <div className="col-3">
     <label
      style={{
       fontWeight: "bold",
       fontSize: "12px",
       marginBottom: "10px",
      }}
     >
      Search by Patient Name or Phone
      <input
       style={{ fontSize: "12px", marginTop: "10px" }}
       type="text"
       className="form-control"
       placeholder="Search patient by Name or Phone"
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
      />
     </label>
    </div>
    <div className="col-2">
     <Datepickrange
      onSetDate={handleSetDate}
      onClearDate={handleClearDate}
     />
    </div>
   </div> */}
      <br></br>
      {isMobile ? (
        <div>
          {bookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((booking, index) => {
              if (+currentUser.phoneNumber === booking.PatientPhoneNo) {
                return (
                  <div className="card mb-3" key={booking.id}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h5 className="card-title">
                          {t("pathologybookingdataTable.patientName")}:{" "}
                          {booking.PatientName}
                        </h5>
                        <button
                          title={t("pathologybookingdataTable.downloadAsPdf")}
                          style={{
                            fontSize: "12px",
                            padding: "4px 5px",
                            marginTop: "0px",
                          }}
                          className="btn btn-secondary"
                          onClick={() => generatebill(booking)}
                        >
                          <IoPrintSharp />
                        </button>
                      </div>

                      {/* <p className="card-text">
    {t("pathologybookingdataTable.testName")}: {booking.selectedTests}
  </p> */}

                      <p className="card-text">
                        {t("pathologybookingdataTable.patientPhone")}:
                        {booking.PatientPhoneNo}
                      </p>
                      {/* <p className="card-text">{t("pathologybookingdataTable.status")}: {booking.status}</p> */}
                      <p className="card-text">
                        {t("pathologybookingdataTable.paymentStatus")}:{" "}
                        {booking.PaymentStatus}
                      </p>
                      <p className="card-text">
                        {t("pathologybookingdataTable.paymentDate")}:{" "}
                        {booking.PaymentDate !== null
                          ? booking.PaymentDate
                          : t("pathologybookingdataTable.NA")}
                      </p>
                      <p className="card-text">
                        {t("pathologybookingdataTable.testFees")}: ₹
                        {booking.testFees}
                      </p>
                      <p className="card-text">
                        {t("pathologybookingdataTable.registrationDate")}:{" "}
                        {formatDateInSelectedLanguage(
                          new Date(booking.createdAt)
                        )}
                      </p>
                    </div>
                  </div>
                );
              }
            })}
        </div>
      ) : (
        <Table
          style={{ textAlign: "center", fontSize: "12px" }}
          striped
          bordered
          hover
          responsive
        >
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologybookingdataTable.srno")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologybookingdataTable.testName")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologybookingdataTable.patientName")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("pathologybookingdataTable.referralDoctor")}</th>
  <th style={{ whiteSpace: "nowrap" }}>{t("pathologybookingdataTable.referralType")}</th> */}
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologybookingdataTable.patientPhone")}
              </th>

              <th style={{ textAlign: "center" }}>
                {t("pathologybookingdataTable.status")}
              </th>
              {/*               <th style={{ textAlign: "center" }}>{t("pathologybookingdataTable.results")}</th> */}
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologybookingdataTable.paymentStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologybookingdataTable.paymentDate")}
              </th>

              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologybookingdataTable.testFees")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologybookingdataTable.registrationDate")}
              </th>

              {/* <th style={{ whiteSpace: "nowrap" }}>{t("pathologybookingdataTable.delete")}</th> */}
              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologybookingdataTable.downloadAsPdf") ||
                  "Download as pdf"}
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((booking, index) => {
                if (+currentUser.phoneNumber === booking.PatientPhoneNo) {
                  return (
                    <tr key={booking.id}>
                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        {index + 1}
                      </td>

                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        {booking.selectedTests}
                      </td>
                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        {booking.PatientName}
                      </td>
                      {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
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
                    </td> */}

                      <td style={{ textAlign: "center" }}>
                        {booking.PatientPhoneNo}
                      </td>

                      <td style={{ whiteSpace: "nowrap" }}>{booking.status}</td>

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
                        {booking.TotalFees} {booking.Currency}
                      </th>
                      <td>
                        {formatDateInSelectedLanguage(
                          new Date(booking.createdAt)
                        )}
                      </td>
                      {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
           <button
            title="Delete"
            style={{ fontSize: "12px", padding: "4px 5px" }}
            className="btn btn-secondary mr-2"
            onClick={() => {
             setSelectedBookingId(booking.id);
             setShowDeleteModal(true);
            }}
           >
            <FaTrashAlt />
           </button>
          </td> */}
                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
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
                          <IoPrintSharp />
                        </button>
                      </td>
                    </tr>
                  );
                }
              })}
          </tbody>
        </Table>
      )}
      {/*  */}
      <Modal
        style={{ fontSize: "13px" }}
        centered
        backdrop="static"
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Test booking!?
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "13px" }}
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            style={{ fontSize: "13px" }}
            variant="danger"
            onClick={() => {
              handleDelete(selectedBookingId);
              setShowDeleteModal(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/*  */}
    </div>
  );
};

export default PathologyBills;
