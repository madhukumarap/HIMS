import { useParams, useNavigate } from "react-router-dom";
import mediAiImage from "./mediAi.png";
import backgroundImg from "../Components/Background2.jpg";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Container,
  Form,
  Toast,
  InputGroup,
} from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Translation from "../translations/ForgetPasswordOTP.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const App = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);

    setOTP(""); // Reset OTP field
  };

  const showLoadingToast = () => {
    toast.info(t("Loading"), { autoClose: 5000 });
  };

  const openPasswordModal = () => {
    setShowPasswordModal(true);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setOTP(""); // Reset OTP field
    setNewPassword(""); // Reset new password field
    setConfirmPassword(""); // Reset confirm password field
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleOTPChange = (e) => {
    const otpValue = e.target.value;
    if (otpValue.length <= 6 && /^\d*$/.test(otpValue)) {
      setOTP(otpValue);
    }
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const sendEmailOTP = () => {
    if (!email) {
      toast.error(t("PleaseEnterEmail"));
      return;
    }
    if (email && !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(email)) {
      toast.error(t("EnterValidEmail"));

      return;
    }

    toast.info(t("SendingemailOTPPleasewait"), {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    });

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/${extractedPart}/sendOTP/email`,
        {
          email: email,
          Client: extractedPart,
        }
      )
      .then((response) => {
        console.log("Email sent:", response.data);

        // Hide loading toast
        toast.dismiss();
        openModal();
        toast.success(t("OTPsentsuccessfully"));
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          // Hide loading toast
          toast.dismiss();
          toast.error(t("Enteravalidemail"));
        } else {
          // Hide loading toast
          toast.dismiss();
          toast.error(t("ErrorsendingOTP"));
          console.error("Error sending email:", error);
        }
      });
  };

  const sendUsernameOTP = () => {
    if (username.length < 6) {
      toast.error(t("EnterValidUsername"));
      return;
    }

    toast.info(t("SendingemailOTPPleasewait"), {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    });

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/${extractedPart}/sendOTP/username`,
        {
          username: username,
          Client: extractedPart,
        }
      )
      .then((response) => {
        console.log("Username OTP sent:", response.data);
        //  alert(response.data)
        // Hide loading toast
        toast.dismiss();
        setEmail(response.data);
        openModal();
        toast.success(t("OTPsentsuccessfully"));
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          // Hide loading toast
          toast.dismiss();
          toast.error(t("Enteravalidusername"));
        } else {
          // Hide loading toast
          toast.dismiss();
          toast.error(t("ErrorsendingusernameOTP"));
          console.error("Error sending  OTP:", error);
        }
      });
  };

  const verifyOTPEmail = () => {
    if (!otp) {
      toast.error(t("PleaseEnterOTP"));
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/${extractedPart}/verifyOTP/email`,
        {
          email: email,
          otp: otp,
          Client: extractedPart,
        }
      )
      .then((response) => {
        console.log("Email OTP verified:", response.data);
        closeModal();
        openPasswordModal();
        toast.success(t("OTPverificationsuccessful"));
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setShowToast(true);
          toast.error(t("InvalidOTP"));
        } else {
          setShowToast(true);
          toast.error(t("ErrorverifyingemailOTP"));
          console.error("Error verifying email OTP:", error);
        }
      });
  };

  const verifyOTPUsername = () => {
    if (!otp) {
      toast.error(t("PleaseEnterOTP"));
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/${extractedPart}/verifyOTP/username`,
        {
          username: username,
          otp: otp,
          Client: extractedPart,
        }
      )
      .then((response) => {
        console.log("Username OTP verified:", response.data);
        closeModal();
        openPasswordModal();
        toast.success(t("OTPverificationsuccessful"));
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          toast.error(t("InvalidOTP"));
        } else {
          toast.error(t("ErrorverifyingemailOTP"));
        }
        console.error("Error verifying username OTP:", error);
      });
  };

  const createNewPassword = () => {
    // Validate new password and confirm password

    if (newPassword === "") {
      toast.error(t("PleaseEnterPassword"));
      return;
    }
    if (
      newPassword &&
      !/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}/.test(
        newPassword
      )
    ) {
      toast.error(t("EnterValidPassword"));

      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("Passwordsdonotmatch"));
      return;
    }

    // Send updated password to Node.js
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/${extractedPart}/updatePassword`,
        {
          email: email,
          username: username,
          password: newPassword,
          Client: extractedPart,
        }
      )
      .then((response) => {
        console.log("Password updated successfully:", response.data);
        closePasswordModal();
        toast.success(t("Passwordupdatedsuccessfully"));

        // Reset input fields
        setEmail("");
        setUsername("");
        setNewPassword("");
        setConfirmPassword("");

        // Redirect to login page
        navigate(`/${extractedPart}/login`);
      })
      .catch((error) => {
        toast.error(t("Failedtoupdatepassword"));
        console.error("Error updating password:", error);
      });
  };

  const handleForgotPassword = () => {
    setEmail("");
    setUsername("");
    setShowEmailForm(!showEmailForm);
  };

  return (
    <div
      style={{
        margin: "0px",
        paddingLeft: "0px",
        backgroundImage: `url(${backgroundImg})`,
        fontSize: "12px",
        paddingBottom: "20px",
        marginTop: "-40px",
      }}
    >
      <div
        style={{
          paddingLeft: "0px",
          minHeight: "100vh",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container
          style={{
            maxWidth: "500px",
            backgroundColor: "white",
            border: "1px solid black",
          }}
          className="bg-light-blue container-fluid px-4"
        >
          {" "}
          <h2
            style={{ fontSize: "20px" }}
            className="text-center container-fluid px-4 py-4 bg-light mt-auto"
          >
            {t("PasswordReset")}
          </h2>
          {showEmailForm ? (
            <Form className="mt-4">
              <Form.Label>{t("EnterEmailTogetOTPOnEmail")}</Form.Label>
              <Form.Floating style={{ fontSize: "12px" }} className="mb-3">
                <Form.Control
                  type="email"
                  id="inputEmail"
                  placeholder="name@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  pattern="[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
                  style={{ fontSize: "12px" }}
                  isInvalid={
                    !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(email)
                  }
                  required
                />
                <Form.Label htmlFor="inputEmail">
                  {t("Emailaddress")}
                </Form.Label>
                <Form.Control.Feedback type="invalid">
                  {t("Enteravalidemailaddress")}
                </Form.Control.Feedback>
              </Form.Floating>

              <Button
                variant="secondary"
                style={{ fontSize: "12px" }}
                className="mx-auto d-block"
                onClick={sendEmailOTP}
              >
                {t("SendOTP")}
              </Button>
              <br></br>
              <div style={{ textAlign: "center" }}>
                <p>
                  <Button
                    variant="link"
                    style={{ fontSize: "12px" }}
                    onClick={handleForgotPassword}
                  >
                    {t("ForgotPasswordusingUsername")}
                  </Button>
                </p>
                <p>
                  <Button
                    variant="link"
                    style={{ fontSize: "12px" }}
                    onClick={() => navigate("/login")}
                  >
                    {t("BacktoLogin")}
                  </Button>
                </p>
              </div>
            </Form>
          ) : (
            <Form className="mt-4">
              <Form.Label>{t("EnterUsernameTogetOTPOnEmail")}</Form.Label>

              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  id="inputUsername"
                  placeholder={t("Enterusername")}
                  value={username}
                  onChange={handleUsernameChange}
                />
                <label htmlFor="inputUsername">{t("Username")}</label>
              </Form.Floating>

              <Button
                variant="secondary"
                style={{ fontSize: "12px" }}
                className="mx-auto d-block"
                onClick={sendUsernameOTP}
              >
                {t("SendOTP")}
              </Button>

              <br></br>
              <div style={{ fontSize: "10px", textAlign: "center" }}>
                <p>
                  <Button
                    style={{ fontSize: "12px" }}
                    variant="link"
                    onClick={handleForgotPassword}
                  >
                    {t("ForgotPasswordusingEmail")}
                  </Button>
                </p>
                <p>
                  <Button
                    variant="link"
                    style={{ fontSize: "12px" }}
                    onClick={() => navigate(`/${extractedPart}/login`)}
                  >
                    {t("BacktoLogin")}
                  </Button>
                </p>
              </div>
            </Form>
          )}
          <Modal
            style={{ fontSize: "12px" }}
            show={showModal}
            onHide={closeModal}
            style={{ marginTop: "20px" }}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: "16px" }}>
                {t("WehavesentOTPOnemail")} {email} .
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder={t("EnterOTP")}
                    value={otp}
                    required
                    onChange={handleOTPChange}
                    maxLength={6}
                    style={{
                      border:
                        otp.length < 6 ? "1px solid red" : "1px solid #ced4da",
                    }}
                  />
                  <label>{t("OTP")}</label>
                  {otp.length === 6 && !/^\d*$/.test(otp) && (
                    <span className="text-danger">
                      {t("Onlydigitsareallowed")}
                    </span>
                  )}
                </Form.Floating>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                style={{
                  fontSize: "10px",
                  backgroundColor: "#777777",
                  margintop: "10px",
                  padding: "4px 5px",
                }}
                onClick={closeModal}
              >
                {t("Close")}
              </Button>
              {showEmailForm ? (
                <Button
                  variant="secondary"
                  style={{ fontSize: "10px", padding: "4px 5px" }}
                  onClick={verifyOTPEmail}
                >
                  {t("VerifyOTP")}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  style={{ fontSize: "10px", padding: "4px 5px" }}
                  onClick={verifyOTPUsername}
                >
                  {t("VerifyOTP")}
                </Button>
              )}
            </Modal.Footer>
          </Modal>
          <Modal
            style={{ fontSize: "12px" }}
            show={showPasswordModal}
            onHide={closePasswordModal}
            style={{ marginTop: "20px" }}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: "20px" }}>
                {t("CreateNewPassword")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Floating className="mb-3">
                  <InputGroup>
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      placeholder={t("NewPassword")}
                      style={{ fontSize: "12px" }}
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      isInvalid={
                        !/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}/.test(
                          newPassword
                        )
                      }
                    />
                    <InputGroup.Text onClick={toggleNewPasswordVisibility}>
                      {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {t(
                        "Passwordmustcontainatleastonecapitalletteronespecialcharacteronedigitandhaveminimumlengthof6characters"
                      )}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Floating>

                <Form.Floating className="mb-3">
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("ConfirmPassword")}
                      value={confirmPassword}
                      style={{ fontSize: "12px" }}
                      onChange={handleConfirmPasswordChange}
                      isInvalid={newPassword !== confirmPassword}
                    />
                    <InputGroup.Text onClick={toggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {t("Passworddoesnotmatch")}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Floating>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                style={{ fontSize: "10px", padding: "4px 5px" }}
                onClick={createNewPassword}
              >
                {t("UpdatePassword")}
              </Button>
              <Button
                variant="secondary"
                style={{
                  fontSize: "10px",
                  backgroundColor: "#777777",
                  margintop: "10px",
                  padding: "4px 5px",
                }}
                onClick={closePasswordModal}
              >
                {t("Close")}
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default App;
