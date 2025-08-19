import {
  FaPencilAlt,
  FaPlus,
  FaTrashAlt,
  FaRegEye,
  FaDownload,
} from "react-icons/fa";
import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Container, Col, Table, Modal, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import Datepickrange from "./DateRangeCalender";
import { useParams, useNavigate } from "react-router-dom";
import { MdAssignmentAdd } from "react-icons/md";
import Translation from "../translations/Billing_At_Registration.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { CurrencyContext } from "../context/CurrencyProvider";

const BillingAtRegistration = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

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
  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });
  const [dataTotal, setDataTotal] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/PatientRegTotalfees`,
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
  const [packages, setPackages] = useState([]);
  const fetchPatientsData = () => {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser && currentUser.Token) {
      const token = currentUser.Token;

      axios
        .get(`${import.meta.env.VITE_API_URL}/api/getallPaitents`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          const data = response.data;
          setPatients(data);
          setAadharId(data.PatientAadharID);
          setHelthId(data.HealthNationalID);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/GetAllHealthPackagesWithTests`,
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
  const [patients, setPatients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [aadharId, setAadharId] = useState("");
  const [helthId, setHelthId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [updatedBillingInfo, setUpdatedBillingInfo] = useState({
    registrationFees: "",
    paymentStatus: "",
    paymentDate: "",
  });

  const handleSaveBillingInfo = () => {
    if (!updatedBillingInfo.registrationFees) {
      toast.error("Enter Payment Fees");
      return;
    }
    if (updatedBillingInfo.registrationFees <= 0) {
      toast.error("Enter Valid Payment Fees");
      return;
    }
    if (!updatedBillingInfo.paymentStatus) {
      toast.error("Please Select Status");
      return;
    }
    if (
      updatedBillingInfo.paymentStatus === "Paid" &&
      !updatedBillingInfo.paymentDate
    ) {
      toast.error("Please Select Date");
      return;
    }
    if (!selectedPatientId) {
      return;
    }
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/updateBillingInfo/${selectedPatientId}`;

    // Send updatedBillingInfo and selectedPatientId to Node.js for updating
    axios
      .put(url, updatedBillingInfo, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        // Handle the response from the server if needed
        console.log("Billing info updated successfully");
        toast.success("Billing info updated successfully");
        fetchPatientsData();
        setShowModal(false);
        setSelectedPatientId(null); // Reset selected patient ID
        setUpdatedBillingInfo({
          registrationFees: "", // Reset registrationFees
          paymentStatus: "", // Reset paymentStatus
          paymentDate: "", // Reset paymentDate
        });
      })
      .catch((error) => {
        // Handle errors
        toast.error("Fail To Update");
        console.error(error);
      });

    // Close the modal after updating
    setShowModal(false);
  };

  const handleUpdateBilling = (patient) => {
    setShowModal(true);
    setSelectedPatientId(patient.id);
    setUpdatedBillingInfo({
      registrationFees: patient.registrationFees,
      paymentStatus: patient.paymentStatus,
      paymentDate: patient.paymentDate,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBillingInfo({
      ...updatedBillingInfo,
      [name]: value,
    });
  };
  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  function formatDate2(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const fetchDataAndDownloadPDF = async () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Define the table headers
      const headers = [
        "ID",
        "Patient Name",
        "Contact Number",

        "Gender",
        "Address",
        "Age",
        "Registration Date",
        // "Health National ID",
        // "Registration Date",
        "Corporate ID",
      ];

      // Define the table rows
      const rows = [];
      sortedPatients.forEach((patient) => {
        rows.push([
          patient.id,
          `${patient.mr} ${patient.firstName} ${patient.middleName} ${patient.lastName}`,
          `${patient.countryCode} ${patient.phoneNumberP}`,

          patient.gender,
          patient.address || "",
          `${patient.age} Year`,
          // patient.PatientAadharID || "", // Assuming `PatientAadharID` is the Aadhar ID field
          // patient.HealthNationalID || "",
          `${formatDate(patient.createdAt)}`,
          patient.CorporateID || "",
        ]);
      });

      // Set the table position and style
      const tableX = 10;
      const tableY = 20;
      const tableOptions = {
        startY: tableY,
        styles: { fontSize: 10 },
        headStyles: { lineWidth: 0.5 },
        bodyStyles: { lineWidth: 0.5 },
        footStyles: { lineWidth: 0.5 },
        margin: { top: 10 },
      };

      // Add the table to the PDF document
      const title = "Patient List";
      const titleX = doc.internal.pageSize.getWidth() / 2;
      doc.setFontSize(16);
      doc.text(title, titleX, 10, { align: "center" });

      doc.autoTable(headers, rows, tableOptions);

      // Save the PDF document
      doc.save("PatientList.pdf");
    } catch (error) {
      console.error(error);
    }
  };

  const generateBill = async (rowData) => {
    // alert(rowData.paymentStatus);
    if (rowData.paymentStatus !== "Paid") {
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
      const titleText = `Registration Receipt`; // Update the title as needed
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

      const PatientName = ` ${rowData.mr} ${rowData.firstName} ${rowData.middleName} ${rowData.lastName}`;
      const patientInfo = `${t("Receipt.patientName")}: ${PatientName}`;
      const patientPhone = `${t("Receipt.patientPhone")}:  ${
        rowData.phoneNumberP
      }`;
      const createdAT = `${t(
        "Receipt.bookingDate"
      )}: ${formatDateInSelectedLanguage(new Date(rowData.createdAt))}`;
      const PaymentStatus = `${t("Receipt.paymentStatus")}: ${
        rowData.paymentStatus ? rowData.paymentStatus : "NA"
      }`;

      const PaymentAmount = `${t("Receipt.amount")}: ${
        rowData.registrationFees ? rowData.registrationFees : "0"
      } ${rowData.Currency}`;
      const PaymentDate = `${t(
        "Receipt.paymentDate"
      )}: ${formatDateInSelectedLanguage(new Date(rowData.paymentDate))}`;

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
      pdf.text(PaymentStatus, col2X, col2Y + col1Spacing);
      pdf.text(PaymentAmount, col2X, col2Y + 2 * col1Spacing);
      pdf.text(PaymentDate, col2X, col2Y + 3 * col1Spacing);

      pdf.line(0, 120, 210, 120);

      pdf.setFillColor("#48bcdf");
      pdf.rect(0, 270, pdf.internal.pageSize.getWidth(), 10, "F");
      pdf.setTextColor("#ffffff");
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
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser?.Token) {
      const token = currentUser?.Token;
      const hospitalId = currentUser?.hospitalId;
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/getallPaitents`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          setPatients(response.data);
          setAadharId(response.data.PatientAadharID);
          setHelthId(response.data.HealthNationalID);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filterPatients = () => {
    return patients.filter((patient) => {
      const registrationDate = new Date(patient.createdAt).getTime();
      const startTimestamp = startDate ? new Date(startDate).getTime() : 0;
      const endTimestamp = endDate
        ? new Date(endDate).getTime()
        : Number.MAX_SAFE_INTEGER;

      const fullName = `${patient.mr} ${patient.firstName} ${patient.middleName} ${patient.lastName}`;
      const searchValueLower = searchValue.toLowerCase();
      const fullNameLower = fullName.toLowerCase();

      return (
        (patient.phoneNumberP.toString().includes(searchValueLower) ||
          fullNameLower.includes(searchValueLower)) &&
        registrationDate >= startTimestamp &&
        registrationDate <= endTimestamp
      );
    });
  };

  const paginatedPatients = filterPatients().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ...

  // const totalPages = Math.ceil(filterPatients().length / itemsPerPage);

  const totalPages = Math.ceil(patients.length / itemsPerPage);
  console.log("Total number of patients:", filterPatients().length);
  console.log("Items per page:", itemsPerPage);
  console.log("Total number of patients:", patients.length);

  //alert(totalPages);
  const goToNextPage = () => {
    //alert(totalPages);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const sortedPatients = paginatedPatients.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const downloadDataAsCSV = () => {
    const csvData = [
      [
        "ID",
        "Patient Name",
        "Contact Number",
        "Email",
        "Gender",
        "Weight",
        "Age",
        "Registration Date",
        "Aadhar ID",
        "Health National ID",
        "City",
        "State",
        "Pincode",
        "Address",

        "Corporate ID",
      ],
    ];
    sortedPatients.forEach((patient) => {
      csvData.push([
        patient.id,
        `${patient.mr} ${patient.firstName} ${patient.middleName} ${patient.lastName}`,
        ` ${patient.phoneNumberP}`,
        patient.email,
        patient.gender,
        `${patient.weight} Kg.`,
        `${patient.age} Year`,
        formatDateInSelectedLanguage(new Date(patient.createdAt)),
        patient.PatientAadharID || "", // Assuming `PatientAadharID` is the Aadhar ID field
        patient.HealthNationalID || "", // Assuming `HealthNationalID` is the Health National ID field
        patient.city || "",
        patient.state || "", // Assuming `state` is the state field
        patient.pincode || "", // Assuming `pincode` is the pincode field
        patient.address || "", // Assuming `address` is the address field
        patient.CorporateID || "", // Assuming `CorporateID` is the Corporate ID field
      ]);
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "patients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (
    !currentUser ||
    (!currentUser.roles.includes("ROLE_ADMIN") &&
      !currentUser.roles.includes("ROLE_RECEPTIONIST") &&
      !currentUser.roles.includes("ROLE_DOCTOR"))
  ) {
    // If the user is not logged in or does not have the admin role,
    // you can show a message or redirect to another page.
    return " Access Denied";
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

  const h2Style = {
    fontSize: "14px",
  };

  const h3Style = {
    fontSize: "16px",
  };

  return (
    <Container style={style} className="mt-0 text-center">
      <br></br>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("billingatRegistration")}</h2>
      </header>
      <br />
      {/* <Form.Control
        as="select"
        value={itemsPerPage}
        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
      >
        <option value="5">5 per page</option>
        <option value="10">10 per page</option>
        <option value="15">15 per page</option>
      </Form.Control> */}
      <Form.Group controlId="searchBar">
        <div className="row">
          <div className="col-md-4 col-sm-12 mb-3">
            <label style={{ marginBottom: "8px", fontWeight: "bold" }}>
              {t("searchbynameorPhone")}
            </label>
            <Form.Control
              style={{ fontSize: "12px" }}
              type="text"
              placeholder={
                t("searchbynameorPhone") ||
                "Search by Patient name or contact number"
              }
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-md-4 col-sm-12 mb-3">
            <Datepickrange
              onSetDate={handleSetDate}
              onClearDate={handleClearDate}
            />
          </div>
          {/* Uncomment the code below if needed */}
          {/* <div className="col-md-4 col-sm-12 mb-3">
      <div className="d-flex justify-content-end">
        <Button
          variant="secondary"
          style={{
            fontSize: "12px",
            padding: "4px 5px",
            marginRight: "10px",
          }}
          onClick={downloadDataAsCSV}
        >
          Download as CSV
        </Button>
        <Button
          variant="secondary"
          style={{ fontSize: "12px", padding: "4px 5px" }}
          onClick={fetchDataAndDownloadPDF}
        >
          Download PDF
        </Button>
      </div>
    </div> */}
        </div>
      </Form.Group>

      <br />

      <div
        style={{ display: "flex", justifyContent: "start" }}
        className="col-md-4col-12"
      >
        <p>
          {t("TotalCollectedAmount")}:
          <strong> {dataTotal?.totalFeesUSD} USD </strong>,
          <strong> {dataTotal?.totalFeesEUR} EUR </strong>,
          <strong> {dataTotal?.totalFeesINR} INR </strong>,
          <strong> {dataTotal?.totalFeesCDF} CDF </strong>
        </p>
      </div>
      {isMobile ? (
        <CardViewPatients
          patients={sortedPatients}
          generateBill={generateBill}
          handleUpdateBilling={handleUpdateBilling}
          formatDate={formatDateInSelectedLanguage}
        />
      ) : (
        <Table
          style={{ verticalAlign: "middle", textAlign: "center" }}
          responsive
          bordered
          hover
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>
                {t("billingRegistrationTable.id")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("billingRegistrationTable.patientName")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("billingRegistrationTable.contactNumber")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("billingRegistrationTable.gender")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("billingRegistrationTable.age")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("billingRegistrationTable.corporateID")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("billingRegistrationTable.registrationDate")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("billingRegistrationTable.registrationFees")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("billingRegistrationTable.paymentStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("billingRegistrationTable.paymentDate")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("billingRegistrationTable.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPatients.map((patient) => (
              <tr key={patient.id}>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {patient.id}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {`${patient.mr} ${patient.firstName} ${patient.middleName} ${patient.lastName}`}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {`${patient.countryCode || ""}${patient.phoneNumberP}`}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {patient.gender}
                </td>
                <td
                  style={{ whiteSpace: "nowrap", textAlign: "center" }}
                >{`${patient.age} ${patient.ageOption}`}</td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {patient.CorporateID || "NA"}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(new Date(patient.createdAt))}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {convertCurrency(
                    patient.registrationFees,
                    patient.Currency,
                    selectedGlobalCurrency
                  )}{" "}
                  {selectedGlobalCurrency}
                </td>{" "}
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {patient.paymentStatus}
                </td>{" "}
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(new Date(patient.paymentDate))}
                </td>{" "}
                <td>
                  {" "}
                  <button
                    title={t("billingRegistrationTable.downloadAsPDF")}
                    style={{
                      fontSize: "12px",
                      padding: "4px 5px",
                      marginTop: "0px",
                      backgroundColor: "#1111",
                      color: "black",
                    }}
                    className="btn btn-secondary"
                    onClick={() => generateBill(patient)}
                  >
                    <FaDownload />
                  </button>
                  {/* <button
                    title={t("billingRegistrationTable.updateBilling")}
                    style={{
                      fontSize: "12px",
                      padding: "4px 5px",
                      marginTop: "0px",
                      backgroundColor: "#1111",
                      color: "black",
                    }}
                    className="btn btn-secondary"
                    onClick={() => handleUpdateBilling(patient)}
                  >
                    <FaPencilAlt />
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <br></br>
      <div className="text-center">
        <Button
          variant="secondary"
          style={{ fontSize: "12px", marginTop: "0px" }}
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          {t("billingRegistrationTable.previous")}
        </Button>
        <span className="mx-2">
          {currentPage} of {totalPages}
        </span>
        <Button
          variant="secondary"
          style={{ fontSize: "12px", marginTop: "0px" }}
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          {" "}
          {t("billingRegistrationTable.next")}
        </Button>
      </div>
      <Modal
        style={{ fontSize: "14px" }}
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            Update Billing Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="registrationFees">
              <Form.Label>Registration Fees</Form.Label>
              <Form.Control
                type="number"
                required
                placeholder="Enter Registration Fees"
                style={{ fontSize: "14px" }}
                name="registrationFees"
                value={updatedBillingInfo.registrationFees}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="paymentStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                as="select"
                required
                style={{ fontSize: "14px" }}
                name="paymentStatus"
                value={updatedBillingInfo.paymentStatus}
                onChange={handleInputChange}
              >
                <option value="">Select Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="Not-Paid">Not Paid</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="paymentDate">
              <Form.Label>Payment Date</Form.Label>
              <Form.Control
                type="Date"
                required
                placeholder="Enter Payment Date"
                style={{ fontSize: "14px" }}
                name="paymentDate"
                value={updatedBillingInfo.paymentDate}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "14px" }}
            variant="secondary"
            onClick={handleCloseModal}
          >
            Close
          </Button>
          <Button
            style={{ fontSize: "14px" }}
            variant="primary"
            onClick={handleSaveBillingInfo}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <br></br>
    </Container>
  );
};

const CardViewPatients = ({
  patients,
  generateBill,
  handleUpdateBilling,
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
    <div style={{ textAlign: "left" }}>
      {patients.map((patient) => (
        <Card key={patient.id} style={{ margin: "10px" }}>
          <Card.Body>
            <Card.Title>{`${patient.mr} ${patient.firstName} ${patient.middleName} ${patient.lastName}`}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{`${
              patient.countryCode || ""
            }${patient.phoneNumberP}`}</Card.Subtitle>
            <Card.Text>
              {t("billingRegistrationTable.gender")}: {patient.gender}
            </Card.Text>
            <Card.Text>{`${patient.age} Year`}</Card.Text>
            <Card.Text>
              {t("billingRegistrationTable.corporateID")}:{" "}
              {patient.CorporateID || "NA"}
            </Card.Text>
            <Card.Text>
              {t("billingRegistrationTable.registrationDate")}:{" "}
              {formatDateInSelectedLanguage(new Date(patient.createdAt))}
            </Card.Text>
            <Card.Text>
              {t("billingRegistrationTable.registrationFees")}:{" "}
              {patient.registrationFees} {patient.Currency}
            </Card.Text>
            <Card.Text>
              {t("billingRegistrationTable.paymentStatus")}:{" "}
              {patient?.paymentStatus}
            </Card.Text>
            <Card.Text>
              {t("billingRegistrationTable.paymentDate")}: {patient.paymentDate}
            </Card.Text>
            <button
              title={
                t("billingRegistrationTable.downloadAsPDF") || "Download As Pdf"
              }
              style={{
                fontSize: "12px",
                padding: "4px 5px",
                marginTop: "0px",
                backgroundColor: "#1111",
                color: "black",
              }}
              className="btn btn-secondary"
              onClick={() => generateBill(patient)}
            >
              <FaDownload />
            </button>
            <button
              title={
                t("billingRegistrationTable.updateBilling") || "Update Billing"
              }
              style={{
                fontSize: "12px",
                padding: "4px 5px",
                marginTop: "0px",
                backgroundColor: "#1111",
                color: "black",
              }}
              className="btn btn-secondary"
              onClick={() => handleUpdateBilling(patient)}
            >
              <FaPencilAlt />
            </button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};
export default BillingAtRegistration;
