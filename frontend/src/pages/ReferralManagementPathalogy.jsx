import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TestReferralManagement = () => {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [remarks, setRemarks] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    commissionType: "Amount",
    commissionValue: "",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const filteredBookings = referrals.filter((booking) => {
    const isNameMatch =
      booking.PatientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.PatientPhone.toString().includes(searchQuery) &&
        searchQuery.trim() !== "");

    const isDateMatch =
      (!startDate || new Date(booking.bookingDate) >= startDate) &&
      (!endDate || new Date(booking.bookingDate) <= endDate);

    return isNameMatch && isDateMatch;
  });

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleCommissionTypeChange = (type) => {
    setFormData({
      ...formData,
      commissionType: type,
    });
  };

  // Function to handle commission value change
  const handleCommissionValueChange = (value) => {
    setFormData({
      ...formData,
      commissionValue: value,
    });
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllPathologyTestReferral`
      );
      setReferrals(response?.data?.referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDoctorData`
      );
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllBookingsTest`
      );
      setPatients(response?.data?.bookings);
      //  alert(JSON.stringify(patients));
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const [deleteReferralId, setDeleteReferralId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = (referralId) => {
    setDeleteReferralId(referralId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Send DELETE request to delete referral
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/deletePathologyTestReferral/${deleteReferralId}`
      );

      toast.success("Referral deleted successfully");
      setShowDeleteModal(false);
      setDeleteReferralId(null);
      fetchReferrals();
    } catch (error) {
      console.error("Error deleting referral:", error);
      toast.error("Error deleting referral");
    }
  };

  const [editReferralData, setEditReferralData] = useState(null);

  const handleEditClick = (referral) => {
    setEditReferralData(referral);
    setSelectedPatient(referral.patientId);
    setSelectedDoctor(referral.doctorId);
    const dateOnly = referral.bookingDate.split("T")[0];
    setBookingDate(dateOnly);
    setBookingTime(referral.bookingTime);
    setRemarks(referral.remarks);
    setFormData({
      ...formData,
      commissionType: referral.commissionType, // Set the commissionType from the existing data
      commissionValue: referral.commissionValue, // Set the commissionValue from the existing data
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const data = {
      doctor: selectedDoctor,
      patient: selectedPatient,
      bookingDate,
      bookingTime,
      formData,
      remarks,
    };

    // alert(formData.commissionType + " " + formData.commissionValue);
    // return;
    try {
      if (editReferralData !== "create") {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/updatePathologyTestReferral/${editReferralData.id}`,
          data
        );
        if (response.data.success) {
          toast.success("Referral Updated successfully");
        } else {
          toast.error(response.data.error);
        }
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/createPathologyTestReferral`,
          data
        );
        if (response.data.success) {
          toast.success("Referral saved successfully");
        } else {
          toast.error(response.data.error);
        }
      }

      handleCloseModal();
      fetchReferrals();
    } catch (error) {
      console.error("Error saving referral:", error);
      const errorMessage = error.response.data.error;
      toast.error(`Error saving referral: ${errorMessage}`);
    }
  };

  const initialFormData = {
    commissionType: "", // Set this to your initial value
    commissionValue: "", // Set this to your initial value
  };

  const handleCloseModal = () => {
    // Reset form fields
    setSelectedDoctor(null);
    setSelectedPatient(null);
    setBookingDate("");
    setBookingTime("");
    setRemarks("");
    setFormData({ ...initialFormData });

    setShowModal(false);
  };

  return (
    <div style={{ fontSize: "12px" }} className="container mt-4">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>Referral Management</h2>
      </header>
      <br />
      <Button
        style={{ fontSize: "13px", padding: "4px 5px" }}
        variant="secondary"
        onClick={() => {
          setShowModal(true);
          setEditReferralData("create");
        }}
      >
        Create Referral
      </Button>{" "}
      <Link to={"/Pathologytest"}>
        <button
          style={{ marginLeft: "10px", fontSize: "13px", padding: "4px 5px" }}
          className="btn btn-primary btn"
        >
          Go Back
        </button>
      </Link>
      <br></br>
      <br></br>
      <div className="row mb-3">
        <div className="col-3">
          <input
            style={{ fontSize: "13px" }}
            type="text"
            className="form-control"
            placeholder="Search patient by name or number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-5"></div>
        <div className="col-2">
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            placeholderText="Start Date"
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </div>
        <div className="col-2">
          <DatePicker
            style={{ fontSize: "13px" }}
            selected={endDate}
            onChange={handleEndDateChange}
            placeholderText="End Date"
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </div>
      </div>
      <Modal
        backdrop="static"
        style={{ fontSize: "13px" }}
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {editReferralData !== "create"
              ? "Edit Referral"
              : "Create Referral"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select Patient:</Form.Label>
              <Form.Control
                as="select"
                style={{ fontSize: "13px" }}
                required
                disabled={editReferralData !== "create"}
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.PatientName} ({patient.PatientPhoneNo})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Select Doctor:</Form.Label>
              <Form.Control
                as="select"
                style={{ fontSize: "13px" }}
                required
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.FirstName} {doctor.LastName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Commission Type</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="By Amount"
                  name="commissionType"
                  id="commissionAmount"
                  checked={formData.commissionType === "Amount"}
                  onChange={() => handleCommissionTypeChange("Amount")}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="By Percentage"
                  name="commissionType"
                  id="commissionPercentage"
                  checked={formData.commissionType === "Percentage"}
                  onChange={() => handleCommissionTypeChange("Percentage")}
                />
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Commission Value</Form.Label>
              <div>
                {formData.commissionType === "Amount" ? (
                  <Form.Control
                    type="number"
                    placeholder="Enter Commission Amount"
                    style={{ fontSize: "13px" }}
                    value={formData.commissionValue}
                    onChange={(e) =>
                      handleCommissionValueChange(e.target.value)
                    }
                  />
                ) : (
                  <Form.Control
                    type="text"
                    placeholder="Enter Commission Percentage"
                    style={{ fontSize: "13px" }}
                    value={formData.commissionValue}
                    onChange={(e) =>
                      handleCommissionValueChange(e.target.value)
                    }
                  />
                )}
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Booking Date</Form.Label>
              <Form.Control
                type="date"
                style={{ fontSize: "13px" }}
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Booking Time</Form.Label>
              <Form.Control
                type="time"
                required
                style={{ fontSize: "13px" }}
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter Remarks"
                style={{ fontSize: "13px" }}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "13px" }}
            variant="secondary"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
          <Button
            style={{ fontSize: "13px", marginTop: "0px" }}
            variant="secondary"
            onClick={handleSubmit}
          >
            Save Referral
          </Button>
        </Modal.Footer>
      </Modal>
      <Table
        style={{ fontSize: "12px", textAlign: "center" }}
        responsive
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Sr No</th>
            <th style={{ textAlign: "center" }}>Patient Name</th>
            <th style={{ textAlign: "center" }}>Patient Phone</th>
            <th style={{ textAlign: "center" }}>Doctor Name</th>
            <th style={{ textAlign: "center" }}>Doctor Phone</th>
            <th style={{ textAlign: "center" }}>Booking Date</th>
            <th style={{ textAlign: "center" }}>Booking Time</th>

            <th style={{ textAlign: "center" }}>Remarks</th>
            <th style={{ textAlign: "center" }}>Manage</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((referral, index) => (
            <tr key={referral.id}>
              <td style={{ fontSize: "12px", textAlign: "center" }}>
                {index + 1}
              </td>
              <td style={{ fontSize: "12px", textAlign: "center" }}>
                {referral?.PatientName}
              </td>
              <td style={{ fontSize: "12px", textAlign: "center" }}>
                {referral?.PatientPhone}
              </td>
              <td style={{ fontSize: "12px", textAlign: "center" }}>
                Dr {referral?.DoctorName}
              </td>
              <td style={{ fontSize: "12px", textAlign: "center" }}>
                {referral?.DoctorPhone}
              </td>
              <td style={{ fontSize: "12px", textAlign: "center" }}>
                {formatDate(referral.bookingDate)}
              </td>
              <td style={{ fontSize: "12px", textAlign: "center" }}>
                {referral.bookingTime}
              </td>

              <td style={{ fontSize: "12px", textAlign: "center" }}>
                {referral.remarks}
              </td>
              <td style={{ fontSize: "12px", textAlign: "center" }}>
                <Button
                  variant="secondary"
                  style={{
                    fontSize: "12px",
                    marginTop: "0px",
                    padding: "4px 5px",
                  }}
                  size="lg"
                  onClick={() => handleEditClick(referral)}
                >
                  Edit
                </Button>{" "}
                <Button
                  style={{ fontSize: "12px", padding: "4px 5px" }}
                  variant="danger"
                  size="lg"
                  onClick={() => handleDeleteClick(referral.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal
        style={{ fontSize: "13px" }}
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            Delete Referral
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this referral?</Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "13px" }}
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            style={{ fontSize: "13px" }}
            variant="danger"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestReferralManagement;
