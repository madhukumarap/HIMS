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
import { Link, useParams } from "react-router-dom";
import HospitalAdmissionForm from "./HospitalAdmission";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { toast } from "react-toastify";
import Translation from "../../translations/In-PatientCalender.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";

const localizer = momentLocalizer(moment);

const InPatientCalender = () => {
  const { bedID } = useParams();
  const [bedsList, setBedsList] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;

  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  registerLocale("fr", fr);
  registerLocale("en", enIN);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const locales = { enIN, fr };

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
          format: (value, format, lng) => {
            if (isDate(value)) {
              const locale = locales[lng];
              return formatDate(value, format, { locale });
            }
          },
        },
      });
    };

    initializei18n();
    // const intervalId = setInterval(initializei18n, 2000);
    // return () => clearInterval(intervalId);
  }, []);

  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/get-bedsList`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        //  alert(JSON.stringify(response.data));
        setBedsList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching beds list:", error);
      });
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
  const [overlappedEventId, setOverlappedEventId] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    // alert("he");
    setModalVisible(true);
    setShowEventModal(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    fetchEvents();

    navigate(`/${extractedPart}/StatusUpdateAndDischare`);
  };
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

  useEffect(() => {
    fetchEvents();
  }, []);
  useEffect(() => {
    fetchEvents();
  }, [selectedBed]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getHospitalAdmissionList`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      const responseData = response.data?.data;
      //alert(JSON.stringify(responseData));
      //  alert(bedID);
      const eventsData = responseData.map((event) => {
        const start = moment(event.CheckInTime, "MM/DD/YYYY, hh:mm A").toDate();
        const end = moment(event.CheckOutTime, "MM/DD/YYYY, hh:mm A").toDate();

        return {
          ...event,
          start,
          end,
          title: (
            <div>
              <strong>{t("BedID")}:</strong> {event?.BedNumber},{" "}
              <strong>{t("PatientName")}:</strong> {event?.PatientName},{" "}
              <strong>{t("PatientContactNo")}:</strong> {event?.PatientPhoneNo},{" "}
              <strong>{t("Check-IN")}:</strong> {event?.CheckInTime},{" "}
              <strong>{t("Check-Out")}:</strong> {event?.CheckOutTime}
            </div>
          ),
          tooltip: `${t("BedID")}: ${event?.BedNumber}, ${t("PatientName")}: ${
            event?.PatientName
          }, ${t("PatientContactNo")}: ${event?.PatientPhoneNo}, ${t(
            "Check-IN"
          )}:  ${event?.CheckInTime}, ${t("Check-Out")}: ${
            event?.CheckOutTime
          }`,
        };
      });

      // let filteredEvents = eventsData;

      // alert(eventsData[0].BedNumber);
      const filteredEvents = selectedBed
        ? eventsData.filter(
            (event) => event.BedNumber === parseInt(selectedBed)
          )
        : eventsData;

      //alert(JSON.stringify(eventsData[0]));
      setEvents(filteredEvents);
    } catch (error) {
      toast.error("Event fetching Error");
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
      //  toast.error('This slot is already booked.');
      {
        //alert(currentUser.email)
        if (
          currentUser.roles.includes("ROLE_ADMIN") ||
          currentUser.roles.includes("ROLE_OTTECHNICIAN") ||
          currentUser.roles.includes("ROLE_DOCTOR")
        ) {
          setNewEventStart(new Date());
          setNewEventEnd(new Date());
          setOverlappedEventId(overlapEvent.id);
          openModal();
          // alert(JSON.stringify(overlapEvent.id));
        } else if (overlapEvent.surgeonEmail === currentUser.email) {
        } else {
          toast.error(t("YouarenotallowedtoeditthiseventContactwithAdmin"), {
            style: { fontSize: "13px" },
          });
        }
      }
    } else {
      // Slot is available, open the event modal
      setSelectedSlot(slotInfo);
      setShowEventModal(true);
    }
  };

  const handleEventModalSubmit = async () => {
    if (!newEventStart || !newEventEnd) {
      toast.error(t("PleaseSelectDate"), {
        style: { fontSize: "13px" },
      });
    }
    // alert(newEventTitle);
    // alert(newEventStart);
    if (newEventStart && newEventEnd) {
      //  alert("Helllo");
      // Convert start and end times to Indian time format
      const start = moment(newEventStart).utcOffset("+05:30").toDate();
      const end = moment(newEventEnd).utcOffset("+05:30").toDate();
      // const start = new Date(newEventStart);
      // const end = new Date(newEventEnd);

      console.log("start date : ", start);
      console.log("end date : ", end);

      // alert(start);
      // Check if the selected slot overlaps with any existing events
      const overlapEvent = events.find(
        (event) =>
          (start >= event.start && start < event.end) ||
          (end > event.start && end <= event.end) ||
          (start <= event.start && end >= event.end)
      );
      // alert(bedID);
      const bedOverlapEvent = events.find(
        (event) => event.BedNumber === parseInt(bedID)
      );
      //  alert(bedOverlapEvent);
      if (overlapEvent && bedOverlapEvent) {
        toast.error(
          `${t(
            "ThisslotisalreadybookedfortheselectedbedNumberinthistime"
          )} BedID: ${bedID}`
        );
      } else if (start > end) {
        // Invalid timing, show toast message
        toast.error(t("Pleaseselectavalidtiming"), {
          style: { fontSize: "13px" },
        });
      } else if (start.toString() == end.toString()) {
        toast.error(t("Pleaseselectavalidtiming"), {
          style: { fontSize: "13px" },
        });
        return;
      } else {
        // Navigate to the booking page with the selected start and end times
        setOverlappedEventId(null);
        if (!selectedBed) {
          toast.error(t("PleaseselectBedToAllocate"));
          return;
        }
        if (start.toString() == end.toString()) {
          toast.error(t("PleaseselectValidEvent"));
          return;
        }

        openModal();
        toast.success(`${t("StartedAllocatingBedNumber")} ${selectedBed}`);
        return;
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
    height: 500,
    width: "100%",
  };

  const style = {
    width: "98%",
    height: "100%",
    margin: "0 auto",

    fontSize: "12px",
  };

  const h1Style = {
    fontSize: "16px",
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
    !currentUser.roles.includes("ROLE_DOCTOR")
  ) {
    return "Access Denied";
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "15px",
    }),
    input: (provided) => ({
      ...provided,
      minHeight: "15px",
    }),
  };
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    return "Access Denied";
  }
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate());

  const countDaysBetweenDates = (startDate, endDate) => {
    // Convert the input strings to Date objects
    const start = new Date(newEventStart);
    const end = new Date(newEventEnd);

    // Calculate the time difference in milliseconds
    const timeDifference = end - start;

    // Convert the time difference to days
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
  };

  console.log(
    "daysCount :",
    countDaysBetweenDates(),
    " : ",
    bedsList.filter((bed) => bed.BedNumber == selectedBed)[0]?.BedPrice
  );

  return (
    <div style={style}>
      {(overlappedEventId || (newEventStart && newEventEnd)) && (
        <HospitalAdmissionForm
          newEventStart={newEventStart}
          newEventEnd={newEventEnd}
          showModal={isModalVisible}
          BedNumber={selectedBed}
          overlappedEventId={overlappedEventId}
          handleCloseModal={closeModal}
          bedPrice={
            countDaysBetweenDates() *
            bedsList.filter((bed) => bed.BedNumber == selectedBed)[0]?.BedPrice
          }
        />
      )}

      <div className="row">
        {/* <div className="col-1">
          <Form.Group controlId="bedSelection">
            <Form.Label style={{ fontSize: "16px" }}>
              {t("Select Bed")}
            </Form.Label>
          </Form.Group>
        </div> */}
        <div className="col-3">
          <Form.Select
            as="select"
            style={{ fontSize: "12px" }}
            value={selectedBed}
            onChange={(e) => setSelectedBed(e.target.value)}
          >
            <option value="">{t("SelectaBed")}</option>
            {bedsList.map((bed) => (
              <>
                {" "}
                <option key={bed.id} value={bed.BedNumber}>
                  {t("BedNumber")}: {bed.BedNumber}, {t("BedType")}:{" "}
                  {bed.BedType}
                </option>
              </>
            ))}
          </Form.Select>
        </div>
      </div>
      <br></br>
      <Calendar
        localizer={localizer}
        selectable
        events={events}
        onSelectSlot={handleBookSlot}
        style={calendarStyle}
        culture={selectedLanguage}
        titleAccessor={(event) => event.title}
        tooltipAccessor={(event) => event.tooltip}
        messages={messages}
      />
      <Modal
        centered
        backdrop="static"
        style={{ fontSize: "13px", width: "100%", marginTop: "20px" }}
        show={showEventModal}
        onHide={handleEventModalCancel}
      >
        <Modal.Header closeButton>
          <Modal.Title style={h1Style}>{t("CreateNewAdmission")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div>
              <Form.Label style={{ fontWeight: "bold" }}>
                {t("SelectBed")}{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </Form.Label>
              <Form.Select
                as="select"
                style={{ fontSize: "14px" }}
                value={selectedBed}
                onChange={(e) => setSelectedBed(e.target.value)}
              >
                <option value="">{t("SelectaBed")}</option>
                {bedsList.map((bed) => (
                  <>
                    {" "}
                    <option key={bed.id} value={bed.BedNumber}>
                      {t("BedNumber")}: {bed.BedNumber}, {t("BedType")}:{" "}
                      {bed.BedType}
                    </option>
                  </>
                ))}
              </Form.Select>
            </div>
            <Form.Group controlId="eventStart">
              <Form.Label style={{ fontWeight: "bold" }}>
                {t("StartDate")}{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>*</span>
              </Form.Label>
              <DatePicker
                selected={newEventStart}
                onChange={handleStartChange}
                showTimeSelect
                locale={selectedLanguage}
                timeFormat="hh:mm a"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd hh:mm a"
                className="form-control"
                minDate={new Date()}
                minTime={
                  newEventStart &&
                  newEventStart.getDate() === tomorrow.getDate()
                    ? new Date()
                    : new Date().setHours(0, 0, 0, 0)
                }
                maxTime={new Date().setHours(23, 59, 59, 999)}
                placeholderText={t("Selectstartdateandtime")}
                // customInput={<input style={customInputStyles} />}
              />
            </Form.Group>
            <Form.Group controlId="eventEnd">
              <Form.Label style={{ fontWeight: "bold", marginTop: "8px" }}>
                {t("EndDate")} <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <DatePicker
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
                minTime={
                  newEventStart &&
                  newEventStart.getDate() === tomorrow.getDate()
                    ? today
                    : today.setHours(0, 0, 0, 0)
                }
                maxTime={new Date().setHours(23, 59, 59, 999)}
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
    </div>
  );
};

export default InPatientCalender;
