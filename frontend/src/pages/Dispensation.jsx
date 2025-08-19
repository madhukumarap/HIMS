import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const PatientList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const currentUser = AuthService.getCurrentUser();

  const [fetchStatus, setFetchStatus] = useState("");

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser) {
    return <h3>You are not logged in</h3>;
  }
  if (currentUser && !currentUser.roles.includes("ROLE_PHARMACIST")) {
    // Redirect or show error message when the user is not an admin
    return <h2>Access Denied!</h2>;
    // You can handle the redirection or error message display as per your requirement
  }

  const handleSearch = () => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/getPatientIfNotDispensed?search=${searchQuery}`,
      {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
        setShowResults(true);

        if (data.length > 0) {
          setFetchStatus("success");
          setTimeout(() => {
            setFetchStatus("");
          }, 3000);
        } else {
          setFetchStatus("error");
          setTimeout(() => {
            setFetchStatus("");
          }, 3000);
        }
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
      });
  };

  const handleAddToDispensing = (patient) => {
    // Add code to handle adding the patient to the dispensing form
    console.log("Adding patient to dispensing form:", patient);

    // Remove the patient from the list
    // Remove the patient from the list
    const updatedPatients = patients.filter((p) => p.id !== patient.id);
    setPatients(updatedPatients);
  };

  const isSearchButtonDisabled = searchQuery.length === 0; // Disable button when search query is empty

  const filteredPatients = patients.filter((patient) =>
    patient.PatientName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "10px" /* Adjust the font size as per your requirement */,
    textAlign: "center",
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "20px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "16px" /* Adjust the font size for <h3> */,
  };

  return (
    <div style={style} className="container">
      <div className="row">
        <div style={{ marginLeft: "16%" }} className="col-md-8 offset-md-3">
          <br />
          <br />
          {/* <h2 style={h1Style}>Search Patient To Dispense Medicine</h2> */}
          <header
            className="header"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={h1Style}>Search Patient To Dispense Medicine</h2>
          </header>
          <br></br>
          <div className="row">
            <div className="col-3">
              <input
                style={{ fontSize: "12px" }}
                type="text"
                className="form-control mb-3"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search patients by name"
                required
              />
            </div>
            <div className="col-2">
              <button
                style={{ fontSize: "12px" }}
                className="btn btn-primary bt-sm mt-0"
                onClick={handleSearch}
                disabled={isSearchButtonDisabled}
              >
                Search
              </button>
            </div>
            <div className="col-3">
              {fetchStatus === "success" && (
                <p style={{ color: "green" }}>Patient's fetched successfully</p>
              )}
              {fetchStatus === "error" && (
                <p style={{ color: "red" }}>Patient not found</p>
              )}
            </div>
            <div className="col-2">
              <Link to="/DispensedReportsList">
                <button
                  style={{
                    fontSize: "10px",
                    float: "right",
                    marginTop: "10px",
                    marginLeft: "10px",
                    padding: "5px",
                  }}
                  className="btn btn-primary bt-sm"
                >
                  View Report
                </button>
              </Link>
            </div>
          </div>
          <br></br>
          <div className="col-3">
            <br></br>
            <input
              style={{ fontSize: "12px" }}
              type="text"
              className="form-control"
              value={filterQuery}
              onChange={(event) => setFilterQuery(event.target.value)}
              placeholder="Filter by name"
            />
          </div>

          {showResults && (
            <div className="table-responsive">
              <table className="table mt-4">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Patient Name</th>
                    <th style={{ textAlign: "center" }}>PrescriptionId</th>
                    <th style={{ textAlign: "center" }}>Prescribed Doctor</th>
                    <th style={{ textAlign: "center" }}>ClinicalDiagnosis</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                    {/* Add more columns as needed */}
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.PatientName}</td>
                      <td>{patient.prescriptionId}</td>
                      <td>{patient.PrescribedDoctor}</td>
                      <td>{patient.clinicalDiagnosis}</td>
                      <td>
                        <Link to={`/Dispensation/${patient.id}`}>
                          <button
                            style={{
                              fontSize: "10px",
                              marginTop: "10px",
                              marginLeft: "10px",
                            }}
                            className="btn btn-secondary"
                          >
                            Dispense Medicine
                          </button>
                        </Link>
                      </td>
                      {/* Render additional patient data */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientList;
