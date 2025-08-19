import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Col,
  Button,
  Modal,
  Form,
  FormControl,
  Card,
} from "react-bootstrap";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Datepickrange from "./DateRangeCalender";
import Translation from "../translations/ViewOTBookingList.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

const ViewOTBookingList = () => {
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  const [otData, setOTData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOT, setSelectedOT] = useState(null);
  const [showModal2, setShowModal2] = useState(false);
  localStorage.removeItem("reloadCounts");

  const { t } = useTranslation();

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
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // const reloadCount = localStorage.getItem("reloadCount1");
  // if (reloadCount !== "1") {
  //   window.location.reload();
  //   localStorage.setItem("reloadCount1", "1");
  // }
  // localStorage.setItem("reloadCount2", "0");

  const [isMobile, setIsMobile] = useState(false);
  // Function to check if the screen size is mobile
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 200);
  };

  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  useEffect(() => {
    fetchOTData();
  }, []);

  const [otData2, setOTData2] = useState([]);
  const [selectedOT2, setSelectedOT2] = useState("");

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

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

  const fetchDataAndDownloadPDF = async () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Define the table headers
      const headers = [
        "OT DateTime",
        "Up to OT Time",
        "Patient Name",
        "Contact Number",
        "Diagnosis",
        "Surgeon Name",
        "External",
        "Guardian Contact No",
        "OT Name",
      ];
      //   'Anesthetist Assistant', 'Anesthesia', 'Scrub Nurse', 'OT Assistant', 'Procedure',, 'Surgeon Email'  'Type of Surgery',
      // Define the table rows
      const rows = [];
      filteredData.forEach((patient) => {
        rows.push([
          patient.otDateTime,
          patient.UpToOtTime || "",
          `${patient.patientName} `,
          `${patient.patientContactNumber}`,

          patient.diagnosis || "",
          patient.surgeonName || "",
          patient.external || "",

          `${patient.guardianContactNo || ""}`,

          patient.OTName || "",
        ]);
      });

      // Set the table position and style
      const tableX = 10;
      const tableY = 20;
      const tableOptions = {
        startY: tableY,
        styles: { fontSize: 10 },
        headStyles: { lineWidth: 0.5 },
        bodyStyles: { lineWidth: 0.5 },
        footStyles: { lineWidth: 0.5 },
        margin: { top: 10 },
      };

      // Add the table to the PDF document
      const title = "Patient OT Data";
      const titleX = doc.internal.pageSize.getWidth() / 2;
      doc.setFontSize(16);
      doc.text(title, titleX, 10, { align: "center" });

      doc.autoTable(headers, rows, tableOptions);

      // Save the PDF document
      doc.save("PatientOTData.pdf");
    } catch (error) {
      console.error(error);
    }
  };

  const convertArrayOfObjectsToCSV = (data) => {
    const csvHeader = Object.keys(data[0]).join(",") + "\n";
    const csvRows = data.map((row) => Object.values(row).join(",") + "\n");
    return csvHeader + csvRows.join("");
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllOtSheduledPatient`,
        {
          responseType: "json",
        },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      const csvData = convertArrayOfObjectsToCSV(response.data);

      const downloadUrl = URL.createObjectURL(
        new Blob([csvData], { type: "text/csv" })
      );

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "ot_data.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(t("dataExportedSuccessfully"), {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error(t("dataExportFailed"));
      console.error("Error:", error);
    }
  };

  const handleOTChange = (event) => {
    // setFormData(formData.OTName)
    setSelectedOT2(event.target.value);
  };

  const fetchOTData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllOtSheduledPatient`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setOTData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      toast.error(t("dataFetchFailed"));
      console.error("Error:", error);
    }
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    filterData(value, startDate, endDate);
  };

  const handleStartDateChange = (event) => {
    const { value } = event.target;
    setStartDate(value);
    filterData(searchValue, value, endDate);
  };

  const handleEndDateChange = (event) => {
    const { value } = event.target;
    setEndDate(value);
    filterData(searchValue, startDate, value);
  };

  const filterData = (searchVal, startVal, endVal) => {
    const filtered = otData.filter(
      (ot) =>
        ot.patientName.toLowerCase().includes(searchVal.toLowerCase()) ||
        (ot.patientContactNumber &&
          ot.patientContactNumber.toString().includes(searchVal))
    );

    const filteredByDate = filtered.filter((ot) => {
      const createdAt = new Date(ot.createdAt).getTime();
      const startDateVal = startVal ? new Date(startVal).getTime() : null;
      const endDateVal = endVal ? new Date(endVal).getTime() : null;

      if (startDateVal && endDateVal) {
        return createdAt >= startDateVal && createdAt <= endDateVal;
      } else if (startDateVal) {
        return createdAt >= startDateVal;
      } else if (endDateVal) {
        return createdAt <= endDateVal;
      } else {
        return true;
      }
    });

    setFilteredData(filteredByDate);
  };

  const handleEditDetails = (ot) => {
    setSelectedOT(ot);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(t("confirmOTDataDelete"));
    if (confirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/deleteOTData/${id}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        fetchOTData();
        toast.success(t("successDataDelete"), {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        toast.error(t("errorDataDelete"));
        console.error("Error:", error);
      }
    }
  };

  const handleUpdate = async (updatedOT) => {
    try {
      const dateTimeFormat =
        /^([A-Za-z]{3}) ([A-Za-z]{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):(\d{2}) (GMT\+\d{4}) \(([A-Za-z\s]+)\)$/;

      const isMatchingFormat = dateTimeFormat.test(updatedOT.otDateTime);

      if (isMatchingFormat) {
        updatedOT.otDateTime = formatDate(updatedOT.otDateTime);
      }

      const isMatchingFormat2 = dateTimeFormat.test(updatedOT.UpToOtTime);

      if (isMatchingFormat2) {
        updatedOT.UpToOtTime = formatDate(updatedOT.UpToOtTime);
      }

      if (updatedOT.patientContactNumber.length < 10) {
        toast.error(t("errorValidPatientContact"));
        return;
      }

      if (updatedOT.guardianContactNo.length < 10) {
        toast.error(t("errorValidGuardianContact"));
        return;
      }

      if (
        !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(updatedOT.surgeonEmail)
      ) {
        toast.error(t("errorValidSurgeonEmail"));
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/UpdateOTData/${updatedOT.id}`,
        updatedOT,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      fetchOTData();
      setShowModal(false);
      toast.success(t("updateSuccessful"), {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error(t("failed"));
      console.error("Error:", error);
    }
  };

  const formatDate2 = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // const formatDate = (dateString) => {
  //   const formattedDate = moment(
  //     dateString,
  //     "ddd MMM DD YYYY HH:mm:ss [GMT] ZZ"
  //   ).format("MM/DD/YYYY, hh:mm A");
  //   return formattedDate;
  // };

  const handleViewDetails = (ot) => {
    setSelectedOT(ot);
    setShowModal2(true);
  };

  const style = {
    width: "98%",
    height: "100%",
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px",
    textAlign: "center" /* Adjust the font size for <h1> */,
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
    return "Access Denied";
  }

  return (
    <div style={style}>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("OTBookingData")} </h2>
      </header>
      <br />
      <Link to={`/${extractedPart}/CreateEditOTCalender`}>
        <Button
          variant="secondary"
          style={{ fontSize: "12px", padding: "4px 5px" }}
        >
          {t("updateOTBooking")}
        </Button>
      </Link>

      <Form className="mb-4">
        <br />
        <div className="row">
          <div className="col-md-3">
            <Form.Label style={{ fontSize: "12px", fontWeight: "bold" }}>
              {t("searchByNameOrContactNumber")}
            </Form.Label>

            <FormControl
              style={{ fontSize: "12px" }}
              type="text"
              placeholder={t("searchByNameOrContactNumber")}
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-md-1"> </div>
          <div className="col-md-2">
            <Datepickrange
              onSetDate={handleSetDate}
              onClearDate={handleClearDate}
            />
          </div>
          <div className="col-md-4"></div>
          <div className="col-md-2">
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="secondary"
                style={{
                  fontSize: "12px",
                  marginLeft: "10px",
                  marginTop: "25px",
                }}
                onClick={handleExportData}
              >
                {t("downloadAsCsv")}
              </Button>
              {/* <Button
                                variant="secondary"
                                style={{ fontSize: '10px', marginLeft: '10px', padding: '4px 5px' }}
                                className="btn btn-secondary"
                                onClick={fetchDataAndDownloadPDF}
                            >
                                Download PDF
                            </Button> */}
            </div>
          </div>
        </div>
      </Form>
      {isMobile ? (
        <div className="row">
          {filteredData.map((ot, index) => (
            <div className="col-md-4 mb-3" key={ot.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {t("patientName")}: {ot.patientName}
                  </h5>
                  <p className="card-text">
                    {t("otBookedTime")}: {ot.otDateTime}-{" "}
                    {new Date(ot.UpToOtTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="card-text">
                    {t("otName")}:{ot.OTName}
                  </p>
                  <p className="card-text">
                    {t("patientPhoneNumber")}: {ot.patientContactNumber}
                  </p>
                  <p className="card-text">
                    {t("surgeryType")}: {ot.typeOfSurgery}
                  </p>
                  <p className="card-text">
                    {t("procedure")}:
                    {ot.procedure && ot.procedure.length > 30 ? (
                      <a href="#" title={ot.procedure}>
                        {ot.procedure.substring(0, 30)}...
                      </a>
                    ) : (
                      <span>{ot.procedure}</span>
                    )}
                  </p>
                  <p className="card-text">
                    {t("surgeonName")}: {ot.surgeonName}
                  </p>
                  <p className="card-text">
                    {t("external")}: {ot.external}
                  </p>
                  <p className="card-text">
                    {t("registrationDate")}:{" "}
                    {formatDateInSelectedLanguage(new Date(ot.createdAt))}
                  </p>

                  <div className="d-flex justify-content-center">
                    <Button
                      style={{ padding: "4px 5px" }}
                      className="btn btn-secondary"
                      title={t("edit")}
                      onClick={() => handleEditDetails(ot)}
                      disabled={
                        !currentUser.roles.includes("ROLE_ADMIN") &&
                        !currentUser.roles.includes("ROLE_OTTECHNICIAN") &&
                        ot.surgeonEmail !== currentUser.email
                      }
                    >
                      <FaPencilAlt />
                    </Button>
                    <Button
                      style={{ padding: "4px 5px" }}
                      className="btn btn-secondary"
                      title={t("delete")}
                      onClick={() => handleDelete(ot.id)}
                      disabled={
                        !currentUser.roles.includes("ROLE_ADMIN") &&
                        ot.surgeonEmail !== currentUser.email
                      }
                    >
                      <FaTrashAlt />
                    </Button>
                    <Button
                      style={{ padding: "4px 5px", marginTop: "15px" }}
                      variant="secondary"
                      title={t("view")}
                      onClick={() => handleViewDetails(ot)}
                    >
                      <FaRegEye />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table
          style={{
            fontSize: "12px",
            verticalAlign: "middle",
            textAlign: "center",
          }}
          responsive
          bordered
          hover
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>{t("srno")}</th>
              <th style={{ whiteSpace: "nowrap" }}>{t("otName")}</th>
              <th style={{ whiteSpace: "nowrap" }}>{t("otBookedTime")}</th>
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("otEndTime")}</th> */}
              <th style={{ whiteSpace: "nowrap" }}>{t("patientName")}</th>
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("guardianName")}</th> */}
              <th style={{ whiteSpace: "nowrap" }}>
                {t("patientPhoneNumber")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("guardianPhoneNumber")}</th> */}

              <th style={{ whiteSpace: "nowrap" }}>{t("surgeryType")}</th>
              {/*               <th style={{ textAlign: "center" }}>{t("otAssistantName")}</th> */}
              <th style={{ textAlign: "center" }}>{t("procedure")}</th>
              <th style={{ whiteSpace: "nowrap" }}>{t("surgeonName")}</th>
              <th style={{ textAlign: "center" }}>{t("external")}</th>
              <th style={{ whiteSpace: "nowrap" }}>{t("registrationDate")}</th>
              <th style={{ textAlign: "center" }}>{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((ot, index) => (
              <tr key={ot.id}>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {index + 1}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {ot.OTName}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(new Date(ot.otDateTime))}-{" "}
                  {new Date(ot.otDateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {"-"}
                  {new Date(ot.UpToOtTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {ot.UpToOtTime}
              </td> */}
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {ot.patientName}
                </td>
                {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {ot.guardianName}
              </td> */}
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {ot.patientContactNumber}
                </td>
                {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {ot.guardianContactNo}
              </td> */}

                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {ot.typeOfSurgery}
                </td>
                {/* <td>{ot.otAssistantName}</td> */}
                <td
                  style={{ whiteSpace: "nowrap", textAlign: "center" }}
                  onMouseEnter={(event) => {
                    const target = event.target;
                    if (ot.procedure && ot.procedure.length > 15) {
                      target.setAttribute("title", ot.procedure);
                    } else {
                      target.removeAttribute("title");
                    }
                  }}
                >
                  {ot.procedure && ot.procedure.length > 30 ? (
                    <a href="#" title={ot.procedure}>
                      {ot.procedure.substring(0, 30)}...
                    </a>
                  ) : (
                    <span>{ot.procedure}</span>
                  )}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {ot.surgeonName}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {ot.external}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(new Date(ot.createdAt))}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  <div>
                    {/* <Button
                      className="btn btn-secondary mr-2"
                      title="Edit"
                      style={{
                        fontSize: "13px",
                        marginRight: "5px",
                        padding: "4px 5px",
                        marginTop: "0px",
                      }}
                      onClick={() => handleEditDetails(ot)}
                      disabled={
                        !currentUser.roles.includes("ROLE_ADMIN") &&
                        !currentUser.roles.includes("ROLE_OTTECHNICIAN") &&
                        ot.surgeonEmail !== currentUser.email
                      }
                    >
                      <FaPencilAlt />
                    </Button> */}
                    <Button
                      className="btn btn-secondary mr-2"
                      title={t("delete")}
                      style={{
                        marginTop: "0px",
                        fontSize: "13px",
                        marginLeft: "5px",
                        padding: "4px 5px",
                      }}
                      onClick={() => handleDelete(ot.id)}
                      disabled={
                        !currentUser.roles.includes("ROLE_ADMIN") &&
                        ot.surgeonEmail !== currentUser.email
                      }
                    >
                      <FaTrashAlt />
                    </Button>
                    <Button
                      variant="secondary"
                      title={t("view")}
                      style={{
                        fontSize: "13px",
                        backgroundColor: "#777777",
                        marginLeft: "10px",
                        padding: "4px 5px",
                      }}
                      onClick={() => handleViewDetails(ot)}
                    >
                      <FaRegEye />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal
        style={{ marginTop: "20px" }}
        centered
        style={style}
        show={showModal2}
        size="lg"
        onHide={() => setShowModal2(false)}
      >
        <br></br>{" "}
        <Modal.Header closeButton>
          <Modal.Title style={h1Style}>{t("otDetail")} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOT && (
            <div>
              <div className="row">
                <div className="col-md-6">
                  <h4 style={{ fontSize: "14px" }}>
                    <strong>{t("patientName")}:</strong>{" "}
                    {selectedOT.patientName}
                  </h4>
                </div>
                <div className="col-md-6">
                  <h4 style={{ fontSize: "14px" }}>
                    <strong>{t("patientPhoneNumber")}:</strong>{" "}
                    {selectedOT.patientContactNumber}
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <p>
                    <strong>{t("otStartTime")}:</strong>{" "}
                    {formatDateInSelectedLanguage(
                      new Date(selectedOT.otDateTime)
                    )}
                    -{" "}
                    {new Date(selectedOT.otDateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {"-"}
                    {new Date(selectedOT.UpToOtTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {/* <div className="col-md-6">
                  <p>
                    <strong>{t("otEndTime")}:</strong> {selectedOT.UpToOtTime}
                  </p>
                </div> */}
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>{t("surgeonName")}:</strong>{" "}
                    {selectedOT.surgeonName}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>{t("external")}:</strong> {selectedOT.external}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>{t("guardianName")}:</strong>{" "}
                    {selectedOT.guardianName}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>{t("guardianContactNumber")}:</strong>{" "}
                    {selectedOT.guardianContactNo}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>{t("surgeonEmail")}:</strong>{" "}
                    {selectedOT.surgeonEmail}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>{t("anesthesia")}:</strong> {selectedOT.anesthesia}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>{t("scrubNurseName")}:</strong>{" "}
                    {selectedOT.scrubNurseName}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>{t("remarks")}:</strong> {selectedOT.remarks}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>{t("otAssistantName")}:</strong>{" "}
                    {selectedOT.otAssistantName}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>{t("anesthetistDoctorName")}:</strong>{" "}
                    {selectedOT.anesthetistDoctorName}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>{t("diagnosis")}:</strong> {selectedOT.diagnosis}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>{t("typeOfSurgery")}:</strong>{" "}
                    {selectedOT.typeOfSurgery}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <p>
                    <strong>{t("procedure")}:</strong> {selectedOT.procedure}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>{t("bookingDate")}:</strong>{" "}
                    {formatDate2(selectedOT.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ fontSize: "12px" }}
            onClick={() => setShowModal2(false)}
          >
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        style={{ marginTop: "20px" }}
        centered
        style={style}
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <br></br>{" "}
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            {t("editOTDetails")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOT && (
            <Form>
              <Form.Group controlId="OTName">
                <Form.Label>
                  {t("otName")}
                  <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  required
                  style={{ fontSize: "12px" }}
                  value={selectedOT.OTName}
                  onChange={(e) =>
                    setSelectedOT({ ...selectedOT, OTName: e.target.value })
                  }
                  className="form-control col-4"
                >
                  <option value="">{t("selectOT")}</option>
                  {otData2.map((item) => (
                    <option key={item.id} value={item.OTName}>
                      {item.OTName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="patientName">
                <Form.Label>{t("patientName")}</Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "12px" }}
                  placeholder={t("enterPatientName")}
                  value={selectedOT.patientName}
                  onChange={(e) =>
                    setSelectedOT({
                      ...selectedOT,
                      patientName: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group controlId="guardianName">
                <Form.Label>{t("guardianName")}</Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "12px" }}
                  placeholder={t("enterGuardianName")}
                  value={selectedOT.guardianName}
                  onChange={(e) =>
                    setSelectedOT({
                      ...selectedOT,
                      guardianName: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group controlId="patientContactNumber">
                <Form.Label>{t("patientContactNumber")}</Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "12px" }}
                  placeholder={t("enterPatientContactNumber")}
                  value={selectedOT.patientContactNumber}
                  onChange={(e) =>
                    setSelectedOT({
                      ...selectedOT,
                      patientContactNumber: e.target.value,
                    })
                  }
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
                {selectedOT.patientContactNumber.length < 10 && (
                  <span style={{ color: "red" }}>
                    {t("validationErrorPhoneNumber")}
                  </span>
                )}
              </Form.Group>

              <Form.Group controlId="guardianContactNumber">
                <Form.Label>{t("guardianContactNumber")}</Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "12px" }}
                  placeholder={t("enterGuardianContactNumber")}
                  value={selectedOT.guardianContactNo}
                  onChange={(e) => {
                    const input = e.target.value;
                    const regex = /^[0-9]{0,10}$/;
                    if (regex.test(input)) {
                      setSelectedOT({
                        ...selectedOT,
                        guardianContactNo: input,
                      });
                    }
                  }}
                />
                {selectedOT.guardianContactNo.length < 10 && (
                  <span style={{ color: "red" }}>
                    {t("validationErrorPhoneNumber")}
                  </span>
                )}
              </Form.Group>

              <Form.Group controlId="diagnosis">
                <Form.Label>{t("diagnosis")}</Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "12px" }}
                  placeholder={t("enterDiagnosis")}
                  value={selectedOT.diagnosis}
                  onChange={(e) =>
                    setSelectedOT({ ...selectedOT, diagnosis: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group controlId="typeOfSurgery">
                <Form.Label>{t("typeOfSurgery")}</Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "12px" }}
                  placeholder={t("enterTypeOfSurgery")}
                  value={selectedOT.typeOfSurgery}
                  onChange={(e) =>
                    setSelectedOT({
                      ...selectedOT,
                      typeOfSurgery: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group controlId="surgeonName">
                <Form.Label>{t("surgeonName")}</Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "12px" }}
                  placeholder={t("enterSurgeonName")}
                  value={selectedOT.surgeonName}
                  onChange={(e) =>
                    setSelectedOT({
                      ...selectedOT,
                      surgeonName: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group controlId="surgeonEmail">
                <Form.Label>{t("surgeonEmail")}</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={t("enterSurgeonEmail")}
                  value={selectedOT.surgeonEmail}
                  style={{ fontSize: "12px" }}
                  onChange={(e) =>
                    setSelectedOT({
                      ...selectedOT,
                      surgeonEmail: e.target.value,
                    })
                  }
                  pattern="^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  required
                />
                {!/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(
                  selectedOT.surgeonEmail
                ) && (
                  <span style={{ color: "red" }}>
                    {t("validationErrorEmail")}
                  </span>
                )}
              </Form.Group>

              <Form.Group controlId="external">
                <Form.Label>{t("external")}</Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "12px" }}
                  placeholder={t("enterExternal")}
                  value={selectedOT.external}
                  onChange={(e) =>
                    setSelectedOT({ ...selectedOT, external: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button> */}
          <Button
            variant="secondary"
            style={{ fontSize: "13px", marginRight: "5px", padding: "4px 5px" }}
            onClick={() => handleUpdate(selectedOT)}
          >
            Save Changes
          </Button>
          <Button
            variant="secondary"
            style={{
              fontSize: "13px",
              backgroundColor: "#777777",
              marginLeft: "10px",
              padding: "4px 5px",
            }}
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewOTBookingList;
