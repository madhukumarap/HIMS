import React, { useState, useEffect } from "react";
import { Dropdown, Table, Form, Card } from "react-bootstrap";
import axios from "axios";
import AuthService from "../../services/auth.service";
import { Pie } from "react-chartjs-2";
import { PieChart } from "react-minimal-pie-chart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Datepickrange from "./DateRangePickerForReport";

const PatientTrendsReport = () => {
  const currentUser = AuthService.getCurrentUser();

  const [patients, setPatients] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedCorporateType, setSelectedCorporateType] = useState("All");
  const [selectedPatientType, setSelectedPatientType] = useState("");
  const [bookings, setBookings] = useState([]);
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
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    fetchCompaniesData();
  }, []);

  const fetchCompaniesData = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllCompanies`)
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
            //   alert(JSON.stringify(response.data.appointments));
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
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
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

      const title = "Patient List";
      const titleX = doc.internal.pageSize.getWidth() / 2;
      doc.setFontSize(16);
      doc.text(title, titleX, 10, { align: "center" });

      doc.autoTable(headers, rows, tableOptions);

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

  const years = Array.from(
    { length: new Date().getFullYear() - 2000 + 1 },
    (_, i) => 2000 + i
  );

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const corporateOptions = ["All", "Corporate", "Non-Corporate"];

  const filteredPatients = patients.filter((patient) => {
    const patientDate = new Date(patient.createdAt);

    return (
      (!startDate || patientDate >= startDate) &&
      (!endDate || patientDate <= endDate) &&
      (selectedCorporateType === "All" ||
        (selectedCorporateType === "Corporate" &&
          patient.CorporateID !== null) ||
        (selectedCorporateType === "Non-Corporate" &&
          patient.CorporateID === null)) &&
      (selectedPatientType === "" ||
        (selectedPatientType === "Pathology" &&
          bookings?.some((booking) => booking.PatientID === patient.id)) ||
        (selectedPatientType === "Consultation" &&
          bookings?.some((booking) => booking.patientId === patient.id)) ||
        (selectedPatientType === "Diagnostic" &&
          bookings?.some((booking) => booking.PatientID === patient.id))) &&
      (selectedCompany === "" || patient.CorporateID === selectedCompany)
    );
  });

  const corporatePatientsCount = filteredPatients.filter(
    (patient) => patient.CorporateID !== null
  ).length;
  const nonCorporatePatientsCount = filteredPatients.filter(
    (patient) => patient.CorporateID === null
  ).length;

  const data = [
    {
      value: corporatePatientsCount,
      color: "#E38627",
      title: "Corporate Patients",
    },
    {
      value: nonCorporatePatientsCount,
      color: "#C13C37",
      title: "Non-Corporate Patients",
    },
  ];

  const totalPatients = corporatePatientsCount + nonCorporatePatientsCount;
  const corporatePercentage = (corporatePatientsCount / totalPatients) * 100;
  const nonCorporatePercentage =
    (nonCorporatePatientsCount / totalPatients) * 100;

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

  // Function to count registered patients within a date range
  const countRegisteredPatients = (period) => {
    const [startDate, endDate] = getDateRange(period);
    // alert(startDate);
    if (startDate && endDate) {
      startDate.setHours(0, 1, 0, 0);

      // Set end date time to 11:59 PM
      endDate.setHours(23, 59, 59, 999);

      const count = patients.filter((patient) => {
        const createdAtDate = new Date(patient.createdAt);
        const isToday = createdAtDate >= startDate && createdAtDate <= endDate;

        return isToday;
      }).length;
      return count;
    }
    return 0;
  };

  // Create a card component to display the counts
  const RegisteredPatientsCard = ({ period, count }) => (
    <Card>
      <Card.Body>
        <Card.Title style={{ fontSize: "14px" }}>{period} </Card.Title>
        <Card.Text style={{ fontSize: "14px" }}>Count: {count}</Card.Text>
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

  // Use the RegisteredPatientsCard component to display the counts
  const todayCount = countRegisteredPatientsToday();
  const yesterdayCount = countRegisteredPatients("yesterday");
  const thisMonthCount = countRegisteredPatients("thisMonth");
  const lastMonthCount = countRegisteredPatients("lastMonth");
  const thisYearCount = countRegisteredPatientsThisYear();
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
    <div className="container">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "18px" }}>Patient Trends </h2>
      </header>
      <br></br>
      <div className="row mb-3">
        <label style={{ fontSize: "18px" }} className="form-label">
          Registered Patients:
        </label>

        <div className="col-md-3">
          <RegisteredPatientsCard
            period={`This Year (${selectedYear})`}
            count={thisYearCount}
          />
        </div>
        <div className="col-md-3">
          <RegisteredPatientsCard
            period={`This Month (${currentMonth})`}
            count={thisMonthCount}
          />
        </div>
        <div className="col-md-3">
          <RegisteredPatientsCard
            period={`last Month (${getPreviousMonth()})`}
            count={lastMonthCount}
          />
        </div>
        <div className="col-md-3">
          <RegisteredPatientsCard
            period={`Today (${new Date()
              .toDateString()
              .split(" ")
              .slice(1)
              .join(" ")})`}
            count={todayCount}
          />
        </div>
      </div>

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

          <Form.Select
            aria-label="Select Corporate Type"
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
        <div className="col-md-3">
          <label className="form-label">Select booking type:</label>

          <Form.Select
            aria-label="Select Patient Type"
            value={selectedPatientType}
            onChange={(e) => setSelectedPatientType(e.target.value)}
          >
            <option value="">All</option>

            <option value="Consultation">Consultation Patients</option>
            <option value="Pathology">Pathology Patients</option>
            <option value="Diagnostic">Diagnostic Patients</option>
          </Form.Select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Select company:</label>
          <Form.Select
            aria-label="Select Company"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">All</option>
            {companies.map((company) => (
              <option key={company.id} value={company.registrationNo}>
                {company.companyName}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>
      <hr />
      {selectedCorporateType === "All" && selectedPatientType === "" && (
        <div className="row">
          <div className="col-md-6">
            <Card style={{ width: "100%" }}>
              <Card.Body>
                <div className="row">
                  <div className="col-md-6">
                    <Card.Title style={{ fontSize: "16px" }}>
                      Corporate Patients
                    </Card.Title>
                    <Card.Text>Count: {corporatePatientsCount}</Card.Text>
                  </div>
                  <div className="col-md-6">
                    <Card.Title style={{ fontSize: "16px" }}>
                      Non-Corporate Patients
                    </Card.Title>
                    <Card.Text>Count: {nonCorporatePatientsCount}</Card.Text>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6">
            <div
              style={{
                marginTop: "50px",
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1rem",
              }}
            >
              <button
                style={{ fontSize: "14px" }}
                className="btn btn-secondary mr-2"
                onClick={generatePDF}
              >
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      )}
      <br></br>
      {isMobile ? (
        <div className="row">
          {filteredPatients.map((patient, index) => (
            <div className="col-md-6 col-12 mb-3" key={patient.id}>
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">
                    {" "}
                    Patient Name: {patient.mr} {patient.firstName}{" "}
                    {patient.middleName} {patient.lastName}
                  </h5>
                  <p className="card-text">Patient ID: {patient.id}</p>
                  <p className="card-text">
                    Contact Number: {patient.phoneNumberP}
                  </p>
                  <p className="card-text">Age (Years): {patient.age}</p>
                  <p className="card-text">Gender: {patient.gender}</p>
                  {selectedCorporateType === "Corporate" && (
                    <p className="card-text">
                      Corporate ID: {patient.CorporateID}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table
          style={{
            fontSize: "14px",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
          striped
          bordered
          hover
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>Patient ID</th>
              <th style={{ textAlign: "center" }}>Patient Name</th>
              <th style={{ textAlign: "center" }}> Contact Number</th>
              <th style={{ textAlign: "center" }}> Age(Years)</th>
              <th style={{ textAlign: "center" }}> Gender</th>
              {selectedCorporateType === "Corporate" && (
                <th style={{ textAlign: "center" }}>Corporate ID</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {patient.id}
                </td>
                <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {patient.mr} {patient.firstName} {patient.middleName}{" "}
                  {patient.lastName}
                </td>
                <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {patient.phoneNumberP}
                </td>
                <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {" "}
                  {patient.age}
                </td>
                <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {" "}
                  {patient.gender}
                </td>
                {selectedCorporateType === "Corporate" && (
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {patient.CorporateID}
                  </td>
                )}{" "}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PatientTrendsReport;
