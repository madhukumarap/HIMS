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
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { toast } from "react-toastify";
import Translation from "../../translations/EHRReport.json";
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
import {
  FaCalendar,
  FaCartPlus,
  FaDiscord,
  FaPenAlt,
  FaPlus,
  FaRegEye,
} from "react-icons/fa";

const localizer = momentLocalizer(moment);

const DischargePatient = (props) => {
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const { admissionIDEHR } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const locales = { enIN, fr };

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
  const [followUpAppointment, setFollowUpAppointment] = useState(
    "No Follow-up Required"
  );
  const [authorizedConsent, setAuthorizedConsent] = useState(false);
  const [patientSignature, setPatientSignature] = useState("");

  const [dischargeDate, setDischargeDate] = useState(new Date());
  const [dischargeInstruction, setDischargeInstruction] = useState("");
  const [dischargeModalShow, setDischargeModalShow] = useState(false);
  const handleDischargeStatusUpdate = (admission) => {
    setAdmissionID(admission.id);
    setDischargeDate(new Date(admission?.DischargeDate));
    setDischargeInstruction(admission?.DischargeInstruction);
    setPatientSignature(admission?.PatientSignature);
    setAuthorizedConsent(admission?.AuthorizedConsent);
    // alert(admission.FollowUpAppointments);
    setFollowUpAppointment(admission?.FollowUpAppointments);
    setDischargeModalShow(true);
  };
  const handleCloseDischargeModal = () => {
    setDischargeModalShow(false);
  };

  const [billingInformation, setBillingInformation] = useState("");
  const [insuranceClaimDetails, setInsuranceClaimDetails] = useState("");
  const [paymentStatusDropdown, setPaymentStatusDropdown] = useState("");
  const paymentStatusOptions = [
    t("selectPaymentStatus"),
    t("insurancePending"),
    t("paymentPending"),
    t("paidInFull"),
    t("partiallyPaid"),
    t("notYetBilled"),
  ];

  const handleDischargeSubmit = () => {
    const dischargeData = {
      AdmissionID: AdmissionID,
      DischargeDate: dischargeDate,
      DischargeInstruction: dischargeInstruction,
      FollowUpAppointment: followUpAppointment,
      AuthorizedConsent: authorizedConsent,
      PatientSignature: patientSignature,
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
        toast.success(t("dischargeUpdatesSavedSuccessfully"));
        setDischargeModalShow(false);
      })
      .catch((error) => {
        toast.error(t("errorSavingDischargeUpdates"));
      });
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

  const [prescriptionModalShow, setPrescriptionModalShow] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [AdmissionID, setAdmissionID] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);

  const handleFetchPrescriptionData = (AdmissionID) => {
    //alert(admissionId);
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/getOnePrescriptionForIn-patient/${AdmissionID}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        setPrescriptionData(response.data?.prescription);
        // Show the modal with prescription data here
        setPrescriptionModalShow(true);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(`Error: ${error.response.data.message}`);
        } else {
          toast.error(t("anErrorOccurredWhileFetchingPrescriptionData"));
        }
        console.error("Error fetching prescription data:", error);
      });
  };
  const handleClosePrescriptionModal = () => {
    setPrescriptionModalShow(false);
    // Reset prescription data when modal is closed
    setPrescriptionData(null);
  };

  const [dischargeSummaryModalShow, setDischargeSummaryModalShow] =
    useState(false);
  const [summaryOfTreatment, setSummaryOfTreatment] = useState("");
  const [postDischargeCare, setPostDischargeCare] = useState("");
  const [transferInformation, setTransferInformation] = useState(false);
  const [transferFacility, setTransferFacility] = useState("");
  const [transferDateTime, setTransferDateTime] = useState(null);

  const handleDischargeSummary = (admission) => {
    setAdmissionID(admission.id);
    setSummaryOfTreatment(admission.summaryOfTreatment || "");
    setPostDischargeCare(admission.postDischargeCare || "");
    setTransferInformation(admission.transferInformation || false);
    setTransferFacility(admission.transferFacility || "");
    setTransferDateTime(
      admission.transferDateTime
        ? new Date(admission.transferDateTime)
        : new Date()
    );
    setBillingInformation(admission.BillingInformation || "");
    setInsuranceClaimDetails(admission.InsuranceClaimDetails || "");
    setPaymentStatusDropdown(admission.PaymentStatusDischarge || "");
    setDischargeSummaryModalShow(true);
  };

  const handleCloseDischargeSummaryModal = () => {
    setDischargeSummaryModalShow(false);
  };

  const handleDischargeSummarySubmit = () => {
    const dischargeSummaryData = {
      AdmissionID: AdmissionID,
      SummaryOfTreatment: summaryOfTreatment,
      PostDischargeCare: postDischargeCare,
      TransferInformation: transferInformation,
      TransferFacility: transferFacility,
      TransferDateTime: transferDateTime,
      BillingInformation: billingInformation,
      InsuranceClaimDetails: insuranceClaimDetails,
      PaymentStatus: paymentStatusDropdown,
    };

    axios
      .post(
        `${
          import.meta.env.VITE_API_URL
        }/api/updateAdmittedPatientDischargeSummary`,
        dischargeSummaryData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        toast.success(t("dischargeSummaryUpdatedSuccessfully"));
        setDischargeSummaryModalShow(false);
      })
      .catch((error) => {
        toast.error(t("errorUpdatingDischargeSummary"));
      });
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
        {!admissionIDEHR && (
          <>
            <Link to={`/${extractedPart}/StatusUpdateAndDischare`}>
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
                {t("admissionList")}
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
                {t("bedStatus")}
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
                {t("dischargePatients")}
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
              {t("AdmissionAndDischargeManagement")}
            </header>
            <br></br>
          </>
        )}
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
                {t("AdmissionAndDischargeManagementTable.srNo")}
              </Th>
              {!admissionIDEHR && (
                <Th style={{ textAlign: "center" }}>
                  {t("AdmissionAndDischargeManagementTable.bedID")}
                </Th>
              )}
              {!admissionIDEHR && (
                <Th style={{ textAlign: "center" }}>
                  {t("AdmissionAndDischargeManagementTable.roomNumber")}
                </Th>
              )}
              {!admissionIDEHR && (
                <Th style={{ textAlign: "center" }}>
                  {t("AdmissionAndDischargeManagementTable.bedType")}
                </Th>
              )}

              <Th style={{ textAlign: "center" }}>
                {t("AdmissionAndDischargeManagementTable.patientName")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("AdmissionAndDischargeManagementTable.patientPhoneNo")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("AdmissionAndDischargeManagementTable.admissionDate")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("AdmissionAndDischargeManagementTable.dischargeDate")}
              </Th>
              {admissionIDEHR && (
                <Th style={{ textAlign: "center" }}>
                  {t(
                    "AdmissionAndDischargeManagementTable.dischargeInstructions"
                  )}
                </Th>
              )}
              {admissionIDEHR && (
                <Th style={{ textAlign: "center" }}>
                  {t(
                    "AdmissionAndDischargeManagementTable.followUpAppointments"
                  )}
                </Th>
              )}
              <Th style={{ textAlign: "center" }}>
                {t("AdmissionAndDischargeManagementTable.action")}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {hospitalAdmissions
              .filter(
                (admission) =>
                  !admissionIDEHR || admission.id === admissionIDEHR
              )
              .map((admission, index) => (
                <Tr key={admission.id}>
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {index + 1}
                  </Td>
                  {!admissionIDEHR && (
                    <Td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {admission.BedNumber}
                    </Td>
                  )}

                  {!admissionIDEHR && (
                    <Td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {admission.RoomNumber}
                    </Td>
                  )}
                  {!admissionIDEHR && (
                    <Td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {admission.BedType}
                    </Td>
                  )}
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {admission.PatientName}
                  </Td>
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {admission.PatientPhoneNo}
                  </Td>
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {formatDateInSelectedLanguage(
                      new Date(admission.AdmissionDate)
                    )}
                  </Td>
                  <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    {admission.DischargeDate
                      ? formatDateInSelectedLanguage(
                          new Date(admission.DischargeDate)
                        )
                      : "NA"}
                  </Td>
                  {admissionIDEHR && (
                    <Td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {admission?.DischargeInstruction}
                    </Td>
                  )}
                  {admissionIDEHR && (
                    <Td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {admission?.FollowUpAppointments}
                    </Td>
                  )}
                  <Td
                    style={{
                      verticalAlign: "middle",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {/* <Link to={`/InpatientCalender`}>
                    <Button
                      style={{ fontSize: "12px" }}
                      title="Update Calender Event"
                      variant="secondary"
                      size="lg"
                    >
                      <FaCalendar />
                    </Button>
                  </Link> */}
                    {!admissionIDEHR && (
                      <>
                        <Button
                          title="Discharge"
                          style={{
                            fontSize: "12px",
                            marginTop: "0px",
                            padding: "4px 8px",
                          }}
                          variant="secondary"
                          size="lg"
                          onClick={() => handleDischargeStatusUpdate(admission)}
                        >
                          <FaPenAlt />
                        </Button>
                        <Button
                          title={t("dischargeSummary")}
                          style={{
                            fontSize: "12px",
                            marginTop: "0px",
                            padding: "4px 8px",
                          }}
                          variant="secondary"
                          size="lg"
                          onClick={() => handleDischargeSummary(admission)}
                        >
                          <FaPlus />
                        </Button>
                      </>
                    )}
                    <Button
                      style={{
                        fontSize: "12px",
                        marginTop: "0px",
                        padding: "4px 8px",
                      }}
                      variant="secondary"
                      size="lg"
                      title={t("viewprescribedmedicine")}
                      onClick={() => handleFetchPrescriptionData(admission.id)}
                    >
                      <FaRegEye />
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>

        <Modal
          centered
          backdrop="static"
          style={{ fontSize: "12px", marginTop: "20px" }}
          show={dischargeModalShow}
          onHide={handleCloseDischargeModal}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "16px" }}>
              {t("dischargeStatusUpdate")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="dischargeDate">
                <Form.Label
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("dischargeDate")}:
                </Form.Label>
                <DatePicker
                  className="form-control"
                  selected={dischargeDate}
                  onChange={(date) => setDischargeDate(date)}
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                />
              </Form.Group>

              <Form.Group controlId="dischargeInstruction">
                <Form.Label
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("dischargeInstruction")}:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={dischargeInstruction}
                  placeholder={t("enterDischargeInstruction")}
                  onChange={(e) => setDischargeInstruction(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="followUpAppointment">
                <Form.Label
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("followUpAppointments")}:
                </Form.Label>
                <Form.Control
                  as="select"
                  value={followUpAppointment}
                  onChange={(e) => setFollowUpAppointment(e.target.value)}
                >
                  <option>{t("noFollowUpRequired")}</option>
                  <option>{t("primaryCarePhysician")}</option>
                  <option>{t("specialistFollowUp")}</option>
                  <option>{t("labTestFollowUp")}</option>
                  <option>{t("imagingFollowUp")}</option>
                  <option>{t("medicationReview")}</option>
                  <option>{t("woundCareFollowUp")}</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="patientSignature">
                <Form.Label
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("patientSignature")}:
                </Form.Label>
                <Form.Control
                  type="text"
                  value={patientSignature}
                  placeholder={t("enterPatientSignature")}
                  onChange={(e) => setPatientSignature(e.target.value)}
                />
              </Form.Group>
              <br></br>
              <Form.Group controlId="authorizedConsent">
                <Form.Check
                  style={{ fontSize: "15px" }}
                  type="checkbox"
                  label={t("authorizedSignaturesForConsent")}
                  checked={authorizedConsent}
                  onChange={(e) => setAuthorizedConsent(e.target.checked)}
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
              onClick={handleDischargeSubmit}
            >
              {t("save")}
            </Button>
            <Button
              style={{
                fontSize: "12px",
              }}
              variant="secondary"
              onClick={handleCloseDischargeModal}
            >
              {t("close")}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          centered
          size="lg"
          style={{ fontSize: "12px", marginTop: "20px" }}
          show={dischargeSummaryModalShow}
          onHide={handleCloseDischargeSummaryModal}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "16px" }}>
              {t("dischargeSummary")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row">
                <div className="col-6">
                  <Form.Group controlId="billingInformation">
                    <Form.Label
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("billingInformation")}:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={billingInformation}
                      placeholder={t("enterBillingInformation")}
                      onChange={(e) => setBillingInformation(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group controlId="insuranceClaimDetails">
                    <Form.Label
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("insuranceClaimDetails")}:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={insuranceClaimDetails}
                      placeholder={t("enterInsuranceClaimDetails")}
                      onChange={(e) => setInsuranceClaimDetails(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <Form.Group controlId="paymentStatusDropdown">
                  <Form.Label
                    style={{
                      marginTop: "10px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("paymentStatus")}:
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={paymentStatusDropdown}
                    onChange={(e) => setPaymentStatusDropdown(e.target.value)}
                  >
                    {paymentStatusOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="row">
                <div className="col-6">
                  <Form.Group controlId="summaryOfTreatment">
                    <Form.Label
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("summaryOfTreatment")}:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={summaryOfTreatment}
                      placeholder={t("enterSummaryOfTreatment")}
                      onChange={(e) => setSummaryOfTreatment(e.target.value)}
                    />
                  </Form.Group>
                </div>

                <div className="col-6">
                  <Form.Group controlId="postDischargeCare">
                    <Form.Label
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("postDischargeCareRecommendations")}:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={postDischargeCare}
                      placeholder={t("enterPostDischargeCareRecommendations")}
                      onChange={(e) => setPostDischargeCare(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>
              <br></br>
              <div className="row">
                <div className="col-6">
                  <Form.Group controlId="transferInformation">
                    <Form.Check
                      style={{ fontSize: "15px" }}
                      type="checkbox"
                      label={t("transferInformation")}
                      checked={transferInformation}
                      onChange={(e) => setTransferInformation(e.target.checked)}
                    />
                  </Form.Group>
                </div>
              </div>

              {transferInformation && (
                <div className="row">
                  <div className="col-6">
                    <Form.Group controlId="transferFacility">
                      <Form.Label
                        style={{
                          marginTop: "10px",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t("transferToAnotherFacility")}:
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={transferFacility}
                        placeholder={t(
                          "enterTransferToAnotherFacilityInformation"
                        )}
                        onChange={(e) => setTransferFacility(e.target.value)}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-6">
                    <Form.Group controlId="transferDateTime">
                      <Form.Label
                        style={{
                          marginTop: "10px",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t("transferDateAndTime")}:
                      </Form.Label>
                      <DatePicker
                        className="form-control"
                        selected={transferDateTime}
                        onChange={(date) => setTransferDateTime(date)}
                        dateFormat="yyyy-MM-dd HH:mm"
                        showTimeInput
                      />
                    </Form.Group>
                  </div>
                </div>
              )}
            </Form>
            ;
          </Modal.Body>
          <Modal.Footer>
            <Button
              style={{
                fontSize: "12px",
              }}
              variant="secondary"
              onClick={handleDischargeSummarySubmit}
            >
              {t("save")}
            </Button>
            <Button
              style={{
                fontSize: "12px",
              }}
              variant="secondary"
              onClick={handleCloseDischargeSummaryModal}
            >
              {t("close")}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          size="lg"
          centered
          style={{ marginTop: "20px" }}
          backdrop="static"
          show={prescriptionModalShow}
          onHide={handleClosePrescriptionModal}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "16px" }}>
              {t("prescribedMedicineDetails")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {prescriptionData && (
              <>
                <p>
                  <strong>{t("patientName")}:</strong>{" "}
                  {prescriptionData.PatientName}
                </p>
                <p>
                  <strong>{t("medicalHistory")}:</strong>{" "}
                  {prescriptionData.medicalHistory}
                </p>
                <p>
                  <strong>{t("clinicalDiagnosis")}:</strong>{" "}
                  {prescriptionData.clinicalDiagnosis}
                </p>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>
                        {t("prescribedMedicineDetailsTable.Name")}
                      </th>
                      <th style={{ textAlign: "center" }}>
                        {t("prescribedMedicineDetailsTable.dosageAmount")}
                      </th>
                      <th style={{ textAlign: "center" }}>
                        {t("prescribedMedicineDetailsTable.clinicalAdvice")}
                      </th>
                      <th style={{ textAlign: "center" }}>
                        {t("prescribedMedicineDetailsTable.startDate")}
                      </th>
                      <th style={{ textAlign: "center" }}>
                        {t("prescribedMedicineDetailsTable.duration")}
                      </th>
                      <th style={{ textAlign: "center" }}>
                        {t("prescribedMedicineDetailsTable.quantity")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptionData.medicines.map((medicine) => (
                      <tr key={medicine.id}>
                        <td>{medicine.medicineName}</td>
                        <td>{medicine.dosageAmount}</td>
                        <td>{medicine.food}</td>
                        <td>{medicine.startDate}</td>
                        <td>{medicine.weekly}</td>
                        <td>{medicine.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePrescriptionModal}>
              {t("close")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default DischargePatient;
