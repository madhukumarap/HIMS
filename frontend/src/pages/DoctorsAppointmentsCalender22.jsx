import Webcam from "react-webcam";
import Select from "react-select"; // Add this line at the top of your file
import React, { useState, useEffect, useRef, Component } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import DatePicker from "react-datepicker";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { toast } from "react-toastify";
import "./print-styles.css";
import App from "../App";
const localizer = momentLocalizer(moment);

const datePickerStyle = {
  fontSize: "13px",
};
const customInputStyles = {
  fontSize: "13px",
};

const BookingCalendar = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("BOOK");
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");
  const [eventType, setEventType] = useState("doctorConsultation"); // Add this line
  const [paymentDateTime, setPaymentDateTime] = useState(null); // Add this line
  const [selectedSlotValue, setSelectedSlotValue] = useState("1");
  const [selectedOption, setSelectedOption] = useState("choose");
  ////////////
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadFile, setUploadFile] = useState({ preview: "", data: "" });
  const [showCamera, setShowCamera] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const openCamera = () => {
    setShowCamera(true);
  };
  const [facingMode, setFacingMode] = useState("user"); // Default is front camera
  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      setFacingMode("environment");
    }
  }, []);
  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log("imgSrc=", imageSrc);
    setCapturedImage(imageSrc);
    // Convert the image to a Blob
    const response = await fetch(imageSrc);
    const blob = await response.blob();

    // Read the Blob as a Data URL
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   const base64String = reader.result.split(",")[1]; // Extract the Base64 string
    //   setCapturedImage(base64String);
    // };
    // reader.readAsDataURL(blob);

    setShowCamera(false);
  };
  console.log("capture=", capture);
  console.log("captureImage=", capturedImage);
  const closeCamera = () => {
    setShowCamera(false);
  };

  const viewImage = () => {
    setShowModal(true);
    // alert("modal")
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const retakePicture = () => {
    setCapturedImage(null);
    closeModal();
  };
  /////////////////////////////
  const [selectedEvent2, setSelectedEvent2] = useState(null);
  const [showEventModal2, setShowEventModal2] = useState(false);
  const [newEventStart2, setNewEventStart2] = useState("");
  const [newEventEnd2, setNewEventEnd2] = useState("");
  // Inside your component
  const [pathologyTests, setPathologyTests] = useState([]);

  const [show, setShow] = useState(false);

  const [selectedTests, setSelectedTests] = useState([]);
  const handleTestChange = (selectedOptions) => {
    setSelectedTests(selectedOptions);
  };
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("notPaid"); // Set an initial value if needed
  const [amount, setAmount] = useState(0); // Set an initial value if needed
  const handleEventTypeChange = (event) => {
    setEventType(event.target.value);
  };
  console.log("pathologyTests:", pathologyTests);
  console.log("selectedTests:", selectedTests);

  useEffect(() => {
    if (true) {
      // Fetch pathology tests
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/getAllPathologyTests`)
        .then((response) => {
          setPathologyTests(
            response?.data?.tests.map((test) => ({
              label: test.testName,
              value: test.id, // You can use any unique identifier as the value
            })) || []
          );
        })
        .catch((error) => console.error(error));
    }
  }, []);

  const messages = {
    today: "Today", // Modify the label for the "Today" button
    previous: "Previous", // Modify the label for the "Previous" button
    next: "Next", // Modify the label for the "Next" button
  };

  const handlePaymentDateTimeChange = (date) => {
    setPaymentDateTime(date);
  };

  const [patientList, setPatientList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);

  useEffect(() => {
    fetchPatientList();
    fetchDoctorList();
  }, []);

  const fetchPatientList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getallPaitents`
      );
      setPatientList(response.data);
    } catch (error) {
      console.log("Error fetching patient list:", error);
    }
  };

  const fetchDoctorList = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const REMOTE_URL = `${API_BASE_URL}/api/getDoctorData`;
      // const newUrl = "http://localhost:8080/api/getDoctors";

      const response = await axios.get(REMOTE_URL);
      setDoctorList(response.data);
    } catch (error) {
      console.log("Error fetching doctor list:", error);
    }
  };

  let count = 0;
  useEffect(() => {
    // Fetch events from the Node.js backend

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllDoctorsAppointments`
      );
      const appointmentsData = response.data.appointments;

      const eventsData = appointmentsData.map((appointment) => ({
        ...appointment,
        start: new Date(appointment.bookingStartDate),
        end: new Date(appointment.bookingEndDate),
        title: (
          <div>
            <strong>Doctor Name:</strong> {appointment.DoctorName},
            <strong>Patient Name:</strong> {appointment.PatientName},
            <strong>Patient Contact No.:</strong> {appointment.PatientPhone}
          </div>
        ),
        tooltip: `Doctor Name: ${appointment.DoctorName}, Patient Name: ${appointment.PatientName}, Patient Contact No.: ${appointment.PatientPhone}`,
      }));

      setEvents(eventsData);
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  };

  const [otData2, setOTData2] = useState([]); // State to store the fetched data
  const [selectedOT2, setSelectedOT2] = useState({}); // State to store the selected OT

  useEffect(() => {
    // Fetch the data from the server
    fetch(`${import.meta.env.VITE_API_URL}/api/GetOTNameList`)
      .then((response) => response.json())
      .then((data) => {
        setOTData2(data);
      })
      .catch((error) => console.error(error));
  }, []);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const handleBookSlot = async (slotInfo) => {
    const { start, end } = slotInfo;

    // Check if the selected slot overlaps with any existing events
    const overlapEvent = events.find(
      (event) =>
        (start >= event.start && start < event.end) ||
        (end > event.start && end <= event.end) ||
        (start <= event.start && end >= event.end)
    );
    console.log(overlapEvent);
    if (overlapEvent) {
      // Slot is already booked, show alert
      //  toast.error('This slot is already booked.');
      {
        // alert(JSON.stringify(overlapEvent));
        if (overlapEvent && overlapEvent.DoctorName) {
          setSelectedDoctor(overlapEvent.doctorId);
        }

        if (
          currentUser.roles.includes("ROLE_ADMIN") ||
          currentUser.roles.includes("ROLE_RECEPTIONIST")
        ) {
          setSelectedEvent2(overlapEvent);
          //setSelectedOT2(overlapEvent);

          setNewEventStart2(overlapEvent.start);
          setNewEventEnd2(overlapEvent.end);
          setAmount(overlapEvent.amount);
          setPaymentStatus(overlapEvent.paymentStatus);

          setPaymentDateTime(new Date(overlapEvent.paymentDateTime));
          // alert(overlapEvent?.paymentDateTime);
          setShowEventModal2(true);
        } else if (overlapEvent.surgeonEmail === currentUser.email) {
          // setSelectedEvent2(overlapEvent);
          // setSelectedOT2(overlapEvent);
          // setNewEventStart2(overlapEvent.start);
          // setNewEventEnd2(overlapEvent.end);
          // setShowEventModal2(true);
        } else {
          toast.error(
            "You are not allowed to edit this event.Contact with Admin!",
            {
              style: { fontSize: "13px" },
            }
          );
        }
      }
    } else {
      // Slot is available, open the event modal
      setSelectedSlot(slotInfo);
      setShowEventModal(true);
    }
  };

  const formatDate = (dateString) => {
    const formattedDate = moment(
      dateString,
      "ddd MMM DD YYYY HH:mm:ss [GMT] ZZ"
    ).format("MM/DD/YYYY, hh:mm A");
    return formattedDate;
  };

  const handleEventModalSubmit2 = async () => {
    if (!newEventStart2 || !newEventEnd2) {
      toast.error("Please select a date and time.", {
        style: { fontSize: "13px" },
      });
      return;
    }

    const overlappingEvent = events.find(
      (event) =>
        event.id !== selectedEvent2.id &&
        ((newEventStart2 >= event.start && newEventStart2 < event.end) ||
          (newEventEnd2 > event.start && newEventEnd2 <= event.end) ||
          (newEventStart2 <= event.start && newEventEnd2 >= event.end))
    );

    if (overlappingEvent) {
      toast.error("This timing is already booked for another event.", {
        style: { fontSize: "13px" },
      });
      return;
    }
    if (newEventStart2 > newEventEnd2) {
      // Invalid timing, show toast message
      toast.error("Please select a valid timing.", {
        style: { fontSize: "13px" },
      });
      return;
    }

    try {
      const updatedEvent = {
        ...selectedEvent2,
        bookingStartDate: formatDate(newEventStart2),
        bookingEndDate: formatDate(newEventEnd2),
        doctorId: selectedDoctor,
        paymentStatus: paymentStatus,
        paymentDateTime: paymentDateTime,
        amount: amount,
      };
      if (!selectedDoctor) {
        toast.error("Please select Doctor", {
          style: { fontSize: "13px" },
        });
        return;
      }

      if (paymentStatus === "paid" && amount < 1) {
        toast.error("Please Enter Valid Amount.");
        return;
      }

      if (paymentStatus === "notPaid") {
        updatedEvent.amount = "0";
      }
      if (paymentStatus === "paid" && !paymentDateTime) {
        toast.error("Please Select PaymentDateTime.");
        return;
      }

      // alert(JSON.stringify(updatedEvent));
      // return;
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/updateDoctorsAppointment/${
          selectedEvent2.id
        }`,
        updatedEvent
      );
      toast.success("Event updated successfully.", {
        style: { fontSize: "13px" },
      });

      setShowEventModal2(false);
      setSelectedEvent2(null);
      setNewEventStart2("");
      setNewEventEnd2("");
      fetchEvents(); // Refresh events
    } catch (error) {
      console.log("Error submitting event:", error);
      toast.error("Failed to submit the event.", {
        style: { fontSize: "13px" },
      });
    }
  };

  const handleEventModalCancel2 = () => {
    setShowEventModal2(false);
    setSelectedEvent2(null);
    setNewEventStart2("");
    setSelectedDoctor("");
    setSelectedPatient("");
    setAmount(0);
    setPaymentDateTime("");
    setPaymentStatus("notPaid");

    setNewEventStart2("");
    setNewEventEnd2("");
    setNewEventEnd2("");
  };

  const handleStartChange2 = (date) => {
    setNewEventStart2(date);
  };

  const handleEndChange2 = (date) => {
    setNewEventEnd2(date);
  };
  //
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    // Reset captured image when the user changes the selection
    setCapturedImage(null);
    // Close the camera if it's open when the user changes the selection
    if (showCamera) {
      closeCamera();
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      const imageUrl = {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        preview: URL.createObjectURL(file),
        data: base64String,
      };

      // alert(JSON.stringify(imageUrl));
      setUploadFile(imageUrl);
    };

    reader.readAsDataURL(file);
  };

  // console.log("capture Image2=", URL.createObjectURL(capturedImage))
  //
  const handleEventModalSubmit = async () => {
    const selectedEventType = document.getElementById("eventType")?.value;
    // alert(selectedEventType);
    if (!selectedEventType) {
      toast.error("Please select an event type.", {
        style: { fontSize: "13px" },
      });
      return;
    }

    switch (selectedEventType) {
      case "doctorConsultation":
        handleDoctorConsultationSubmit();
        break;
      case "pathologistTest":
        handlePathologistTestSubmit();
        break;
      case "hospitalAdmission":
        handleHospitalAdmissionSubmit();
        break;
      default:
        toast.error("Invalid event type selected.", {
          style: { fontSize: "13px" },
        });
    }
  };

  const slotToMinutes = {
    "1 slot": 30,
    "2 slots": 60,
    "3 slots": 90,
    // Add more slots as needed
  };

  const handleDoctorConsultationSubmit = async () => {
    const selectedPatientId = document.getElementById("patient")?.value;
    const selectedDoctorId = document.getElementById("doctor")?.value;

    if (
      !selectedPatientId ||
      !selectedDoctorId ||
      !newEventStart ||
      !paymentStatus
    ) {
      toast.error("Please fill in all required fields.", {
        style: { fontSize: "13px" },
      });
      return;
    }
    if (paymentStatus === "paid" && amount < 1) {
      toast.error("Please Enter Valid Amount.");
      return;
    }
    if (paymentStatus === "notPaid" && (amount < 0 || amount !== 0)) {
      setAmount("0");
    }
    if (paymentStatus === "paid" && !paymentDateTime) {
      toast.error("Please Select PaymentDateTime.");
      return;
    }

    const newBookingStartDate = moment(newEventStart)
      .add(30 * selectedSlotValue, "minutes")
      .toDate();
    //
    const formData = new FormData();
    formData.append("patientId", selectedPatientId);
    formData.append("doctorId", selectedDoctorId);

    formData.append("amount", amount);
    formData.append("paymentDateTime", paymentDateTime);
    formData.append(
      "bookingStartDate",
      moment(newEventStart).utcOffset("+05:30").toDate()
    );
    formData.append("bookingEndDate", newBookingStartDate);
    formData.append("paymentStatus", paymentStatus);
    // formData.append("hospitalAdminEmail", hospitalAdminEmail);
    //
    alert(JSON.stringify(uploadFile));
    if (capturedImage) {
      // sendingImage = capturedImage
      formData.append("capturedImage", capturedImage);
    } else {
      let formData = new FormData();
      // alert(JSON.stringify(uploadFile.data))
      console.log("line 491=", uploadFile.data);
      // formData.append('File', uploadFile.data)
      formData.append("capturedImage", uploadFile.data);

      console.log("formData=", formData);

      // sendingImage = formData
    }
    formData.append("capturedImage", uploadFile.data);
    // alert(sendingImage);
    // console.log("sendingImage=", sendingImage)
    const eventData = {
      patientId: selectedPatientId,
      doctorId: selectedDoctorId,
      capturedImage: capturedImage,
      paymentStatus: paymentStatus,
      amount: amount,
      paymentDateTime: paymentDateTime,
      bookingStartDate: moment(newEventStart).utcOffset("+05:30").toDate(),
      bookingEndDate: newBookingStartDate,
    };

    console.log("eventData=", eventData);

    //alert(newBookingStartDate);
    // alert(JSON.stringify(eventData));
    //return;
    // Add the logic to send data to the server for doctor consultation
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/createDoctorsAppointment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Doctor Consultation created successfully.", {
          style: { fontSize: "13px" },
        });
        fetchEvents();
        // Reset state and close the modal
        setShowEventModal(false);
        setNewEventTitle("");
        setSelectedSlot(null);
      } else {
        // Handle error response...
      }
    } catch (error) {
      console.log("Error creating Doctor Consultation:", error);
      toast.error("Failed to create Doctor Consultation.", {
        style: { fontSize: "13px" },
      });
    }
  };

  const handlePathologistTestSubmit = async () => {
    //alert(selectedPatient);
    const selectedDoctorId = document.getElementById("doctor")?.value;

    if (!selectedPatient || !selectedTests.length) {
      toast.error("Please select a patient and at least one test.", {
        style: { fontSize: "13px" },
      });
      return;
    }
    if (paymentStatus === "paid" && amount < 1) {
      toast.error("Please Enter Valid Amount.");
      return;
    }
    if (paymentStatus === "notPaid" && (amount < 0 || amount !== 0)) {
      setAmount("0");
    }
    if (paymentStatus === "paid" && !paymentDateTime) {
      toast.error("Please Select PaymentDateTime.");
      return;
    }
    const eventData = {
      patientId: selectedPatient,
      doctorId: selectedDoctorId,
      tests: selectedTests.map((test) => test.value),
      paymentStatus: paymentStatus,
      amount: amount,
      paymentDateTime: moment(paymentDateTime).utcOffset("+05:30").toDate(),
    };

    // alert(JSON.stringify(eventData));
    //return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/createEventForPathology`,
        eventData
      );
      if (response.status === 200) {
        toast.success("Pathologist Test created successfully.", {
          style: { fontSize: "13px" },
        });
        // Reset state and close the modal
        setShowEventModal(false);
        setSelectedDoctor("");
        setSelectedPatient("");
        setAmount("");
        setPaymentStatus("");
        setEventType("");
        setPaymentDateTime("");
        setSelectedTests([]);
      } else {
        // Handle error response...
      }
    } catch (error) {
      console.log("Error creating Pathologist Test:", error);
      toast.error("Failed to create Pathologist Test." + error, {
        style: { fontSize: "13px" },
      });
    }
  };

  const handleHospitalAdmissionSubmit = async () => {
    if (!selectedPatient || !additionalInfo) {
      toast.error("Please fill in all required fields.", {
        style: { fontSize: "13px" },
      });
      return;
    }

    const eventData = {
      patientId: selectedPatient,
      additionalInfo,
      // Add other fields specific to this event type
    };
    // alert(JSON.stringify(eventData));
    if (paymentStatus === "paid" && amount < 1) {
      toast.error("Please Enter Valid Amount.");
      return;
    }
    if (paymentStatus === "notPaid" && (amount < 0 || amount !== 0)) {
      setAmount("0");
    }
    if (paymentStatus === "paid" && !paymentDateTime) {
      toast.error("Please Select PaymentDateTime.");
      return;
    }
    setShowEventModal(false);
    return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/createHospitalAdmission`, // Replace with your actual endpoint
        eventData
      );
      if (response.status === 200) {
        toast.success("Hospital Admission created successfully.", {
          style: { fontSize: "13px" },
        });
        // Reset state and close the modal
        setShowEventModal(false);
        setAdditionalInfo("");
      } else {
        // Handle error response...
      }
    } catch (error) {
      console.log("Error creating Hospital Admission:", error);
      toast.error("Failed to create Hospital Admission.", {
        style: { fontSize: "13px" },
      });
    }
  };

  const handleEventModalCancel = () => {
    setShowEventModal(false);
    setNewEventTitle("");
    setSelectedSlot(null);
    setSelectedDoctor("");
    setNewEventStart("");
    setNewEventEnd("");
    setAmount("");
    setSelectedDoctor("");
    setSelectedPatient("");
    setPaymentDateTime("");
    setPaymentStatus("");
    setSelectedTests("");
    // window.location.reload();
  };

  const handleStartChange = (date) => {
    setNewEventStart(date);
  };

  const handleEndChange = (date) => {
    setNewEventEnd(date);
  };

  const calendarStyle = {
    height: 500, // Set the desired height of the calendar
    width: "100%", // Set the desired width of the calendar
  };

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

  const currentUser = AuthService.getCurrentUser();

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
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_RECEPTIONIST") &&
    !currentUser.roles.includes("ROLE_DOCTOR")
  ) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return "Access Denied";
    // You can handle the redirection or error message display as per your requirement
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "15px", // Adjust the height as per your requirement
    }),
    input: (provided) => ({
      ...provided,
      minHeight: "15px", // Adjust the height as per your requirement
    }),
  };

  return (
    <div style={style}>
      <Button
        variant="secondary"
        style={{ fontSize: "13px", marginBottom: "10px" }}
        onClick={() => setShowEventModal(true)}
      >
        Book Now
      </Button>

      <Calendar
        localizer={localizer}
        selectable
        events={events}
        onSelectSlot={handleBookSlot}
        style={calendarStyle}
        titleAccessor={(event) => event.title}
        tooltipAccessor={(event) => event.tooltip} // Use tooltipAccessor to display the tooltip content
        messages={messages}
      />
      <Modal
        backdrop="static"
        size="lg"
        style={{ marginTop: "20px" }}
        centered
        show={showEventModal}
        onHide={handleEventModalCancel}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            Create New Booking
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventType">
              <Form.Label
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginTop: "10px",
                }}
              >
                Event Type <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                style={{ fontSize: "13px", marginTop: "10px" }}
                as="select"
                value={eventType}
                onChange={handleEventTypeChange}
              >
                <option value="">Select Event Type</option>
                <option value="doctorConsultation">Doctor Consultation</option>
                <option value="pathologistTest">Pathologist Test</option>
                <option value="hospitalAdmission">Hospital Admission</option>
              </Form.Control>
            </Form.Group>

            {eventType === "doctorConsultation" && (
              <>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="patient">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        Select Patient <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{
                          fontSize: "13px",

                          marginTop: "10px",
                        }}
                      >
                        <option value="">Select a Patient</option>
                        {patientList.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.mr} {patient.firstName} {patient.lastName}{" "}
                            ({patient.phoneNumberP})
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="doctor">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        Select Doctor <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                      >
                        <option value="">Select a Doctor</option>
                        {doctorList.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            Dr {doctor.FirstName} {doctor.MiddleName}{" "}
                            {doctor.LastName} ({doctor.phoneNo})
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>
                <br></br>

                {/* dropdown for chosen image */}
                <div>
                  <h2>Image Capture</h2>
                  <div className="row">
                    <div className="col-md-6">
                      <label
                        htmlFor="imageOption"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          marginRight: "20px",
                          marginTop: "10px",
                        }}
                      >
                        Choose Image Source:{" "}
                      </label>
                      <select
                        id="imageOption"
                        value={selectedOption}
                        onChange={handleOptionChange}
                      >
                        <option value="choose">Choose an option</option>
                        <option value="camera">Capture Image</option>
                        <option value="file">Choose File</option>
                      </select>

                      {selectedOption === "camera" &&
                        !showCamera &&
                        !capturedImage && (
                          <Button
                            style={{ fontSize: "12px" }}
                            variant="secondary"
                            onClick={openCamera}
                          >
                            Open Camera
                          </Button>
                        )}

                      {selectedOption === "file" && !capturedImage && (
                        <input
                          type="file"
                          onChange={(e) => handleImageChange(e)}
                        />
                      )}

                      {capturedImage && (
                        <button
                          style={{ fontSize: "12px" }}
                          onClick={viewImage}
                        >
                          View Image
                        </button>
                      )}

                      {showCamera && (
                        <>
                          <br />
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            style={{
                              width: "100%",
                              maxWidth: "600px",
                              margin: "0 auto",
                            }}
                            screenshotFormat="image/png"
                            videoConstraints={{
                              facingMode: "user",
                              frameRate: 30,
                            }}
                          />
                          {!capturedImage ? (
                            <Button
                              variant="secondary"
                              style={{ fontSize: "12px", marginTop: "0px" }}
                              onClick={capture}
                            >
                              Capture Photo
                            </Button>
                          ) : (
                            <Button
                              style={{ fontSize: "12px" }}
                              variant="success"
                              onClick={viewImage}
                            >
                              View Image
                            </Button>
                          )}
                          <Button
                            style={{ fontSize: "12px" }}
                            variant="danger"
                            onClick={closeCamera}
                          >
                            Close Camera
                          </Button>{" "}
                        </>
                      )}

                      {capturedImage ? (
                        <div>
                          <h3>Selected Image:</h3>
                          <img
                            src={capturedImage}
                            alt="Captured"
                            style={{ maxWidth: "100%" }}
                          />
                        </div>
                      ) : (
                        <div>
                          <h3>Selected Image:</h3>
                          <img
                            src={uploadFile.preview}
                            alt="Captured"
                            style={{ maxWidth: "100%" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* dropdown for chosen image */}

                {/* <div className="row">
                  <br></br>
                  <div className="col-md-6">
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        marginRight: "20px",
                        marginTop: "10px",
                      }}
                    >
                      Capture Image:{" "}
                    </label>
                    {!showCamera && !capturedImage && (
                      <Button
                        style={{ fontSize: "12px" }}
                        variant="secondary"
                        onClick={openCamera}
                      >
                        Open Camera
                      </Button>
                    )}

                    {capturedImage && (
                      <Button
                        style={{ fontSize: "12px" }}
                        variant="success"
                        onClick={viewImage}
                      >
                        View Image
                      </Button>
                    )}

                    {showCamera && (
                      <>
                        <br></br>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          style={{
                            width: "100%",
                            maxWidth: "600px", // Adjust max-width as needed
                            margin: "0 auto", // Center the webcam
                          }}
                          screenshotFormat="image/png"
                          videoConstraints={{ facingMode, frameRate: 30 }}
                        />
                        {!capturedImage ? (
                          <>
                            <Button
                              variant="secondary"
                              style={{ fontSize: "12px", marginTop: "0px" }}
                              onClick={capture}
                            >
                              Capture Photo
                            </Button>

                             <Button
                              style={{ fontSize: "12px" }}
                              variant="secondary"
                              onClick={toggleCamera}
                            >
                              Switch Camera
                            </Button> 
                            
                          </>
                        ) : (
                          <Button
                            style={{ fontSize: "12px" }}
                            variant="success"
                            onClick={viewImage}
                          >
                            View Image
                          </Button>
                        )}
                        <Button
                          style={{ fontSize: "12px" }}
                          variant="danger"
                          onClick={closeCamera}
                        >
                          Close Camera
                        </Button>{" "}
                      </>
                    )}
                  </div>
                </div> */}

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="eventStart">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        Consultation Date & Time{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <DatePicker
                        style={{
                          fontSize: "10px",

                          marginTop: "10px",
                        }}
                        selected={newEventStart}
                        onChange={handleStartChange}
                        showTimeSelect
                        timeFormat="hh:mm a"
                        timeIntervals={15}
                        minDate={new Date()}
                        dateFormat="yyyy-MM-dd hh:mm a"
                        className="form-control custom-datetime-picker"
                        placeholderText="Select start Date & Time"
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="slot">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        Select Slot <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                        value={selectedSlotValue}
                        onChange={(e) => setSelectedSlotValue(e.target.value)}
                      >
                        <option value="1">1-Slot</option>
                        <option value="2">2-Slots</option>
                        <option value="3">3-Slots</option>
                        <option value="4">4-Slots</option>
                        <option value="5">5-Slots</option>
                        <option value="6">6-Slots</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>
                {/* <Form.Group controlId="eventEnd">
                  <Form.Label style={{ fontSize: "13px", marginTop: "10px" }}>
                    End Date <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <DatePicker
                    style={datePickerStyle}
                    selected={newEventEnd}
                    onChange={handleEndChange}
                    showTimeSelect
                    timeFormat="hh:mm a"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd hh:mm a"
                    className="form-control custom-datetime-picker"
                    placeholderText="Select end date and time"
                  />
                </Form.Group> */}
              </>
            )}

            {eventType === "pathologistTest" && (
              <>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="patient">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        Select Patient <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                        value={selectedPatient} // Set the value to the selectedPatient state
                        onChange={(e) => setSelectedPatient(e.target.value)} // Handle onChange event
                      >
                        <option value="">Select a Patient</option>
                        {patientList.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.mr} {patient.firstName} {patient.lastName}{" "}
                            ({patient.phoneNumberP})
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="doctor">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        Referral Doctor <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                      >
                        <option value="">Select a Doctor</option>
                        {doctorList.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            Dr {doctor.FirstName} {doctor.MiddleName}{" "}
                            {doctor.LastName} ({doctor.phoneNo})
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Form.Group controlId="test">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        Select Test(s) <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Select
                        required
                        className=" custom-datetime-picker"
                        isMulti
                        options={pathologyTests} // Load this from your API
                        value={selectedTests}
                        onChange={handleTestChange}
                      />
                    </Form.Group>
                  </div>
                </div>
              </>
            )}

            {eventType === "hospitalAdmission" && (
              <Form.Group controlId="additionalInfo">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="patient">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        Select Patient <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                        required
                        value={selectedPatient} // Set the value to the selectedPatient state
                        onChange={(e) => setSelectedPatient(e.target.value)} // Handle onChange event
                      >
                        <option value="">Select a Patient</option>
                        {patientList.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.mr} {patient.firstName} {patient.lastName}{" "}
                            ({patient.phoneNumberP})
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Label
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginTop: "10px",
                      }}
                    >
                      Additional Information{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      style={{ fontSize: "13px", marginTop: "10px" }}
                      placeholder="Enter Additional info"
                      type="text"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                    />
                  </div>
                </div>
              </Form.Group>
            )}

            <>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="paymentStatus">
                    <Form.Label
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginTop: "10px",
                      }}
                    >
                      Select Payment Status{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      style={{ fontSize: "13px", marginTop: "10px" }}
                      s
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="paid">Paid</option>
                      <option value="notPaid">Not Paid</option>
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="amount">
                    <Form.Label
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginTop: "10px",
                      }}
                    >
                      Amount
                    </Form.Label>
                    <Form.Control
                      style={{ fontSize: "13px", marginTop: "10px" }}
                      type="number"
                      placeholder="Enter Fees"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <Form.Group controlId="paymentDateTime">
                    <Form.Label
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginTop: "10px",
                      }}
                    >
                      Payment Date & Time
                    </Form.Label>
                    <DatePicker
                      selected={paymentDateTime}
                      onChange={(date) => setPaymentDateTime(date)}
                      showTimeSelect
                      timeFormat="hh:mm a"
                      dateFormat="yyyy-MM-dd hh:mm a"
                      minDate={new Date()}
                      className="form-control custom-datetime-picker"
                      placeholderText="Select payment date and time"
                    />
                  </Form.Group>
                </div>

                {eventType === "pathologistTest" && (
                  <div className="col-6">
                    <Form.Group controlId="eventStart">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        Booking Date & Time{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <DatePicker
                        style={{
                          fontSize: "10px",
                          marginTop: "10px",
                        }}
                        selected={newEventStart}
                        onChange={handleStartChange}
                        showTimeSelect
                        timeFormat="hh:mm a"
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd hh:mm a"
                        minDate={new Date()}
                        className="form-control custom-datetime-picker"
                        placeholderText="Select Booking Date & Time"
                      />
                    </Form.Group>
                  </div>
                )}
              </div>
            </>

            {/* {eventType === "hospitalAdmission" && (
              <>
                <Form.Group controlId="paymentStatus">
                  <Form.Label style={{ fontSize: "13px", marginTop: "10px" }}>
                    Select Payment Status{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    style={{ fontSize: "13px", marginTop: "10px" }}
                    s
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="paid">Paid</option>
                    <option value="notPaid">Not Paid</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="amount">
                  <Form.Label style={{ fontSize: "13px", marginTop: "10px" }}>
                    Amount
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "13px", marginTop: "10px" }}
                    type="number"
                    placeholder="Enter Fees"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="paymentDateTime">
                  <Form.Label style={{ fontSize: "13px", marginTop: "10px" }}>
                    Payment Date and Time
                  </Form.Label>
                  <DatePicker
                    selected={paymentDateTime}
                    onChange={(date) => setPaymentDateTime(date)}
                    showTimeSelect
                    timeFormat="hh:mm a"
                    dateFormat="yyyy-MM-dd hh:mm a"
                    className="form-control custom-datetime-picker"
                    placeholderText="Select payment date and time"
                  />
                </Form.Group>
              </>
            )} */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "12px", marginTop: "2px" }}
            variant="secondary"
            onClick={handleEventModalSubmit}
          >
            Save Booking
          </Button>
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={handleEventModalCancel}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        style={{ marginTop: "20px" }}
        centered
        style={{ fontSize: "13px" }}
        show={showEventModal2}
        size="lg"
        onHide={handleEventModalCancel2}
      >
        <br />
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "13px" }}>
            Update Event of {selectedEvent2 && selectedEvent2.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="selectDoctor">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    Select Doctor <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    required
                    style={{ fontSize: "13px" }}
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="form-control col-4"
                  >
                    <option value="">Select a Doctor</option>
                    {doctorList.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr {doctor.FirstName} {doctor.MiddleName}{" "}
                        {doctor.LastName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="eventStart">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    Start Date <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <DatePicker
                    selected={newEventStart2}
                    onChange={handleStartChange2}
                    showTimeSelect
                    timeFormat="hh:mm a"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd hh:mm a"
                    className="form-control custom-datetime-picker"
                    placeholderText="Select start date and time"
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="eventEnd">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    End Date <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <DatePicker
                    selected={newEventEnd2}
                    onChange={handleEndChange2}
                    showTimeSelect
                    timeFormat="hh:mm a"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd hh:mm a"
                    className="form-control custom-datetime-picker"
                    placeholderText="Select end date and time"
                    style={{ fontSize: "12px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="paymentStatus">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    Payment Status <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    required
                    style={{ fontSize: "13px" }}
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="form-control col-4"
                  >
                    <option value="notPaid">Not Paid</option>
                    <option value="paid">Paid</option>
                  </Form.Control>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              {paymentStatus === "paid" && (
                <div className="col-6">
                  <Form.Group controlId="amount">
                    <Form.Label
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginTop: "10px",
                      }}
                    >
                      Amount <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      required
                      style={{ fontSize: "13px" }}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="form-control col-4"
                    />
                  </Form.Group>
                </div>
              )}
              {paymentStatus === "paid" && (
                <div className="col-6">
                  <Form.Group controlId="paymentDateTime">
                    <Form.Label
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginTop: "10px",
                      }}
                    >
                      Payment Date and Time{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <DatePicker
                      selected={paymentDateTime}
                      onChange={handlePaymentDateTimeChange}
                      showTimeSelect
                      timeFormat="hh:mm a"
                      timeIntervals={15}
                      dateFormat="yyyy-MM-dd hh:mm a"
                      className="form-control custom-datetime-picker"
                      placeholderText="Select payment date and time"
                    />
                  </Form.Group>
                </div>
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ fontSize: "12px", padding: "4px 5px" }}
            onClick={handleEventModalSubmit2}
          >
            Update Event
          </Button>
          <Button
            variant="secondary"
            style={{
              fontSize: "12px",
              backgroundColor: "#777777",
              margintop: "10px",
              padding: "4px 5px",
            }}
            onClick={handleEventModalCancel2}
          >
            Cancel
          </Button>
        </Modal.Footer>
        <br />
      </Modal>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>Captured Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {capturedImage && (
            <img src={capturedImage} alt="Captured" style={{ width: "100%" }} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ marginTop: "20px" }}
            centered
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={retakePicture}
          >
            Retake Picture
          </Button>{" "}
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={closeModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingCalendar;
