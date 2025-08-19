import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Col, Form, Table, Card } from "react-bootstrap";
import Datepickrange from "./DateRangeCalender";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaCarAlt, FaCartPlus } from "react-icons/fa";
import Translation from "../translations/PatientPrescriptionListForPharmacist.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

const PrescriptionList = () => {
  const navigate = useNavigate();
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
  }, []);

  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [prescriptionsPerPage] = useState(10);
  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    filterPrescriptions(filterName, start, end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    // Fetch prescription data from backend
    fetchPrescriptions();
  }, []);

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
  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/listPrescription`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setPrescriptions(data);
      setFilteredPrescriptions(data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const handleFilterChange = (event) => {
    setFilterName(event.target.value);
    filterPrescriptions(event.target.value, startDate, endDate);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    filterPrescriptions(filterName, event.target.value, endDate);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    filterPrescriptions(filterName, startDate, event.target.value);
  };

  const filterPrescriptions = (name, start, end) => {
    let filtered = prescriptions;

    if (name) {
      filtered = filtered.filter((p) => {
        const nameMatch = p.PatientName.toLowerCase().includes(
          name.toLowerCase()
        );
        const phoneMatch =
          p.phoneNumberP && p.phoneNumberP.toString().includes(name);
        return nameMatch || phoneMatch;
      });
    }

    if (start) {
      filtered = filtered.filter((p) => new Date(p.createdAt) >= start);
    }

    if (end) {
      filtered = filtered.filter((p) => new Date(p.createdAt) <= end);
    }

    setFilteredPrescriptions(filtered);
  };

  const sortPrescriptions = () => {
    const sorted = [...filteredPrescriptions].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    setFilteredPrescriptions(sorted);
  };

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const style = {
    width: "98%",
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

  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });

  if (
    !currentUser ||
    (!currentUser.roles.includes("ROLE_PHARMACIST") &&
      !currentUser.roles.includes("ROLE_ADMIN"))
  ) {
    return "Access Denied";
  }

  const convertArrayOfObjectsToCSV = (data) => {
    const csvHeader = Object.keys(data[0]).join(",") + "\n";
    const csvRows = data.map((row) => Object.values(row).join(",") + "\n");
    return csvHeader + csvRows.join("");
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  const handleExportData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/listPrescription`,
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
      link.setAttribute("download", "PatientPrescriptionList.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Data exported successfully!", {
        position: toast.POSITION.TOP_END,
      });
    } catch (error) {
      toast.error("Failed to export data");
      console.error("Error:", error);
    }
  };

  const indexOfLastPrescription = currentPage * prescriptionsPerPage;
  const indexOfFirstPrescription =
    indexOfLastPrescription - prescriptionsPerPage;
  const currentPrescriptions = filteredPrescriptions.slice(
    indexOfFirstPrescription,
    indexOfLastPrescription
  );

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
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
        <h2 style={h1Style}>{t("patientPrescriptionList")}</h2>
      </header>
      <br />
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="form-group">
            <label
              style={{
                marginBottom: "8px",
                fontWeight: "bold",
                display: "block",
                textAlign: "center",
              }}
            >
              {t("patientNameOrPhoneNumber")}
            </label>

            <input
              style={{ fontSize: "12px" }}
              type="text"
              placeholder={
                t("searchByPatientNameOrPhoneNumber") ||
                "Search By Patient Name or Phone Number"
              }
              className="form-control"
              value={filterName}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="col-md-2 mb-2">
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>
        <div className="col-md-4 mb-5">
          {" "}
          <Button
            style={{ fontSize: "12px", padding: "4px 5px", marginTop: "28px" }}
            variant="secondary"
            onClick={() => {
              navigate(`/${extractedPart}/DispenseMedicineOutside`);
            }}
          >
            {t("dispenseOutsidePrescription")}
          </Button>
          <Button
            style={{ fontSize: "12px", padding: "4px 5px", marginTop: "28px" }}
            variant="secondary"
            onClick={() => {
              navigate(`/${extractedPart}/DispensedReportsList`);
            }}
          >
            {t("dispensedReports")}
          </Button>
        </div>
        <div className="col-md-3 mb-3">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="secondary"
              style={{
                fontSize: "12px",
                padding: "4px 5px",
                marginTop: "34px",
                marginLeft: "10px",
              }}
              onClick={handleExportData}
            >
              {t("downloadAsCSV")}
            </Button>
          </div>
        </div>
      </div>

      <br />
      {isMobile ? (
        <div className="row">
          {currentPrescriptions.map((prescription) => (
            <div className="col-md-4 mb-3" key={prescription.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{prescription.PatientName}</h5>

                  <p className="card-text">
                    {t("prescriptionTable.patientPhoneNo")}:
                    {prescription.phoneNumberP}
                  </p>
                  <p className="card-text">
                    {t("prescriptionTable.prescribedDoctor")}:{" "}
                    {prescription.PrescribedDoctor}
                  </p>
                  <p className="card-text">
                    {t("prescriptionTable.doctorPhoneNo")}:{" "}
                    {prescription.PhoneNo}
                  </p>
                  <p className="card-text">
                    {t("prescriptionTable.prescriptionID")}:{" "}
                    {prescription.prescriptionId}
                  </p>
                  <p className="card-text">
                    {t("prescriptionTable.clinicalDiagnosis")}:{" "}
                    {prescription.clinicalDiagnosis}
                  </p>
                  <p className="card-text">
                    {t("prescriptionTable.registrationDate")}:{" "}
                    {formatDateInSelectedLanguage(
                      new Date(prescription.createdAt)
                    )}
                  </p>

                  <span style={{ fontWeight: "bold", color: "black" }}>
                    {prescription.DispensedMedicineQuantity === 0
                      ? t("notDispensed")
                      : prescription.DispensedMedicineQuantity <
                        prescription.prescribeMedicineQuantity
                      ? t("partialDispensed")
                      : t("dispensed")}
                  </span>
                  <Link
                    to={`/${extractedPart}/Dispensation/${prescription.id}`}
                  >
                    <button
                      style={{
                        fontSize: "12px",
                        padding: "4px 5px",
                        marginTop: "0px",
                        marginLeft: "10px",
                      }}
                      className="btn btn-secondary mr-2"
                    >
                      <FaCartPlus />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table style={{ verticalAlign: "middle" }} responsive bordered hover>
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>
                {t("prescriptionTable.id")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("prescriptionTable.prescriptionID")}
              </th>
              {/*               <th style={{ textAlign: "center" }}>{t("doctorID")}</th> */}
              <th style={{ whiteSpace: "nowrap" }}>
                {t("prescriptionTable.patientName")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("prescriptionTable.patientPhoneNo")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("prescriptionTable.prescribedDoctor")}
              </th>
              {/*               <th style={{ textAlign: "center" }}>{t("registrationNo")}</th> */}
              <th style={{ whiteSpace: "nowrap" }}>
                {t("prescriptionTable.doctorPhoneNo")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("prescriptionTable.clinicalDiagnosis")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("prescriptionTable.registrationDate")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("prescriptionTable.status")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("prescriptionTable.dispenseMedicine")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPrescriptions.map((prescription) => (
              <tr key={prescription.id}>
                <td>{prescription.id}</td>
                <td>{prescription.prescriptionId}</td>
                {/* <td>{prescription.doctor_Id}</td> */}
                <td style={{ whiteSpace: "nowrap" }}>
                  {prescription.PatientName}
                </td>
                <td>{prescription.phoneNumberP}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {prescription.PrescribedDoctor}
                </td>
                {/* <td>{prescription.RegistrationNo}</td> */}
                <td>{prescription.PhoneNo}</td>
                <td>{prescription.clinicalDiagnosis}</td>
                <td>
                  {formatDateInSelectedLanguage(
                    new Date(prescription.createdAt)
                  )}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    {prescription.DispensedMedicineQuantity === 0
                      ? t("notDispensed")
                      : prescription.DispensedMedicineQuantity <
                        prescription.prescribeMedicineQuantity
                      ? t("partialDispensed")
                      : t("dispensed")}
                  </span>
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  <Link
                    to={`/${extractedPart}/Dispensation/${prescription.id}`}
                  >
                    <button
                      title={
                        t("prescriptionTable.dispenseMedicine") ||
                        "Dispense Medicine"
                      }
                      style={{
                        fontSize: "12px",
                        padding: "4px 5px",
                        marginTop: "0px",
                        marginLeft: "10px",
                      }}
                      className="btn btn-secondary mr-2"
                    >
                      <FaCartPlus />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <br></br>
      <div className="row justify-content-center">
        <div className="col-auto">
          <Button
            style={{ fontSize: "12px", marginTop: "-8px" }}
            variant="secondary"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            {t("prescriptionTable.previous")}
          </Button>
        </div>
        <div className="col-auto">
          <span className="mx-2">
            Page {currentPage} of{" "}
            {Math.ceil(filteredPrescriptions.length / prescriptionsPerPage)}
          </span>
        </div>
        <div className="col-auto">
          <Button
            style={{ fontSize: "12px", marginTop: "-8px" }}
            variant="secondary"
            onClick={handleNextPage}
            disabled={indexOfLastPrescription >= filteredPrescriptions.length}
          >
            {t("prescriptionTable.next")}
          </Button>
        </div>
      </div>
      <br></br>
    </div>
  );
};

export default PrescriptionList;
