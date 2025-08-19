import jsPDF from "jspdf";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Table, Card } from "react-bootstrap";
import AuthService from "../services/auth.service";
import Sidebar from "../Components/Sidebar";
import Translation from "../translations/expiryreport.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { fr, enIN } from "date-fns/locale";
import { format as formatDate, isDate } from "date-fns";

const ExpiryReportForm = () => {
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();

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

  const [reportData, setReportData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);
  const [printMode, setPrintMode] = useState(false);
  const [reportType, setReportType] = useState("month");
  const [duration, setDuration] = useState("1");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar2 = () => {
    setShowSidebar(!showSidebar);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getIfExpiryLess-7/${expiryDays}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = response.data;
      setReportData(data);
    } catch (error) {
      console.error("Error fetching expiry report:", error);
    }
  };

  // const handleGenerateReport = (event) => {
  //   event.preventDefault();
  //   fetchData();
  // };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleExpiryDaysChange = (event) => {
    setExpiryDays(event.target.value);
  };

  const handleGenerateReport = (event) => {
    event.preventDefault();

    let calculatedDays;
    if (reportType === "year") {
      calculatedDays = duration * 365;
    } else if (reportType === "month") {
      calculatedDays = duration * 30;
    } else if (reportType === "week") {
      calculatedDays = duration * 7;
    }

    setExpiryDays(calculatedDays);
    fetchData();
  };

  const filteredReportData = reportData.filter((medicine) =>
    medicine.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const handlePrintReport = () => {
    const doc = new jsPDF();

    // Define columns and rows
    const columns = [
      { title: "Medicine Name", dataKey: "itemName" },
      { title: "Composition", dataKey: "composition" },
      { title: "Batch No", dataKey: "batchNo" },
      { title: "Expiry Date", dataKey: "expiryDate" },
      { title: "Balance Quantity", dataKey: "balanceQuantity" },
    ];

    const rows = filteredReportData.map((medicine) => ({
      itemName: medicine.itemName,
      composition: medicine.composition,
      batchNo: medicine.batchNo,
      expiryDate: formatDate(medicine.expiryDate),
      balanceQuantity: medicine.balanceQuantity,
    }));

    // Add table to PDF
    doc.autoTable({
      columns,
      body: rows,
      styles: { fontSize: 10, cellPadding: 1, border: "1" },
      margin: { top: 20 },
    });

    doc.save("expiry_report.pdf");
  };

  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
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
    !currentUser.roles.includes("ROLE_PHARMACIST")
  ) {
    return <h2>Access Denied!</h2>;
  }

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "10px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "14px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "16px" /* Adjust the font size for <h3> */,
  };

  return (
    <Container style={style}>
      <div className={`container mt-6 ${printMode ? "print-mode" : ""}`}>
        <div className="d-flex flex-column align-items-center">
          <header
            className="header"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={h1Style}>
              {t("expiryreport")} ({t("ExpiryReportExpiryinlessthan")}{" "}
              {expiryDays} {t("days")})
            </h2>
          </header>
          <br></br>

          {!printMode && (
            <form
              style={{ width: "80%" }}
              onSubmit={handleGenerateReport}
              className="row"
            >
              <div
                style={{ fontSize: "12px", marginTop: "7px" }}
                className="col-md-3 col-sm-6 mb-2"
              >
                <strong>{t("EnterNumberofdaystoExpiry")}</strong>
              </div>
              <div className="col-md-3 col-sm-6 mb-2">
                <select
                  style={{ fontSize: "12px" }}
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="form-control form-control-sm"
                >
                  <option value="">{t("Select")}</option>
                  <option value="week">{t("Week")}</option>
                  <option value="month">{t("Month")}</option>
                  <option value="year">{t("Year")}</option>
                </select>
              </div>
              <div className="col-md-3 col-sm-6 mb-2">
                <select
                  style={{ fontSize: "12px" }}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="form-control form-control-sm"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
              <div className="col-md-3 col-sm-6 mb-2">
                <button
                  type="submit"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "10px", marginTop: "4px" }}
                >
                  {t("ViewReport")}
                </button>
              </div>
            </form>
          )}
        </div>

        <div>
          <div className="d-flex justify-content-between mt-3">
            {!printMode && ( // Hide buttons in print mode
              <>
                <div class="    mt-4">
                  <input
                    type="text"
                    style={{ fontSize: "10px" }}
                    class="form-control"
                    placeholder={t("SearchbyMedicineName")}
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <button
                  style={{
                    marginTop: "19px",
                    height: "30px",
                    fontSize: "10px",
                    padding: "0px 3px",
                  }}
                  className="btn btn-secondary "
                  onClick={handlePrintReport}
                >
                  {t("PrintReport")}
                </button>
              </>
            )}
          </div>
          {isMobile ? (
            <div>
              {filteredReportData.map((medicine) => (
                <Card key={medicine.itemName} className="mb-3">
                  <Card.Body>
                    <Card.Title style={{ textAlign: "center" }}>
                      {medicine.itemName}
                    </Card.Title>
                    <Card.Text style={{ textAlign: "center" }}>
                      {t("expiryReportTable.Composition")}:{" "}
                      {medicine.composition}
                    </Card.Text>
                    <Card.Text style={{ textAlign: "center" }}>
                      {t("expiryReportTable.BatchNo")}: {medicine.batchNo}
                    </Card.Text>
                    <Card.Text style={{ textAlign: "center" }}>
                      {t("expiryReportTable.ExpiryDate")}:{" "}
                      {formatDateInSelectedLanguage(
                        new Date(medicine.expiryDate)
                      )}
                    </Card.Text>
                    <Card.Text style={{ textAlign: "center" }}>
                      {t("expiryReportTable.BalanceQuantity")}:{" "}
                      {medicine.balanceQuantity}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <Table responsive className="mt-3">
              <thead>
                <tr style={{ backgroundColor: "#FFDAB9", color: "black" }}>
                  <th style={{ textAlign: "center" }}>
                    {t("expiryReportTable.MedicineName")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("expiryReportTable.Composition")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("expiryReportTable.BatchNo")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("expiryReportTable.ExpiryDate")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("expiryReportTable.BalanceQuantity")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReportData.map((medicine) => (
                  <tr key={medicine.itemName}>
                    <td style={{ textAlign: "center" }}>{medicine.itemName}</td>
                    <td style={{ textAlign: "center" }}>
                      {medicine.composition}
                    </td>
                    <td style={{ textAlign: "center" }}>{medicine.batchNo}</td>
                    <td style={{ textAlign: "center" }}>
                      {formatDateInSelectedLanguage(
                        new Date(medicine.expiryDate)
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {medicine.balanceQuantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      <style>
        {`
    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }

    .text-right {
      text-align: right;
    }

    @media print {
      .navbar,
      .sidebar,
      .text-center,
      button,
      input:not([type="hidden"]) {
        display: none !important;
      }
    }
  `}
      </style>
    </Container>
  );
};

export default ExpiryReportForm;
