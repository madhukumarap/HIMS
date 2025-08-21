import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios";
import {
  Table,
  Card,
  Container,
  Row,
  Col,
  Modal,
  Button,
} from "react-bootstrap";
import {
  FaRegEye,
  FaPencilAlt,
  FaTrashAlt,
  FaTimes,
  FaDownload,
} from "react-icons/fa";
import DownloadDoctorEarningsReport from "./DownloadDoctorEarningsReport";

const ShowDoctorList = () => {
  const currentUser = AuthService.getCurrentUser();
  const [doctorList, setDoctorList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDoctorName, setSelectedDoctorName] = useState("");
  const [selectedDoctorFee, setSelectedDoctorFee] = useState(0);
  const [selectedDoctorCurrency, setSelectedDoctorCurrency] = useState("INR");
  const [doctorPatients, setDoctorPatients] = useState([]);
  const [totalConsultationFees, setTotalConsultationFees] = useState(0);
  const [doctorEarnings, setDoctorEarnings] = useState(0);

  useEffect(() => {
    fetchDoctorList();
    fetchAllDoctorsAppointments();
  }, []);

  const fetchAllDoctorsAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllDoctorsAppointments`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setPatients(response.data.appointments);
    } catch (error) {
      console.log("Error fetching doctor list:", error);
    }
  };

  const fetchDoctorList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDoctors`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setDoctorList(response.data);
    } catch (error) {
      console.log("Error fetching doctor list:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewPatients = (
    doctorId,
    doctorName,
    consultationFee,
    consultationCurrency
  ) => {
    setSelectedDoctorId(doctorId);
    setSelectedDoctorName(doctorName);
    setSelectedDoctorFee(parseFloat(consultationFee) || 0);
    setSelectedDoctorCurrency(consultationCurrency || "INR");

    // Filter patients by doctorId
    const filteredPatients = patients.filter(
      (patient) => patient.doctorId === doctorId
    );
    setDoctorPatients(filteredPatients);

    // Calculate total amount paid by patients
    const totalPatientFees = filteredPatients.reduce((sum, patient) => {
      return sum + (parseFloat(patient.amount) || 0);
    }, 0);
    setTotalConsultationFees(totalPatientFees);

    // Calculate doctor's earnings (consultation fee per patient)
    const doctorTotalEarnings = filteredPatients.reduce((sum, patient) => {
      return sum + (parseFloat(consultationFee) || 0);
    }, 0);
    setDoctorEarnings(doctorTotalEarnings);

    setShowPatientModal(true);
  };

  const handleClosePatientModal = () => {
    setShowPatientModal(false);
    setDoctorPatients([]);
    setTotalConsultationFees(0);
    setDoctorEarnings(0);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}> Doctors List</h2>
      </header>
      <Container fluid className="mt-4">
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                <Table
                  style={{ textAlign: "center" }}
                  striped
                  bordered
                  hover
                  responsive
                >
                  <thead>
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>Sr. No</th>
                      <th style={{ whiteSpace: "nowrap" }}>Name</th>
                      <th style={{ whiteSpace: "nowrap" }}>Email</th>
                      <th style={{ whiteSpace: "nowrap" }}>Phone No</th>
                      <th style={{ whiteSpace: "nowrap" }}>Registration No</th>
                      <th style={{ whiteSpace: "nowrap" }}>Address</th>
                      <th style={{ whiteSpace: "nowrap" }}>Consultation Fee</th>
                      <th style={{ whiteSpace: "nowrap" }}>
                        Registration Date
                      </th>
                      <th style={{ whiteSpace: "nowrap" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorList.map((doctor, index) => (
                      <tr key={doctor.id}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {doctor.Dr} {doctor.FirstName} {doctor.MiddleName}{" "}
                          {doctor.LastName}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>{doctor.email}</td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {doctor.countryCode} {doctor.phoneNo}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {doctor.registrationNo}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {doctor.address}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {doctor.consultationFee} {doctor.consultationCurrency}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {formatDate(doctor.createdAt)}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <button
                              title="View Patient Consultations"
                              style={{
                                fontSize: "12px",
                                padding: "4px 5px",
                                marginTop: "0px",
                                backgroundColor: "#1111",
                                color: "black",
                              }}
                              className="btn btn-secondary"
                              onClick={() =>
                                handleViewPatients(
                                  doctor.id,
                                  `${doctor.Dr} ${doctor.FirstName} ${doctor.MiddleName} ${doctor.LastName}`,
                                  doctor.consultationFee,
                                  doctor.consultationCurrency
                                )
                              }
                            >
                              <FaRegEye />
                            </button>

                            {/* FIX: directly render the component */}
                            <DownloadDoctorEarningsReport
                              doctor={{
                                id: doctor.id,
                                FirstName: doctor.FirstName,
                                MiddleName: doctor.MiddleName,
                                LastName: doctor.LastName,
                                email: doctor.email,
                                phoneNo: doctor.phoneNo,
                                countryCode: doctor.countryCode,
                                registrationNo: doctor.registrationNo,
                                consultationFee: doctor.consultationFee,
                                consultationCurrency:
                                  doctor.consultationCurrency,
                              }}
                              patients={patients.filter(
                                (p) => p.doctorId === doctor.id
                              )}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Large Patient Consultation Modal */}
      <Modal
        backdrop="static"
        size="xl"
        style={{ marginTop: "20px" }}
        centered
        show={showPatientModal}
        onHide={handleClosePatientModal}
        dialogClassName="modal-90w"
      >
        <Modal.Header
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <Modal.Title style={{ fontSize: "18px", fontWeight: "bold" }}>
            Patient Consultations for Dr. {selectedDoctorName}
          </Modal.Title>
          <Button
            variant="light"
            onClick={handleClosePatientModal}
            style={{ padding: "0.25rem 0.5rem" }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {doctorPatients.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "white",
                  zIndex: 1,
                }}
              >
                <tr>
                  <th>Sr. No</th>
                  <th>Patient Name</th>
                  <th>Phone</th>
                  <th>Visit Type</th>
                  <th>Reason</th>
                  <th>Amount Paid</th>
                  <th>Payment Status</th>
                  <th>Consultation Date</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {doctorPatients.map((patient, index) => (
                  <tr key={patient.id}>
                    <td>{index + 1}</td>
                    <td>{patient.PatientName}</td>
                    <td>{patient.PatientPhone}</td>
                    <td>{patient.visitType}</td>
                    <td>{patient.reason}</td>
                    <td>
                      {patient.amount} {patient.Currency}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          patient.paymentStatus === "paid"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {patient.paymentStatus}
                      </span>
                    </td>
                    <td>{formatDate(patient.bookingStartDate)}</td>
                    <td>{formatDate(patient.paymentDateTime)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">
                No consultations found for this doctor.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#f8f9fa", borderTop: "1px solid #dee2e6" }}
        >
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div>
              <strong>Total Consultations:</strong> {doctorPatients.length}
              <br />
              <strong>Doctor's Total Earnings:</strong>{" "}
              {doctorEarnings.toFixed(2)} {selectedDoctorCurrency}
            </div>
            <div>
              <Button variant="secondary" onClick={handleClosePatientModal}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      <style>{`
        .modal-90w {
          width: 60%;
          max-width: none!important;
        }
        @media (max-width: 768px) {
          .modal-90w {
            width: 60%;
          }
        }
      `}</style>
    </div>
  );
};

export default ShowDoctorList;
