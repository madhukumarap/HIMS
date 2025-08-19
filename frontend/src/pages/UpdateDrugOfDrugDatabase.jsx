import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams, Link } from "react-router-dom";
import Select from "react-select";
import { Form } from "react-bootstrap";
import AuthService from "../services/auth.service";
import Translation from "../translations/AddDrugToDatabase.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "axios";

const FormComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  ///

  const { t } = useTranslation();

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
  const [currency, setCurrency] = useState(currentUser.baseCurrency);
  const [medicineName, setMedicineName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [saltComposition, setSaltComposition] = useState("");
  const [packaging, setPackaging] = useState("");
  const [price, setPrice] = useState("");
  const [storage, setStorage] = useState("");
  const [overview, setOverview] = useState("");
  const [usesBenefits, setUsesBenefits] = useState("");
  const [sideEffects, setSideEffects] = useState("");
  const [howToUse, setHowToUse] = useState("");
  const [drugWorks, setDrugWorks] = useState("");
  const [safetyAdvice, setSafetyAdvice] = useState("");
  const [missedDose, setMissedDose] = useState("");
  const [quickTips, setQuickTips] = useState("");
  const [interactionDrugs, setInteractionDrugs] = useState("");
  const [patientConcerns, setPatientConcerns] = useState("");
  const [isMedicinExist, setIsMedicinExist] = useState(false);

  // const [allSubstitutes, setAllSubstitutes] = useState('');
  const [allSubstitutes, setAllSubstitutes] = useState([]);
  const [drugOptions, setDrugOptions] = useState([]);

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  const getAllSubstitutes = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllSubstitute/${id}`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        const data = response.data.map((drug) => ({
          medicine_Id: drug.id,
          value: drug.medicineName,
          label: drug.medicineName,
          medicineName: drug.medicineName,
        }));
        setAllSubstitutes(data);
      })
      .catch((error) => {
        toast.error("Error fetching substitute");
        console.log("Error fetching substitute :", error);
      });
  };

  console.log("getAllSubstitutes :", allSubstitutes);

  useEffect(() => {
    getAllSubstitutes();
    fetch(`${import.meta.env.VITE_API_URL}/api/drugs`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    }) //
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((drug) => ({
          medicine_Id: drug.id,
          value: drug.medicineName,
          label: drug.medicineName,
          medicineName: drug.medicineName,
        }));
        setDrugOptions(options);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/medicine/${id}`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const {
          id,
          medicineName,
          manufacturer,
          saltComposition,
          packaging,
          price,
          storage,
          overview,
          usesBenefits,
          sideEffects,
          howToUse,
          drugWorks,
          safetyAdvice,
          missedDose,
          quickTips,
          interactionDrugs,
          patientConcerns,
          Currency,
        } = data;

        setMedicineName(medicineName);
        setManufacturer(manufacturer);
        setSaltComposition(saltComposition);
        setPackaging(packaging);
        setPrice(price);
        setStorage(storage);
        setOverview(overview);
        setUsesBenefits(usesBenefits);
        setSideEffects(sideEffects);
        setHowToUse(howToUse);
        setDrugWorks(drugWorks);
        setSafetyAdvice(safetyAdvice);
        setMissedDose(missedDose);
        setQuickTips(quickTips);
        setCurrency(Currency);
        setInteractionDrugs(interactionDrugs);
        setPatientConcerns(patientConcerns);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "medicineName":
        setMedicineName(value);
        break;
      case "manufacturer":
        setManufacturer(value);
        break;
      case "saltComposition":
        setSaltComposition(value);
        break;
      case "packaging":
        setPackaging(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "storage":
        setStorage(value);
        break;
      case "overview":
        setOverview(value);
        break;
      case "usesBenefits":
        setUsesBenefits(value);
        break;
      case "sideEffects":
        setSideEffects(value);
        break;
      case "howToUse":
        setHowToUse(value);
        break;
      case "drugWorks":
        setDrugWorks(value);
        break;
      case "safetyAdvice":
        setSafetyAdvice(value);
        break;
      case "missedDose":
        setMissedDose(value);
        break;
      case "quickTips":
        setQuickTips(value);
        break;
      case "interactionDrugs":
        setInteractionDrugs(value);
        break;
      case "patientConcerns":
        setPatientConcerns(value);
        break;
      case "currency":
        setCurrency(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //  alert(allSubstitutes.length)
    const formData = {
      id: id,
      medicineName: medicineName,
      manufacturer: manufacturer,
      saltComposition: saltComposition,
      packaging: packaging,
      price: price,
      storage: storage,
      overview: overview,
      usesBenefits: usesBenefits,
      sideEffects: sideEffects,
      howToUse: howToUse,
      drugWorks: drugWorks,
      safetyAdvice: safetyAdvice,
      allSubstitutes: allSubstitutes,
      missedDose: missedDose,
      quickTips: quickTips,
      interactionDrugs: interactionDrugs,
      patientConcerns: patientConcerns,
      currency: currency,
    };

    fetch(`${import.meta.env.VITE_API_URL}/api/UpdateDrug/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${currentUser?.Token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(t("UpdatedDrugToDatabaseSuccessfully"), {
            position: toast.POSITION.TOP_END,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate(`/${extractedPart}/ManageDrugDatabase`);
        } else {
          alert("Failed to update");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
  if (currentUser && !currentUser.roles.includes("ROLE_ADMIN")) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return "Access Denied";
    // You can handle the redirection or error message display as per your requirement
  }

  const setName = (name) => {
    setMedicineName(name);
    isMedicinExist && setIsMedicinExist(false);
  };

  const checkMedicineName = (name) => {
    drugOptions.forEach((drug) => {
      drug.medicineName == name ? setIsMedicinExist(true) : setName(name);
    });
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          margin: "0 auto",
          fontSize: "12px",
        }}
      >
        <div>
          <h1
            className="header"
            style={{
              textAlign: "center",
              fontSize: "14px",

              padding: "10px",
            }}
          >
            {t("addDrugToDatabase")}
          </h1>
        </div>

        <div className="container" style={{}}>
          <form
            onSubmit={
              isMedicinExist
                ? (e) => {
                    e.preventDefault();
                    toast.error("Medicine exist with this name");
                  }
                : handleSubmit
            }
          >
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("medicineName")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <input
                    type="text"
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterMedicineName")}
                    value={medicineName}
                    onChange={(e) => checkMedicineName(e.target.value)}
                    required
                  />
                  {isMedicinExist && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      Medicine exist with this name
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("manufacturer")}
                      <span
                        style={{
                          color: "red",
                          marginLeft: "5px",
                          marginBottom: "8px",
                        }}
                      >
                        *
                      </span>
                      :
                    </strong>
                  </label>
                  <input
                    type="text"
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      marginTop: "8px",
                    }}
                    className="form-control"
                    placeholder={t("enterManufacturer")}
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("composition")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <input
                    type="text"
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterComposition")}
                    value={saltComposition}
                    onChange={(e) => setSaltComposition(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("packaging")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <input
                    type="text"
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterPackaging")}
                    value={packaging}
                    onChange={(e) => setPackaging(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col-md-4 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("priceINR")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <input
                    type="text" // Change the input type to "text"
                    className="form-control"
                    placeholder={t("enterPrice")}
                    value={price}
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    onChange={(e) => {
                      const enteredValue = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(enteredValue)) {
                        // Allow numbers with up to 2 decimal places
                        if (
                          enteredValue === "" ||
                          parseFloat(enteredValue) > 0
                        ) {
                          // Check for greater than 0 or empty
                          setPrice(enteredValue);
                        }
                      }
                    }}
                    required
                  />
                </div>
              </div>
              <div className="col-md-2 col-sm-12">
                <label>
                  <strong>
                    {t("Currency")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>:
                  </strong>
                </label>
                <Form.Select
                  as="select"
                  required
                  style={{
                    fontSize: "12px",
                    width: "50%",
                    marginLeft: "0px",
                    marginTop: "6px",
                  }}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="CDF">CDF</option>
                </Form.Select>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("storage")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <input
                    type="text"
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterStorage")}
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("overview")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <textarea
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterOverview")}
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("usesandBenefits")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <textarea
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterUsesandBenefits")}
                    value={usesBenefits}
                    onChange={(e) => setUsesBenefits(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <br></br>

            <br></br>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("sideEffects")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <textarea
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterSideEffects")}
                    value={sideEffects}
                    onChange={(e) => setSideEffects(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("quickTips")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <textarea
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterQuickTips")}
                    value={quickTips}
                    onChange={(e) => setQuickTips(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("howtoUse")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <textarea
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterHowToUse")}
                    value={howToUse}
                    onChange={(e) => setHowToUse(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("howtheDrugWorks")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <textarea
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterHowtheDrugWorks")}
                    value={drugWorks}
                    onChange={(e) => setDrugWorks(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <br></br>

            <br></br>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("safetyAdvice")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <textarea
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterSafetyAdvice")}
                    value={safetyAdvice}
                    onChange={(e) => setSafetyAdvice(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("missedDose")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <textarea
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterMissedDose")}
                    value={missedDose}
                    onChange={(e) => setMissedDose(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label style={{ marginBottom: "8px" }}>
                    <strong>
                      {t("allSubstitutes")}
                      {/* <span style={{ color: "red", marginLeft: "5px" }}>*</span> */}
                      :
                    </strong>
                  </label>
                  <Select
                    placeholder={t("select")}
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    options={drugOptions}
                    value={allSubstitutes}
                    // placeholder={t("select")}
                    isMulti
                    onChange={(selectedOptions) =>
                      setAllSubstitutes(selectedOptions)
                    }
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>
                    <strong>
                      {t("interactionwithDrugs")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <textarea
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder={t("enterInteractionwithDrugs")}
                    value={interactionDrugs}
                    onChange={(e) => setInteractionDrugs(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <br></br>
            {/* <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>
                    <strong>
                      Patient Concerns
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                  </label>
                  <textarea
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    className="form-control"
                    placeholder="Enter Patient Concerns"
                    value={patientConcerns}
                    onChange={(e) => setPatientConcerns(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div> */}

            <div className="row">
              <div style={{ textAlign: "center" }}>
                <button
                  style={{ fontSize: "13px", padding: "4px 5px" }}
                  type="submit"
                  className="btn btn-secondary mr-2"
                >
                  {t("submit")}
                </button>
                <Link to={`/${extractedPart}/ManageDrugDatabase`}>
                  <button
                    style={{
                      marginLeft: "10px",
                      fontSize: "13px",
                      padding: "4px 5px",
                    }}
                    className="btn btn-secondary mr-2"
                  >
                    {t("goBack")}
                  </button>
                </Link>
              </div>
            </div>
            <br></br>
            <br></br>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormComponent;
