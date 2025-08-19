import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Col, Form, Button, Card } from "react-bootstrap";
import Datepickrange from "./DateRangePickerForReport";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import AuthService from "../../services/auth.service";

import Translation from "../../translations/ReferralAnalysisPathology.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { CurrencyContext } from "../../context/CurrencyProvider";
import { HospitalContext } from "../../context/HospitalDataProvider";
import { currencySymbols } from "../../utils.js";

const ReferralAnalysisPathology = () => {
  // State variables
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedCorporateType, setSelectedCorporateType] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [patientData, setPatientData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [bookings, setBookings] = useState([]);
  const [bookingsObject, setBookingsObject] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  // Function to check if the screen size is mobile
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 68);
  };

  ///

  const { t } = useTranslation();
  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  const { hospitalData } = useContext(HospitalContext);

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
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  ///

  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    setBookings([]);
    setBookingsObject("");
    //  if (selectedPatient)
    {
      fetchBookings();
    }
    if (selectedPatient) {
      const selectDoctor = doctors?.find(
        (doctor) => doctor.id === parseInt(selectedPatient)
      );
      setSelectedDoctor(selectDoctor);
    }
  }, [
    startDate,
    endDate,
    selectedCorporateType,
    selectedCompany,
    selectedPatient,
  ]);

  const fetchBookings = () => {
    const SelectedDoctorID = selectedPatient;
    //alert(SelectedDoctorID);

    if (SelectedDoctorID) {
      //alert("Pathology");
      const url = `${import.meta.env.VITE_API_URL}/api/getAllBookingsTestDiagnosticSelectedDoctorReferral`;
      axios
        .get(url, {
          params: {
            SelectedDoctorID,
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
          // console.log(response.data);

          setBookingsObject(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const url = `${import.meta.env.VITE_API_URL}/api/getAllBookingsTestDiagnosticAllDoctorReferral`;
      //  alert(SelectedDoctorID);
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
          //alert("Data: " + JSON.stringify(response.data));
          console.log("Data: " + JSON.stringify(response.data));
          setBookings(response.data);
        })
        .catch((error) => {
          alert(error);
          console.error(error);
        });
    }
  };
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
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getDoctorData`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        const doctorData = response.data;
        setDoctors(doctorData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Data fetching
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const url = `${import.meta.env.VITE_API_URL}/api/getDiagnosticsBooking`;
    axios
      .get(url, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPatientData(response.data.bookings);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Filtered data based on selected filters
  useEffect(() => {
    setFilteredData(
      patientData.filter((patient) => {
        const patientDate = new Date(patient.createdAt);
        return (
          (!startDate || patientDate >= startDate) &&
          (!endDate || patientDate <= endDate) &&
          (selectedCorporateType === "All" ||
            (selectedCorporateType === "Corporate" &&
              patient.CorporateID !== null) ||
            (selectedCorporateType === "Non-Corporate" &&
              patient.CorporateID === null)) &&
          (selectedCorporateType !== "Corporate" ||
            (selectedCorporateType === "Corporate" &&
              patient.CorporateID === selectedCompany))
        );
      })
    );
  }, [
    selectedYear,
    selectedMonth,
    selectedCompany,
    selectedCorporateType,
    patientData,
    startDate,
    endDate,
  ]);

  // Get unique years and months from data
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, index) => currentYear - index);

  const months = Array.from(
    new Set(
      patientData.map((patient) =>
        (new Date(patient.createdAt).getMonth() + 1).toString().padStart(2, "0")
      )
    )
  );
  const countUniquePatients = () => {
    const uniquePatientIds = new Set(
      filteredData.map((patient) => patient.PatientID)
    );
    return uniquePatientIds.size;
  };
  const uniqueDoctors = Array.from(
    new Set(filteredData.map((patient) => patient.doctorId))
  );

  const formatDateString = (date) => {
    return date ? date.toLocaleDateString() : "";
  };
  return (
    <div style={{ fontSize: "14px" }} className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          marginBottom: "10px",
        }}
      >
        <Button
          style={{
            marginTop: "0px",
            height: "30px",
            fontSize: "12px",
            padding: "4px 5px",
          }}
          className="btn btn-secondary mr-2"
          onClick={() => {
            navigate(`/${extractedPart}/ReferralAnalysisPathology`);
          }}
        >
          {t("Pathology")}
        </Button>{" "}
        <button
          style={{
            marginTop: "0px",
            height: "30px",
            fontSize: "12px",
            padding: "4px 5px",
          }}
          className="btn btn-secondary mr-2"
          onClick={() => {
            navigate(`/${extractedPart}/ReferralAnalysisDiagnostic`);
          }}
        >
          {t("Diagnostics")}
        </button>{" "}
        {/* <Button
          style={{
            marginTop: "0px",
            height: "30px",
            fontSize: "12px",
            padding: "4px 5px",
          }}
          className="btn btn-secondary mr-2"
          onClick={() => {
            navigate("/ConsultationAnalytics");
          }}
        >
          Consultation Spends
        </Button>{" "} */}
      </div>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{t("ReferralAnalysisDiagnostics")}</h2>
      </header>{" "}
      <br></br>
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">{t("SelectDateRange")}</label>

          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">{t("SelectCorporateType")}</label>
          <select
            className="form-select"
            value={selectedCorporateType}
            onChange={(e) => setSelectedCorporateType(e.target.value)}
          >
            <option value="All">{t("All")}</option>
            <option value="Corporate">{t("Corporate")}</option>
            <option value="Non-Corporate">{t("NonCorporate")}</option>
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
            <option value="">{t("SelectCompany")}</option>
            {companies.map((company) => (
              <option key={company.id} value={company.registrationNo}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">{t("SelectReferralDoctor")}:</label>
          <select
            className="form-select"
            value={selectedPatient}
            onChange={(e) => {
              setSelectedPatient(e.target.value);
              if (!e.target.value) {
                setSelectedPatient("");
                setSelectedDoctor("");
              }
            }}
          >
            <option value="">{t("All")}</option>
            {uniqueDoctors.map((doctorId) => (
              <option key={doctorId} value={doctorId}>
                {t("Dr")}{" "}
                {
                  filteredData.find((patient) => patient.doctorId === doctorId)
                    .DoctorName
                }
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* First Table - Aggregated Data */}
      {!selectedDoctor && (
        <Card>
          <Card.Header>{t("RevenueEarnedByDoctor")}</Card.Header>
          <Card.Body>
            <br></br>
            {isMobile ? (
              {}
            ) : (
              <div className="table-responsive">
                <Table
                  className="table-striped table-bordered"
                  style={{ textAlign: "center", whiteSpace: "nowrap" }}
                  responsive
                  bordered
                  striped
                >
                  <Thead>
                    <Tr>
                      <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {t("StartEndDate")}
                      </Th>

                      <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {t("TotalPatients")}
                      </Th>
                      <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {t("TotalTests")}
                      </Th>
                      <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {t("TotalEarnings")}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {`${formatDateString(startDate)} - ${formatDateString(
                          endDate
                        )}`}
                      </Td>

                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {countUniquePatients()}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {filteredData.reduce((totalTests, patient) => {
                          const tests = patient.selectedTests.split(",");
                          return totalTests + tests.length;
                        }, 0)}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {currencySymbols[selectedGlobalCurrency]}{" "}
                        {convertCurrency(
                          bookings.reduce(
                            (total, booking) =>
                              total + parseFloat(booking.earnedCommission || 0),
                            0
                          ),
                          hospitalData.baseCurrency,
                          selectedGlobalCurrency
                        )}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
      <br></br>
      {selectedDoctor && (
        <Card>
          <Card.Header>{t("RevenueEarnedForDoctor")}</Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table
                className="table-striped table-bordered"
                responsive
                style={{ textAlign: "center", whiteSpace: "nowrap" }}
                striped
                bordered
                hover
              >
                <Thead>
                  <Tr>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("ID")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("DoctorName")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("RegistrationNo")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("ContactNumber")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("PatientCount")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("EarnedCommission")}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {selectedDoctor.id}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      Dr {selectedDoctor.FirstName} {selectedDoctor.LastName}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {selectedDoctor.registrationNo}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {selectedDoctor.phoneNo}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {" "}
                      {bookingsObject?.PatientCount}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {bookingsObject?.totalCommission > 0 &&
                        `${bookingsObject?.totalCommission} USD`}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
      {!selectedPatient ? (
        <Card>
          <Card.Header>{t("EarnedRevenueForDoctor")}</Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table
                className="table-striped table-bordered"
                responsive
                style={{ textAlign: "center", whiteSpace: "nowrap" }}
                striped
                bordered
                hover
              >
                <Thead>
                  <Tr>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("ID")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("DoctorName")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("RegistrationNo")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("ContactNumber")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("PatientCount")}
                    </Th>
                    <Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("EarnedCommission")}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {bookings?.map((booking) => (
                    <Tr key={booking?.doctorId}>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking?.doctorId}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        Dr {booking?.doctorName}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking?.registrationNo}
                      </Td>
                      <Td
                        style={{ textAlign: "center", whiteSpace: "nowrap" }}
                      >{` ${booking?.phoneNo}`}</Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking?.patientCount}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking?.earnedCommission > 0 &&
                          ` ${booking?.earnedCommission?.toFixed(2)} USD`}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      ) : null}
      {/* Second Table - Individual Patient Data */}
      {selectedPatient && (
        <div>
          <header
            className="header"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "18px" }}>{t("ReferralPatient")}</h2>
          </header>
          <br></br>
          {isMobile ? (
            {}
          ) : (
            <div className="table-responsive">
              <Table
                className="table-striped table-bordered"
                style={{ textAlign: "center", whiteSpace: "nowrap" }}
                responsive
                bordered
                striped
              >
                {" "}
                <Thead>
                  <Tr>
                    <Th style={{ textAlign: "center" }}>{t("SrNo")}</Th>
                    <Th style={{ textAlign: "center" }}>
                      {t("ReferralDoctor")}
                    </Th>
                    <Th style={{ textAlign: "center" }}>{t("PatientName")}</Th>

                    <Th style={{ textAlign: "center" }}>
                      {t("PatientContactNumber")}
                    </Th>
                    {/*               <Th style={{ textAlign: "center" }}>Selected Tests</Th> */}
                    <Th style={{ textAlign: "center" }}>{t("CreatedAt")}</Th>
                    {/*               <Th style={{ textAlign: "center" }}>Created At</Th> */}
                    <Th style={{ textAlign: "center" }}>{t("CorporateID")}</Th>
                    <Th style={{ textAlign: "center" }}>{t("BookingCount")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.values(
                    filteredData
                      .filter(
                        (patient) =>
                          patient.doctorId === parseInt(selectedPatient)
                      )
                      .reduce((result, patient) => {
                        if (!result[patient.PatientName]) {
                          result[patient.PatientName] = {
                            ...patient,
                            bookingCount: 0,
                            testFees: 0,
                          };
                        }
                        result[patient.PatientName].testFees += parseFloat(
                          patient.testFees.replace(/\.00$/, "")
                        );
                        result[patient.PatientName].bookingCount++;
                        return result;
                      }, {})
                  ).map((patient, index) => (
                    <Tr key={patient.id}>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {index + 1}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        Dr. {patient.DoctorName}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.PatientName}
                      </Td>

                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.PatientPhoneNo}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {formatDateInSelectedLanguage(
                          new Date(patient.createdAt)
                        )}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.CorporateID}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.bookingCount}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralAnalysisPathology;
