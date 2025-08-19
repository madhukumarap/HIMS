import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { Link } from "react-router-dom";

const PrescribedPatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getallPaitents`)
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const filteredPatients = patients.filter((patient) => {
    return patient.phoneNumberP.toString().includes(searchValue);
  });

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleUpdateClick = (id) => {};

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <h1 style={{ fontWeight: "bold" }}>Prescribed Patients List</h1>

      <Form.Group className="col-4" controlId="searchBar">
        <Form.Control
          type="text"
          placeholder="Search by contact number"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>ID</th>
            <th style={{ textAlign: "center" }}>First Name</th>
            <th style={{ textAlign: "center" }}>Last Name</th>
            <th style={{ textAlign: "center" }}>Contact Number</th>
            <th style={{ textAlign: "center" }}>Email ID</th>
            <th style={{ textAlign: "center" }}>Age</th>
            <th style={{ textAlign: "center" }}>Gender</th>
            <th style={{ textAlign: "center" }}>Address</th>
            <th style={{ textAlign: "center" }}>Height</th>
            <th style={{ textAlign: "center" }}>Weight</th>
            <th style={{ textAlign: "center" }}>Social Lifestyle</th>
            <th style={{ textAlign: "center" }}>Food Habits</th>
            <th style={{ textAlign: "center" }}>Registration Date</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.firstName}</td>
              <td>{patient.lastName}</td>
              <td>{patient.contactNumber}</td>
              <td>{patient.emailID}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.address}</td>
              <td>{patient.height}</td>
              <td>{patient.weight}</td>
              <td>{patient.socialLifestyle}</td>
              <td>{patient.foodHabits}</td>
              <td>{patient.registrationDate}</td>
              <td>
                <Link to={`/updatepatient/${patient.id}`}>
                  <button
                    style={{ marginTop: "10px" }}
                    className="btn btn-success"
                  >
                    UpdatePatient
                  </button>
                </Link>
                <Link to={`/OnePatientPrescription/${patient.id}`}>
                  <button
                    style={{ marginTop: "10px", marginLeft: "10px" }}
                    className="btn btn-secondary"
                  >
                    View Prescription
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PrescribedPatientsList;
