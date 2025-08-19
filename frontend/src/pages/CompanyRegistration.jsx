import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Translation from "../translations/CompanyRegistration.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AuthService from "../services/auth.service";

const CompanyRegistration = () => {
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();

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
        //.use(initReactI18next).
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

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState(null);
  const [companyAdminEmail, setCompanyAdminEmail] = useState("");
  const [PAN_TAN, setPAN_TAN] = useState("");
  const [landline, setLandline] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [phoneNoError, setPhoneNoError] = useState("");
  const [editingCompany, setEditingCompany] = useState(null);
  const handleViewLogo = (company) => {
    setSelectedCompany(company);
    setShowModal2(true);
  };

  const [validationErrors, setValidationErrors] = useState({
    companyName: "",
    industry: "",
    location: "",
    registrationNo: "",
    email: "",
    phone: "",
    website: "",
    companyAdminEmail: "",
    PAN_TAN: "",
    landline: "",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/getAllCompanies`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCompanies(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleRegisterButtonClick = () => {
    setShowModal(true);
  };

  const handlePAN_TANChange = (e) => {
    setPAN_TAN(e.target.value);
  };

  const handlelandlineChange = (e) => {
    setLandline(e.target.value);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValidationErrors({
      ...validationErrors,
      [name]: "",
    });

    // if (name === "phone" && !/^\d{10}$/.test(value)) {
    //   setValidationErrors({
    //     ...validationErrors,
    //     [name]: t("InvalidphonenumberPleaseentera10digitnumber"),
    //   });
    // }
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
      case "companyName":
        setCompanyName(value);
        break;
      case "industry":
        setIndustry(value);
        break;
      case "location":
        setLocation(value);
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
      case "website":
        setWebsite(value);
        break;
      case "companyAdminEmail":
        setCompanyAdminEmail(value);
        break;
      default:
        break;
    }
  };

  const handleDeleteButtonClick = (company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };

  const handleDeleteCompany = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/deleteCompany/${
          selectedCompany.id
        }`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      fetchCompanies(); // Update the company list
      toast.success(t("Companydeletedsuccessfully"), {
        style: { fontSize: "13px" },
      });
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
        toast.error(t("Anerroroccurredwhiledeletingthecompany"), {
          style: { fontSize: "13px" },
        });
      }
    } finally {
      setShowDeleteModal(false);
      setSelectedCompany(null);
    }
  };

  const handleEditButtonClick = (company) => {
    setEditingCompany(company);
    setCompanyName(company.companyName);
    setIndustry(company.industryType);
    setLocation(company.Address);
    setRegistrationNo(company.registrationNo);
    setEmail(company.email);
    setPhone(company.phone);
    setWebsite(company.website);
    setCompanyAdminEmail(company.companyAdminEmail);
    setPAN_TAN(company.PAN_TAN);
    setLandline(company.landline);
    setCountryCode(company.countryCode);
    setShowModal(true);
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

    for (const key in validationErrors) {
      if (validationErrors[key]) {
        toast.error(t("Pleasefixthevalidationerrorsbeforesubmittingtheform"), {
          style: { fontSize: "13px" },
        });
        return;
      }
    }
    if (
      !email?.match("^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$") &&
      email?.length > 0
    ) {
      toast.error(t("EnterValidEmail"), {
        style: { fontSize: "13px" },
      });

      return;
    }
    if (
      !companyAdminEmail?.match(
        "^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
      ) &&
      companyAdminEmail?.length > 0
    ) {
      toast.error(t("EnterValidAdminEmail"), {
        style: { fontSize: "13px" },
      });

      return;
    }
    if (
      !email ||
      !companyName ||
      !registrationNo ||
      !countryCode ||
      !phone ||
      !location ||
      !PAN_TAN
      // !website
    ) {
      toast.error(t("PleaseFillRequiredFields"), {
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
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("industry", industry);
      formData.append("address", location);
      formData.append("registrationNo", registrationNo);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("website", website);
      formData.append("companyAdminEmail", companyAdminEmail);
      formData.append("PAN_TAN", PAN_TAN);
      formData.append("landline", landline);
      formData.append("countryCode", countryCode);

      if (logo) {
        formData.append("logo", logo);
      }

      if (editingCompany) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/updateCompany/${editingCompany.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        toast.success(t("Companyupdatedsuccessfully"), {
          style: { fontSize: "13px" },
        });
        fetchCompanies();
      } else {
        // alert(JSON.stringify(formData));
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/createCompany`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        fetchCompanies();
        toast.success(t("Companyregisteredsuccessfully"), {
          style: { fontSize: "13px" },
        });
      }

      setCompanyName("");
      setIndustry("");
      setLocation("");
      setRegistrationNo("");
      setEmail("");
      setCompanyAdminEmail("");
      setPhone("");
      setWebsite("");
      setLogo(null);
      setPAN_TAN("");
      setLandline("");
      setEditingCompany(null);
      setShowModal(false);
      setCountryCode("");
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
        toast.error(t("Anerroroccurredwhilesavingthecompany"), {
          style: { fontSize: "13px" },
        });
      }
    }
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
        <h2 style={{ fontSize: "16px" }}>{t("CompanyRegistration")}</h2>
      </header>
      <br></br>
      <Button
        style={{ fontSize: "12px", padding: "4px 5px", marginBottom: "10px" }}
        variant="secondary"
        onClick={handleRegisterButtonClick}
      >
        {t("RegisterCompany")}
      </Button>
      <div className="table-responsive">
        <Table
          className="table-striped table-hover table-bordered"
          style={{
            fontSize: "12px",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
          striped
          bordered
          hover
          size="lg"
        >
          <Thead>
            <Tr>
              <Th
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {t("companyRegistrationTable.CompanyName")}
              </Th>
              <Th
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {t("companyRegistrationTable.CorporateID")}
              </Th>
              <Th
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {t("companyRegistrationTable.Industry")}
              </Th>
              {/*               <Th style={{ textAlign: "center" }}>{t("companyRegistrationTable.Address")}</Th> */}
              <Th
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {t("companyRegistrationTable.EmailID")}
              </Th>
              <Th
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {t("companyRegistrationTable.LandlineNumber")}
              </Th>
              <Th
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {t("companyRegistrationTable.Actions")}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {companies.map((company) => (
              <Tr key={company.id}>
                <Td
                  style={{
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {company.companyName}
                </Td>
                <Td
                  style={{
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {company.registrationNo}
                </Td>
                <Td
                  style={{
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {company.industryType}
                </Td>
                {/* <Td
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {company.Address}
              </Td> */}

                <Td
                  style={{
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {company.email}
                </Td>
                <Td
                  style={{
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {company.landline}
                </Td>

                <Td
                  style={{
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  <Button
                    title={t("companyRegistrationTable.ViewDetails")}
                    style={{ fontSize: "12px", marginTop: "0px" }}
                    size="lg"
                    variant="secondary"
                    className="mr-1"
                    onClick={() => handleViewLogo(company)}
                  >
                    <FaRegEye />
                  </Button>
                  <Button
                    title={t("companyRegistrationTable.EditDetails")}
                    style={{ fontSize: "12px", marginTop: "0px" }}
                    size="lg"
                    variant="secondary"
                    className="mr-1"
                    onClick={() => handleEditButtonClick(company)}
                  >
                    <FaPencilAlt />
                  </Button>
                  <Button
                    title={t("companyRegistrationTable.DeleteCompany")}
                    style={{ fontSize: "12px" }}
                    size="lg"
                    variant="danger"
                    onClick={() => handleDeleteButtonClick(company)}
                  >
                    <FaTrashAlt />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <Modal
        size="lg"
        centered
        backdrop="static"
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("CompanyRegistration")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="companyName"
                  >
                    {t("companyRegistrationTable.CompanyName")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="text"
                    className={`form-control ${
                      validationErrors.companyName ? "is-invalid" : ""
                    }`}
                    id="companyName"
                    name="companyName"
                    placeholder={t("EnterCompanyName")}
                    value={companyName}
                    onChange={handleInputChange}
                  />
                  {validationErrors.companyName && (
                    <div className="invalid-feedback">
                      {validationErrors.companyName}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="industry"
                  >
                    {t("IndustryType")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="text"
                    className={`form-control ${
                      validationErrors.industry ? "is-invalid" : ""
                    }`}
                    id="industry"
                    name="industry"
                    placeholder={t("EnterIndustryType")}
                    value={industry}
                    onChange={handleInputChange}
                  />
                  {validationErrors.industry && (
                    <div className="invalid-feedback">
                      {validationErrors.industry}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="location"
                  >
                    {t("Address")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="text"
                    className={`form-control ${
                      validationErrors.location ? "is-invalid" : ""
                    }`}
                    id="location"
                    name="location"
                    placeholder={t("EnterAddress")}
                    value={location}
                    onChange={handleInputChange}
                  />
                  {validationErrors.location && (
                    <div className="invalid-feedback">
                      {validationErrors.location}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="registrationNo"
                  >
                    {t("CorporateID")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="text"
                    className={`form-control ${
                      validationErrors.registrationNo ? "is-invalid" : ""
                    }`}
                    id="registrationNo"
                    name="registrationNo"
                    placeholder={t("EnterCorporateID")}
                    value={registrationNo}
                    onChange={handleInputChange}
                  />
                  {validationErrors.registrationNo && (
                    <div className="invalid-feedback">
                      {validationErrors.registrationNo}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="website"
                  >
                    {t("Website")}
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="text"
                    className={`form-control ${
                      validationErrors.website ? "is-invalid" : ""
                    }`}
                    id="website"
                    name="website"
                    placeholder={t("EnterWebsite")}
                    value={website}
                    onChange={handleInputChange}
                  />
                  {validationErrors.website && (
                    <div className="invalid-feedback">
                      {validationErrors.website}
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="col-md-2">
                
              </div> */}

              <div className="col-md-6">
                {/* <div className="d-flex"> */}

                {/* <div className="form-group" style={{width:"25%"}} >
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="phone"
                  >
                    {t("contryCode")} <span style={{ color: "red" }}>*</span>
                  </label>
                  
                  </div> */}

                <div className="form-group ms-1">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="phone"
                  >
                    {t("Phone")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className={`form-control ${
                        phoneNoError == "case-1" && "is-invalid"
                      }`}
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
                        phoneNoError == "case-2" && "is-invalid"
                      } ${phoneNoError == "case-3" && "is-invalid"}`}
                      id="phone"
                      name="phone"
                      placeholder={t("EnterPhone")}
                      value={phone}
                      onChange={(e) => {
                        handleInputChange(e);
                        checkValidPhoneNo(e);
                      }}
                      // onKeyDown={(e) => {
                      //   if (
                      //     !/^\d{0,9}$/.test(e.target.value) &&
                      //     e.key !== "Backspace" &&
                      //     e.key !== "Delete"
                      //   ) {
                      //     e.preventDefault();
                      //   }
                      // }}
                      // onKeyPress={(e) => {
                      //   if (!/\d/.test(e.key)) {
                      //     e.preventDefault();
                      //   }
                      // }}
                    />
                  </div>

                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {phoneNoError == "case-1" && t("PleaseEnterCountryCode")}
                    {phoneNoError == "case-2" &&
                      t("InvalidPhoneNumberPleaseEnterAtleast12Digits")}
                    {phoneNoError == "case-3" &&
                      t("InvalidphonenumberPleaseenteratleast10digits")}
                  </span>

                  {/* {validationErrors.phone && (
                      <div className="invalid-feedback">
                        {validationErrors.phone}
                      </div>
                    )} */}
                </div>
                {/* </div> */}

                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="email"
                  >
                    {t("CompanyEmail")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="email"
                    className={`form-control ${
                      validationErrors.email ||
                      !/^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                        email
                      )
                        ? "is-invalid"
                        : ""
                    }`}
                    id="email"
                    name="email"
                    placeholder={t("EnterEmail")}
                    value={email}
                    onChange={handleInputChange}
                  />
                  {/* {validationErrors.email && (
        <div className="invalid-feedback">{validationErrors.email}</div>
      )} */}
                  {!validationErrors.email &&
                    email &&
                    !/^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      email
                    ) && (
                      <div className="invalid-feedback">
                        {t("Pleaseenteravalidemailaddress")}
                      </div>
                    )}
                </div>

                {/* <div className="form-group">
      <label
        style={{
          fontSize: "12px",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
        htmlFor="companyAdminEmail"
      >
        {t("companyRegistrationTable.CompanyAdminEmail")}{" "}
        <span style={{ color: "red" }}>*</span>
      </label>
      <input
        style={{ fontSize: "12px" }}
        type="email"
        className={`form-control ${
          validationErrors.companyAdminEmail ||
          !/^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
            companyAdminEmail
          )
            ? "is-invalid"
            : ""
        }`}
        id="companyAdminEmail"
        name="companyAdminEmail"
        placeholder={t("EnterEmail")}
        value={companyAdminEmail}
        onChange={handleInputChange}
      />
      {validationErrors.companyAdminEmail && (
        <div className="invalid-feedback">
          {validationErrors.companyAdminEmail}
        </div>
      )}
      {!validationErrors.companyAdminEmail &&
        companyAdminEmail &&
        !/^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          companyAdminEmail
        ) && (
          <div className="invalid-feedback">
            {t("Pleaseenteravalidemailaddress")}
          </div>
        )}

      {validationErrors.companyAdminEmail && (
        <div className="invalid-feedback">
          {validationErrors.companyAdminEmail}
        </div>
      )}
    </div> */}

                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="PAN_TAN"
                  >
                    {t("EnterPANTAN")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="text"
                    className={`form-control ${
                      validationErrors.PAN_TAN ? "is-invalid" : ""
                    }`}
                    id="PAN_TAN"
                    name="PAN_TAN"
                    placeholder={t("EnterPANTAN")}
                    value={PAN_TAN}
                    onChange={handlePAN_TANChange}
                  />
                  {validationErrors.PAN_TAN && (
                    <div className="invalid-feedback">
                      {validationErrors.PAN_TAN}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="logo"
                  >
                    {t("CompanyLogo")}
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="file"
                    className={`form-control`}
                    id="logo"
                    name="logo"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </div>
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                    htmlFor="landline"
                  >
                    {t("Landline")}
                  </label>
                  <input
                    style={{ fontSize: "12px" }}
                    type="text"
                    className={`form-control ${
                      validationErrors.landline ? "is-invalid" : ""
                    }`}
                    id="landline"
                    name="landline"
                    placeholder={t("EnterLandline")}
                    value={landline}
                    onChange={handlelandlineChange}
                  />
                  {validationErrors.landline && (
                    <div className="invalid-feedback">
                      {validationErrors.landline}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <br></br>
            <div className="text-center">
              <button
                style={{ fontSize: "13px" }}
                type="submit"
                className="btn btn-secondary"
              >
                {t("Register")}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/* Display hospital logo in another modal */}
      <Modal
        centered
        style={{ fontSize: "12px", marginTop: "20px" }}
        show={showModal2}
        onHide={() => setShowModal2(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {" "}
            {t("CompanyDetails")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-container">
            <table>
              <Tbody>
                {selectedCompany && (
                  <>
                    <Tr>
                      <Td className="table-cell">
                        <strong>
                          {t("companyRegistrationViewTable.CompanyName")}:
                        </strong>
                      </Td>
                      <Td className="table-cell">
                        {selectedCompany.companyName}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="table-cell">
                        <strong>
                          {t("companyRegistrationViewTable.Industry")}:
                        </strong>
                      </Td>
                      <Td className="table-cell">
                        {selectedCompany.industryType}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="table-cell">
                        <strong>
                          {t("companyRegistrationViewTable.Address")}:
                        </strong>
                      </Td>
                      <Td className="table-cell">{selectedCompany.Address}</Td>
                    </Tr>
                    <Tr>
                      <Td className="table-cell">
                        <strong>
                          {t("companyRegistrationViewTable.CorporateID")}:
                        </strong>
                      </Td>
                      <Td className="table-cell">
                        {selectedCompany.registrationNo}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="table-cell">
                        <strong>
                          {t("companyRegistrationViewTable.Email")}:
                        </strong>
                      </Td>
                      <Td className="table-cell">{selectedCompany.email}</Td>
                    </Tr>
                    <Tr>
                      <Td className="table-cell">
                        <strong>
                          {t("companyRegistrationViewTable.Phone")}:
                        </strong>
                      </Td>
                      <Td className="table-cell">{selectedCompany.phone}</Td>
                    </Tr>
                    <Tr>
                      <Td className="table-cell">
                        <strong>
                          {t("companyRegistrationViewTable.Website")}:
                        </strong>
                      </Td>
                      <Td className="table-cell">{selectedCompany.website}</Td>
                    </Tr>
                    {/* <Tr>
        <Td className="table-cell">
          <strong>{t("companyRegistrationViewTable.CompanyAdminEmail")}:</strong>
        </Td>
        <Td className="table-cell">{selectedCompany.companyAdminEmail}</Td>
      </Tr> */}
                    <Tr>
                      <Td className="table-cell">
                        <strong>
                          {t("companyRegistrationViewTable.PANTAN")}:
                        </strong>
                      </Td>
                      <Td className="table-cell">{selectedCompany.PAN_TAN}</Td>
                    </Tr>
                    <Tr>
                      <Td className="table-cell">
                        <strong>
                          {t("companyRegistrationViewTable.Landline")}:
                        </strong>
                      </Td>
                      <Td className="table-cell">{selectedCompany.landline}</Td>
                    </Tr>
                    <Tr>
                      <Td colSpan="2" align="center" className="table-cell">
                        <strong>
                          {t("companyRegistrationViewTable.CompanyLogo")}:
                        </strong>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td colSpan="2" align="center" className="table-cell">
                        <img
                          src={`data:image/png;base64,${selectedCompany.logo}`}
                          alt={`${selectedCompany.companyName} ${t(
                            "companyRegistrationViewTable.CompanyLogo"
                          )}`}
                          width="200"
                        />
                      </Td>
                    </Tr>
                  </>
                )}
              </Tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        style={{ marginTop: "20px" }}
        centered
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "18px" }}>
            {t("DeleteCompany")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("Areyousureyouwanttodeletethecompany")}</Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            {t("Cancel")}
          </Button>
          <Button
            style={{ fontSize: "12px" }}
            variant="danger"
            onClick={handleDeleteCompany}
          >
            {t("Delete")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompanyRegistration;
