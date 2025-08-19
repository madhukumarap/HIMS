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
import Translation from "../translations/DoctorsAppointmentsCalender.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import "moment/locale/fr";
import { registerLocale } from "react-datepicker";

const localizer = momentLocalizer(moment);

const datePickerStyle = {
  fontSize: "13px",
};
const customInputStyles = {
  fontSize: "13px",
};

const BookingCalendar = () => {
  const currentUser = AuthService.getCurrentUser();

  const navigate = useNavigate();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate());
  const { t } = useTranslation();
  const locales = { enIN, fr };
  const [currency, setCurrency] = useState("");

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
    const intervalId = setInterval(initializei18n, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };
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
  const [visitType, setVisitType] = useState("");
  const [reason, setReason] = useState("");

  const [admissionId, setAdmissionID] = useState(0);

  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadFile, setUploadFile] = useState({ preview: "", data: "" });
  const [showCamera, setShowCamera] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedPackageID, setSelectedPackageID] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState("");
  const [PackageSelectedTests, setPackageSelectedTests] = useState([]);

  const [Hospitals, setHospitals] = useState([]);
  const [optionalCurrencies, setOptionalCurrencies] = useState([]);

  const handlePackageSelection = (e) => {
    const selectedPackageID = e.target.value;

    setSelectedPackage(selectedPackageID);
    setSelectedPackageID(selectedPackageID);
    // alert(JSON.stringify(transformedOptions));
  };
  useEffect(() => {
    if (selectedPackageID !== null) {
      // alert(selectedPackageID);
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/selectedTests/${selectedPackageID}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          console.log("PackageData List" + JSON.stringify(response.data));
          setPackageSelectedTests(response.data);
          const transformedOptions = PackageSelectedTests.map((test) => ({
            value: test.TestName,
            label: test.TestName,
            TestManagementID: test.TestId,
          }));

          // setSelectedTests(transformedOptions);
          // // alert(transformedOptions[0].TestManagementID);
          // setFormData((prevFormData) => ({
          //   ...prevFormData,
          //   selectedTests: transformedOptions.map((option) => option.value),
          // }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedPackageID]);

  useEffect(() => {
    // Fetch hospital data from your Node.js API endpoint
    fetch(`${import.meta.env.VITE_API_URL}/api/getAllHospitals`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setHospitals(data.data);
        setOptionalCurrencies(data.data[0].OptionalCurrency.split(","));
        console.log(
          "OptionalCurrencies :",
          data.data[0].OptionalCurrency.split(",")
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/GetAllPackagesWithTests`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
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
    // setCapturedImage(imageSrc);
    // Convert the image to a Blob
    const response = await fetch(imageSrc);
    const blob = await response.blob();

    // Read the Blob as a Data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Extract the Base64 string
      setCapturedImage(base64String);
    };
    reader.readAsDataURL(blob);

    setShowCamera(false);
  };
  console.log("capture=", capture);
  console.log("captureImage=", capturedImage);
  const closeCamera = () => {
    setShowCamera(false);
  };

  const viewImage = () => {
    setShowModal(true);
    // alert("modal1");
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
  const [doctorConsultancyAmount, setDoctorConsultancyAmount] = useState("");
  const [doctorConsultancyCurrency, setDoctorConsultancyCurrency] =
    useState("");

  const [show, setShow] = useState(false);

  const [selectedTests, setSelectedTests] = useState([]);
  const handleTestChange = (selectedOptions) => {
    const totalTestFees = selectedOptions.reduce((acc, option) => {
      const selectedTest = pathologyTests.find(
        (test) => test.label === option.label
      );

      console.log("Selected Test:", selectedTest);
      console.log("Accumulator:", acc);

      return acc + (selectedTest ? selectedTest.testPrice : 0);
    }, 0);

    console.log("Total Test Fees:", totalTestFees);

    setAmount(totalTestFees);
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
        .get(`${import.meta.env.VITE_API_URL}/api/getAllPathologyTests`, {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        })
        .then((response) => {
          setPathologyTests(
            response?.data?.tests.map((test) => ({
              label: test.testName,
              value: test.id,
              testPrice: test.testPrice,
            })) || []
          );
        })
        .catch((error) => console.error(error));
    }
  }, []);

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

  const handlePaymentDateTimeChange = (date) => {
    const currentTime = new Date();

    // Check if the selected date is in the past
    if (date < currentTime) {
      toast.error(t("PastDateError"));
      return;
    }
    setPaymentDateTime(date);
  };

  const [patientList, setPatientList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [inOutPatient, setInOutPatient] = useState(undefined);
  const [hospitalBookings, setHospitalBookings] = useState([]);

  useEffect(() => {
    fetchPatientList();
    fetchDoctorList();
    getHospitalBookings();
  }, []);

  const fetchPatientList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getallPaitents`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setPatientList(response.data);
    } catch (error) {
      console.log("Error fetching patient list:", error);
    }
  };

  const fetchDoctorList = async () => {
    try {
      // THIS IS IT
      const response = await axios.get("http://localhost:8080/api/getDoctors", {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      });

      // setOptionalCurrencies(res.)
      setDoctorList(response.data);
    } catch (error) {
      console.log("Error fetching doctor list:", error);
    }
  };

  const getHospitalBookings = () => {
    try {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/getHospitalAdmissionList`, {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        })
        .then((response) => {
          setHospitalBookings(response.data.data);
          console.log("540", response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log("Error fetching Hospital Bookings:", error);
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
        `${import.meta.env.VITE_API_URL}/api/getAllDoctorsAppointments`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
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
          setReason(overlapEvent.reason);
          //alert(overlapEvent.reason);
          setVisitType(overlapEvent.visitType);
          // alert(new Date());
          //return;
          if (overlapEvent?.paymentDateTime) {
            const paymentDate = new Date(overlapEvent?.paymentDateTime);
            if (!isNaN(paymentDate)) {
              setPaymentDateTime(paymentDate);
            } else {
              setPaymentDateTime("");
            }
          } else {
            setPaymentDateTime("");
          }

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
        reason: reason,
        visitType: visitType,
      };
      if (!selectedDoctor) {
        toast.error("Please select Doctor", {
          style: { fontSize: "13px" },
        });
        return;
      }

      console.log("ALID amount: ", amount);

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
        updatedEvent,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      toast.success("Event updated successfully.", {
        style: { fontSize: "13px" },
      });

      setShowEventModal2(false);
      setSelectedEvent2(null);
      setNewEventStart2("");
      setNewEventEnd2("");
      setVisitType("");
      setReason("");
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
    setVisitType("");
    setReason("");
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
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   // console.log(e.target.file)
  //   // setCapturedImage(file);
  //   // setUploadFile(file)
  //   const imageUrl = {
  //     preview: URL.createObjectURL(e.target.files[0]),
  //     data: e.target.files[0],
  //   };
  //   // setCapturedImage(imageUrl);
  //   setUploadFile(imageUrl)
  // };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const imageUrl = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setUploadFile(imageUrl);
    //   };    // const reader = new FileReader();

    // reader.onload = () => {
    //   const base64String = reader.result.split(",")[1];
    //   const imageUrl = {
    //     name: file.name,
    //     type: file.type,
    //     size: file.size,
    //     lastModified: file.lastModified,
    //     preview: URL.createObjectURL(file),
    //     data: base64String,
    //   };

    //   // alert(JSON.stringify(imageUrl));
    //   setUploadFile(imageUrl);
    // };

    // reader.readAsDataURL(file);
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

  // remove image
  const handleRemoveImage = () => {
    // alert("handle")
    setCapturedImage(null);
    setUploadFile({ data: "", preview: "" });
  };
  // remove image

  const handleChange = (e) => {
    if (inOutPatient == "OutPatient") {
      setSelectedPatient(e.target.value);
      console.log("value 664:", e.target.value);
    } else {
      let patient = JSON.parse(e.target.value);
      setAdmissionID(patient.id);
      setSelectedPatient(patient.PatientID);
      console.log("value 669:", patient);
    }
  };

  const handleDoctorConsultationSubmit = async () => {
    // const selectedPatientId = document.getElementById("patient")?.value;
    const selectedPatientId = selectedPatient;
    const selectedDoctorId = document.getElementById("doctor")?.value;
    // alert(selectedPatientId)
    const newBookingStartDate = moment(newEventStart)
      .add(30 * selectedSlotValue, "minutes")
      .toDate();
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
    const start = newEventStart;
    const end = newBookingStartDate;

    const overlapEvent = events.find(
      (event) =>
        (start >= event.start && start < event.end) ||
        (end > event.start && end <= event.end) ||
        (start <= event.start && end >= event.end)
    );

    if (overlapEvent) {
      toast.error("This timing is already booked for another event.", {
        style: { fontSize: "13px" },
      });
      return;
    }
    //
    const formData = new FormData();
    formData.append("patientId", selectedPatientId);
    formData.append("doctorId", selectedDoctorId);

    formData.append("amount", doctorConsultancyAmount);
    formData.append("paymentDateTime", paymentDateTime);
    formData.append(
      "bookingStartDate",
      moment(newEventStart).utcOffset("+05:30").toDate()
    );
    formData.append("bookingEndDate", newBookingStartDate);
    formData.append("paymentStatus", paymentStatus);
    // formData.append("hospitalAdminEmail", hospitalAdminEmail);
    //
    formData.append("visitType", visitType);
    formData.append("reason", reason);
    formData.append("Currency", doctorConsultancyCurrency);
    formData.append("admissionID", admissionId);

    console.log("capturedImage=", capturedImage);
    if (capturedImage) {
      // alert("1")
      // sendingImage = capturedImage
      formData.append("capturedImage", capturedImage);
    } else {
      // alert("2")
      // let formData = new FormData()
      // alert(JSON.stringify(uploadFile.data))
      // console.log("line 491=", uploadFile.data)
      // formData.append('File', uploadFile.data)
      formData.append("capturedImage", uploadFile.data);

      console.log("formData=", formData);

      // sendingImage = formData
    }
    // formData.append('capturedImage', uploadFile.data)

    // alert(sendingImage);
    // console.log("sendingImage=", sendingImage)
    // alert(currency);
    // return;
    const eventData = {
      patientId: selectedPatientId,
      doctorId: selectedDoctorId,
      capturedImage: capturedImage,
      paymentStatus: paymentStatus,
      amount: doctorConsultancyAmount,
      paymentDateTime: paymentDateTime,
      bookingStartDate: moment(newEventStart).utcOffset("+05:30").toDate(),
      bookingEndDate: newBookingStartDate,
      Currency: currency,
    };

    console.log("eventData=", eventData);

    //alert(newBookingStartDate);
    // alert(JSON.stringify(eventData));
    //return;
    // Add the logic to send data to the server for doctor consultation
    console.log("payment Status=", paymentStatus);
    if (amount > 0 && paymentStatus == "paid") {
      try {
        const OLD_URL = `${
          import.meta.env.VITE_API_URL
        }/api/createDoctorsAppointment`;
        const NEW_URL = "http://localhost:8080/api/createDoctorsAppointment";
        const response = await axios.post(NEW_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${currentUser?.Token}`,
          },
        });
        if (response.status === 200) {
          toast.success("Doctor Consultation created successfully.", {
            style: { fontSize: "13px" },
          });
          fetchEvents();
          // Reset state and close the modal
          setShowEventModal(false);
          setNewEventTitle("");
          setSelectedSlot(null);
          setSelectedDoctor(""); // Reset patient ID
          setSelectedPatient(""); // Reset doctor ID
          setNewEventStart(null); // Reset event start date
          setPaymentStatus(""); // Reset payment status
          setAmount(""); // Reset amount
          setPaymentDateTime(null);
        } else {
          // Handle error response...
        }
      } catch (error) {
        console.log("Error creating Doctor Consultation:", error);
        toast.error("Failed to create Doctor Consultation.", {
          style: { fontSize: "13px" },
        });
      }
    } else {
      toast.error("Payment Status Must be Paid");
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
    if (!paymentStatus) {
      toast.error("Please Select Paymentstatus.");
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
    let updatedSelectedTests = selectedTests;
    if (selectedPackageID) {
      const updatedPackageTestsPackage = PackageSelectedTests.map((test) => ({
        value: test.TestId,
        label: test.TestName,
        TestManagementID: test.TestId,
      }));

      updatedSelectedTests = [
        ...updatedSelectedTests,
        ...updatedPackageTestsPackage,
      ];
    }

    const selectedPackage = packages.find(
      (item) => item?.id === parseInt(selectedPackageID, 10)
    );
    const finalPrice = selectedPackage ? selectedPackage.finalPrice : 0;

    let finalPriceWithoutDecimal = parseFloat(finalPrice);
    let updatedTestFees = amount + finalPriceWithoutDecimal;
    const eventData = {
      patientId: selectedPatient,
      doctorId: selectedDoctorId,
      tests: [...new Set(updatedSelectedTests.map((test) => test.value))],

      selectedPackageID: selectedPackageID,
      paymentStatus: paymentStatus,
      amount: updatedTestFees,
      paymentDateTime: moment(paymentDateTime).utcOffset("+05:30").toDate(),
    };

    // alert(JSON.stringify(updatedTestFees));
    // return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/createEventForPathology`,
        eventData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
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
        eventData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
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
    setVisitType("");
    setReason("");
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
        {t("BookNow")}
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
            {t("createNewBooking")}
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
                {t("eventType")}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                style={{ fontSize: "13px", marginTop: "10px" }}
                as="select"
                value={eventType}
                onChange={handleEventTypeChange}
              >
                <option value="">{t("selectEventType")}</option>
                <option value="doctorConsultation">
                  {t("doctorConsultation")}
                </option>
                {/* <option value="pathologistTest">{t("pathologistTest")}</option> */}
                {/* <option value="hospitalAdmission">Hospital Admission</option> */}
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
                        {"IN / Out Patient"}{" "}
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                        value={inOutPatient} // Set the value to the selectedPatient state
                        onChange={(e) => setInOutPatient(e.target.value)} // Handle onChange event
                      >
                        <option value="">{t("SelectINOUTPatient")}</option>
                        <option value="InPatient">IN Patient</option>
                        <option value="OutPatient">OUT Patient</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>

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
                        {t("selectPatient")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        as="select"
                        style={{
                          fontSize: "13px",

                          marginTop: "10px",
                        }}
                      >
                        <option value="">{t("selectaPatient")}</option>
                        {inOutPatient == "OutPatient"
                          ? patientList.map((patient) => (
                              <option
                                key={patient.PatientID}
                                value={patient.id}
                              >
                                PID:{patient.id},{patient.firstName}{" "}
                                {patient.middleName} {patient.lastName} (
                                {patient.phoneNumberP})
                              </option>
                            ))
                          : hospitalBookings.map((patient) => {
                              return (
                                <option
                                  key={patient.id}
                                  value={JSON.stringify(patient)}
                                >
                                  PID:{patient.PatientID},{patient.PatientName}{" "}
                                  ({patient.PatientPhoneNo}{" "}
                                  {"AdmissionID :" + patient.id})
                                </option>
                              );
                            })}
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
                        {t("selectDoctor")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                        onChange={(e) => {
                          const selectedId = parseInt(e.target.value, 10); // convert string to number
                          const selectedDoctor = doctorList.find(
                            (doc) => doc.id === selectedId
                          );

                          if (selectedDoctor) {
                            if (selectedDoctor.consultationFee) {
                              const finalFee =
                                selectedDoctor.consultationFee -
                                (selectedDoctor.consultationFee *
                                  selectedDoctor.discount) /
                                  100;

                              setDoctorConsultancyAmount(finalFee);
                              setAmount(finalFee);
                            }

                            if (selectedDoctor.consultationCurrency) {
                              setDoctorConsultancyCurrency(
                                selectedDoctor.consultationCurrency
                              );
                            }
                          } else {
                            console.log("No doctor selected");
                          }
                        }}
                      >
                        <option value="">{t("selectADoctor")}</option>
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

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="visitType">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {t("visitType")} <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={visitType}
                        onChange={(e) => setVisitType(e.target.value)}
                        style={{ fontSize: "13px", marginTop: "10px" }}
                      >
                        <option value="">{t("selectVisitType")}</option>
                        <option value="New Patient">{t("newPatient")}</option>
                        <option value="Follow-Up Patient">
                          {t("followUpPatient")}
                        </option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="reason">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {t("reason")} <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        onChange={(e) => setReason(e.target.value)}
                        rows={2}
                        placeholder={t("reason")}
                        value={reason}
                        style={{ fontSize: "13px", marginTop: "10px" }}
                      />
                    </Form.Group>
                  </div>
                </div>
                {/* Rest of the existing code continues here... */}
                {/* dropdown for chosen image */}
                <div>
                  {/* <h2>Image Capture</h2> */}
                  <div className="row">
                    <div className="col-md-6">
                      <label
                        htmlFor="imageOption"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          marginRight: "20px",
                          marginTop: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        {t("uploadprescriptionsTRF")}:{" "}
                      </label>
                      <select
                        id="imageOption"
                        value={selectedOption}
                        onChange={handleOptionChange}
                      >
                        <option value="choose">{t("Chooseanoption")}</option>
                        <option value="camera">{t("openCamera")}</option>
                        <option value="file">
                          {t("uploadprescriptionsTRF")}
                        </option>
                      </select>

                      {selectedOption === "camera" &&
                        !showCamera &&
                        !capturedImage && (
                          <div>
                            <Button
                              style={{ fontSize: "12px" }}
                              variant="secondary"
                              onClick={openCamera}
                            >
                              {t("openCamera")}
                            </Button>
                          </div>
                        )}

                      {selectedOption === "file" && !capturedImage && (
                        <input
                          className="my-3"
                          type="file"
                          onChange={(e) => handleImageChange(e)}
                        />
                      )}
                      {/* 
                      {capturedImage && (
                        <button style={{ fontSize: "12px" }} onClick={viewImage}>View Image</button>
                      )} */}

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
                              facingMode: "environment",
                              frameRate: 30,
                            }}
                          />
                          {!capturedImage ? (
                            <Button
                              variant="secondary"
                              style={{ fontSize: "12px", marginTop: "0px" }}
                              onClick={capture}
                            >
                              {t("capturePhoto")}
                            </Button>
                          ) : (
                            <Button
                              style={{ fontSize: "12px" }}
                              variant="success"
                              onClick={viewImage}
                            >
                              {t("viewImage")}
                            </Button>
                          )}
                          <Button
                            style={{ fontSize: "12px" }}
                            variant="danger"
                            onClick={closeCamera}
                          >
                            {t("closeCamera")}
                          </Button>{" "}
                        </>
                      )}
                      {capturedImage || uploadFile.preview != "" ? (
                        <div>
                          {capturedImage ? (
                            <div>
                              <h4>{t("selectedImage")}:</h4>
                              <img
                                src={`data:image/jpeg;base64,${capturedImage}`}
                                alt="Captured"
                                style={{ maxWidth: "70%" }}
                              />
                              <div>
                                <Button onClick={handleRemoveImage}>
                                  {t("remove")}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h4>{t("selectedImage")}:</h4>
                              <img
                                src={uploadFile.preview}
                                alt="Captured"
                                style={{ maxWidth: "70%" }}
                              />
                              <div>
                                <Button onClick={handleRemoveImage}>
                                  {t("remove")}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div></div>
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
                        {t("consultationDateandTime")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <DatePicker
                        locale={selectedLanguage}
                        selected={newEventStart}
                        onChange={handleStartChange}
                        showTimeSelect
                        timeFormat="hh:mm a"
                        timeIntervals={15}
                        minDate={new Date()}
                        minTime={
                          newEventStart &&
                          newEventStart.getDate() === tomorrow.getDate()
                            ? today
                            : today.setHours(0, 0, 0, 0)
                        }
                        maxTime={new Date().setHours(23, 59, 59, 999)}
                        dateFormat="yyyy-MM-dd hh:mm a"
                        className="form-control "
                        placeholderText={
                          t("selectstartDateTime") || "Select start Date & Time"
                        }
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
                        {t("selectSlot")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                        value={selectedSlotValue}
                        onChange={(e) => setSelectedSlotValue(e.target.value)}
                      >
                        <option value="1">{t("1Slot")}</option>
                        <option value="2">{t("2Slots")}</option>
                        <option value="3">{t("3Slots")}</option>
                        <option value="4">{t("4Slots")}</option>
                        <option value="5">{t("5-Slots")}</option>
                        <option value="6">{t("6-Slots")}</option>
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
                        {t("selectPatient")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                        value={selectedPatient} // Set the value to the selectedPatient state
                        onChange={(e) => setSelectedPatient(e.target.value)} // Handle onChange event
                      >
                        <option value="">{t("selectaPatient")}</option>
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
                        {"referralDoctor"}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                      >
                        <option value="">{t("selectADoctor")}</option>
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
                  <div className="col-md-6">
                    <div className="form-group">
                      <label
                        style={{
                          fontSize: "12px",
                          marginTop: "8px",
                          fontWeight: "bold",
                          marginBottom: "10px",
                        }}
                      >
                        {t("selectaPackage")}
                      </label>
                      <select
                        style={{ fontSize: "12px" }}
                        className="form-control"
                        name="selectedPackage"
                        value={selectedPackage}
                        // disabled={isEditMode}
                        onChange={handlePackageSelection}
                      >
                        <option value="">{t("selectaPackage")}</option>
                        {packages.map((Testpackage) => (
                          <option key={Testpackage.id} value={Testpackage.id}>
                            {Testpackage.packageName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="test">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {t("SelectTests")}{" "}
                        <span style={{ color: "red" }}>*</span>
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
                        {t("selectPatient")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                        required
                        value={selectedPatient} // Set the value to the selectedPatient state
                        onChange={(e) => setSelectedPatient(e.target.value)} // Handle onChange event
                      >
                        <option value="">{t("selectaPatient")}</option>
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
                      {t("additionalInformation")}{" "}
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
                      {t("selectPaymentStatus")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      style={{ fontSize: "13px", marginTop: "10px" }}
                      s
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <option value="">{t("selectStatus")}</option>
                      <option value="paid">{t("paid")}</option>
                      <option value="notPaid">{t("notPaid")}</option>
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group controlId="amount">
                        <Form.Label
                          style={{
                            fontSize: "13px",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                        >
                          {t("amount")}
                        </Form.Label>
                        <Form.Control
                          disabled={true}
                          type="text"
                          style={{ fontSize: "13px", marginTop: "10px" }}
                          // placeholder={t("enterFees")}
                          value={`${doctorConsultancyCurrency || ""} ${
                            doctorConsultancyAmount || ""
                          }`}
                          // onChange={(e) => setAmount(e.target.value)}
                        />
                      </Form.Group>
                    </div>
                  </div>
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
                      {t("paymentDateandTime")}
                    </Form.Label>
                    <DatePicker
                      selected={paymentDateTime}
                      onChange={(date) => handlePaymentDateTimeChange(date)}
                      showTimeSelect
                      timeFormat="hh:mm a"
                      dateFormat="yyyy-MM-dd hh:mm a"
                      minDate={new Date()}
                      minTime={
                        newEventStart &&
                        newEventStart.getDate() === tomorrow.getDate()
                          ? today
                          : today.setHours(0, 0, 0, 0)
                      }
                      maxTime={new Date().setHours(23, 59, 59, 999)}
                      className="form-control custom-datetime-picker"
                      placeholderText={t("Selectpaymentdateandtime")}
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
                        {t("BookingDateandTime")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <DatePicker
                        style={{
                          fontSize: "10px",
                          marginTop: "10px",
                        }}
                        selected={newEventStart}
                        locale={selectedLanguage}
                        onChange={handleStartChange}
                        showTimeSelect
                        timeFormat="hh:mm a"
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd hh:mm a"
                        minDate={new Date()}
                        minTime={
                          newEventStart &&
                          newEventStart.getDate() === tomorrow.getDate()
                            ? today
                            : today.setHours(0, 0, 0, 0)
                        }
                        maxTime={new Date().setHours(23, 59, 59, 999)}
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
            {t("saveBooking")}
          </Button>
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={handleEventModalCancel}
          >
            {t("cancel")}
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
            {t("updateEventof")} {selectedEvent2 && selectedEvent2.title}
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
                    {t("selectDoctor")}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    required
                    style={{ fontSize: "13px" }}
                    value={selectedDoctor}
                    onChange={(e) => {
                      setSelectedDoctor(e.target.value);
                    }}
                    className="form-control col-4"
                  >
                    <option value="">{t("selectADoctor")}</option>
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
                    {t("startDate")} <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <DatePicker
                    selected={newEventStart2}
                    onChange={handleStartChange2}
                    showTimeSelect
                    timeFormat="hh:mm a"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd hh:mm a"
                    minTime={
                      newEventStart &&
                      newEventStart.getDate() === tomorrow.getDate()
                        ? today
                        : today.setHours(0, 0, 0, 0)
                    }
                    maxTime={new Date().setHours(23, 59, 59, 999)}
                    className="form-control custom-datetime-picker"
                    placeholderText={
                      t("selectstartdateandtime") ||
                      "Select start date and time"
                    }
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
                    {t("endDate")} <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <DatePicker
                    selected={newEventEnd2}
                    onChange={handleEndChange2}
                    showTimeSelect
                    timeFormat="hh:mm a"
                    timeIntervals={15}
                    minTime={
                      newEventStart &&
                      newEventStart.getDate() === tomorrow.getDate()
                        ? today
                        : today.setHours(0, 0, 0, 0)
                    }
                    maxTime={new Date().setHours(23, 59, 59, 999)}
                    dateFormat="yyyy-MM-dd hh:mm a"
                    className="form-control custom-datetime-picker"
                    placeholderText={
                      t("selectenddateandtime") || "Select end date and time"
                    }
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
                    {t("paymentStatus")} <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    required
                    style={{ fontSize: "13px" }}
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="form-control col-4"
                  >
                    <option value="paid">{t("paid")}</option>
                    <option value="notPaid">{t("notPaid")}</option>
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
                      {t("amount")} <span style={{ color: "red" }}>*</span>
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
                      {t("paymentDateandTime")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <DatePicker
                      selected={paymentDateTime}
                      onChange={handlePaymentDateTimeChange}
                      showTimeSelect
                      timeFormat="hh:mm a"
                      timeIntervals={15}
                      minTime={
                        newEventStart &&
                        newEventStart.getDate() === tomorrow.getDate()
                          ? today
                          : today.setHours(0, 0, 0, 0)
                      }
                      maxTime={new Date().setHours(23, 59, 59, 999)}
                      dateFormat="yyyy-MM-dd hh:mm a"
                      className="form-control custom-datetime-picker"
                      placeholderText="Select payment date and time"
                    />
                  </Form.Group>
                </div>
              )}
              <div className="col-6">
                <Form.Group controlId="visitType">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {t("visitType")}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    required
                    style={{ fontSize: "13px" }}
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    className="form-control col-4"
                  >
                    <option value="">{t("selectVisitType")}</option>
                    <option value="New Patient">{t("newPatient")}</option>
                    <option value="Follow-Up Patient">
                      {t("followUpPatient")}
                    </option>
                  </Form.Control>
                </Form.Group>
              </div>{" "}
              <div className="col-6">
                <Form.Group controlId="reason">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {t("reason")} <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    required
                    style={{ fontSize: "13px" }}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="form-control col-4"
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
            {t("updateEvent")}
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
            {t("cancel")}
          </Button>
        </Modal.Footer>
        <br />
      </Modal>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("capturedImage")}
          </Modal.Title>
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
            {t("retakePicture")}
          </Button>{" "}
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={closeModal}
          >
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingCalendar;
