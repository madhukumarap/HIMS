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
import { FaRegEye, FaPencilAlt, FaTimes, FaDownload } from "react-icons/fa";
import DownloadDoctorEarningsReport from "./DownloadDoctorEarningsReport";
import DownloadDoctorReferalEarningsReport from "./DownloadDoctorReferalEarningsReport";
import { toast } from "react-toastify";

const ShowDoctorList = () => {
  const currentUser = AuthService.getCurrentUser();
  const [doctorList, setDoctorList] = useState([]);
  const [doctorFees, setDoctorFees] = useState([]);
  const [patients, setPatients] = useState([]);

  // Consultation modal state
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDoctorName, setSelectedDoctorName] = useState("");
  const [doctorConsultations, setDoctorConsultations] = useState([]);
  const [totalConsultationFees, setTotalConsultationFees] = useState(0);
  const [doctorEarnings, setDoctorEarnings] = useState(0);

  // Referral modal state
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [doctorReferrals, setDoctorReferrals] = useState([]);
  const [totalReferralFees, setTotalReferralFees] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [selectedDoctorFee, setSelectedDoctorFee] = useState(0);
  const [selectedDoctorCurrency, setSelectedDoctorCurrency] = useState("INR");

  // Date range state for both modals
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);

  // Edit form state
  const [editConsultationFee, setEditConsultationFee] = useState("");
  const [editReferralFee, setEditReferralFee] = useState("");
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  //
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctorList();
    fetchDoctorFees();
    fetchAllDoctorsAppointments();
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

  const handleViewConsultations = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDoctorId(doctor.id);
    setSelectedDoctorName(
      `${doctor.Dr} ${doctor.FirstName} ${doctor.MiddleName} ${doctor.LastName}`
    );
    setDateRange({ startDate: "", endDate: "" });

    // Filter patients by doctorId
    const filteredPatients = patients.filter(
      (patient) => patient.doctorId === doctor.id // Use doctor.id instead of doctorId
    );
    setDoctorConsultations(filteredPatients);
    setFilteredConsultations(filteredPatients);

    // Calculate earnings based on applicable fees at the time of consultation
    let totalPatientFees = 0;
    let totalDoctorEarnings = 0;

    filteredPatients.forEach((patient) => {
      const applicableFee = getApplicableFee(
        doctor.id, // Use doctor.id instead of doctorId
        patient.bookingStartDate,
        "consultation"
      );
      totalPatientFees += parseFloat(patient.amount) || 0;
      totalDoctorEarnings += applicableFee;
    });

    setTotalConsultationFees(totalPatientFees);
    setDoctorEarnings(totalDoctorEarnings);
    setShowConsultationModal(true);
  };

  const handleViewReferrals = (doctor) => {
    const latestFee = getLatestDoctorFee(doctor.id);

    setSelectedDoctor(doctor);
    setSelectedDoctorId(doctor.id);
    setSelectedDoctorName(
      `${doctor.Dr} ${doctor.FirstName} ${doctor.MiddleName} ${doctor.LastName}`
    );
    setSelectedDoctorFee(parseFloat(latestFee?.referralFee) || 0);
    setSelectedDoctorCurrency(latestFee?.consultationCurrency || "INR");
    setDateRange({ startDate: "", endDate: "" });

    // Filter patients by referralDoctorId
    const filteredPatients = patients.filter(
      (patient) => patient.referralDoctorId === doctor.id
    );
    setDoctorReferrals(filteredPatients);
    setFilteredReferrals(filteredPatients);

    // Calculate total amount from referrals
    const totalPatientFees = filteredPatients.reduce((sum, patient) => {
      return sum + (parseFloat(patient.amount) || 0);
    }, 0);
    setTotalReferralFees(totalPatientFees);

    // Calculate doctor's referral earnings based on applicable fees
    let doctorTotalEarnings = 0;
    filteredPatients.forEach((patient) => {
      const applicableFee = getApplicableFee(
        doctor.id,
        patient.bookingStartDate,
        "referral"
      );
      doctorTotalEarnings += applicableFee;
    });
    setReferralEarnings(doctorTotalEarnings);

    setShowReferralModal(true);
  };

  const handleCloseConsultationModal = () => {
    setShowConsultationModal(false);
    setDoctorConsultations([]);
    setFilteredConsultations([]);
    setTotalConsultationFees(0);
    setDoctorEarnings(0);
  };

  const handleCloseReferralModal = () => {
    setShowReferralModal(false);
    setDoctorReferrals([]);
    setFilteredReferrals([]);
    setTotalReferralFees(0);
    setReferralEarnings(0);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);

    // Get the latest fee for this doctor
    const latestFee = doctorFees
      .filter((fee) => fee.doctorId === doctor.id)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

    setEditConsultationFee(latestFee?.consultationFee || "0");
    setEditReferralFee(latestFee?.referralFee || "0");
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingDoctor(null);
    setEditConsultationFee("");
    setEditReferralFee("");
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/updateDoctorFees/${
          editingDoctor.id
        }`,
        {
          consultationFee: editConsultationFee,
          referralFee: editReferralFee,
        },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      if (response.status === 200) {
        // Refresh the doctor fees list
        await fetchDoctorFees();
        handleCloseEditModal();
        toast.success("Doctor fees updated successfully!");
      }
    } catch (error) {
      console.error("Error updating doctor fees:", error);
      toast.error("Error updating doctor fees. Please try again.");
    }
  };

  // Get the latest fee for each doctor
  const getLatestDoctorFee = (doctorId) => {
    const doctorFeeHistory = doctorFees.filter(
      (fee) => fee.doctorId === doctorId
    );
    if (doctorFeeHistory.length === 0) return null;

    return doctorFeeHistory.sort(
      (a, b) => new Date(b.feeUpdatedAt) - new Date(a.feeUpdatedAt)
    )[0];
  };

  // Filter data by date range
  const filterByDateRange = (data, startDate, endDate) => {
    if (!startDate && !endDate) return data;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return data.filter((item) => {
      const itemDate = new Date(item.bookingStartDate || item.paymentDateTime);

      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
      return true;
    });
  };

  // Handle date range change for consultation modal
  const handleConsultationDateRangeChange = () => {
    const filtered = filterByDateRange(
      doctorConsultations,
      dateRange.startDate,
      dateRange.endDate
    );
    setFilteredConsultations(filtered);

    // Recalculate totals for filtered data
    let totalPatientFees = 0;
    let totalDoctorEarnings = 0;

    filtered.forEach((patient) => {
      const applicableFee = getApplicableFee(
        selectedDoctorId,
        patient.bookingStartDate,
        "consultation"
      );
      totalPatientFees += parseFloat(patient.amount) || 0;
      totalDoctorEarnings += applicableFee;
    });

    setTotalConsultationFees(totalPatientFees);
    setDoctorEarnings(totalDoctorEarnings);
  };

  // Handle date range change for referral modal
  const handleReferralDateRangeChange = () => {
    const filtered = filterByDateRange(
      doctorReferrals,
      dateRange.startDate,
      dateRange.endDate
    );
    setFilteredReferrals(filtered);

    // Recalculate totals for filtered data
    const totalPatientFees = filtered.reduce((sum, patient) => {
      return sum + (parseFloat(patient.amount) || 0);
    }, 0);
    setTotalReferralFees(totalPatientFees);

    // Recalculate referral earnings based on applicable fees
    let doctorTotalEarnings = 0;
    filtered.forEach((patient) => {
      const applicableFee = getApplicableFee(
        selectedDoctorId,
        patient.bookingStartDate,
        "referral"
      );
      doctorTotalEarnings += applicableFee;
    });
    setReferralEarnings(doctorTotalEarnings);
  };

  // Clear date range filter
  const clearDateRange = (modalType) => {
    setDateRange({ startDate: "", endDate: "" });

    if (modalType === "consultation") {
      // ... existing consultation code
    } else {
      setFilteredReferrals(doctorReferrals);

      // Recalculate totals for all data
      const totalPatientFees = doctorReferrals.reduce((sum, patient) => {
        return sum + (parseFloat(patient.amount) || 0);
      }, 0);
      setTotalReferralFees(totalPatientFees);

      // Recalculate referral earnings based on applicable fees
      let doctorTotalEarnings = 0;
      doctorReferrals.forEach((patient) => {
        const applicableFee = getApplicableFee(
          selectedDoctorId,
          patient.bookingStartDate,
          "referral"
        );
        doctorTotalEarnings += applicableFee;
      });
      setReferralEarnings(doctorTotalEarnings);
    }
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
                      <th style={{ whiteSpace: "nowrap" }}>Referal Fee</th>
                      <th style={{ whiteSpace: "nowrap" }}>Last Fee Update</th>
                      <th style={{ whiteSpace: "nowrap" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorList.map((doctor, index) => {
                      const latestFee = getLatestDoctorFee(doctor.id);

                      return (
                        <tr key={doctor.id}>
                          <td style={{ textAlign: "center" }}>{index + 1}</td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {doctor.Dr} {doctor.FirstName} {doctor.MiddleName}{" "}
                            {doctor.LastName}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {doctor.email}
                          </td>
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
                            {latestFee
                              ? formatDate(latestFee.feeUpdatedAt)
                              : "N/A"}
                          </td>
                          <td>
                            <div className="d-flex justify-content-start">
                              <button
                                title="View Patient Consultations"
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 5px",
                                  marginTop: "0px",
                                  backgroundColor: "#1111",
                                  color: "black",
                                }}
                                className="btn btn-secondary mr-1"
                                onClick={() => handleViewConsultations(doctor)}
                              >
                                <FaRegEye /> Consultations
                              </button>

                              <button
                                title="View Referral Patients"
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 5px",
                                  marginTop: "0px",
                                  backgroundColor: "#1111",
                                  color: "black",
                                }}
                                className="btn btn-info mr-1"
                                onClick={() => handleViewReferrals(doctor)}
                              >
                                <FaRegEye /> Referrals
                              </button>

                              <button
                                title="Edit Doctor Fees"
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 5px",
                                  marginTop: "0px",
                                  backgroundColor: "#1111",
                                  color: "black",
                                }}
                                className="btn btn-warning mr-1"
                                onClick={() => handleEditDoctor(doctor)}
                              >
                                <FaPencilAlt />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Consultation Modal */}
      <Modal
        backdrop="static"
        size="xl"
        style={{ marginTop: "20px" }}
        centered
        show={showConsultationModal}
        onHide={handleCloseConsultationModal}
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
            onClick={handleCloseConsultationModal}
            style={{ padding: "0.25rem 0.5rem" }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {/* Date Range Filter */}
          <div className="mb-3 p-3 border rounded">
            <h6>Filter by Date Range</h6>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Form.Group className="mb-2">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                />
              </Form.Group>
              <Button
                variant="primary"
                style={{ marginTop: "1.5rem" }}
                onClick={handleConsultationDateRangeChange}
              >
                Apply Filter
              </Button>
              <Button
                variant="secondary"
                style={{ marginTop: "21px" }}
                onClick={() => clearDateRange("consultation")}
              >
                Clear Filter
              </Button>

              <DownloadDoctorEarningsReport
                doctor={selectedDoctor}
                patients={filteredConsultations}
                doctorFees={doctorFees}
                dateRange={dateRange}
              />
            </div>
          </div>

          {filteredConsultations.length > 0 ? (
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
                  <th>Patient Payment Status</th>
                  <th>Consultation Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultations.map((patient, index) => {
                  const applicableFee = getApplicableFee(
                    selectedDoctorId,
                    patient.bookingStartDate,
                    "consultation"
                  );
                  const applicableFeeRecord = doctorFees
                    .filter((fee) => fee.doctorId === selectedDoctorId)
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
                    </tr>
                  );
                })}
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
              <strong>Total Consultations:</strong>{" "}
              {filteredConsultations.length}
              <br />
              <strong>Doctor's Total Earnings:</strong>{" "}
              {doctorEarnings.toFixed(2)} INR
            </div>
            <div>
              <Button
                variant="secondary"
                onClick={handleCloseConsultationModal}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Referral Modal */}
      <Modal
        backdrop="static"
        size="xl"
        style={{ marginTop: "20px" }}
        centered
        show={showReferralModal}
        onHide={handleCloseReferralModal}
        dialogClassName="modal-90w"
      >
        <Modal.Header
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <Modal.Title style={{ fontSize: "18px", fontWeight: "bold" }}>
            Patient Referrals for Dr. {selectedDoctorName}
          </Modal.Title>
          <Button
            variant="light"
            onClick={handleCloseReferralModal}
            style={{ padding: "0.25rem 0.5rem" }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {/* Date Range Filter */}
          <div className="mb-3 p-3 border rounded">
            <h6>Filter by Date Range</h6>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Form.Group className="mb-2">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                />
              </Form.Group>
              <Button
                variant="primary"
                style={{ marginTop: "1.5rem" }}
                onClick={handleReferralDateRangeChange}
              >
                Apply Filter
              </Button>
              <Button
                variant="secondary"
                style={{ marginTop: "21px" }}
                onClick={() => clearDateRange("referral")}
              >
                Clear Filter
              </Button>
              <DownloadDoctorReferalEarningsReport
                doctor={{
                  ...selectedDoctor,
                  referralFee: selectedDoctorFee,
                  consultationCurrency: selectedDoctorCurrency,
                }}
                patients={filteredReferrals}
                dateRange={dateRange}
              />
            </div>
          </div>

          {filteredReferrals.length > 0 ? (
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
                  <th>Referral Fee</th>
                  <th>Patient Payment Status</th>
                  <th>Consultation Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map((patient, index) => {
                  const applicableReferralFee = getApplicableFee(
                    selectedDoctorId,
                    patient.bookingStartDate,
                    "referral"
                  );
                  const applicableFeeRecord = doctorFees
                    .filter((fee) => fee.doctorId === selectedDoctorId)
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
                        {applicableReferralFee}{" "}
                        {applicableFeeRecord?.consultationCurrency || "INR"}
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
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No referrals found for this doctor.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#f8f9fa", borderTop: "1px solid #dee2e6" }}
        >
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div>
              <strong>Total Referrals:</strong> {filteredReferrals.length}
              <br />
              <strong>Doctor's Total Referral Earnings:</strong>{" "}
              {referralEarnings.toFixed(2)} {selectedDoctorCurrency}
            </div>
            <div>
              <Button variant="secondary" onClick={handleCloseReferralModal}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Edit Doctor Fees Modal */}
      <Modal
        backdrop="static"
        style={{ marginTop: "20px" }}
        centered
        show={showEditModal}
        onHide={handleCloseEditModal}
      >
        <Modal.Header
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <Modal.Title style={{ fontSize: "18px", fontWeight: "bold" }}>
            Edit Doctor Fees - Dr. {selectedDoctor?.FirstName}{" "}
            {selectedDoctor?.LastName}
          </Modal.Title>
          <Button
            variant="light"
            onClick={handleCloseEditModal}
            style={{ padding: "0.25rem 0.5rem" }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Consultation Fee</Form.Label>
              <Form.Control
                type="number"
                value={editConsultationFee}
                onChange={(e) => setEditConsultationFee(e.target.value)}
                placeholder="Enter consultation fee"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Referral Fee</Form.Label>
              <Form.Control
                type="number"
                value={editReferralFee}
                onChange={(e) => setEditReferralFee(e.target.value)}
                placeholder="Enter referral fee"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#f8f9fa", borderTop: "1px solid #dee2e6" }}
        >
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
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
