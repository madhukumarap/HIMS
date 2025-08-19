import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";
import Translation from "../translations/PatientRegUI.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { RiContactsBookLine } from "react-icons/ri";

function PrescriptionForm() {
  //  data in  {selectedFirstName}
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("");
  const [currency, setCurrency] = useState("");
  const [Hospitals, setHospitals] = useState([]);
  const [optionalCurrencies, setOptionalCurrencies] = useState([]);
  const [phoneNoError, setPhoneNoError] = useState("");
  const currentUser = AuthService.getCurrentUser();
  const [registrationFeeAmount, setRegistrationFeeAmount] = useState();
  const [registrationFeeCurrency, SetRegistrationFeeCurrency] = useState("");

  console.log(registrationFeeAmount, "xx");

  const { t } = useTranslation();
  const locales = { enIN, fr };
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  useEffect(() => {
    // Fetch hospital data from your Node.js API endpoint
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const REMOTE_URL = `${API_BASE_URL}/api/getAllHospitals/`;

    fetch(REMOTE_URL, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setHospitals(data.data);
        setOptionalCurrencies(data.data[0].OptionalCurrency.split(","));
        console.log(
          "OptionalCurrencies :",
          data.data[0].OptionalCurrency.split(",")
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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
      setCurrency(patientRegistrationCurrency || "");
      setRegistrationFees(patientRegistrationFee);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchAndSetHospital();
  }, []);

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

    // Initialize only once when component mounts
    initializei18n();

    // Remove the setInterval completely
    // No need to keep re-initializing i18n
  }, []); // Empty dependency array ensures this runs only once

  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  const [myData, setMyData] = useState([]);
  const [selectedFirstName, setSelectedFirstName] = useState(null);
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);
  const [aadharId, setAadharId] = useState("");
  const [healthNationalId, setHealthNationalId] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [registrationFees, setRegistrationFees] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentDate, setPaymentDate] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [ageOption, setAgeOption] = useState("");

  const handleKeyDown = (event) => {
    if (error && event.key !== "Backspace") {
      event.preventDefault();
    }
  };

  const { id } = useParams();
  localStorage.removeItem("reloadCounts");

  //patient details
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumberP, setPhoneNumberP] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("0");
  const [height, setHeight] = useState("0");
  const [gender, setGender] = useState("");

  const handleSubmit2 = (event) => {
    event.preventDefault();

    if (
      phoneNoError == "case-1" ||
      phoneNoError == "case-2" ||
      phoneNoError == "case-3"
    ) {
      toast.error(t("pleaseEnterValidPhone"));
      return;
    }
    if (!gender) {
      toast.error(t("pleaseSelectGender"));
      return;
    }
    if (
      !email.match("^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$") &&
      email.length > 0
    ) {
      toast.error(t("pleaseEnterValidEmail"), {
        style: { fontSize: "13px" },
      });
      return;
    }
    if (!address && !city && !state && !pincode) {
      toast.error(t("enterAtLeastOne"));
      return;
    }
    if (!currency) {
      toast.error(t("PleaseSelectCurrency"));
      return;
    }
    if (!registrationFees) {
      toast.error(t("PleaseEnterFees"));
      return;
    }

    if (!paymentStatus) {
      toast.error(t("PleaseSelectPaymentStatus"));
      return;
    }
    if (paymentStatus === "Paid" && !paymentDate) {
      toast.error(t("PleaseSelectPaymentDate"));
      return;
    }

    if (!ageOption) {
      toast.error(t("pleaseSelectAgeType"));
      return;
    }
    if (!maritalStatus) {
      toast.error(t("pleaseSelectMaritalStatus"));
      return;
    }
    if (!height) {
      setHeight("0");
    }
    if (!weight) {
      setWeight("0");
    }
    const patientData = {
      countryCode,
      mr,
      firstName,
      middleName,
      lastName,
      phoneNumberP,
      email,
      gender,
      age,
      weight,
      city,
      state,
      pincode,
      address,
      height,
      FirstName,
      MiddleName,
      LastName,
      PhoneNo,
      RegistrationNo,
      DoctorEmail,
      doctor_Id,
      aadharId,
      healthNationalId,
      hospitalId: currentUser.hospitalId,
      registrationFees,
      paymentStatus,
      paymentDate,
      maritalStatus,
      bloodGroup,
      ageOption,
      Currency: currency,
    };

    // alert(JSON.stringify(currentUser));
    // return;

    axios
      .post(`${import.meta.env.VITE_API_URL}/api/paitentRegui`, patientData, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        console.log(response);
        // return;
        toast.success(t("patientSavedSuccessfully"), {
          position: toast.POSITION.TOP_END, // Set position to top center
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        //  return;
        navigate(`/${extractedPart}/PatientListCounter`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [mr, setMr] = useState("");
  const [FirstName, setFirstNameD] = useState("");
  const [MiddleName, setMiddleNameD] = useState("");
  const [LastName, setLastNameD] = useState("");
  const [RegistrationNo, setRegistrationNoD] = useState("");
  const [PhoneNo, setPhoneNoD] = useState("");
  const [DoctorEmail, setDoctorEmail] = useState("");

  const [doctor_Id, setDoctorID] = useState("");

  const handleFirstNameChange2 = (selectedOption) => {
    if (selectedOption === null) {
      setSelectedFirstName(null);
      setDoctorID("");
      setFirstNameD("");
      setMiddleNameD("");
      setLastNameD("");
      setPhoneNoD("");
      setRegistrationNoD("");
    } else {
      const selectedName = myData.find(
        (name) => name.FirstName === selectedOption.value
      );
      setDoctorID(selectedName.id);
      setFirstNameD(selectedName.FirstName);
      setMiddleNameD(selectedName.MiddleName);
      setLastNameD(selectedName.LastName);
      setPhoneNoD(selectedName.phoneNo);
      setDoctorEmail(selectedName.email);
      setRegistrationNoD(selectedName.registrationNo);
      setSelectedFirstName(selectedOption);
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const validatePhoneNumber = (phoneNumberP) => {
    const phoneNumberRegex = /^[6-9]\d{9}$/; // Regular expression for Indian phone number validation
    setError2(!phoneNumberRegex.test(phoneNumberP));
  };

  const handlePhoneNumberChange = (event) => {
    const enteredValue = event.target.value;
    const sanitizedValue = enteredValue.replace(/\D/g, "");
    // Check if the sanitized value has already reached 10 digits
    if (countryCode == "+55" || countryCode == "+86" || countryCode == "+258") {
      if (sanitizedValue.length > 12) {
        return;
      }
    } else if (sanitizedValue.length > 10) {
      return;
    }
    setPhoneNumberP(sanitizedValue);
    validatePhoneNumber(sanitizedValue);
  };

  const checkValidPhoneNo = (e) => {
    const phoneNo = e.target.value;

    if (countryCode == "" || countryCode == undefined) {
      setPhoneNoError("case-1");
    } else {
      if (
        countryCode == "+55" ||
        countryCode == "+86" ||
        countryCode == "+258"
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

  const handleBlur = () => {
    if (phoneNumberP.length !== 10) {
      setError2(true);
    }
  };

  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser) {
    return "Access Denied";
  }
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_RECEPTIONIST") &&
    !currentUser.roles.includes("ROLE_DOCTOR")
  ) {
    return "Access Denied";
  }

  const style = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    fontSize: "12px",
  };

  const h1Style = {
    fontSize: "16px",
  };

  const h2Style = {
    fontSize: "14px",
  };

  const h3Style = {
    fontSize: "16px",
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
          <h2 style={h1Style}>{t("patientRegistration")}</h2>
        </header>
        <br></br>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link
            to={`/${extractedPart}/UploadPatientMasterData`}
            style={{
              fontSize: "12px",
              padding: "4px 5px",
              marginRight: "10px",
            }}
          >
            <Button
              variant="secondary"
              style={{
                fontSize: "12px",
                padding: "4px 5px",
              }}
            >
              {t("uploadPatientData")}
            </Button>
          </Link>
        </div>
        <br></br>
        <form onSubmit={handleSubmit2}>
          <div className="container">
            {/* <h4 style={h2Style}>Patient Details</h4> */}
            <div style={{ border: "1px solid black", padding: "20px" }}>
              <fieldset>
                <div className="row">
                  <div className="row">
                    <div className="col-md-2">
                      <strong>
                        {t("patientsName")}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </strong>
                    </div>

                    <div className="col-md-1">
                      <div className="form-group">
                        <select
                          required
                          className="form-control"
                          style={{ fontSize: "12px" }}
                          value={mr}
                          onChange={(event) => setMr(event.target.value)}
                        >
                          <option value="">{t("select")}</option>
                          <option value={t("Mr")}>{t("Mr")}</option>
                          {/* <option value="Mr's">Mr's</option> */}
                          <option value={t("Mrs")}>{t("Mrs")}</option>
                          <option value={t("Ms")}>{t("Ms")}</option>
                          <option value={t("Ma")}>{t("Ma")}</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <input
                          type="text"
                          required
                          style={{ fontSize: "12px" }}
                          placeholder={t("enterPatientFirstName")}
                          className="form-control"
                          value={firstName}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            const regex = /^[a-zA-Z]*$/; // Only allows letters (both upper and lower case)

                            if (regex.test(inputValue) || inputValue === "") {
                              setFirstName(inputValue);
                            }
                          }}
                          onKeyDown={handleKeyDown}
                        />

                        {error && (
                          <span className="text-danger">
                            {t("onlycharactersareAllowed")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <input
                          type="text"
                          style={{ fontSize: "12px" }}
                          placeholder={t("enterPatientMiddleName")}
                          className="form-control"
                          value={middleName}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            const regex = /^[a-zA-Z]*$/; // Only allows letters (both upper and lower case)

                            if (regex.test(inputValue) || inputValue === "") {
                              setMiddleName(inputValue);
                            }
                          }}
                          onKeyDown={handleKeyDown}
                        />

                        {error && (
                          <span className="text-danger">
                            {t("numbersarenotAllowed")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <input
                          type="text"
                          required
                          style={{ fontSize: "12px" }}
                          placeholder={t("enterPatientLastName")}
                          className="form-control"
                          value={lastName}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            const regex = /^[a-zA-Z]*$/; // Only allows letters (both upper and lower case)

                            if (regex.test(inputValue) || inputValue === "") {
                              setLastName(inputValue);
                            }
                          }}
                          onKeyDown={handleKeyDown}
                        />

                        {error && (
                          <span className="text-danger">
                            {t("onlycharactersareAllowed")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <br></br>
                </div>

                <br></br>
                <div className="row">
                  <div className="col-md-2">
                    <strong>
                      {" "}
                      {t("phoneNumber")}
                      <span style={{ color: "red", marginLeft: "5px" }}>
                        *
                      </span>{" "}
                    </strong>{" "}
                  </div>

                  <div className="col-md-1">
                    <div>
                      <input
                        type="text"
                        className={`form-control ${
                          phoneNoError == "case-1" && "is-invalid"
                        }`}
                        style={{ fontSize: "12px" }}
                        value={countryCode}
                        placeholder="+91"
                        onChange={(e) => setCountryCode(e.target.value)}
                        pattern="^\+\d+$"
                        title={t("pleaseenteravalidcountryCode")}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="text"
                        required
                        style={{ fontSize: "12px" }}
                        placeholder={t("enterPatientContactNumber")}
                        className={`form-control ${
                          phoneNoError == "case-2" && "is-invalid"
                        } ${phoneNoError == "case-3" && "is-invalid"}`}
                        value={phoneNumberP}
                        onChange={(e) => {
                          handlePhoneNumberChange(e);
                          checkValidPhoneNo(e);
                        }}
                        onBlur={handleBlur}
                      />
                      {/* {error2 && (
                        <span className="text-danger">
                          {t("invalidPhoneNumber")}
                        </span>
                      )} */}
                      <span
                        className="text-danger"
                        style={{ fontSize: "12px" }}
                      >
                        {phoneNoError == "case-1" &&
                          t("PleaseEnterCountryCode")}
                        {phoneNoError == "case-2" &&
                          t("InvalidPhoneNumberPleaseEnterAtleast12Digits")}
                        {phoneNoError == "case-3" &&
                          t("InvalidphonenumberPleaseenteratleast10digits")}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-1">
                    {" "}
                    <strong>{t("emailID")}</strong>{" "}
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      {/* <label>Email ID:</label> */}
                      <input
                        style={{ fontSize: "12px" }}
                        type="email"
                        placeholder={t("enterEmailID")}
                        className="form-control"
                        value={email}
                        pattern="^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                        onChange={(event) => setEmail(event.target.value)}
                      />
                      {!email.match(
                        "^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                      ) &&
                        email.length > 0 && (
                          <div className="error-message">
                            {t("invalidemailAddress")}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="col-md-1">
                    {" "}
                    <strong>
                      {t("gender")}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </strong>{" "}
                  </div>
                  <div className="col-md-2 form-group">
                    <div>
                      <label className="form-check-inline mr-4">
                        <input
                          className="form-check-input"
                          type="radio"
                          required
                          value="male"
                          checked={gender === "male"}
                          onChange={handleGenderChange}
                          style={{ marginRight: "0.5rem" }}
                        />
                        {t("male")}
                      </label>
                      <label className="form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          required
                          value="female"
                          checked={gender === "female"}
                          onChange={handleGenderChange}
                          style={{ marginRight: "0.5rem" }}
                        />
                        {t("female")}
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>
              <br></br>
              <div className="row">
                <div className="col-md-2">
                  <strong>
                    {t("age")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </strong>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    {/* <label>First Name:</label> */}
                    <input
                      style={{ fontSize: "12px" }}
                      type="text"
                      required
                      placeholder={t("enterPatientAge")}
                      className="form-control"
                      value={age}
                      onChange={(event) => {
                        const enteredValue = event.target.value;
                        // Remove any non-digit characters from the entered value
                        const sanitizedValue = enteredValue.replace(/\D/g, "");
                        // Limit the value to 10 digits
                        const limitedValue = sanitizedValue.slice(0, 3);
                        // Update the state with the limited value
                        setAge(limitedValue);
                      }}
                    />
                  </div>
                </div>
                {/* Age Option */}
                {/* <div className="col-md-2">
                    <strong>Age Option</strong>
                  </div> */}
                <div className="col-md-1">
                  <div className="form-group">
                    <select
                      className="form-control"
                      style={{ fontSize: "12px" }}
                      value={ageOption}
                      onChange={(event) => setAgeOption(event.target.value)}
                    >
                      <option value="">{t("select")}</option>
                      <option value={t("day")}>{t("day")}</option>
                      <option value={t("month")}>{t("month")}</option>
                      <option value={t("year")}>{t("year")}</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-1">
                  <strong>{t("weightkg")}</strong>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    {/* <label>First Name:</label> */}
                    <input
                      style={{ fontSize: "12px" }}
                      type="text"
                      placeholder={t("enterweightinKg")}
                      className="form-control"
                      value={weight}
                      onChange={(event) => {
                        const enteredValue = event.target.value;
                        // Remove any non-digit characters from the entered value
                        const sanitizedValue = enteredValue.replace(/\D/g, "");
                        // Limit the value to 10 digits
                        const limitedValue = sanitizedValue.slice(0, 3);
                        // Update the state with the limited value
                        setWeight(limitedValue);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-1">
                  <strong>{t("heightcm")}</strong>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    {/* <label>First Name:</label> */}
                    <input
                      style={{ fontSize: "12px" }}
                      type="number"
                      placeholder={t("enterHeightincm")}
                      className="form-control"
                      value={height}
                      onChange={(event) => {
                        const enteredValue = event.target.value;
                        // Remove any non-digit characters from the entered value
                        const sanitizedValue = enteredValue.replace(/\D/g, "");
                        // Limit the value to 10 digits
                        const limitedValue = sanitizedValue.slice(0, 3);
                        // Update the state with the limited value
                        setHeight(limitedValue);
                      }}
                    />
                  </div>
                </div>
                <br></br>
                <br></br>
                <br></br>
                {/* Marital Status */}
                <div className="row">
                  <div className="col-md-2">
                    <strong>
                      {t("maritalStatus")}{" "}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </strong>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <select
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        value={maritalStatus}
                        onChange={(event) =>
                          setMaritalStatus(event.target.value)
                        }
                      >
                        <option value="">{t("selectMaritalStatus")}</option>
                        <option value={t("single")}>{t("single")}</option>
                        <option value={t("married")}>{t("married")}</option>
                      </select>
                    </div>
                  </div>

                  {/* Blood Group */}

                  <div className="col-md-2">
                    <strong>{t("bloodGroup")}</strong>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        placeholder={t("enterBloodGroup")}
                        className="form-control"
                        value={bloodGroup}
                        onChange={(event) => setBloodGroup(event.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "15px" }} className="row">
                  <div className="col-md-2">
                    <strong>{t("aadharID")}</strong>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        placeholder={t("enterAadharID")}
                        className="form-control"
                        value={aadharId}
                        onChange={(event) => setAadharId(event.target.value)}
                        pattern="\d{12}"
                      />
                      {aadharId.length > 0 && !aadharId.match(/^\d{12}$/) && (
                        <span className="text-danger">
                          {t("aadharIDmustbe12digits")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-2">
                    <strong>{t("healthNationalID")}</strong>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        placeholder={t("enterHealthNationalID")}
                        className="form-control"
                        value={healthNationalId}
                        onChange={(event) =>
                          setHealthNationalId(event.target.value)
                        }
                        pattern="\d{16}"
                      />
                      {healthNationalId.length > 0 &&
                        !healthNationalId.match(/^\d{16}$/) && (
                          <span className="text-danger">
                            {t("healthNationalIDmustbe16Digits")}
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="col-md-1">
                    <strong>{t("address")} </strong>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <textarea
                        style={{ fontSize: "12px" }}
                        placeholder={t("enterAddress")}
                        className="form-control"
                        value={address}
                        rows="1"
                        onChange={(event) => setAddress(event.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <br></br> <br></br>
                <div style={{ marginTop: "15px" }} className="row">
                  <div className="col-md-2">
                    <strong>{t("city")}</strong>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        placeholder={t("enterCity")}
                        className="form-control"
                        value={city}
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          const regex = /^[a-zA-Z\s]*$/; // Only allows letters and spaces

                          if (regex.test(inputValue) || inputValue === "") {
                            setCity(inputValue);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-1">
                    <strong>{t("state")}</strong>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        style={{ fontSize: "12px" }}
                        type="text"
                        placeholder={t("enterState")}
                        className="form-control"
                        value={state}
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          const regex = /^[a-zA-Z\s]*$/; // Only allows letters and spaces

                          if (regex.test(inputValue) || inputValue === "") {
                            setState(inputValue);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-1">
                    <strong>{t("pincode")}</strong>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        placeholder={t("enterPincode")}
                        className="form-control"
                        value={pincode}
                        onChange={(event) => {
                          const inputValue = event.target.value;

                          if (
                            /^\d{0,6}$/.test(inputValue) &&
                            !/(\d)\1{5,}/.test(inputValue)
                          ) {
                            setPincode(inputValue);
                          }
                        }}
                      />

                      {pincode.length > 0 && !pincode.match(/^\d{4,6}$/) && (
                        <span className="text-danger">
                          {t("pincodeMustBe4To6Digits")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  style={{ marginTop: "15px" }}
                  className="row align-items-center"
                >
                  {/* Registration Fees */}
                  <div className="col-md-2">
                    <strong>
                      {t("registrationFees")}{" "}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </strong>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <Form.Group controlId="amount">
                        <input
                          type="text"
                          style={{ fontSize: "12px" }}
                          className="form-control"
                          value={`${registrationFeeCurrency} ${
                            registrationFeeAmount || 0
                          }`}
                          disabled
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="col-md-2">
                    <strong>
                      {t("paymentStatus")}{" "}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </strong>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <select
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        value={paymentStatus}
                        onChange={(event) =>
                          setPaymentStatus(event.target.value)
                        }
                      >
                        <option value="">{t("selectStatus")}</option>
                        <option value={t("paid")}>{t("paid")}</option>
                        <option value={t("notPaid")}>{t("notPaid")}</option>
                      </select>
                    </div>
                  </div>

                  {/* Payment Date */}
                  <div className="col-md-2">
                    <strong>
                      {t("paymentDate")}{" "}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </strong>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="date"
                        style={{ fontSize: "12px" }}
                        className="form-control"
                        value={paymentDate}
                        onChange={(event) => setPaymentDate(event.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>{" "}
              <br></br>
              <br></br>
              <div style={{ textAlign: "center" }}>
                <button
                  style={{
                    fontSize: "13px",
                    textAlign: "center",
                    padding: "5px 6px",
                  }}
                  type="submit"
                  className="btn btn-secondary bt-sm"
                >
                  {t("register")}
                </button>
              </div>
            </div>
            <br></br>
          </div>
          <br></br>
        </form>
      </div>
    </>
  );
}
export default PrescriptionForm;
