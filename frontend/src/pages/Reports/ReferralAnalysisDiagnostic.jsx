import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Col, Form, Button, Card } from "react-bootstrap";
import Datepickrange from "./DateRangePickerForReport";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import AuthService from "../../services/auth.service";

import Translation from "../../translations/ReferralAnalysisPathology.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { CurrencyContext } from "../../context/CurrencyProvider";
import { HospitalContext } from "../../context/HospitalDataProvider";
import { currencySymbols } from "../../utils.js";
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ReferralAnalysisDiagnostics = () => {
  // State variables
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("1month");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedCorporateType, setSelectedCorporateType] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [patientData, setPatientData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [bookings, setBookings] = useState([]);
  const [bookingsObject, setBookingsObject] = useState("");
  const [chartData, setChartData] = useState({});
  const [revenueData, setRevenueData] = useState([]);

  const [isMobile, setIsMobile] = useState(false);
  // Function to check if the screen size is mobile
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  ///

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
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  ///

  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const today = new Date();
    let start = new Date();
    
    switch (period) {
      case "15days":
        start.setDate(today.getDate() - 15);
        break;
      case "1month":
        start.setMonth(today.getMonth() - 1);
        break;
      case "3months":
        start.setMonth(today.getMonth() - 3);
        break;
      case "6months":
        start.setMonth(today.getMonth() - 6);
        break;
      case "1year":
        start.setFullYear(today.getFullYear() - 1);
        break;
      case "custom":
        return;
      default:
        return;
    }
    
    start.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 999);
    
    setStartDate(start);
    setEndDate(today);
  };

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedPeriod("custom");
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
    setSelectedPeriod("custom");
  };

  // Safe currency conversion function
  const safeConvertCurrency = (amount, fromCurrency, toCurrency) => {
    try {
      const converted = convertCurrency(amount, fromCurrency, toCurrency);
      return typeof converted === 'number' ? converted : parseFloat(converted) || 0;
    } catch (error) {
      console.error('Currency conversion error:', error);
      return parseFloat(amount) || 0;
    }
  };

  // Format numbers safely
  const formatNumber = (num) => {
    const number = parseFloat(num);
    return isNaN(number) ? '0.00' : number.toFixed(2);
  };

  const periodOptions = [
    { value: "15days", label: t("Last15Days") },
    { value: "1month", label: t("Last1Month") },
    { value: "3months", label: t("Last3Months") },
    { value: "6months", label: t("Last6Months") },
    { value: "1year", label: t("Last1Year") },
    { value: "custom", label: t("CustomRange") },
  ];

  useEffect(() => {
    setBookings([]);
    setBookingsObject("");
    {
      fetchBookings();
    }
    if (selectedPatient) {
      const selectDoctor = doctors?.find(
        (doctor) => doctor.id === parseInt(selectedPatient)
      );
      setSelectedDoctor(selectDoctor);
    }
  }, [
    startDate,
    endDate,
    selectedCorporateType,
    selectedCompany,
    selectedPatient,
  ]);

  useEffect(() => {
    prepareChartData();
  }, [bookings, selectedPeriod, selectedGlobalCurrency]);

  const fetchBookings = () => {
    const SelectedDoctorID = selectedPatient;

    if (SelectedDoctorID) {
      const url = `${import.meta.env.VITE_API_URL}/api/getAllBookingsTestDiagnosticSelectedDoctorReferral`;
      axios
        .get(url, {
          params: {
            SelectedDoctorID,
            startDate,
            endDate,
            selectedCorporateType,
            selectedCompany,
          },
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        })
        .then((response) => {
          setBookingsObject(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const url = `${import.meta.env.VITE_API_URL}/api/getAllBookingsTestDiagnosticAllDoctorReferral`;
      axios
        .get(url, {
          params: {
            startDate,
            endDate,
            selectedCorporateType,
            selectedCompany,
          },
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        })
        .then((response) => {
          console.log("Data: " + JSON.stringify(response.data));
          setBookings(response.data);
        })
        .catch((error) => {
          alert(error);
          console.error(error);
        });
    }
  };

  // Prepare chart data based on selected period
  const prepareChartData = () => {
    if (!bookings.length) {
      setChartData({
        labels: [],
        datasets: [
          {
            label: `${t('EarnedCommission')} (${currencySymbols[selectedGlobalCurrency]})`,
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
          }
        ]
      });
      return;
    }

    // Group data by doctor for the chart
    const doctorRevenueData = bookings.map(booking => ({
      doctorName: booking.doctorName,
      revenue: safeConvertCurrency(
        booking.earnedCommission || 0,
        hospitalData?.baseCurrency || 'USD',
        selectedGlobalCurrency
      ),
      patientCount: booking.patientCount || 0
    }));

    const labels = doctorRevenueData.map(item => `Dr. ${item.doctorName}`);
    const revenues = doctorRevenueData.map(item => item.revenue);
    const patientCounts = doctorRevenueData.map(item => item.patientCount);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: `${t('EarnedCommission')} (${currencySymbols[selectedGlobalCurrency]})`,
          data: revenues,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          label: t('PatientCount'),
          data: patientCounts,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
          type: 'line'
        }
      ]
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('ReferralRevenueByDoctor')
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: `${t('Revenue')} (${currencySymbols[selectedGlobalCurrency]})`
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: t('PatientCount')
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        title: {
          display: true,
          text: t('Doctors')
        }
      }
    }
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
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getDoctorData`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        const doctorData = response.data;
        setDoctors(doctorData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Data fetching
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const url = `${import.meta.env.VITE_API_URL}/api/getDiagnosticsBooking`;
    axios
      .get(url, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPatientData(response.data.bookings);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Filtered data based on selected filters
  useEffect(() => {
    setFilteredData(
      patientData.filter((patient) => {
        const patientDate = new Date(patient.createdAt);
        return (
          (!startDate || patientDate >= startDate) &&
          (!endDate || patientDate <= endDate) &&
          (selectedCorporateType === "All" ||
            (selectedCorporateType === "Corporate" &&
              patient.CorporateID !== null) ||
            (selectedCorporateType === "Non-Corporate" &&
              patient.CorporateID === null)) &&
          (selectedCorporateType !== "Corporate" ||
            (selectedCorporateType === "Corporate" &&
              patient.CorporateID === selectedCompany))
        );
      })
    );
  }, [
    selectedYear,
    selectedMonth,
    selectedCompany,
    selectedCorporateType,
    patientData,
    startDate,
    endDate,
  ]);

  // Get unique years and months from data
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, index) => currentYear - index);

  const months = Array.from(
    new Set(
      patientData.map((patient) =>
        (new Date(patient.createdAt).getMonth() + 1).toString().padStart(2, "0")
      )
    )
  );
  const countUniquePatients = () => {
    const uniquePatientIds = new Set(
      filteredData.map((patient) => patient.PatientID)
    );
    return uniquePatientIds.size;
  };
  const uniqueDoctors = Array.from(
    new Set(filteredData.map((patient) => patient.doctorId))
  );

  const formatDateString = (date) => {
    return date ? date.toLocaleDateString() : "";
  };

  // Calculate total revenue
  const totalRevenue = bookings.reduce((total, booking) => {
    const revenue = safeConvertCurrency(
      booking.earnedCommission || 0,
      hospitalData?.baseCurrency || 'USD',
      selectedGlobalCurrency
    );
    return total + revenue;
  }, 0);

  // Calculate total patients
  const totalPatients = bookings.reduce((total, booking) => {
    return total + (booking.patientCount || 0);
  }, 0);

  // Calculate average revenue per doctor
  const averageRevenuePerDoctor = bookings.length > 0 
    ? totalRevenue / bookings.length 
    : 0;

  // Check if user has admin access
  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    return (
      <div className="container text-center mt-5">
        <h3>{t('AccessDenied')}</h3>
        <p>{t('NoPermission')}</p>
      </div>
    );
  }

  return (
    <div style={{ fontSize: "14px" }} className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          marginBottom: "10px",
        }}
      >
        <Button
          style={{
            marginTop: "0px",
            height: "30px",
            fontSize: "12px",
            padding: "4px 5px",
          }}
          className="btn btn-secondary mr-2"
          onClick={() => {
            navigate(`/${extractedPart}/ReferralAnalysisPathology`);
          }}
        >
          {t("Pathology")}
        </Button>{" "}
        <button
          style={{
            marginTop: "0px",
            height: "30px",
            fontSize: "12px",
            padding: "4px 5px",
          }}
          className="btn btn-secondary mr-2"
          onClick={() => {
            navigate(`/${extractedPart}/ReferralAnalysisDiagnostic`);
          }}
        >
          {t("Diagnostics")}
        </button>{" "}
      </div>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{t("ReferralAnalysisDiagnostics")}</h2>
      </header>{" "}
      <br></br>

      {/* Filters Section */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">{t("SelectTimePeriod")}</label>
          <select
            className="form-select"
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">{t("SelectDateRange")}</label>
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">{t("SelectCorporateType")}</label>
          <select
            className="form-select"
            value={selectedCorporateType}
            onChange={(e) => setSelectedCorporateType(e.target.value)}
          >
            <option value="All">{t("All")}</option>
            <option value="Corporate">{t("Corporate")}</option>
            <option value="Non-Corporate">{t("NonCorporate")}</option>
          </select>
        </div>

        <div className="col-md-2">
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
            <option value="">{t("SelectCompany")}</option>
            {companies.map((company) => (
              <option key={company.id} value={company.registrationNo}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">{t("SelectReferralDoctor")}:</label>
          <select
            className="form-select"
            value={selectedPatient}
            onChange={(e) => {
              setSelectedPatient(e.target.value);
              if (!e.target.value) {
                setSelectedPatient("");
                setSelectedDoctor("");
              }
            }}
          >
            <option value="">{t("All")}</option>
            {uniqueDoctors.map((doctorId) => (
              <option key={doctorId} value={doctorId}>
                {t("Dr")}{" "}
                {
                  filteredData.find((patient) => patient.doctorId === doctorId)
                    .DoctorName
                }
              </option>
            ))}
          </select>
        </div>
      </div>

      <hr />

      {/* Revenue Summary Cards */}
      {!selectedPatient && (
        <div className="row mb-4">
          <div className="col-md-4">
            <Card className="text-center">
              <Card.Body>
                <Card.Title style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {t('TotalRevenue')}
                </Card.Title>
                <Card.Text style={{ fontSize: "18px", color: "#28a745", fontWeight: "bold" }}>
                  {currencySymbols[selectedGlobalCurrency]} {formatNumber(totalRevenue)}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="text-center">
              <Card.Body>
                <Card.Title style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {t('TotalPatients')}
                </Card.Title>
                <Card.Text style={{ fontSize: "18px", color: "#007bff", fontWeight: "bold" }}>
                  {totalPatients}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="text-center">
              <Card.Body>
                <Card.Title style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {t('AverageRevenuePerDoctor')}
                </Card.Title>
                <Card.Text style={{ fontSize: "18px", color: "#ffc107", fontWeight: "bold" }}>
                  {currencySymbols[selectedGlobalCurrency]} {formatNumber(averageRevenuePerDoctor)}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

      {/* Chart Section */}
      {!selectedPatient && bookings.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <Card>
              <Card.Body>
                <Card.Title style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {t('ReferralRevenueAnalysis')}
                </Card.Title>
                <div style={{ height: "400px", position: 'relative' }}>
                  <Bar 
                    data={chartData} 
                    options={chartOptions}
                  />
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="row mb-3">
        <div className="col-12">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0" style={{ fontWeight: 'bold' }}>
                  {t('Results')}: {bookings.length} {t('doctorsFound')}
                </h6>
                {startDate && endDate && (
                  <small className="text-muted">
                    {t('DateRange')}: {formatDateString(startDate)} {t('to')} {formatDateString(endDate)}
                  </small>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* First Table - Aggregated Data */}
      {!selectedDoctor && (
        <Card>
          <Card.Header>{t("RevenueEarnedByDoctor")}</Card.Header>
          <Card.Body>
            <br></br>
            {isMobile ? (
              {}
            ) : (
              <div className="table-responsive">
                <Table
                  className="table-striped table-bordered"
                  style={{ textAlign: "center", whiteSpace: "nowrap" }}
                  responsive
                  bordered
                  striped
                >
                  <Thead>
                    <Tr>
                      <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {t("StartEndDate")}
                      </Th>
                      <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {t("TotalPatients")}
                      </Th>
                      <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {t("TotalTests")}
                      </Th>
                      <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {t("TotalEarnings")}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {`${formatDateString(startDate)} - ${formatDateString(
                          endDate
                        )}`}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {countUniquePatients()}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {filteredData.reduce((totalTests, patient) => {
                          const tests = patient.selectedTests.split(",");
                          return totalTests + tests.length;
                        }, 0)}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {currencySymbols[selectedGlobalCurrency]}{" "}
                        {formatNumber(safeConvertCurrency(
                          bookings.reduce(
                            (total, booking) =>
                              total + parseFloat(booking.earnedCommission || 0),
                            0
                          ),
                          hospitalData?.baseCurrency || 'USD',
                          selectedGlobalCurrency
                        ))}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      <br></br>
      {selectedDoctor && (
        <Card>
          <Card.Header>{t("RevenueEarnedForDoctor")}</Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table
                className="table-striped table-bordered"
                responsive
                style={{ textAlign: "center", whiteSpace: "nowrap" }}
                striped
                bordered
                hover
              >
                <Thead>
                  <Tr>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("ID")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("DoctorName")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("RegistrationNo")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("ContactNumber")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("PatientCount")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("EarnedCommission")}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {selectedDoctor.id}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      Dr {selectedDoctor.FirstName} {selectedDoctor.LastName}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {selectedDoctor.registrationNo}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {selectedDoctor.phoneNo}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {" "}
                      {bookingsObject?.PatientCount}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {bookingsObject?.totalCommission > 0 &&
                        `${bookingsObject?.totalCommission} USD`}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {!selectedPatient ? (
        <Card>
          <Card.Header>{t("EarnedRevenueForDoctor")}</Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table
                className="table-striped table-bordered"
                responsive
                style={{ textAlign: "center", whiteSpace: "nowrap" }}
                striped
                bordered
                hover
              >
                <Thead>
                  <Tr>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("ID")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("DoctorName")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("RegistrationNo")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("ContactNumber")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("PatientCount")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("EarnedCommission")}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {bookings?.map((booking) => (
                    <Tr key={booking?.doctorId}>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking?.doctorId}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        Dr {booking?.doctorName}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking?.registrationNo}
                      </Td>
                      <Td
                        style={{ textAlign: "center", whiteSpace: "nowrap" }}
                      >{` ${booking?.phoneNo}`}</Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking?.patientCount}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking?.earnedCommission > 0 &&
                          ` ${formatNumber(booking?.earnedCommission)} USD`}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      ) : null}

      {/* Second Table - Individual Patient Data */}
      {selectedPatient && (
        <div>
          <header
            className="header"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "18px" }}>{t("ReferralPatient")}</h2>
          </header>
          <br></br>
          {isMobile ? (
            {}
          ) : (
            <div className="table-responsive">
              <Table
                className="table-striped table-bordered"
                style={{ textAlign: "center", whiteSpace: "nowrap" }}
                responsive
                bordered
                striped
              >
                {" "}
                <Thead>
                  <Tr>
                    <Th style={{ textAlign: "center" }}>{t("SrNo")}</Th>
                    <Th style={{ textAlign: "center" }}>
                      {t("ReferralDoctor")}
                    </Th>
                    <Th style={{ textAlign: "center" }}>{t("PatientName")}</Th>
                    <Th style={{ textAlign: "center" }}>
                      {t("PatientContactNumber")}
                    </Th>
                    <Th style={{ textAlign: "center" }}>{t("CreatedAt")}</Th>
                    <Th style={{ textAlign: "center" }}>{t("CorporateID")}</Th>
                    <Th style={{ textAlign: "center" }}>{t("BookingCount")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.values(
                    filteredData
                      .filter(
                        (patient) =>
                          patient.doctorId === parseInt(selectedPatient)
                      )
                      .reduce((result, patient) => {
                        if (!result[patient.PatientName]) {
                          result[patient.PatientName] = {
                            ...patient,
                            bookingCount: 0,
                            testFees: 0,
                          };
                        }
                        result[patient.PatientName].testFees += parseFloat(
                          patient.testFees.replace(/\.00$/, "")
                        );
                        result[patient.PatientName].bookingCount++;
                        return result;
                      }, {})
                  ).map((patient, index) => (
                    <Tr key={patient.id}>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {index + 1}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        Dr. {patient.DoctorName}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.PatientName}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.PatientPhoneNo}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {formatDateInSelectedLanguage(
                          new Date(patient.createdAt)
                        )}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.CorporateID}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.bookingCount}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralAnalysisDiagnostics;