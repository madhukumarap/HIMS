import React, { useState, useEffect } from "react";
import { Dropdown, Table, Form, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import AuthService from "../../services/auth.service";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import Datepickrange from "./DateRangePickerForReport";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PatientTrendsReport = () => {
  const currentUser = AuthService.getCurrentUser();

  const [patients, setPatients] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedCorporateType, setSelectedCorporateType] = useState("All");
  const [selectedPatientType, setSelectedPatientType] = useState("");
  const [bookings, setBookings] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("custom");
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  
  const getPreviousMonth = () => {
    const currentDate = new Date();
    const previousDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    return previousDate.toLocaleString("default", { month: "long" });
  };

  const [isMobile, setIsMobile] = useState(false);
  
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 768); // Changed to 768 for better mobile detection
  };

  useEffect(() => {
    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    fetchCompaniesData();
  }, []);

  const fetchCompaniesData = () => {
    axios
            .get(`${import.meta.env.VITE_API_URL}/api/getAllCompanies`,{
        headers: {
          Authorization: currentUser?.Token
        }
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
    fetchPatientsData();
    fetchBookings(selectedPatientType);
  }, [selectedPatientType]);

  const fetchBookings = (patientType) => {
    let url = "";

    switch (patientType) {
      case "Pathology":
        url = `${import.meta.env.VITE_API_URL}/api/getAllBookingsTest`;
        break;
      case "Diagnostic":
        url = `${import.meta.env.VITE_API_URL}/api/getDiagnosticsBooking`;
        break;
      case "Consultation":
        url = `${import.meta.env.VITE_API_URL}/api/getAllDoctorsAppointments`;
        break;
      default:
        url = "";
    }

    if (url) {
      axios
        .get(url)
        .then((response) => {
          if (patientType === "Consultation") {
            setBookings(response.data.appointments);
          } else {
            setBookings(response.data.bookings);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
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
    
    // Set time to beginning of day for start date
    start.setHours(0, 0, 0, 0);
    // Set time to end of day for end date
    today.setHours(23, 59, 59, 999);
    
    setStartDate(start);
    setEndDate(today);
  };

  const formatDateString = (date) => {
    return date ? date.toLocaleDateString() : "";
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      const headers = [
        "Sr.No.",
        "Patient Name",
        "Contact Number",
        "Age(Year)",
        "Gender",
      ];
      const rows = filteredPatients.map((patient, index) => [
        index + 1,
        `${patient.mr} ${patient.firstName} ${patient.middleName} ${patient.lastName}`,
        ` ${patient.phoneNumberP}`,
        `${patient.age}`,
        `${patient.gender}`,
      ]);

      const title = "Patient List";
      const titleX = doc.internal.pageSize.getWidth() / 2;
      doc.setFontSize(16);
      doc.text(title, titleX, 10, { align: "center" });

      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 20,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      });

      doc.save("PatientList.pdf");
    } catch (error) {
      console.error(error);
    }
  };

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
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const corporateOptions = ["All", "Corporate", "Non-Corporate"];

  const periodOptions = [
    { value: "15days", label: "Last 15 Days" },
    { value: "1month", label: "Last 1 Month" },
    { value: "3months", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "1year", label: "Last 1 Year" },
    { value: "custom", label: "Custom Range" },
  ];

  const filteredPatients = patients.filter((patient) => {
    const patientDate = new Date(patient.createdAt);

    // Apply date filter
    const dateInRange = (!startDate || patientDate >= startDate) &&
                       (!endDate || patientDate <= endDate);

    // Apply corporate type filter
    const corporateFilter = selectedCorporateType === "All" ||
      (selectedCorporateType === "Corporate" && patient.CorporateID !== null) ||
      (selectedCorporateType === "Non-Corporate" && patient.CorporateID === null);

    // Apply patient type filter
    let patientTypeFilter = true;
    if (selectedPatientType) {
      switch (selectedPatientType) {
        case "Pathology":
          patientTypeFilter = bookings?.some((booking) => booking.PatientID === patient.id);
          break;
        case "Consultation":
          patientTypeFilter = bookings?.some((booking) => booking.patientId === patient.id);
          break;
        case "Diagnostic":
          patientTypeFilter = bookings?.some((booking) => booking.PatientID === patient.id);
          break;
        default:
          patientTypeFilter = true;
      }
    }

    // Apply company filter
    const companyFilter = selectedCompany === "" || patient.CorporateID === selectedCompany;

    return dateInRange && corporateFilter && patientTypeFilter && companyFilter;
  });

  const corporatePatientsCount = filteredPatients.filter(
    (patient) => patient.CorporateID !== null
  ).length;
  
  const nonCorporatePatientsCount = filteredPatients.filter(
    (patient) => patient.CorporateID === null
  ).length;

  // Data for the pie chart
  const pieChartData = {
    labels: ['Corporate Patients', 'Non-Corporate Patients'],
    datasets: [
      {
        data: [corporatePatientsCount, nonCorporatePatientsCount],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        borderWidth: 2,
        borderColor: '#fff'
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  const totalPatients = corporatePatientsCount + nonCorporatePatientsCount;
  const corporatePercentage = totalPatients > 0 ? (corporatePatientsCount / totalPatients) * 100 : 0;
  const nonCorporatePercentage = totalPatients > 0 ? (nonCorporatePatientsCount / totalPatients) * 100 : 0;

  const getDateRange = (period) => {
    const currentDate = new Date();

    switch (period) {
      case "today":
        return [currentDate, currentDate];
      case "yesterday":
        const yesterday = new Date(currentDate);
        yesterday.setDate(yesterday.getDate() - 1);
        return [yesterday, yesterday];
      case "thisMonth":
        const firstDayOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        return [firstDayOfMonth, currentDate];
      case "lastMonth":
        const lastMonth = new Date(currentDate);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const firstDayOfLastMonth = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth(),
          1
        );
        const lastDayOfLastMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        );
        return [firstDayOfLastMonth, lastDayOfLastMonth];
      default:
        return [null, null];
    }
  };
  
  const countRegisteredPatientsThisYear = () => {
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    const count = patients.filter((patient) => {
      const createdAtDate = new Date(patient.createdAt);
      return createdAtDate >= startDate && createdAtDate <= endDate;
    }).length;

    return count;
  };

  const countRegisteredPatients = (period) => {
    const [startDate, endDate] = getDateRange(period);
    
    if (startDate && endDate) {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const count = patients.filter((patient) => {
        const createdAtDate = new Date(patient.createdAt);
        return createdAtDate >= startDate && createdAtDate <= endDate;
      }).length;
      return count;
    }
    return 0;
  };

  const RegisteredPatientsCard = ({ period, count }) => (
    <Card className="h-100">
      <Card.Body className="text-center">
        <Card.Title style={{ fontSize: "14px", fontWeight: "bold" }}>{period}</Card.Title>
        <Card.Text style={{ fontSize: "16px", color: "#007bff", fontWeight: "bold" }}>
          {count}
        </Card.Text>
      </Card.Body>
    </Card>
  );
  
  const countRegisteredPatientsToday = () => {
    const currentDate = new Date();
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
      0
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      23,
      59,
      59,
      999
    );

    const count = patients.filter((patient) => {
      const createdAtDate = new Date(patient.createdAt);
      return createdAtDate >= startDate && createdAtDate <= endDate;
    }).length;

    return count;
  };

  const todayCount = countRegisteredPatientsToday();
  const yesterdayCount = countRegisteredPatients("yesterday");
  const thisMonthCount = countRegisteredPatients("thisMonth");
  const lastMonthCount = countRegisteredPatients("lastMonth");
  const thisYearCount = countRegisteredPatientsThisYear();
  
  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    return (
      <div className="container text-center mt-5">
        <h3>Access Denied</h3>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }
  
  return (
    <div className="container-fluid">
      <header className="text-center mb-4">
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Patient Trends Report</h2>
      </header>
      
      {/* Quick Stats Cards */}
      <div className="row mb-4">
        <div className="col-12 mb-3">
          <h5 style={{ fontSize: "18px", fontWeight: "bold" }}>Registered Patients Overview</h5>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <RegisteredPatientsCard
            period={`This Year (${selectedYear})`}
            count={thisYearCount}
          />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <RegisteredPatientsCard
            period={`This Month (${currentMonth})`}
            count={thisMonthCount}
          />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <RegisteredPatientsCard
            period={`Last Month (${getPreviousMonth()})`}
            count={lastMonthCount}
          />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <RegisteredPatientsCard
            period={`Today`}
            count={todayCount}
          />
        </div>
      </div>

      {/* Filters Section */}
      <Card className="mb-4">
        <Card.Body>
          <h5 style={{ fontSize: "16px", fontWeight: "bold" }}>Filters</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Time Period:</label>
              <Form.Select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </div>
            
            <div className="col-md-3">
              <label className="form-label">Custom Date Range:</label>
              <Datepickrange
                onSetDate={handleSetDate}
                onClearDate={handleClearDate}
              />
            </div>
            
            <div className="col-md-2">
              <label className="form-label">Corporate Type:</label>
              <Form.Select
                value={selectedCorporateType}
                onChange={(e) => setSelectedCorporateType(e.target.value)}
              >
                {corporateOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </div>
            
            <div className="col-md-2">
              <label className="form-label">Service Type:</label>
              <Form.Select
                value={selectedPatientType}
                onChange={(e) => setSelectedPatientType(e.target.value)}
              >
                <option value="">All Services</option>
                <option value="Consultation">Consultation</option>
                <option value="Pathology">Pathology</option>
                <option value="Diagnostic">Diagnostic</option>
              </Form.Select>
            </div>
            
            <div className="col-md-2">
              <label className="form-label">Company:</label>
              <Form.Select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.registrationNo}>
                    {company.companyName}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {/* Statistics and Graph Section */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title style={{ fontSize: "16px", fontWeight: "bold" }}>
                Patient Distribution Summary
              </Card.Title>
              <div className="row text-center">
                <div className="col-6">
                  <div className="p-3">
                    <h6 style={{ color: '#36A2EB', fontWeight: 'bold' }}>Corporate Patients</h6>
                    <p className="mb-1" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {corporatePatientsCount}
                    </p>
                    <small className="text-muted">
                      {corporatePercentage.toFixed(1)}%
                    </small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3">
                    <h6 style={{ color: '#FF6384', fontWeight: 'bold' }}>Non-Corporate Patients</h6>
                    <p className="mb-1" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {nonCorporatePatientsCount}
                    </p>
                    <small className="text-muted">
                      {nonCorporatePercentage.toFixed(1)}%
                    </small>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <h6 style={{ fontWeight: 'bold' }}>Total Patients: {totalPatients}</h6>
              </div>
            </Card.Body>
          </Card>
        </div>
        
        <div className="col-md-6 mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title style={{ fontSize: "16px", fontWeight: "bold" }}>
                Patient Distribution Chart
              </Card.Title>
              {totalPatients > 0 ? (
                <div style={{ height: "250px", position: 'relative' }}>
                  <Pie
                    data={pieChartData}
                    options={pieChartOptions}
                  />
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No data available for the selected criteria</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
      
      {/* Download Button */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={generatePDF}
              disabled={filteredPatients.length === 0}
            >
              <i className="fas fa-download me-2"></i>
              Download as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="row mb-3">
        <div className="col-12">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0" style={{ fontWeight: 'bold' }}>
                  Results: {filteredPatients.length} patients found
                </h6>
                {startDate && endDate && (
                  <small className="text-muted">
                    Date Range: {formatDateString(startDate)} to {formatDateString(endDate)}
                  </small>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Patients Table */}
      {filteredPatients.length > 0 ? (
        isMobile ? (
          <div className="row">
            {filteredPatients.map((patient, index) => (
              <div className="col-12 mb-3" key={patient.id}>
                <Card>
                  <Card.Body>
                    <h6 className="card-title">
                      {patient.mr} {patient.firstName} {patient.middleName} {patient.lastName}
                    </h6>
                    <p className="card-text mb-1"><small>ID: {patient.id}</small></p>
                    <p className="card-text mb-1"><small>Contact: {patient.phoneNumberP}</small></p>
                    <p className="card-text mb-1"><small>Age: {patient.age} years</small></p>
                    <p className="card-text mb-1"><small>Gender: {patient.gender}</small></p>
                    {selectedCorporateType === "Corporate" && patient.CorporateID && (
                      <p className="card-text mb-0"><small>Corporate ID: {patient.CorporateID}</small></p>
                    )}
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table
                  striped
                  bordered
                  hover
                  className="mb-0"
                  style={{ fontSize: "14px" }}
                >
                  <thead className="table-light">
                    <tr>
                      <th style={{ textAlign: "center" }}>Patient ID</th>
                      <th style={{ textAlign: "center" }}>Patient Name</th>
                      <th style={{ textAlign: "center" }}>Contact Number</th>
                      <th style={{ textAlign: "center" }}>Age (Years)</th>
                      <th style={{ textAlign: "center" }}>Gender</th>
                      {selectedCorporateType === "Corporate" && (
                        <th style={{ textAlign: "center" }}>Corporate ID</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td style={{ textAlign: "center" }}>{patient.id}</td>
                        <td style={{ textAlign: "center" }}>
                          {patient.mr} {patient.firstName} {patient.middleName} {patient.lastName}
                        </td>
                        <td style={{ textAlign: "center" }}>{patient.phoneNumberP}</td>
                        <td style={{ textAlign: "center" }}>{patient.age}</td>
                        <td style={{ textAlign: "center" }}>{patient.gender}</td>
                        {selectedCorporateType === "Corporate" && (
                          <td style={{ textAlign: "center" }}>{patient.CorporateID}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )
      ) : (
        <Card>
          <Card.Body className="text-center py-5">
            <h5 className="text-muted">No patients found</h5>
            <p className="text-muted">Try adjusting your filters to see more results</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default PatientTrendsReport;