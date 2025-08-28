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
  Form,
} from "react-bootstrap";
import {
  FaRegEye,
  FaPencilAlt,
  FaTrashAlt,
  FaTimes,
  FaDownload,
} from "react-icons/fa";
import DownloadDoctorEarningsReport from "./DownloadDoctorEarningsReport";
import DownloadDoctorReferalEarningsReport from "./DownloadDoctorReferalEarningsReport";

const ShowEarningsDoctors = () => {
  const currentUser = AuthService.getCurrentUser();
  const [doctorList, setDoctorList] = useState([]);
  const [doctorFees, setDoctorFees] = useState([]);
  const [patients, setPatients] = useState([]);
  const [diagnosticsBookings, setDiagnosticsBookings] = useState([]);
  const [pathologyBookings, setPathologyBookings] = useState([]);
  const [enterCodes, setEnterCodes] = useState([]);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [filteredConsultationPatients, setFilteredConsultationPatients] =
    useState([]);
  const [filteredReferralPatients, setFilteredReferralPatients] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const user_Email = currentUser && currentUser.email;

  useEffect(() => {
    fetchDoctorList();
    fetchDoctorFees();
    fetchAllDoctorsAppointments();
    fetchDiagnosticsBookings();
    fetchBookings();
    getEnterCodeList();
  }, []);

  const fetchDoctorFees = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDoctorsWithFees`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setDoctorFees(response.data);
    } catch (error) {
      console.log("Error fetching doctor fees:", error);
    }
  };

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
      console.log("Error fetching appointments:", error);
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

  const fetchDiagnosticsBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDiagnosticsBooking`,
        {
          headers: { Authorization: `${currentUser?.Token}` },
        }
      );
      setDiagnosticsBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching diagnostics bookings:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllBookingsTest`,
        {
          headers: { Authorization: `${currentUser?.Token}` },
        }
      );
      setPathologyBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const getEnterCodeList = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/GetEnterCodeList`,
        {
          headers: { Authorization: `${currentUser?.Token}` },
        }
      );
      setEnterCodes(res.data);
    } catch (error) {
      console.error("Error fetching enter code list:", error);
    }
  };

  // Function to get the applicable fee for a patient based on consultation date
  const getApplicableFee = (
    doctorId,
    consultationDate,
    feeType = "consultation"
  ) => {
    const doctorFeeHistory = doctorFees.filter(
      (fee) => fee.doctorId === doctorId
    );

    if (doctorFeeHistory.length === 0) return 0;

    // Sort fees by feeUpdatedAt date (newest first)
    const sortedFees = doctorFeeHistory.sort(
      (a, b) => new Date(b.feeUpdatedAt) - new Date(a.feeUpdatedAt)
    );

    // Find the fee that was applicable at the time of consultation
    const consultationDateTime = new Date(consultationDate);

    for (const fee of sortedFees) {
      const feeUpdatedAt = new Date(fee.feeUpdatedAt);
      if (consultationDateTime >= feeUpdatedAt) {
        return feeType === "consultation"
          ? parseFloat(fee.consultationFee)
          : parseFloat(fee.referralFee);
      }
    }

    // If no fee found that was updated before consultation, use the oldest fee
    const oldestFee = sortedFees[sortedFees.length - 1];
    return feeType === "consultation"
      ? parseFloat(oldestFee.consultationFee)
      : parseFloat(oldestFee.referralFee);
  };

  const current_user = doctorList.find((item) => item.email === user_Email);

  const calculateTotalEarnings = (patients, earningsType = "consultation") => {
    if (!current_user) return 0;

    let totalEarnings = 0;
    patients.forEach((patient) => {
      if (earningsType === "consultation") {
        // For consultation earnings
        const applicableFee = getApplicableFee(
          current_user.id,
          patient.bookingStartDate,
          "consultation"
        );
        totalEarnings += applicableFee;
      } else if (earningsType === "referral") {
        // For referral earnings - handle different types
        if (patient.referralDoctorId === current_user.id) {
          // Consultation referrals
          const applicableFee = getApplicableFee(
            current_user.id,
            patient.bookingStartDate,
            "referral"
          );
          totalEarnings += applicableFee;
        } else if (
          patient.commissionValue &&
          patient.doctorId === current_user.id
        ) {
          // Diagnostics and pathology referrals
          const enterCode = enterCodes.find(
            (code) => code.codeType === patient.commissionValue
          );
          if (enterCode) {
            const percentage = parseFloat(enterCode.value);
            const amount =
              parseFloat(patient.PaidAmount) ||
              parseFloat(patient.TotalFees) ||
              0;
            totalEarnings += (amount * percentage) / 100;
          }
        }
      }
    });

    return totalEarnings;
  };

  const filterPatientsByDateRange = (patientsList) => {
    if (!dateRange.startDate && !dateRange.endDate) return patientsList;

    const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

    return patientsList.filter((patient) => {
      let patientDate;

      // Handle different date fields for different referral types
      if (patient.bookingStartDate) {
        patientDate = new Date(patient.bookingStartDate);
      } else if (patient.PaymentDate) {
        patientDate = new Date(patient.PaymentDate);
      } else if (patient.createdAt) {
        patientDate = new Date(patient.createdAt);
      } else {
        return true;
      }

      if (start && end) {
        return patientDate >= start && patientDate <= end;
      } else if (start) {
        return patientDate >= start;
      } else if (end) {
        return patientDate <= end;
      }
      return true;
    });
  };

  const handleViewConsultationEarnings = () => {
    if (!current_user) return;

    const consultationPatients = patients.filter(
      (patient) => patient.doctorId === current_user.id
    );

    const filtered = filterPatientsByDateRange(consultationPatients);
    setFilteredConsultationPatients(filtered);
    setSelectedDoctor(current_user);
    setShowConsultationModal(true);
  };

  const handleViewReferralEarnings = () => {
    if (!current_user) return;

    // Filter patients by referralDoctorId (consultations)
    const filteredPatients = patients.filter(
      (patient) => patient.referralDoctorId === current_user.id
    );

    // Filter diagnostics bookings by doctorId (not referralDoctorId)
    const filteredDiagnostics = diagnosticsBookings.filter(
      (booking) => booking.doctorId === current_user.id
    );

    // Filter pathology bookings by doctorId (not referralDoctorId)
    const filteredPathology = pathologyBookings.filter(
      (booking) => booking.doctorId === current_user.id
    );

    // Combine all referral data
    const allReferrals = [
      ...filteredPatients.map((item) => ({ ...item, type: "Consultation" })),
      ...filteredDiagnostics.map((item) => ({ ...item, type: "Diagnostics" })),
      ...filteredPathology.map((item) => ({ ...item, type: "Pathology" })),
    ];

    const filtered = filterPatientsByDateRange(allReferrals);
    setFilteredReferralPatients(filtered);
    setSelectedDoctor(current_user);
    setShowReferralModal(true);
  };

  const handleCloseModal = () => {
    setShowConsultationModal(false);
    setShowReferralModal(false);
    setFilteredConsultationPatients([]);
    setFilteredReferralPatients([]);
    setDateRange({ startDate: "", endDate: "" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get the latest fee for the current doctor
  const getLatestDoctorFee = (doctorId) => {
    const doctorFeeHistory = doctorFees.filter(
      (fee) => fee.doctorId === doctorId
    );
    if (doctorFeeHistory.length === 0) return null;

    return doctorFeeHistory.sort(
      (a, b) => new Date(b.feeUpdatedAt) - new Date(a.feeUpdatedAt)
    )[0];
  };

  // Calculate referral fee for display
  const calculateReferralFee = (referral) => {
    // For consultation referrals
    if (referral.type === "Consultation") {
      const applicableFee = getApplicableFee(
        current_user.id,
        referral.bookingStartDate,
        "referral"
      );
      return applicableFee;
    }
    // For diagnostics and pathology referrals
    else if (referral.commissionValue) {
      // Find the enter code
      const enterCode = enterCodes.find(
        (code) => code.codeType === referral.commissionValue
      );
      if (enterCode) {
        // Extract percentage value (e.g., "10%" -> 10)
        const percentage = parseFloat(enterCode.value);
        const amount =
          parseFloat(referral.PaidAmount) ||
          parseFloat(referral.TotalFees) ||
          0;
        return (amount * percentage) / 100;
      }
    }
    return 0;
  };

  if (!current_user) {
    return (
      <Container fluid className="mt-4">
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Body className="text-center">
                <h4>Doctor not found or not logged in as a doctor</h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  const consultationPatients = patients.filter(
    (patient) => patient.doctorId === current_user.id
  );

  // Get all referral types for total earnings calculation
  const referralPatients = patients.filter(
    (patient) => patient.referralDoctorId === current_user.id
  );
  const referralDiagnostics = diagnosticsBookings.filter(
    (booking) => booking.doctorId === current_user.id
  );
  const referralPathology = pathologyBookings.filter(
    (booking) => booking.doctorId === current_user.id
  );

  const allReferrals = [
    ...referralPatients.map((item) => ({ ...item, type: "Consultation" })),
    ...referralDiagnostics.map((item) => ({ ...item, type: "Diagnostics" })),
    ...referralPathology.map((item) => ({ ...item, type: "Pathology" })),
  ];

  const totalConsultationEarnings = calculateTotalEarnings(
    consultationPatients,
    "consultation"
  );
  const totalReferralEarnings = calculateTotalEarnings(
    allReferrals,
    "referral"
  );

  const latestFee = getLatestDoctorFee(current_user.id);

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
        <h2 style={{ fontSize: "16px" }}>
          My Earnings - Dr. {current_user.FirstName} {current_user.LastName}
        </h2>
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
                      <th style={{ whiteSpace: "nowrap" }}>Doctor Name</th>
                      <th style={{ whiteSpace: "nowrap" }}>Email</th>
                      <th style={{ whiteSpace: "nowrap" }}>User Name</th>
                      <th style={{ whiteSpace: "nowrap" }}>
                        Current Consultation Fee
                      </th>
                      <th style={{ whiteSpace: "nowrap" }}>
                        Current Referral Fee
                      </th>
                      <th style={{ whiteSpace: "nowrap" }}>
                        Diagnostics/Pathology Commission
                      </th>
                      <th style={{ whiteSpace: "nowrap" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={current_user.id}>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {current_user.Dr} {current_user.FirstName}{" "}
                        {current_user.MiddleName} {current_user.LastName}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {current_user.email}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {current_user.username}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {latestFee
                          ? `${latestFee.consultationFee} ${latestFee.consultationCurrency}`
                          : "N/A"}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {latestFee
                          ? `${latestFee.referralFee} ${latestFee.consultationCurrency}`
                          : "N/A"}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {enterCodes.length > 0 ? (
                          <div>
                            {enterCodes.map((code, idx) => (
                              <div key={code.id}>
                                {code.codeType}: {code.value}
                                {idx < enterCodes.length - 1 && <br />}
                              </div>
                            ))}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-start">
                          <button
                            title="View Consultation Earnings"
                            style={{
                              fontSize: "12px",
                              padding: "4px 5px",
                              marginTop: "0px",
                              backgroundColor: "#1111",
                              color: "black",
                            }}
                            className="btn btn-secondary mr-1"
                            onClick={handleViewConsultationEarnings}
                          >
                            <FaRegEye /> Consultations
                          </button>

                          <button
                            title="View Referral Earnings"
                            style={{
                              fontSize: "12px",
                              padding: "4px 5px",
                              marginTop: "0px",
                              backgroundColor: "#1111",
                              color: "black",
                            }}
                            className="btn btn-info mr-1"
                            onClick={handleViewReferralEarnings}
                          >
                            <FaRegEye /> Referrals
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Consultation Earnings Modal */}
      <Modal
        backdrop="static"
        size="xl"
        style={{ marginTop: "20px" }}
        centered
        show={showConsultationModal}
        onHide={handleCloseModal}
        dialogClassName="modal-90w"
      >
        <Modal.Header
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <Modal.Title style={{ fontSize: "18px", fontWeight: "bold" }}>
            Consultation Earnings for Dr. {selectedDoctor?.FirstName}{" "}
            {selectedDoctor?.LastName}
          </Modal.Title>
          <Button
            variant="light"
            onClick={handleCloseModal}
            style={{ padding: "0.25rem 0.5rem" }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
              />
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <Button
                variant="primary"
                className="me-2"
                onClick={() => {
                  const consultationPatients = patients.filter(
                    (patient) => patient.doctorId === current_user.id
                  );
                  setFilteredConsultationPatients(
                    filterPatientsByDateRange(consultationPatients)
                  );
                }}
              >
                Select
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  setDateRange({ startDate: "", endDate: "" });
                  const consultationPatients = patients.filter(
                    (patient) => patient.doctorId === current_user.id
                  );
                  setFilteredConsultationPatients(consultationPatients);
                }}
              >
                Clear
              </Button>
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <DownloadDoctorEarningsReport
                doctor={selectedDoctor}
                patients={filteredConsultationPatients}
                doctorFees={doctorFees}
                dateRange={dateRange}
              />
            </div>
          </div>

          <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
            {filteredConsultationPatients.length > 0 ? (
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
                    <th>Applicable Doctor Fee</th>
                    <th>Consultation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsultationPatients.map((patient, index) => {
                    const applicableFee = getApplicableFee(
                      current_user.id,
                      patient.bookingStartDate,
                      "consultation"
                    );
                    const applicableFeeRecord = doctorFees
                      .filter((fee) => fee.doctorId === current_user.id)
                      .find(
                        (fee) =>
                          new Date(patient.bookingStartDate) >=
                          new Date(fee.feeUpdatedAt)
                      );

                    return (
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
                          {applicableFee}{" "}
                          {applicableFeeRecord?.consultationCurrency || "INR"}
                        </td>
                        <td>{formatDate(patient.bookingStartDate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">
                  No consultation earnings found for the selected date range.
                </p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#f8f9fa", borderTop: "1px solid #dee2e6" }}
        >
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div>
              <strong>Total Consultations:</strong>{" "}
              {filteredConsultationPatients.length}
              <br />
              <strong>Total Earnings:</strong>{" "}
              {calculateTotalEarnings(
                filteredConsultationPatients,
                "consultation"
              ).toFixed(2)}
              {latestFee?.consultationCurrency || "INR"}
            </div>
            <div>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Referral Earnings Modal */}
      <Modal
        backdrop="static"
        size="xl"
        style={{ marginTop: "20px" }}
        centered
        show={showReferralModal}
        onHide={handleCloseModal}
        dialogClassName="modal-90w"
      >
        <Modal.Header
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid ",
          }}
        >
          <Modal.Title style={{ fontSize: "18px", fontWeight: "bold" }}>
            Referral Earnings for Dr. {selectedDoctor?.FirstName}{" "}
            {selectedDoctor?.LastName}
          </Modal.Title>
          <Button
            variant="light"
            onClick={handleCloseModal}
            style={{ padding: "0.25rem 0.5rem" }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
              />
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <Button
                variant="primary"
                className="me-2"
                onClick={() => {
                  // Filter patients by referralDoctorId (consultations)
                  const filteredPatients = patients.filter(
                    (patient) => patient.referralDoctorId === current_user.id
                  );

                  // Filter diagnostics bookings by doctorId (not referralDoctorId)
                  const filteredDiagnostics = diagnosticsBookings.filter(
                    (booking) => booking.doctorId === current_user.id
                  );

                  // Filter pathology bookings by doctorId (not referralDoctorId)
                  const filteredPathology = pathologyBookings.filter(
                    (booking) => booking.doctorId === current_user.id
                  );

                  // Combine all referral data
                  const allReferrals = [
                    ...filteredPatients.map((item) => ({
                      ...item,
                      type: "Consultation",
                    })),
                    ...filteredDiagnostics.map((item) => ({
                      ...item,
                      type: "Diagnostics",
                    })),
                    ...filteredPathology.map((item) => ({
                      ...item,
                      type: "Pathology",
                    })),
                  ];

                  setFilteredReferralPatients(
                    filterPatientsByDateRange(allReferrals)
                  );
                }}
              >
                Select
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  setDateRange({ startDate: "", endDate: "" });
                  // Filter patients by referralDoctorId (consultations)
                  const filteredPatients = patients.filter(
                    (patient) => patient.referralDoctorId === current_user.id
                  );

                  // Filter diagnostics bookings by doctorId (not referralDoctorId)
                  const filteredDiagnostics = diagnosticsBookings.filter(
                    (booking) => booking.doctorId === current_user.id
                  );

                  // Filter pathology bookings by doctorId (not referralDoctorId)
                  const filteredPathology = pathologyBookings.filter(
                    (booking) => booking.doctorId === current_user.id
                  );

                  // Combine all referral data
                  const allReferrals = [
                    ...filteredPatients.map((item) => ({
                      ...item,
                      type: "Consultation",
                    })),
                    ...filteredDiagnostics.map((item) => ({
                      ...item,
                      type: "Diagnostics",
                    })),
                    ...filteredPathology.map((item) => ({
                      ...item,
                      type: "Pathology",
                    })),
                  ];

                  setFilteredReferralPatients(allReferrals);
                }}
              >
                Clear
              </Button>
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <DownloadDoctorReferalEarningsReport
                doctor={{
                  ...selectedDoctor,
                  referralFee: latestFee?.referralFee || "0",
                  consultationCurrency:
                    latestFee?.consultationCurrency || "INR",
                }}
                patients={filteredReferralPatients}
                dateRange={dateRange}
                enterCodes={enterCodes}
              />
            </div>
          </div>

          <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
            {filteredReferralPatients.length > 0 ? (
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
                    <th>Type</th>
                    <th>Patient Name</th>
                    <th>Phone</th>
                    <th>Procedure/Visit Type</th>
                    <th>Amount Paid</th>
                    <th>Referral Fee</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferralPatients.map((referral, index) => {
                    let referralFee = calculateReferralFee(referral);
                    let procedureVisitType = "";
                    let patientName = "";
                    let phone = "";
                    let amountPaid = 0;
                    let date = "";
                    let currency = "INR";

                    // Consultation referral
                    if (referral.type === "Consultation") {
                      procedureVisitType = referral.visitType;
                      patientName = referral.PatientName;
                      phone = referral.PatientPhone;
                      amountPaid = parseFloat(referral.amount) || 0;
                      date = formatDate(referral.bookingStartDate);
                      currency = referral.Currency || "INR";
                    }
                    // Diagnostics or Pathology referral
                    else {
                      procedureVisitType =
                        referral.selectedTests || referral.PackageName || "N/A";
                      patientName = referral.PatientName;
                      phone = referral.PatientPhoneNo;
                      amountPaid =
                        parseFloat(referral.PaidAmount) ||
                        parseFloat(referral.TotalFees) ||
                        0;
                      date = formatDate(
                        referral.PaymentDate || referral.createdAt
                      );
                      currency = referral.Currency || "INR";
                    }

                    return (
                      <tr key={`${referral.type}-${referral.id}`}>
                        <td>{index + 1}</td>
                        <td>{referral.type}</td>
                        <td>{patientName}</td>
                        <td>{phone}</td>
                        <td>{procedureVisitType}</td>
                        <td>
                          {amountPaid.toFixed(2)} {currency}
                        </td>
                        <td>
                          {referralFee.toFixed(2)}{" "}
                          {latestFee?.consultationCurrency || "INR"}
                        </td>
                        <td>{date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">
                  No referral earnings found for the selected date range.
                </p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#f8f9fa", borderTop: "1px solid #dee2e6" }}
        >
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div>
              <strong>Total Referrals:</strong>{" "}
              {filteredReferralPatients.length}
              <br />
              <strong>Total Earnings:</strong>{" "}
              {calculateTotalEarnings(
                filteredReferralPatients,
                "referral"
              ).toFixed(2)}
              {latestFee?.consultationCurrency || "INR"}
            </div>
            <div>
              <Button variant="secondary" onClick={handleCloseModal}>
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

export default ShowEarningsDoctors;

//pushing again 