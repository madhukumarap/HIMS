import {
  FaPencilAlt,
  FaPlus,
  FaTrashAlt,
  FaRegEye,
  FaUpload,
} from "react-icons/fa";
import { OverlayTrigger, Popover } from "react-bootstrap";
import AuthService from "../services/auth.service";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Datepickrange from "./DateRangeCalender";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Translation from "../translations/PharmacistData.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

import "jspdf-autotable";
import { CSVLink } from "react-csv";

const DoctorList = () => {
  const { t } = useTranslation();
  const locales = { enIN, fr };
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
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
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleUploadSignature = (doctor) => {
    // alert(doctor.id);
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
    setShowModal(false);
  };
  const [viewSignature, setViewSignature] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const handleViewSignature = (signature) => {
    setViewSignature(signature);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };
  const handleSaveSignature = async () => {
    try {
      if (!selectedFile) {
        toast.error(t("Pleaseselectasignatureimage"));
        return;
      }

      const formData = new FormData();
      formData.append("signatureImage", selectedFile);
      formData.append("doctorId", selectedDoctor.id);

      // alert(selectedDoctor.id);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/uploadSignature/${selectedDoctor.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      handleCloseModal();
      toast.success(t("Signatureuploadedsuccessfully"));
    } catch (error) {
      console.error(error);
      toast.error(t("Erroruploadingsignature"));
    }
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };
  const fetchDataAndDownloadPDF = async () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Define the table headers
      const headers = [
        "Sr No.",
        "Username",
        "Name",
        "Registration No",
        "Phone No",
        "Email",
        "Address",
      ];

      const rows = [];

      filteredDoctors.forEach((user, index) => {
        const fullName = `${user.Dr || ""} ${user.FirstName || ""} ${
          user.MiddleName || ""
        } ${user.LastName || ""}`;

        rows.push([
          index + 1,
          user.username || "",
          fullName.trim(),

          user.registrationNo || "",
          `${user.phoneNo || ""}`,
          user.email || "",
          user.address || "",
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
      const title = "Doctor List";
      const titleX = doc.internal.pageSize.getWidth() / 2;
      doc.setFontSize(16);
      doc.text(title, titleX, 10, { align: "center" });

      doc.autoTable(headers, rows, tableOptions);

      // Save the PDF document
      doc.save("DoctorList.pdf");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      // const url = `${import.meta.env.VITE_API_URL}/api/getDoctorData`
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const REMOTE_URL = `${API_BASE_URL}/api/getDoctorData`;
      const response = await axios.get(REMOTE_URL, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      });
      setDoctors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleDeleteDoctor = async (id) => {
    const confirmed = window.confirm(t("areYousureWantToDeleteDoctor"));
    if (confirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/deleteDoctor/${id}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        fetchDoctors();
        toast.success(t("Doctordeletedsuccessfully"));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEditDoctor = (doctor) => {
    const updatedDoctors = doctors.map((d) => {
      if (d.id === doctor.id) {
        return { ...d, isEditing: true };
      } else {
        return d;
      }
    });
    setDoctors(updatedDoctors);
  };

  const handleUpdateDoctor = async (id, updatedData) => {
    try {
      if (updatedData.phoneNo.length < 10) {
        toast.error(t("enterValidPhoneNumber"));
        return;
      }
      if (!/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(updatedData.email)) {
        toast.error(t("enterValidEmail"));
        return;
      }
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/updateDoctor/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const updatedDoctors = doctors.map((d) => {
        if (d.id === id) {
          return { ...d, ...updatedData, isEditing: false };
        } else {
          return d;
        }
      });
      setDoctors(updatedDoctors);
      toast.success(t("Doctorupdatedsuccessfully")); // Display success toast message
    } catch (error) {
      console.error(error);
    }
  };

  const downloadCSV = () => {
    if (filteredDoctors.length === 0) {
      toast.error(t("NodatatoexportasCSV"));
      return;
    }

    const csvHeaders = Object.keys(filteredDoctors[0]);
    const csvValues = filteredDoctors.map((row) =>
      csvHeaders.map((key) => row[key])
    );

    const csvContent = [csvHeaders, ...csvValues].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "DoctorList.csv");
  };
  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const filteredDoctors = doctors.filter((doctor) => {
    const doctorFullName =
      `${doctor.FirstName} ${doctor.MiddleName} ${doctor.LastName}`.toLowerCase();
    const searchFullName = searchName.toLowerCase();
    const doctorRegistrationDate = new Date(doctor.createdAt).getTime();
    const filterStartDate = startDate ? new Date(startDate).getTime() : null;
    const filterEndDate = endDate ? new Date(endDate).getTime() : null;

    // Check if searchName is a number
    const isNumeric = !isNaN(searchName);

    const isNameMatch =
      isNumeric && String(doctor.phoneNo).includes(searchName);

    const isDateInRange =
      (!filterStartDate || doctorRegistrationDate >= filterStartDate) &&
      (!filterEndDate || doctorRegistrationDate <= filterEndDate);

    return (
      (isNameMatch || doctorFullName.includes(searchFullName)) && isDateInRange
    );
  });

  const handleDoctorDataChange = (id, name, value) => {
    const updatedDoctors = doctors.map((doctor) => {
      if (doctor.id === id) {
        return { ...doctor, [name]: value };
      } else {
        return doctor;
      }
    });
    setDoctors(updatedDoctors);
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

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
  if (currentUser && !currentUser.roles.includes("ROLE_ADMIN")) {
    // Redirect or show error message when the user is not an admin
    return "Access Denied";
    // You can handle the redirection or error message display as per your requirement
  }

  const style = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    fontSize: "12px",
  };

  const h1Style = {
    fontSize: "24px",
  };

  const h2Style = {
    fontSize: "16px",
  };

  const h3Style = {
    fontSize: "16px",
  };

  return (
    <Container style={style} className="mt-0 text-center">
      <div style={{ display: "flex", justifyContent: "left" }}>
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/PatientListCounter`);
          }}
        >
          {t("patientData")}
        </Button>{" "}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/NurseData`);
          }}
        >
          {t("NurseData")}
        </Button>{" "}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/PharmacistData`);
          }}
        >
          {t("pharmacistData")}
        </Button>{" "}
        {/* <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate("/HospitalAdminData");
          }}
        >
          Hospital Administrator Data
        </Button> */}
      </div>
      <br></br>
      <header className="header">
        <h2 style={h2Style}>{t("doctorData")}</h2>
      </header>
      <br />
      <Form.Group className="col-12" controlId="searchBar">
        <div className="row">
          <div className="col-md-3 col-12">
            <label
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
              htmlFor="searchName"
            >
              {t("searchByNameOrPhone")}
            </label>
            <Form.Control
              type="text"
              id="searchName"
              style={{ fontSize: "12px" }}
              placeholder={t("searchByNameOrPhone")}
              value={searchName}
              onChange={handleSearchChange}
            />
          </div>
          {/* <div className="col-md-1 col-12"></div> */}
          <div className="col-md-3 col-12">
            <Datepickrange
              onSetDate={handleSetDate}
              onClearDate={handleClearDate}
            />
          </div>
          <div className="col-md-2 col-12"></div>
          <div className="col-md-4 col-12 d-flex align-items-center justify-content-end">
            <Button
              variant="secondary"
              style={{
                fontSize: "12px",
                marginTop: "10px",
                padding: "4px 5px",
                marginRight: "5px",
              }}
              onClick={downloadCSV}
            >
              {t("downloadAsCSV")}
            </Button>{" "}
            <Button
              variant="secondary"
              style={{
                fontSize: "12px",
                marginTop: "10px",
                padding: "4px 5px",
              }}
              onClick={fetchDataAndDownloadPDF}
            >
              {t("downloadPDF")}
            </Button>
          </div>
        </div>
      </Form.Group>

      <br />
      <div className="table-responsive">
        <Table
          className="table-striped table-hover table-bordered"
          style={{ verticalAlign: "middle", textAlign: "center" }}
          responsive
          bordered
          hover
        >
          <Thead>
            <tr>
              <Th style={{ textAlign: "center" }}>
                {t("pharmacistDataTable.id")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>
                {t("pharmacistDataTable.name")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>
                {t("pharmacistDataTable.address")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>
                {t("pharmacistDataTable.phoneNumber")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("pharmacistDataTable.email")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("pharmacistDataTable.userName")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>
                {t("pharmacistDataTable.registrationDate")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("pharmacistDataTable.actions")}
              </Th>
              <Th style={{ textAlign: "center" }}>{t("Signature")}</Th>
            </tr>
          </Thead>
          <Tbody>
            {filteredDoctors.map((doctor) => (
              <Tr key={doctor.id}>
                <Td style={{ textAlign: "center", textAlign: "center" }}>
                  {doctor.id}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {doctor.isEditing ? (
                    <div className="row">
                      <div className="col-12 mb-2">
                        <label
                          style={{ fontSize: "12px", marginBottom: "8px" }}
                        >
                          {t("firstName")}
                        </label>
                        <Form.Control
                          type="text"
                          style={{ fontSize: "12px" }}
                          name="FirstName"
                          value={doctor.FirstName}
                          onChange={(e) =>
                            handleDoctorDataChange(
                              doctor.id,
                              "FirstName",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-12 mb-2">
                        <label
                          style={{ fontSize: "12px", marginBottom: "8px" }}
                        >
                          {t("middleName")}
                        </label>
                        <Form.Control
                          type="text"
                          style={{ fontSize: "12px" }}
                          name="MiddleName"
                          value={doctor.MiddleName}
                          onChange={(e) =>
                            handleDoctorDataChange(
                              doctor.id,
                              "MiddleName",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-12 mb-2">
                        <label
                          style={{ fontSize: "12px", marginBottom: "8px" }}
                        >
                          {t("lastName")}
                        </label>
                        <Form.Control
                          type="text"
                          style={{ fontSize: "12px" }}
                          name="LastName"
                          value={doctor.LastName}
                          onChange={(e) =>
                            handleDoctorDataChange(
                              doctor.id,
                              "LastName",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    `Dr ${doctor.FirstName} ${doctor.MiddleName} ${doctor.LastName}`
                  )}
                </Td>

                <Td style={{ textAlign: "center" }}>
                  {doctor.isEditing ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      name="registrationNo"
                      value={doctor.registrationNo}
                      onChange={(e) =>
                        handleDoctorDataChange(
                          doctor.id,
                          "registrationNo",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    doctor.registrationNo
                  )}
                </Td>
                <Td style={{ textAlign: "center" }}>
                  {doctor.isEditing ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ marginRight: "5px" }}></span>
                      <Form.Control
                        type="text"
                        style={{ fontSize: "12px" }}
                        name="phoneNo"
                        value={doctor.phoneNo}
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*$/;
                          if (input === "" || regex.test(input)) {
                            handleDoctorDataChange(doctor.id, "phoneNo", input);
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
                    </div>
                  ) : (
                    `${doctor.phoneNo}`
                  )}
                  {doctor.isEditing &&
                    doctor.phoneNo &&
                    doctor.phoneNo.length < 10 && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {t("phoneNumberMustBeAtLeast10digits")}
                      </span>
                    )}
                </Td>
                <Td style={{ textAlign: "center" }}>
                  {doctor.isEditing ? (
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        value={doctor.email}
                        pattern="[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
                        onChange={(e) =>
                          handleDoctorDataChange(
                            doctor.id,
                            "email",
                            e.target.value
                          )
                        }
                      />
                      {!/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(
                        doctor.email
                      ) && (
                        <span style={{ color: "red" }}>
                          {t("enterAValidEmail")}
                        </span>
                      )}
                    </div>
                  ) : (
                    doctor.email
                  )}
                </Td>
                <Td style={{ textAlign: "center" }}>{doctor.username}</Td>
                <Td style={{ textAlign: "center" }}>
                  {formatDateInSelectedLanguage(new Date(doctor.createdAt))}
                </Td>
                <Td style={{ textAlign: "center" }}>
                  {doctor.isEditing ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: "12px", padding: "4px 5px" }}
                          onClick={() => handleUpdateDoctor(doctor.id, doctor)}
                        >
                          {t("save")}
                        </button>
                        <button
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#777777",
                            padding: "4px 5px",
                          }}
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            const updatedDoctors = doctors.map((d) => {
                              if (d.id === doctor.id) {
                                return { ...d, isEditing: false };
                              } else {
                                return d;
                              }
                            });
                            setDoctors(updatedDoctors);
                          }}
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="button-group"
                        style={{
                          fontSize: "12px",
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <button
                          title={t("EditData")}
                          className="btn btn-secondary mr-2"
                          style={{
                            fontSize: "12px",
                            marginTop: "0px",
                            padding: "4px 5px",
                          }}
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          title="Delete"
                          className="btn btn-secondary mr-2"
                          style={{
                            fontSize: "12px",
                            marginTop: "0px",
                            padding: "4px 5px",
                          }}
                          onClick={() => handleDeleteDoctor(doctor.id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </>
                  )}
                </Td>
                <Td style={{ textAlign: "center" }}>
                  <Button
                    variant="secondary"
                    title={t("UploadSign")}
                    onClick={() => handleUploadSignature(doctor)}
                    style={{ fontSize: "12px", padding: "4px 5px" }}
                  >
                    <FaUpload />
                  </Button>
                  <Button
                    title={t("ViewSignature")}
                    className="btn btn-secondary"
                    style={{
                      fontSize: "12px",
                      marginTop: "0px",
                      padding: "4px 5px",
                    }}
                    onClick={() => handleViewSignature(doctor?.signatureImage)}
                  >
                    <FaRegEye />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      {/* Modal for uploading signature */}
      <Modal
        centered
        style={{ fontSize: "14px" }}
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("UploadSign")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>{t("UploadFile")}</Form.Label>
            <Form.Control
              type="file"
              style={{ fontSize: "14px" }}
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "14px" }}
            variant="secondary"
            onClick={handleCloseModal}
          >
            {t("Close")}
          </Button>
          <Button
            style={{ fontSize: "14px" }}
            variant="secondary"
            onClick={handleSaveSignature}
          >
            {t("SaveSignature")}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal for viewing signature */}
      <Modal centered show={showViewModal} onHide={handleCloseViewModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("ViewSignature")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewSignature && (
            <img
              src={`data:image/png;base64,${viewSignature}`}
              alt="Doctor Signature"
              style={{ width: "100%" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            {t("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DoctorList;
