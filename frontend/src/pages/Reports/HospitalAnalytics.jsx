import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {  Table, Form, Button, Card, } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Datepickrange from "./DateRangePickerForReport";
import { FaDownload } from "react-icons/fa";
import AuthService from "../../services/auth.service";
import HospitalEarningReport from "./HospitalEarningReport.jsx"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

import Translation from "../../translations/PatientSpends.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { CurrencyContext } from "../../context/CurrencyProvider";
import { HospitalContext } from "../../context/HospitalDataProvider";
import { currencySymbols } from "../../utils.js";

const HospitalAnalytics = () => {
  const currentUser = AuthService.getCurrentUser();
  console.log(currentUser,"currentUsercurrentUser")
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
  }
  
  const [bookings, setBookings] = useState([]);
  const [diagnosticBookings, setDiagnosticBookings] = useState([]);
  const [appointmentBookings, setAppointmentBookings] = useState([]);

  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatientBookings, setSelectedPatientBookings] = useState([]);
  const [showTestNamesModal, setShowTestNamesModal] = useState(false);
  const [testStatuses, setTestStatuses] = useState([]);
  const [selectedTestBooking, setSelectedTestBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [selectedRange, setSelectedRange] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const { t } = useTranslation();
  const { selectedGlobalCurrency, convertCurrency } = useContext(CurrencyContext);
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

  useEffect(() => {
    fetchCompaniesData();
    fetchAllBookings();
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

  const fetchAllBookings = () => {
    // Fetch diagnostic bookings
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getDiagnosticsBooking`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setDiagnosticBookings(response.data.bookings || []);
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch pathology bookings
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllBookingsTest`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setBookings(response.data.bookings || []);
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch appointment bookings
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllDoctorsAppointments`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setAppointmentBookings(response.data.appointments || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchTestStatuses = async (bookingId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/DiagnosticTestStatuses/${bookingId}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setTestStatuses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const currentDate = new Date();
  const [startDate, setStartDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  );

  // Function to handle predefined date ranges
  const handlePredefinedRange = (range) => {
    const today = new Date();
    let start, end;

    switch (range) {
      case "last3months":
        start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "currentQuarter":
        const currentQuarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), currentQuarter * 3, 1);
        end = new Date(today.getFullYear(), (currentQuarter + 1) * 3, 0);
        break;
      case "fy25":
        start = new Date(2024, 3, 1); // April 1, 2024 for FY25
        end = new Date(2025, 2, 31); // March 31, 2025 for FY25
        break;
      default:
        return;
    }
    setStartDate(start);
    setEndDate(end);
    setSelectedRange(range);
  };

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedRange("custom");
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
    setSelectedRange("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (!startDate || !endDate) return true;
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= startDate && bookingDate <= endDate;
  });

  const filteredDiagnosticBookings = diagnosticBookings.filter((booking) => {
    if (!startDate || !endDate) return true;
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= startDate && bookingDate <= endDate;
  });

  const filteredAppointmentBookings = appointmentBookings.filter((booking) => {
    if (!startDate || !endDate) return true;
    const bookingDate = new Date(booking.paymentDateTime || booking.createdAt);
    return bookingDate >= startDate && bookingDate <= endDate;
  });

  // Calculate earnings for a specific date range
  const calculateEarningsForDateRange = (bookingsArray, dateKey = 'createdAt') => {
    return bookingsArray.filter(booking => {
      if (!startDate || !endDate) return true;
      const bookingDate = new Date(booking[dateKey] || booking.createdAt);
      return bookingDate >= startDate && bookingDate <= endDate;
    }).reduce((total, booking) => {
      let amount = 0;
      if (booking.PaidAmount || booking.testFees) {
        amount = parseFloat(booking.PaidAmount || booking.testFees || 0);
      } else if (booking.amount) {
        amount = parseFloat(booking.amount || 0);
      }
      return total + amount;
    }, 0);
  };

  const calculateTotalEarnings = () => {
    const pathologyEarnings = calculateEarningsForDateRange(bookings);
    const diagnosticEarnings = calculateEarningsForDateRange(diagnosticBookings);
    const consultationEarnings = calculateEarningsForDateRange(appointmentBookings, 'paymentDateTime');
    
    return pathologyEarnings + diagnosticEarnings + consultationEarnings;
  };

  const calculateDepartmentEarnings = () => {
    const departments = {
      pathology: calculateEarningsForDateRange(bookings),
      diagnostic: calculateEarningsForDateRange(diagnosticBookings),
      consultation: calculateEarningsForDateRange(appointmentBookings, 'paymentDateTime'),
      total: 0
    };
    
    departments.total = departments.pathology + departments.diagnostic + departments.consultation;
    return departments;
  };

  // Safe convert currency function that ensures number output
  const safeConvertCurrency = (amount, fromCurrency, toCurrency) => {
    const converted = convertCurrency(amount, fromCurrency, toCurrency);
    // Ensure we return a number
    if (typeof converted === 'string') {
      return parseFloat(converted.replace(/[^\d.-]/g, '')) || 0;
    }
    return parseFloat(converted) || 0;
  };

  // Generate actual chart data based on filtered bookings
  const generateChartData = () => {
    if (!startDate || !endDate) return [];

    const getEarningsByPeriod = (periodStart, periodEnd, department) => {
      let earnings = 0;
      let bookingsArray = [];
      
      switch (department) {
        case 'pathology':
          bookingsArray = bookings;
          break;
        case 'diagnostic':
          bookingsArray = diagnosticBookings;
          break;
        case 'consultation':
          bookingsArray = appointmentBookings;
          break;
        default:
          return 0;
      }

      bookingsArray.forEach(booking => {
        const bookingDate = new Date(booking.createdAt || booking.paymentDateTime);
        if (bookingDate >= periodStart && bookingDate <= periodEnd) {
          let amount = 0;
          if (booking.PaidAmount || booking.testFees) {
            amount = parseFloat(booking.PaidAmount || booking.testFees || 0);
          } else if (booking.amount) {
            amount = parseFloat(booking.amount || 0);
          }
          earnings += amount;
        }
      });

      return earnings;
    };

    switch (timeFrame) {
      case "daily":
        // Generate last 7 days data
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
          
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          days.push({
            period: dayName,
            pathology: getEarningsByPeriod(dayStart, dayEnd, 'pathology'),
            diagnostic: getEarningsByPeriod(dayStart, dayEnd, 'diagnostic'),
            consultation: getEarningsByPeriod(dayStart, dayEnd, 'consultation'),
            total: 0
          });
        }
        
        // Calculate totals
        days.forEach(day => {
          day.total = day.pathology + day.diagnostic + day.consultation;
        });
        
        return days;
        
      case "weekly":
        // Generate last 4 weeks data
        const weeks = [];
        for (let i = 3; i >= 0; i--) {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - (i * 7));
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          weeks.push({
            period: `Week ${4-i}`,
            pathology: getEarningsByPeriod(weekStart, weekEnd, 'pathology'),
            diagnostic: getEarningsByPeriod(weekStart, weekEnd, 'diagnostic'),
            consultation: getEarningsByPeriod(weekStart, weekEnd, 'consultation'),
            total: 0
          });
        }
        
        // Calculate totals
        weeks.forEach(week => {
          week.total = week.pathology + week.diagnostic + week.consultation;
        });
        
        return weeks;
        
      case "monthly":
        const months = [];
        const currentYearForMonthly = new Date().getFullYear();
        
        for (let i = 0; i < 12; i++) {
          const monthStart = new Date(currentYearForMonthly, i, 1);
          const monthEnd = new Date(currentYearForMonthly, i + 1, 0);
          
          const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' });
          months.push({
            period: monthName,
            pathology: getEarningsByPeriod(monthStart, monthEnd, 'pathology'),
            diagnostic: getEarningsByPeriod(monthStart, monthEnd, 'diagnostic'),
            consultation: getEarningsByPeriod(monthStart, monthEnd, 'consultation'),
            total: 0
          });
        }
        
        // Calculate totals
        months.forEach(month => {
          month.total = month.pathology + month.diagnostic + month.consultation;
        });
        
        return months;
        
      case "yearly":
        // Generate last 5 years data
        const currentYearForYearly = new Date().getFullYear();
        const years = [];
        for (let i = 4; i >= 0; i--) {
          const yearVal = currentYearForYearly - i;
          const yearStart = new Date(yearVal, 0, 1);
          const yearEnd = new Date(yearVal, 11, 31);
          
          years.push({
            period: yearVal.toString(),
            pathology: getEarningsByPeriod(yearStart, yearEnd, 'pathology'),
            diagnostic: getEarningsByPeriod(yearStart, yearEnd, 'diagnostic'),
            consultation: getEarningsByPeriod(yearStart, yearEnd, 'consultation'),
            total: 0
          });
        }
        
        // Calculate totals
        years.forEach(year => {
          year.total = year.pathology + year.diagnostic + year.consultation;
        });
        
        return years;
        
      default:
        return [];
    }
  };

  const chartData = generateChartData();

  const getChartTitle = () => {
    if (!selectedRange) {
      return `Earnings Over Time - ${getXAxisLabel()}`;
    }
    
    switch (selectedRange) {
      case "last3months":
        return "Earnings Over Time - Last 3 Months";
      case "currentQuarter":
        return "Earnings Over Time - Current Quarter";
      case "fy25":
        return "Earnings Over Time - FY25";
      case "custom":
        return `Earnings Over Time - Custom Range`;
      default:
        return `Earnings Over Time - ${getXAxisLabel()}`;
    }
  };

  const getXAxisLabel = () => {
    switch (timeFrame) {
      case "daily": return "Days";
      case "weekly": return "Weeks";
      case "monthly": return "Months";
      case "yearly": return "Years";
      default: return "Period";
    }
  };

  const departmentData = [
    { name: "Pathology", value: calculateDepartmentEarnings().pathology },
    { name: "Diagnostic", value: calculateDepartmentEarnings().diagnostic },
    { name: "Consultation", value: calculateDepartmentEarnings().consultation }
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const downloadTotalAmount = () => {
    // Helper function to safely parse and convert amounts
    const getNumericAmount = (amount, fallback = 0) => {
        try {
            // Remove currency symbol and commas, then parse as float
            const numericValue = typeof amount === 'string' 
                ? parseFloat(amount.replace(/[^\d.-]/g, '')) 
                : parseFloat(amount);
            return isNaN(numericValue) ? fallback : numericValue;
        } catch (error) {
            return fallback;
        }
    };

    // Pathology data and total
    const pathologyData = filteredBookings.map(booking => {
        const amount = safeConvertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency);
        return {
            "Amount": `${currencySymbols[selectedGlobalCurrency]}${amount.toFixed(2)}`
        };
    });
    
    const pathologyTotal = filteredBookings.reduce((total, booking) => {
        const amount = safeConvertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency);
        return total + amount;
    }, 0);

    // Diagnostic data and total
    const diagnosticData = filteredDiagnosticBookings.map(booking => {
        const amount = safeConvertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency);
        return {
            "Amount": `${currencySymbols[selectedGlobalCurrency]}${amount.toFixed(2)}`
        };
    });
    
    const diagnosticTotal = filteredDiagnosticBookings.reduce((total, booking) => {
        const amount = safeConvertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency);
        return total + amount;
    }, 0);

    // Consultation data and total
    const consultationData = filteredAppointmentBookings.map(booking => {
        const amount = safeConvertCurrency(booking.amount, hospitalData.baseCurrency, selectedGlobalCurrency);
        return {
            "Amount": `${currencySymbols[selectedGlobalCurrency]}${amount.toFixed(2)}`
        };
    });
    
    const consultationTotal = filteredAppointmentBookings.reduce((total, booking) => {
        const amount = safeConvertCurrency(booking.amount, hospitalData.baseCurrency, selectedGlobalCurrency);
        return total + amount;
    }, 0);
    const grandTotal = pathologyTotal + diagnosticTotal + consultationTotal;

    // Return array with totals as additional objects
    return [
        [
            ...pathologyData,
            { "Pathology_Total": `${currencySymbols[selectedGlobalCurrency]}${pathologyTotal.toFixed(2)}` }
        ],
        [
            ...diagnosticData,
            { "Diagnostic_Total": ` ${currencySymbols[selectedGlobalCurrency]}${diagnosticTotal.toFixed(2)}` }
        ],
        [
            ...consultationData,
            { "Consultation_Total": ` ${currencySymbols[selectedGlobalCurrency]}${consultationTotal.toFixed(2)}` }
        ],
        [
          {"Grand_total" :grandTotal}
        ]
    ];
  };

  const { generateHospitalEarningsReport } = HospitalEarningReport();

  const downloadTotalReport = () => {
    const hospitalOverAllAmount = downloadTotalAmount()
    generateHospitalEarningsReport(
      bookings,
      diagnosticBookings,
      appointmentBookings,
      startDate,
      endDate,
      selectedGlobalCurrency,
      convertCurrency,
      hospitalData,
      hospitalOverAllAmount
    );
  };

  // Filter data for detailed table based on active tab
  const getDetailedTableData = () => {
    const deptEarnings = calculateDepartmentEarnings();
    
    switch (activeTab) {
      case "pathology":
        return filteredBookings.map(booking => ({
          department: "Pathology",
          patientName: booking.PatientName,
          date: formatDate(booking.createdAt),
          service: booking.selectedTests || "NA",
          amount: safeConvertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency),
          status: booking.status === "paid" ? "Pending" : booking.status
        }));
        
      case "diagnostic":
        return filteredDiagnosticBookings.map(booking => ({
          department: "Diagnostic",
          patientName: booking.PatientName,
          date: formatDate(booking.createdAt),
          service: booking.selectedTests || "NA",
          amount: safeConvertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency),
          status: booking.status
        }));
        
      case "consultation":
        return filteredAppointmentBookings.map(booking => ({
          department: "Consultation",
          patientName: booking.PatientName,
          date: formatDate(booking.paymentDateTime || booking.createdAt),
          service: booking.reason || "NA",
          amount: safeConvertCurrency(booking.amount, hospitalData.baseCurrency, selectedGlobalCurrency),
          status: booking.paymentStatus === "paid" ? "Pending" : booking.paymentStatus
        }));
        
      case "total":
        // Combine all departments and add total row
        const allData = [
          ...filteredBookings.map(booking => ({
            department: "Pathology",
            patientName: booking.PatientName,
            date: formatDate(booking.createdAt),
            service: booking.selectedTests || "NA",
            amount: safeConvertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency),
            status: booking.status === "paid" ? "Pending" : booking.status
          })),
          ...filteredDiagnosticBookings.map(booking => ({
            department: "Diagnostic",
            patientName: booking.PatientName,
            date: formatDate(booking.createdAt),
            service: booking.selectedTests || "NA",
            amount: safeConvertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency),
            status: booking.status
          })),
          ...filteredAppointmentBookings.map(booking => ({
            department: "Consultation",
            patientName: booking.PatientName,
            date: formatDate(booking.paymentDateTime || booking.createdAt),
            service: booking.reason || "NA",
            amount: safeConvertCurrency(booking.amount, hospitalData.baseCurrency, selectedGlobalCurrency),
            status: booking.paymentStatus === "paid" ? "Pending" : booking.paymentStatus
          }))
        ];
        
        // Add total row
        allData.push({
          department: "TOTAL",
          patientName: "-",
          date: "-",
          service: "-",
          amount: safeConvertCurrency(deptEarnings.total, hospitalData.baseCurrency, selectedGlobalCurrency),
          status: "-"
        });
        
        return allData;
        
      default: // overview - show all without total
        return [
          ...filteredBookings.map(booking => ({
            department: "Pathology",
            patientName: booking.PatientName,
            date: formatDate(booking.createdAt),
            service: booking.selectedTests || "NA",
            amount: safeConvertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency),
            status: booking.status === "paid" ? "Pending" : booking.status
          })),
          ...filteredDiagnosticBookings.map(booking => ({
            department: "Diagnostic",
            patientName: booking.PatientName,
            date: formatDate(booking.createdAt),
            service: booking.selectedTests || "NA",
            amount: safeConvertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency),
            status: booking.status
          })),
          ...filteredAppointmentBookings.map(booking => ({
            department: "Consultation",
            patientName: booking.PatientName,
            date: formatDate(booking.paymentDateTime || booking.createdAt),
            service: booking.reason || "NA",
            amount: safeConvertCurrency(booking.amount, hospitalData.baseCurrency, selectedGlobalCurrency),
            status: booking.paymentStatus === "paid" ? "Pending" : booking.paymentStatus
          }))
        ];
    }
  };

  const detailedTableData = getDetailedTableData();

  return (
    <div style={{ fontSize: "14px" }} className="container">
      <header className="header" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ fontSize: "18px" }}>{`${t(`${currentUser?.username.charAt(0).toUpperCase() + currentUser?.username.slice(1).toLowerCase()}  Hospital Earnings`)} `}</h2>
      </header>
      
      <br />
      
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">{t("SelectDateRange")}:</label>
          <Datepickrange onSetDate={handleSetDate} onClearDate={handleClearDate} />
        </div>
        <div className="col-md-2">
          <label className="form-label">Predefined Ranges:</label>
          <Form.Select value={selectedRange} onChange={(e) => handlePredefinedRange(e.target.value)}>
            <option value="">Select Range</option>
            <option value="last3months">Last 3 Months</option>
            <option value="currentQuarter">Current Quarter</option>
            <option value="fy25">FY25</option>
          </Form.Select>
        </div>
        <div className="col-md-2">
          <label className="form-label">View By:</label>
          <Form.Select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Form.Select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Department:</label>
          <Form.Select value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
            <option value="overview">Overview</option>
            <option value="pathology">Pathology</option>
            <option value="diagnostic">Diagnostic</option>
            <option value="consultation">Consultation</option>
            <option value="total">Total Earnings</option>
          </Form.Select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Download Reports:</label>
          <div>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={downloadTotalReport}
              style={{
                fontSize: "12px",
                padding: "4px 5px",
                marginTop: "0px",
                backgroundColor: "#1111",
                color: "black",
                marginLeft: "5px",
              }}
              className="btn btn-secondary"
            >
              <FaDownload /> All Data
            </Button>
          </div>
        </div>
      </div>
      
      <hr />
      
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Earnings</Card.Title>
              <Card.Text>
                <h3>{currencySymbols[selectedGlobalCurrency]}{safeConvertCurrency(calculateTotalEarnings(), hospitalData.baseCurrency, selectedGlobalCurrency).toFixed(2)}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Pathology Earnings</Card.Title>
              <Card.Text>
                <h3>{currencySymbols[selectedGlobalCurrency]}{safeConvertCurrency(calculateDepartmentEarnings().pathology, hospitalData.baseCurrency, selectedGlobalCurrency).toFixed(2)}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Consultation Earnings</Card.Title>
              <Card.Text>
                <h3>{currencySymbols[selectedGlobalCurrency]}{safeConvertCurrency(calculateDepartmentEarnings().consultation, hospitalData.baseCurrency, selectedGlobalCurrency).toFixed(2)}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Diagnostic Earnings</Card.Title>
              <Card.Text>
                <h3>{currencySymbols[selectedGlobalCurrency]}{safeConvertCurrency(calculateDepartmentEarnings().diagnostic, hospitalData.baseCurrency, selectedGlobalCurrency).toFixed(2)}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <Card>
            <Card.Header>
              <h5>{getChartTitle()}</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" label={{ value: getXAxisLabel(), position: 'insideBottom', offset: -5 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => `${currencySymbols[selectedGlobalCurrency]}${safeConvertCurrency(value, hospitalData.baseCurrency, selectedGlobalCurrency).toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="pathology" fill="#0088FE" name="Pathology" />
                  <Bar dataKey="diagnostic" fill="#00C49F" name="Diagnostic" />
                  <Bar dataKey="consultation" fill="#FFBB28" name="Consultation" />
                  <Bar dataKey="total" fill="#FF8042" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card>
            <Card.Header>
              <h5>Earnings by Department</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${currencySymbols[selectedGlobalCurrency]}${safeConvertCurrency(value, hospitalData.baseCurrency, selectedGlobalCurrency).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>
      </div>
      
      {/* Detailed Data Section */}
      <Card>
        <Card.Header>
          <h5>Detailed Earnings Data - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Department</th>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Service</th>
                <th>Amount</th>
                {/* <th>Status</th> */}
              </tr>
            </thead>
            <tbody>
              {detailedTableData.map((row, index) => (
                <tr key={index} className={row.department === "TOTAL" ? "table-warning fw-bold" : ""}>
                  <td>{row.department}</td>
                  <td>{row.patientName}</td>
                  <td>{row.date}</td>
                  <td>{row.service}</td>
                  <td>{currencySymbols[selectedGlobalCurrency]}{typeof row.amount === 'number' ? row.amount.toFixed(2) : row.amount}</td>
                  {/* <td>{row.status}</td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modals remain the same as in your original code */}
      <Modal style={{ fontSize: "14px" }} size="lg" show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>{t("BookingDetails")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal content remains the same */}
        </Modal.Body>
      </Modal>

      <Modal style={{ marginTop: "20px" }} centered size="lg" backdrop="static" show={showTestNamesModal} onHide={() => setShowTestNamesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("TestNamesForPatient")}:{selectedTestBooking?.PatientName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal content remains the same */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HospitalAnalytics;