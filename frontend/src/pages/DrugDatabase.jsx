import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Translation from "../translations/ViewDrugMedicine.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import AuthService from "../services/auth.service";

function MedicineInfo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicineList, setMedicineList] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("");
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

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
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchMedicineInfo();
  };

  // localStorage.setItem("reloadCount1", "0");
  // const reloadCount = localStorage.getItem("reloadCount2");
  // if (reloadCount !== "1") {
  //   window.location.reload();
  //   localStorage.setItem("reloadCount2", "1");
  // }

  const fetchMedicineInfo = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/getMedicine?medicine_name=${searchTerm}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setMedicineList(data);
      if (data.length > 0) {
        setFetchStatus("success");
        setTimeout(() => {
          setFetchStatus("");
        }, 3000);
      } else {
        setFetchStatus("error");
        setTimeout(() => {
          setFetchStatus("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error fetching medicine info:", error);
      setMedicineList([]);
    }
  };

  const renderCards = () => {
    if (medicineList.length > 0) {
      return (
        <div className="row card-container">
          {medicineList.map((medicine) => (
            <div key={medicine.id} className="col-md-4">
              <Link
                to={`/${extractedPart}/medecine/${medicine.id}`}
                className="card"
                style={{
                  fontSize: "12px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "box-shadow 0.3s ease",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  className="card-content"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                    zIndex: 1,
                  }}
                ></div>
                <h5
                  className="card-title"
                  style={{ fontSize: "14px", color: "blue" }}
                >
                  {medicine.medicineName}
                </h5>
              </Link>
              <div className="card-body">
                <p className="card-text">
                  {t("manufacturer")}: {medicine.manufacturer}
                </p>
                <p className="card-text">
                  {t("composition")}: {medicine.saltComposition}
                </p>
                <p className="card-text">
                  {t("packaging")}: {medicine.packaging}
                </p>
                <p className="card-text">
                  {t("price")}: {medicine.price}.00
                </p>
                {/* Add more card fields for additional information */}
              </div>{" "}
              <br></br>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
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
    <div style={style}>
      {/* <h1 style={{ fontSize: '24px', backgroundColor: "#8BC34A", padding: "10px", marginBottom: "20px", textAlign: "center" }}>
        Drug Database
      </h1> */}
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("DrugDatabase")}</h2>
      </header>
      <div className="container mt-4">
        <div className="row mt-4">
          <div className=" col-md-2">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  style={{ fontSize: "12px" }}
                  type="text"
                  required
                  className="form-control"
                  placeholder={t("EnterMedicineName")}
                  value={searchTerm}
                  onChange={handleInputChange}
                />
              </div>{" "}
              <br></br>
              <div className="form-group">
                <button
                  style={{ fontSize: "12px" }}
                  type="submit"
                  className="btn btn-secondary"
                >
                  {t("Search")}
                </button>
                {fetchStatus === "success" && (
                  <p style={{ color: "green" }}>
                    {t("drugfetchedsuccessfully")}
                  </p>
                )}
                {fetchStatus === "error" && (
                  <p style={{ color: "red" }}> {t("Drugnotfound")}</p>
                )}
              </div>
            </form>
          </div>

          <div className="col-md-8">{renderCards()}</div>
        </div>
      </div>
    </div>
  );
}

export default MedicineInfo;
