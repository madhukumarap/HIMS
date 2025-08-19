import React, { useState } from "react";
import Webcam from "react-webcam";
import Select from "react-select";
import { useEffect, useRef, Component } from "react";
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
import AuthService from "../../services/auth.service";
import { toast } from "react-toastify";
import Translation from "../../translations/In-PatientCalender.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import "moment/locale/fr";
import { registerLocale } from "react-datepicker";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "moment/locale/fr";
import { format } from "date-fns";

const localizer = momentLocalizer(moment);

const datePickerStyle = {
  fontSize: "13px",
};
const customInputStyles = {
  fontSize: "13px",
};

const HospitalAdmissionForm = (props) => {
  const {
    showModal,
    handleCloseModal,
    newEventStart,
    newEventEnd,
    overlappedEventId,
    bedPrice,
    BedNumber,
    admissionID,
  } = props;
  const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });
  console.log("bedPrice::" + bedPrice);
  console.log("overlappedEventId::" + overlappedEventId);

  const [bedsList, setBedsList] = useState([]);
  const [selectedBed, setSelectedBed] = useState(BedNumber);
  const currentUser = AuthService.getCurrentUser();

  const [newEventStart2, setNewEventStart] = useState("");
  const [newEventEnd2, setNewEventEnd] = useState("");
  const [events, setEvents] = useState([]);
  const [overlapEventBedID, SetOverlapEventBedID] = useState("");
  const [showModal1, setShowModal] = useState(false);
  const [hospitalAdmissionData, setHospitalAdmissionData] = useState(null);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate());
  const navigate = useNavigate();
  const { t } = useTranslation();
  const locales = { enIN, fr };
  const [currency, setCurrency] = useState("");
  const [hospitalRooms, setHospitalRooms] = useState([]);

  const [patientList, setPatientList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [AdmissionType, setAdmissionType] = useState("");
  const [reason, setReason] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("notPaid");
  const [amount, setAmount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [totalAmountError, setTotalAmountError] = useState(undefined);
  const [advanceAmountError, setAdvanceAmountError] = useState(undefined);
  const [paymentType, setPaymentType] = useState("");
  const [paymentDateTime, setPaymentDateTime] = useState(null);
  const [admissionDate, setAdmissionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [paymentOption, setPaymentOption] = useState("");

  const [referringPhysician, setReferringPhysician] = useState("");

  const [previousHospitalizations, setPreviousHospitalizations] = useState("");

  const [chronicConditions, setChronicConditions] = useState("");

  const [medications, setMedications] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [hospital, setHospital] = useState();

  const getSecurityDeposit = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getSecurityDeopsit`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setSecurityDeposit(response.data.securityDeposit);
        setHospital(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRoomsData = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/hospital-rooms`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setHospitalRooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  };
  registerLocale("fr", fr);
  registerLocale("en", enIN);
  useEffect(() => {
    fetchEvents();
  }, []);

  console.log("bedPrice", bedPrice);

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
              {/* <strong>{t("OTName")}:</strong> {event?.OTName},{" "} */}
              <strong>{t("PatientName")}:</strong> {event?.PatientName},{" "}
              <strong>{t("PatientContactNo")}:</strong> {event?.PatientPhoneNo},{" "}
              {/* <strong>{t("SurgeonName")}:</strong> {event?.AdmittingPhysician},{" "}
              <strong>{t("TypeofSurgery")}:</strong> {event?.ReasonForAdmission} */}
            </div>
          ),
          tooltip: `${t("PatientName")}: ${event?.PatientName}, ${t(
            "PatientContactNo"
          )}: ${event.PatientPhoneNo}, ${t("AdmittingPhysician")}: Dr ${
            event?.AdmittingPhysician
          }, ${t("Reason")}: ${event?.ReasonForAdmission}`,
        };
      });

      //alert(JSON.stringify(eventsData[0]));
      setEvents(eventsData);
    } catch (error) {
      toast.error(t("EventfetchingError"));
      console.log("Error fetching events:", error);
    }
  };

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
    // const intervalId = setInterval(initializei18n, 1000);
    // return () => clearInterval(intervalId);
  }, []);

  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  const formatDateInSelectedLanguage2 = (date) => {
    const selectedLanguage = i18n.language || "en";
    const formatPattern = "MM/dd/yyyy, hh:mm a";
    const locale = locales[selectedLanguage];
    return format(date, formatPattern, { locale });
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

  // useEffect(() => {

  // }, [])

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

    getSecurityDeposit();
  }, []);

  useEffect(() => {
    if (overlappedEventId) {
      const fetchData = async () => {
        try {
          //alert(overlappedEventId);
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/hospitalAdmissions/${overlappedEventId}`,
            {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            }
          );
          // alert("getting" + JSON.stringify(response.data.data));
          setHospitalAdmissionData(response.data.data);

          const admissionData = response.data?.data;
          //alert(admissionData.AdmissionDate);
          setSelectedPatientId(admissionData.PatientID || "");
          SetOverlapEventBedID(admissionData.BedNumber || "");
          setNewEventStart(admissionData.CheckInTime);
          setSelectedDoctorId(admissionData.AdmittingPhysicianID || "");
          setReferringPhysician(admissionData.ReferringPhysicianID || "");
          setAdmissionType(admissionData.AdmissionType || "");
          setReason(admissionData.ReasonForAdmission || "");
          setPaymentStatus(admissionData.paymentStatus || "");
          setAmount(admissionData.AdvanceAmount || 0);
          setCurrency(admissionData.currency || "");
          setPaymentOption(admissionData.PaymentOption || "");
          setMedications(admissionData.Medications || "");
          setPreviousHospitalizations(
            admissionData?.PreviousHospitalizations || ""
          );
          setSelectedBed(admissionData?.BedNumber || "");
          setNewEventStart(new Date(admissionData.CheckInTime) || "");
          setNewEventEnd(new Date(admissionData.CheckOutTime) || "");
          setCurrency(admissionData.Currency || "");
          setChronicConditions(admissionData.ChronicConditions || "");
          setPaymentDateTime(admissionData.PaymentDate || "");
          setPaymentStatus(admissionData.PaymentStatus || "");
          setAdmissionDate(
            new Date(admissionData.AdmissionDate).toISOString().split("T")[0]
          );
          //  alert(response.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, []);
  // if (showModal) {
  //   toast.error(formatDateInSelectedLanguage2(newEventStart));

  // }
  useEffect(() => {
    getRoomsData();
    fetchPatientList();
    fetchDoctorList();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  // const handleCloseModal = () => {
  //   setShowModal(false);
  // };

  // const paymentTypeOptions = [{label : "Normal Payment" , value: "normal"}]

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

  const [hospitalAdmissions, setHospitalAdmissions] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getHospitalAdmissionList`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setHospitalAdmissions(response.data?.data);
      })
      .catch((error) => {
        console.error("Error fetching hospital admissions:", error);
      });
  }, []);

  const [exchangeRates, setExchangeRates] = useState(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/GetExchangeRates/USD`
        );

        const exchangeRatesData = response.data.exchangeRatesData;
        const firstCurrencyData = exchangeRatesData[0].data;
        const rates = firstCurrencyData.rates;
        setExchangeRates(rates);
        //  alert(JSON.stringify(response.data.rates["CDF"]));
      } catch (error) {
        console.error(error);
      }
    };

    fetchExchangeRates();
  }, []);

  // useEffect(() => {
  //   setTotalAmount(securityDeposit + bedPrice);
  // });

  useEffect(() => {
    const convertCurrency = () => {
      // Check if exchangeRates and currentUser are available
      if (exchangeRates && currentUser) {
        // Convert securityDeposit and bedPrice to USD
        const securityDepositUSD =
          securityDeposit / exchangeRates[currentUser.baseCurrency];
        const bedPriceUSD = bedPrice / exchangeRates[currentUser.baseCurrency];
        const totalAmountUSD = securityDepositUSD + bedPriceUSD;

        // Convert totalAmountUSD to the selected currency
        const totalAmountSelectedCurrency =
          totalAmountUSD * exchangeRates[currency];

        // Update totalAmount state with the converted amount
        setTotalAmount(totalAmountSelectedCurrency);
      }
    };

    convertCurrency();
  }, [exchangeRates, currentUser, currency]);

  const handleCloseAndReset = () => {
    handleCloseModal();
    resetForm();
    if (!overlappedEventId) window.location.reload();
  };
  const fetchDoctorList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDoctorData`,
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

  const validateForm = () => {
    if (overlappedEventId) {
      return (
        selectedPatientId !== "" &&
        selectedDoctorId !== "" &&
        AdmissionType !== "" &&
        admissionDate !== "" &&
        reason !== "" &&
        paymentStatus !== "" &&
        paymentDateTime !== null &&
        (paymentStatus === "paid" ? amount > 0 && currency !== "" : true) &&
        paymentOption !== ""
      );
    } else {
      return (
        selectedPatientId !== "" &&
        selectedDoctorId !== "" &&
        AdmissionType !== "" &&
        admissionDate !== "" &&
        reason !== ""
      );
    }
  };

  const resetForm = () => {
    setSelectedPatientId("");
    setSelectedDoctorId("");
    setReferringPhysician("");
    setAdmissionType("");
    setAdmissionDate(new Date().toISOString().split("T")[0]);
    setReason("");
    setMedications("");
    setPreviousHospitalizations("");
    setChronicConditions("");
    setPaymentStatus("notPaid");
    setAmount(0);
    setCurrency("");
    setPaymentOption("");
    setPaymentDateTime(null);
    setSelectedBed("");
    setNewEventStart("");
    setNewEventEnd("");
  };

  const handleSubmit = () => {
    // Validate form fields
    if (!validateForm()) {
      toast.error(t("Allfieldsarerequired"));
      return;
    }

    let CheckInTime, CheckOutTime;
    // Extracting the CheckInTime and CheckOutTime from newEventStart and newEventEnd
    if (overlappedEventId) {
      CheckInTime = formatDateInSelectedLanguage2(newEventStart2);
      CheckOutTime = formatDateInSelectedLanguage2(newEventEnd2);
    } else {
      CheckInTime = formatDateInSelectedLanguage2(newEventStart);
      CheckOutTime = formatDateInSelectedLanguage2(newEventEnd);
    }

    if (!overlappedEventId) {
      if (paymentType == "normal") {
        if (amount <= 0) {
          toast.error("Enter valid amount");
          return;
        }
        if (totalAmountError != undefined) {
          toast.error("Enter valid amount");
          return;
        }
      }
      if (paymentType == "normal") {
        if (Number(amount) !== Number(totalAmount)) {
          toast.error(" Amount Should be equal to Total Amount!");
          return;
        }
        if (Number(amount) > Number(totalAmount)) {
          toast.error("Enter valid amount");
          return;
        }
      }

      if (paymentType == "partial") {
        if (advanceAmount <= 0) {
          toast.error("Enter valid advance amount");
          return;
        }
        if (Number(advanceAmount) > Number(totalAmount)) {
          toast.error("Enter valid amount");
          return;
        }

        if (advanceAmountError != undefined) {
          toast.error("Enter valid advance amount");
          return;
        }
      }
    }

    // Prepare the form data
    const formData = {
      patientId: selectedPatientId,
      doctorId: selectedDoctorId,
      referringPhysician,
      AdmissionType,
      admissionDate,
      reason,
      medications,
      previousHospitalizations,
      chronicConditions,
      paymentStatus,
      amount,
      currency,
      paymentOption,
      paymentDateTime,
      CheckInTime,
      CheckOutTime,
      BedNumber: selectedBed || BedNumber,
      advanceAmount,
      totalAmount,
      paymentType,
      dueAmount,
    };

    // If overlappedEventId is present, it means an update called
    if (overlappedEventId) {
      const overlapEvent = events.find(
        (event) =>
          (newEventStart2 >= event.start &&
            newEventStart2 < event.end &&
            event.id !== overlappedEventId) ||
          (newEventEnd2 > event.start &&
            newEventEnd2 <= event.end &&
            event.id !== overlappedEventId) ||
          (newEventStart2 <= event.start &&
            newEventEnd2 >= event.end &&
            event.id !== overlappedEventId)
      );

      const bedOverlapEvent = events.find(
        (event) =>
          event.BedNumber === parseInt(BedNumber) &&
          event.id !== overlappedEventId
      );

      //  alert(bedOverlapEvent);
      if (overlapEvent && bedOverlapEvent) {
        toast.error(
          `${t(
            "ThisslotisalreadybookedfortheselectedbedNumberinthistime"
          )} BedID: ${BedNumber}`
        );
        return;
      }

      if (newEventStart2 > newEventEnd2) {
        console.log("date1 : ", newEventStart2);
        console.log("date1 : ", newEventEnd2);
        toast.error(t("Pleaseselectavalidtiming"), {
          style: { fontSize: "13px" },
        });
        return;
      }

      if (new Date(newEventStart2) == new Date(newEventEnd2)) {
        toast.error(t("Pleaseselectavalidtiming"), {
          style: { fontSize: "13px" },
        });
        return;
      }

      axios
        .put(
          `${
            import.meta.env.VITE_API_URL
          }/api/hospitalAdmissions/${overlappedEventId}`,
          formData,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          toast.success(t("Dataupdatedsuccessfully"));
          resetForm();
          handleCloseModal();
          //      window.location.reload();
        })
        .catch((error) => {
          toast.error("Error updating data");
        });
    } else {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/CreateHospitalAdmission`,
          formData,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          toast.success(t("Dataupdatedsuccessfully"));
          resetForm();
          handleCloseModal();
          //  window.location.reload();
        })
        .catch((error) => {
          toast.error(t("Errorupdatingdata"));
        });
    }
  };

  const HandleTotalAmount = (e) => {
    let value = e.target.value;

    if (value > totalAmount) {
      // toast.error("Amount should be equal to the total amount.")
      setTotalAmountError(t("AmountShouldBeEqualToTheTotalAmount"));
      return;
    }

    setAmount(value);
    setTotalAmountError(undefined);
  };

  const HandleAdvanceAmout = (e) => {
    let value = e.target.value;
    if (value > totalAmount) {
      setAdvanceAmountError(t("AdvanceAmountShouldBeEqualToTheTotalAmount"));
      return;
    }

    setAdvanceAmount(value);
    setAdvanceAmountError(undefined);
  };

  if (!overlappedEventId && (!newEventStart || !newEventEnd)) {
    return;
  }
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    return "Access Denied";
  }

  // setTotalAmount(bed?.BedPrice * countDaysBetweenDates())

  return (
    <>
      <div>
        {/* <Button
          style={{ fontSize: "12px" }}
          variant="secondary"
          onClick={handleOpenModal}
        >
          Create Admission
        </Button> */}
        {/* <header
          className="header"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          Hospital Admission Management
        </header> */}

        <Modal
          style={{ marginTop: "20px" }}
          centered
          backdrop="static"
          size="lg"
          show={showModal}
          onHide={handleCloseAndReset}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "16px" }}>
              {t("PatientAdmission")} ({t("AllocatingBedNumber")}:
              {overlappedEventId ? overlapEventBedID : BedNumber})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
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
                        value={selectedPatientId}
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                        style={{
                          fontSize: "13px",

                          marginTop: "10px",
                        }}
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
                        {t("AdmittingPhysician")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                        style={{ fontSize: "13px", marginTop: "10px" }}
                      >
                        <option value="">{t("selectaDoctor")}</option>
                        {doctorList.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            Dr {doctor.FirstName} {doctor.MiddleName}{" "}
                            {doctor.LastName} ({doctor.phoneNo})
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="referring Physician">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {t("ReferringPhysician")}{" "}
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                        value={referringPhysician}
                        onChange={(e) => setReferringPhysician(e.target.value)}
                      >
                        <option value="">
                          {t("SelectReferringPhysician")}
                        </option>
                        {doctorList.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            Dr {doctor.FirstName} {doctor.MiddleName}{" "}
                            {doctor.LastName} ({doctor.phoneNo})
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="referringPhysician">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {t("UpdateBed")} <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Select
                        as="select"
                        disabled={!overlappedEventId ? true : false}
                        style={{ fontSize: "12px" }}
                        value={!overlappedEventId ? BedNumber : selectedBed}
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
                    </Form.Group>
                  </div>

                  {/* <div style={{ marginTop: "15px" }} className="col-md-6">
                    <p>
                      {" "}
                      Check IN Time :{" "}
                      <strong>
                        {formatDateInSelectedLanguage2(newEventStart)}
                      </strong>
                    </p>
                    <p>
                      {" "}
                      Check Out Time :{" "}
                      <strong>
                        {formatDateInSelectedLanguage2(newEventEnd)}
                      </strong>
                    </p>
                  </div> */}
                </div>
                <br></br>

                <Form>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group controlId="eventStart">
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "bold" }}
                        >
                          {t("Check-InTime")}
                        </Form.Label>
                        <DatePicker
                          selected={
                            overlappedEventId ? newEventStart2 : newEventStart
                          }
                          onChange={handleStartChange}
                          showTimeSelect
                          timeFormat="hh:mm a"
                          timeIntervals={15}
                          disabled={!overlappedEventId ? true : false}
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
                          placeholderText={t("Selectstartdateandtime")}
                        />
                      </Form.Group>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginTop: "-10px",
                      }}
                      className="col-md-6"
                    >
                      <Form.Group controlId="eventEnd">
                        <Form.Label style={{ marginTop: "8px" }}>
                          {t("Check-OutTime")}
                        </Form.Label>
                        <DatePicker
                          selected={
                            overlappedEventId ? newEventEnd2 : newEventEnd
                          }
                          onChange={handleEndChange}
                          showTimeSelect
                          timeFormat="hh:mm a"
                          timeIntervals={15}
                          dateFormat="yyyy-MM-dd hh:mm a"
                          className="form-control"
                          disabled={!overlappedEventId ? true : false}
                          minDate={new Date()}
                          minTime={
                            newEventStart &&
                            newEventStart.getDate() === tomorrow.getDate()
                              ? today
                              : today.setHours(0, 0, 0, 0)
                          }
                          maxTime={new Date().setHours(23, 59, 59, 999)}
                          placeholderText={t("Selectenddateandtime")}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </Form>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="AdmissionType">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {t("AdmissionType")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={AdmissionType}
                        onChange={(e) => setAdmissionType(e.target.value)}
                        style={{ fontSize: "13px", marginTop: "10px" }}
                      >
                        <option value="">{t("SelectVisitType")}</option>
                        <option value="Emergency">{t("Emergency")}</option>
                        <option value="Elective">{t("Elective")}</option>
                        <option value="Urgent">{t("Urgent")}</option>
                        <option value="Scheduled">{t("Scheduled")}</option>
                        <option value="Direct Admission">
                          {t("Direct Admission")}
                        </option>
                        <option value="Transfer">{t("Transfer")}</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="admissionDate">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {t("AdmissionDate")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input
                        type="date"
                        value={admissionDate}
                        style={{ fontSize: "12px" }}
                        className="form-control"
                        onChange={(e) => setAdmissionDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </div>
                </div>
              </>
              <>
                <div className="row">
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
                  <div className="col-md-6">
                    <Form.Group controlId="medications">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {t("Medications")}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        onChange={(e) => setMedications(e.target.value)}
                        rows={2}
                        placeholder={t("Medications")}
                        value={medications}
                        style={{ fontSize: "13px", marginTop: "10px" }}
                      />
                    </Form.Group>
                  </div>
                </div>
              </>
              <>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="Previous Hospitalizations">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {t("PreviousHospitalizations")}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        onChange={(e) =>
                          setPreviousHospitalizations(e.target.value)
                        }
                        rows={2}
                        placeholder={t("PreviousHospitalizations")}
                        value={previousHospitalizations}
                        style={{ fontSize: "13px", marginTop: "10px" }}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="ChronicConditions">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {t("ChronicConditions")}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        onChange={(e) => setChronicConditions(e.target.value)}
                        rows={2}
                        placeholder={t("ChronicConditions")}
                        value={chronicConditions}
                        style={{ fontSize: "13px", marginTop: "10px" }}
                      />
                    </Form.Group>
                  </div>
                </div>
              </>
              {!overlappedEventId && (
                <>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group controlId="PaymentStatus">
                        <Form.Label
                          style={{
                            fontSize: "13px",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                        >
                          {t("SelectPaymentType")}{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          as="select"
                          style={{ fontSize: "13px", marginTop: "10px" }}
                          s
                          value={paymentType}
                          onChange={(e) => {
                            setPaymentType(e.target.value);
                            setAmount(0);
                            setAdvanceAmount(0);
                          }}
                        >
                          <option value="">{t("SelectType")}</option>
                          <option value="normal">{t("NormalPayment")}</option>
                          <option value="partial">{t("PartialPayment")}</option>
                        </Form.Control>
                      </Form.Group>

                      {/* <Form.Group controlId="PaymentStatus">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {t("SelectPaymentStatus")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        style={{ fontSize: "13px", marginTop: "10px" }}
                        s
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                      >
                        <option value="">{t("SelectStatus")}</option>
                        <option value="paid">{t("paid")}</option>
                        <option value="notPaid">{t("notPaid")}</option>
                        <option value="partialPaid">{t("partialPaid")}</option>
                      </Form.Control>
                    </Form.Group> */}
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-6">
                          {paymentType == "partial" && (
                            <Form.Group>
                              <Form.Label
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "bold",
                                  marginTop: "10px",
                                }}
                              >
                                {t("AdvanceAmount")}
                              </Form.Label>
                              <Form.Control
                                style={{ fontSize: "13px", marginTop: "10px" }}
                                type="number"
                                placeholder={t("EnterFees")}
                                value={advanceAmount}
                                onChange={HandleAdvanceAmout}
                              />
                              <div>
                                {advanceAmountError && (
                                  <span
                                    className="text-danger"
                                    style={{ fontSize: 12 }}
                                  >
                                    {advanceAmountError}
                                  </span>
                                )}
                                {/* { !totalAmountError && advanceAmount < totalAmount && <span  className="text-danger" style={{fontSize:12}}>Amount should be equal to the total amount.</span>} */}
                              </div>
                            </Form.Group>
                          )}
                          {paymentType == "normal" && (
                            <Form.Group controlId="amount">
                              <Form.Label
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "bold",
                                  marginTop: "10px",
                                }}
                              >
                                {t("EnterAmount")}
                              </Form.Label>
                              <Form.Control
                                style={{ fontSize: "13px", marginTop: "10px" }}
                                type="number"
                                placeholder={t("EnterFees")}
                                value={amount}
                                onChange={HandleTotalAmount}
                              />
                              <div>
                                {totalAmountError && (
                                  <span
                                    className="text-danger"
                                    style={{ fontSize: 12 }}
                                  >
                                    {totalAmountError}
                                  </span>
                                )}
                                {!totalAmountError && amount < totalAmount && (
                                  <span
                                    className="text-danger"
                                    style={{ fontSize: 12 }}
                                  >
                                    {t("AmountShouldBeEqualToTheTotalAmount")}
                                  </span>
                                )}
                              </div>
                            </Form.Group>
                          )}
                        </div>
                        <div className="col-md-6">
                          <Form.Group controlId="currency">
                            <Form.Label
                              style={{
                                fontSize: "13px",
                                fontWeight: "bold",
                                marginTop: "10px",
                              }}
                            >
                              {t("Currency")}
                            </Form.Label>
                            <select
                              style={{ fontSize: "13px", marginTop: "10px" }}
                              className="form-control"
                              value={currency}
                              onChange={(e) => {
                                setCurrency(e.target.value);
                                setAmount(0);
                                setAdvanceAmount(0);
                              }}
                            >
                              <option value="">{t("Select")}</option>
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="INR">INR</option>
                              <option value="CDF">CDF</option>
                            </select>
                          </Form.Group>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group controlId="PaymentOption">
                        <Form.Label
                          style={{
                            fontSize: "13px",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                        >
                          {t("PaymentOption")}{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          as="select"
                          style={{ fontSize: "13px", marginTop: "10px" }}
                          value={paymentOption}
                          onChange={(e) => setPaymentOption(e.target.value)}
                          required
                        >
                          <option value="">{t("SelectPaymentOption")}</option>
                          <option value="Online">{t("Online")}</option>
                          <option value="Cash">{t("Cash")}</option>
                        </Form.Control>
                      </Form.Group>
                    </div>
                    <div className="col-6">
                      <Form.Group controlId="PaymentDateTime">
                        <Form.Label
                          style={{
                            fontSize: "13px",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                        >
                          {t("PaymentDateandTime")}
                        </Form.Label>
                        <input
                          type="datetime-local"
                          value={paymentDateTime}
                          min={new Date().toISOString().split(".")[0]}
                          onChange={(e) => {
                            const selectedDateTime = new Date(e.target.value);
                            const currentDateTime = new Date();

                            if (selectedDateTime < currentDateTime) {
                              setPaymentDateTime(null);
                              toast.error(t("PastDateError"));
                            } else {
                              setPaymentDateTime(e.target.value);
                            }
                            //setPaymentDateTime(e.target.value);
                          }}
                          className="form-control"
                        />
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <span className="my-4">
                        {t("TheTotalAmountInclude")} {securityDeposit}{" "}
                        {hospital?.baseCurrency} {t("securityDeposit")}.
                      </span>
                      <div className="d-flex my-2">
                        <span
                          className="fw-bold me-2 py-1 px-2 bg-secondary rounded"
                          style={{ backgroundColor: "#6c757d92" }}
                        >
                          {t("Total")} : {totalAmount} /-
                        </span>
                        {paymentType !== "normal" && (
                          <>
                            <span
                              className="fw-bold mx-2 py-1 px-2  rounded"
                              style={{ backgroundColor: "#ffc1079a" }}
                            >
                              {t("AdvancedPaid")} : {advanceAmount}
                            </span>
                            <span
                              className="fw-bold mx-2 py-1 px-2 rounded"
                              style={{ backgroundColor: "#dc35468f" }}
                            >
                              {t("DueAmount")} : {}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAndReset}>
              {t("Close")}
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {t("Submit")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default HospitalAdmissionForm;
