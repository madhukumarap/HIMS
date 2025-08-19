import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Datepickrange from "./DateRangePickerForReport";
import { FaRegEye } from "react-icons/fa";

const RevenueForReferralDoctor = () => {
  const [bookings, setBookings] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Pathology");

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

  const [SelectedDoctorID, setSelectedDoctorID] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getDoctorData`)
      .then((response) => {
        const doctorData = response.data;
        setDoctors(doctorData);
      })
      .catch((error) => {
        console.error(error);
      });
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
    setBookings([]);
    if (SelectedDoctorID) {
      fetchBookings();
    }
  }, [
    startDate,
    endDate,
    selectedCorporateType,
    selectedCompany,
    SelectedDoctorID,
    selectedOption,
  ]);

  const fetchBookings = () => {
    // alert(SelectedDoctorID);
    if (selectedOption === "Pathology") {
      //alert("Pathology");
      const url = `${import.meta.env.VITE_API_URL}/api/getAllBookingsTestPathologySelectedDoctorReferral`;
      axios
        .get(url, {
          params: {
            SelectedDoctorID,
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
    } else if (selectedOption === "Diagnostic") {
      //alert("diagnostic");
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
        })
        .then((response) => {
          console.log(response.data);
          setBookings(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
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

  function formatDate2(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div
      style={{
        fontSize: "14px",
      }}
      className="container "
    >
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "18px" }}>Revenue For Referral Doctor</h2>
      </header>
      <br></br>
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">Select Date Range:</label>

          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Select Option:</label>
          <select
            style={{ fontSize: "14px" }}
            className="form-select"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="Pathology">Pathology</option>
            <option value="Diagnostic">Diagnostic</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label"> Corporate Type:</label>
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
          <label className="form-label">Select Company:</label>
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
        <div className="col-md-2">
          <label className="form-label">Select Doctor:</label>
          <select
            style={{ fontSize: "14px" }}
            className="form-select"
            value={SelectedDoctorID}
            onChange={(e) => {
              const selectedDoctor = e.target.value;
              if (selectedDoctor) {
                const selectDoctor = doctors?.find(
                  (doctor) => doctor.id === parseInt(selectedDoctor)
                );
                setSelectedDoctor(selectDoctor);
              }
              if (!selectedDoctor) {
                setSelectedDoctor("");
              }
              // Assuming `selectedDoctor` is an object with `id` property
              setSelectedDoctorID(selectedDoctor);
            }}
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.FirstName} {doctor.LastName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <hr />
      {selectedDoctor && (
        <Card>
          <Card.Header>Earned Revenue for Doctor</Card.Header>
          <Card.Body>
            <Table
              responsive
              style={{ textAlign: "center", whiteSpace: "nowrap" }}
              striped
              bordered
              hover
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>ID</th>
                  <th style={{ textAlign: "center" }}>Doctor Name</th>
                  <th style={{ textAlign: "center" }}>Registration No</th>
                  <th style={{ textAlign: "center" }}>Contact Number</th>
                  <th style={{ textAlign: "center" }}>Patient Count</th>
                  <th style={{ textAlign: "center" }}>Earned Commission</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {selectedDoctor.id}
                  </td>
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    Dr {selectedDoctor.FirstName} {selectedDoctor.LastName}
                  </td>
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {selectedDoctor.registrationNo}
                  </td>
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {selectedDoctor.phoneNo}
                  </td>
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {" "}
                    {bookings.PatientCount}
                  </td>
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    ₹ {bookings.totalCommission}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default RevenueForReferralDoctor;
