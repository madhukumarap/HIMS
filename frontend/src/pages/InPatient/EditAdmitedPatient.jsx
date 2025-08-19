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

const EditAdmitedPatient = (props) => {
  const {
    showModal,
    handleCloseModal,
    admissionID,
    newEventStart,
    newEventEnd,
    overlappedEventId,
    bedPrice,
    BedNumber,
  } = props;
  const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });

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
  const [securityDeposit, setSecurityDeposit] = useState(2000);
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

  const paymentTypeOptions = [{ label: "Normal Payment", value: "normal" }];

  registerLocale("fr", fr);
  registerLocale("en", enIN);

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

  const getAdmissionDetails = () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/hospitalAdmissions/${admissionID}`,
        { headers: { Authorization: `Bearer ${currentUser?.Token}` } }
      )
      .then((response) => {
        console.log("Admission Data :", response.data.data);
      });
  };

  useEffect(() => {
    getAdmissionDetails();
  }, []);

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  //   const formatDateInSelectedLanguage2 = (date) => {
  //     const selectedLanguage = i18n.language || "en";
  //     const formatPattern = "MM/dd/yyyy, hh:mm a";
  //     const locale = locales[selectedLanguage];
  //     return format(date, formatPattern, { locale });
  //   };

  const HandleTotalAmount = (e) => {
    let value = e.target.value;
    if (value > totalAmount) {
      // toast.error("Amount should be equal to the total amount.")
      setTotalAmountError("Amount should be equal to the total amount.");
      return;
    }

    setAmount(value);
    setTotalAmountError(undefined);
  };

  const HandleAdvanceAmout = (e) => {
    let value = e.target.value;
    if (value > totalAmount) {
      setAdvanceAmountError(
        "Advance amount should be equal to the total amount"
      );
      return;
    }

    setAdvanceAmount(value);
    setAdvanceAmountError(undefined);
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
          //   onHide={handleCloseAndReset}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "16px" }}>
              {/* {t("PatientAdmission")} ({t("AllocatingBedNumber")}: */}
              {/* {overlappedEventId ? overlapEventBedID : BedNumber}) */}
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
                          //   onChange={handleStartChange}
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
                          //   onChange={handleEndChange}
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
                        }}
                      >
                        <option value="">{t("SelectType")}</option>
                        <option value="normal">{t("NormalPayment")}</option>
                        <option value="partial">{t("PartialPayment")}</option>
                      </Form.Control>
                    </Form.Group>
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
                                  Amount should be equal to the total amount.
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
                            onChange={(e) => setCurrency(e.target.value)}
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
                      The total amount include {securityDeposit} /- security
                      deposit.
                    </span>
                    <div className="d-flex my-2">
                      <span
                        className="fw-bold me-2 py-1 px-2 bg-secondary rounded"
                        style={{ backgroundColor: "#6c757d92" }}
                      >
                        Total : {totalAmount} /-
                      </span>
                      <span
                        className="fw-bold mx-2 py-1 px-2  rounded"
                        style={{ backgroundColor: "#ffc1079a" }}
                      >
                        Advanced Paid : {advanceAmount}
                      </span>
                      <span
                        className="fw-bold mx-2 py-1 px-2 rounded"
                        style={{ backgroundColor: "#dc35468f" }}
                      >
                        Due Amount : {}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              {t("Close")}
            </Button>
            <Button variant="primary" onClick={""}>
              {t("Submit")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default EditAdmitedPatient;
