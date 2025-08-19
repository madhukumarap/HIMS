import { HiEye, HiEyeOff } from "react-icons/hi";
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Table, Modal, FormControl } from "react-bootstrap";
import axios from "axios";
import AuthService from "../services/auth.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Translation from "../translations/DoctorRegistration.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

const PharmacistForm = () => {
  const currentUser = AuthService.getCurrentUser();

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
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNoError, setPhoneNoError] = useState("");

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

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (formData.phoneNo && formData.phoneNo.length < 10) {
      toast.error(t("phoneNumberValidationError"), {
        style: { fontSize: "13px" },
      });
      return;
    }
    if (
      formData.email &&
      !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(formData.email)
    ) {
      toast.error(t("emailValidationError"), {
        style: { fontSize: "13px" },
      });

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
      toast.error(t("usernameValidationError"), {
        style: { fontSize: "13px" },
      });
      return;
    }
    if (
      formData.password &&
      !/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}/.test(
        formData.password
      )
    ) {
      toast.error(t("passwordValidationError"), {
        style: { fontSize: "13px" },
      });
      return;
    }
    if (
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
    ) {
      toast.error(t("Passwordsnotmatch"), {
        style: { fontSize: "13px" },
      });

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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/saveNurse`,
        formData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      console.log(response.data);
      // Handle success

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
        });
      } else {
        toast.error("Failed to save data");
      }
    } catch (error) {
      console.error(error);
      // Handle error
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred");
        }
      } else {
        toast.error("An error occurred");
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    // if (!formData.phoneNo.trim()) {
    //   errors.phoneNo = "Phone number is required";
    // } else if (!/^\d+$/.test(formData.phoneNo.trim())) {
    //   errors.phoneNo = "Phone number must contain only digits";
    // }

    // if (!formData.email.trim()) {
    //     errors.email = 'Email is required';
    // } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
    //     errors.email = 'Invalid email format';
    // }
    // if (!formData.userName.trim()) {
    //     errors.userName = 'Username is required';
    // } else if (formData.userName.length < 6) {
    //     errors.userName = 'Username must be at least 6 characters long';
    // }
    // if (!formData.password.trim()) {
    //     errors.password = 'Password is required';
    // } else if (!/^.*(?=.{6,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).*$/.test(formData.password)) {
    //     errors.password =
    //         'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character';
    // }

    setErrors(errors);
    return errors;
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
    // Redirect or show error message when the user is not an admin or pharmacist
    return "Access Denied";
    // You can handle the redirection or error message display as per your requirement
  }

  const style = {
    width: "100%", // Set width to 100% for mobile view
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "20px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "13px" /* Adjust the font size for <h3> */,
  };

  return (
    <Container style={style}>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("NurseRegistration")}</h2>
      </header>{" "}
      <br />
      <Card className="mt-12">
        <Card.Body>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* <h3 style={h1Style} className="mb-6">
              Nurse Registration
            </h3> */}
            {/* <Link to="/UploadNurseData">
                            <Button style={{ marginTop: '0px', fontSize: '12px' }}>Upload Data</Button>
                        </Link> */}
          </div>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} sm={12} md={4}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                  >
                    <strong>{t("name")}</strong>{" "}
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
                    placeholder={t("enterFirstName")}
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
                    placeholder={t("enterMiddleName")}
                    pattern="[A-Za-z ]+" // Allow only alphabetic characters and spaces
                    title="Only alphabetic characters and spaces are allowed"
                  />
                  {errors.middleName && (
                    <span className="text-danger">{errors.middleName}</span>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Form.Group className="d-flex align-items-center">
                  {/* <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                  >
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
                    placeholder={t("enterLastName")}
                    pattern="[A-Za-z ]+" // Allow only alphabetic characters and spaces
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
                    <strong>{t("phoneNumber")}</strong>{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className={`form-control ${
                        phoneNoError == "case-1" && "is-invalid"
                      }`}
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
                        phoneNoError == "case-2" || phoneNoError == "case-3"
                      }
                      placeholder={t("enterPhoneNumber")}
                    />
                  </div>

                  {/* {formData.phoneNo && formData.phoneNo.length < 10 && (
                    <span className="text-danger">
                      Invalid phone number. Please enter at least 10 digits.
                    </span>
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNo}
                  </Form.Control.Feedback> */}
                </Form.Group>
                <br></br>
                <div style={{ marginLeft: "50px" }}>
                  {/* {formData.phoneNo && formData.phoneNo.length < 10 && (
                    <span className="text-danger">
                      {t("phoneNumberValidationError")}
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
                    <strong>{t("email")}</strong>{" "}
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
                    placeholder={t("enterEmail")}
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
                  />
                  {/* {formData.email &&
                    !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(
                      formData.email
                    ) && <span className="text-danger">Invalid email</span>}
                  {errors.email && (
                    <span className="text-danger">{errors.email}</span>
                  )} */}
                </Form.Group>
                <br></br>
                <div style={{ marginLeft: "50px" }}>
                  {formData.email &&
                    !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(
                      formData.email
                    ) && (
                      <span className="text-danger">
                        {t("invalidEmailAddress")}
                      </span>
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
                    <strong>{t("address")}</strong>
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
                    placeholder="Enter address"
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <br></br>
            <Row>
              <Col xs={12} sm={12} md={12}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                  >
                    <strong>{t("username")}</strong>{" "}
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
                    placeholder={t("enterUsername")}
                  />
                  <br></br>
                  {formData.userName.length < 6 &&
                    formData.userName.length > 0 && (
                      <span
                        style={{ marginLeft: "10px", whiteSpace: "nowrap" }}
                        className="text-danger"
                      >
                        {t("usernamelengtherror")}
                      </span>
                    )}
                  <Form.Control.Feedback type="invalid">
                    {errors.userName}
                  </Form.Control.Feedback>
                </Form.Group>
                <br></br>
                <div style={{ marginLeft: "70px" }}>
                  {formData.userName &&
                    !/[A-Z]/.test(formData.userName) &&
                    /^[a-z][a-z0-9]*$/i.test(formData.userName) && (
                      <span className="text-danger">{t("UsernameError")}</span>
                    )}
                  <Form.Control.Feedback type="invalid">
                    {errors.userName}
                  </Form.Control.Feedback>
                </div>
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                  >
                    <strong>{t("password")}</strong>{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      style={{ fontSize: "12px" }}
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={
                        !!errors.password ||
                        (formData.password &&
                          !/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}/.test(
                            formData.password
                          ))
                      }
                      placeholder={t("enterPassword")}
                      required
                    />
                    <div className="input-group-append">
                      <span
                        className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <HiEyeOff /> : <HiEye />}
                      </span>
                    </div>
                  </div>
                  {/* {formData.password &&
                    !/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}/.test(
                      formData.password
                    ) && (
                      <span className="text-danger">
                        Invalid Password( one capital, one special char,one
                        digit and length should be greater than 6)
                      </span>
                    )}
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback> */}
                </Form.Group>
                <br></br>
                <div style={{ marginLeft: "70px" }}>
                  {formData.password &&
                    !/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}/.test(
                      formData.password
                    ) && (
                      <span className="text-danger">{t("PassWordError")}</span>
                    )}
                </div>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label
                    style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                  >
                    <strong>{t("confirmPassword")}</strong>{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      style={{ fontSize: "12px" }}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={
                        !!errors.confirmPassword ||
                        (formData.confirmPassword &&
                          formData.confirmPassword !== formData.password)
                      }
                      placeholder={t("confirmpassword")}
                      required
                    />
                    <div className="input-group-append">
                      <span
                        className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <HiEyeOff /> : <HiEye />}
                      </span>
                    </div>
                  </div>
                  {/* {formData.confirmPassword &&
                    formData.confirmPassword !== formData.password && (
                      <span className="text-danger">
                        Passwords do not match
                      </span>
                    )}
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback> */}
                </Form.Group>
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
            {/* <Row>
              <Col>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Show Password"
                    onChange={() => setShowPassword(!showPassword)}
                  />
                </Form.Group>
              </Col>
            </Row> */}

            <Row>
              <Col>
                {/* <Button
                                    style={{ fontSize: '12px', textAlign: 'center' }}
                                    variant="secondary"
                                    type="submit"
                                    disabled={Object.keys(errors).length !== 0}
                                >
                                    Save
                                </Button> */}
                <br></br>
                <div className="form-group row">
                  <div className="col-sm-5 offset-sm-5">
                    <Button
                      style={{ fontSize: "13px", textAlign: "center" }}
                      variant="secondary"
                      type="submit"
                      disabled={Object.keys(errors).length !== 0}
                    >
                      {t("register")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PharmacistForm;
