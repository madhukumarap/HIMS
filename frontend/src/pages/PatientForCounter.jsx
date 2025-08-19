import {
  FaPencilAlt,
  FaPlus,
  FaTrashAlt,
  FaRegEye,
  FaEye,
} from "react-icons/fa";
import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Container, Col, Modal, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import Datepickrange from "./DateRangeCalender";
import { useParams, useNavigate } from "react-router-dom";
import { MdAssignmentAdd } from "react-icons/md";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import HealthCardBackground from "../Health_CardBackground.jpg";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

import Translation from "../translations/PatientListCounter.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

const PatientsLists = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
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
  const [packages, setPackages] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [ShowPatientModal, setShowPatientModal] = useState(false);
  const [ShowPatientStickerModal, setShowPatientStickerModal] = useState(false);

  ///

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

    // Initialize only once when component mounts
    initializei18n();

    // Remove the setInterval completely
    // No need to keep re-initializing i18n
  }, []); // Empty dependency array ensures this runs only once

  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  ///

  const handleViewDetails = (selectedPatient) => {
    setSelectedPatient(selectedPatient);
    setShowPatientModal(true);
  };
  const handleViewDetailsStiker = (selectedPatient) => {
    setSelectedPatient(selectedPatient);
    setShowPatientStickerModal(true);
  };
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateCurrentDate = () => {
      const now = new Date();
      const formattedDate = `${now.getDate()}/${
        now.getMonth() + 1
      }/${now.getFullYear()}`;
      setCurrentDate(formattedDate);
    };

    updateCurrentDate();

    const intervalId = setInterval(updateCurrentDate, 1000);

    return () => clearInterval(intervalId);
  }, []);
  const [selectedPackage, setSelectedPackage] = useState("");
  const handleAssignPackageClick = (patientId) => {
    setSelectedPatientId(patientId);
    setShowModal(true);
  };
  const handlePrintCard = () => {
    const card = document.getElementById("healthCard"); // Add an ID to the Card element

    html2canvas(card).then((canvas) => {
      const imgData = canvas.toDataURL("image/png"); // Convert canvas to image data URL
      const link = document.createElement("a");
      link.download = "health_card.png";
      link.href = imgData;
      link.click();
    });
  };
  const handlePrintSticker = () => {
    const card = document.getElementById("sticker"); // Add an ID to the Card element

    html2canvas(card).then((canvas) => {
      const imgData = canvas.toDataURL("image/png"); // Convert canvas to image data URL
      const link = document.createElement("a");
      link.download = "Patient_sticker.png";
      link.href = imgData;
      link.click();
    });
  };
  const handleAssignPackage = () => {
    if (!selectedPackage) {
      toast.error(t("pleaseSelectPackage"));
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/assignPackageTocorporatePatient`,
        {
          patientId: selectedPatientId,
          packageId: selectedPackage,
        },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        console.log("Package assigned successfully:", response.data);
        toast.success(t("packageAssignedSuccessfully"), {
          style: { fontSize: "13px" },
        });
        setShowModal(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage, {
            style: { fontSize: "13px" },
          });
        } else {
          console.error("Failed to assign package:", error);
          toast.error(t("failedToAssignPackage"), {
            style: { fontSize: "13px" },
          });
        }
      });
  };

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/GetAllHealthPackagesWithTests`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const [patients, setPatients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editMode, setEditMode] = useState({});
  const [editAddressMode, setEditAddressMode] = useState({});
  const [aadharId, setAadharId] = useState(""); // Add this line
  const [helthId, setHelthId] = useState(""); // Add this line
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDeleteClick = (patientId) => {
    // Display a confirmation dialog
    setConfirmDeleteId(patientId);
  };
  const handleConfirmDelete = (confirmDeleteId) => {
    if (true) {
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this patient?"
      );

      if (userConfirmed) {
        // alert(confirmDeleteId);
        // return;
        axios
          .delete(
            `${
              import.meta.env.VITE_API_URL
            }/api/deletePatientBy/${confirmDeleteId}`,
            {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            }
          )
          .then((response) => {
            // Handle success response
            console.log("Patient deleted successfully:", response.data);
            toast.success(t("patientDeletedSuccessfully"), {
              style: { fontSize: "13px" },
            });
            // Refresh the patient list or update state accordingly
            // ...
          })
          .catch((error) => {
            // Handle error response
            console.error("Failed to delete patient:", error);
            toast.error(t("failedToDeletePatient"), {
              style: { fontSize: "13px" },
            });
            fetchPatientsData();
          })
          .finally(() => {
            // Reset the confirmDeleteId after successful deletion
            setConfirmDeleteId(null);
          });
      }
    }
  };
  const fetchPatientsData = () => {
    if (currentUser && currentUser.Token) {
      const token = currentUser.Token;

      axios
        .get(`${import.meta.env.VITE_API_URL}/api/getallPaitents`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          const data = response.data;
          setPatients(data);
          setAadharId(data.PatientAadharID);
          setHelthId(data.HealthNationalID);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const fetchDataAndDownloadPDF = async () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Define the table headers
      const headers = [
        "ID",
        "Patient Name",
        "Contact Number",

        "Gender",
        "Address",
        "Age",
        "Registration Date",
        // "Health National ID",
        // "Registration Date",
        "Corporate ID",
      ];

      // Define the table rows
      const rows = [];
      sortedPatients.forEach((patient) => {
        rows.push([
          patient.id,
          `${patient.mr} ${patient.firstName} ${patient.middleName} ${patient.lastName}`,
          `${patient.countryCode} ${patient.phoneNumberP}`,

          patient.gender,
          patient.address || "",
          `${patient.age} Year`,
          // patient.PatientAadharID || "", // Assuming `PatientAadharID` is the Aadhar ID field
          // patient.HealthNationalID || "",
          `${formatDateInSelectedLanguage(new Date(patient.createdAt))}`,
          patient.CorporateID || "",
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
      const title = "Patient List";
      const titleX = doc.internal.pageSize.getWidth() / 2;
      doc.setFontSize(16);
      doc.text(title, titleX, 10, { align: "center" });

      doc.autoTable(headers, rows, tableOptions);

      // Save the PDF document
      doc.save("PatientList.pdf");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleEditAddressMode = (patientId) => {
    setEditAddressMode((prevState) => ({
      ...prevState,
      [patientId]: !prevState[patientId],
    }));
  };
  const handleAddressChange = (event, patientId) => {
    const updatedAddressMode = { ...editAddressMode, [patientId]: true };
    setEditAddressMode(updatedAddressMode);

    const updatedPatients = patients.map((patient) => {
      if (patient.id === patientId) {
        return { ...patient, address: event.target.value };
      }
      return patient;
    });

    setPatients(updatedPatients);
  };

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser?.Token) {
      const token = currentUser?.Token;
      const hospitalId = currentUser?.hospitalId;
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/getallPaitents`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          setPatients(response.data);
          setAadharId(response.data.PatientAadharID);
          setHelthId(response.data.HealthNationalID);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const formatAadharID = (aadharID) => {
    if (aadharID) {
      return aadharID.replace(/(\d{4})(?=\d)/g, "$1-");
    }
    return "";
  };

  const handleEditChange = (event, patientId, field) => {
    const updatedPatients = patients.map((patient) => {
      if (patient.id === patientId) {
        return { ...patient, [field]: event.target.value };
      }
      return patient;
    });
    setPatients(updatedPatients);
  };

  const filterPatients = () => {
    return patients.filter((patient) => {
      const registrationDate = new Date(patient.createdAt).getTime();
      const startTimestamp = startDate ? new Date(startDate).getTime() : 0;
      const endTimestamp = endDate
        ? new Date(endDate).getTime()
        : Number.MAX_SAFE_INTEGER;

      const fullName = `${patient.mr} ${patient.firstName} ${patient.middleName} ${patient.lastName}`;
      const searchValueLower = searchValue.toLowerCase();
      const fullNameLower = fullName.toLowerCase();

      return (
        (patient.phoneNumberP.toString().includes(searchValueLower) ||
          fullNameLower.includes(searchValueLower)) &&
        registrationDate >= startTimestamp &&
        registrationDate <= endTimestamp
      );
    });
  };

  const paginatedPatients = filterPatients().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ...

  // const totalPages = Math.ceil(filterPatients().length / itemsPerPage);

  const totalPages = Math.ceil(patients.length / itemsPerPage);
  console.log("Total number of patients:", filterPatients().length);
  console.log("Items per page:", itemsPerPage);
  console.log("Total number of patients:", patients.length);

  //alert(totalPages);
  const goToNextPage = () => {
    //alert(totalPages);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const sortedPatients = paginatedPatients.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const downloadDataAsCSV = () => {
    const csvData = [
      [
        "ID",
        "Patient Name",
        "Contact Number",
        "Email",
        "Gender",
        "Weight",
        "Age",
        "Registration Date",
        "Aadhar ID",
        "Health National ID",
        "City",
        "State",
        "Pincode",
        "Address",

        "Corporate ID",
      ],
    ];
    sortedPatients.forEach((patient) => {
      csvData.push([
        patient.id,
        `${patient.mr} ${patient.firstName} ${patient.middleName} ${patient.lastName}`,
        ` ${patient.phoneNumberP}`,
        patient.email,
        patient.gender,
        `${patient.weight} Kg.`,
        `${patient.age} Year`,
        formatDateInSelectedLanguage(new Date(patient.createdAt)),
        patient.PatientAadharID || "", // Assuming `PatientAadharID` is the Aadhar ID field
        patient.HealthNationalID || "", // Assuming `HealthNationalID` is the Health National ID field
        patient.city || "", // Assuming `city` is the city field
        patient.state || "", // Assuming `state` is the state field
        patient.pincode || "", // Assuming `pincode` is the pincode field
        patient.address || "", // Assuming `address` is the address field
        patient.CorporateID || "", // Assuming `CorporateID` is the Corporate ID field
      ]);
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "patients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  const savePatientData = (patientId) => {
    const patientToUpdate = patients.find(
      (patient) => patient.id === patientId
    );
    if (patientToUpdate.phoneNumberP.length < 10) {
      toast.error(t("enterValidPhoneNumber"), {
        style: { fontSize: "13px" },
      });
      return;
    }
    if (
      patientToUpdate?.email &&
      !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(patientToUpdate.email)
    ) {
      toast.error(t("enterValidEmail"), {
        style: { fontSize: "13px" },
      });
      return;
    }
    if (!patientToUpdate.address) {
      toast.error(t("enterAddress"), {
        style: { fontSize: "12px" },
      });
      return;
    }
    // patientToUpdate.PatientAadharID = aadharId;
    // patientToUpdate.HealthNationalID = helthId;
    if (
      patientToUpdate?.PatientAadharID &&
      patientToUpdate.PatientAadharID.length !== 12
    ) {
      toast.error(t("enterValidPatientAadharIDdigit"), {
        style: { fontSize: "12px" },
      });
      return;
    }
    if (
      patientToUpdate?.HealthNationalID &&
      patientToUpdate?.HealthNationalID.length !== 16
    ) {
      toast.error(t("enterValidHealthNationalIDdigit"), {
        style: { fontSize: "12px" },
      });
      return;
    }
    // alert(patientToUpdate.address);
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/updatePatient/${patientId}`,
        patientToUpdate,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        // Handle success response
        console.log("Patient data updated successfully:", response.data);
        setEditMode((prevState) => ({ ...prevState, [patientId]: false }));
        toast.success(t("patientDetailsUpdatedSuccessfully"), {
          style: { fontSize: "13px" },
        });
      })
      .catch((error) => {
        // Handle error response
        console.error("Failed to update patient data:", error);
      });
  };

  if (
    !currentUser ||
    (!currentUser.roles.includes("ROLE_ADMIN") &&
      !currentUser.roles.includes("ROLE_DOCTOR"))
  ) {
    // If the user is not logged in or does not have the admin role,
    // you can show a message or redirect to another page.
    return <h2>{t("adminRoleIsRequired")}</h2>;
  }

  const style = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    fontSize: "12px",
  };

  const h1Style = {
    fontSize: "16px",
  };

  const h2Style = {
    fontSize: "14px",
  };

  const h3Style = {
    fontSize: "16px",
  };

  const handleWeightKeyDown = (event) => {
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];

    if (
      (event.target.value.length >= 3 && event.key !== "Backspace") ||
      (!/^\d{0,2}$/.test(event.key) && !allowedKeys.includes(event.key))
    ) {
      event.preventDefault();
    }
  };

  const handleAgeKeyDown = (event) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];
    const allowedDigitsRegex = /^\d+$/;

    if (
      (event.target.value.length >= 3 && event.key !== "Backspace") ||
      (!allowedKeys.includes(event.key) && !allowedDigitsRegex.test(event.key))
    ) {
      event.preventDefault();
    }
  };

  const handleCancelEdit = (patientId) => {
    setEditMode((prevState) => ({ ...prevState, [patientId]: false }));
  };
  const roleCurrentUser = currentUser.roles[0];

  return (
    <Container style={style} className="mt-0 text-center">
      {roleCurrentUser !== "ROLE_DOCTOR" && (
        <div style={{ display: "flex", justifyContent: "left" }}>
          <Button
            style={{ fontSize: "12px", padding: "4px 5px" }}
            variant="secondary"
            onClick={() => {
              navigate(`/${extractedPart}/DoctorData`);
            }}
          >
            {t("doctorData")}
          </Button>{" "}
          <Button
            style={{ fontSize: "12px", padding: "4px 5px" }}
            variant="secondary"
            onClick={() => {
              navigate(`/${extractedPart}/NurseData`);
            }}
          >
            {t("nurseData")}
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
            {t("hospitalAdministratorData")}
          </Button> */}
        </div>
      )}
      <br></br>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("patientData")}</h2>
      </header>
      <br />
      {/* <Form.Control
        as="select"
        value={itemsPerPage}
        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
      >
        <option value="5">5 per page</option>
        <option value="10">10 per page</option>
        <option value="15">15 per page</option>
      </Form.Control> */}
      <Form.Group className="col-12" controlId="searchBar">
        <div className="row">
          <div className="col-md-3 col-12">
            <label style={{ marginBottom: "8px", fontWeight: "bold" }}>
              {t("searchbyNameOrPhone")}
            </label>
            <Form.Control
              style={{ fontSize: "12px", marginRight: "5px" }}
              type="text"
              placeholder={t("searchByPatientNameOrContactNumber")}
              value={searchValue}
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
          <div className="col-md-4 col-12">
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="secondary"
                style={{
                  fontSize: "12px",
                  padding: "4px 5px",
                  marginRight: "10px",
                }}
                onClick={downloadDataAsCSV}
              >
                {t("downloadAsCSV")}
              </Button>
              <Button
                variant="secondary"
                style={{ fontSize: "12px", padding: "4px 5px" }}
                onClick={fetchDataAndDownloadPDF}
              >
                {t("downloadPDF")}
              </Button>
            </div>
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
            <Tr>
              <Th style={{ textAlign: "center" }}>
                {t("patientDataTable.id")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>
                {t("patientDataTable.patientName")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>
                {t("patientDataTable.contactNumber")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("patientDataTable.email")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("patientDataTable.gender")}
              </Th>

              <Th style={{ textAlign: "center" }}>
                {t("patientDataTable.age")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>
                {t("patientDataTable.address")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>
                {t("patientDataTable.aadharID")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>
                {t("patientDataTable.corporateID")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>
                {t("patientDataTable.registrationDate")}
              </Th>

              <Th style={{ textAlign: "center" }}>
                {t("patientDataTable.actions")}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedPatients.map((patient) => (
              <Tr key={patient.id}>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {patient.id}
                </Td>
                <Td
                  style={{ whiteSpace: "nowrap", textAlign: "center" }}
                >{`${patient.mr} ${patient.firstName} ${patient.middleName} ${patient.lastName}`}</Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editMode[patient.id] ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "150x",
                      }}
                    >
                      <span style={{ marginRight: "5px" }}></span>
                      <Form.Control
                        style={{ fontSize: "12px", width: "150px" }}
                        type="text"
                        value={patient.phoneNumberP}
                        maxLength={10}
                        onChange={(event) =>
                          handleEditChange(event, patient.id, "phoneNumberP")
                        }
                      />
                      {/* {patient.phoneNumberP.length < 10 && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        Enter a valid 10-digit number
                      </span>
                    )} */}
                    </div>
                  ) : (
                    `${patient.countryCode || ""}${patient.phoneNumberP}`
                  )}
                </Td>

                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editMode[patient.id] ? (
                    <div>
                      <Form.Control
                        style={{ fontSize: "12px", width: "150px" }}
                        type="email"
                        value={patient.email}
                        pattern="[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
                        onChange={(event) =>
                          handleEditChange(event, patient.id, "email")
                        }
                      />
                      {!/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(
                        patient.email
                      ) && (
                        <span style={{ color: "red" }}>
                          {t("enterValidEmail")}
                        </span>
                      )}
                    </div>
                  ) : (
                    patient.email || "NA"
                  )}
                </Td>

                <Td
                  style={{
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {editMode[patient.id] ? (
                    <Form.Control
                      style={{ fontSize: "12px", width: "100px" }}
                      as="select"
                      value={patient.gender}
                      onChange={(event) =>
                        handleEditChange(event, patient.id, "gender")
                      }
                    >
                      <option value="">{t("selectGender")}</option>
                      <option value="Male">{t("male")}</option>
                      <option value="Female">{t("female")}</option>
                    </Form.Control>
                  ) : (
                    patient.gender
                  )}
                </Td>
                {/* <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {editMode[patient.id] ? (
                  <Form.Control
                    style={{ fontSize: "12px" }}
                    type="text"
                    pattern="[0-9]{1,2}"
                    value={patient.weight}
                    onChange={(event) =>
                      handleEditChange(event, patient.id, "weight")
                    }
                    onKeyDown={(event) => handleWeightKeyDown(event)}
                  />
                ) : (
                  `${patient.weight} Kg.`
                )}
              </Td> */}

                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editMode[patient.id] ? (
                    <Form.Control
                      style={{ fontSize: "12px" }}
                      type="text"
                      pattern="[0-9]{1,3}"
                      value={patient.age}
                      onChange={(event) =>
                        handleEditChange(event, patient.id, "age")
                      }
                      onKeyDown={(event) => handleAgeKeyDown(event)}
                    />
                  ) : (
                    `${patient.age} ${
                      patient?.ageOption ? patient?.ageOption : ""
                    }`
                  )}
                </Td>
                <Td
                  style={{
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {editMode[patient.id] ? (
                    <Form.Control
                      style={{ fontSize: "12px", width: "150px" }}
                      type="text"
                      value={patient.address}
                      onChange={(event) =>
                        handleAddressChange(event, patient.id)
                      }
                    />
                  ) : (
                    patient.address || "NA"
                  )}
                </Td>
                <Td
                  style={{
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {editMode[patient.id] ? (
                    <Form.Control
                      style={{ fontSize: "12px" }}
                      type="text"
                      value={patient.PatientAadharID} // Assuming Aadhar ID is stored in `PatientAadharID`
                      onChange={(event) =>
                        handleEditChange(event, patient.id, "PatientAadharID")
                      }
                    />
                  ) : patient.PatientAadharID ? (
                    `XXXX-XXXX-${patient.PatientAadharID.slice(-4)}`
                  ) : (
                    "NA"
                  )}
                </Td>
                {/* <Td
                style={{
                  width: "15%",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {editMode[patient.id] ? (
                  <Form.Control
                    style={{ fontSize: "12px" }}
                    type="text"
                    value={patient.HealthNationalID} // Assuming Health National ID is stored in `HealthNationalID`
                    onChange={(event) =>
                      handleEditChange(event, patient.id, "HealthNationalID")
                    }
                  />
                ) : (
                  formatAadharID(patient.HealthNationalID) || "NULL" // Assuming Health National ID is stored in `HealthNationalID`
                )}
              </Td> */}
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {patient.CorporateID || "NA"}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(new Date(patient.createdAt))}
                </Td>

                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editMode[patient.id] ? (
                    <div>
                      <Button
                        style={{
                          fontSize: "12px",
                          marginTop: "5px",
                          padding: "4px 5px",
                        }}
                        variant="secondary"
                        size="lg"
                        onClick={() => savePatientData(patient.id)}
                      >
                        {t("save")}
                      </Button>
                      <Button
                        style={{
                          fontSize: "12px",
                          marginTop: "5px",
                          padding: "4px 5px",
                          marginLeft: "5px",
                        }}
                        variant="secondary"
                        size="lg"
                        onClick={() => handleCancelEdit(patient.id)}
                      >
                        {t("cancel")}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        title="Edit Patient Details"
                        className="btn btn-secondary mr-2"
                        style={{
                          fontSize: "12px",
                          marginTop: "0px",
                          padding: "4px 5px",
                        }}
                        size="lg"
                        onClick={() =>
                          setEditMode((prevState) => ({
                            ...prevState,
                            [patient.id]: true,
                          }))
                        }
                      >
                        <FaPencilAlt />
                      </Button>

                      <Button
                        title="View Health Card"
                        className="btn btn-secondary"
                        style={{
                          fontSize: "12px",
                          marginTop: "0px",
                          padding: "4px 5px",
                        }}
                        size="lg"
                        onClick={() => handleViewDetails(patient)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        title="Patient Sticker"
                        className="btn btn-secondary"
                        style={{
                          fontSize: "12px",
                          marginTop: "0px",
                          padding: "4px 5px",
                        }}
                        size="lg"
                        onClick={() => handleViewDetailsStiker(patient)}
                      >
                        <FaEye />
                      </Button>
                      {/* {true && (
                      <Button
                        title="Assign Package to Corporate Patient"
                        className="btn btn-secondary mr-2"
                        style={{
                          fontSize: "12px",
                          marginTop: "0px",
                          padding: "4px 5px",
                        }}
                        size="lg"
                        disabled={!patient.CorporateID ? true : false}
                        onClick={() => handleAssignPackageClick(patient.id)}
                      >
                        <MdAssignmentAdd />
                      </Button>
                    )} */}

                      {/* <Button
                      style={{
                        fontSize: "12px",
                        marginTop: "5px",
                        padding: "4px 5px",
                      }}
                      variant="danger"
                      size="lg"
                      onClick={() => handleConfirmDelete(patient.id)} // Handle delete click
                    >
                      Delete
                    </Button> */}
                    </>
                  )}
                  {/* </Td>
                <Td> */}{" "}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <br></br>
      <div className="text-center">
        <Button
          variant="secondary"
          style={{ fontSize: "12px", marginTop: "0px" }}
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          {t("previous")}
        </Button>
        <span className="mx-2">
          {currentPage} {t("of")} {totalPages}
        </span>
        <Button
          variant="secondary"
          style={{ fontSize: "12px", marginTop: "0px" }}
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          {" "}
          {t("next")}
        </Button>
      </div>
      <br></br>
      {showModal && (
        <Modal
          centered
          style={{ marginTop: "20px" }}
          show={showModal}
          onHide={() => setShowModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "12px" }}>
              {t("assignPackage")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="packageSelect">
              <Form.Label style={{ fontSize: "12px" }}>
                {t("selectPackage")}:
              </Form.Label>
              <Form.Control
                style={{ fontSize: "12px" }}
                as="select"
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
              >
                <option value="">{t("selectaPackage")}</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.packageName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              style={{ fontSize: "12px" }}
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              {t("close")}
            </Button>
            <Button
              style={{ fontSize: "12px" }}
              variant="secondary"
              onClick={() => handleAssignPackage(selectedPackage)}
            >
              {t("assign")}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {ShowPatientModal && (
        <Modal
          size="lg"
          centered
          style={{ marginTop: "20px" }}
          show={ShowPatientModal}
          onHide={() => setShowPatientModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "16px" }}>
              {t("patientHealthCard")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPatient && (
              <Card
                id="healthCard"
                style={{
                  width: "80%",

                  backgroundImage: `url(${HealthCardBackground})`,
                  backgroundSize: "cover",
                }}
              >
                <Card.Body>
                  <Card.Title
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {t("healthCard")}
                  </Card.Title>
                  <br></br>
                  <Card.Text>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {/* Left column for labels */}
                      <div style={{ flex: 1 }}>
                        <p style={{ color: "white" }}>{t("patientID")}</p>
                        <p style={{ color: "white" }}>{t("name")}</p>
                        <p style={{ color: "white" }}>{t("gender")}</p>
                        <p style={{ color: "white" }}>{t("age")}</p>
                        <p style={{ color: "white" }}>{t("emergencyNo")}</p>
                        <p style={{ color: "white" }}>{t("bloodGroup")}</p>
                        <p style={{ color: "white" }}>{t("issueDate")}</p>
                      </div>

                      <div style={{ flex: 1 }}>
                        <p style={{ color: "white" }}>:</p>
                        <p style={{ color: "white" }}>:</p>
                        <p style={{ color: "white" }}>:</p>
                        <p style={{ color: "white" }}>:</p>
                        <p style={{ color: "white" }}>:</p>
                        <p style={{ color: "white" }}>:</p>
                        <p style={{ color: "white" }}>:</p>
                      </div>
                      {/* Right column for values */}
                      <div style={{ flex: 1, marginLeft: "-110px" }}>
                        <p style={{ color: "black", fontWeight: "bold" }}>
                          {selectedPatient?.id}
                        </p>
                        <p style={{ color: "black", fontWeight: "bold" }}>
                          {selectedPatient?.mr} {selectedPatient?.firstName}{" "}
                          {selectedPatient?.lastName}
                        </p>
                        <p
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          {selectedPatient?.gender.toLowerCase()}
                        </p>

                        <p style={{ color: "black", fontWeight: "bold" }}>
                          {selectedPatient?.age}{" "}
                          {selectedPatient?.ageOption?.charAt(0)}
                        </p>
                        <p style={{ color: "black", fontWeight: "bold" }}>
                          {selectedPatient?.emergencyContact}
                        </p>
                        <p style={{ color: "black", fontWeight: "bold" }}>
                          {selectedPatient?.phoneNumberP}
                        </p>
                        <p style={{ color: "black", fontWeight: "bold" }}>
                          {selectedPatient?.bloodGroup}
                        </p>
                        <p style={{ color: "black", fontWeight: "bold" }}>
                          {formatDateInSelectedLanguage(
                            new Date(selectedPatient.createdAt)
                          )}
                        </p>
                      </div>
                      <div style={{ flex: 1 }}>
                        {" "}
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "300px",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              right: "10px",
                              border: "2px solid #000000",
                              padding: "5px",
                            }}
                          >
                            <QRCode
                              value={`Patient ID: ${selectedPatient.id}\nPatient Name: ${selectedPatient.mr} ${selectedPatient.firstName} ${selectedPatient.lastName}`}
                              size={100} // Adjust the size of the QR code
                              bgColor="#ffffff" // Background color of the QR code
                              fgColor="#000000" // Foreground color of the QR code
                              level="L" // Error correction level (L, M, Q, H)
                              style={{ border: "2px solid #000000" }} // Add a border to the QR code
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            )}
            <p style={{ color: "black", fontWeight: "bold" }}>
              {t("billStatus")}: {selectedPatient?.paymentStatus}
            </p>
            <p style={{ color: "black", fontWeight: "bold" }}>
              {t("billingDate")}:{" "}
              {formatDateInSelectedLanguage(
                new Date(selectedPatient?.paymentDate)
              )}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              style={{ fontSize: "12px" }}
              variant="secondary"
              onClick={handlePrintCard} // Call the function to print the card as an image
            >
              {t("printCard")}
            </Button>
            <Button
              style={{ fontSize: "12px" }}
              variant="secondary"
              onClick={() => setShowPatientModal(false)}
            >
              {t("close")}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {ShowPatientStickerModal && (
        <Modal
          centered
          style={{ marginTop: "20px" }}
          size="lg"
          show={ShowPatientStickerModal}
          onHide={() => setShowPatientStickerModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "16px" }}>
              {t("patientSticker")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ width: "8in", height: "2in" }}>
            <div id="sticker" className="wrapper">
              {selectedPatient != null && (
                <div
                  id="patientSticker"
                  style={{
                    width: "400px",
                    border: "1px dotted black",
                    fontSize: "12px",
                  }}
                >
                  <div>
                    <div className={`topsec-98765`}>
                      {/* Rest of your div structure */}
                      <div>
                        <div>
                          <div
                            style={{
                              display: "inline-block",
                              width: "15%",
                              verticalAlign: "top",
                            }}
                          >
                            {" "}
                            {t("name")}&nbsp;:
                          </div>
                          <div
                            style={{
                              display: "inline-block",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                            }}
                          >
                            <div style={{ display: "inline-block" }}>
                              {selectedPatient?.mr} {selectedPatient?.firstName}{" "}
                              {selectedPatient?.lastName} &nbsp;&nbsp;&nbsp;{" "}
                            </div>
                            <div
                              style={{
                                display: "inline-block",
                                fontStyle: "italic",
                              }}
                            >
                              {" "}
                              {selectedPatient.age}
                              {selectedPatient?.ageOption?.charAt(0)}{" "}
                            </div>
                          </div>
                          <span style={{ float: "right", paddingRight: "5px" }}>
                            {" "}
                            {t("contact")} : {selectedPatient.phoneNumberP}{" "}
                          </span>
                        </div>

                        {/* Other nested div structures */}
                      </div>

                      {/* Rest of your content */}
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "column",
                        }}
                      >
                        <div style={{ paddingTop: "4px" }}>
                          <span>
                            {" "}
                            {t("patientID")}&nbsp;: {selectedPatient.id}{" "}
                          </span>
                          <span
                            style={{ float: "right", paddingRight: "20px" }}
                          >
                            {" "}
                            {t("printedOn")}&nbsp;:{currentDate}{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              style={{ fontSize: "12px" }}
              variant="secondary"
              onClick={handlePrintSticker}
            >
              {t("print")}
            </Button>
            <Button
              style={{ fontSize: "12px" }}
              variant="secondary"
              onClick={() => setShowPatientStickerModal(false)}
            >
              {t("close")}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default PatientsLists;
