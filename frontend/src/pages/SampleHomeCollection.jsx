import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import {
  Modal,
  Button,
  Form,
  Table,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { toast } from "react-toastify";

function SampleCollectionForm() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [testType, setTestType] = useState("fast");
  const [remarks, setRemarks] = useState("");
  const [sampleData, setSampleData] = useState({
    sampleName: "",
    sampleDate: "",
    sampleTime: "",
    sampleTakerName: "",
  });
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewReCollectionDate, setViewReCollectionDate] = useState("");
  const [viewReCollectionTime, setViewReCollectionTime] = useState("");
  const [showViewReCollectionModal, setShowViewReCollectionModal] =
    useState(false);

  const handleViewReCollection = (reCollectionDate, reCollectionTime) => {
    setViewReCollectionDate(reCollectionDate);
    setViewReCollectionTime(reCollectionTime);
    setShowViewReCollectionModal(true); // Show the modal for viewing reCollection date and time
  };

  const [editBookingId, setEditBookingId] = useState(null); // To store the ID of the booking being edited
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const [reCollectionId, setReCollectionId] = useState(null);
  const [reCollectionForm, setReCollectionForm] = useState({
    reCollection: "no",
    reCollectionDate: "",
    reCollectionTime: "",
  });
  const [showReCollectionModal, setShowReCollectionModal] = useState(false);
  const handleReCollection = (bookingId) => {
    setReCollectionId(bookingId);
    setShowReCollectionModal(true);
  };

  const handleReCollectionSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      reCollection: reCollectionForm.reCollection,
      reCollectionDate: reCollectionForm.reCollectionDate,
      reCollectionTime: reCollectionForm.reCollectionTime,
    };

    //alert(reCollectionId);
    // return;
    axios
      .put(
        `${
          import.meta.env.VITE_API_URL
        }/api/updateHomeSampleBookingRecollection/${reCollectionId}`,
        dataToSend
      )
      .then((response) => {
        console.log(
          "Re-collection home data updated successfully:",
          response.data
        );
        setShowReCollectionModal(false);
        toast.success("Re-collection home data updated successfully");
        getData(); // Fetch updated data after successful update
      })
      .catch((error) => {
        toast.error("Failed to update re-collection data");
        console.error("Error updating re-collection data:", error);
      });
  };

  const handleDeleteConfirmation = (bookingId) => {
    setDeleteConfirmationId(bookingId); // Show the confirmation for the provided booking ID
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteConfirmed = (bookingId) => {
    axios
      .delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/deleteHomeSampleTestBooking/${bookingId}`
      )
      .then((response) => {
        console.log("Sample home data deleted successfully:", response.data);
        setDeleteConfirmationId(null); // Hide the confirmation modal
        toast.success("Sample home data deleted successfully");
        getData(); // Fetch updated data after successful delete
      })
      .catch((error) => {
        toast.error("Failed");
        console.error("Error deleting sample data:", error);
      });
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getallPaitents`)
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllHomeSampleBookingsTest`)
      .then((response) => {
        setBookings(response.data.bookings);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getData = () => {
    // Fetch updated data after successful PUT
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllHomeSampleBookingsTest`)
      .then((response) => {
        setBookings(response.data.bookings);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const filtered = bookings.filter((booking) =>
      booking.PatientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...sampleData,
      patientId: selectedPatient,
      testType,
      remarks,
    };

    if (editBookingId) {
      // alert(editBookingId);
      // If editBookingId is set, it means we're editing an existing entry
      axios
        .put(
          `${
            import.meta.env.VITE_API_URL
          }/api/updateHomeSampleBooking/${editBookingId}`,
          dataToSend
        )
        .then((response) => {
          console.log("Home Sample  data updated successfully:", response.data);
          setShowModal(false);
          toast.success("Home Sample data updated successfully");
          getData();
          resetForm();
        })
        .catch((error) => {
          toast.error("Failed");
          console.error("Error updating sample data:", error);
        });
    } else {
      //alert("hello");
      // If editBookingId is not set, it means we're creating a new entry
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/testHomeSampleBooking`,
          dataToSend
        )
        .then((response) => {
          console.log("Sample data created successfully:", response.data);
          setShowModal(false);
          toast.success("Sample data created successfully");
          resetForm();
          getData();
        })
        .catch((error) => {
          toast.error("Fail");
          console.error("Error creating sample data:", error);
        });
    }
  };

  const resetForm = () => {
    setSelectedPatient(""); // Reset selectedPatient to empty string
    setTestType("fast"); // Reset testType to 'fast'
    setRemarks(""); // Reset remarks to empty string
    setSampleData({
      sampleName: "",
      sampleDate: "",
      sampleTime: "",
      sampleTakerName: "",
    }); // Reset sampleData object
  };

  // Create a function to handle creating new entries
  const handleCreateNew = () => {
    setEditBookingId(null); // Reset editBookingId to indicate creating new entry
    setShowModal(true);
  };

  const handleEdit = (bookingId) => {
    setEditBookingId(bookingId); // Set the ID of the booking to be edited
    const bookingToEdit = bookings.find((booking) => booking.id === bookingId);
    //alert(JSON.stringify(bookingToEdit));
    const selectedPatient1 =
      "PID:" +
      bookingToEdit.PatientID +
      "," +
      bookingToEdit.PatientName +
      " (" +
      bookingToEdit.PatientPhoneNo +
      ")";
    setSelectedPatient(selectedPatient1);
    setIsEditMode(true);
    setTestType(bookingToEdit.testType);
    setRemarks(bookingToEdit.remarks);
    setSampleData({
      sampleName: bookingToEdit.sampleName,
      sampleDate: bookingToEdit.sampleDate,
      sampleTime: bookingToEdit.sampleTime,
      sampleTakerName: bookingToEdit.sampleTakerName,
    });

    setShowModal(true); // Open the modal for editing
  };

  return (
    <div style={{ fontSize: "13px" }} className="container mt-5">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>Sample Home Collection</h2>
      </header>
      <br />
      <Button
        style={{ fontSize: "13px" }}
        variant="secondary"
        onClick={handleCreateNew}
      >
        Create New
      </Button>{" "}
      <Link to={"/Pathologytest"}>
        <button
          style={{ marginLeft: "10px", fontSize: "13px" }}
          className="btn btn-primary btn"
        >
          Go Back
        </button>
      </Link>
      <Modal
        style={{ fontSize: "13px" }}
        backdrop="static"
        style={{ marginTop: "20px" }}
        centered
        show={showModal}
        onHide={() => {
          setShowModal(false);
          resetForm();
          setIsEditMode(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            Register/Update Sample
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group>
              <Form.Label>Select Patient:</Form.Label>
              <Form.Control
                as="select"
                style={{ fontSize: "13px" }}
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                required
                disabled={isEditMode}
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient.PatientID} value={patient.PatientID}>
                    PID:{patient.id},{patient.firstName} {patient.middleName}{" "}
                    {patient.lastName} ({patient.phoneNumberP})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Test Type:</Form.Label>
              <Form.Control
                as="select"
                style={{ fontSize: "13px" }}
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                required
              >
                <option value="">Select test</option>
                <option value="fast">Fast Test</option>
                <option value="normal">Normal Test</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Home Sample Name</Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "13px" }}
                placeholder="Enter Home Sample Name "
                value={sampleData.sampleName}
                onChange={(e) =>
                  setSampleData({ ...sampleData, sampleName: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Home Sample Date</Form.Label>
              <Form.Control
                type="date"
                style={{ fontSize: "13px" }}
                value={sampleData.sampleDate}
                onChange={(e) =>
                  setSampleData({ ...sampleData, sampleDate: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Home Sample Time</Form.Label>
              <Form.Control
                type="time"
                style={{ fontSize: "13px" }}
                value={sampleData.sampleTime}
                onChange={(e) =>
                  setSampleData({ ...sampleData, sampleTime: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Sample Taker Name</Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "13px" }}
                placeholder="Enter Sample taker Name "
                value={sampleData.sampleTakerName}
                onChange={(e) =>
                  setSampleData({
                    ...sampleData,
                    sampleTakerName: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                style={{ fontSize: "13px" }}
                required
                placeholder="Enter Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>
            <Button
              style={{ fontSize: "13px" }}
              variant="secondary"
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <InputGroup style={{ width: "20%" }} className="col-3 mt-3 mb-3">
        <FormControl
          style={{ fontSize: "13px" }}
          placeholder="Search by Patient Name"
          aria-label="Search by Patient Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />{" "}
      </InputGroup>
      <Table style={{ textAlign: "center" }} responsive striped bordered hover>
        <thead>
          <tr>
            <th style={{ whiteSpace: "nowrap" }}>Sr No</th>
            <th style={{ whiteSpace: "nowrap" }}>Patient Name</th>
            <th style={{ whiteSpace: "nowrap" }}>Patient Phone No</th>
            <th style={{ whiteSpace: "nowrap" }}>Sample Name</th>
            <th style={{ whiteSpace: "nowrap" }}>Sample Date</th>
            <th style={{ whiteSpace: "nowrap" }}>Sample Time</th>
            <th style={{ whiteSpace: "nowrap" }}>Sample Taker Name</th>
            <th style={{ whiteSpace: "nowrap" }}>Test Type</th>
            <th style={{ whiteSpace: "nowrap" }}>Remarks</th>
            <th style={{ whiteSpace: "nowrap" }}>Booked Date</th>
            <th style={{ whiteSpace: "nowrap" }}>Re-collection</th>
            <th style={{ whiteSpace: "nowrap" }}>ReCollected</th>
            <th style={{ textAlign: "center" }}>Manage</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {filteredBookings.map((booking, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {booking.PatientName}
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {booking.PatientPhoneNo}
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {booking.sampleName}
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {booking.sampleDate}
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {booking.sampleTime}
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {booking.sampleTakerName}
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {booking.testType}
              </td>
              <td style={{ textAlign: "center" }}>{booking.remarks}</td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {formatDate(booking.createdAt)}
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                <Button
                  style={{
                    fontSize: "13px",
                    marginTop: "0px",
                    padding: "4px 5px",
                  }}
                  className="btn btn-secondary"
                  onClick={() => handleReCollection(booking.id)}
                >
                  Add
                </Button>
              </td>
              <td style={{ textAlign: "center" }}>
                {booking.reCollection === "yes" ? (
                  <Button
                    style={{
                      fontSize: "13px",
                      marginTop: "0px",
                      padding: "4px 5px",
                    }}
                    className="btn btn-secondary"
                    onClick={() =>
                      handleViewReCollection(
                        booking.reCollectionDate,
                        booking.reCollectionTime
                      )
                    }
                  >
                    View
                  </Button>
                ) : (
                  "No"
                )}
              </td>

              <td style={{ whiteSpace: "nowrap" }}>
                <Button
                  style={{
                    marginTop: "0px",
                    fontSize: "13px",
                    padding: "4px 5px",
                  }}
                  className="btn btn-secondary"
                  onClick={() => handleEdit(booking.id)} // Call handleEdit with the booking ID
                >
                  Edit
                </Button>{" "}
                <Button
                  style={{
                    marginTop: "0px",
                    backgroundColor: "red",
                    fontSize: "13px",
                    padding: "4px 5px",
                  }}
                  variant="btn btn-secondary"
                  onClick={() => handleDeleteConfirmation(booking.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal
        show={deleteConfirmationId !== null}
        onHide={() => setDeleteConfirmationId(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this booking?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirmationId(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteConfirmed(deleteConfirmationId)} // Call handleDeleteConfirmed with the booking ID
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        style={{ fontSize: "13px" }}
        backdrop="static"
        style={{ marginTop: "20px" }}
        centered
        show={showReCollectionModal}
        onHide={() => {
          setShowReCollectionModal(false);
          setReCollectionForm({
            reCollection: "yes",
            reCollectionDate: "",
            reCollectionTime: "",
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            Add new Re-collection date and time
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReCollectionSubmit}>
            <Form.Group>
              <Form.Label>Re-collection</Form.Label>
              <Form.Control
                as="select"
                style={{ fontSize: "13px" }}
                value={reCollectionForm.reCollection}
                onChange={(e) =>
                  setReCollectionForm({
                    ...reCollectionForm,
                    reCollection: e.target.value,
                  })
                }
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Re-collection Date</Form.Label>
              <Form.Control
                type="date"
                style={{ fontSize: "13px" }}
                value={reCollectionForm.reCollectionDate}
                onChange={(e) =>
                  setReCollectionForm({
                    ...reCollectionForm,
                    reCollectionDate: e.target.value,
                  })
                }
                disabled={reCollectionForm.reCollection === "no"}
                required={reCollectionForm.reCollection === "yes"}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Re-collection Time</Form.Label>
              <Form.Control
                type="time"
                style={{ fontSize: "13px" }}
                value={reCollectionForm.reCollectionTime}
                onChange={(e) =>
                  setReCollectionForm({
                    ...reCollectionForm,
                    reCollectionTime: e.target.value,
                  })
                }
                disabled={reCollectionForm.reCollection === "no"}
                required={reCollectionForm.reCollection === "yes"}
              />
            </Form.Group>
            <Button
              style={{ fontSize: "13px" }}
              variant="secondary"
              type="submit"
            >
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        style={{ fontSize: "13px" }}
        backdrop="static"
        style={{ marginTop: "20px" }}
        centered
        show={showViewReCollectionModal}
        onHide={() => setShowViewReCollectionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            View Re-collection Date and Time
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Re-collection Date:</strong> {viewReCollectionDate}
          </p>
          <p>
            <strong>Re-collection Time:</strong> {viewReCollectionTime}
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default SampleCollectionForm;
