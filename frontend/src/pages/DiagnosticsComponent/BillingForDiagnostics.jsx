import jsPDF from "jspdf";
import { IoPrintSharp, IoDownload, IoCloudDownload } from "react-icons/io5";
import Select from "react-select";
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Col, Button, Table, Card } from "react-bootstrap";
import axios from "axios";
import Datepickrange from "../DateRangeCalender";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import AddResultModalForBloodSugarForFastingTest from "../DiagnosticsComponent/AddResultDiagnosticReport";
import DownloadPDFButton from "../DiagnosticsComponent/DownloadResultDiagnosticReport";
import UploadDiagnosticImages from "../DiagnosticsComponent/UploadDiagnosticImages";
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../../services/auth.service";
import Translation from "../../translations/PathologyBookingData.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { HospitalContext } from "../../context/HospitalDataProvider";
import { CurrencyContext } from "../../context/CurrencyProvider";

function DiagnosticsBooking() {
  const currentUser = AuthService.getCurrentUser();

  const { t } = useTranslation();
  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  const { hospitalData } = useContext(HospitalContext);

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
    const intervalId = setInterval(initializei18n, 2000);
    return () => clearInterval(intervalId);
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };
  const navigate = useNavigate();
  const [testBookingID, setTestBookingID] = useState(null);

  const [dataTotal, setDataTotal] = useState(null);

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
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/DiagnosticTotalfees`,
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "selectedTest") {
      // Find the selected test by its name
      const selectedTest = testNames.find((test) => test.testName === value);

      if (selectedTest) {
        // If the test is found, set both the test name and its ID
        setFormData((prevData) => ({
          ...prevData,
          selectedTests: value, // Set the test name
          TestManagementID: selectedTest.id, // Set the test ID
        }));
        setSelectedTests(formData.selectedTests);
      }
    } else if (name === "testFees") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === "results") {
      setFormData((prevData) => ({
        ...prevData,
        results: value,
      }));
    } else if (name === "DoctorSelected") {
      setSelectedDoctor((prevData) => ({
        ...prevData,
        results: value,
      }));
    } else if (name === "referralType") {
      setFormData((prevData) => ({
        ...prevData,
        commissionType: value,
        referralType: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleEdit = (rowData) => {
    //alert(JSON.stringify(rowData.selectedTests));
    //alert(rowData.TestManagementID);
    console.log("Selected Patient ID:", rowData.PatientID);
    console.log("Patients Data:", patients);
    const selectedTestNamesArray = rowData.selectedTests
      .split(",")
      .map((test) => test.trim());

    // Map the test names to an array of objects with value and label properties
    const selectedTestOptions = selectedTestNamesArray.map((testName) => ({
      value: testName,
      label: testName,
    }));

    // alert(selectedTestNamesArray);
    // return;

    let patient =
      "PID:" +
      rowData?.PatientID +
      "," +
      rowData?.firstName +
      " " +
      rowData?.lastName +
      " (" +
      rowData?.PatientPhoneNo +
      ")";
    // alert(patient);
    setSelectedDoctor(rowData?.doctorId);
    // alert(rowData.commissionType);

    setFormData({
      ...rowData,
      selectedPatient: `${rowData.PatientID}`,
      id: rowData.id,
      testFees: rowData.testFees,
      patientId: `${rowData.PatientID}`,
      selectedTests: selectedTestNamesArray,
      referralType: rowData.commissionType,
      TestManagementID: rowData.TestManagementID,
      paymentDate: rowData.PaymentDate,
      paymentStatus: rowData.PaymentStatus,
    });
    setSelectedTests(rowData.selectedTests);
    // alert(formData.selectedPatient);
    setShowModal(true);
    setIsEditMode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;

      // alert(formData.commissionType);
      //return;
      if (formData.id) {
        // Updating an existing booking
        //alert(formData.id);

        if (formData.paymentStatus === "Not-Paid") {
          formData.paymentDate = "";
        }

        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/updateDiagnosticsBooking/${
            formData.id
          }`,
          {
            ...formData,
            patientId: formData?.PatientID,
            testFees: formData?.testFees,
            results: formData?.results,
            doctorID: selectedDoctor,
            selectedTest: formData?.selectedTests,
            TestManagementID: formData?.TestManagementID,
          },
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        toast.success("Updated Successfully");
        fetchBookings();
      } else {
        //alert(formData.paymentStatus);
        //return;
        // Creating a new booking
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/createDiagnosticsBooking`,
          {
            ...formData,
            patientId: formData.selectedPatient,
            testFees: formData.testFees,
            results: formData.results,
            doctorID: selectedDoctor,
            selectedTest: SelectedTests,
            TestManagementID: formData.TestManagementID,
          },
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        toast.success("Saved Successfully");
      }

      fetchBookings(); // Refetch bookings after saving/editing

      console.log(response.data);
      setShowModal(false);
      setSelectedDoctor("");
      setFormData({
        status: "Pending",
        lapName: "",
        remarks: "",
        instrumentsUsed: "",
        selectedTests: [],
        selectedPatient: "",
        testFees: "",
      });
    } catch (error) {
      toast.error("Failed!" + error);

      console.error(error);
    }
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

  const generatebill = async (rowData) => {
    console.log(rowData);

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
      const patientPhone = `${t("Receipt.patientPhone")}:  ${
        rowData?.PatientPhoneNo
      }`;
      const createdAT = `${t(
        "Receipt.bookingDate"
      )}: ${formatDateInSelectedLanguage(new Date(rowData?.createdAt))}`;
      const doctorInfo = `${t("Receipt.doctorName")}: Dr ${
        rowData?.DoctorName
      }`;

      const doctorPhone = `${t("Receipt.doctorPhone")}:  ${
        rowData?.DoctorPhone
      }`;

      const paymentStatus = `${t(
        "Receipt.paymentStatus"
      )}: ${rowData?.PaymentStatus?.toUpperCase()}`;
      const paymentDateTime = rowData?.PaymentDate
        ? `${t("Receipt.paymentDate")}: ${formatDateInSelectedLanguage(
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
    !currentUser.roles.includes("ROLE_RECEPTIONIST")
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
        <h2 style={{ fontSize: "16px" }}> {t("DiagnosticsBill")}</h2>
      </header>
      <br />
      {/* <button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        className="btn btn-secondary"
        onClick={() => setShowModal(true)}
      >
        Test Registration
      </button>{" "} */}
      <br></br> <br></br>
      <div className="row mb-3">
        <div className="col-md-3 col-12">
          <label
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              marginBottom: "10px",
              display: "block", // Ensure label takes full width
            }}
          >
            {t("searchbypatientnameorPhone")}
            <input
              style={{ fontSize: "12px", marginTop: "10px" }}
              type="text"
              className="form-control"
              placeholder={t("searchbypatientnameorPhone")}
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

        <div className="col-md-4col-12">
          <p>
            {t("TotalCollectedAmount")}:
            <strong> {dataTotal?.totalFeesUSD} USD </strong>,
            <strong> {dataTotal?.totalFeesEUR} EUR </strong>,
            <strong> {dataTotal?.totalFeesINR} INR </strong>,
            <strong> {dataTotal?.totalFeesCDF} CDF </strong>
          </p>
        </div>
      </div>
      {isMobile ? (
        <div>
          {filteredBookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((booking, index) => (
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
                      <IoDownload />
                    </button>
                  </div>

                  <p className="card-text">
                    {t("pathologybookingdataTable.referralDoctor")}:{" "}
                    {booking.DoctorName !== "NA NA NA"
                      ? `${t("pathologybookingdataTable.dr")} ${
                          booking.DoctorName
                        }`
                      : "NA"}
                  </p>

                  <p className="card-text">
                    {t("pathologybookingdataTable.patientPhone")}:
                    {booking.PatientPhoneNo}
                  </p>
                  <p className="card-text">
                    {t("pathologybookingdataTable.paymentStatus")}:{" "}
                    {booking.PaymentStatus}
                  </p>
                  <p className="card-text">
                    {t("pathologybookingdataTable.paymentDate")}:{" "}
                    {booking.PaymentDate !== null
                      ? formatDateInSelectedLanguage(
                          new Date(booking.PaymentDate)
                        )
                      : "NA"}
                  </p>
                  <p className="card-text">
                    {t("pathologybookingdataTable.testFees")}: ₹
                    {booking.testFees}
                  </p>

                  <p className="card-text">
                    {t("pathologybookingdataTable.registrationDate")}:{" "}
                    {formatDateInSelectedLanguage(new Date(booking.createdAt))}
                  </p>
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
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("labName")}</th> */}
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("testName")}</th> */}
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.patientName")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.referralDoctor")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("referralType")}</th> */}
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.patientPhone")}
              </th>
              {/*               <th style={{ textAlign: "center" }}>{t("instrumentsUsed")}</th> */}
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("remarks")}</th> */}
              {/*               <th style={{ textAlign: "center" }}>{t("status")}</th> */}
              {/*               <th style={{ textAlign: "center" }}>{t("results")}</th> */}
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
                {t("AuthorizationStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.registrationDate")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("action")}</th>
  <th style={{ whiteSpace: "nowrap" }}>{t("uploadImages")}</th> */}

              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologybookingdataTable.downloadAsPdf")}
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
                  {booking.selectedTests}
                </td> */}
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {booking.PatientName}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {booking.DoctorName !== "NA NA NA" ||
                    booking.DoctorName !== "NA NA"
                      ? `Dr. ${booking.DoctorName}`
                      : "NA"}
                  </td>
                  {/* <td
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
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {booking?.PaidAmount
                      ? convertCurrency(
                          booking.PaidAmount,
                          booking.Currency,
                          selectedGlobalCurrency
                        )
                      : "NA"}{" "}
                    {selectedGlobalCurrency}
                  </th>
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {booking?.TotalFees
                      ? convertCurrency(
                          booking.TotalFees,
                          booking.Currency,
                          selectedGlobalCurrency
                        )
                      : "NA"}{" "}
                    {selectedGlobalCurrency}
                  </th>
                  <td style={{ textAlign: "center" }}>
                    {booking.Authorization}
                  </td>
                  <td>
                    {" "}
                    {formatDateInSelectedLanguage(new Date(booking.createdAt))}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {/* <button
                    title="Edit Booking"
                    style={{ fontSize: "12px", padding: "4px 5px" }}
                    className="btn btn-secondary mr-2"
                    onClick={() => handleEdit(booking)}
                  >
                    <FaPencilAlt />
                  </button> */}
                    {"  "}{" "}
                    {/* <button
                    title="Delete"
                    style={{ fontSize: "12px", padding: "4px 5px" }}
                    className="btn btn-secondary mr-2"
                    onClick={() => {
                      setSelectedBookingId(booking.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrashAlt />
                  </button> */}
                    {/* </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}> */}
                    <button
                      title="Download as pdf"
                      style={{
                        fontSize: "12px",
                        padding: "4px 5px",
                        marginTop: "0px",
                      }}
                      className="btn btn-secondary mr-2"
                      onClick={() => generatebill(booking)}
                    >
                      <IoDownload />
                    </button>
                  </td>
                  {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  <UploadDiagnosticImages
                    testBookingID={booking.id}
                    SelectedTest={booking.selectedTests}
                  />
                </td> */}
                  {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  <button
                    title="Add Result"
                    style={{ fontSize: "12px", padding: "4px 5px" }}
                    className="btn btn-secondary mr-2"
                    onClick={() => handleAddResult(booking)}
                  >
                    <FaPencilAlt />
                  </button>

                  <button
                    title="Download Report"
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "12px",
                      padding: "4px 5px",
                    }}
                    className="btn btn-secondary mr-2"
                    onClick={() => handleGenerateReportNew(booking)}
                  >
                    <IoPrintSharp />
                  </button>
                </td> */}
                </tr>
              ))}
          </tbody>
        </Table>
      )}
      <Modal
        style={{ fontSize: "13px", marginTop: "20px" }}
        centered
        backdrop="static"
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Test booking?
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
