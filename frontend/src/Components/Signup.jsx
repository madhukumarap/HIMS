import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import logo from "../pages/Pills-Medicine.png";
import { Link } from "react-router-dom";
import mediAiImage from "./mediAi.png";
import backgroundImg from "../Components/Background2.jpg";

import Translation from "../translations/Signup.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNoError, setPhoneNoError] = useState("")

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    // Check if user is already logged in
    if (AuthService.getCurrentUser()) {
      navigate(`/${extractedPart}/`); // Redirect to the home page
    }
  }, [navigate]);

  const handlePhoneNumberChange = (event) => {
    const enteredValue = event.target.value;
    const sanitizedValue = enteredValue.replace(/\D/g, "");
    // Check if the sanitized value has already reached 10 digits
    if (countryCode == "+55" || countryCode == "+86" || countryCode == "+258") {
      if (sanitizedValue.length > 12) {
        return;
      }
    } else if (sanitizedValue.length > 10) {
      return
    }
    setPhone(sanitizedValue);

  };

  const checkValidPhoneNo = (e) => {

    const phoneNo = e.target.value

    if (countryCode == "" || countryCode == undefined) {

      setPhoneNoError("case-1")
    } else {
      if (countryCode == "+55" || countryCode == "+86" || countryCode == "+258") {
        if (phoneNo.length < 12) {
          setPhoneNoError("case-2")
        } else if (phoneNo.length == 12) {
          setPhoneNoError("")
        }
      } else if (phoneNo.length < 10) {
        setPhoneNoError("case-3")
      } else {
        setPhoneNoError("")
      }
    }
  }

  const handleSignup = (e) => {
    e.preventDefault();
    if (roles.length === 0) {
      alert("Please select a role");
      return;
    }

    if (
      !email.match("^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$") &&
      email.length > 0
    ) {
      toast.error(t("EnterValidEmail"), {
        style: { fontSize: "13px" },
      });
      return;
    }

    if (phoneNoError == "case-1" || phoneNoError == "case-2" || phoneNoError == "case-3") {
      toast.error(t("pleaseEnterValidPhone"));
      return;
    }

    setMessage("");
    setLoading(true);

    // alert(JSON.stringify(roles));
    AuthService.register(name, username, email, phoneNumber, password, roles, countryCode)
      .then(() => {
        toast.success(t("UserCreatedsuccessfully"), {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        navigate(`/${extractedPart}/login`);
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      });
  };

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontSize: "13px" /* Adjust the font size as per your requirement */,
    paddingTop: "50px",
  };

  const h1Style = {
    fontSize: "24px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "20px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "16px" /* Adjust the font size for <h3> */,
  };

  const [passwordValid, setPasswordValid] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRoleChange = (role) => {
    if (email === "admin@gmail.com" && !roles.includes("admin")) {
      setRoles([role, "admin"]);
    } else {
      setRoles([role]);
    }
    setRadioSelected(true);
  };

  const [radioSelected, setRadioSelected] = useState(false);

  return (
    <div
      style={{
        width: "100%",

        marginTop: "-35px",
        fontSize: "13px",
        backgroundImage: `url(${backgroundImg})`,
      }}
      className="row d-flex justify-content-center align-items-center"
    >
      <div className="col-md-5">
        <div style={{ marginTop: "10px" }} className="card">
          <div className="card-body" style={{ marginTop: "0px" }}>
            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
            <h4 style={h2Style} className="card-title">
              {t("SignUp")}
            </h4>
            <form onSubmit={handleSignup}>
              <br />
              <div className="form-group col-12">
                <label style={{ marginBottom: "7px" }} htmlFor="name">
                  <strong>
                    {t("Name")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </strong>{" "}
                </label>
                <input
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    const enteredValue = e.target.value;
                    const isValid =
                      /^[^0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/.test(
                        enteredValue
                      ) || enteredValue === "";
                    if (isValid) {
                      setName(enteredValue);
                    }
                  }}
                  required
                  placeholder={t("Enteryourname")}
                />
                {name.length > 0 &&
                  (!/^[^0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/.test(name) ||
                    name === "") && (
                    <span style={{ color: "red" }}>
                      {t("Pleaseenteravalidname")}
                    </span>
                  )}
              </div>
              <br />
              <div className="form-group col-12">
                <label style={{ marginBottom: "7px" }} htmlFor="username">
                  <strong>
                    {t("Username")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </strong>{" "}
                </label>
                <input
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value;
                    const firstChar = value.charAt(0);
                    if (firstChar && !isNaN(firstChar)) {
                      return;
                    }
                    setUsername(value);
                  }}
                  required
                  placeholder={t("Enteryourusername")}
                  pattern="^(?=.*[A-Z])(?=.*[a-z])[a-zA-Z]{1}[a-zA-Z0-9]{5,}$"
                  onKeyPress={(e) => {
                    const pattern = /[a-zA-Z0-9]/;
                    const inputChar = String.fromCharCode(e.charCode);
                    if (!pattern.test(inputChar)) {
                      e.preventDefault();
                    }
                  }}
                />
                {username && (
                  <span style={{ color: "red" }}>
                    {!/^(?=.*[A-Z])(?=.{6,})/.test(username) &&
                      t(
                        "Usernamemustcontainatleastonecharacterandonecapitalletterandhaveminimumlengthof6characters"
                      )}
                  </span>
                )}
              </div>
              <br />
              <div className="form-group col-12">
                <label style={{ marginBottom: "7px" }} htmlFor="email">
                  <strong>
                    {t("Email")}
                    <span style={{ color: "red" }}> *</span>
                  </strong>{" "}
                </label>
                <input
                  style={{ fontSize: "13px" }}
                  type="email"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  pattern="^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  placeholder={t("Enteryouremail")}
                />
                {!email.match(
                  "^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                ) &&
                  email.length > 0 && (
                    <div className="error-message">
                      {t("Invalidemailaddress")}
                    </div>
                  )}
              </div>
              <br></br>
              <div className="form-group col-12">
                <label style={{ marginBottom: "7px" }} htmlFor="phone">
                  <strong>
                    {t("PhoneNumber")}
                    <span style={{ color: "red" }}> *</span>
                  </strong>{" "}
                </label>
                <div className="d-flex">
                  <input
                    type="text"
                    className={`form-control ${phoneNoError == "case-1" && "is-invalid"}`}
                    style={{ fontSize: "12px", width: "10%" }}
                    value={countryCode}
                    name="countryCode"
                    placeholder="+91"
                    onChange={(e) => setCountryCode(e.target.value)}
                    pattern="^\+\d+$"
                    title={t("pleaseenteravalidcountryCode")}
                    required
                  />
                  <input
                    style={{ fontSize: "13px" }}
                    type="tel"
                    className={`form-control ms-1 ${phoneNoError == "case-2" && "is-invalid"} ${phoneNoError == "case-3" && "is-invalid"}`}
                    name="phone"
                    value={phoneNumber}
                    onChange={(e) => { handlePhoneNumberChange(e); checkValidPhoneNo(e) }}
                    required
                    pattern="[0-9]{10}"
                    placeholder={t("Enterphonenumber")}
                  />

                  {/* {!phoneNumber.match("[0-9]{10}") && phoneNumber.length > 0 && (
                  <div className="error-message">
                    {t("Invalidphonenumber10digitsrequired")}
                  </div>
                )} */}
                </div>
                <span className="text-danger" style={{fontSize:"12px"}}>
                    {phoneNoError == "case-1" && t("PleaseEnterCountryCode")}
                    {phoneNoError == "case-2" && t("InvalidPhoneNumberPleaseEnterAtleast12Digits")}
                    {phoneNoError == "case-3" && t("InvalidphonenumberPleaseenteratleast10digits")}
                  </span>
              </div>
              <br />
              <div className="form-group col-12">
                <label style={{ marginBottom: "7px" }} htmlFor="password">
                  <strong>
                    {t("Password")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </strong>
                </label>
                <div className="input-group">
                  <input
                    style={{ fontSize: "13px" }}
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordValid(e.target.validity.valid);
                    }}
                    required
                    placeholder={t("Enteryourpassword")}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$"
                  />
                  <button
                    type="button"
                    style={{ fontSize: "13px" }}
                    className="btn btn-outline-secondary"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? t("Hide") : t("Show")}
                  </button>
                  {password.length > 0 && !passwordValid && (
                    <div className="error-message">
                      {t(
                        "Passwordmustbeatleast6characterslongmustcontainatleastoneuppercaselettermustcontainatleastonedigitandmustcontainatleastonespecialcharacter"
                      )}
                    </div>
                  )}
                </div>
              </div>
              <br />
              <div className="form-group col-12">
                <label
                  style={{ marginBottom: "7px" }}
                  htmlFor="confirmPassword"
                >
                  <strong>
                    {t("ConfirmPassword")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </strong>{" "}
                </label>
                <div style={{ display: "flex" }}>
                  <input
                    style={{ fontSize: "13px" }}
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder={t("Confirmyourpassword")}
                  />
                  <button
                    type="button"
                    style={{ fontSize: "13px" }}
                    className="btn btn-outline-secondary"
                    onClick={toggleShowConfirmPassword}
                  >
                    {showConfirmPassword ? t("Hide") : t("Show")}
                  </button>
                </div>
                {password !== confirmPassword && (
                  <div className="error-message">
                    {t("Passwordsdonotmatch")}
                  </div>
                )}
              </div>
              <br />
              <div className="form-group col-12">
                <label style={{ marginBottom: "7px" }} htmlFor="roles">
                  <strong>
                    {t("SelectRole")}
                    <span style={{ color: "red" }}> *</span>
                  </strong>{" "}
                </label>
                <div>
                  <input
                    type="checkbox"
                    id="userRole"
                    name="userRole"
                    value="user"
                    checked={roles.includes("user")}
                    onChange={() => handleRoleChange("user")}
                  />{" "}
                  <label style={{ marginBottom: "7px" }} htmlFor="userRole">
                    {t("USER")}
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="patientRole"
                    name="patientRole"
                    value="patient"
                    checked={roles.includes("patient")}
                    onChange={() => handleRoleChange("patient")}
                  />{" "}
                  <label style={{ marginBottom: "7px" }} htmlFor="patientRole">
                    {" "}
                    {t("PATIENT")}
                  </label>
                </div>
                {radioSelected === false && (
                  <div className="error-message">{t("Pleaseselectarole")}</div>
                )}
              </div>{" "}
              <br />
              <div className="form-group">
                <button
                  style={{ fontSize: "13px" }}
                  className="btn btn-primary btn-block"
                  disabled={loading || confirmPassword !== password}
                  type="submit"
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>{t("SignUp")}</span>
                </button>
                {/* <Link to="/login">
                                    <button
                                        style={{ fontSize: '12px', marginLeft: '10px', }}
                                        className="btn btn-primary btn-block"
                                        disabled={loading}
                                        type="button"
                                    >
                                        Login
                                    </button>
                                </Link> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
