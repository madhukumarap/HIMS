import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Container, Col, Table, Modal, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import Datepickrange from "./DateRangeCalender";
import { useParams, useNavigate } from "react-router-dom";
import { MdAssignmentAdd } from "react-icons/md";
import Translation from "../translations/CorporatePersonalVisits.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

const CorporatePersonalVisits = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

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
    const intervalId = setInterval(initializei18n, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

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
  const [showCorporatePatients, setShowCorporatePatients] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState("");
  const handleAssignPackageClick = (patientId) => {
    setSelectedPatientId(patientId);
    setShowModal(true);
  };
  const handleAssignPackage = () => {
    if (!selectedPackage) {
      toast.error("Please Select Package");
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
        toast.success("Package assigned successfully.", {
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
          toast.error("Failed to assign package.", {
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
  const [totalPages, setTotalPages] = useState("");
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
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  useEffect(() => {
    fetchCompaniesData();
  }, []);

  const fetchCompaniesData = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllCompanies`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setCompanies(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
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
            toast.success("Patient deleted successfully.", {
              style: { fontSize: "13px" },
            });
            // Refresh the patient list or update state accordingly
            // ...
          })
          .catch((error) => {
            // Handle error response
            console.error("Failed to delete patient:", error);
            toast.error("Failed to delete patient.", {
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
    const currentUser = AuthService.getCurrentUser();

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
        // "Aadhar ID",
        // "Health National ID",
        "Registration Date",
        "Corporate ID",
        " Package Name",
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
          patient.PackageName || "",
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

  // Modify filterPatients function
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

      const matchesSearch =
        patient.phoneNumberP.toString().includes(searchValueLower) ||
        fullNameLower.includes(searchValueLower);

      const matchesDate =
        registrationDate >= startTimestamp && registrationDate <= endTimestamp;

      const matchesCompany =
        selectedCompany === "" || patient.CompanyName === selectedCompany;

      const matchesCorporateID = showCorporatePatients
        ? patient.CorporateID
        : !patient.CorporateID;

      return (
        matchesSearch && matchesDate && matchesCompany && matchesCorporateID
      );
    });
  };

  const paginatedPatients = filterPatients().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ...
  useEffect(() => {
    // Calculate total pages based on filtered patients
    const totalFilteredPatients = filterPatients().length;
    const updatedTotalPages = Math.ceil(totalFilteredPatients / itemsPerPage);
    setTotalPages(updatedTotalPages);
  }, [showCorporatePatients, itemsPerPage, searchValue, startDate, endDate]);

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

        "Aadhar ID",
        "Health National ID",
        "City",
        "State",
        "Pincode",
        "Address",
        "Company Name",
        "Corporate ID",
        " Package Name",
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

        patient.PatientAadharID || "",
        patient.HealthNationalID || "", // Assuming `HealthNationalID` is the Health National ID field
        patient.city || "", // Assuming `city` is the city field
        patient.state || "", // Assuming `state` is the state field
        patient.pincode || "", // Assuming `pincode` is the pincode field
        patient.address || "", // Assuming `address` is the address field
        patient.CompanyName || "",

        patient.CorporateID || "",
        patient.PackageName || "",
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
      toast.error(t("EnterValidPhoneNumber"), {
        style: { fontSize: "13px" },
      });
      return;
    }
    if (
      patientToUpdate?.email &&
      !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(patientToUpdate.email)
    ) {
      toast.error(t("PleaseEnterValidEmail"), {
        style: { fontSize: "13px" },
      });
      return;
    }
    if (!patientToUpdate.address) {
      toast.error("Enter Address", {
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
      toast.error("Enter valid PatientAadharID 12-digit", {
        style: { fontSize: "12px" },
      });
      return;
    }
    if (
      patientToUpdate?.HealthNationalID &&
      patientToUpdate?.HealthNationalID.length !== 16
    ) {
      toast.error("Enter valid HealthNationalID 16-digit", {
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
        toast.success(t("PatientDetailsUpdatedSuccessfully"), {
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
      !currentUser.roles.includes("ROLE_DOCTOR") &&
      !currentUser.roles.includes("ROLE_RECEPTIONIST"))
  ) {
    // If the user is not logged in or does not have the admin role,
    // you can show a message or redirect to another page.
    return "Access Denied";
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

  return (
    <Container style={style} className="mt-0 text-center">
      <br></br>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("corporate/personalPatientData")}</h2>
      </header>
      <br />

      <Form.Group className="col-12" controlId="searchBar">
        <div className="row">
          <div className="col-md-3 col-sm-12 mb-2">
            <label style={{ marginBottom: "8px", fontWeight: "bold" }}>
              {t("searchbynameorPhone")}
            </label>
            <Form.Control
              style={{ fontSize: "12px", marginRight: "5px" }}
              type="text"
              placeholder={
                t("searchbynameorPhone") ||
                "Search by Patient name or contact number"
              }
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>

          <div className="col-md-3 col-sm-6 mb-2">
            <Datepickrange
              onSetDate={handleSetDate}
              onClearDate={handleClearDate}
            />
          </div>

          <div className="col-md-3 col-sm-6 mb-2">
            <Form.Group controlId="companySelect">
              <Form.Label style={{ fontSize: "12px", fontWeight: "bold" }}>
                {t("selectCompany")}
              </Form.Label>
              <Form.Control
                style={{ fontSize: "12px" }}
                as="select"
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  if (!selectedCompany) {
                    setShowCorporatePatients(true);
                  } else {
                    setShowCorporatePatients(false);
                  }
                }}
              >
                <option value="">{t("selectaCompany")}</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.companyName}>
                    {company.companyName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>

          <div className="col-md-3 col-sm-12 mb-2">
            <div
              style={{
                marginTop: "25px",
                display: "flex",
                justifyContent: "flex-md-end",
                justifyContent: "flex-sm-start",
              }}
            >
              {/* <Button
                title={
                  t("viewcorporatepatientpackageDetails") ||
                  "View Corporate PatientPackage Details"
                }
                style={{ fontSize: "12px", padding: "4px 5px" }}
                variant="secondary"
                onClick={() => {
                  navigate("/CorporatePackageAssignedPatientList");
                }}
              >
                <FaRegEye />
              </Button>{" "} */}
              <Button
                variant="secondary"
                style={{ fontSize: "12px", marginRight: "10px" }}
                size="lg"
                onClick={downloadDataAsCSV}
              >
                {t("downloadasCSV")}
              </Button>
              {/* <Button
                variant="secondary"
                style={{ fontSize: "12px", padding: "4px 5px" }}
                className="btn btn-secondary"
                onClick={fetchDataAndDownloadPDF}
              >
                {t("downloadPDF")}
              </Button> */}
            </div>
          </div>
        </div>
      </Form.Group>

      <br />

      {isMobile ? (
        <div style={{ textAlign: "left" }}>
          {sortedPatients.map((patient) => (
            <Card key={patient.id} style={{ margin: "10px" }}>
              <Card.Body>
                <Card.Title>{`${patient.mr} ${patient.firstName} ${patient.middleName} ${patient.lastName}`}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{`${
                  patient.countryCode || ""
                }${patient.phoneNumberP}`}</Card.Subtitle>
                <Card.Text>Gender: {patient.gender}</Card.Text>
                <Card.Text>Age: {`${patient.age} Year`}</Card.Text>
                <Card.Text>Email: {patient.email || "NA"}</Card.Text>
                <Card.Text>Address: {patient.address || "NA"}</Card.Text>
                <Card.Text>
                  Aadhar ID:{" "}
                  {patient.PatientAadharID
                    ? `XXXX-XXXX-${patient.PatientAadharID.slice(-4)}`
                    : "NA"}
                </Card.Text>
                <Card.Text>
                  Company Name: {patient.CompanyName || "NA"}
                </Card.Text>
                <Card.Text>
                  Registration Date:{" "}
                  {formatDateInSelectedLanguage(new Date(patient.createdAt))}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Table
          style={{ verticalAlign: "middle", textAlign: "center" }}
          responsive
          bordered
          hover
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>
                {t("corporatePersonalVisitsTable.id")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("corporatePersonalVisitsTable.patientName")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("corporatePersonalVisitsTable.contactNumber")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("corporatePersonalVisitsTable.email")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("corporatePersonalVisitsTable.gender")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("corporatePersonalVisitsTable.age")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("corporatePersonalVisitsTable.address")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>
                {t("corporatePersonalVisitsTable.aadharID")}
              </th> */}
              <th style={{ whiteSpace: "nowrap" }}>
                {t("corporatePersonalVisitsTable.companyName")}
              </th>
              {/* Uncomment below if needed */}
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("corporatePersonalVisitsTable.corporateID")}</th> */}
              <th style={{ whiteSpace: "nowrap" }}>
                {t("corporatePersonalVisitsTable.registrationDate")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("corporatePersonalVisitsTable.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPatients.map((patient) => (
              <tr key={patient.id}>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {patient.id}
                </td>
                <td
                  style={{ whiteSpace: "nowrap", textAlign: "center" }}
                >{`${patient.mr} ${patient.firstName} ${patient.middleName} ${patient.lastName}`}</td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editMode[patient.id] ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ marginRight: "5px" }}></span>
                      <Form.Control
                        style={{ fontSize: "12px" }}
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
                </td>

                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editMode[patient.id] ? (
                    <div>
                      <Form.Control
                        style={{ fontSize: "12px" }}
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
                          {t("PleaseEnterValidEmail")}
                        </span>
                      )}
                    </div>
                  ) : (
                    patient.email || "NA"
                  )}
                </td>

                <td
                  style={{
                    width: "7%",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {editMode[patient.id] ? (
                    <Form.Control
                      style={{ fontSize: "12px" }}
                      as="select"
                      value={patient.gender}
                      onChange={(event) =>
                        handleEditChange(event, patient.id, "gender")
                      }
                    >
                      <option value="">Select Gender</option>
                      <option value="male">male</option>
                      <option value="female">female</option>
                    </Form.Control>
                  ) : (
                    patient.gender
                  )}
                </td>
                {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
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
              </td> */}

                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
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
                    `${patient.age} Year`
                  )}
                </td>
                <td
                  style={{
                    width: "10%",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {editMode[patient.id] ? (
                    <Form.Control
                      style={{ fontSize: "12px" }}
                      type="text"
                      value={patient.address}
                      onChange={(event) =>
                        handleAddressChange(event, patient.id)
                      }
                    />
                  ) : (
                    patient.address || "NA"
                  )}
                </td>
                {/* <td
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
                      value={patient.PatientAadharID}
                      onChange={(event) =>
                        handleEditChange(event, patient.id, "PatientAadharID")
                      }
                    />
                  ) : patient.PatientAadharID ? (
                    `XXXX-XXXX-${patient.PatientAadharID.slice(-4)}`
                  ) : (
                    "NA"
                  )}
                </td> */}
                {/* <td
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
              </td> */}
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {patient.CompanyName || "NA"}
                </td>
                {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {patient.CorporateID || "NA"}
              </td> */}
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(new Date(patient.createdAt))}
                </td>

                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
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
                        {t("Save")}
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
                        {t("Cancel")}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        title={
                          t(
                            "corporatePersonalVisitsTable.editPatientDetails"
                          ) || "Edit Patient Details"
                        }
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

                      {/* {true && (
                        <Button
                          title={
                            t(
                              "corporatePersonalVisitsTable.assignpackagetocorporatePatient"
                            ) || "Assign Package to Corporate Patient"
                          }
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
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <br></br>
      <div className="text-center">
        <Button
          variant="secondary"
          style={{ fontSize: "12px", marginTop: "0px" }}
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          {t("corporatePersonalVisitsTable.previous")}
        </Button>
        <span className="mx-2">
          {currentPage} of {totalPages}
        </span>
        <Button
          variant="secondary"
          style={{ fontSize: "12px", marginTop: "0px" }}
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          {t("corporatePersonalVisitsTable.next")}
        </Button>
      </div>
      <br></br>
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "12px" }}>
              Assign Package
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="packageSelect">
              <Form.Label style={{ fontSize: "12px" }}>
                Select Package:
              </Form.Label>
              <Form.Control
                style={{ fontSize: "12px" }}
                as="select"
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
              >
                <option value="">Select a Package</option>
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
              Close
            </Button>
            <Button
              style={{ fontSize: "12px" }}
              variant="secondary"
              onClick={() => handleAssignPackage(selectedPackage)}
            >
              Assign
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default CorporatePersonalVisits;
