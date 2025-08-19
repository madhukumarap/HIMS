import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Col, Table, Form, Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Datepickrange from "./DateRangePickerForReport";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PatientTestHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [normalValues, setNormalValues] = useState([]);

  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedCorporateType, setSelectedCorporateType] = useState("All");
  const navigate = useNavigate();
  const [selectedTestID, setSelectedTestID] = useState(null); // Added for TestName
  const [testNames, setTestNames] = useState([]);
  const [SelectedTestName, setSelectedTestName] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const fieldNames = Object.keys(fetchedData[0] || {});
  const excludedColumns = [
    "TestManagementID",
    "PatientTestBookingID",
    "createdAt",
    "Comment",
    "id",
    "PatientID",
  ];

  // Include "updatedAt" as the first field name
  const fieldNamesWithUpdatedAt = [
    "updatedAt",
    ...fieldNames.filter((fieldName) => fieldName !== "updatedAt"),
  ];

  // Filter out the excluded columns from fieldNames
  const visibleFieldNames = fieldNamesWithUpdatedAt.filter(
    (fieldName) => !excludedColumns.includes(fieldName)
  );
  const formatFieldName = (fieldName) => {
    return fieldName.replace(/_/g, " ");
  };
  useEffect(() => {
    fetchBookings();
    fetchTestNames(); // Added to fetch test names
  }, []);

  const fetchTestNames = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllPathologyTests`)
      .then((response) => {
        setTestNames(response?.data?.tests || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Fetch normal values data
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/testmanagementnormalvalues`)
      .then((response) => {
        setNormalValues(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleTestSelect = (e) => {
    setSelectedTestID(parseInt(e.target.value)); // Parse the value to an integer
    const selectedTest = testNames.find(
      (test) => test.id === parseInt(e.target.value)
    );
    if (selectedTest) {
      setSelectedTestName(selectedTest.testName);
    }
    // alert(selectedTest.testName);
  };

  const fetchBookings = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getallPaitents`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
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

  const handlePatientSelect = (e) => {
    setSelectedPatientID(parseInt(e.target.value)); // Parse the value to an integer
  };

  useEffect(() => {
    if (
      selectedPatientID !== null &&
      selectedTestID !== null &&
      startDate !== "" &&
      endDate !== ""
    ) {
      handleSearch();
    }
  }, [selectedPatientID, selectedTestID, SelectedTestName, startDate, endDate]);
  const handleSearch = () => {
    // Assuming you want to send this data to the backend
    const tablename =
      SelectedTestName?.toLowerCase().replace(/\s+/g, "") + "resultmodels";
    // alert(tablename);
    const requestData = {
      TestManagementID: selectedTestID,
      PatientID: selectedPatientID,
      StartDate: startDate,
      EndDate: endDate,
      TableName: tablename,
    };

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/fetchTestDataForPatients`,
        requestData
      )
      .then((response) => {
        if (response.data.length === 0) {
          toast.error("No results found");
          setFetchedData([]);
        } else {
          toast.success("Result Fetched Successfully");
          setFetchedData(response.data);
          console.log(
            "Result Array for different updatedAt Date: " +
              JSON.stringify(response.data)
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Create a function to transpose the data
  const transposeData = (data) => {
    const transposedData = {};
    data.forEach((item) => {
      Object.keys(item).forEach((fieldName) => {
        if (!transposedData[fieldName]) {
          transposedData[fieldName] = [];
        }
        transposedData[fieldName].push(item[fieldName]);
      });
    });
    return transposedData;
  };
  const transposedData = transposeData(fetchedData);
  const formatDateString = (date) => {
    return date ? date.toLocaleDateString() : "";
  };
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
        <h2 style={{ fontSize: "18px" }}>Patient Test History(Pathology)</h2>
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
          <label className="form-label">Select Patient :</label>
          <select
            style={{
              fontSize: "14px",
            }}
            className="form-select"
            value={selectedPatientID}
            onChange={handlePatientSelect}
          >
            <option value="">Select Patient</option>
            {bookings?.map((booking) => (
              <option key={booking.id} value={booking.id}>
                {booking.mr} {booking.firstName} {booking.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Select Test:</label>
          <select
            style={{
              fontSize: "14px",
            }}
            className="form-select"
            value={selectedTestID}
            onChange={handleTestSelect}
          >
            <option value="">Select Test</option>
            {testNames?.map((test) => (
              <option key={test.id} value={test.id}>
                {test.testName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <hr />
      <div>
        <header
          className="header"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "16px" }}>
            Patient Test History(
            {`${formatDateString(startDate)} - ${formatDateString(endDate)}`})
          </h2>
        </header>
        <br />
        {fetchedData.length > 0 && (
          <Table
            style={{ textAlign: "center", whiteSpace: "nowrap" }}
            striped
            bordered
            hover
          >
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Parameters</th>
                {transposedData[Object.keys(transposedData)[0]]?.map(
                  (value, index) => (
                    <th key={index}>Result {index + 1}</th>
                  )
                )}
                <th style={{ textAlign: "center" }}>Normal Values</th>
              </tr>
            </thead>
            <tbody>
              {visibleFieldNames?.map((fieldName) => (
                <tr key={fieldName}>
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {fieldName === "updatedAt"
                      ? "Result Uploaded Date"
                      : formatFieldName(fieldName)}
                  </td>

                  {transposedData[fieldName]?.map((value, index) => (
                    <td
                      style={{ textAlign: "center", whiteSpace: "nowrap" }}
                      key={index}
                    >
                      {fieldName === "updatedAt"
                        ? new Date(value).toLocaleString()
                        : value}
                    </td>
                  ))}
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {fieldName === "updatedAt"
                      ? "NA"
                      : normalValues
                          .map((item) => {
                            if (item.fieldName === fieldName) {
                              return `${item.minimumRange}-${item.maximumRange} ${item.unitOfMeasurements}`;
                            }
                            return null;
                          })
                          .filter(Boolean)[0] || "NA"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PatientTestHistory;
