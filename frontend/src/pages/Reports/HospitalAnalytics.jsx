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
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
  }
  
  const [bookings, setBookings] = useState([]);
  const [diagnosticBookings, setDiagnosticBookings] = useState([]);
  const [appointmentBookings, setAppointmentBookings] = useState([]);
  // const [selectedPatientID, setSelectedPatientID] = useState(null);
  // const [selectedCorporateType, setSelectedCorporateType] = useState("All");
  // const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPatientBookings, setSelectedPatientBookings] = useState([]);
  const [showTestNamesModal, setShowTestNamesModal] = useState(false);
  const [testStatuses, setTestStatuses] = useState([]);
  const [selectedTestBooking, setSelectedTestBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeFrame, setTimeFrame] = useState("monthly");
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

  const handleViewTestNames = (testBooking) => {
    setSelectedTestBooking(testBooking);
    const bookingId = testBooking.id;
    fetchTestStatuses(bookingId);
    setShowTestNamesModal(true);
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

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleOpenModal = (patientID) => {
    const parsedPatientID = parseInt(patientID, 10);
    const allBookings = [...bookings, ...diagnosticBookings, ...appointmentBookings];
    
    const selectedBookings = allBookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt || booking.paymentDateTime);
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

  const filteredDiagnosticBookings = diagnosticBookings.filter((booking) => {
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= startDate && bookingDate <= endDate;
  });

  const filteredAppointmentBookings = appointmentBookings.filter((booking) => {
    const bookingDate = new Date(booking.paymentDateTime || booking.createdAt);
    return bookingDate >= startDate && bookingDate <= endDate;
  });

  const calculateTotalEarnings = () => {
    let total = 0;
    
    // Pathology earnings
    filteredBookings.forEach(booking => {
      total += parseFloat(booking.PaidAmount || booking.testFees || 0);
    });
    
    // Diagnostic earnings
    filteredDiagnosticBookings.forEach(booking => {
      total += parseFloat(booking.PaidAmount || booking.testFees || 0);
    });
    
    // Appointment earnings
    filteredAppointmentBookings.forEach(booking => {
      total += parseFloat(booking.amount || 0);
    });
    
    return total;
  };

  const calculateDepartmentEarnings = () => {
    const departments = {
      pathology: 0,
      diagnostic: 0,
      consultation: 0
    };
    
    // Pathology earnings
    filteredBookings.forEach(booking => {
      departments.pathology += parseFloat(booking.PaidAmount || booking.testFees || 0);
    });
    
    // Diagnostic earnings
    filteredDiagnosticBookings.forEach(booking => {
      departments.diagnostic += parseFloat(booking.PaidAmount || booking.testFees || 0);
    });
    
    // Consultation earnings
    filteredAppointmentBookings.forEach(booking => {
      departments.consultation += parseFloat(booking.amount || 0);
    });
    
    return departments;
  };

  const generateMonthlyData = () => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    return months.map(month => {
      const monthEarnings = {
        month,
        pathology: Math.floor(Math.random() * 10000),
        diagnostic: Math.floor(Math.random() * 8000),
        consultation: Math.floor(Math.random() * 12000),
        total: 0
      };
      
      monthEarnings.total = monthEarnings.pathology + monthEarnings.diagnostic + monthEarnings.consultation;
      return monthEarnings;
    });
  };

  const monthlyData = generateMonthlyData();

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
        const amount = convertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency);
        return {
            "Amount": `${currencySymbols[selectedGlobalCurrency]}${getNumericAmount(amount).toFixed(2)}`
        };
    });
    
    const pathologyTotal = filteredBookings.reduce((total, booking) => {
        const amount = convertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency);
        return total + getNumericAmount(amount);
    }, 0);

    // Diagnostic data and total
    const diagnosticData = filteredDiagnosticBookings.map(booking => {
        const amount = convertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency);
        return {
            "Amount": `${currencySymbols[selectedGlobalCurrency]}${getNumericAmount(amount).toFixed(2)}`
        };
    });
    
    const diagnosticTotal = filteredDiagnosticBookings.reduce((total, booking) => {
        const amount = convertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency);
        return total + getNumericAmount(amount);
    }, 0);

    // Consultation data and total
    const consultationData = filteredAppointmentBookings.map(booking => {
        const amount = convertCurrency(booking.amount, hospitalData.baseCurrency, selectedGlobalCurrency);
        return {
            "Amount": `${currencySymbols[selectedGlobalCurrency]}${getNumericAmount(amount).toFixed(2)}`
        };
    });
    
    const consultationTotal = filteredAppointmentBookings.reduce((total, booking) => {
        const amount = convertCurrency(booking.amount, hospitalData.baseCurrency, selectedGlobalCurrency);
        return total + getNumericAmount(amount);
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
      console.log("hello donwloada repor",hospitalOverAllAmount)
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

  return (
    <div style={{ fontSize: "14px" }} className="container">
      

      <header className="header" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ fontSize: "18px" }}>{`${t("Hospital Earnings")} `}</h2>
        {/* (${t("HospitalAnalytics")}) */}
      </header>
      
      <br />
      
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">{t("SelectDateRange")}:</label>
          <Datepickrange onSetDate={handleSetDate} onClearDate={handleClearDate} />
        </div>
        <div className="col-md-3">
          <label className="form-label">View By:</label>
          <Form.Select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Form.Select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Department:</label>
          <Form.Select value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
            <option value="overview">Overview</option>
            <option value="pathology">Pathology</option>
            <option value="diagnostic">Diagnostic</option>
            <option value="consultation">Consultation</option>
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
            //   style={}}
            >
              <FaDownload /> All Data
            </Button>
          </div>
        </div>

      </div>
      
      <hr />
      
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>
                Total Earnings
                {/* <Button 
                  variant="link" 
                  size="sm" 
                  onClick={downloadTotalReport}
                  title="Download Total Report"
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
                  <FaDownload />
                </Button> */}
              </Card.Title>
              <Card.Text>
                <h3>{currencySymbols[selectedGlobalCurrency]}{convertCurrency(calculateTotalEarnings(), hospitalData.baseCurrency, selectedGlobalCurrency)}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>
                Pathology Earnings
                {/* <Button 
                  variant="link" 
                  size="sm" 
                  onClick={downloadPathologyReport}
                  title="Download Pathology Report"
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
                  <FaDownload />
                </Button> */}
              </Card.Title>
              <Card.Text>
                <h3>{currencySymbols[selectedGlobalCurrency]}{convertCurrency(calculateDepartmentEarnings().pathology, hospitalData.baseCurrency, selectedGlobalCurrency)}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
         <Card className="text-center">
            <Card.Body>
              <Card.Title>
                Consultation Earnings
                {/* <Button 
                  variant="link" 
                  size="sm" 
                  onClick={downloadConsultationReport}
                  title="Download Consultation Report"
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
                  <FaDownload />
                </Button> */}
              </Card.Title>
              <Card.Text>
                <h3>{currencySymbols[selectedGlobalCurrency]}{convertCurrency(calculateDepartmentEarnings().consultation, hospitalData.baseCurrency, selectedGlobalCurrency)}</h3>
              </Card.Text>
            </Card.Body>
          </Card>

        </div>
        <div className="col-md-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>
                Diagnostic Earnings
                {/* <Button 
                  variant="link" 
                  size="sm" 
                  onClick={downloadDiagnosticReport}
                  title="Download Diagnostic Report"
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
                  <FaDownload />
                </Button> */}
              </Card.Title>
              <Card.Text>
                <h3>{currencySymbols[selectedGlobalCurrency]}{convertCurrency(calculateDepartmentEarnings().diagnostic, hospitalData.baseCurrency, selectedGlobalCurrency)}</h3>
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
              <h5>Earnings Over Time</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${currencySymbols[selectedGlobalCurrency]}${convertCurrency(value, hospitalData.baseCurrency, selectedGlobalCurrency)}`} />
                  <Legend />
                  <Bar dataKey="pathology" fill="#0088FE" name="Pathology" />
                  <Bar dataKey="diagnostic" fill="#00C49F" name="Diagnostic" />
                  <Bar dataKey="consultation" fill="#FFBB28" name="Consultation" />
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
                  <Tooltip formatter={(value) => `${currencySymbols[selectedGlobalCurrency]}${convertCurrency(value, hospitalData.baseCurrency, selectedGlobalCurrency)}`} />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>
      </div>
      
      {/* Detailed Data Section */}
      <Card>
        <Card.Header>
          <h5>Detailed Earnings Data</h5>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={`path-${booking.id}`}>
                  <td>Pathology</td>
                  <td>{booking.PatientName}</td>
                  <td>{formatDate(booking.createdAt)}</td>
                  <td>{booking.selectedTests ?booking.selectedTests :"NA"}</td>
                  <td>{currencySymbols[selectedGlobalCurrency]}{convertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency)}</td>
                  <td>{booking.status ==="paid" ? "Pending" : booking.status}</td>
                </tr>
              ))}
              
              {filteredDiagnosticBookings.map(booking => (
                <tr key={`diag-${booking.id}`}>
                  <td>Diagnostic</td>
                  <td>{booking.PatientName}</td>
                  <td>{formatDate(booking.createdAt)}</td>
                  <td>{booking.selectedTests ?booking.selectedTests :"NA" }</td>
                  <td>{currencySymbols[selectedGlobalCurrency]}{convertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency)}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
              
              {filteredAppointmentBookings.map(booking => (
                <tr key={`appt-${booking.id}`}>
                  <td>Consultation</td>
                  <td>{booking.PatientName}</td>
                  <td>{formatDate(booking.paymentDateTime || booking.createdAt)}</td>
                  <td>{booking.reason ? booking.reason : "NA"}</td>
                  <td>{currencySymbols[selectedGlobalCurrency]}{convertCurrency(booking.amount, hospitalData.baseCurrency, selectedGlobalCurrency)}</td>
                  <td>{booking.paymentStatus ==="paid" ? "Pending" : booking.paymentStatus}</td>
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




  // const downloadPathologyReport = () => {
  //   const reportData = filteredBookings.map(booking => ({
  //     "Patient Name": booking.PatientName,
  //     "Date": formatDate(booking.createdAt),
  //     "Service": booking.selectedTests || "NA",
  //     "Amount": `${currencySymbols[selectedGlobalCurrency]}${convertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency)}`,
  //     "Status": booking.status,
  //     "Department": "Pathology"
  //   }));
    
  //   downloadCSV(reportData, "pathology_earnings_report");
  // };

  // const downloadDiagnosticReport = () => {
  //   const reportData = filteredDiagnosticBookings.map(booking => ({
  //     "Patient Name": booking.PatientName,
  //     "Date": formatDate(booking.createdAt),
  //     "Service": booking.selectedTests || "NA",
  //     "Amount": `${currencySymbols[selectedGlobalCurrency]}${convertCurrency(booking.PaidAmount || booking.testFees, hospitalData.baseCurrency, selectedGlobalCurrency)}`,
  //     "Status": booking.status,
  //     "Department": "Diagnostic"
  //   }));
    
  //   downloadCSV(reportData, "diagnostic_earnings_report");
  // };

  // const downloadConsultationReport = () => {
  //   const reportData = filteredAppointmentBookings.map(booking => ({
  //     "Patient Name": booking.PatientName,
  //     "Date": formatDate(booking.paymentDateTime || booking.createdAt),
  //     "Service": booking.reason || "NA",
  //     "Amount": `${currencySymbols[selectedGlobalCurrency]}${convertCurrency(booking.amount, hospitalData.baseCurrency, selectedGlobalCurrency)}`,
  //     "Status": booking.paymentStatus,
  //     "Department": "Consultation"
  //   }));
    
  //   downloadCSV(reportData, "consultation_earnings_report");
  // };
