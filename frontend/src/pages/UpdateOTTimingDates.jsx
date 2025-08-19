import React, { useState, useEffect } from "react";
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

const localizer = momentLocalizer(moment);

const customInputStyles = {
  fontSize: "10px",
  // Add any other desired styles here
};

const BookingCalendar = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");

  useEffect(() => {
    // Fetch events from the Node.js backend
    fetchEvents();
  }, []);

  const reloadCount = localStorage.getItem("reloadCount1");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount1", "1");
  }
  localStorage.setItem("reloadCount2", "0");

  const messages = {
    today: "Today", // Modify the label for the "Today" button
    previous: "Previous", // Modify the label for the "Previous" button
    next: "Next", // Modify the label for the "Next" button
  };
  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllOtSheduledPatient`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const eventsData = response.data.map((event) => ({
        ...event,
        start: new Date(event.otDateTime),
        end: new Date(event.UpToOtTime),
        title: (
          <div>
            <strong>OT Name:</strong>
            {event.OTName}, <strong>Patient Name:</strong> {event.patientName},{" "}
            <strong> Patient Contact No.:</strong> {event.patientContactNumber},{" "}
            <strong>Surgeon Name:</strong> {event.surgeonName},{" "}
            <strong>Type of Surgery:</strong> {event.typeOfSurgery}
          </div>
        ),
        tooltip: `OT Name: ${event.OTName}, Patient Name: ${event.patientName}, Patient Contact No.: ${event.patientContactNumber}, Surgeon Name: ${event.surgeonName}, Type of Surgery: ${event.typeOfSurgery}`,
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
    fetch(`${import.meta.env.VITE_API_URL}/api/GetOTNameList`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOTData2(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleBookSlot = (slotInfo) => {
    const { start, end } = slotInfo;

    const overlapEvent = events.find(
      (event) =>
        (start >= event.start && start < event.end) ||
        (end > event.start && end <= event.end) ||
        (start <= event.start && end >= event.end)
    );

    if (overlapEvent) {
      // Slot is already booked, allow editing the booked event

      //alert(currentUser.email)
      if (currentUser.roles.includes("ROLE_ADMIN")) {
        setSelectedEvent(overlapEvent);
        setSelectedOT2(overlapEvent);
        setNewEventStart(overlapEvent.start);
        setNewEventEnd(overlapEvent.end);
        setShowEventModal(true);
      } else if (overlapEvent.surgeonEmail === currentUser.email) {
        setSelectedEvent(overlapEvent);
        setSelectedOT2(overlapEvent);
        setNewEventStart(overlapEvent.start);
        setNewEventEnd(overlapEvent.end);
        setShowEventModal(true);
      } else {
        toast.error(
          "You are not allowed to edit this event.Contact with Admin!"
        );
      }
    }
  };

  const formatDate = (dateString) => {
    const formattedDate = moment(
      dateString,
      "ddd MMM DD YYYY HH:mm:ss [GMT] ZZ"
    ).format("MM/DD/YYYY, hh:mm A");
    return formattedDate;
  };

  const handleEventModalSubmit = async () => {
    if (!newEventStart || !newEventEnd) {
      toast.error("Please select a date and time.");
      return;
    }

    const overlappingEvent = events.find(
      (event) =>
        event.id !== selectedEvent.id &&
        ((newEventStart >= event.start && newEventStart < event.end) ||
          (newEventEnd > event.start && newEventEnd <= event.end) ||
          (newEventStart <= event.start && newEventEnd >= event.end))
    );

    if (overlappingEvent) {
      toast.error("This timing is already booked for another event.");
      return;
    }

    try {
      const updatedEvent = {
        ...selectedEvent,
        otDateTime: formatDate(newEventStart),
        UpToOtTime: formatDate(newEventEnd),
      };
      if (
        selectedOT2.guardianContactNo &&
        selectedOT2.guardianContactNo.length < 10
      ) {
        toast.error("Enter Valid GuardianContactNo");
        return;
      }
      if (
        !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(updatedEvent.surgeonEmail)
      ) {
        toast.error("Enter Valid surgeonEmail");
        return;
      }
      // alert(selectedEvent.OTName);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/UpdateOTData/${selectedEvent.id}`,
        updatedEvent,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      toast.success("Event updated successfully.");

      setShowEventModal(false);
      setSelectedEvent(null);
      setNewEventStart("");
      setNewEventEnd("");
      fetchEvents(); // Refresh events
    } catch (error) {
      console.log("Error submitting event:", error);
      toast.error("Failed to submit the event.");
    }
  };

  const handleEventModalCancel = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
    setNewEventStart("");
    setNewEventEnd("");
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
    fontSize: "10px",
  };

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
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_DOCTOR") &&
    !currentUser.roles.includes("ROLE_OTTECHNICIAN")
  ) {
    // Redirect or show error message when the user is not an admin or doctor
    return "Access Denied";
    // You can handle the redirection or error message display as per your requirement
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        margin: "0 auto",
        fontSize: "10px",
      }}
    >
      <Calendar
        localizer={localizer}
        selectable
        events={events}
        onSelectSlot={handleBookSlot}
        style={calendarStyle}
        titleAccessor={(event) => event.title}
        tooltipAccessor={(event) => event.tooltip} // Use tooltipAccessor to display the tooltip content
        messages={messages} // Provide the custom messages
      />

      <Modal
        style={{ marginTop: "20px" }}
        centered
        style={{ fontSize: "12px" }}
        show={showEventModal}
        onHide={handleEventModalCancel}
      >
        <br></br>{" "}
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            Update Event of {selectedEvent && selectedEvent.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventStart">
              <Form.Label>Start Date</Form.Label>
              <DatePicker
                selected={newEventStart}
                onChange={handleStartChange}
                showTimeSelect
                timeFormat="hh:mm a"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd hh:mm a"
                className="form-control"
                placeholderText="Select start date and time"
              />
            </Form.Group>
            <Form.Group controlId="eventEnd">
              <Form.Label>End Date</Form.Label>
              <DatePicker
                selected={newEventEnd}
                onChange={handleEndChange}
                showTimeSelect
                timeFormat="hh:mm a"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd hh:mm a"
                className="form-control"
                placeholderText="Select end date and time"
                style={{ fontSize: "10px" }}
              />
              <style>{`
        .form-group .react-datepicker-wrapper .react-datepicker__input-container input {
            font-size: 10px;
        }
    `}</style>
            </Form.Group>

            <Form.Group controlId="OTName">
              <Form.Label>
                OT Name
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </Form.Label>
              <Form.Control
                as="select"
                required
                style={{ fontSize: "10px" }}
                value={selectedOT2.OTName}
                onChange={(e) => {
                  setSelectedEvent({
                    ...selectedEvent,
                    OTName: e.target.value,
                  });
                  setSelectedOT2({ ...selectedOT2, OTName: e.target.value });
                }}
                className="form-control col-4"
              >
                <option value="">Select an OT</option>
                {otData2.map((item) => (
                  <option key={item.id} value={item.OTName}>
                    {item.OTName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* <Form.Group controlId="patientName">
                            <Form.Label>Patient Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter patient name"
                                value={selectedOT2.patientName}
                                onChange={(e) => {
                                    setSelectedEvent({ ...selectedEvent, patientName: e.target.value })
                                    setSelectedOT2({ ...selectedOT2, patientName: e.target.value });

                                }}
                            />
                        </Form.Group> */}

            <Form.Group controlId="guardianName">
              <Form.Label>Guardian Name</Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "10px" }}
                placeholder="Enter guardian name"
                value={selectedOT2.guardianName}
                onChange={(e) => {
                  setSelectedEvent({
                    ...selectedEvent,
                    guardianName: e.target.value,
                  });
                  setSelectedOT2({
                    ...selectedOT2,
                    guardianName: e.target.value,
                  });
                }}
              />
            </Form.Group>

            <Form.Group controlId="guardianContactNumber">
              <Form.Label>Guardian Contact Number</Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "10px" }}
                placeholder="Enter guardian contact number"
                value={selectedOT2.guardianContactNo}
                onChange={(e) => {
                  const input = e.target.value;
                  const regex = /^[0-9]*$/;
                  if (input === "" || regex.test(input)) {
                    setSelectedEvent({
                      ...selectedEvent,
                      guardianContactNo: input,
                    });
                    setSelectedOT2({
                      ...selectedOT2,
                      guardianContactNo: input,
                    });
                  }
                }}
                onKeyDown={(e) => {
                  const input = e.target.value;
                  const regex = /^[0-9]*$/;
                  if (!regex.test(input) && e.keyCode !== 8) {
                    e.preventDefault();
                  }
                }}
                maxLength={10}
              />
              {selectedOT2.guardianContactNo &&
                selectedOT2.guardianContactNo.length < 10 && (
                  <span style={{ color: "red", fontSize: "10px" }}>
                    Phone number must be at least 10 digits
                  </span>
                )}
            </Form.Group>

            <Form.Group controlId="diagnosis">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "10px" }}
                placeholder="Enter diagnosis"
                value={selectedOT2.diagnosis}
                onChange={(e) => {
                  setSelectedEvent({
                    ...selectedEvent,
                    diagnosis: e.target.value,
                  });
                  setSelectedOT2({ ...selectedOT2, diagnosis: e.target.value });
                }}
              />
            </Form.Group>

            <Form.Group controlId="typeOfSurgery">
              <Form.Label>Type of Surgery</Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "10px" }}
                placeholder="Enter type of surgery"
                value={selectedOT2.typeOfSurgery}
                onChange={(e) => {
                  setSelectedEvent({
                    ...selectedEvent,
                    typeOfSurgery: e.target.value,
                  });
                  setSelectedOT2({
                    ...selectedOT2,
                    typeOfSurgery: e.target.value,
                  });
                }}
              />
            </Form.Group>

            <Form.Group controlId="surgeonName">
              <Form.Label>Surgeon Name</Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "10px" }}
                placeholder="Enter surgeon name"
                value={selectedOT2.surgeonName}
                onChange={(e) => {
                  setSelectedEvent({
                    ...selectedEvent,
                    surgeonName: e.target.value,
                  });
                  setSelectedOT2({
                    ...selectedOT2,
                    surgeonName: e.target.value,
                  });
                }}
              />
            </Form.Group>

            <Form.Group controlId="surgeonEmail">
              <Form.Label>Surgeon Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter surgeon email"
                value={selectedOT2.surgeonEmail}
                style={{ fontSize: "10px" }}
                onChange={(e) => {
                  setSelectedEvent({
                    ...selectedEvent,
                    surgeonEmail: e.target.value,
                  });
                  setSelectedOT2({
                    ...selectedOT2,
                    surgeonEmail: e.target.value,
                  });
                }}
                pattern="^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                required
              />
              {!/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(
                selectedOT2.surgeonEmail
              ) && <span style={{ color: "red" }}>Enter a valid email</span>}
            </Form.Group>

            <Form.Group controlId="external">
              <Form.Label>External</Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "10px" }}
                placeholder="Enter external"
                value={selectedOT2.external}
                onChange={(e) => {
                  setSelectedEvent({
                    ...selectedEvent,
                    external: e.target.value,
                  });
                  setSelectedOT2({ ...selectedOT2, external: e.target.value });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ fontSize: "10px", padding: "4px 5px" }}
            onClick={handleEventModalSubmit}
          >
            Update Event
          </Button>
          <Button
            variant="secondary"
            style={{
              fontSize: "10px",
              backgroundColor: "#777777",
              margintop: "10px",
              padding: "4px 5px",
            }}
            onClick={handleEventModalCancel}
          >
            Cancel
          </Button>
        </Modal.Footer>
        <br></br>
      </Modal>
    </div>
  );
};

export default BookingCalendar;
