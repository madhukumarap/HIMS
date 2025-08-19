import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthService from "../services/auth.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiEye, HiEyeOff } from "react-icons/hi";

import Translation from "../translations/HospitalAdministratorRegistration.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const HospitalAdminForm = () => {
  const [hospitalList, setHospitalList] = useState([]);
  const currentUser = AuthService.getCurrentUser();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    phoneNo: "",
    countryCode: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    hospitalId: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNoError, setPhoneNoError] = useState("");

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
    // Fetch hospital data from your Node.js API endpoint
    fetch(`${import.meta.env.VITE_API_URL}/api/getAllHospitals`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setHospitalList(data.data);
        //alert(JSON.stringify(hospitalList));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNo") {
      // Remove any non-digit characters from the input value
      const sanitizedValue = value.replace(/\D/g, "");

      // Check if the sanitized value has already reached 10 digits
      if (
        formData.countryCode == "+55" ||
        formData.countryCode == "+86" ||
        formData.countryCode == "+258"
      ) {
        if (sanitizedValue.length > 12) {
          return;
        }
      } else if (sanitizedValue.length > 10) {
        return;
      }

      // Update the formData state with the sanitized value
      setFormData((prevData) => ({
        ...prevData,
        [name]: sanitizedValue,
      }));
    } else {
      // Update the formData state for other fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const checkValidPhoneNo = (e) => {
    const phoneNo = e.target.value;

    if (formData.countryCode == "" || formData.countryCode == undefined) {
      setPhoneNoError("case-1");
    } else {
      if (
        formData.countryCode == "+55" ||
        formData.countryCode == "+86" ||
        formData.countryCode == "+258"
      ) {
        if (phoneNo.length < 12) {
          setPhoneNoError("case-2");
        } else if (phoneNo.length == 12) {
          setPhoneNoError("");
        }
      } else if (phoneNo.length < 10) {
        setPhoneNoError("case-3");
      } else {
        setPhoneNoError("");
      }
    }
  };

  console.log("phoneNoError", phoneNoError);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (formData.phoneNo && formData.phoneNo.length < 10) {
      toast.error(t("EnterValidPhoneNumber"));
      return;
    }
    if (
      formData.email &&
      !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(formData.email)
    ) {
      toast.error(t("EnterValidEmail"));
      return;
    }
    if (
      (formData.userName &&
        !/[A-Z]/.test(formData.userName) &&
        /^[a-z][a-z0-9]*$/i.test(formData.userName)) ||
      (formData.userName &&
        (!/^(?=.*[A-Z])[A-Za-z][A-Za-z0-9]*$/i.test(formData.userName) ||
          formData.userName.length < 6))
    ) {
      toast.error(t("EnterValidUsername"));
      return;
    }
    if (
      formData.password &&
      !/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}/.test(
        formData.password
      )
    ) {
      toast.error(t("EnterValidPassword"));
      return;
    }
    if (
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
    ) {
      toast.error(t("PasswordNotMatch"));
      return;
    }

    if (!formData.hospitalId) {
      toast.error(t("Pleaseselecthospital"));
      return;
    }

    if (
      phoneNoError == "case-1" ||
      phoneNoError == "case-2" ||
      phoneNoError == "case-3"
    ) {
      toast.error(t("enterValidPhoneNumber"));
      return;
    }

    try {
      // alert(formData.hospitalId);
      // return;
      //formData.hospitalId = 8;
      const token = currentUser.Token;
      // alert(token);
      // return;
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/saveHospitalAdmin`,
        formData,
        config,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      console.log(response.data);

      if (response.status === 200) {
        toast.success(t("Datasavedsuccessfully"));
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          address: "",
          phoneNo: "",
          countryCode: "",
          email: "",
          userName: "",
          password: "",
          confirmPassword: "",
          hospitalId: "",
        });
      } else {
        toast.error(t("Failedtosavedata"));
      }
    } catch (error) {
      console.error(error);

      if (error.response) {
        if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(t("Anerroroccurred"));
        }
      } else {
        toast.error(t("Anerroroccurred"));
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = t("Firstnameisrequired");
    }
    if (!formData.lastName.trim()) {
      errors.lastName = t("Lastnameisrequired");
    }

    if (!formData.phoneNo.trim()) {
      errors.phoneNo = t("Phonenumberisrequired");
    } else if (!/^\d+$/.test(formData.phoneNo.trim())) {
      errors.phoneNo = t("Phonenumbermustcontainonlydigits");
    }

    setErrors(errors);
    return errors;
  };

  if (!currentUser) {
    return "Access Denied";
  }
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_SUPERADMIN")
  ) {
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

  return (
    <Container style={style}>
      {/* <h3 style={{ fontSize: "16px" }} className="mb-4">
        Hospital Administrator Registration
      </h3> */}
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("HospitalAdministratorRegistration")}</h2>
      </header>{" "}
      <br />
      <Card border="dark" className="mt-12">
        <Card.Body>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></div>

          <Form onSubmit={handleSubmit} className="form-inline">
            <Row>
              <Col xs={12} sm={12} md={4}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "8px" }}
                  >
                    <strong>{t("Name")}</strong>{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px" }}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      const charCode = e.which ? e.which : e.keyCode;
                      if (
                        /[0-9~`!@#$%^&*()_+=\-[\]\\';,/{}|\\":<>?]/.test(
                          String.fromCharCode(charCode)
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                    isInvalid={!!errors.firstName}
                    placeholder={t("Enterfirstname")}
                    required
                  />
                  {errors.firstName && (
                    <span className="text-danger">{errors.firstName}</span>
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Form.Group className="d-flex align-items-center">
                  {/* <Form.Label>
                    {" "}
                    <strong>Middle Name</strong>
                  </Form.Label> */}
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px" }}
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      const charCode = e.which ? e.which : e.keyCode;
                      if (
                        /[0-9~`!@#$%^&*()_+=\-[\]\\';,/{}|\\":<>?]/.test(
                          String.fromCharCode(charCode)
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                    placeholder={t("Entermiddlename")}
                    pattern="[A-Za-z ]+"
                    title={t("Onlyalphabeticcharactersandspacesareallowed")}
                  />
                  {errors.middleName && (
                    <span className="text-danger">{errors.middleName}</span>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Form.Group className="d-flex align-items-center">
                  {/* <Form.Label>
                    <strong>Last Name</strong>{" "}
                    <span className="text-danger">*</span>
                  </Form.Label> */}
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px" }}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      const charCode = e.which ? e.which : e.keyCode;
                      if (
                        /[0-9~`!@#$%^&*()_+=\-[\]\\';,/{}|\\":<>?]/.test(
                          String.fromCharCode(charCode)
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                    isInvalid={!!errors.lastName}
                    placeholder={t("Enterlastname")}
                    pattern="[A-Za-z ]+"
                    title="Only alphabetic characters and spaces are allowed"
                    required
                  />
                  {errors.lastName && (
                    <span className="text-danger">{errors.lastName}</span>
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                  >
                    <strong>{t("PhoneNumber")}</strong>{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: "12px", width: "20%" }}
                      value={formData.countryCode}
                      name="countryCode"
                      placeholder="+91"
                      onChange={handleChange}
                      pattern="^\+\d+$"
                      title={t("pleaseenteravalidcountryCode")}
                      required
                    />

                    <Form.Control
                      type="text"
                      className="ms-1"
                      style={{ fontSize: "12px" }}
                      name="phoneNo"
                      required
                      value={formData.phoneNo}
                      onChange={(e) => {
                        handleChange(e);
                        checkValidPhoneNo(e);
                      }}
                      isInvalid={
                        !!errors.phoneNo ||
                        (formData.phoneNo && formData.phoneNo.length < 10)
                      }
                      placeholder={t("Enterphonenumber")}
                    />
                  </div>

                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNo}
                  </Form.Control.Feedback>
                </Form.Group>{" "}
                <br></br>
                <div style={{ marginLeft: "50px" }}>
                  {/* {formData.phoneNo && formData.phoneNo.length < 10 && (
                    <span className="text-danger">
                      {t("InvalidphonenumberPleaseenteratleast10digits")}
                    </span>
                  )} */}
                  <span className="text-danger">
                    {phoneNoError == "case-1" && t("PleaseEnterCountryCode")}
                    {phoneNoError == "case-2" &&
                      t("InvalidPhoneNumberPleaseEnterAtleast12Digits")}
                    {phoneNoError == "case-3" &&
                      t("InvalidphonenumberPleaseenteratleast10digits")}
                  </span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                  >
                    <strong>{t("Email")}</strong>{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    required
                    style={{ fontSize: "12px" }}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={
                      !!errors.email ||
                      (formData.email &&
                        !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(
                          formData.email
                        ))
                    }
                    placeholder={t("Enteremail")}
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
                  />
                </Form.Group>
                <br></br>
                <div style={{ marginLeft: "50px" }}>
                  {formData.email &&
                    !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(
                      formData.email
                    ) && (
                      <span className="text-danger">{t("invalidEmail")}</span>
                    )}
                  {errors.email && (
                    <span className="text-danger">{errors.email}</span>
                  )}
                </div>
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col xs={12} sm={6} md={12}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                  >
                    <strong>{t("Address")}</strong>{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    style={{ fontSize: "12px", marginLeft: "10px" }}
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    isInvalid={!!errors.address}
                    placeholder={t("Enteraddress")}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <br></br>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                  >
                    <strong>{t("Username")}</strong>{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    required
                    style={{ fontSize: "12px" }}
                    value={formData.userName}
                    onChange={handleChange}
                    isInvalid={
                      !!errors.userName ||
                      (formData.userName &&
                        (!/^(?=.*[A-Z])[A-Za-z][A-Za-z0-9]*$/i.test(
                          formData.userName
                        ) ||
                          formData.userName.length < 6))
                    }
                    placeholder={t("Enterusername")}
                  />
                </Form.Group>{" "}
                <br></br>
                <div style={{ marginLeft: "70px" }}>
                  {formData.userName &&
                    !/[A-Z]/.test(formData.userName) &&
                    /^[a-z][a-z0-9]*$/i.test(formData.userName) && (
                      <span className="text-danger">
                        {t("Invalidusernamemustcontainatleastonecapitalletter")}
                      </span>
                    )}
                  <Form.Control.Feedback type="invalid">
                    {errors.userName}
                  </Form.Control.Feedback>
                </div>
              </Col>

              <Col xs={12} sm={6} md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                  >
                    <strong>{t("Hospital")}</strong>{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    style={{ fontSize: "12px" }}
                    name="hospitalId"
                    value={formData.hospitalId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("SelectHospital")}</option>
                    {hospitalList.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.hospitalName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>{" "}
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                  >
                    <strong>{t("Password")}</strong>{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      style={{ fontSize: "12px" }}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t("Enterpassword")}
                      required
                    />
                    <div className="input-group-append">
                      <span
                        className="input-group-text"
                        onClick={handlePasswordToggle}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <HiEyeOff /> : <HiEye />}
                      </span>
                    </div>
                  </div>
                </Form.Group>
                <br></br>
                <div style={{ marginLeft: "70px" }}>
                  {formData.password &&
                    !/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}/.test(
                      formData.password
                    ) && (
                      <span className="text-danger">
                        {t(
                          "InvalidPasswordonecapitalonespecialcharonedigitandlengthshouldbegreaterthan6"
                        )}
                      </span>
                    )}
                </div>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                  >
                    <strong>{t("Confirmpassword")}</strong>{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      style={{ fontSize: "12px" }}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder={t("Confirmpassword")}
                      required
                    />
                    <div className="input-group-append">
                      <span
                        className="input-group-text"
                        onClick={handlePasswordToggle}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <HiEyeOff /> : <HiEye />}
                      </span>
                    </div>
                  </div>
                </Form.Group>{" "}
                <br></br>
                <div style={{ marginLeft: "120px" }}>
                  {" "}
                  {formData.password !== formData.confirmPassword && (
                    <span className="text-danger">
                      {t("Passwordsnotmatch")}
                    </span>
                  )}
                </div>
              </Col>
            </Row>

            <div className="mt-4 text-center">
              <Button
                style={{ fontSize: "12px" }}
                variant="secondary"
                type="submit"
              >
                {t("Register")}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HospitalAdminForm;
