import AuthService from "../../services/auth.service";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DateRangePicker } from "react-date-range";
import Datepickrange from "./DateRangeSelector";

import { useNavigate } from "react-router";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { FaBookMedical, FaEye, FaRegEye } from "react-icons/fa";
import Translation from "../../translations/HospitalAdmissionAndDischarge.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { registerLocale } from "react-datepicker";
import { fr, enIN } from "date-fns/locale";
import "moment/locale/fr";
import { CurrencyContext } from "../../context/CurrencyProvider";
const AdmissionAndDischarge = () => {
  const [bedsList, setBedsList] = useState([]);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();
  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  registerLocale("fr", fr);
  registerLocale("en", enIN);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const locales = { enIN, fr };
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
    const intervalId = setInterval(initializei18n, 2000);
    return () => clearInterval(intervalId);
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };
  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/getBedsListWithStatus`,
        {
          startDate,
          endDate,
        },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        // alert(JSON.stringify(response.data));
        setBedsList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching beds list:", error);
      });
  }, [startDate, endDate]);

  const handleViewBookings = (bedNumber) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/check-bed-availability`,
        {
          startDate,
          endDate,
          bedNumber,
        },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        alert(JSON.stringify(response.data));
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bed bookings:", error);
      });
  };

  const calculateBedStatus = (bed) => {
    const currentDate = new Date();
    const checkInTime = new Date(bed.OccupiedCheckInTime);
    const checkOutTime = new Date(bed.OccupiedCheckOutTime);
    // alert(checkInTime);
    if (currentDate < checkInTime && currentDate <= checkOutTime) {
      return "Occupied";
    } else {
      return "Available";
    }
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
    <div style={{ marginLeft: "1%", marginRight: "1%" }}>
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
      {/*  <>
        <div className="col-md-3 col-12">
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>
      </>
      */}
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
          <Tr>
            <Th style={{ textAlign: "center" }}>
              {t("hospitalAdmissionDischargeTable.SrNo")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("hospitalAdmissionDischargeTable.BedNumber")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("hospitalAdmissionDischargeTable.BedType")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("hospitalAdmissionDischargeTable.BedPrice")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("hospitalAdmissionDischargeTable.BedStatus")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("hospitalAdmissionDischargeTable.AllocationStatus")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("hospitalAdmissionDischargeTable.Action")}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {bedsList.map((bed, index) => (
            <Tr key={bed.id}>
              <Td
                style={{
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {index + 1}
              </Td>
              <Td
                style={{
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {bed.BedNumber}
              </Td>
              <Td
                style={{
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {bed.BedType}
              </Td>
              <Td
                style={{
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {convertCurrency(
                  bed.BedPrice,
                  bed.Currency,
                  selectedGlobalCurrency
                )}{" "}
                {selectedGlobalCurrency}
              </Td>
              <Td
                style={{
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {bed.BedStatus}
              </Td>
              <Td
                style={{
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {calculateBedStatus(bed)}
              </Td>

              <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                <Link to={`/${extractedPart}/InpatientCalender`}>
                  <Button
                    title={t("AllocateBed")}
                    style={{
                      fontSize: "12px",
                      marginTop: "0px",
                      marginLeft: "10px",
                      padding: "4px 5px",
                    }}
                    className="btn btn-secondary mr-2"
                  >
                    <FaBookMedical />
                  </Button>
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default AdmissionAndDischarge;
