import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";

import Translation from "../translations/Uploadcsv_data.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const UpdatePassword = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const currentUser = AuthService.getCurrentUser();

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

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (password.length > 0 && !passwordValid) {
      toast.error(t("EnterValidPassword"));
      return;
    }
    if (password !== confirmPassword) {
      // setMessage('Passwords do not match');
      toast.error(t("PasswordNotMatch"));
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/${username}`,
        { password },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setMessage(response.data.message);
      toast.success(t("PasswordUpdatedSuccessfully"), {
        position: toast.POSITION.TOP_END,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (
        (error.response && error.response.status === 404) ||
        error.response.data.message === "UserName not found"
      ) {
        setMessage(t("UserNameNotFound"));
        toast.error(t("UserNameNotFound"));
      } else {
        toast.error(t("InternalServerError"));
        setMessage(t("ErrorUpdatingPassword"));
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (value) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return regex.test(value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordValid(validatePassword(e.target.value));
  };

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
    maxWidth: "300px",
    marginTop: "20px",
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "16px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "16px" /* Adjust the font size for <h3> */,
  };

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    // If the user is not logged in or does not have the admin role,
    // you can show a message or redirect to another page.
    return "Access Denied";
  }

  return (
    <div className="container" style={style}>
      <div className="card">
        <div className="card-body">
          {/* {message && <p className="text-success">{message}</p>} */}

          <h5 style={h2Style} className="card-title">
            {t("UpdatePassword")}
          </h5>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                {t("Username")}
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>:
              </label>
              <input
                type="text"
                style={{ fontSize: "12px" }}
                className="form-control"
                id="username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("EnterYourUsername")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                {t("NewPassword")}
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>:
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  value={password}
                  required
                  style={{ fontSize: "12px" }}
                  onChange={handlePasswordChange}
                  placeholder={t("EnterANewPassword")}
                />
                <button
                  style={{ fontSize: "10px" }}
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? t("Hide") : t("Show")}
                </button>
              </div>
              {password.length > 0 && !passwordValid && (
                <div className="error-message">
                  {t(
                    "PasswordMustBeAtLeast6CharactersLongMustContainAtLeastOneUppercaseLetterMustContainAtLeastOneDigitAndMustContainAtLeastOneSpecialCharacter"
                  )}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                {t("ConfirmPassword")}
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>:
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="confirmPassword"
                  style={{ fontSize: "12px" }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("ConfirmYourNewPassword")}
                />
                <button
                  style={{ fontSize: "10px" }}
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {password !== confirmPassword && (
                <span className="text-danger">{t("PasswordsDoNotMatch")}</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: "10px",
                  padding: "4px 5px",
                }}
                type="submit"
                className="btn btn-secondary"
              >
                {t("Update")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
