import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Col, Table, Form, Button, Card } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Datepickrange from "./DateRangePickerForReport";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import AuthService from "../../services/auth.service";

const PatientTestHistoryAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [normalValues, setNormalValues] = useState([]);
  const currentUser = AuthService.getCurrentUser();

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
  const [selectedPatientName, setSelectedPatientName] = useState("");

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
  const generateCSV = () => {
    const csvData = [];
    const headers = [
      "Test Name",
      "Test Completed Date",
      "Time",
      ...visibleFieldNames
        .filter((fieldName) => fieldName !== "updatedAt")
        .map(formatFieldName),
    ];

    csvData.push(headers);

    transposedData[Object.keys(transposedData)[0]].forEach((_, index) => {
      const row = [
        SelectedTestName,
        ...visibleFieldNames.map((fieldName) => {
          return fieldName === "updatedAt"
            ? new Date(transposedData[fieldName][index]).toLocaleString(
                undefined,
                {
                  dateStyle: "short",
                  timeStyle: "short",
                }
              )
            : transposedData[fieldName][index];
        }),
      ];

      csvData.push(row);
    });

    const csvContent = csvData.map((row) => row.join(",")).join("\n");

    return csvContent;
  };

  const handleDownload = () => {
    if (fetchedData.length === 0) {
      toast.error("No results available to download as CSV");
      return; // Exit the function early
    }
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedPatientName}_results.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const fetchTestNames = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllPathologyTests`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
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
      .get(`${import.meta.env.VITE_API_URL}/api/testmanagementnormalvalues`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
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
      .get(`${import.meta.env.VITE_API_URL}/api/getallPaitents`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
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
    const selectedPatient = bookings.find(
      (booking) => booking.id === parseInt(e.target.value)
    );

    if (selectedPatient) {
      setSelectedPatientName(
        `${selectedPatient.firstName} ${selectedPatient.lastName}`
      );
    }

    setSelectedPatientID(parseInt(e.target.value));
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
        requestData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
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

  const handleDownloadPDF = async () => {
    try {
      if (fetchedData.length === 0) {
        toast.error("No results available to download as PDF");
        return; // Exit the function early
      }

      const hospitalResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      const hospitalData = hospitalResponse.data.data; // Assuming the hospital data is in the 'data' property

      const pdf = new jsPDF();
      pdf.setFontSize(12);

      // Add Hospital Name and Logo
      const hospitalName = hospitalData.hospitalName;
      const hospitalLogoBase64 = hospitalData.logo; // Assuming the logo is provided as a base64 string
      const hospitalAddressLine1 = hospitalData.address;
      const hospitalAddressLine2 = `${hospitalData.pincode}, India`;
      const email = `Mail: ${hospitalData.email}`;
      const landline = `Tel: ${hospitalData.landline}`;
      // Create a new Image object for the hospital logo
      const hospitalLogo = new Image();
      hospitalLogo.src = `data:image/png;base64,${hospitalLogoBase64}`; // Embed the base64 image data

      // Wait for the hospital logo to load before rendering the PDF
      hospitalLogo.onload = function () {
        // Add the hospital logo as an image to the PDF
        pdf.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);

        // Add Hospital Information
        pdf.text(hospitalName, 20, 20);
        pdf.text(hospitalAddressLine1, 20, 30);
        pdf.text(hospitalAddressLine2, 20, 35);
        pdf.text(landline, 20, 40);
        pdf.text(email, 20, 45);
        const hospitalInfoHeight = 60;
        pdf.line(0, 55, 210, 55);
        //patientName
        pdf.setFillColor("#48bcdf");
        const titleText = `Test History for: ${selectedPatientName}`; // Update the title as needed
        const titleHeight = 10;
        pdf.rect(0, 53, pdf.internal.pageSize.getWidth(), titleHeight, "F");
        pdf.setTextColor("#ffffff"); // Set text color to white
        pdf.setFontSize(16); // Adjust font size as needed
        pdf.text(
          titleText,
          pdf.internal.pageSize.getWidth() / 2,
          55 + titleHeight / 2,
          {
            align: "center",
          }
        );
        const tableY = 15 + hospitalInfoHeight;

        // Generate the rest of the PDF content
        pdf.autoTable({
          head: [
            [
              "Sr.No",
              "Test Name",
              "Test Completed Date",
              ...visibleFieldNames
                .filter((fieldName) => fieldName !== "updatedAt")
                .map(formatFieldName),
            ],
          ],

          body: transposedData[Object.keys(transposedData)[0]].map(
            (_, index) => [
              index + 1,
              SelectedTestName,
              ...visibleFieldNames.map((fieldName) =>
                fieldName === "updatedAt"
                  ? new Date(transposedData[fieldName][index]).toLocaleString()
                  : transposedData[fieldName][index]
              ),
            ]
          ),

          startY: tableY,
        });
        pdf.setFillColor("#48bcdf");
        pdf.rect(0, 270, pdf.internal.pageSize.getWidth(), 10, "F");
        pdf.setTextColor("#ffffff");
        //pdf.setTextColor("#000000");
        pdf.setFontSize(12);

        pdf.text(
          "Powered by mediAI",
          pdf.internal.pageSize.getWidth() / 2 - 17,
          277
        );
        // Save the PDF
        pdf.save(`${selectedPatientName}_results.pdf`);
      };
    } catch (error) {
      console.error("Error fetching hospital data:", error);
    }
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
        <div className="col-md-3">
          <Button
            style={{ fontSize: "14px", padding: "4px 5px", marginTop: "30px" }}
            variant="secondary"
            onClick={handleDownload}
          >
            Download as CSV
          </Button>
          <Button
            style={{
              fontSize: "14px",
              padding: "4px 5px",
              marginTop: "30px",
              marginRight: "10px",
            }}
            variant="secondary"
            onClick={handleDownloadPDF}
          >
            Download as PDF
          </Button>
        </div>
      </div>
      <hr />
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
        {isMobile ? (
          <div>
            {" "}
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {transposedData[Object.keys(transposedData)[0]]?.map(
                (_, index) => (
                  <div className="col" key={index}>
                    <Card>
                      <Card.Body>
                        <Card.Title>{SelectedTestName}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          Test Completed Date:{" "}
                          {new Date(
                            transposedData["updatedAt"][index]
                          ).toLocaleString()}
                        </Card.Subtitle>
                        {visibleFieldNames.map(
                          (fieldName) =>
                            fieldName !== "updatedAt" && (
                              <Card.Text key={fieldName}>
                                {formatFieldName(fieldName)}:{" "}
                                {transposedData[fieldName][index]}
                              </Card.Text>
                            )
                        )}
                      </Card.Body>
                    </Card>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <Table
            style={{ textAlign: "center", whiteSpace: "nowrap" }}
            striped
            bordered
            responsive
            hover
          >
            <thead>
              <tr>
                <th
                  rowSpan="2"
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  Sr.No
                </th>
                <th
                  rowSpan="2"
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  Test Name
                </th>
                <th
                  rowSpan="2"
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  Test Completed Date
                </th>
                <th colSpan={visibleFieldNames.length}>Parameters</th>
              </tr>
              <tr>
                {/*               <th style={{ textAlign: "center" }}>Result</th> */}
                {visibleFieldNames.map(
                  (fieldName) =>
                    fieldName !== "updatedAt" && (
                      <th key={fieldName}>{formatFieldName(fieldName)}</th>
                    )
                )}
              </tr>
            </thead>
            <tbody>
              {transposedData[Object.keys(transposedData)[0]]?.map(
                (_, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {index + 1}
                    </td>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {SelectedTestName}
                      {/* Result {index + 1} */}
                    </td>
                    {visibleFieldNames.map((fieldName) => (
                      <td
                        style={{ textAlign: "center", whiteSpace: "nowrap" }}
                        key={fieldName}
                      >
                        {fieldName === "updatedAt"
                          ? new Date(
                              transposedData[fieldName][index]
                            ).toLocaleString()
                          : transposedData[fieldName][index]}
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PatientTestHistoryAdmin;
