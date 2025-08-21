import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Col, Table, Form, Button, Card } from "react-bootstrap";
import Datepickrange from "./DateRangePickerForReport";
import AuthService from "../../services/auth.service";
import { CurrencyContext } from "../../context/CurrencyProvider";
import { HospitalContext } from "../../context/HospitalDataProvider";
import { currencySymbols } from "../../utils.js";

const ConsultationAnalytics = () => {
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  const [bookings, setBookings] = useState([]);
  const [bookingsCorporate, setBookingsCorporate] = useState([]);
  const [bookingsNonCorporate, setBookingsNonCorporate] = useState([]);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedCorporateType, setSelectedCorporateType] = useState("All"); // Update initial state
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  const currentDate = new Date();

  const [startDate, setStartDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  );
  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  const { hospitalData } = useContext(HospitalContext);

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
  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };
  const formatDateString = (date) => {
    return date ? date.toLocaleDateString() : "";
  };
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
    fetchBookingsNotCorporate();
    fetchBookingsCorporate();
  }, []);

  const fetchBookings = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllDoctorsAppointments`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setBookings(response.data.appointments);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const fetchBookingsNotCorporate = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/bookingsWithCorporateIDNull`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setBookingsNonCorporate(response.data.appointments);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const fetchBookingsCorporate = () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/bookingsWithCorporateIDNotNull`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        setBookingsCorporate(response.data.appointments);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= startDate && bookingDate <= endDate;
  });
  const filteredCorporateBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= startDate && bookingDate <= endDate;
  });
  const filteredNonCorporateBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= startDate && bookingDate <= endDate;
  });
  useEffect(() => {
    // This will run whenever selectedPatientID changes
    const filteredBookingsByPatient = filteredBookings.filter(
      (booking) => booking.patientId === selectedPatientID
    );
  }, [selectedPatientID, filteredBookings]);

  const handlePatientSelect = (e) => {
    setSelectedPatientID(parseInt(e.target.value)); // Parse the value to an integer
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
        if (
          matchesSelectedYearAndMonth(booking) &&
          (selectedCompany === "" || booking.CorporateID === selectedCompany)
        ) {
          uniquePatients.add(booking.patientId);
        }
      });
    } else if (selectedCorporateType === "Corporate") {
      bookingsCorporate.forEach((booking) => {
        if (
          true &&
          matchesSelectedYearAndMonth(booking) &&
          (selectedCompany === "" || booking.CorporateID === selectedCompany)
        ) {
          uniquePatients.add(booking.patientId);
        }
      });
    } else if (selectedCorporateType === "NonCorporate") {
      bookingsNonCorporate.forEach((booking) => {
        if (
          true &&
          matchesSelectedYearAndMonth(booking) &&
          (selectedCompany === "" || booking.CorporateID === selectedCompany)
        ) {
          uniquePatients.add(booking.patientId);
        }
      });
    }

    return Array.from(uniquePatients).map((patientId) => {
      const booking = bookings?.find(
        (booking) => booking.patientId === patientId
      );
      return {
        patientId: booking.patientId,
        PatientName: booking.PatientName,
      };
    });
  };

  const calculateTotalTests = () => {
    let totalValue = 0;

    const filteredBookingsByCorporateType = filteredBookings.filter(
      (booking) => {
        if (selectedCorporateType === "All") {
          return true; // Include all patients
        } else if (
          selectedCorporateType === "Corporate" &&
          booking.CorporateID !== null
        ) {
          return true; // Include only corporate patients
        } else if (
          selectedCorporateType === "NonCorporate" &&
          booking.CorporateID === null
        ) {
          return true; // Include only non-corporate patients
        }
        return false; // Exclude other cases
      }
    );
    //  alert(JSON.stringify(filteredBookingsByPatient));
    filteredBookingsByCorporateType.forEach((booking) => {
      //totalTests += booking.selectedTests.split(",").length;

      totalValue += parseInt(booking.amount);
    });
    const BookingCount = filteredBookingsByCorporateType.length;
    return { BookingCount, totalValue };
  };

  const calculatePatientTotals = () => {
    const patientTotals = {};

    const filteredBookingsByPatient = filteredBookings.filter(
      (booking) => booking.patientId === selectedPatientID
    );

    filteredBookingsByPatient.forEach((booking) => {
      const { patientId, amount, PatientName, PatientPhone } = booking;

      if (patientTotals[patientId]) {
        patientTotals[patientId].totalAmount += parseInt(amount);
      } else {
        patientTotals[patientId] = {
          PatientName,
          totalAmount: parseInt(amount),
          PatientPhone: PatientPhone,
          TotalConsultation: filteredBookingsByPatient.length,
        };
      }
    });

    return patientTotals;
  };
  const calculateAllPatientsTotals = () => {
    const patientTotals = {};
    //alert(JSON.stringify(filteredBookings));
    console.log(JSON.stringify(filteredBookings));
    // Filter the bookings based on the selected corporate type
    const filteredBookingsByCorporateType = filteredBookings.filter(
      (booking) => {
        if (selectedCorporateType === "All") {
          return true; // Include all patients
        } else if (
          selectedCorporateType === "Corporate" &&
          booking.CorporateID !== null
        ) {
          return true; // Include only corporate patients
        } else if (
          selectedCorporateType === "NonCorporate" &&
          booking.CorporateID === null
        ) {
          return true; // Include only non-corporate patients
        }
        return false; // Exclude other cases
      }
    );

    filteredBookingsByCorporateType.forEach((booking) => {
      const { patientId, amount, PatientName, PatientPhone, CorporateID } =
        booking;

      if (selectedCompany) {
        if (CorporateID === selectedCompany) {
          if (patientTotals[patientId]) {
            patientTotals[patientId].totalAmount += parseInt(amount);
            patientTotals[patientId].TotalConsultation += 1; // Increase the consultation count
          } else {
            patientTotals[patientId] = {
              PatientName,
              totalAmount: parseInt(amount),
              PatientPhone,
              TotalConsultation: 1, // Initialize consultation count
            };
          }
        }
        return patientTotals;
      }
      if (patientTotals[patientId]) {
        patientTotals[patientId].totalAmount += parseInt(amount);
        patientTotals[patientId].TotalConsultation += 1; // Increase the consultation count
      } else {
        patientTotals[patientId] = {
          PatientName,
          totalAmount: parseInt(amount),
          PatientPhone,
          TotalConsultation: 1, // Initialize consultation count
        };
      }
    });

    return patientTotals;
  };

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
          Hospital Earnings
        </Button>{" "} */}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/PathologyAnalytics`);
          }}
        >
          Pathology Spends
        </Button>{" "}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/DiagnosticAnalytics`);
          }}
        >
          Diagnostic Spends
        </Button>{" "}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/ConsultationAnalytics`);
          }}
        >
          Consultation Spends
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
        <h2 style={{ fontSize: "18px" }}>Patient Spends(Consultation)</h2>
      </header>
      <br></br>

      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">Select date range:</label>

          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Select corporate type:</label>
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
            <option value="All">All</option>
            <option value="Corporate">Corporate</option>
            <option value="NonCorporate">Non-Corporate</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Select company:</label>
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
            <option value="">All</option>
            {companies.map((company) => (
              <option key={company.id} value={company.registrationNo}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Select patient :</label>
          <select
            style={{
              fontSize: "14px",
            }}
            className="form-select"
            value={selectedPatientID}
            onChange={handlePatientSelect}
          >
            <option value="">All</option>
            {filterPatientsByCorporateType(selectedCorporateType).map(
              (booking) => (
                <option key={booking.patientId} value={booking.patientId}>
                  {booking.PatientName}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <hr />
      {isMobile ? (
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
                Consultation Earnings Summary
              </h2>
            </header>
            <div className="card">
              <div className="card-body text-start">
                <p>
                  Start-End Date:{" "}
                  {`${formatDateString(startDate)} - ${formatDateString(
                    endDate
                  )}`}
                </p>
                <p>Booking Count: {calculateTotalTests().BookingCount}</p>
                <p>
                  Earned Amount: {currencySymbols[selectedGlobalCurrency]}{" "}
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
              <h2 style={{ fontSize: "18px" }}>
                Consultation Earnings Summary
              </h2>
            </header>
            <table style={{ textAlign: "center" }} className="table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Start-End Date</th>
                  <th style={{ textAlign: "center" }}>Booking Count</th>
                  <th style={{ textAlign: "center" }}>Earned Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {`${formatDateString(startDate)} - ${formatDateString(
                      endDate
                    )}`}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {calculateTotalTests().BookingCount}
                  </td>
                  <td style={{ textAlign: "center" }}>
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
            <div>
              <header
                className="header"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h2 style={{ fontSize: "18px" }}>
                  Selected Patient Earnings Detail
                </h2>
              </header>{" "}
              {Object.entries(calculatePatientTotals()).map(
                ([
                  PatientID,
                  { PatientName, totalAmount, TotalConsultation, PatientPhone },
                ]) => (
                  <div className="card mb-3" key={PatientID}>
                    <div className="card-body">
                      <h5 className="card-title">
                        Patient Name: {PatientName}
                      </h5>
                      <p className="card-text">Patient ID: {PatientID}</p>
                      <p className="card-text">
                        Contact Number: {PatientPhone}
                      </p>
                      <p className="card-text">
                        Total Consultation: {TotalConsultation}
                      </p>
                      <p className="card-text">
                        Total Fees:
                        {currencySymbols[selectedGlobalCurrency]}{" "}
                        {convertCurrency(
                          totalAmount,
                          hospitalData.baseCurrency,
                          selectedGlobalCurrency
                        )}
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
                    Selected Patient Earnings Detail
                  </h2>
                </header>{" "}
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>Patient ID</th>
                      <th style={{ textAlign: "center" }}>Patient Name</th>
                      <th style={{ textAlign: "center" }}>Contact Number</th>
                      <th style={{ textAlign: "center" }}>TotalConsultation</th>

                      <th style={{ textAlign: "center" }}>Total Fees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(calculatePatientTotals()).map(
                      ([
                        PatientID,
                        {
                          PatientName,
                          totalAmount,
                          TotalConsultation,
                          PatientPhone,
                        },
                      ]) => (
                        <tr key={PatientID}>
                          <td>{PatientID}</td>
                          <td>{PatientName}</td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {PatientPhone}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {TotalConsultation}
                          </td>
                          <td>
                            {currencySymbols[selectedGlobalCurrency]}{" "}
                            {convertCurrency(
                              totalAmount,
                              hospitalData.baseCurrency,
                              selectedGlobalCurrency
                            )}
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
              <header
                className="header"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h2 style={{ fontSize: "18px" }}>
                  All Patients Consultation Earnings Detail
                </h2>
              </header>{" "}
              {Object.entries(calculateAllPatientsTotals()).map(
                ([
                  PatientID,
                  { PatientName, totalAmount, TotalConsultation, PatientPhone },
                ]) => (
                  <div className="card mb-3" key={PatientID}>
                    <div className="card-body">
                      <h5 className="card-title">
                        Patient Name: {PatientName}
                      </h5>
                      <p className="card-text">Patient ID: {PatientID}</p>
                      <p className="card-text">
                        Contact Number: {PatientPhone}
                      </p>
                      <p className="card-text">
                        Total Consultation: {TotalConsultation}
                      </p>
                      <p className="card-text">
                        Total Fees: {currencySymbols[selectedGlobalCurrency]}{" "}
                        {convertCurrency(
                          totalAmount,
                          hospitalData.baseCurrency,
                          selectedGlobalCurrency
                        )}
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
                    All Patients Consultation Earnings Detail
                  </h2>
                </header>{" "}
                <table
                  style={{ textAlign: "center", whiteSpace: "nowrap" }}
                  className="table"
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>Patient ID</th>
                      <th style={{ textAlign: "center" }}>Patient Name</th>
                      <th style={{ textAlign: "center" }}>Contact Number</th>
                      <th style={{ textAlign: "center" }}>
                        Total Consultation
                      </th>
                      <th style={{ textAlign: "center" }}>Total Fees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(calculateAllPatientsTotals()).map(
                      ([
                        PatientID,
                        {
                          PatientName,
                          totalAmount,
                          TotalConsultation,
                          PatientPhone,
                        },
                      ]) => (
                        <tr key={PatientID}>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {PatientID}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {PatientName}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {PatientPhone}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {TotalConsultation}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {currencySymbols[selectedGlobalCurrency]}{" "}
                            {convertCurrency(
                              totalAmount,
                              hospitalData.baseCurrency,
                              selectedGlobalCurrency
                            )}
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
    </div>
  );
};

export default ConsultationAnalytics;
