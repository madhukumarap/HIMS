import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const PatientsLists = () => {
  const currentUser = AuthService.getCurrentUser();
  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });

  let token = "";
  if (currentUser) {
    token = currentUser.Token;
  }

  const [patients, setPatients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (currentUser) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/getallPaitentsList/${currentUser.email}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((response) => {
          setPatients(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const fullName =
      `${patient.firstName} ${patient.middleName} ${patient.lastName}`.toLowerCase();
    const searchValueLower = searchValue.toLowerCase();

    return (
      (fullName.includes(searchValueLower) ||
        String(patient.phoneNumberP).includes(searchValueLower)) &&
      (startDate === "" || patient.createdAt >= startDate) &&
      (endDate === "" || patient.createdAt <= endDate)
    );
  });

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!currentUser) {
    return <h3>Access Denied</h3>;
  }

  if (currentUser && !currentUser.roles.includes("ROLE_DOCTOR")) {
    // Redirect or show error message when the user is not a doctor
    return <h2>Doctor role is required!</h2>;
    // You can handle the redirection or error message display as per your requirement
  }

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }
  const style = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    fontSize: "13px",
  };

  const h1Style = {
    fontSize: "16px",
  };

  return (
    <Container style={style} className="mt-4 text-center">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>Patients List</h2>
      </header>
      <br />
      <Form>
        <Row>
          <Col sm={3}>
            <Form.Control
              style={{ fontSize: "12px" }}
              type="text"
              placeholder="Search by name or phone number"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </Col>
          <Col sm={5}></Col>
          <Col sm={2}>
            <Form.Control
              style={{ fontSize: "12px" }}
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </Col>
          <Col sm={2}>
            <Form.Control
              style={{ fontSize: "12px" }}
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </Col>
        </Row>
      </Form>
      <br />
      <Table
        style={{
          fontSize: "12px",
          verticalAlign: "middle",
          textAlign: "center",
        }}
        responsive
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>ID</th>
            <th style={{ whiteSpace: "nowrap" }}>Patient Name</th>

            <th style={{ whiteSpace: "nowrap" }}>Contact Number</th>
            <th style={{ textAlign: "center" }}>Gender</th>
            <th style={{ textAlign: "center" }}>Weight</th>
            <th style={{ textAlign: "center" }}>Age</th>
            <th style={{ whiteSpace: "nowrap" }}>Registration Date</th>
            <th style={{ whiteSpace: "nowrap" }}>Patient Doctor</th>
            <th style={{ whiteSpace: "nowrap" }}>Prescription</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient.id}>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {patient.id}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {patient.mr} {patient.firstName} {patient.middleName}{" "}
                {patient.lastName}
              </td>

              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {patient.phoneNumberP}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {patient.gender}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {patient.weight}KG
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {patient.age}Year
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {formatDate(patient.createdAt)}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                Dr. {patient.DFirstName} {patient.DLastName}
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                <Link to={`/PaitentPrescription/${patient.id}`}>
                  <Button
                    style={{
                      fontSize: "12px",
                      marginTop: "0px",
                      marginLeft: "10px",
                      padding: "4px 5px",
                    }}
                    variant="secondary"
                  >
                    Create New
                  </Button>
                </Link>
                <Link to={`/OnePatientPrescription/${patient.id}`}>
                  <Button
                    style={{
                      fontSize: "12px",
                      marginTop: "0px",
                      marginLeft: "10px",
                      padding: "4px 5px",
                    }}
                    variant="secondary"
                  >
                    View Old
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PatientsLists;
