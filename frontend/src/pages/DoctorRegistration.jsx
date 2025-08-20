import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import { Table, Button, Modal, Form, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Translation from "../translations/DoctorRegistration.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const DoctorRegistration = () => {
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
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [signatureImage, setSignatureImage] = useState(null);
  const currentUser = AuthService.getCurrentUser();
  const [doctorsType, setDoctorsType] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [referralFee, setReferralFee] = useState("");

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    setSignatureImage(file);
  };

  const handlePhoneNoChange = (e) => {
    const enteredValue = e.target.value;
    const digitsOnly = enteredValue.replace(/\D/g, "");
    const limitedValue = digitsOnly.slice(0, 10);
    setPhoneNo(limitedValue);

    if (limitedValue.length < 10) {
      setErrors({ ...errors, phoneNo: t("phoneNumberValidationError") });
    } else {
      setErrors({ ...errors, phoneNo: "" });
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    let errorMessage = "";
    if (value.length === 0) {
      errorMessage = t("usernameMissingError");
    } else if (!/^(?=.*[A-Z])(?=.*[a-z]).{6,}$/.test(value)) {
      errorMessage = t("useenameValidationError");
    }

    setErrors({ username: errorMessage });
  };
  const handleDoctorTypeChange = (e) => {
    const value = e.target.value;
    setDoctorsType(value);

    let errorMessage = "";
    if (value.length === 0) {
      errorMessage = t("doctorTypeMissingError");
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      doctorType: errorMessage,
    }));
  }
  const handleconsultationFee = (e) => {
    const value = e.target.value;
    setConsultationFee(value);
    let errorMessage = "";
    if (value.length === 0) {
      errorMessage = t("consultationFeeMissingError");
    } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      errorMessage = t("consultationFeeValidationError");
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      consultationFee: errorMessage,
    }));
  }
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    let errorMessage = "";
    if (value.length === 0) {
      errorMessage = t("passwordMissingError");
    } else if (value.length < 6) {
      errorMessage = t("passwordLengthError");
    } else if (!/(?=.*[A-Z])/.test(value)) {
      errorMessage = t("passwordMissingUppercaseLetter");
    } else if (!/[!@#$%^&*]/.test(value)) {
      errorMessage = t("passwordMissingSpecialCharacter");
    } else if (confirmPassword && value !== confirmPassword) {
      errorMessage = t("passwordMismatchError");
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      password: errorMessage,
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    let errorMessage = "";
    if (value.length > 0 && value !== password) {
      errorMessage = t("passwordMismatchError");
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      confirmPassword: errorMessage,
    }));
  };
  const handlereferralFee = (e) => {
    const value = e.target.value;
    setReferralFee(value);
    let errorMessage = "";
    if (value.length === 0) {
      errorMessage = t("referralFeeMissingError");
    } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      errorMessage = t("referralFeeValidationError");
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      referralFee: errorMessage,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form inputs
    const validationErrors = {};

    if (!firstName.match(/^[A-Za-z]+$/)) {
      validationErrors.firstName = t("firstNameValidationError");
    }

    if (!lastName.match(/^[A-Za-z]+$/)) {
      validationErrors.lastName = t("lastNameValidationError");
    }

    if (registrationNo.trim() === "") {
      validationErrors.registrationNo = t("registrationNumberMissingError");
    }

    if (phoneNo.length !== 10 || !phoneNo.match(/^[0-9]+$/)) {
      validationErrors.phoneNo = t("phoneNumberValidationError");
      toast.error(t("phoneNumberValidationError"), {
        style: { fontSize: "13px" },
      });

      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (
      !email.match("^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$") &&
      email.length > 0
    ) {
      toast.error(t("emailValidationError"), {
        style: { fontSize: "13px" },
      });

      return;
    }

    if (username.length === 0) {
      toast.error(t("usernameValidationError"), {
        style: { fontSize: "13px" },
      });
      return;
    } else if (!/^(?=.*[A-Z])(?=.*[a-z]).{6,}$/.test(username)) {
      toast.error(t("usernameValidationError"), {
        style: { fontSize: "13px" },
      });
      return;
    }

    if (password.length === 0) {
      toast.error(t("passwordValidationError"), {
        style: { fontSize: "13px" },
      });
      return;
    } else if (password.length < 6) {
      toast.error(t("passwordValidationError"), {
        style: { fontSize: "13px" },
      });
      return;
    } else if (!/(?=.*[A-Z])/.test(password)) {
      toast.error(t("passwordValidationError"), {
        style: { fontSize: "13px" },
      });
      return;
    } else if (!/[!@#$%^&*]/.test(password)) {
      toast.error(t("passwordValidationError"), {
        style: { fontSize: "13px" },
      });
      return;
    } else if (confirmPassword && password !== confirmPassword) {
      toast.error(t("passwordValidationError"), {
        style: { fontSize: "13px" },
      });
      return;
    }

    const data = {
      firstName,
      middleName,
      lastName,
      registrationNo,
      phoneNo,
      username,
      password,
      email,
      address,
    };

    const formData = new FormData();

    formData.append("firstName", firstName);
    formData.append("middleName", middleName);
    formData.append("lastName", lastName);
    formData.append("registrationNo", registrationNo);
    formData.append("phoneNo", phoneNo);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("countryCode", countryCode);
    formData.append("doctorsType", doctorsType);
    formData.append("referralFee", referralFee);
    formData.append("consultationFee",consultationFee)
    if (signatureImage) {
      formData.append("signatureImage", signatureImage);
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/saveDoctor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      toast.success(response.data.message, {
        style: { fontSize: "13px" },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message, {
          style: { fontSize: "13px" },
        });
      } else {
        toast.error("An error occurred while saving the doctor", {
          style: { fontSize: "13px" },
        });
      }
    }
    //  return;
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setRegistrationNo("");
    setPhoneNo("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setAddress("");
    setErrors({});
    setCountryCode("");
    setDoctorsType("");
    setReferralFee("");
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
    return "Access Denied";
  }
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
    fontSize: "13px" /* Adjust the font size for <h3> */,
  };

  return (
    <>
      <div style={style}>
        <header
          className="header"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 style={h1Style}>{t("doctorRegistration")}</h2>
        </header>{" "}
        <br />
        <div
          style={{
            width: "98%",
            height: "100%",
            margin: "0 auto",
            paddingLeft: "10px",
            fontSize: "12px",
            border: "1px solid black",
            padding: "10px",
          }}
        >
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          <div
            style={{
              "@media only screen and (max-width: 100%)": {
                ".form-control": {
                  width: "100%",
                },
              },
            }}
            className="row justify-content-center"
          >
            <br />

            <div className="col-12">
              {" "}
              <br></br>
              {/* <Link to="/UploadDoctorData">
                        <Button style={{ fontSize: '12px' }}>Upload Doctor Data</Button>
                    </Link><br></br> */}
              <form onSubmit={handleSubmit}>
                {" "}
                <div className="form-group row">
                  <br></br>
                  <label htmlFor="drSelect" className="col-sm-1 col-form-label">
                    <strong> {t("name")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <div className="col-sm-1">
                    <select
                      style={{ fontSize: "12px" }}
                      id="drSelect"
                      className="form-control"
                      required
                    >
                      <option value="Dr">{t("doctorSalutation")}</option>
                    </select>
                  </div>
                  {/* </div> */}
                  <br />

                  {/* <div className="form-group row">
                            <label htmlFor="firstName" className="col-sm-1 col-form-label">
                                <span style={{ color: 'red', marginLeft: '5px' }}>*</span>:
                            </label> */}
                  <div className="col-sm-3">
                    <input
                      type="text"
                      style={{ fontSize: "12px" }}
                      className="form-control"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const newValue = inputValue.replace(
                          /[^A-Za-z\s-]/g,
                          ""
                        );
                        setFirstName(newValue);
                      }}
                      placeholder={t("enterFirstName")}
                      required
                    />
                    {errors.firstName && (
                      <span className="text-danger">{errors.firstName}</span>
                    )}
                  </div>

                  <div className="col-sm-3">
                    <input
                      type="text"
                      style={{ fontSize: "12px" }}
                      className="form-control"
                      id="middleName"
                      value={middleName}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const newValue = inputValue.replace(
                          /[^A-Za-z\s-]/g,
                          ""
                        );
                        setMiddleName(newValue);
                      }}
                      placeholder={t("enterMiddleName")}
                    />
                  </div>

                  <div className="col-sm-3">
                    <input
                      type="text"
                      style={{ fontSize: "12px" }}
                      className="form-control"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const newValue = inputValue.replace(
                          /[^A-Za-z\s-]/g,
                          ""
                        );
                        setLastName(newValue);
                      }}
                      placeholder={t("enterLastName")}
                      required
                    />
                    {errors.lastName && (
                      <span className="text-danger">{errors.lastName}</span>
                    )}
                  </div>
                </div>
                <br />
                <div className="form-group row">
                  {/* </div>
                        <br />

                        <div className="form-group row"> */}
                  <label htmlFor="phoneNo" className="col-sm-2 col-form-label">
                    <strong>{t("phoneNumber")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <div className="col-sm-3 ">
                    <div className="d-flex">
                      <input
                        type="text"
                        className="form-control"
                        style={{ fontSize: "12px", width: "20%" }}
                        value={countryCode}
                        placeholder="+91"
                        onChange={(e) => setCountryCode(e.target.value)}
                        pattern="^\+\d+$"
                        title={t("pleaseenteravalidcountryCode")}
                        required
                      />
                      <input
                        type="tel"
                        style={{ fontSize: "12px" }}
                        className="form-control ms-1"
                        id="phoneNo"
                        value={phoneNo}
                        onChange={handlePhoneNoChange}
                        placeholder={t("enterPhoneNumber")}
                        required
                      />
                      {errors.phoneNo && (
                        <span className="text-danger">{errors.phoneNo}</span>
                      )}
                    </div>
                  </div>

                  {/* </div> <div className="form-group row"> */}
                  <label htmlFor="email" className="col-sm-3   col-form-label">
                    <strong>{t("email")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <div className="col-sm-3">
                    <input
                      type="email"
                      style={{ fontSize: "12px" }}
                      className="form-control"
                      id="email"
                      value={email}
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("enterEmail")}
                      required
                    />
                    {!email.match("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}") &&
                      email.length > 0 && (
                        <div className="error-message">
                          {t("invalidEmailAddress")}
                        </div>
                      )}
                  </div>
                </div>
                <br />
                <div className="form-group row">
                  <label
                    htmlFor="registrationNo"
                    className="col-sm-2 col-form-label"
                  >
                    <strong>{t("registrationNumber")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <div className="col-sm-3">
                    <input
                      type="text"
                      style={{ fontSize: "12px" }}
                      className="form-control"
                      id="registrationNo"
                      value={registrationNo}
                      onChange={(e) => setRegistrationNo(e.target.value)}
                      placeholder={t("enterRegistrationNumber")}
                      required
                    />
                    {errors.registrationNo && (
                      <span className="text-danger">
                        {errors.registrationNo}
                      </span>
                    )}
                  </div>
                  <label htmlFor="address" className="col-sm-3 col-form-label">
                    <strong>{t("address")}</strong>
                  </label>
                  <div className="col-sm-3">
                    <textarea
                      className="form-control"
                      style={{ fontSize: "12px" }}
                      id="address"
                      value={address}
                      required
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t("enterAddress")}
                    />
                  </div>
                </div>
                <br />
                <div className="form-group row">
                  <label htmlFor="username" className="col-sm-2 col-form-label">
                    <strong>{t("username")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <div className="col-sm-3">
                    <input
                      type="text"
                      style={{ fontSize: "12px" }}
                      className="form-control"
                      id="username"
                      value={username}
                      placeholder={t("enterUsername")}
                      onChange={handleUsernameChange}
                      onBlur={handleUsernameChange}
                      required
                    />
                    {errors.username && (
                      <span className="text-danger">{errors.username}</span>
                    )}
                  </div>
                  {/* <div className="form-group row"> */}
                  {/* <label
                    htmlFor="signature"
                    className="col-sm-3 col-form-label"
                  >
                    <strong>Upload Signature </strong>
                  </label>
                  <div style={{ fontSize: "12px" }} className="col-sm-3">
                    <input
                      style={{ fontSize: "12px" }}
                      type="file"
                      accept="image/*"
                      className="form-control"
                      id="signature"
                      onChange={handleSignatureChange}
                    />
                  </div> */}
                </div>
                <br />
                <div className="form-group row">
                                
                  <label htmlFor="doctortype" className="col-sm-2 col-form-label">
                    <strong>{t("doctorType")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <div className="col-sm-3  ">
                    <select
                      className="form-control"
                      id="doctorsType"
                      value={doctorsType}
                      onChange={handleDoctorTypeChange}
                      onBlur={handleDoctorTypeChange}
                      required
                      style={{ fontSize: "12px" }}
                    >
                      <option value="">{t("selectDoctorType")}</option>
                      <option value="internal">{t("Internal")}</option>
                      <option value="external">{t("External")}</option>
                    </select>
                    {errors.doctorType && (
                      <span className="text-danger">{errors.doctorType}</span>
                    )}
                  </div>
                  {
                    doctorsType === "external" && (
                      <>
                        <label
                    htmlFor="referralfee"
                    className="col-sm-3 col-form-label"
                  >
                    <strong>{t("Referral Fee")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <div className="col-sm-3">
                    <div className="input-group">
                      <input
                        type= "text" 
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        id="referralfee"
                        value={referralFee}
                        onChange={handlereferralFee}
                        placeholder={t("referralfee")}
                        required
                      />
                      
                    </div>
                    {errors.confirmPassword && (
                      <span className="text-danger">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                      </>
                    )
                  }
                  {
                    doctorsType === "internal" && (
                      <>
                        <label
                    htmlFor="consultationFee"
                    className="col-sm-3 col-form-label"
                  >
                    <strong>{t("consultation Fee")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <div className="col-sm-3">
                    <div className="input-group">
                      <input
                        type= "text" 
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        id="consultationFee"
                        value={consultationFee}
                        onChange={handleconsultationFee}
                        placeholder={t("consultationFee")}
                        required
                      />
                      
                    </div>
                    {errors.consultationFee && (
                      <span className="text-danger">
                        {errors.consultationFee}
                      </span>
                    )}
                  </div>
                      </>
                    )
                  }
                </div>
                <br />
                <div className="form-group row">
                  <label htmlFor="password" className="col-sm-2 col-form-label">
                    <strong>{t("password")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <div className="col-sm-3">
                    <div className="input-group">
                      <input
                        style={{ fontSize: "12px" }}
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder={t("enterPassword")}
                        required
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <FontAwesomeIcon icon={faEyeSlash} />
                          ) : (
                            <FontAwesomeIcon icon={faEye} />
                          )}
                        </span>
                      </div>
                    </div>
                    {errors.password && (
                      <span className="text-danger">{errors.password}</span>
                    )}
                  </div>

                  <label
                    htmlFor="confirmPassword"
                    className="col-sm-3 col-form-label"
                  >
                    <strong>{t("confirmPassword")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <div className="col-sm-3">
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder={t("confirmPassword")}
                        required
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <FontAwesomeIcon icon={faEyeSlash} />
                          ) : (
                            <FontAwesomeIcon icon={faEye} />
                          )}
                        </span>
                      </div>
                    </div>
                    {errors.confirmPassword && (
                      <span className="text-danger">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>
                <br></br>
                <div className="form-group row">
                  <div className="col-sm-5 offset-sm-5">
                    <button
                      style={{ fontSize: "13px" }}
                      type="submit"
                      className="btn btn-secondary mr-2"
                    >
                      {t("register")}
                    </button>
                  </div>
                  <br />
                </div>
              </form>
              <br />
            </div>
          </div>
        </div>
        <br />
      </div>
    </>
  );
};

export default DoctorRegistration;
