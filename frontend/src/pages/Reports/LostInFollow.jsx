import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Datepickrange from "./DateRangePickerForReport";
import { FaRegEye } from "react-icons/fa";
import AuthService from "../../services/auth.service";

import Translation from "../../translations/LostInFollow.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const LostInFollow = () => {
  const currentUser = AuthService.getCurrentUser();

  const [bookings, setBookings] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Pathology");

  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedCorporateType, setSelectedCorporateType] = useState("All"); // Update initial state
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const currentDate = new Date();
  const [searchValue, setSearchValue] = useState("");
  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };
  const [startDate, setStartDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  );

  const [isMobile, setIsMobile] = useState(false);
  // Function to check if the screen size is mobile

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

  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 200);
  };

  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  useEffect(() => {
    fetchCompaniesData();
  }, []);

  const fetchCompaniesData = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllCompanies`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setCompanies(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    setBookings([]);

    {
      fetchBookings();
    }
  }, [
    startDate,
    endDate,
    selectedCorporateType,
    selectedCompany,
    selectedOption,
  ]);

  const fetchBookings = () => {
    if (selectedOption === "Pathology") {
      //alert("Pathology");
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/getLostInFollowPatientListforPathology`;
      axios
        .get(url, {
          params: {
            startDate,
            endDate,
            selectedCorporateType,
            selectedCompany,
          },
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        })
        .then((response) => {
          console.log(response.data?.bookingData);
          setBookings(response.data?.bookingData);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (selectedOption === "Diagnostic") {
      //alert("diagnostic");
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/getLostInFollowPatientListforDiagnostic`;
      axios
        .get(url, {
          params: {
            startDate,
            endDate,
            selectedCorporateType,
            selectedCompany,
          },
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        })
        .then((response) => {
          console.log(response.data?.bookingData);
          setBookings(response.data?.bookingData);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (selectedOption === "Consultation") {
      //alert("diagnostic");
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/getLostInFollowPatientListforConsultation`;
      axios
        .get(url, {
          params: {
            startDate,
            endDate,
            selectedCorporateType,
            selectedCompany,
          },
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        })
        .then((response) => {
          console.log(
            "getLostInFollowPatientListforConsultation" +
              JSON.stringify(response.data?.bookingData)
          );

          setBookings(response.data?.bookingData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleSetDate = (start, end) => {
    // alert(start);

    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  function formatDate2(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

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
        fontSize: "14px",
      }}
      className="container "
    >
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "18px" }}>{t("")}</h2>
      </header>
      <br></br>
      <div className="row mb-3">
        {/* <div className="col-md-3">
          <label className="form-label">Select Date Range:</label>

          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div> */}
        <div className="col-md-2">
          <label className="form-label">{t("SelectOption")}:</label>
          <select
            style={{ fontSize: "14px" }}
            className="form-select"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="Pathology">{t("Pathology")}</option>
            <option value="Diagnostic">{t("Diagnostic")}</option>
            <option value="Consultation">{t("Consultation")}</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">{t("SelectCorporateType")}:</label>
          <select
            style={{
              fontSize: "14px",
            }}
            className="form-select"
            value={selectedCorporateType}
            onChange={(e) => {
              setSelectedCorporateType(e.target.value);
              setSelectedPatientID("");
              setSelectedCompany("");
            }}
          >
            <option value="All">{t("All")}</option>
            <option value="Corporate">{t("Corporate")}</option>
            <option value="NonCorporate">{t("NonCorporate")}</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">{t("SelectCompany")}:</label>
          <select
            style={{ fontSize: "14px" }}
            className="form-select"
            value={selectedCompany}
            onChange={(e) => {
              setSelectedCompany(e.target.value);
              if (!selectedCompany) {
                setSelectedCorporateType("Corporate");
              } else {
                setSelectedCorporateType("All");
              }
            }}
          >
            <option value="">{t("All")}</option>
            {companies?.map((company) => (
              <option key={company.id} value={company.registrationNo}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>
        <div style={{ fontSize: "14px" }} className="col-md-3">
          <label className="form-label">{t("SearchByNamePhone")}:</label>
          <input
            type="text"
            style={{ fontSize: "14px" }}
            placeholder={t("EnterEitherNameOrContact")}
            className="form-control"
            value={searchValue}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>
      <hr />

      <br></br>
      {selectedOption !== "Consultation" && (
        <Card>
          <Card.Header>
            <h2 style={{ fontSize: "16px" }}>{t("Patientlist")}</h2>
          </Card.Header>
          <Card.Body>
            <Table
              className="table-striped table-bordered"
              style={{
                border: "1px solid #ccc",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
              responsive
            >
              <Thead>
                <Tr>
                  <Th style={{ textAlign: "center" }}>{t("PatientID")}</Th>
                  <Th style={{ textAlign: "center" }}>{t("PatientName")}</Th>
                  <Th style={{ textAlign: "center" }}>{t("PatientContact")}</Th>
                  <Th style={{ textAlign: "center" }}>{t("CorporateID")}</Th>
                  <Th style={{ textAlign: "center" }}>
                    {t("PatientVisitingDate")}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {bookings
                  ?.filter((booking) => {
                    const nameMatch =
                      booking?.PatientName?.toLowerCase().includes(
                        searchValue.toLowerCase()
                      );
                    const phoneMatch =
                      booking?.PatientPhoneNo?.toString().includes(searchValue);
                    return nameMatch || phoneMatch;
                  })
                  ?.map((booking) => (
                    <Tr key={booking.id}>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking?.PatientID}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking?.PatientName}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking?.PatientPhoneNo}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking?.CorporateID}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {formatDate2(booking.createdAt)}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {selectedOption === "Consultation" && (
        <Card>
          <Card.Header>
            <h2 style={{ fontSize: "16px" }}>{t("Patientlist")}</h2>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table
                style={{ textAlign: "center", whiteSpace: "nowrap" }}
                striped
                bordered
                hover
                responsive
              >
                <Thead
                  style={{ textAlign: "center", border: "1px solid #ccc" }}
                >
                  <Tr style={{ textAlign: "center", border: "1px solid #ccc" }}>
                    <Th
                      style={{ textAlign: "center", border: "1px solid #ccc" }}
                    >
                      {t("PatientID")}
                    </Th>
                    <Th
                      style={{ textAlign: "center", border: "1px solid #ccc" }}
                    >
                      {t("PatientName")}
                    </Th>
                    <Th
                      style={{ textAlign: "center", border: "1px solid #ccc" }}
                    >
                      {t("PatientContact")}
                    </Th>
                    <Th
                      style={{ textAlign: "center", border: "1px solid #ccc" }}
                    >
                      {t("CorporateID")}
                    </Th>
                    <Th
                      style={{ textAlign: "center", border: "1px solid #ccc" }}
                    >
                      {t("PatientVisitingDate")}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody style={{ border: "1px solid #ccc" }}>
                  {bookings
                    ?.filter((booking) => {
                      const nameMatch =
                        booking?.PatientName?.toLowerCase().includes(
                          searchValue.toLowerCase()
                        );
                      const phoneMatch =
                        booking?.PatientPhoneNo?.toString().includes(
                          searchValue
                        );
                      return nameMatch || phoneMatch;
                    })
                    ?.map((booking) => (
                      <Tr style={{ border: "1px solid #ccc" }} key={booking.id}>
                        <Td
                          style={{
                            border: "1px solid #ccc",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {booking?.patientId}
                        </Td>
                        <Td
                          style={{
                            border: "1px solid #ccc",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {booking?.PatientName}
                        </Td>
                        <Td
                          style={{
                            border: "1px solid #ccc",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {booking?.PatientPhone}
                        </Td>
                        <Td
                          style={{
                            border: "1px solid #ccc",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {booking?.CorporateID}
                        </Td>
                        <Td
                          style={{
                            border: "1px solid #ccc",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate2(booking.createdAt)}
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default LostInFollow;
