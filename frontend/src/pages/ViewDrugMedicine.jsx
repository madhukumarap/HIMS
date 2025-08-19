import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

import Translation from "../translations/ViewDrugMedicine.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AuthService from "../services/auth.service";
import { CurrencyContext } from "../context/CurrencyProvider";
import { HospitalContext } from "../context/HospitalDataProvider";

const StyledRow = styled.div`
  @media (max-width: 767px) {
    .col-md-4 {
      display: none;
    }
  }
`;
function MedicineInfo() {
  const currentUser = AuthService.getCurrentUser();

  const [medicineName, setMedicineName] = useState("");
  // const [medicineInfo, setMedicineInfo] = useState(null);
  const isLaptopView = window.innerWidth > 1024; // Adjust the breakpoint as per your desired laptop screen width
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const navigate = useNavigate();

  ///

  const { t } = useTranslation();

  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  const { hospitalData } = useContext(HospitalContext);

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
        },
      });
    };

    initializei18n();
  }, []);

  ///

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  const { id } = useParams();
  const [medicineInfo, setMedicineInfo] = useState(null);
  const [allSubstitutes, setAllSubstitutes] = useState([]);
  const [medicineList, setMedicineList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getAllSubstitute/${id}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setAllSubstitutes(response.data);
        setMedicineList(response.data);
      } catch (error) {
        console.error("Error occurred while fetching substitutes:", error);
      }
    };

    fetchData();
  }, [id]); // Trigger the effect when the ID changes

  const fetchMedicineInfo = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/medicine/${id}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setMedicineInfo(data);
    } catch (error) {
      console.error("Error fetching medicine info:", error);
    }
  };

  useEffect(() => {
    fetchMedicineInfo();
  }, [id]);

  const handleInputChange = (event) => {
    setMedicineName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchMedicineInfo();
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.marginTop = "-100px"; // Adjust the offset as needed
      section.scrollIntoView({ behavior: "smooth" });
      section.style.marginTop = "0"; // Reset the margin after scrolling
    }
  };

  const handleLinkClick = (substitute) => {
    navigate(`/medecine/${substitute.medicine_Id}`);
    window.location.reload();
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

  const renderCards = () => {
    if (medicineList.length > 0) {
      return (
        <div className="row card-container">
          {medicineList.map((medicine) => (
            <div key={medicine.id}>
              <Link
                to={`/${extractedPart}/medecine/${medicine.medicine_Id}`}
                className="card"
                style={{
                  fontSize: "13px",
                  position: "relative",
                  overflow: "hidden",
                  width: "80%",
                  transition: "box-shadow 0.3s ease",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  marginBottom: "10px", // Add margin bottom to create space between each medicine
                }}
              >
                <div
                  className="card-content"
                  style={{
                    position: "absolute",
                    top: 80,
                    left: 0,
                    width: "50%",
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
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={style} className="container mt-4">
      {/* <h1 style={{ fontSize: '24px', backgroundColor: "#8BC34A", padding: "5px", marginBottom: "20px", textAlign: "center", top: "0", left: "0", width: "100%" }}>
        Medicine Info
      </h1>   <br></br>  <br></br> */}
      <header
        className="header"
        style={{
          marginLeft: "160px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("medicineInfo")}</h2>
      </header>
      <br></br>
      <div className="row">
        <StyledRow>
          <div className="col-md-4">
            {medicineInfo && (
              <div
                className="mt-4"
                style={{
                  position: "fixed",
                  top: "0px",
                  overflowY: "scroll",
                  height: "100vh",
                }}
              >
                <br></br>
                <br></br>
                <h5>{t("sections")}:</h5>
                <ul className="list-group">
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("medicineName")}
                  >
                    <strong>{t("medicineName")}</strong>
                  </li>

                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("manufacturer")}
                  >
                    <strong>{t("manufacturer")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("saltComposition")}
                  >
                    <strong>{t("composition")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("packaging")}
                  >
                    <strong>{t("packaging")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("price")}
                  >
                    <strong>{t("price")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("storage")}
                  >
                    <strong>{t("storage")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("overview")}
                  >
                    <strong>{t("overview")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("usesAndBenefits")}
                  >
                    <strong>{t("usesAndBenefits")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("sideEffects")}
                  >
                    <strong>{t("sideEffects")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("howToUse")}
                  >
                    <strong>{t("howToUse")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("howDrugWorks")}
                  >
                    <strong>{t("howTheDrugWorks")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("safetyAdvice")}
                  >
                    <strong>{t("safetyAdvice")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("missedDose")}
                  >
                    <strong>{t("missedDose")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("allSubstitutes")}
                  >
                    <strong>{t("allSubstitutes")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("quickTips")}
                  >
                    <strong>{t("quickTips")}</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("interactionWithDrugs")}
                  >
                    <strong>{t("interactionWithDrugs")}</strong>
                  </li>
                  {/* <li className="list-group-item" style={{ cursor: 'pointer' }} onClick={() => scrollToscrollToSection('factBox')}><strong>Fact Box</strong></li> */}
                  {/* <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("patientConcerns")}
                  >
                    <strong>Patient Concerns</strong>
                  </li>
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("userFeedback")}
                  >
                    <strong>User Feedback</strong>
                  </li> */}
                  <li
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection("faqs")}
                  >
                    <strong>{t("FAQs")}</strong>
                  </li>
                  <br></br>
                  <br></br>
                </ul>
              </div>
            )}
          </div>
        </StyledRow>
        <div
          style={{
            marginTop: "5px",
            marginLeft: isLaptopView ? "250px" : "0",
          }}
          className="col-md-8"
        >
          {medicineInfo ? (
            <div>
              <section id="medicineName"></section>
              <section id="medicineName"></section>
              <section id="medicineName"></section>
              <section>
                <br></br>
                <h1 style={{ fontSize: "24px", color: "#FF0000" }}>
                  {medicineInfo.medicineName}
                </h1>
              </section>
              <section id="manufacturer">
                <br></br>
                <p>
                  <strong>{t("manufacturer")}:</strong>{" "}
                  {medicineInfo.manufacturer}
                </p>
              </section>

              <section id="saltComposition">
                <h2 style={h2Style}>{t("composition")}</h2>
                <p>{medicineInfo.saltComposition}</p>
              </section>

              <section id="packaging">
                <h2 style={h2Style}>{t("packaging")}</h2>
                <p>{medicineInfo.packaging}</p>
              </section>

              <section id="price">
                <h2 style={h2Style}>{t("price")}</h2>
                <p>
                  {`${hospitalData.baseCurrency} ${convertCurrency(
                    medicineInfo.price,
                    hospitalData.baseCurrency,
                    ""
                  )}`}
                  {}.00{" "}
                </p>
              </section>

              <section id="storage">
                <h2 style={h2Style}>{t("storage")}</h2>
                <p>{medicineInfo.storage}</p>
              </section>

              <section id="overview">
                <h2 style={h2Style}>{t("overview")}</h2>
                <p>{medicineInfo.overview}</p>
              </section>

              <section id="usesAndBenefits">
                <h2 style={h2Style}>{t("usesAndBenefits")}</h2>
                <p>{medicineInfo.packaging}</p>
              </section>

              <section id="sideEffects">
                <h2 style={h2Style}>{t("sideEffects")}</h2>
                <p>{medicineInfo.sideEffects}</p>
              </section>

              <section id="howToUse">
                <h2 style={h2Style}>{t("howToUse")}</h2>
                <p>{medicineInfo.sideEffects}</p>
              </section>

              <section id="howDrugWorks">
                <h2 style={h2Style}>{t("howTheDrugWorks")}</h2>
                <p>{medicineInfo.safetyAdvice}</p>
              </section>

              <section id="safetyAdvice">
                <h2 style={h2Style}>{t("safetyAdvice")}</h2>
                <p>{medicineInfo.safetyAdvice}</p>
              </section>

              <section id="missedDose">
                <h2 style={h2Style}>{t("missedDose")}</h2>
                <p>{medicineInfo.missedDose}</p>
              </section>

              <section id="allSubstitutes">
                <h2 style={h2Style}>{t("allSubstitutes")}</h2>
                {allSubstitutes.length > 0 ? (
                  <div className="col-md-8">{renderCards()}</div>
                ) : (
                  <p>{t("noSubstitutesAvailable")}</p>
                )}
              </section>

              <section id="quickTips">
                <h2 style={h2Style}>{t("quickTips")}</h2>
                <p>{medicineInfo.quickTips}</p>
              </section>

              <section id="interactionWithDrugs">
                <h2 style={h2Style}>{t("interactionWithDrugs")}</h2>
                <p>{medicineInfo.interactionDrugs}</p>
              </section>

              {/* <section id="factBox">
                <h2>Fact Box</h2>
                <p>{medicineInfo.fact_box}</p>
              </section> */}

              <section id="patientConcerns">
                <h2 style={h2Style}>{t("patientConcerns")}</h2>
                <p>{medicineInfo.interactionDrugs}</p>
              </section>

              {/* <section id="userFeedback">
                <h2 style={h2Style}>User Feedback</h2>
                <p>{medicineInfo.userFeedback}</p>
              </section>

              <section id="faqs">
                <h2 style={h2Style}>FAQs</h2>
                <p style={h2Style}>{medicineInfo.faqs}</p>
              </section> */}

              {currentUser && currentUser?.roles.includes("ROLE_ADMIN") && (
                <Link to={`/${extractedPart}/ManageDrugDatabase`}>
                  <button
                    style={{
                      fontSize: "13px",
                      marginTop: "16px",
                      marginLeft: "20px",
                      padding: "4px 5px",
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    {t("goBack")}
                  </button>
                </Link>
              )}

              <br></br>
            </div>
          ) : (
            <div className="mt-4">{t("noMedicineInformationAvailable")}</div>
          )}
        </div>
        <br></br>
      </div>
      <br></br> <br></br>
    </div>
  );
}

export default MedicineInfo;
