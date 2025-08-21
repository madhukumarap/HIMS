import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Col, Table, Form, Button, Card } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Datepickrange from "./DateRangePickerForReport";
import { FaRegEye } from "react-icons/fa";
import AuthService from "../../services/auth.service";
import { CurrencyContext } from "../../context/CurrencyProvider";

import Translation from "../../translations/PatientSpends.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { currencySymbols } from "../../utils.js";
import { HospitalContext } from "../../context/HospitalDataProvider.jsx";

const TestBookingAnalytics = () => {
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  const [bookings, setBookings] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedCorporateType, setSelectedCorporateType] = useState("All"); // Update initial state
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPatientBookings, setSelectedPatientBookings] = useState([]);

  //////////////////////////////////////////////////
  const [showTestNamesModal, setShowTestNamesModal] = useState(false);

  // Create a function to handle the View button click
  const [testStatuses, setTestStatuses] = useState([]);
  const [selectedTestBooking, setSelectedTestBooking] = useState(null);

  ///

  const { t } = useTranslation();
  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  const { hospitalData } = useContext(HospitalContext);

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

  ///

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
  ///////////////////////////////////////
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
    fetchCompaniesData();
  }, []);

  const fetchCompaniesData = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllCompanies`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setCompanies(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchBookings();
  }, []);

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
  const currentDate = new Date();

  const [startDate, setStartDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  );
  const handleSetDate = (start, end) => {
    // alert(start);

    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };
  const handleOpenModal = (patientID) => {
    const parsedPatientID = parseInt(patientID, 10); // Convert patientID to an integer

    // alert(parsedPatientID);
    // Filter the bookings to get only the ones belonging to the selected patient
    const selectedBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt);
      return (
        booking.PatientID === parsedPatientID &&
        bookingDate >= startDate &&
        bookingDate <= endDate
      );
    });

    setSelectedPatientBookings(selectedBookings);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= startDate && bookingDate <= endDate;
  });
  useEffect(() => {
    // This will run whenever selectedPatientID changes
    const filteredBookingsByPatient = filteredBookings.filter(
      (booking) => booking.PatientID === selectedPatientID
    );
  }, [selectedPatientID, filteredBookings]);

  const handlePatientSelect = (e) => {
    const numValue = parseInt(e.target.value, 10);
    setSelectedPatientID(isNaN(numValue) ? null : numValue);
  };

  const filterPatientsByCorporateType = () => {
    let uniquePatients = new Set();

    // Function to check if a booking matches the selected year and month
    const matchesSelectedYearAndMonth = (booking) => {
      const bookingDate = new Date(booking.createdAt);
      return startDate && endDate
        ? bookingDate >= startDate && bookingDate <= endDate
        : true;
    };

    if (selectedCorporateType === "All") {
      bookings.forEach((booking) => {
        if (matchesSelectedYearAndMonth(booking)) {
          uniquePatients.add(booking.PatientID);
        }
      });
    } else if (selectedCorporateType === "Corporate") {
      bookings.forEach((booking) => {
        if (
          booking.CorporateID !== null &&
          matchesSelectedYearAndMonth(booking) &&
          (selectedCompany === "" || booking.CorporateID === selectedCompany)
        ) {
          uniquePatients.add(booking.PatientID);
        }
      });
    } else {
      bookings.forEach((booking) => {
        if (
          booking.CorporateID === null &&
          matchesSelectedYearAndMonth(booking)
        ) {
          uniquePatients.add(booking.PatientID);
        }
      });
    }

    return Array.from(uniquePatients).map((patientID) => {
      const booking = bookings.find(
        (booking) => booking.PatientID === patientID
      );
      return {
        PatientID: booking.PatientID,
        PatientName: booking.PatientName,
      };
    });
  };

  const calculateTotalTests = () => {
    let totalTests = 0;
    let totalValue = 0;

    filteredBookings.forEach((booking) => {
      const { selectedTests, testFees, CorporateID } = booking;

      // Check the corporate type based on the selectedCorporateType
      if (
        selectedCorporateType === "All" ||
        (selectedCorporateType === "Corporate" &&
          CorporateID !== null &&
          (selectedCompany === "" || CorporateID === selectedCompany)) ||
        (selectedCorporateType === "NonCorporate" && CorporateID === null)
      ) {
        totalTests += selectedTests.split(",").length;
        totalValue += parseInt(testFees);
      }
    });

    return { totalTests, totalValue };
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const calculatePatientTotals = () => {
    const patientTotals = {};
    if (!selectedPatientID) {
      return "";
    }
    const filteredBookingsByPatient = filteredBookings.filter(
      (booking) => booking.PatientID === selectedPatientID
    );

    filteredBookingsByPatient.forEach((booking) => {
      const { PatientID, testFees, PatientName, selectedTests } = booking;

      if (patientTotals[PatientID]) {
        patientTotals[PatientID].totalAmount += parseInt(testFees);
        patientTotals[PatientID].totalTests += selectedTests.split(",").length;
      } else {
        patientTotals[PatientID] = {
          PatientName,
          totalAmount: parseInt(testFees),
          totalTests: selectedTests.split(",").length,
        };
      }
    });
    //  alert(JSON.stringify(patientTotals));
    return patientTotals;
  };

  const calculateAllPatientsTotals = () => {
    const patientTotals = {};

    filteredBookings.forEach((booking) => {
      const { PatientID, testFees, PatientName, selectedTests, CorporateID } =
        booking;

      if (selectedCompany) {
        if (CorporateID === selectedCompany) {
          if (!patientTotals[PatientID]) {
            patientTotals[PatientID] = {
              PatientName,
              totalAmount: 0,
              totalTests: 0,
            };
          }
          patientTotals[PatientID].totalAmount += parseInt(testFees);
          patientTotals[PatientID].totalTests +=
            selectedTests.split(",").length;
        }
        return patientTotals;
      }

      if (selectedCorporateType === "All") {
        if (!patientTotals[PatientID]) {
          patientTotals[PatientID] = {
            PatientName,
            totalAmount: 0,
            totalTests: 0,
          };
        }
        patientTotals[PatientID].totalAmount += parseInt(testFees);
        patientTotals[PatientID].totalTests += selectedTests.split(",").length;
      } else if (selectedCorporateType === "Corporate") {
        if (CorporateID !== null) {
          if (!patientTotals[PatientID]) {
            patientTotals[PatientID] = {
              PatientName,
              totalAmount: 0,
              totalTests: 0,
            };
          }
          patientTotals[PatientID].totalAmount += parseInt(testFees);
          patientTotals[PatientID].totalTests +=
            selectedTests.split(",").length;
        }
      } else if (selectedCorporateType === "NonCorporate") {
        if (CorporateID === null) {
          if (!patientTotals[PatientID]) {
            patientTotals[PatientID] = {
              PatientName,
              totalAmount: 0,
              totalTests: 0,
            };
          }
          patientTotals[PatientID].totalAmount += parseInt(testFees);
          patientTotals[PatientID].totalTests +=
            selectedTests.split(",").length;
        }
      }

      if (selectedCompany && CorporateID === selectedCompany) {
        if (!patientTotals[PatientID]) {
          patientTotals[PatientID] = {
            PatientName,
            totalAmount: 0,
            totalTests: 0,
          };
        }
        patientTotals[PatientID].totalAmount += parseInt(testFees);
        patientTotals[PatientID].totalTests += selectedTests.split(",").length;
      }
    });

    return patientTotals;
  };

  const allPatientsTotals = calculateAllPatientsTotals();

  const formatDateString = (date) => {
    return date ? date.toLocaleDateString() : "";
  };
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    return "Access Denied";
  }
  return (
    <div
      style={{
        fontSize: "14px",
      }}
      className="container "
    >
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          marginBottom: "10px",
          fontSize: "14px",
        }}
      > 
        {/* <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/HospitalAnalytics`);
          }}
        >
          {t("Hospital Earnings")}
        </Button>{" "} */}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/PathologyAnalytics`);
          }}
        >
          {t("PathologySpends")}
        </Button>{" "}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/DiagnosticAnalytics`);
          }}
        >
          {t("DiagnosticSpends")}
        </Button>{" "}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/ConsultationAnalytics`);
          }}
        >
          {t("ConsultationSpends")}
        </Button>{" "}
      </div>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "18px" }}>{`${t("PatientSpends")}(${t(
          "Pathology"
        )})`}</h2>
      </header>
      <br></br>
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">{t("SelectDateRange")}:</label>

          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">{t("SelectCorporateType")}:</label>
          <select
            style={{
              fontSize: "14px",
            }}
            className="form-select"
            value={selectedCorporateType}
            onChange={(e) => {
              setSelectedCorporateType(e.target.value);
              setSelectedPatientID("");
              setSelectedCompany("");
            }}
          >
            <option value="All">{t("All")}</option>
            <option value="Corporate">{t("Corporate")}</option>
            <option value="NonCorporate">{t("NonCorporate")}</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">{t("SelectCompany")}:</label>
          <select
            style={{ fontSize: "14px" }}
            className="form-select"
            value={selectedCompany}
            onChange={(e) => {
              setSelectedCompany(e.target.value);
              if (!selectedCompany) {
                setSelectedCorporateType("Corporate");
              } else {
                setSelectedCorporateType("All");
              }
            }}
          >
            <option value="">{t("All")}</option>
            {companies.map((company) => (
              <option key={company.id} value={company.registrationNo}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">{t("SelectPatient")} :</label>
          <select
            style={{
              fontSize: "14px",
            }}
            className="form-select"
            value={selectedPatientID}
            onChange={handlePatientSelect}
          >
            <option value={null}>{t("All")}</option>
            {/* <option value="all">All Patients</option> */}
            {filterPatientsByCorporateType(selectedCorporateType).map(
              (booking) => (
                <option key={booking.PatientID} value={booking.PatientID}>
                  {booking.PatientName}
                </option>
              )
            )}
          </select>
        </div>
      </div>
      <hr />
      {isMobile ? (
        <div className="card mb-3" key="earnings-summary">
          <div className="card-body">
            <header
              className="header"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "18px" }}>{t("TestEarningsSummary")}</h2>
            </header>
            <div className="card">
              <div className="card-body">
                <p>
                  {t("StartEndDate")}: {formatDateString(startDate)} -{" "}
                  {formatDateString(endDate)}
                </p>
                <p>
                  {t("TotalTests")}: {calculateTotalTests().totalTests}
                </p>
                <p>
                  {t("EarnedAmount")}: {currencySymbols[selectedGlobalCurrency]}{" "}
                  {convertCurrency(
                    calculateTotalTests().totalValue,
                    hospitalData.baseCurrency,
                    selectedGlobalCurrency
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <header
              className="header"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "18px" }}>{t("TestEarningsSummary")}</h2>
            </header>
            <table style={{ textAlign: "center" }} className="table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>{t("StartEndDate")}</th>
                  <th style={{ textAlign: "center" }}>{t("TotalTests")}</th>
                  <th style={{ textAlign: "center" }}>{t("EarnedAmount")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {`${formatDateString(startDate)} - ${formatDateString(
                      endDate
                    )}`}
                  </td>

                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {calculateTotalTests().totalTests}
                  </td>
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {currencySymbols[selectedGlobalCurrency]}{" "}
                    {convertCurrency(
                      calculateTotalTests().totalValue,
                      hospitalData.baseCurrency,
                      selectedGlobalCurrency
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <hr />
      {selectedPatientID && (
        <div>
          {isMobile ? (
            <div className="card mb-3">
              <div className="card-body">
                <header
                  className="header"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h2 style={{ fontSize: "18px" }}>
                    {t("PatientTotalsSummary")}
                  </h2>
                </header>

                {Object.entries(calculatePatientTotals())?.map(
                  ([PatientID, { PatientName, totalAmount, totalTests }]) => (
                    <div className="card">
                      <div className="card-body">
                        <div key={PatientID} className="mb-3">
                          <h5>
                            {t("PatientID")}: {PatientID}
                          </h5>
                          <p>
                            {t("PatientName")}: {PatientName}
                          </p>
                          <p>
                            {t("TotalTests")}:{" "}
                            <button
                              onClick={() => handleOpenModal(PatientID)}
                              className="btn btn-link"
                            >
                              {totalTests !== undefined ? totalTests : ""}
                            </button>
                          </p>
                          <p>
                            {t("TotalFees")}:
                            {currencySymbols[selectedGlobalCurrency]}{" "}
                            {totalAmount !== undefined
                              ? convertCurrency(
                                  totalAmount,
                                  hospitalData.baseCurrency,
                                  selectedGlobalCurrency
                                )
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <header
                  className="header"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h2 style={{ fontSize: "18px" }}>
                    {t("SelectedPatientTestEarningsDetail")}
                  </h2>
                </header>{" "}
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>{t("PatientID")}</th>
                      <th style={{ textAlign: "center" }}>
                        {t("PatientName")}
                      </th>
                      <th style={{ textAlign: "center" }}>{t("TotalTests")}</th>
                      <th style={{ textAlign: "center" }}>{t("TotalFees")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(calculatePatientTotals())?.map(
                      ([
                        PatientID,
                        { PatientName, totalAmount, totalTests },
                      ]) => (
                        <tr key={PatientID}>
                          <td style={{ textAlign: "center" }}>{PatientID}</td>
                          <td style={{ textAlign: "center" }}>{PatientName}</td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              onClick={() => handleOpenModal(PatientID)}
                              className="btn btn-link"
                            >
                              {totalTests !== undefined ? totalTests : ""}
                            </button>
                          </td>
                          <td>
                            {currencySymbols[selectedGlobalCurrency]}{" "}
                            {totalAmount !== undefined
                              ? convertCurrency(
                                  totalAmount,
                                  hospitalData.baseCurrency,
                                  selectedGlobalCurrency
                                )
                              : ""}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedPatientID && (
        <div>
          {isMobile ? (
            <div>
              {Object.entries(allPatientsTotals).map(
                ([PatientID, { PatientName, totalAmount, totalTests }]) => (
                  <div className="card mb-3" key={PatientID}>
                    <div className="card-body">
                      <h5 className="card-title">
                        {t("PatientName")}: {PatientName}
                      </h5>
                      <p className="card-text">
                        {t("PatientID")}: {PatientID}
                      </p>
                      <p className="card-text">
                        {t("TotalTests")}: {totalTests}
                      </p>
                      <p className="card-text">
                        {t("TotalFees")}:
                        {currencySymbols[selectedGlobalCurrency]}{" "}
                        {totalAmount !== undefined
                          ? convertCurrency(
                              totalAmount,
                              hospitalData.baseCurrency,
                              selectedGlobalCurrency
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <header
                  className="header"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h2 style={{ fontSize: "18px" }}>
                    {t("AllPatientsTestEarningsDetail")}
                  </h2>
                </header>{" "}
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>{t("PatientID")}</th>
                      <th style={{ textAlign: "center" }}>
                        {t("PatientName")}
                      </th>
                      <th style={{ textAlign: "center" }}>{t("TotalTests")}</th>
                      <th style={{ textAlign: "center" }}>{t("TotalFees")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(allPatientsTotals).map(
                      ([
                        PatientID,
                        { PatientName, totalAmount, totalTests },
                      ]) => (
                        <tr key={PatientID}>
                          <td style={{ textAlign: "center" }}>{PatientID}</td>
                          <td style={{ textAlign: "center" }}>{PatientName}</td>
                          <td style={{ textAlign: "center" }}>
                            {" "}
                            <button
                              onClick={() => handleOpenModal(PatientID)}
                              className="btn btn-link"
                            >
                              {totalTests !== undefined ? totalTests : ""}
                            </button>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {currencySymbols[selectedGlobalCurrency]}{" "}
                            {totalAmount !== undefined
                              ? convertCurrency(
                                  totalAmount,
                                  hospitalData.baseCurrency,
                                  selectedGlobalCurrency
                                )
                              : ""}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      <Modal
        centered
        style={{ fontSize: "14px" }}
        size="lg"
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("BookingDetails")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isMobile ? (
            <div>
              {selectedPatientBookings.map((booking) => (
                <div className="card mb-3" key={booking.id}>
                  <div className="card-body">
                    <h5 className="card-title" style={{ textAlign: "center" }}>
                      {booking.PatientName}
                    </h5>
                    <p className="card-text" style={{ textAlign: "center" }}>
                      {t("PhoneNumber")}: {booking.PatientPhoneNo}
                    </p>

                    <p className="card-text" style={{ textAlign: "center" }}>
                      {t("TestBookingDate")}: {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {t("PatientName")}
                  </th>
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {t("ViewTest")}
                  </th>
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {t("PhoneNumber")}
                  </th>
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {t("Fees")}
                  </th>
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {t("TestBookingDate")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedPatientBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {booking.PatientName}
                    </td>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      <button
                        title="View Tests"
                        style={{ fontSize: "13px", padding: "4px 5px" }}
                        className="btn btn-secondary"
                        onClick={() => handleViewTestNames(booking)}
                      >
                        <FaRegEye />
                      </button>{" "}
                    </td>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {booking.PatientPhoneNo}
                    </td>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {currencySymbols[selectedGlobalCurrency]}{" "}
                      {convertCurrency(
                        booking.testFees,
                        hospitalData.baseCurrency,
                        selectedGlobalCurrency
                      )}
                    </td>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {formatDate(booking.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
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
                    <h5 className="card-title">{status.testName}</h5>
                    <p className="card-text">
                      {t("CurrentStatus")}: {status.TestStatus}
                    </p>
                    <p className="card-text">
                      {t("RegisteredDate")}:{" "}
                      {new Date(status.TestRegisteredDateTime).toLocaleString()}
                    </p>
                    <p className="card-text">
                      {t("SampleCollectedDate")}:{" "}
                      {status.TestSamplecollectedDateTime
                        ? new Date(
                            status.TestSamplecollectedDateTime
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                    <p className="card-text">
                      {t("CompletedDate")}:{" "}
                      {status.TestCompletedDateTime
                        ? new Date(
                            status.TestCompletedDateTime
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table responsive style={{ fontSize: "14px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>{t("TestName")}</th>
                  <th style={{ textAlign: "center" }}>{t("CurrentStatus")}</th>

                  <th style={{ textAlign: "center" }}>{t("RegisteredDate")}</th>
                  <th style={{ textAlign: "center" }}>
                    {" "}
                    {t("SampleCollectedDate")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {" "}
                    {t("CompletedDate")}{" "}
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
            </Table>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TestBookingAnalytics;
