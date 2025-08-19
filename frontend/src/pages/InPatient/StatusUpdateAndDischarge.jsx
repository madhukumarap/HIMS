import React, { useContext, useState } from "react";
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
import { MdOutlinePayment } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { toast } from "react-toastify";
import Translation from "../../translations/StatusUpdateAndDischarge.json";
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
import { FaCalendar, FaCartPlus, FaPenAlt, FaPlus } from "react-icons/fa";
import EditAdmitedPatient from "./EditAdmitedPatient";
import { CurrencyContext } from "../../context/CurrencyProvider";

const localizer = momentLocalizer(moment);

const StatusUpdateAndDischare = () => {
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  const [patientNameFilter, setPatientNameFilter] = useState("");

  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [AdmissionFormID, setAdmissionFormID] = useState(false);
  const [showAdvancePopUp, setAdvancePopUp] = useState(false);
  const [showExpensePopUp, setExpensePopUp] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const locales = { enIN, fr };
  // const [currency, setCurrency] = useState("");
  const [hospitalRooms, setHospitalRooms] = useState([]);

  ///

  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  const [Patient, setPatient] = useState({});
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [advanceAmountError, setAdvanceAmountError] = useState(undefined);
  const [totalAmountError, setTotalAmountError] = useState(undefined);
  const [currency, setCurrency] = useState("");
  const [paymentType, setPaymentType] = useState(undefined);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [hospital, setHospital] = useState();
  const [pathologyData, setPathologyData] = useState([]);

  ///

  const getHospitalAdmissionList = () => {
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
  };

  const HandleTotalAmount = (e) => {
    let value = e.target.value;

    if (value > Patient?.DueAmount) {
      // toast.error("Amount should be equal to the total amount.")
      setTotalAmountError("Amount should be equal to the due amount.");
      return;
    }

    setPaymentAmount(value);
    setTotalAmountError(undefined);
  };

  const HandleAdvanceAmout = (e) => {
    let value = e.target.value;
    if (value > Patient?.DueAmount) {
      setAdvanceAmountError("Advance amount should be equal to the due amount");
      return;
    }

    setAdvanceAmount(value);
    setAdvanceAmountError(undefined);
  };

  const getAdmissionDetails = (id) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/hospitalAdmissions/${id}`, {
        headers: { Authorization: `Bearer ${currentUser?.Token}` },
      })
      .then((response) => {
        // console.log('Admission Data :', response.data.data)
        setPatient(response.data.data);
        setPaymentType(response.data.data.PaymentType);
        setCurrency(response.data.data.Currency);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getHospitalDetails = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getSecurityDeopsit`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        console.log(response);
        // setSecurityDeposit(response.data.securityDeposit)
        setHospital(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPathologyData = (id) => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/getPathologyDataUsingAdmissionId/${id}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        // setSecurityDeposit(response.data.securityDeposit)
        setPathologyData(response.data);
        console.log("PathologyData :", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const PaymentHandler = () => {
    if (paymentType == "normal") {
      if (paymentAmount <= 0) {
        toast.error("Enter valid amount");
        return;
      }
      if (totalAmountError != undefined) {
        toast.error("Enter valid amount");
        return;
      }
    }

    if (paymentType == "partial") {
      if (advanceAmount <= 0) {
        toast.error("Enter valid amount");
        return;
      }

      if (advanceAmountError != undefined) {
        toast.error("Enter valid amount");
        return;
      }
    }

    let formData = {
      currency,
      advanceAmount,
      paymentType,
      paymentAmount,
      paymentDateTime,
    };

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/updatePayment/${Patient?.id}`,
        formData,
        { headers: { Authorization: `Bearer ${currentUser?.Token}` } }
      )
      .then((response) => {
        toast.success("Payment successfull");
        setCurrency("");
        setAdvanceAmount(0);
        setPaymentAmount(0);
        setPaymentType(0);
        setShowAdmissionForm(false);
        getHospitalAdmissionList();
      })
      .catch((error) => {
        toast.error("Payment failed");
        console.log(error);
      });
  };

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
  const [treatmentPlanModalShow, setTreatmentPlanModalShow] = useState(false);
  const [treatmentPlan, setTreatmentPlan] = useState("");

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  useEffect(() => {
    getRoomsData();
    fetchPatientList();
    fetchDoctorList();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [patientList, setPatientList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [AdmissionType, setAdmissionType] = useState("");
  const [reason, setReason] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("notPaid");
  const [amount, setAmount] = useState(0);
  const [paymentDateTime, setPaymentDateTime] = useState(null);
  const [admissionDate, setAdmissionDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Set default to today's date

  const [paymentOption, setPaymentOption] = useState("");

  const [referringPhysician, setReferringPhysician] = useState("");

  const [previousHospitalizations, setPreviousHospitalizations] = useState("");

  const [chronicConditions, setChronicConditions] = useState("");

  const [medications, setMedications] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  const [dischargeDate, setDischargeDate] = useState(new Date());
  const [dischargeInstruction, setDischargeInstruction] = useState("");
  const [dischargeModalShow, setDischargeModalShow] = useState(false);
  const handleDischargeStatusUpdate = (admission) => {
    setAdmissionID(admission.id);
    setDischargeDate(new Date(admission.DischargeDate));
    setDischargeInstruction(admission.DischargeInstruction);
    setDischargeModalShow(true);
  };
  const handleCloseDischargeModal = () => {
    setDischargeModalShow(false);
  };

  const handleTreatmentPlanCreation = (admissionId) => {
    setAdmissionID(admissionId.id);
    setTreatmentPlan(admissionId?.TreatmentPlan || "");
    setTreatmentPlanModalShow(true);
  };
  const handleCloseTreatmentPlanModal = () => {
    setTreatmentPlanModalShow(false);
  };

  const handleTreatmentPlanChange = (e) => {
    setTreatmentPlan(e.target.value);
  };
  const handleDischargeSubmit = () => {
    const dischargeData = {
      AdmissionID: AdmissionID,
      DischargeDate: dischargeDate,
      DischargeInstruction: dischargeInstruction,
    };

    axios
      .post(
        `${
          import.meta.env.VITE_API_URL
        }/api/UpdateStatus-Of-Discharge-AdmittedPatient`,
        dischargeData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        toast.success(t("DischargeUpdatesSavedSuccessfully"));
        setDischargeModalShow(false);
      })
      .catch((error) => {
        toast.error(t("ErrorSavingDischargeUpdates"));
      });
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

  console.log("Patient:", Patient);

  const [hospitalAdmissions, setHospitalAdmissions] = useState([]);

  useEffect(() => {
    getHospitalAdmissionList();
    getHospitalDetails();
  }, []);
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

  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [patientCondition, setPatientCondition] = useState("");
  const [nursingNotes, setNursingNotes] = useState("");
  const [physicianNotes, setPhysicianNotes] = useState("");
  const [AdmissionID, setAdmissionID] = useState(null);
  const handleUpdateStatus = (admission) => {
    setAdmissionID(admission.id);
    setPatientCondition(admission?.patientCondition);
    setPhysicianNotes(admission?.physicianNotes);
    setNursingNotes(admission?.nursingNotes);
    setUpdateModalShow(true);
  };

  const handleSaveTreatmentPlan = () => {
    const treatmentPlanData = {
      AdmissionID: AdmissionID,
      TreatmentPlan: treatmentPlan,
    };

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/HospitalAdminSaveTreatmentPlan`,
        treatmentPlanData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        toast.success(t("TreatmentPlanSavedSuccessfully"));
        setTreatmentPlanModalShow(false);
      })
      .catch((error) => {
        toast.error(t("ErrorSavingTreatmentPlan"));
      });
  };

  const getAdvanceData = () => {};

  const getExpenseData = (id) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/totalExpenses/${id}`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateSubmit = () => {
    // Send the updates to the Node.js backend along with admissionId
    const updatesData = {
      AdmissionID: AdmissionID,
      patientCondition,
      nursingNotes,
      physicianNotes,
    };

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/UpdateStatus-Of-AdmittedPatient`,
        updatesData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        toast.success(t("UpdatesSavedSuccessfully"));
        setUpdateModalShow(false);
      })
      .catch((error) => {
        toast.error(t("ErrorSavingUpdates"));
      });
  };

  const validateForm = () => {
    // alert(selectedDoctorId);
    return (
      selectedPatientId !== "" &&
      selectedDoctorId !== "" &&
      referringPhysician !== "" &&
      AdmissionType !== "" &&
      admissionDate !== "" &&
      reason !== "" &&
      paymentStatus !== "" &&
      (paymentStatus === "paid" ? amount > 0 && currency !== "" : true) &&
      paymentOption !== ""
    );
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
  return (
    <>
      <div style={{ marginLeft: "1%", marginRight: "1%" }}>
        <Link to={`/${extractedPart}/StatusUpdateAndDischare`}>
          <button
            style={{
              fontSize: "12px",
              padding: "4px 5px",
              marginTop: "0px",
              marginLeft: "10px",
            }}
            className="btn btn-secondary mr-2"
          >
            {t("AdmissionList")}
          </button>
        </Link>
        <Link to={`/${extractedPart}/admissionAndDischarge`}>
          <button
            title="Go Back"
            style={{
              fontSize: "12px",
              padding: "4px 5px",
              marginTop: "0px",
              marginLeft: "10px",
            }}
            className="btn btn-secondary mr-2"
          >
            {t("BedStatus")}
          </button>
        </Link>
        <Link to={`/${extractedPart}/DischargePatient`}>
          <button
            title="Go Back"
            style={{
              fontSize: "12px",
              padding: "4px 5px",
              marginTop: "0px",
              marginLeft: "10px",
            }}
            className="btn btn-secondary mr-2"
          >
            {t("DischargePatients")}
          </button>
        </Link>
        <header
          className="header"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {t("Admission&DischargeManagement")}
        </header>
        <br></br>
        <div>
          <label>
            {/* {t("FilterByPatientName")}: */}
            <input
              type="text"
              placeholder={t("SearchbyName")}
              className="form-control"
              value={patientNameFilter}
              onChange={(e) => setPatientNameFilter(e.target.value)}
            />
          </label>
        </div>
        <br></br>
        <Table
          className="table-striped table-hover table-bordered"
          style={{
            verticalAlign: "middle",
            textAlign: "center",
            fontSize: "12px",
          }}
          bordered
          striped
          responsive
        >
          <Thead>
            <Tr style={{ verticalAlign: "middle", textAlign: "center" }}>
              <Th style={{ textAlign: "center" }}>
                {t("statusupdatedischargeTable.SrNo")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("statusupdatedischargeTable.BedID")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("statusupdatedischargeTable.RoomNumber")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("statusupdatedischargeTable.BedType")}
              </Th>

              <Th style={{ textAlign: "center" }}>
                {t("statusupdatedischargeTable.PatientName")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("statusupdatedischargeTable.AdmissionDate")}
              </Th>
              <Th style={{ textAlign: "center" }}>{t("Total Paid")}</Th>

              <Th style={{ textAlign: "center" }}>
                {t("statusupdatedischargeTable.TotalExpense")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("statusupdatedischargeTable.Action")}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {hospitalAdmissions
              .filter((admission) =>
                admission.PatientName.toLowerCase().includes(
                  patientNameFilter.toLowerCase()
                )
              )
              .map((admission, index) => (
                <Tr key={admission.id}>
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {index + 1}
                  </Td>
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {admission.BedNumber}
                  </Td>
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {admission.RoomNumber}
                  </Td>
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {admission.BedType}
                  </Td>
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {admission.PatientName}
                  </Td>
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {formatDateInSelectedLanguage(
                      new Date(admission.AdmissionDate)
                    )}
                  </Td>
                  {/* <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {admission.DischargeDate
                    ? formatDateInSelectedLanguage(
                        new Date(admission.DischargeDate)
                      )
                    : "NA"}
                </Td> */}
                  {/* <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {admission.PatientPhoneNo}
                  </Td> */}
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {/* <span onClick={() => setAdvancePopUp(true)} role="button" className="text-primary text-decoration-underline">{admission.TotalAdvance}</span> */}
                    {admission.PaymentType !== "normal"
                      ? convertCurrency(
                          admission.TotalAdvance,
                          admission.Currency,
                          selectedGlobalCurrency
                        )
                      : convertCurrency(
                          admission.TotalAmount,
                          admission.Currency,
                          selectedGlobalCurrency
                        )}{" "}
                    {selectedGlobalCurrency}
                  </Td>
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {/* <span
                      onClick={() => {
                        getAdmissionDetails(admission.id);
                        getPathologyData(admission.id);
                        setExpensePopUp(true);
                      }}
                      role="button"
                      className="text-primary text-decoration-underline"
                    >
                      {admission.TotalExpense}
                    </span> */}
                    {convertCurrency(
                      admission.TotalExpense,
                      admission.Currency,
                      selectedGlobalCurrency
                    )}{" "}
                    {selectedGlobalCurrency}
                  </Td>
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    <Button
                      style={{
                        fontSize: "12px",
                        marginTop: "0px",
                        padding: "4px 8px",
                      }}
                      title={t("CreateTreatmentPlan")}
                      variant="secondary"
                      size="lg"
                      onClick={() => handleTreatmentPlanCreation(admission)}
                    >
                      <FaPenAlt />
                    </Button>
                    <Button
                      style={{
                        fontSize: "12px",
                        marginTop: "0px",
                        // marginLeft: "10px",
                        padding: "4px 8px",
                      }}
                      title={t(
                        "statusupdatedischargeTable.UpdatePatientCondtionStatus"
                      )}
                      variant="secondary"
                      size="lg"
                      onClick={() => handleUpdateStatus(admission)}
                    >
                      <FaPlus />
                    </Button>{" "}
                    <Link to={`/${extractedPart}/InpatientCalender`}>
                      <Button
                        style={{
                          fontSize: "12px",
                          marginTop: "0px",
                          padding: "4px 8px",
                        }}
                        title={t(
                          "statusupdatedischargeTable.UpdateCalenderEvent"
                        )}
                        variant="secondary"
                        size="lg"
                      >
                        <FaCalendar />
                      </Button>
                    </Link>
                    {/* <Link to={`/${extractedPart}/InpatientCalender`}> */}
                    <Button
                      style={{
                        fontSize: "12px",
                        marginTop: "0px",

                        padding: "4px 8px",
                      }}
                      title={t("payment")}
                      variant="secondary"
                      size="lg"
                      onClick={() => {
                        getAdmissionDetails(admission.id);
                        setShowAdmissionForm(true);
                      }}
                    >
                      <MdOutlinePayment size={17} />
                    </Button>
                    {/* </Link> */}
                    {/* <Button
                    style={{ fontSize: "12px" }}
                    variant="secondary"
                    size="lg"
                    onClick={() => handleDischargeStatusUpdate(admission)}
                  >
                    <FaPenAlt />
                  </Button> */}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        <Modal
          centered
          style={{ fontSize: "12px", marginTop: "20px" }}
          show={updateModalShow}
          onHide={() => setUpdateModalShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "16px" }}>
              {t("PatientConditionUpdates")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="patientCondition">
                <Form.Label
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("PatientConditionUpdates")}:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={patientCondition}
                  placeholder={t("EnterPatientCondition")}
                  onChange={(e) => setPatientCondition(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="nursingNotes">
                <Form.Label
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("NursingNotes")}:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder={t("EnterNursingNotes")}
                  rows={3}
                  value={nursingNotes}
                  onChange={(e) => setNursingNotes(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="physicianNotes">
                <Form.Label
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("PhysicianNotes")}:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder={t("EnterPhysicianNotes")}
                  rows={3}
                  value={physicianNotes}
                  onChange={(e) => setPhysicianNotes(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              style={{
                fontSize: "12px",
              }}
              variant="secondary"
              onClick={handleUpdateSubmit}
            >
              {t("Save")}
            </Button>
            <Button
              style={{
                fontSize: "12px",
              }}
              variant="secondary"
              onClick={() => setUpdateModalShow(false)}
            >
              {t("Close")}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          centered
          style={{ fontSize: "12px", marginTop: "20px" }}
          show={treatmentPlanModalShow}
          onHide={handleCloseTreatmentPlanModal}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "16px" }}>
              {t("CreateTreatmentPlan")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="treatmentPlan">
                <Form.Label
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("TreatmentPlan")}:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={treatmentPlan}
                  placeholder={t("EnterTreatmentPlan")}
                  onChange={handleTreatmentPlanChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              style={{ fontSize: "12px" }}
              variant="secondary"
              onClick={handleCloseTreatmentPlanModal}
            >
              {t("Close")}
            </Button>
            <Button
              style={{ fontSize: "12px" }}
              variant="secondary"
              onClick={() => handleSaveTreatmentPlan()}
            >
              {t("Save")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* {AdmissionFormID && <EditAdmitedPatient showModal={showAdmissionForm} handleCloseModal ={()=> setShowAdmissionForm(false)} admissionID = {AdmissionFormID}/>} */}

      <Modal
        style={{ marginTop: "20px" }}
        centered
        backdrop="static"
        size="lg"
        show={showAdmissionForm}
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
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </Form.Label>
                    <Form.Control
                      value={Patient?.PatientName}
                      // onChange={(e) => setSelectedPatientId(e.target.value)}
                      style={{
                        fontSize: "13px",

                        marginTop: "10px",
                      }}
                      disabled
                    >
                      {/* <option value="">{t("selectaPatient")}</option> */}
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
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </Form.Label>
                    <Form.Control
                      value={Patient?.AdmittingPhysician}
                      disabled
                      // onChange={(e) => setSelectedDoctorId(e.target.value)}
                      style={{ fontSize: "13px", marginTop: "10px" }}
                    >
                      {/* <option value="">{t("selectaDoctor")}</option> */}
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
                      style={{ fontSize: "13px", marginTop: "10px" }}
                      value={Patient?.ReferringPhysician}
                      // onChange={(e) => setReferringPhysician(e.target.value)}
                      disabled
                    >
                      {/* <option value="">
                          {t("SelectReferringPhysician")}
                        </option> */}
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
                      {t("UpdateBed")}
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </Form.Label>
                    <Form.Select
                      as="select"
                      disabled
                      style={{ fontSize: "12px" }}
                      value={Patient?.BedNumber + " " + Patient?.BedType}
                      // onChange={(e) => setSelectedBed(e.target.value)}
                    >
                      <option value="">{t("SelectaBed")}</option>
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
                      <Form.Control value={Patient?.CheckInTime} disabled />
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
                      <Form.Control value={Patient?.CheckOutTime} disabled />
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
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </Form.Label>
                    <Form.Control
                      value={Patient?.AdmissionType}
                      disabled
                      // onChange={(e) => setAdmissionType(e.target.value)}
                      style={{ fontSize: "13px", marginTop: "10px" }}
                    >
                      {/* <option value="">{t("SelectVisitType")}</option>
                        <option value="Emergency">{t("Emergency")}</option>
                        <option value="Elective">{t("Elective")}</option>
                        <option value="Urgent">{t("Urgent")}</option>
                        <option value="Scheduled">{t("Scheduled")}</option>
                        <option value="Direct Admission">
                          {t("Direct Admission")}
                        </option>
                        <option value="Transfer">{t("Transfer")}</option> */}
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
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </Form.Label>
                    <input
                      type="date"
                      value={Patient?.AdmissionDate}
                      disabled
                      style={{ fontSize: "12px" }}
                      className="form-control"
                      // onChange={(e) => setAdmissionDate(e.target.value)}
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
                      {/* {t("reason")} <span style={{ color: "red" }}>*</span> */}
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      // onChange={(e) => setReason(e.target.value)}
                      rows={2}
                      placeholder={t("reason")}
                      value={Patient?.ReasonForAdmission}
                      disabled
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
                      // onChange={(e) => setMedications(e.target.value)}
                      rows={2}
                      placeholder={t("Medications")}
                      value={Patient?.Medications}
                      disabled
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
                      // onChange={(e) =>
                      //   setPreviousHospitalizations(e.target.value)
                      // }
                      rows={2}
                      placeholder={t("PreviousHospitalizations")}
                      value={Patient?.PreviousHospitalizations}
                      disabled
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
                      // onChange={(e) => setChronicConditions(e.target.value)}
                      rows={2}
                      placeholder={t("ChronicConditions")}
                      value={Patient?.ChronicConditions}
                      disabled
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
                      defaultValue={Patient?.PaymentType}
                      value={paymentType}
                      disabled={Patient?.PaymentStatus == "paid" ? true : true} //false
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
                            {t("Due Amount")}
                          </Form.Label>
                          <Form.Control
                            style={{ fontSize: "13px", marginTop: "10px" }}
                            type="number"
                            placeholder={t("EnterFees")}
                            disabled={
                              Patient?.PaymentStatus == "paid" ? true : false
                            }
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
                            value={paymentAmount}
                            disabled={
                              Patient?.PaymentStatus == "paid" ? true : false
                            }
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
                            {!totalAmountError &&
                              amount < Patient?.DueAmount && (
                                <span
                                  className="text-danger"
                                  style={{ fontSize: 12 }}
                                >
                                  Amount should be equal to the due amount.
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
                          disabled={
                            Patient?.PaymentStatus == "paid" ? true : true //false
                          }
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
                      disabled={Patient?.PaymentStatus == "paid" ? true : false}
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
                      disabled={Patient?.PaymentStatus == "paid" ? true : false}
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
                  {Patient?.PaymentStatus == "paid" && (
                    <span className="my-4 text-success">
                      {t("PaymentSuccessfullyCompleted")}
                    </span>
                  )}
                  <div className="d-flex my-2">
                    <span
                      className={`fw-bold me-2 py-1 px-2 bg-secondary rounded ${
                        Patient?.PaymentStatus == "paid"
                          ? "bg-success "
                          : "bg-secondary text-light"
                      }`}
                    >
                      {" "}
                      {Patient?.PaymentStatus == "paid"
                        ? "Total Paid"
                        : t("Total")}{" "}
                      : {Patient?.TotalAmount} {Patient?.Currency}
                    </span>
                    {paymentType !== "normal" && (
                      <>
                        <span
                          className="fw-bold mx-2 py-1 px-2  rounded"
                          style={{ backgroundColor: "#ffc1079a" }}
                        >
                          {t("AdvancedPaid")} : {Patient?.AdvanceAmount}{" "}
                          {Patient?.Currency}
                        </span>
                        <span
                          className="fw-bold mx-2 py-1 px-2 rounded"
                          style={{ backgroundColor: "#dc35468f" }}
                        >
                          {t("DueAmount")} : {Patient?.DueAmount}{" "}
                          {Patient?.Currency}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAdmissionForm(false)}
          >
            {t("Close")}
          </Button>
          <Button
            disabled={Patient?.PaymentStatus == "paid" ? true : false}
            variant="primary"
            onClick={PaymentHandler}
          >
            {t("Submit")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Advance amount pop-up  */}

      <Modal
        show={showAdvancePopUp}
        centered
        onHide={() => setAdvancePopUp(false)}
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>Advance popup</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setAdvancePopUp(false)}
          >
            {t("Close")}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Total expense amount pop-up  */}

      <Modal
        size="lg"
        show={showExpensePopUp}
        centered
        onHide={() => setExpensePopUp(false)}
      >
        <Modal.Header>Total Expenses Summary</Modal.Header>
        <Modal.Body>
          <Table
            className="table-striped table-hover table-bordered"
            style={{
              verticalAlign: "middle",
              textAlign: "center",
              fontSize: "12px",
            }}
            bordered
            striped
            responsive
          >
            <Thead>
              <Tr style={{ verticalAlign: "middle", textAlign: "center" }}>
                <Th style={{ textAlign: "center" }}>Security Deposit</Th>
                <Th style={{ textAlign: "center" }}>Bed Charges</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {hospital?.securityDeposit} {hospital?.currency}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {Number(Patient?.TotalAmount) -
                    Number(hospital?.securityDeposit)}
                </Td>
              </Tr>
            </Tbody>
          </Table>

          <div className="my-2">
            <span>Pathology Tests</span>
          </div>
          <Table
            className="table-striped table-hover table-bordered"
            style={{
              verticalAlign: "middle",
              textAlign: "center",
              fontSize: "12px",
            }}
            bordered
            striped
            responsive
          >
            <Thead>
              <Tr style={{ verticalAlign: "middle", textAlign: "center" }}>
                <Th style={{ textAlign: "center" }}>Test Names</Th>
                <Th style={{ textAlign: "center" }}>Test Charges</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {pathologyData[0]?.selectedTests}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {pathologyData[0]?.testFees} {pathologyData[0]?.Currency}
                </Td>
              </Tr>
            </Tbody>
          </Table>

          <div className="my-2">
            <span>Diagnostic Tests</span>
          </div>
          <Table
            className="table-striped table-hover table-bordered"
            style={{
              verticalAlign: "middle",
              textAlign: "center",
              fontSize: "12px",
            }}
            bordered
            striped
            responsive
          >
            <Thead>
              <Tr style={{ verticalAlign: "middle", textAlign: "center" }}>
                <Th style={{ textAlign: "center" }}>Test Name</Th>
                <Th style={{ textAlign: "center" }}>Test Charges</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  test ABC
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  100 USD
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setExpensePopUp(false)}
          >
            {t("Close")}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StatusUpdateAndDischare;
