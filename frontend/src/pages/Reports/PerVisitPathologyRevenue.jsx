import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Datepickrange from "./DateRangePickerForReport";
import { FaRegEye } from "react-icons/fa";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import AuthService from "../../services/auth.service";
import { CurrencyContext } from "../../context/CurrencyProvider";
import { HospitalContext } from "../../context/HospitalDataProvider";
import { currencySymbols } from "../../utils.js";

const PerVisitPathologyRevenue = () => {
  const [bookings, setBookings] = useState([]);
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedCorporateType, setSelectedCorporateType] = useState("All"); // Update initial state
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const currentDate = new Date();
  const [searchValue, setSearchValue] = useState("");

  const [startDate, setStartDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  );

  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  const { hospitalData } = useContext(HospitalContext);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };
  const filteredPatients = bookings.filter((patient) => {
    const fullName = `${patient.PatientName}`.toLowerCase();
    const searchValueLower = searchValue.toLowerCase();
    const createdAt = new Date(patient.createdAt);

    console.log("Phone Number:", patient.PatientPhone);
    console.log("Search Value:", searchValueLower);

    const isNameMatch = fullName.includes(searchValueLower);
    const isPhoneMatch = String(patient.PatientPhoneNo).includes(
      searchValueLower
    );

    console.log("isNameMatch:", isNameMatch);
    console.log("isPhoneMatch:", isPhoneMatch);

    return isNameMatch || isPhoneMatch;
  });

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
          "Content-Type": "application/json",
          Authorization: currentUser?.Token,
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
    setBookings([]);
    fetchBookings();
  }, [startDate, endDate, selectedCorporateType, selectedCompany]);

  const fetchBookings = () => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/getAllBookingsTestPathologyPerVisit`;
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: currentUser?.Token,
        },
        params: {
          startDate,
          endDate,
          selectedCorporateType,
          selectedCompany,
        },
      })
      .then((response) => {
        console.log(response.data);
        setBookings(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSetDate = (start, end) => {
    // alert(start);

    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  //   const filteredBookings = bookings.filter((booking) => {
  //     const bookingDate = new Date(booking.createdAt);
  //     return bookingDate >= startDate && bookingDate <= endDate;
  //   });
  //   useEffect(() => {
  //     // This will run whenever selectedPatientID changes
  //     const filteredBookingsByPatient = filteredBookings.filter(
  //       (booking) => booking.PatientID === selectedPatientID
  //     );
  //   }, [selectedPatientID, filteredBookings]);

  const handlePatientSelect = (e) => {
    setSelectedPatientID(parseInt(e.target.value)); // Parse the value to an integer
  };

  function formatDate2(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

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
            navigate(`/${extractedPart}/PerVisitConsultationEarning`);
          }}
        >
          Consultation
        </Button>{" "}
        <Button
          style={{
            marginTop: "0px",
            height: "30px",
            fontSize: "12px",
            padding: "4px 5px",
          }}
          className="btn btn-secondary mr-2"
          onClick={() => {
            navigate(`/${extractedPart}/PerVisitPathologyRevenue`);
          }}
        >
          Pathology
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
            navigate(`/${extractedPart}/PerVisitDiagnosticRevenue`);
          }}
        >
          Diagnostics
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
        <h2 style={{ fontSize: "18px" }}>
          Patient Per Visit Revenue(Pathology)
        </h2>
      </header>
      <br></br>
      <div className="row mb-3">
        <div className="col-md-3">
          <label
            className="form-label"
            style={{ fontWeight: "bold", fontSize: "12px" }}
          >
            Select date range
          </label>

          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>

        <div className="col-md-3">
          <label
            className="form-label"
            style={{ fontWeight: "bold", fontSize: "12px" }}
          >
            Select corporate type
          </label>
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
          <label
            className="form-label"
            style={{ fontWeight: "bold", fontSize: "12px" }}
          >
            Select company
          </label>
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
            {companies?.map((company) => (
              <option key={company.id} value={company.registrationNo}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <Form.Label style={{ fontWeight: "bold", fontSize: "12px" }}>
            Search by name or phone number
          </Form.Label>
          <Form.Control
            style={{ fontSize: "12px", marginBottom: "10px" }}
            type="text"
            placeholder="Search by name or phone number"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <hr />
      {/* <Row>
        <Col sm={3}>
          <Form.Label style={{ fontWeight: "bold", fontSize: "12px" }}>
            Search by name or phone number
          </Form.Label>
          <Form.Control
            style={{ fontSize: "12px", marginBottom: "10px" }}
            type="text"
            placeholder="Search by name or phone number"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </Col>
      </Row> */}
      <div className="table-responsive">
        <Table
          className="table-striped table-hover table-bordered"
          style={{ textAlign: "center", whiteSpace: "nowrap" }}
          striped
          bordered
          hover
        >
          <Thead>
            <Tr>
              <Th style={{ textAlign: "center" }}>Patient ID</Th>
              <Th style={{ textAlign: "center" }}>Patient Name</Th>

              <Th style={{ textAlign: "center" }}>Contact No</Th>
              <Th style={{ textAlign: "center" }}>Earned Revenue Fees</Th>
              <Th style={{ textAlign: "center" }}>Visit Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPatients.map((booking) => (
              <Tr key={booking.id}>
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {booking.PatientID}
                </Td>
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {booking.PatientName}
                </Td>

                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {booking.PatientPhoneNo}
                </Td>
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {currencySymbols[selectedGlobalCurrency]}{" "}
                  {convertCurrency(
                    booking.testFees,
                    hospitalData.baseCurrency,
                    selectedGlobalCurrency
                  )}
                </Td>
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {new Date(booking.createdAt).toLocaleString()}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};

export default PerVisitPathologyRevenue;
