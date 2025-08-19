import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Container, Table } from "react-bootstrap";
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

  // alert(currentUser.Token);

  const [patients, setPatients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
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
          setPatients(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filterPatients = () => {
    return patients.filter((patient) => {
      const registrationDate = new Date(patient.createdAt).getTime();
      const startTimestamp = startDate ? new Date(startDate).getTime() : 0;
      const endTimestamp = endDate
        ? new Date(endDate).getTime()
        : Number.MAX_SAFE_INTEGER;
      return (
        patient.phoneNumberP.toString().includes(searchValue) &&
        registrationDate >= startTimestamp &&
        registrationDate <= endTimestamp
      );
    });
  };

  const sortedPatients = filterPatients().sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!currentUser || !currentUser.roles.includes("ROLE_PHARMACIST")) {
    // If the user is not logged in or does not have the admin role,
    // you can show a message or redirect to another page.
    return <h2>PHARMACIST role is required!</h2>;
  }

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "10px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "14px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "12px" /* Adjust the font size for <h3> */,
  };
  return (
    <Container style={style} className="mt-4 text-center">
      {/* <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Patients List</h1> */}
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>Patients List</h2>
      </header>{" "}
      <br></br>
      <Form.Group className="col-12" controlId="searchBar">
        <div className="row">
          <div className="col-3">
            <strong>{" Search"}</strong>
            <Form.Control
              style={{ fontSize: "10px" }}
              type="text"
              placeholder="Search by contact number"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-5"></div>
          <div className="col-2">
            <strong>Start Date</strong>
            <Form.Control
              style={{ fontSize: "12px" }}
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="col-2">
            <strong>End Date</strong>
            <Form.Control
              style={{ fontSize: "12px" }}
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
      </Form.Group>
      <br></br>
      <Table
        style={{ verticalAlign: "middle", textAlign: "center" }}
        responsive
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>ID</th>
            <th style={{ textAlign: "center" }}>Name</th>

            <th style={{ textAlign: "center" }}>Contact Number</th>
            <th style={{ textAlign: "center" }}>Email</th>
            <th style={{ textAlign: "center" }}>Gender</th>
            <th style={{ textAlign: "center" }}>Weight</th>
            <th style={{ textAlign: "center" }}>Age</th>
            <th style={{ textAlign: "center" }}>Registration Date</th>
            <th style={{ textAlign: "center" }}>Patient Doctor</th>
            {/*               <th style={{ textAlign: "center" }}>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {sortedPatients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>
                {patient.mr} {patient.firstName} {patient.middleName}{" "}
                {patient.lastName}
              </td>

              <td>
                {""}
                {patient.phoneNumberP}
              </td>
              <td>{patient.email}</td>
              <td>{patient.gender}</td>
              <td>{patient.weight}Kg.</td>
              <td>{patient.age}Year</td>
              <td>{formatDate(patient.createdAt)}</td>
              <td>
                Dr. {patient.DFirstName} {patient.DLastName}
              </td>
              {/* <td>
                                <Link to={`/updatepatient/${patient.id}`}>
                                    <button style={{ marginTop: '10px' }} className="btn btn-success">Update Contact's</button>
                                </Link>
                            </td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PatientsLists;
