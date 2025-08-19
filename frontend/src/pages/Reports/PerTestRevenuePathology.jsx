import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Col, Form, Button, Card } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Datepickrange from "./DateRangePickerForReport";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import AuthService from "../../services/auth.service";

const PerTestRevenuePathology = () => {
  const currentUser = AuthService.getCurrentUser();

  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedCorporateType, setSelectedCorporateType] = useState("All");
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTestID, setSelectedTestID] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [allTestsRevenueData, setAllTestsRevenueData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    TestPrice: [],
    datasets: [{ data: [] }],
  });

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
  // Fetch data for all tests when no test is selected
  useEffect(() => {
    if (!selectedTestID) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/getTestCountsAndRevenue`, {
          params: {
            startDate,
            endDate,
            selectedCorporateType,
            selectedCompany,
          },
        })
        .then((response) => {
          setAllTestsRevenueData(response.data);

          // Extract test names and counts for the chart
          const testNames = response.data?.map((test) => test.testName);
          const testCounts = response.data?.map((test) => test.testCount);
          const testPrices = response.data?.map((test) => test.testPrice);

          // Set up chart data
          setChartData({
            labels: testNames || [],
            TestPrice: testPrices,
            datasets: [
              {
                label: "Test Count",
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "rgba(0,0,0,1)",
                borderWidth: 2,
                data: testCounts || [],
              },
            ],
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [
    selectedTestID,
    startDate,
    endDate,
    selectedCorporateType,
    selectedCompany,
  ]);

  const [pathologyTests, setPathologyTests] = useState([]);
  const getTestName = (selectedTestID) => {
    const selectedTest = pathologyTests?.find(
      (test) => test.id === parseInt(selectedTestID)
    );
    return selectedTest;
  };
  useEffect(() => {
    // Fetch all pathology tests
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllPathologyTests`)
      .then((response) => {
        console.log("Test Data" + JSON.stringify(response.data?.tests));
        setPathologyTests(response.data?.tests);
      })
      .catch((error) => {
        console.error("Error fetching pathology tests:", error);
      });
  }, []);
  const [TestassociatedPatients, setTestassociatedPatients] = useState([]);

  const fetchData = () => {
    const selectedTestObject = getTestName(selectedTestID);
    const testName = selectedTestObject?.testName;
    /// alert(JSON.stringify(testName));
    const url = `${import.meta.env.VITE_API_URL}/api/getTestCountsAndRevenue`;

    axios
      .get(url, {
        params: {
          testName,

          startDate,
          endDate,
          selectedCorporateType,
          selectedCompany,
        },
      })
      .then((response) => {
        setTestassociatedPatients(response.data);

        //alert(JSON.stringify(response.data.length));
        // Handle the response from the server
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    if (selectedTestID) {
      fetchData();
    }
  }, [
    selectedTestID,
    startDate,
    endDate,
    selectedCorporateType,
    selectedCompany,
  ]);
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

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

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
            navigate("/PerTestRevenuePathology");
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
            navigate("/PerTestRevenueDiagnostic");
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
        <h2 style={{ fontSize: "18px" }}>Per Test Revenue(Pathology)</h2>
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
        <div className="col-md-3">
          <label className="form-label">Select Corporate Type:</label>
          <select
            style={{
              fontSize: "14px",
            }}
            className="form-select"
            value={selectedCorporateType}
            onChange={(e) => {
              setSelectedCorporateType(e.target.value);
              setSelectedPatientID("");
              //setSelectedCompany("");
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
            {companies.map((company) => (
              <option key={company.id} value={company.registrationNo}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Select a Test Name:</label>
          <select
            style={{ fontSize: "14px" }}
            className="form-select"
            value={selectedTestID}
            onChange={(e) => {
              setSelectedTestID(e.target.value);
            }}
          >
            <option value="">All</option>
            {pathologyTests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.testName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <hr />
      {selectedTestID ? (
        <Card>
          <Card.Header>Selected Test Details</Card.Header>
          <Card.Body>
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
                    <Th style={{ textAlign: "center" }}>Test ID</Th>
                    <Th style={{ textAlign: "center" }}>Test Name</Th>
                    <Th style={{ textAlign: "center" }}>Test Price</Th>
                    <Th style={{ textAlign: "center" }}>Test Complete Count</Th>
                    <Th style={{ textAlign: "center" }}>Total Earning</Th>
                  </Tr>
                </Thead>
                <tbody>
                  <Tr>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {selectedTestID}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {getTestName(selectedTestID)?.testName}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      ₹ {getTestName(selectedTestID)?.testPrice}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {TestassociatedPatients.length}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      ₹{" "}
                      {TestassociatedPatients.length *
                        getTestName(selectedTestID)?.testPrice}
                    </Td>
                  </Tr>
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* /////////////////////////////// */}
          {startDate && endDate && (
            <Card>
              <Card.Header>All Tests Revenue Details (Chart)</Card.Header>
              <Card.Body>
                <div className="chart-container">
                  <BarChart
                    width={isMobile ? 300 : 1000} // Adjust width based on isMobile
                    height={isMobile ? 200 : 400} // Adjust height based on isMobile
                    data={chartData.datasets[0].data.map((count, index) => ({
                      name: chartData.labels[index],
                      count,
                      price: chartData?.TestPrice[index],
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="rgba(75,192,192,1)" />
                    {/* <Bar dataKey="price" fill="rgba(255,99,132,0.6)" /> */}
                  </BarChart>
                </div>
              </Card.Body>
            </Card>
          )}
          <Card>
            <Card.Header>All Tests Revenue Details</Card.Header>
            <Card.Body>
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
                      <Th style={{ textAlign: "center" }}>Test ID</Th>
                      <Th style={{ textAlign: "center" }}>Test Name</Th>
                      <Th style={{ textAlign: "center" }}>Test Price</Th>
                      <Th style={{ textAlign: "center" }}>
                        Test Complete Count
                      </Th>
                      <Th style={{ textAlign: "center" }}>Total Earning</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {allTestsRevenueData.map((testData) => (
                      <Tr key={testData.testId}>
                        <Td
                          style={{ textAlign: "center", whiteSpace: "nowrap" }}
                        >
                          {testData.testId}
                        </Td>
                        <Td
                          style={{ textAlign: "center", whiteSpace: "nowrap" }}
                        >
                          {testData.testName}
                        </Td>
                        <Td
                          style={{ textAlign: "center", whiteSpace: "nowrap" }}
                        >
                          ₹ {testData.testPrice}
                        </Td>
                        <Td
                          style={{ textAlign: "center", whiteSpace: "nowrap" }}
                        >
                          {testData.testCount}
                        </Td>
                        <Td
                          style={{ textAlign: "center", whiteSpace: "nowrap" }}
                        >
                          ₹ {testData.testRevenue}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {/* /////////////////////////////// */}
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default PerTestRevenuePathology;
