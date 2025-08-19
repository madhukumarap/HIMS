import { IoPrintSharp } from "react-icons/io5";
import Select from "react-select";
import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Col, Button, Table, Card } from "react-bootstrap";
import axios from "axios";
import Datepickrange from "./DateRangeCalender";
import DownloadPDFButton from "./PathologyAllTest/PathologyTestReportAllTest";
import Translation from "../translations/Pathologytest.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { CurrencyContext } from "../context/CurrencyProvider";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  FaPencilAlt,
  FaPlus,
  FaTrashAlt,
  FaRegEye,
  FaDownload,
} from "react-icons/fa";
import ReportModal from "./TestReportModalPathalogy";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../services/auth.service";
import AddResultModalForBloodSugarForFastingTest from "./PathologyAllTest/AddResultModalForBloodSugarForFastingTest";

//report generate Modal for all test
import ReportGenerateModalBloodSugarForFasting from "./PathologyAllTest/ReportGenerateModalBloodSugarForFasting";
function Pathologytest() {
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const navigate = useNavigate();
  const [testBookingID, setTestBookingID] = useState(null);

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
        }/api/PathologyTestStatuses/${bookingId}`,
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
  const [testNames, setTestNames] = useState([]);
  const [enterCodeData, setEnterCodeData] = useState([]);

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
  const [showResultModal2, setShowResultModal2] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [SelectedTests, setSelectedTests] = useState("");

  const [showReportModal, setShowReportModal] = useState(false);
  useState(false);

  const [
    showReportResultModalBloodSugarForFasting,
    setShowReportResultModalBloodSugarForFasting,
  ] = useState(false);

  const [
    showReportModalBloodSugarFasting,
    setShowReportModalBloodSugarFasting,
  ] = useState(false);
  const [selectedReportData, setSelectedReportData] = useState(null);
  const [selectedReportData2, setSelectedReportData2] = useState(null);

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

  //
  const [testBookingData, setTestBookingData] = useState(null);

  const [tableName, setTableName] = useState("");
  const [PatientTestBookingID, setPatientTestBookingID] = useState("");
  const [lastRecord, setLastRecord] = useState(null);

  const fetchLastRecord = async () => {
    try {
      // alert(tableName + " " + PatientTestBookingID);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/getLastRecordByPatientTestBookingID`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${currentUser?.Token}`,
          },
          body: JSON.stringify({ tableName, PatientTestBookingID }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        setLastRecord(data); // Update state with the last record
      } else {
        console.error("Error fetching last record");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);
  useEffect(() => {
    fetchLastRecord();
  }, [tableName, PatientTestBookingID]);
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

  const [selectedTestNames, setSelectedTestNames] = useState("");
  const [reportselectedTest, setReportSelectedTest] = useState("");
  const [reportselectedTestModal, setReportSelectedTestModal] = useState(false);
  const [BookingsrowData, setBookingsrowData] = useState("");
  const [PatienttestBookID, setPatienttestBookID] = useState("");
  const [ReporttestName, setReporttestName] = useState("");
  const handleGenerateReportNew = (testBookingID) => {
    if (testBookingID.status !== "Completed") {
      toast.error("Result Not Found");
      return;
    }
    setTestBookingID(testBookingID.id);
  };
  const handleAddResult = (booking) => {
    console.log("Selected Report Data:", booking);
    setSelectedReportData(booking);
    //alert(JSON.stringify(booking));
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
        // alert(JSON.stringify(response.data.bookings));
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
  const DiagnosticsBookingForPatient = () => {
    navigate(`/${extractedPart}/DiagnosticsBookingForPatient`);
  };
  const PathologytestOwnReport = () => {
    navigate(`/${extractedPart}/PathologytestOwnReport`);
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
          `${import.meta.env.VITE_API_URL}/api/updateBooking/${formData.id}`,
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
          `${import.meta.env.VITE_API_URL}/api/testBooking`,
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
    !currentUser.roles.includes("ROLE_PATIENT") &&
    !currentUser.roles.includes("ROLE_ADMIN")
  ) {
    return "Access Denied";
  }

  const datePickerStyle = {
    fontSize: "12px",
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
      <br></br>{" "}
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{t("MyTestBookings(Pathology)")}</h2>
      </header>
      <br></br>
      <br></br>
      {isMobile ? (
        <div>
          {filteredBookings.map((booking) => {
            if (+currentUser.phoneNumber === booking.PatientPhoneNo) {
              return (
                <div className="card mb-3" key={booking.id}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title">
                        {t("PatientName")}: {booking.PatientName}
                      </h5>
                      <button
                        title={t("Download as Pdf")}
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
                      {t("pathologyStatusModalTable.TestName")}:{" "}
                      <button
                        title={t("View Tests")}
                        style={{ fontSize: "13px", padding: "4px 5px" }}
                        className="btn btn-secondary"
                        onClick={() => handleViewTestNames(booking)}
                      >
                        <FaRegEye />
                      </button>
                    </p>
                    <p className="card-text">
                      {t("PatientPhone")}: {booking.PatientPhoneNo}
                    </p>
                    <p className="card-text">
                      {t("PaymentStatus")}: {booking.PaymentStatus}
                    </p>
                    <p className="card-text">
                      {t("PaymentDate")}:{" "}
                      {booking.PaymentDate !== null
                        ? formatDateInSelectedLanguage(
                            new Date(booking.PaymentDate)
                          )
                        : t("NA")}
                    </p>
                    <p className="card-text">
                      {t("TestFees")}:{" "}
                      {convertCurrency(
                        booking.TotalFees,
                        booking.Currency,
                        selectedGlobalCurrency
                      )}{" "}
                      {selectedGlobalCurrency}
                    </p>
                    <p className="card-text">
                      {t("RegistrationDate")}:{" "}
                      {formatDateInSelectedLanguage(
                        new Date(booking.createdAt)
                      )}
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
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("Lab Name")}</th> */}
              <th style={{ whiteSpace: "nowrap" }}>{t("PatientName")}</th>

              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyStatusModalTable.TestName")}
              </th>

              <th style={{ whiteSpace: "nowrap" }}>{t("PatientPhone")}</th>
              {/*               <th style={{ textAlign: "center" }}>{t("InstrumentsUsed")}</th> */}
              {/*               <th style={{ textAlign: "center" }}>{t("Status")}</th> */}
              {/*               <th style={{ textAlign: "center" }}>{t("Results")}</th> */}
              <th style={{ whiteSpace: "nowrap" }}>{t("PaymentStatus")}</th>
              <th style={{ whiteSpace: "nowrap" }}>{t("PaymentDate")}</th>

              <th style={{ whiteSpace: "nowrap" }}>{t("TestFees")}</th>
              <th style={{ whiteSpace: "nowrap" }}>{t("RegistrationDate")}</th>

              <th style={{ whiteSpace: "nowrap" }}>
                {t("pathologyPatientListTable.DownloadReport")}
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
                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        {booking.PatientName}
                      </td>{" "}
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
                      <td style={{ textAlign: "center" }}>
                        {booking.PatientPhoneNo}
                      </td>
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
                        {/* <span>&#8377;</span> */}{" "}
                        {convertCurrency(
                          booking.TotalFees,
                          booking.Currency,
                          selectedGlobalCurrency
                        )}{" "}
                        {selectedGlobalCurrency}
                      </th>
                      <td>
                        {formatDateInSelectedLanguage(
                          new Date(booking.createdAt)
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
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
      <Modal
        style={{ marginTop: "20px" }}
        centered
        backdrop="static"
        show={showResultModal2}
        onHide={() => setShowResultModal2(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Test Booking and Result Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {testBookingData && (
            <div>
              <h5>Booking Data:</h5>
              <pre>{JSON.stringify(testBookingData.booking, null, 2)}</pre>
              <h5>T3T4TSH Test Model Data:</h5>
              <pre>
                {JSON.stringify(testBookingData.T3T4TSHTestModelData, null, 2)}
              </pre>
            </div>
          )}
        </Modal.Body>
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
      <ReportModal
        show={showReportModal}
        handleClose={() => {
          setShowReportModal(false);
          setSelectedReportData(null);
          window.location.reload();
        }}
        reportData={selectedReportData}
      />
      <ReportGenerateModalBloodSugarForFasting
        show={showReportResultModalBloodSugarForFasting}
        handleClose={() => {
          setShowReportResultModalBloodSugarForFasting(false);
          setSelectedReportData2(null);
          window.location.reload();
        }}
        reportData={selectedReportData2}
        ReporttestName={ReporttestName}
      />
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
                      {formatDateInSelectedLanguage(
                        new Date(status.TestRegisteredDateTime)
                      )}
                    </p>
                    <p className="card-text">
                      {t("pathologyStatusModalTable.SampleCollectedDate")}:{" "}
                      {status.TestSamplecollectedDateTime
                        ? formatDateInSelectedLanguage(
                            new Date(status.TestSamplecollectedDateTime)
                          )
                        : t("N/A")}
                    </p>
                    <p className="card-text">
                      {t("pathologyStatusModalTable.CompletedDate")}:{" "}
                      {status.TestCompletedDateTime
                        ? formatDateInSelectedLanguage(
                            new Date(status.TestCompletedDateTime)
                          )
                        : t("N/A")}
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
                      {formatDateInSelectedLanguage(
                        new Date(status.TestRegisteredDateTime)
                      )}
                    </td>
                    <td>
                      {status.TestSamplecollectedDateTime
                        ? formatDateInSelectedLanguage(
                            new Date(status.TestSamplecollectedDateTime)
                          )
                        : "N/A"}
                    </td>
                    <td>
                      {status.TestCompletedDateTime
                        ? formatDateInSelectedLanguage(
                            new Date(status.TestCompletedDateTime)
                          )
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

export default Pathologytest;
