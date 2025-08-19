import React, { useState, useEffect, Component } from "react";
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
import App from "../App";
const localizer = momentLocalizer(moment);

const customInputStyles = {
  fontSize: "12px",
  // Add any other desired styles here
};

const BookingCalendar = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("BOOK");
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");

  const messages = {
    today: "Today", // Modify the label for the "Today" button
    previous: "Previous", // Modify the label for the "Previous" button
    next: "Next", // Modify the label for the "Next" button
  };

  const reloadCount = localStorage.getItem("reloadCount1");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount1", "1");
  }
  localStorage.setItem("reloadCount2", "0");

  let count = 0;
  useEffect(() => {
    // Fetch events from the Node.js backend

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllOtSheduledPatient`
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

  const handleBookSlot = (slotInfo) => {
    const { start, end } = slotInfo;

    // Check if the selected slot overlaps with any existing events
    const overlapEvent = events.find(
      (event) =>
        (start >= event.start && start < event.end) ||
        (end > event.start && end <= event.end) ||
        (start <= event.start && end >= event.end)
    );

    if (overlapEvent) {
      // Slot is already booked, show alert
      toast.error("This slot is already booked.", {
        style: { fontSize: "12px" },
      });
    } else {
      // Slot is available, open the event modal
      setSelectedSlot(slotInfo);
      setShowEventModal(true);
    }
  };

  const handleEventModalSubmit = async () => {
    if (!newEventStart || !newEventEnd) {
      toast.error("Please Select Date.", {
        style: { fontSize: "12px" },
      });
    }
    if (newEventTitle && newEventStart && newEventEnd) {
      // Convert start and end times to Indian time format
      const start = moment(newEventStart).utcOffset("+05:30").toDate();
      const end = moment(newEventEnd).utcOffset("+05:30").toDate();

      // Check if the selected slot overlaps with any existing events
      const overlapEvent = events.find(
        (event) =>
          (start >= event.start && start < event.end) ||
          (end > event.start && end <= event.end) ||
          (start <= event.start && end >= event.end)
      );

      if (overlapEvent) {
        // Slot is already booked, show alert
        //   alert('This slot is already booked.');
        toast.error("This slot is already booked.", {
          style: { fontSize: "12px" },
        });
      } else if (start > end) {
        // Invalid timing, show toast message
        toast.error("Please select a valid timing.", {
          style: { fontSize: "12px" },
        });
      } else {
        // Navigate to the booking page with the selected start and end times

        navigate({
          pathname: "/OTBookingForm",
          search: `?start=${start}&end=${end}`,
        }); // Close the modal and reset the form fields
        setShowEventModal(false);
        setNewEventTitle("");
        setSelectedSlot(null);
      }
    }
  };

  const handleEventModalCancel = () => {
    setShowEventModal(false);
    setNewEventTitle("");
    setSelectedSlot(null);
    window.location.reload();
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
    width: "98%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,

    fontSize: "10px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "14px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "12px" /* Adjust the font size for <h3> */,
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
        <Modal.Header closeButton>
          <Modal.Title style={h1Style}>Create New Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* <Form.Group controlId="eventTitle">
                            <Form.Label>Event Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter event title"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                            />
                        </Form.Group> */}
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
                styles={customStyles}
                onChange={handleEndChange}
                showTimeSelect
                timeFormat="hh:mm a"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd hh:mm a"
                className="form-control"
                placeholderText="Select end date and time"
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
            Continue Booking
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
      </Modal>
    </div>
  );
};

export default BookingCalendar;
