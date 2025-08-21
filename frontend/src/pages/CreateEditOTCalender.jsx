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
import { registerLocale } from "react-datepicker";
import { fr, enIN } from "date-fns/locale";
import "moment/locale/fr";

import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { toast } from "react-toastify";
import App from "../App";
import Translation from "../translations/CreateEditOTCalender.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const localizer = momentLocalizer(moment);

const customInputStyles = {
  fontSize: "13px",
  // Add any other desired styles here
};

const BookingCalendar = () => {
  const navigate = useNavigate();
  const today = new Date();
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate());
  const { t } = useTranslation();
  registerLocale("fr", fr);
  registerLocale("en", enIN);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  useEffect(() => {
    const initializei18n = () => {
      const resources = {
        en: {
          translation: Translation["en"],
        },
        fr: {
          translation: Translation["fr"],
        },
      };

      const storedLanguage = localStorage.getItem("SelectedLanguage");
      const defaultLanguage = storedLanguage || "en";

      i18n.use(initReactI18next).init({
        resources,
        lng: defaultLanguage,
        fallbackLng: "en",
        interpolation: {
          escapeValue: false,
        },
      });
    };

    initializei18n();
  }, []);

  useEffect(() => {
    // Retrieve selected language from local storage
    const storedLanguage = localStorage.getItem("SelectedLanguage");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
  }, []);
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("BOOK");
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");

  /////////////////////////////
  const [selectedEvent2, setSelectedEvent2] = useState(null);
  const [showEventModal2, setShowEventModal2] = useState(false);
  const [newEventStart2, setNewEventStart2] = useState("");
  const [newEventEnd2, setNewEventEnd2] = useState("");

  const messages = {
    today: t("Today"),
    previous: t("Previous"),
    next: t("Next"),
    month: t("Month"),
    week: t("Week"),
    day: t("Day"),
    agenda: t("Agenda"),
    noEventsInRange: t("NoEventsInThisRange"),
  };

  let count = 0;
  useEffect(() => {
    // Fetch events from the Node.js backend

    fetchEvents();
  }, []);

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
            <strong>{t("OTName")}:</strong> {event.OTName},{" "}
            <strong>{t("PatientName")}:</strong> {event.patientName},{" "}
            <strong>{t("PatientContactNo")}:</strong>{" "}
            {event.patientContactNumber}, <strong>{t("SurgeonName")}:</strong>{" "}
            {event.surgeonName}, <strong>{t("TypeofSurgery")}:</strong>{" "}
            {event.typeOfSurgery}
          </div>
        ),
        tooltip: `${t("OTName")}: ${event.OTName}, ${t("PatientName")}: ${
          event.patientName
        }, ${t("PatientContactNo")}: ${event.patientContactNumber}, ${t(
          "SurgeonName"
        )}: ${event.surgeonName}, ${t("TypeofSurgery")}: ${
          event.typeOfSurgery
        }`,
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

    // Check if the selected slot overlaps with any existing events
    const overlapEvent = events.find(
      (event) =>
        (start >= event.start && start < event.end) ||
        (end > event.start && end <= event.end) ||
        (start <= event.start && end >= event.end)
    );

    if (overlapEvent) {
      // Slot is already booked, show alert
      //  toast.error('This slot is already booked.');
      {
        //alert(currentUser.email)
        if (
          currentUser.roles.includes("ROLE_ADMIN") ||
          currentUser.roles.includes("ROLE_OTTECHNICIAN")
        ) {
          setSelectedEvent2(overlapEvent);
          setSelectedOT2(overlapEvent);
          setNewEventStart2(overlapEvent.start);

          setNewEventEnd2(overlapEvent.end);
          setShowEventModal2(true);
        } else if (overlapEvent.surgeonEmail === currentUser.email) {
          setSelectedEvent2(overlapEvent);
          setSelectedOT2(overlapEvent);
          setNewEventStart2(overlapEvent.start);
          setNewEventEnd2(overlapEvent.end);
          setShowEventModal2(true);
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
        otDateTime: formatDate(newEventStart2),
        UpToOtTime: formatDate(newEventEnd2),
      };
      if (
        selectedOT2.guardianContactNo &&
        selectedOT2.guardianContactNo.length < 10
      ) {
        toast.error("Enter Valid GuardianContactNo", {
          style: { fontSize: "13px" },
        });
        return;
      }
      if (
        !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(updatedEvent.surgeonEmail)
      ) {
        toast.error("Enter Valid surgeonEmail", {
          style: { fontSize: "13px" },
        });
        return;
      }
      // alert(selectedEvent.OTName);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/UpdateOTData/${selectedEvent2.id}`,
        updatedEvent,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      toast.success(t("Eventupdatedsuccessfully"), {
        style: { fontSize: "13px" },
      });

      setShowEventModal2(false);
      setSelectedEvent2(null);
      setNewEventStart2("");
      setNewEventEnd2("");
      fetchEvents(); // Refresh events
    } catch (error) {
      console.log("Error submitting event:", error);
      toast.error(t("Failedtosubmittheevent"), {
        style: { fontSize: "13px" },
      });
    }
  };

  // const reloadCount = localStorage.getItem("reloadCount1");
  // if (reloadCount !== "1") {
  //   window.location.reload();
  //   localStorage.setItem("reloadCount1", "1");
  // }
  // localStorage.setItem("reloadCount2", "0");

  const handleEventModalCancel2 = () => {
    setShowEventModal2(false);
    setSelectedEvent2(null);
    setNewEventStart2("");
    setNewEventEnd2("");
  };

  const handleStartChange2 = (date) => {
    const currentTime = new Date();

    // Check if the selected date is in the past
    if (date < currentTime) {
      toast.error(t("PastDateError"));
      return;
    }
    setNewEventStart2(date);
  };

  const handleEndChange2 = (date) => {
    const currentTime = new Date();

    // Check if the selected date is in the past
    if (date < currentTime) {
      toast.error(t("PastDateError"));
      return;
    }
    setNewEventEnd2(date);
  };

  const handleEventModalSubmit = async () => {
    if (!newEventStart || !newEventEnd) {
      toast.error(t("PleaseselectDate"), {
        style: { fontSize: "13px" },
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
        toast.error(t("Thisslotisalreadybooked"));
      } else if (start > end) {
        // Invalid timing, show toast message
        toast.error(t("Pleaseselectavalidtiming"), {
          style: { fontSize: "13px" },
        });
      } else {
        // Navigate to the booking page with the selected start and end times

        navigate({
          pathname: `/${extractedPart}/OTBookingForm`,
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
    // window.location.reload();
  };

  const handleStartChange = (date) => {
    const currentTime = new Date();

    // Check if the selected date is in the past
    if (date < currentTime) {
      toast.error(t("PastDateError"));
      return;
    }
    setNewEventStart(date);
  };

  const handleEndChange = (date) => {
    const currentTime = new Date();

    // Check if the selected date is in the past
    if (date < currentTime) {
      toast.error(t("PastDateError"));
      return;
    }
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
    !currentUser.roles.includes("ROLE_DOCTOR") &&
    !currentUser.roles.includes("ROLE_OTTECHNICIAN")
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
        culture={selectedLanguage}
        titleAccessor={(event) => event.title}
        tooltipAccessor={(event) => event.tooltip} // Use tooltipAccessor to display the tooltip content
        messages={messages} // Provide the custom messages
      />
      <Modal
        style={{ marginTop: "20px", fontSize: "13px" }}
        centered
        show={showEventModal}
        onHide={handleEventModalCancel}
      >
        <Modal.Header closeButton>
          <Modal.Title style={h1Style}>{t("CreateNewBooking")}</Modal.Title>
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
              <Form.Label>{t("StartDate")}</Form.Label>
              <DatePicker
                minTime={
                  newEventStart &&
                  newEventStart.getDate() === tomorrow.getDate()
                    ? today
                    : today.setHours(0, 0, 0, 0)
                }
                maxTime={new Date().setHours(23, 59, 59, 999)}
                selected={newEventStart}
                onChange={handleStartChange}
                showTimeSelect
                locale={selectedLanguage}
                timeFormat="hh:mm a"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd hh:mm a"
                className="form-control"
                minDate={new Date()}
                placeholderText={t("Selectstartdateandtime")}
                // customInput={<input style={customInputStyles} />}
              />
            </Form.Group>
            <Form.Group controlId="eventEnd">
              <Form.Label style={{ marginTop: "8px" }}>
                {t("EndDate")}
              </Form.Label>
              <DatePicker
                minTime={
                  newEventStart &&
                  newEventStart.getDate() === tomorrow.getDate()
                    ? today
                    : today.setHours(0, 0, 0, 0)
                }
                maxTime={new Date().setHours(23, 59, 59, 999)}
                locale={selectedLanguage}
                selected={newEventEnd}
                styles={customStyles}
                onChange={handleEndChange}
                showTimeSelect
                timeFormat="hh:mm a"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd hh:mm a"
                className="form-control"
                minDate={new Date()}
                placeholderText={t("Selectenddateandtime")}
                //  customInput={<input style={customInputStyles} />}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ fontSize: "12px", padding: "4px 5px" }}
            onClick={handleEventModalSubmit}
          >
            {t("ContinueBooking")}
          </Button>

          <Button
            variant="secondary"
            style={{
              fontSize: "12px",
              backgroundColor: "#777777",
              margintop: "10px",
              padding: "4px 5px",
            }}
            onClick={handleEventModalCancel}
          >
            {t("Cancel")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        style={{ marginTop: "20px", fontSize: "13px" }}
        centered
        size="lg"
        show={showEventModal2}
        onHide={handleEventModalCancel2}
      >
        <br></br>{" "}
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "13px" }}>
            {t("UpdateEventof")}
            {selectedEvent2 && selectedEvent2.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="eventStart">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("StartDate")}:
                  </Form.Label>
                  <DatePicker
                    minDate={new Date()}
                    minTime={
                      newEventStart &&
                      newEventStart.getDate() === tomorrow.getDate()
                        ? today
                        : today.setHours(0, 0, 0, 0)
                    }
                    maxTime={new Date().setHours(23, 59, 59, 999)}
                    selected={newEventStart2}
                    onChange={handleStartChange2}
                    showTimeSelect
                    timeFormat="hh:mm a"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd hh:mm a"
                    className="form-control"
                    placeholderText={t("Selectstartdateandtime")}
                    // customInput={<input style={customInputStyles} />}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="eventEnd">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("EndDate")}:
                  </Form.Label>
                  <DatePicker
                    minDate={new Date()}
                    minTime={
                      newEventStart &&
                      newEventStart.getDate() === tomorrow.getDate()
                        ? today
                        : today.setHours(0, 0, 0, 0)
                    }
                    maxTime={new Date().setHours(23, 59, 59, 999)}
                    selected={newEventEnd2}
                    onChange={handleEndChange2}
                    showTimeSelect
                    timeFormat="hh:mm a"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd hh:mm a"
                    className="form-control"
                    placeholderText={t("Selectenddateandtime")}
                    style={{ fontSize: "12px" }}
                    //   customInput={<input style={customInputStyles} />}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="OTName">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {t("OTName")}
                    {/* <span
          style={{ color: "red", marginLeft: "5px", marginTop: "8px" }}
        >
          *
        </span> */}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    required
                    value={selectedOT2.OTName}
                    onChange={(e) => {
                      setSelectedEvent2({
                        ...selectedEvent2,
                        OTName: e.target.value,
                      });
                      setSelectedOT2({
                        ...selectedOT2,
                        OTName: e.target.value,
                      });
                    }}
                    className="form-control col-4"
                  >
                    <option value="">{t("SelectanOT")}</option>
                    {otData2.map((item) => (
                      <option key={item.id} value={item.OTName}>
                        {item.OTName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="guardianName">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {t("GuardianName")}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ marginBottom: "8px" }}
                    placeholder={t("Enterguardianname")}
                    value={selectedOT2.guardianName}
                    onChange={(e) => {
                      setSelectedEvent2({
                        ...selectedEvent2,
                        guardianName: e.target.value,
                      });
                      setSelectedOT2({
                        ...selectedOT2,
                        guardianName: e.target.value,
                      });
                    }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="guardianContactNumber">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("GuardianContactNumber")}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ marginBottom: "8px" }}
                    placeholder={t("Enterguardiancontactnumber")}
                    value={selectedOT2.guardianContactNo}
                    onChange={(e) => {
                      const input = e.target.value;
                      const regex = /^[0-9]*$/;
                      if (input === "" || regex.test(input)) {
                        setSelectedEvent2({
                          ...selectedEvent2,
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
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {t("Phonenumbermustbeatleast10digits")}
                      </span>
                    )}
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="diagnosis">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Diagnosis")}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ marginBottom: "8px" }}
                    placeholder={t("Enterdiagnosis")}
                    value={selectedOT2.diagnosis}
                    onChange={(e) => {
                      setSelectedEvent2({
                        ...selectedEvent2,
                        diagnosis: e.target.value,
                      });
                      setSelectedOT2({
                        ...selectedOT2,
                        diagnosis: e.target.value,
                      });
                    }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="typeOfSurgery">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("TypeofSurgery")}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ marginBottom: "8px" }}
                    placeholder={t("Entertypeofsurgery")}
                    value={selectedOT2.typeOfSurgery}
                    onChange={(e) => {
                      setSelectedEvent2({
                        ...selectedEvent2,
                        typeOfSurgery: e.target.value,
                      });
                      setSelectedOT2({
                        ...selectedOT2,
                        typeOfSurgery: e.target.value,
                      });
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="surgeonName">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("SurgeonName")}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ marginBottom: "8px" }}
                    placeholder={t("Entersurgeonname")}
                    value={selectedOT2.surgeonName}
                    onChange={(e) => {
                      setSelectedEvent2({
                        ...selectedEvent2,
                        surgeonName: e.target.value,
                      });
                      setSelectedOT2({
                        ...selectedOT2,
                        surgeonName: e.target.value,
                      });
                    }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="surgeonEmail">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("SurgeonEmail")}
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={t("Entersurgeonemail")}
                    value={selectedOT2.surgeonEmail}
                    style={{ marginBottom: "8px" }}
                    onChange={(e) => {
                      setSelectedEvent2({
                        ...selectedEvent2,
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
                  ) && (
                    <span style={{ color: "red" }}>
                      {t("EnterValidsurgeonEmail")}
                    </span>
                  )}
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="external">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("External")}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ marginBottom: "8px" }}
                    placeholder={t("Enterexternal")}
                    value={selectedOT2.external}
                    onChange={(e) => {
                      setSelectedEvent2({
                        ...selectedEvent2,
                        external: e.target.value,
                      });
                      setSelectedOT2({
                        ...selectedOT2,
                        external: e.target.value,
                      });
                    }}
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ fontSize: "12px", padding: "4px 5px" }}
            onClick={handleEventModalSubmit2}
          >
            {t("UpdateEvent")}
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
            {t("Cancel")}
          </Button>
        </Modal.Footer>
        <br></br>
      </Modal>
    </div>
  );
};

export default BookingCalendar;
