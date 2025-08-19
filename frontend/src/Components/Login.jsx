import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Modal, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiEye, HiEyeOff } from "react-icons/hi";
import mediAiImage from "./mediAi.png";
import backgroundImg from "../Components/Background2.jpg";

import Translation from "../translations/Login.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

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
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  useEffect(() => {
    // Check if user is already logged in
    if (AuthService.getCurrentUser()) {
      navigate(`/${extractedPart}/`); // Redirect to the home page
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    AuthService.login(username, password)
      .then((data) => {
        if (data.Token) {
          toast.success(t("LoginSuccessful"), {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            navigate(`/${extractedPart}/`);
            window.location.reload();
          }, 1500);
          //  window.location.reload();
        } else {
          setMessage("Login failed");
        }
      })
      .catch((error) => {
        console.log("LogingError :", error.response.data.message);
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleForgotPassword = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const style = {
    width: "100%",
    height: "100vh",
    margin: "0 auto",

    fontSize: "13px",
    backgroundImage: `url(${backgroundImg})`,
    marginTop: "-60px",
    paddingTop: "0px",
  };

  const h1Style = {
    fontSize: "24px",
  };

  const h2Style = {
    fontSize: "20px",
  };

  const h3Style = {
    fontSize: "16px",
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div style={style} className="row d-flex justify-content-center">
      <Container
        fluid
        className="vh-100 d-flex justify-content-center align-items-center"
      >
        <div className="col-md-3">
          <Card
            style={{
              border: "1px solid #ccc",
              marginTop: "0",
            }}
          >
            <Card.Body>
              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
              <h5 style={h1Style} className="card-title text-center">
                {t("LogIn")}
              </h5>
              <Form onSubmit={handleLogin}>
                <div className="form-floating mb-3">
                  <Form.Control
                    type="text"
                    style={{ fontSize: "13px" }}
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t("Enteryourusername")}
                    required
                  />
                  <label htmlFor="username">
                    {t("Username")} <span style={{ color: "red" }}> *</span>
                  </label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Form.Control
                    type={passwordVisible ? "text" : "password"}
                    style={{ fontSize: "13px" }}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("Enteryourpassword")}
                    required
                  />
                  <label htmlFor="password">
                    {t("Password")}
                    <span style={{ color: "red" }}> *</span>
                  </label>
                  <div
                    className="password-toggle-icon"
                    onClick={togglePasswordVisibility}
                    style={{ marginLeft: "-30px" }}
                  >
                    {passwordVisible ? (
                      <HiEyeOff size={18} />
                    ) : (
                      <HiEye size={18} />
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="secondary"
                    type="submit"
                    disabled={loading}
                    block
                    style={{ fontSize: "13px" }}
                  >
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>{t("Login")}</span>
                  </Button>
                  <Button
                    style={{ fontSize: "13px", marginLeft: "10px" }}
                    variant="secondary"
                    as={Link}
                    to={`/${extractedPart}/ForgetPasswordOTP`}
                    block
                  >
                    {t("ForgotPassword")}
                  </Button>
                </div>
              </Form>
              <br />
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Login;
