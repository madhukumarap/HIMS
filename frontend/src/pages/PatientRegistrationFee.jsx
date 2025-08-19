import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import AuthService from "../services/auth.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Translation from "../translations/PatientRegistrationFee.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const PatientRegistrationFee = () => {
  const [registrationFeeAmount, setRegistrationFeeAmount] = useState();
  const [registrationFeeCurrency, SetRegistrationFeeCurrency] = useState("");
  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentHospital, setCurrentHospital] = useState();
  const [dataEntered, setDataEntered] = useState(false);

  const currentUser = AuthService.getCurrentUser();

  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
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

  async function fetchAndSetHospital() {
    try {
      if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
        // Redirect or show error message when the user is not an admin
        return;
        // You can handle the redirection or error message display as per your requirement
      }
      if (!currentUser || !currentUser.Token) {
        // Handle the case when the user is not logged in
        return;
      }

      console.log("currentUser ", currentUser);
      const token = currentUser.Token;

      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(atob(base64Payload));

      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const REMOTE_URL = `${API_BASE_URL}/api/getHospital/${payload.hospitalID}`;

      const res = await axios.get(REMOTE_URL, {
        headers: {
          Authorization: currentUser?.Token,
        },
      });

      //setRegistrationFeeAmount SetRegistrationFeeCurrency

      const { patientRegistrationFee, patientRegistrationCurrency } =
        res.data.data;
      console.log(
        "patientRegistrationFee , patientRegistrationCurrency",
        patientRegistrationFee,
        patientRegistrationCurrency
      );

      setRegistrationFeeAmount(patientRegistrationFee);
      SetRegistrationFeeCurrency(patientRegistrationCurrency || "");
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchAndSetHospital();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("CurrentUsr: ", currentUser);

    if (!currentUser || !currentUser.Token) {
      // Handle the case when the user is not logged in
      return;
    }

    const token = currentUser.Token;

    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));

    console.log(payload.hospitalID);
    if (!registrationFeeCurrency) {
      toast.error("EnterPatientRegistrationFee");
      return;
    }

    if (!registrationFeeAmount || registrationFeeAmount < 0) {
      toast.error("PleaseFillPatientRegistrationFeeCorrectly");
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const REMOTE_URL = `${API_BASE_URL}/api/updatePatientRegistrationFee/${payload.hospitalID}`;

      const body = {
        patientRegistrationFee: registrationFeeAmount,
        patientRegistrationCurrency: registrationFeeCurrency,
      };

      const response = await axios.post(REMOTE_URL, body, {
        headers: {
          Authorization: currentUser?.Token,
          userDatabase: currentUser?.userDatabase, // Add if required by backend
        },
      });

      console.log("Update response: ", response.data);
      toast.success("Patient Registration Fee updated successfully");
    } catch (error) {
      console.error("Error updating patient registration fee: ", error);
      toast.error("Failed to update Patient Registration Fee");
    }
  };

  if (!currentUser) {
    return "Access Denied";
  }

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    // If the user is not logged in or does not have the admin role,
    // you can show a message or redirect to another page.
    return "Access Denied";
  }

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
    minHeight: "70vh",
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "14px" /* Adjust the font size for <h2> */,
  };

  const currency = ["INR", "USD", "EUR", "CDF"];

  return (
    <div
      style={style}
      className="d-flex align-items-center justify-content-center"
    >
      <Container style={{ maxWidth: "500px" }}>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body>
                {errorMessage && (
                  <span className="text-danger">{errorMessage}</span>
                )}

                <Card.Title style={h2Style}>
                  {t("EnterPatientRegistrationFee")}
                </Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="username">
                    <Form.Label>
                      {t("Amount")}
                      <span
                        style={{
                          fontSize: "12px",
                          color: "red",
                          marginLeft: "5px",
                        }}
                      >
                        *
                      </span>
                      :
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      style={{ fontSize: "12px" }}
                      placeholder={t("EnterRegistrationAmount")}
                      required
                      value={registrationFeeAmount}
                      onChange={(e) => setRegistrationFeeAmount(e.target.value)}
                    />
                  </Form.Group>{" "}
                  <br></br>
                  <Form.Group controlId="role">
                    <Form.Label>
                      {t("Currency")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </Form.Label>
                    <Form.Control
                      as="select"
                      style={{ fontSize: "12px" }}
                      required
                      value={registrationFeeCurrency}
                      onChange={(e) =>
                        SetRegistrationFeeCurrency(e.target.value)
                      }
                    >
                      <option value="">{t("SelectCurrency")}</option>
                      {currency.map((curr, id) => (
                        <option key={id} value={curr}>
                          {curr}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <br></br>
                  {registrationFeeCurrency && registrationFeeAmount != null && (
                    <p>
                      Total:{" "}
                      <strong>{`${registrationFeeCurrency} ${registrationFeeAmount}/-`}</strong>
                    </p>
                  )}
                  <br></br>
                  <div style={{ justifyContent: "center", display: "flex" }}>
                    <Button
                      style={{ fontSize: "12px", padding: "4px 10px" }}
                      variant="secondary"
                      type="submit"
                    >
                      {t("Submit")}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PatientRegistrationFee;
