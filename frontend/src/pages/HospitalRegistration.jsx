import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import AuthService from "../services/auth.service";
import Select from "react-select";
import Translation from "../translations/HospitalRegistration.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { AES, enc, SHA256 } from "crypto-js";

const HospitalManagement = () => {
  const currentUser = AuthService.getCurrentUser();
  const [hospitalUserName, setHospitalUserName] = useState("");
  const SECRET_KEY = "your-secret-key";
  const encryptData = (data) => {
    const encryptedData = AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY
    ).toString();
    return encryptedData;
  };

  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  // Registration form state
  const [hospitalName, setHospitalName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNoError, setPhoneNoError] = useState("");
  const [landline, setLandline] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [logo, setLogo] = useState(null);
  const [hospitalAdminEmail, setHospitalAdminEmail] = useState("");
  const [baseCurrency, setBaseCurrency] = useState(hospitals[0]?.baseCurrency);
  const [baseCurrencyStatus, setBaseCurrencyStatus] = useState(
    hospitals[0]?.baseCurrencyStatus
  );
  const [OptionalCurrency, setOptionalCurrency] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const currencyData = [
    "USD",
    "AED",
    "AFN",
    "ALL",
    "AMD",
    "ANG",
    "AOA",
    "ARS",
    "AUD",
    "AWG",
    "AZN",
    "BAM",
    "BBD",
    "BDT",
    "BGN",
    "BHD",
    "BIF",
    "BMD",
    "BND",
    "BOB",
    "BRL",
    "BSD",
    "BTN",
    "BWP",
    "BYN",
    "BZD",
    "CAD",
    "CDF",
    "CHF",
    "CLP",
    "CNY",
    "COP",
    "CRC",
    "CUP",
    "CVE",
    "CZK",
    "DJF",
    "DKK",
    "DOP",
    "DZD",
    "EGP",
    "ERN",
    "ETB",
    "EUR",
    "FJD",
    "FKP",
    "FOK",
    "GBP",
    "GEL",
    "GGP",
    "GHS",
    "GIP",
    "GMD",
    "GNF",
    "GTQ",
    "GYD",
    "HKD",
    "HNL",
    "HRK",
    "HTG",
    "HUF",
    "IDR",
    "ILS",
    "IMP",
    "INR",
    "IQD",
    "IRR",
    "ISK",
    "JEP",
    "JMD",
    "JOD",
    "JPY",
    "KES",
    "KGS",
    "KHR",
    "KID",
    "KMF",
    "KRW",
    "KWD",
    "KYD",
    "KZT",
    "LAK",
    "LBP",
    "LKR",
    "LRD",
    "LSL",
    "LYD",
    "MAD",
    "MDL",
    "MGA",
    "MKD",
    "MMK",
    "MNT",
    "MOP",
    "MRU",
    "MUR",
    "MVR",
    "MWK",
    "MXN",
    "MYR",
    "MZN",
    "NAD",
    "NGN",
    "NIO",
    "NOK",
    "NPR",
    "NZD",
    "OMR",
    "PAB",
    "PEN",
    "PGK",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "QAR",
    "RON",
    "RSD",
    "RUB",
    "RWF",
    "SAR",
    "SBD",
    "SCR",
    "SDG",
    "SEK",
    "SGD",
    "SHP",
    "SLE",
    "SLL",
    "SOS",
    "SRD",
    "SSP",
    "STN",
    "SYP",
    "SZL",
    "THB",
    "TJS",
    "TMT",
    "TND",
    "TOP",
    "TRY",
    "TTD",
    "TVD",
    "TWD",
    "TZS",
    "UAH",
    "UGX",
    "UYU",
    "UZS",
    "VES",
    "VND",
    "VUV",
    "WST",
    "XAF",
    "XCD",
    "XDR",
    "XOF",
    "XPF",
    "YER",
    "ZAR",
    "ZMW",
    "ZWL",
  ];

  let [currencyOptions, setCurrencyOptions] = useState([]);

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

      let data = currencyData.map((currency) => {
        return {
          value: currency,
          label: currency,
        };
      });

      setCurrencyOptions(data);
    };

    initializei18n();
  }, []);

  ///

  const handleDeleteButtonClick = (hospital) => {
    setSelectedHospital(hospital);
    setShowDeleteModal(true); // Open the delete confirmation modal
  };

  const handleConfirmDelete = async () => {
    try {
      // Send a DELETE request to your Node.js API to delete the hospital
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/deleteHospital/${selectedHospital.id}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      setShowDeleteModal(false);
      toast.success(t("deletedSuccessFully"));
      fetch(`${import.meta.env.VITE_API_URL}/api/getAllHospitals`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setHospitals(data.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const [editingHospital, setEditingHospital] = useState(null);
  // Inside the handleEditButtonClick function:
  const handleEditButtonClick = (hospital) => {
    // alert(hospital?.HospitalUserName);
    const optionalCurrencies = hospital.OptionalCurrency.split(",");
    const optionalCurrencyOptions = optionalCurrencies.map((currency) => ({
      value: currency,
      label: currency,
    }));
    setHospitalUserName(hospital?.HospitalUserName);
    setEditingHospital(hospital);
    setAddress(hospital.address);
    setEmail(hospital.email);
    setPhone(hospital.phone);
    setCountryCode(hospital.countryCode);
    setRegistrationNo(hospital.registrationNo);
    setLandline(hospital.landline);
    setHospitalName(hospital.hospitalName); // Populate form fields with existing data
    setAddress(hospital.address);
    setPincode(hospital.pincode);
    setHospitalAdminEmail(hospital.hospitalAdminEmail);
    setBaseCurrency(hospital.baseCurrency);
    //  alert(hospital?.OptionalCurrency.split(","));
    setOptionalCurrency(optionalCurrencyOptions);
    setBaseCurrencyStatus(hospital.baseCurrencyStatus);
    setSecurityDeposit(hospital.securityDeposit);
    // Populate other form fields as needed
    setShowModal(true);
  };

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    hospitalName: "",
    address: "",
    city: "",
    pincode: "",
    registrationNo: "",
    email: "",
    phone: "",
    landline: "",
    baseCurrency: "",
  });

  useEffect(() => {
    // Fetch hospital data from your Node.js API endpoint
    fetch(`${import.meta.env.VITE_API_URL}/api/getAllHospitals`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setHospitals(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleViewLogo = (hospital) => {
    setSelectedHospital(hospital);
    setShowModal2(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
  };

  const currencyData1 = OptionalCurrency.map((currency) => currency.value);

  console.log("currencyData :", currencyData1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate input based on the field name
    let errorMessage = "";
    switch (name) {
      case "hospitalName":
        errorMessage = !value.match(/^[A-Za-z\s-]+$/)
          ? "Please enter a valid hospital name"
          : "";
        break;
      case "address":
        errorMessage = !value.match(/^[A-Za-z0-9\s,.-]+$/)
          ? "Please enter a valid address"
          : "";
        break;
      case "city":
        errorMessage = !value.match(/^[A-Za-z\s-]+$/)
          ? "Please enter a valid city"
          : "";
        break;
      case "hospitalUserName":
        errorMessage = !value.match(/^[A-Za-z]+$/)
          ? "Only letters are allowed"
          : "";
        break;
      case "pincode":
        errorMessage = !value.match(/^\d{4,6}$/)
          ? "Please enter a valid 4-6 digit pincode"
          : "";
        break;
      case "registrationNo":
        errorMessage =
          value.trim() === "" ? "Please enter a registration number" : "";
        break;
      case "email":
        errorMessage = !value.match(/^\S+@\S+\.\S+$/)
          ? "Please enter a valid email address"
          : "";
        break;
      // case "phone":
      //   errorMessage = !value.match(/^\d{10}$/)
      //     ? "Please enter a valid 10-digit phone number"
      //     : "";
      //   break;
      case "hospitalAdminEmail":
        errorMessage = !value.match(/^\S+@\S+\.\S+$/)
          ? "Please enter a valid hospital Administrator email address"
          : "";
        break;
      default:
        break;
    }

    // Update the state with the validation error
    setValidationErrors({ ...validationErrors, [name]: errorMessage });

    // Update the input field value
    if (name === "phone") {
      // Remove any non-digit characters from the input value
      const sanitizedValue = value.replace(/\D/g, "");

      // Check if the sanitized value has already reached 10 digits
      if (
        countryCode == "+55" ||
        countryCode == "+86" ||
        countryCode == "+258"
      ) {
        if (sanitizedValue.length > 12) {
          return;
        }
      } else if (sanitizedValue.length > 10) {
        return;
      }
    }
    switch (name) {
      case "hospitalName":
        setHospitalName(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "city":
        setCity(value);
        break;
      case "pincode":
        setPincode(value);
        break;
      case "registrationNo":
        setRegistrationNo(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "landline":
        setLandline(value);
        break;
      case "hospitalAdminEmail":
        setHospitalAdminEmail(value);
        break;
      default:
        break;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any validation errors exist
    for (const key in validationErrors) {
      if (validationErrors[key]) {
        toast.error(t("pleaseFixTheValidationErrorsBeforeSubmittingTheForm"), {
          style: { fontSize: "13px" },
        });
        return;
      }
    }
    if (!hospitalAdminEmail.match(/^\S+@\S+\.\S+$/)) {
      toast.error(t("enterValidHospitalAdministratorEmail"));
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

    //return;
    // const currencyData = OptionalCurrency.map((currency)=> currency.value)

    const formData = new FormData();
    formData.append("hospitalName", hospitalName);
    formData.append("hospitalUserName", hospitalUserName);

    formData.append("address", address);
    formData.append("city", city);
    formData.append("pincode", pincode);
    formData.append("registrationNo", registrationNo);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("countryCode", countryCode);
    formData.append("landline", landline);
    formData.append("hospitalAdminEmail", hospitalAdminEmail);
    formData.append("baseCurrency", baseCurrency);
    formData.append("OptionalCurrency", currencyData1);
    formData.append("baseCurrencyStatus", baseCurrencyStatus);
    formData.append("securityDeposit", securityDeposit);

    if (logo) {
      formData.append("logo", logo);
    }
    formData.hospitalAdminEmail = hospitalAdminEmail;
    //alert(formData.hospitalAdminEmail);

    try {
      if (editingHospital) {
        // If editingHospital is defined, it means we're updating an existing hospital
        // Append the hospital ID to the URL for updating
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/updateHospital/${editingHospital.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${currentUser?.Token}`,
            },
          }
        );

        // Update the hospital in the local state
        const updatedHospital = response.data.data;
        setHospitals((prevHospitals) => {
          const updatedHospitals = prevHospitals.map((hospital) =>
            hospital.id === updatedHospital.id ? updatedHospital : hospital
          );
          return updatedHospitals;
        });
        currentUser.baseCurrency = baseCurrency;
        const encryptedUser = encryptData(currentUser);
        const checksum = SHA256(encryptedUser).toString();
        sessionStorage.setItem("user", encryptedUser);
        sessionStorage.setItem("checksum", checksum);
        toast.success(response.data.message, {
          style: { fontSize: "13px" },
        });
      } else {
        // If editingHospital is not defined, it means we're creating a new hospital
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/createHospital`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${currentUser?.Token}`,
            },
          }
        );

        // Add the newly created hospital to the local state
        const newHospital = response.data.data;
        setHospitals((prevHospitals) => [...prevHospitals, newHospital]);

        toast.success(response.data.message, {
          style: { fontSize: "13px" },
        });
      }

      // Clear form fields on successful submission
      setHospitalName("");
      setAddress("");
      setCity("");
      setPincode("");
      setRegistrationNo("");
      setEmail("");
      setHospitalAdminEmail("");
      setPhone("");
      setCountryCode("");
      setLandline("");
      setLogo(null);
      setEditingHospital(null);
      setShowModal(false);
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
        toast.error(t("anErrorOccurredWhileSavingTheHospital"), {
          style: { fontSize: "13px" },
        });
      }
    }
  };

  const handleRegisterButtonClick = () => {
    setShowModal(true);
  };

  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    return "Access Denied";
  }

  const baseCurrencyHandler = (value) => {
    let confirm = window.confirm(
      "Once base currency updated then can not be change in future, Are you sure you want to procede"
    );
    if (confirm) {
      setBaseCurrency(value);
    } else {
      return 0;
    }
  };

  const multicurrenciesHandler = (selectedOptions) => {
    if (selectedOptions.length == 0) {
      setOptionalCurrency([]);
    } else {
      for (let i = 0; i < selectedOptions.length; i++) {
        if (selectedOptions[i].value == hospitals[0]?.baseCurrency) {
          toast.error("Can not select base currency as optional currency");
          break;
        } else if (selectedOptions.length > 2) {
          toast.error("Only two optional currency allowed to can set");
          break;
        } else {
          setOptionalCurrency(
            selectedOptions.filter(
              (currency) => currency.value != hospitals[0]?.baseCurrency
            )
          );
        }
      }
    }
  };
  return (
    <div
      style={{
        width: "98%",
        height: "100%",
        margin: "0 auto",
        fontSize: "12px",
      }}
    >
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{t("hospitalRegistration")}</h2>
      </header>
      <br></br>
      {hospitals?.length < 1 && (
        <Button
          style={{ fontSize: "12px", padding: "4px 5px", marginBottom: "10px" }}
          variant="secondary"
          onClick={handleRegisterButtonClick}
        >
          {t("registerHospital")}
        </Button>
      )}

      <div className="table-responsive">
        <Table
          className="table-striped table-hover table-bordered"
          responsive
          striped
          bordered
          hover
        >
          <Thead>
            <Tr>
              <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {t("hospitalRegistrationTable.id")}
              </Th>
              <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {t("hospitalRegistrationTable.hospitalName")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("hospitalRegistrationTable.address")}
              </Th>
              {/*               <Th style={{ textAlign: "center" }}>City</Th> */}
              <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {t("hospitalRegistrationTable.pincode")}
              </Th>
              <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {t("hospitalRegistrationTable.registrationNo")}
              </Th>
              <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {t("hospitalRegistrationTable.email")}
              </Th>
              <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {t("hospitalRegistrationTable.adminEmail")}
              </Th>
              <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {t("hospitalRegistrationTable.phone")}
              </Th>
              <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {t("hospitalRegistrationTable.landline")}
              </Th>
              <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {t("hospitalRegistrationTable.action")}
              </Th>
              {/* <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Edit</Th>
            <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
              Delete
            </Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {hospitals?.map((hospital) => (
              <Tr key={hospital.id}>
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {hospital.id}
                </Td>
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {hospital.hospitalName}
                </Td>
                <Td style={{ textAlign: "center" }}>{hospital.address}</Td>
                {/* <Td>{hospital.city}</Td> */}
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {hospital.pincode}
                </Td>
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {hospital.registrationNo}
                </Td>
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {hospital.email}
                </Td>
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {hospital.hospitalAdminEmail}
                </Td>
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {hospital.phone}
                </Td>
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {hospital.landline}
                </Td>
                <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  <Button
                    title={t("viewlogo")}
                    className="btn btn-secondary mr-2"
                    style={{
                      fontSize: "12px",
                      marginTop: "0px",
                      padding: "4px 5px",
                    }}
                    onClick={() => handleViewLogo(hospital)}
                  >
                    <FaRegEye />
                  </Button>{" "}
                  {"  "}
                  {/* </Td>
              <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}> */}
                  <Button
                    title={t("EditHospitalInformation")}
                    className="btn btn-secondary mr-2"
                    style={{
                      fontSize: "12px",
                      marginTop: "0px",
                      padding: "4px 5px",
                    }}
                    onClick={() => handleEditButtonClick(hospital)} // Add this
                  >
                    <FaPencilAlt />
                  </Button>{" "}
                  {/* </Td>
              <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}> */}
                  {/* <Button
                    title={t("Delete")}
                    className="btn btn-secondary mr-2"
                    style={{
                      fontSize: "12px",
                      marginTop: "0px",
                      padding: "4px 5px",
                    }}
                    onClick={() => handleDeleteButtonClick(hospital)}
                  >
                    <FaTrashAlt />
                  </Button> */}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <Modal
        size="lg"
        style={{ marginTop: "20px" }}
        centered
        backdrop="static"
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("hospitalRegistration")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row">
              {/* First Column */}
              <div className="col-md-6">
                {/* Hospital Name */}
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="hospitalName"
                  >
                    {t("hospitalName")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <input
                    type="text"
                    style={{ fontSize: "12px" }}
                    className={`form-control ${
                      validationErrors.hospitalName ? "is-invalid" : ""
                    }`}
                    id="hospitalName"
                    name="hospitalName"
                    placeholder={t("enterHospitalName")}
                    value={hospitalName}
                    onChange={handleInputChange}
                    required
                  />
                  {validationErrors.hospitalName && (
                    <div className="invalid-feedback">
                      {validationErrors.hospitalName}
                    </div>
                  )}
                </div>

                {/* Pincode */}
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="pincode"
                  >
                    {t("pincode")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <input
                    type="number"
                    style={{ fontSize: "12px" }}
                    className={`form-control ${
                      validationErrors.pincode ? "is-invalid" : ""
                    }`}
                    id="pincode"
                    name="pincode"
                    placeholder={t("enterPincode6digits")}
                    value={pincode}
                    onChange={handleInputChange}
                    required
                  />
                  {validationErrors.pincode && (
                    <div className="invalid-feedback">
                      {validationErrors.pincode}
                    </div>
                  )}
                </div>
              </div>

              {/* Second Column */}
              <div className="col-md-6">
                {/* Address */}
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="address"
                  >
                    {t("address")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="text"
                    className={`form-control ${
                      validationErrors.address ? "is-invalid" : ""
                    }`}
                    id="address"
                    name="address"
                    placeholder={t("enterAddress")}
                    value={address}
                    onChange={handleInputChange}
                    required
                  />
                  {validationErrors.address && (
                    <div className="invalid-feedback">
                      {validationErrors.address}
                    </div>
                  )}
                </div>

                {/* Registration No */}
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="registrationNo"
                  >
                    {t("registrationNo")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="text"
                    className={`form-control ${
                      validationErrors.registrationNo ? "is-invalid" : ""
                    }`}
                    id="registrationNo"
                    name="registrationNo"
                    placeholder={t("enterRegistrationNo")}
                    value={registrationNo}
                    onChange={handleInputChange}
                    required
                  />
                  {validationErrors.registrationNo && (
                    <div className="invalid-feedback">
                      {validationErrors.registrationNo}
                    </div>
                  )}
                </div>
              </div>

              {/* Third Column */}
              <div className="col-md-6">
                {/* Phone Number */}
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="phone"
                  >
                    {t("phoneNumber")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
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
                      style={{ fontSize: "12px" }}
                      type="tel"
                      className={`form-control ms-1 ${
                        validationErrors.phone ? "is-invalid" : ""
                      }`}
                      id="phone"
                      name="phone"
                      placeholder={t("enterPhoneNumber10digits")}
                      value={phone}
                      onChange={(e) => {
                        handleInputChange(e);
                        checkValidPhoneNo(e);
                      }}
                      required
                    />
                  </div>
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {phoneNoError == "case-1" && t("PleaseEnterCountryCode")}
                    {phoneNoError == "case-2" &&
                      t("InvalidPhoneNumberPleaseEnterAtleast12Digits")}
                    {phoneNoError == "case-3" &&
                      t("InvalidphonenumberPleaseenteratleast10digits")}
                  </span>
                  {validationErrors.phone && (
                    <div className="invalid-feedback">
                      {validationErrors.phone}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="email"
                  >
                    {t("email")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="email"
                    className={`form-control ${
                      validationErrors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    name="email"
                    placeholder={t("enterEmail")}
                    value={email}
                    onChange={handleInputChange}
                    required
                  />
                  {validationErrors.email && (
                    <div className="invalid-feedback">
                      {validationErrors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Fourth Column */}
              <div className="col-md-6">
                {/* Landline Number */}
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="landline"
                  >
                    {t("landlineNumberOptional")}
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="tel"
                    className={`form-control ${
                      validationErrors.landline ? "is-invalid" : ""
                    }`}
                    id="landline"
                    name="landline"
                    placeholder={t("enterLandlineNumberOptional")}
                    value={landline}
                    onChange={handleInputChange}
                  />
                  {validationErrors.landline && (
                    <div className="invalid-feedback">
                      {validationErrors.landline}
                    </div>
                  )}
                </div>

                {/* Logo */}
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="logo"
                  >
                    {t("uploadLogo")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="file"
                    className="form-control form-control-file"
                    id="logo"
                    name="logo"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleLogoChange} // Add this onChange handler
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                {/* Hospital Admin Email */}
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="hospitalAdminEmail"
                  >
                    {t("hospitalAdministratorEmail")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="email"
                    className={`form-control ${
                      validationErrors.hospitalAdminEmail ? "is-invalid" : ""
                    }`}
                    id="hospitalAdminEmail"
                    name="hospitalAdminEmail"
                    placeholder={t("enterHospitalAdminEmail")}
                    value={hospitalAdminEmail}
                    onChange={(e) => setHospitalAdminEmail(e.target.value)}
                    required
                  />
                  {validationErrors.hospitalAdminEmail && (
                    <div className="invalid-feedback">
                      {validationErrors.hospitalAdminEmail}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="hospitalAdminEmail"
                  >
                    {t("SelectBaseCurrency")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <select
                    disabled={
                      hospitals[0]?.baseCurrencyStatus != "default"
                        ? true
                        : false
                    }
                    required
                    value={baseCurrency}
                    className={`form-control form-control-sm ${
                      validationErrors.baseCurrency ? "is-invalid" : ""
                    }`}
                    onChange={(e) => {
                      setBaseCurrencyStatus("ChangedByAdmin");
                      baseCurrencyHandler(e.target.value);
                    }}
                  >
                    <option value={undefined}>Select</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                    <option value="CDF">CDF</option>
                  </select>
                  {validationErrors.baseCurrency && (
                    <div className="invalid-feedback">
                      {validationErrors.baseCurrency}
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="hospitalUserName"
                  >
                    {t("Username")}{" "}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <input
                    type="text"
                    style={{ fontSize: "12px" }}
                    className="form-control"
                    required
                    id="hospitalUserName"
                    name="hospitalUserName"
                    disabled={editingHospital}
                    placeholder="Enter Hospital Username"
                    value={hospitalUserName}
                    onChange={(e) =>
                      setHospitalUserName(
                        e.target.value.replace(/[^A-Za-z]/g, "").toLowerCase()
                      )
                    }
                  />
                </div>
              </div> */}
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="hospitalAdminEmail"
                  >
                    {t("SelectAdditionalCurrencies")}
                    {/* <span style={{ color: "red", marginLeft: "5px" }}>*</span> */}
                  </label>
                  <Select
                    placeholder={t("select")}
                    style={{ fontSize: "12px", marginTop: "8px" }}
                    options={currencyOptions}
                    value={OptionalCurrency}
                    // placeholder={t("select")}
                    isMulti
                    onChange={multicurrenciesHandler}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="hospitalAdminEmail"
                  >
                    {t("SecurityDeposit")}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="text"
                    className={`form-control `}
                    id="hospitalAdminEmail"
                    name="securityDeposit"
                    placeholder={t("enterSecurityDeposit")}
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <br></br>
            <div className="text-center">
              <button
                style={{ fontSize: "13px" }}
                type="submit"
                className="btn btn-secondary mr-2"
              >
                {t("register")}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Display hospital logo in another modal */}
      <Modal centered show={showModal2} onHide={() => setShowModal2(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("hospitalLogo")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHospital && (
            <img
              src={`data:image/png;base64,${selectedHospital.logo}`}
              alt={`${selectedHospital.hospitalName} Logo`}
              width="200"
            />
          )}
        </Modal.Body>
      </Modal>
      <Modal
        centered
        style={{ fontSize: "13px" }}
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("deleteHospital")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("areYouSureYouWantToDeleteThisHospital")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            {t("delete")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HospitalManagement;
