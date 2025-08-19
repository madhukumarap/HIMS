import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import Datepickrange from "./DateRangeCalender";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Container,
  Modal,
  Button,
  Form,
  Table,
  Row,
  Col,
} from "react-bootstrap";
import AuthService from "../services/auth.service";

const PharmacyPacientBill = () => {
  const currentUser = AuthService.getCurrentUser();

  const [dispensedReports, setDispensedReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [patient, setPatient] = useState({});

  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getOnePaisentRegPatient/${
            currentUser.phoneNumber
          }`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setPatient(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPatient();
  }, []);

  console.log("patient=", patient);

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  localStorage.setItem("sidebarClose", "0");

  useEffect(() => {
    fetchDispensedReports();
  }, []);

  const fetchDispensedReports = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/findAllDispensedList`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      ); // Replace with your API endpoint
      setDispensedReports(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataAndDownloadPDF = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/findAllDispensedList`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      ); // Replace with your API endpoint
      const dispensedReports = response.data;

      // Create a new PDF document
      const doc = new jsPDF();

      // Define the table headers
      const headers = [
        "ID",
        "Patient Name",
        "Dispense ID",
        "Prescription ID",
        "Prescription Date",
        "Dispensed Date",
        "Total Medicine Amount",
      ];

      // Define the table rows
      const rows = dispensedReports.map((report) => [
        report.id,
        report.PatientName,
        report.DispenseID,
        report.PrescriptionID,
        formatDate(report.PrescriptionDate),
        formatDate(report.createdAt),
        ` ${report.totalMedicineAmount}INR`,
      ]);

      // Set the table position and style
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

      // Add the table to the PDF document
      const title = "Dispensed Reports List";
      const titleX = doc.internal.pageSize.getWidth() / 2;
      doc.setFontSize(16);
      doc.text(title, titleX, 10, { align: "center" });

      doc.autoTable(headers, rows, tableOptions);

      // Save the PDF document
      doc.save("dispensed_reports.pdf");
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filteredReports = dispensedReports.filter(
    (report) =>
      report.PatientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (startDate === "" || new Date(report.createdAt) >= startDate) &&
      (endDate === "" || new Date(report.createdAt) <= endDate)
  );

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
    return "Access Denied";
  }
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_PATIENT")
    // &&
    // !currentUser.roles.includes("ROLE_PHARMACIST")
  ) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return "Access Denied";
    // You can handle the redirection or error message display as per your requirement
  }

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "14px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "13px" /* Adjust the font size for <h3> */,
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );
  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleViewImage = (imageSrc) => {
    setSelectedImageSrc(imageSrc);
    console.log(selectedImageSrc);
    setShowImageModal(true);
  };
  const handleClose = () => {
    setShowImageModal(false);
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = selectedImageSrc;
    link.download = "prescription_image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container style={style} className="mt-3">
      {/* <h2 style={h1Style} className="my-4 text-center">Dispensed Reports List</h2> */}
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>Dispensed Reports List</h2>
      </header>{" "}
      <br></br>
      {/* <Row>
    <Col className="col-3">
     <Form.Group controlId="searchForm">
      <Form.Label style={{ fontWeight: "bold", marginBottom: "8px" }}>
       Search by Patient Name
      </Form.Label>
      <Form.Control
       style={{ fontSize: "12px" }}
       type="text"
       placeholder="Search by Patient Name"
       value={searchTerm}
       onChange={handleSearch}
      />
     </Form.Group>
    </Col>
    <Col className="col-1"></Col>

    <Col className="col-2" sm={2}>
     <Datepickrange
      onSetDate={handleSetDate}
      onClearDate={handleClearDate}
     />
    </Col>
    <Col className="col-4"></Col>
    <Col className="col-2">
     <button
      style={{
       fontSize: "12px",
       marginTop: "25px",
       marginLeft: "0px",
       padding: "4px 5px",
      }}
      className="btn btn-secondary"
      onClick={fetchDataAndDownloadPDF}
     >
      Download PDF
     </button>
    </Col>
   </Row> */}
      <br />
      <Table
        style={{ verticalAlign: "middle", textAlign: "center" }}
        responsive
        bordered
        hover
      >
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Sr.No.</th>
            <th style={{ whiteSpace: "nowrap" }}>Patient Name</th>
            <th style={{ textAlign: "center" }}>Dispense ID</th>
            <th style={{ textAlign: "center" }}>Prescription ID</th>
            <th style={{ whiteSpace: "nowrap" }}>Prescription Date</th>
            <th style={{ whiteSpace: "nowrap" }}>Registration Date</th>
            <th style={{ whiteSpace: "nowrap" }}>Total Medicine Amount</th>
            <th style={{ whiteSpace: "nowrap" }}>Prescription Type</th>
            <th style={{ whiteSpace: "nowrap" }}>Prescription Image</th>
            <th style={{ textAlign: "center" }}>View</th>
          </tr>
        </thead>
        <tbody>
          {console.log("reports=", dispensedReports)}
          {dispensedReports.map((report, index) => {
            console.log(
              ` patient Id= ${patient.id} reportId= ${report.patient_Id}`
            );
            if (+patient.id === report.patient_Id) {
              return (
                <tr key={report.id}>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {index + 1 + (currentPage - 1) * reportsPerPage}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {report.PatientName}
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {report.DispenseID}
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {report.PrescriptionID}
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {formatDate(report.PrescriptionDate)}
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {formatDate(report.createdAt)}
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    <strong>
                      <span>&#8377;</span> {report.totalMedicineAmount}
                    </strong>
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {report.PrescriptionType}
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {report.prescriptionImage ? (
                      <button
                        title="View Image"
                        style={{
                          whiteSpace: "nowrap",
                          fontSize: "12px",
                          padding: "4px 5px",
                          marginTop: "10px",
                          marginLeft: "10px",
                          padding: "4px 5px",
                        }}
                        className="btn btn-secondary"
                        onClick={() =>
                          handleViewImage(report.prescriptionImage)
                        }
                      >
                        <FaRegEye />
                      </button>
                    ) : (
                      "NA"
                    )}
                  </td>

                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    <Link
                      to={`/dispensedPatient/${report.id}/${report.prescription_Id}`}
                    >
                      <button
                        title="View Bill"
                        style={{
                          whiteSpace: "nowrap",
                          fontSize: "12px",
                          marginTop: "10px",
                          marginLeft: "10px",
                          padding: "4px 5px",
                        }}
                        className="btn btn-secondary"
                      >
                        <FaRegEye />
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </Table>
      <Modal show={showImageModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "12px" }}>
            Prescription Image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={`data:image/png;base64,${selectedImageSrc}`}
            alt="Prescription"
            style={{ width: "100%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={handleClose}
          >
            Close
          </Button>
          {/* <Button variant="secondary" onClick={handleDownloadImage}>
            Download
          </Button> */}
        </Modal.Footer>
      </Modal>
      <br></br>
      <br></br>
    </Container>
  );
};

export default PharmacyPacientBill;
