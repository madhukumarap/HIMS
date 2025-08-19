import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Col, Form, Button, Card } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Datepickrange from "./DateRangePickerForReport";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import AuthService from "../../services/auth.service";
import { fr, enIN } from "date-fns/locale";
import { format as formatDate, isDate } from "date-fns";

import Translation from "../../translations/PackageRevenue.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import DiagnosticPackageView from "../DiagnosticsComponent/DiagnosticViewPackage";
import { CurrencyContext } from "../../context/CurrencyProvider";

const PackageRevenueDiagnostic = () => {
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedCorporateType, setSelectedCorporateType] = useState("All");
  const navigate = useNavigate();
  const currentDate = new Date();

  const [startDate, setStartDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  );
  const [packages, setPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  const [selectedPackagePatients, setSelectedPackagePatients] = useState([]);
  const [allDiagnosticBookings, setAllDiagnosticBookings] = useState([]);

  const [viewPackage, setViewPackage] = useState(null);

  useEffect(() => {
    fetchCompaniesData();
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

    initializei18n();
  }, []);

  const { t } = useTranslation();
  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

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

  ///

  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

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

  const fetchAllDiagnosticBookings = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/getDiagnosticsBooking`,
        { startDate, endDate, selectedCorporateType, selectedPackageId },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        const data = response.data.bookings.filter(
          (element) => element.selectedPackageID != null
        );
        setAllDiagnosticBookings(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/DiagnosticsGetAllPackagesWithTests`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching packages:", error);
      });
  }, []);

  const [packageassociatedPatients, setPackageassociatedPatients] = useState(
    []
  );
  const [selectedPackageTotalEarning, setSelectedPackageTotalEarning] =
    useState([]);
  const fetchData = () => {
    //alert(startDate);
    if (selectedPackageId) {
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/getSelectedPackageBookingDiagnostic`;

      axios
        .get(url, {
          params: {
            selectedPackageId,
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
          setPackageassociatedPatients(response.data);

          // alert(JSON.stringify(response.data.length));
          // Handle the response from the server
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/getAllPackageRevenueDiagnostic`;

      axios
        .get(url, {
          params: {
            selectedPackageId,
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
          setPackageassociatedPatients(response.data);

          // alert(JSON.stringify(response.data.length));
          // Handle the response from the server
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  useEffect(() => {
    // if (selectedPackageId)
    {
      fetchData();
      fetchAllDiagnosticBookings();
    }
    if (selectedPackageId) {
      getSelectedPackagePatients(selectedPackageId);
    }
  }, [
    selectedPackageId,
    startDate,
    selectedPackageId,
    endDate,
    selectedCorporateType,
    selectedCompany,
  ]);
  const [isMobile, setIsMobile] = useState(false);
  // Function to check if the screen size is mobile
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

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  const packageEarnings =
    packageassociatedPatients.length * selectedPackageTotalEarning;

  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    return "Access Denied";
  }

  const getSelectedPackagePatients = (packageID) => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/selectedPackagePatients/diagnostic/${packageID}`,
        { headers: { Authorization: `Bearer ${currentUser?.Token}` } }
      )
      .then((response) => {
        // setSelectedPackagePatients(response.data)
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const getPackageName = (id) => {
    let pkgName = undefined;
    packages.forEach((element) => {
      element.id == id && (pkgName = element.packageName);
    });
    return pkgName;
  };

  const getPackagePrice = (id) => {
    const foundPackage = packages.find((pkg) => pkg.id === id);

    if (!foundPackage || foundPackage.finalPrice == null) {
      return `0 ${selectedGlobalCurrency}`;
    }

    const price = foundPackage.finalPrice;
    const currency = foundPackage.Currency || "";

    return `${convertCurrency(price, currency, "")} ${selectedGlobalCurrency}`;
  };

  return (
    <div
      style={{
        fontSize: "14px",
      }}
      className="container "
    >
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
            navigate(`/${extractedPart}/PackageRevenuePathology`);
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
            navigate(`/${extractedPart}/PackageRevenueDiagnostic`);
          }}
        >
          {t("Diagnostics")}
        </button>{" "}
      </div>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "18px" }}>{t("PackageRevenueDiagnostic")}</h2>
      </header>
      <br></br>

      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">{t("SelectDateRange")}:</label>

          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
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
              //setSelectedCompany("");
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
            {companies.map((company) => (
              <option key={company.id} value={company.registrationNo}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">{t("SelectaPackage")}:</label>
          <select
            type="select"
            value={selectedPackageId}
            className="form-select"
            onChange={(e) => {
              const selectedPackageId = e.target.value;
              const selectedPackage = packages.find(
                (pkg) => pkg.id === parseInt(selectedPackageId)
              );

              setSelectedPackageId(selectedPackageId);
              setSelectedPackage(selectedPackage);
              setSelectedPackageTotalEarning(selectedPackage?.finalPrice);
              selectedPackageId == ""
                ? setSelectedPackagePatients([])
                : getSelectedPackagePatients(selectedPackageId);
            }}
          >
            <option value="">{t("All")}</option>
            {packages.map((packages) => (
              <option key={packages.id} value={packages.id}>
                {packages.packageName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <hr />

      {selectedPackageId && (
        <Card>
          <Card.Header>{t("SelectedPackageDetails")}</Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table
                className="table-striped table-hover table-bordered"
                style={{ textAlign: "center", whiteSpace: "nowrap" }}
                striped
                bordered
                hover
              >
                <Thead>
                  <Tr>
                    <Th style={{ textAlign: "center" }}>{t("PackageID")}</Th>
                    <Th style={{ textAlign: "center" }}>{t("PackageName")}</Th>
                    <Th style={{ textAlign: "center" }}>{t("PackagePrice")}</Th>
                    <Th style={{ textAlign: "center" }}>{t("Sellcount")}</Th>
                    <Th style={{ textAlign: "center" }}>
                      {t("PackageEarnings")}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {selectedPackageId}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {selectedPackage.packageName}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {`${convertCurrency(
                        selectedPackage.finalPrice,
                        selectedPackage.Currency,
                        ""
                      )} ${selectedGlobalCurrency}`}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {packageassociatedPatients.length}
                    </Td>
                    <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {`${convertCurrency(
                        packageEarnings,
                        selectedPackage.Currency,
                        ""
                      )} ${selectedGlobalCurrency}`}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
      {!selectedPackageId && (
        <Card>
          <Card.Header>{t("SelectedPackageDetails")}</Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table
                className="table-striped table-hover table-bordered"
                style={{ textAlign: "center", whiteSpace: "nowrap" }}
                striped
                bordered
                hover
              >
                <Thead>
                  <Tr>
                    <Th style={{ textAlign: "center" }}>{t("PackageID")}</Th>
                    <Th style={{ textAlign: "center" }}>{t("PackageName")}</Th>
                    <Th style={{ textAlign: "center" }}>{t("PackagePrice")}</Th>
                    <Th style={{ textAlign: "center" }}>{t("Sellcount")}</Th>
                    <Th style={{ textAlign: "center" }}>
                      {t("PackageEarnings")}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {packageassociatedPatients.map((patient, index) => (
                    <Tr key={index}>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.packageId}{" "}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.packageName}{" "}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {`${convertCurrency(
                          patient.packagePrice,
                          patient.Currency,
                          ""
                        )} ${selectedGlobalCurrency}`}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.testCount}{" "}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {`${convertCurrency(
                          patient.packageRevenue,
                          patient.Currency,
                          ""
                        )} ${selectedGlobalCurrency}`}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* {selectedPackagePatients.length > 0 ? <Card>
        <Card.Header>{t("PatientListForPackage")}: {selectedPackage.packageName} </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table
              className="table-striped table-hover table-bordered"
              style={{ textAlign: "center", whiteSpace: "nowrap" }}
              striped
              bordered
              hover
            >
              <Thead>
                <Tr>
                                <Th style={{ textAlign: "center" }}>{t("PackageID")}</Th>
                                <Th style={{ textAlign: "center" }}>{t("PatientName")}</Th>
                                <Th style={{ textAlign: "center" }}>{t("ReferralDoctor")}</Th>
                                <Th style={{ textAlign: "center" }}>{t("RegistrationDate")}</Th>
                 
                </Tr>
              </Thead>
              <Tbody>
                {selectedPackagePatients.length > 0 && selectedPackagePatients.map((patient) => {
                  return (
                    <Tr>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.selectedPackageID}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.PatientName}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {patient.DoctorName}
                      </Td>
                      <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {formatDateInSelectedLanguage(new Date(patient.createdAt))}
                      </Td>

                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </div>
        </Card.Body>
      </Card> :

        

      } */}

      <Card>
        <Card.Header>{t("PatientListForPackages")} </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table
              className="table-striped table-hover table-bordered"
              style={{ textAlign: "center", whiteSpace: "nowrap" }}
              striped
              bordered
              hover
            >
              <Thead>
                <Tr>
                  {/*               <Th style={{ textAlign: "center" }}>{t("PackageID")}</Th> */}
                  <Th style={{ textAlign: "center" }}>{t("PackageName")}</Th>
                  <Th style={{ textAlign: "center" }}>{t("PatientName")}</Th>
                  <Th style={{ textAlign: "center" }}>{t("ReferralDoctor")}</Th>
                  <Th style={{ textAlign: "center" }}>
                    {t("RegistrationDate")}
                  </Th>
                  <Th style={{ textAlign: "center" }}>{t("PackageType")}</Th>
                  <Th style={{ textAlign: "center" }}>{t("PackagePrice")}</Th>
                  {/*               <Th style={{ textAlign: "center" }}>{t("PackageEarnings")}</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {allDiagnosticBookings.length > 0 ? (
                  allDiagnosticBookings
                    .filter((element) => element.selectedPackageID != 0)
                    .map((patient) => {
                      return (
                        <Tr>
                          <Td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {/* {getPackageName(patient.selectedPackageID)} */}
                            <span
                              onClick={() =>
                                setViewPackage(patient.selectedPackageID)
                              }
                              role="button"
                              className="nav-link"
                              style={{
                                textDecoration: "underline",
                                color: "blue",
                              }}
                            >
                              {getPackageName(patient.selectedPackageID)}
                            </span>
                          </Td>
                          <Td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {patient.PatientName}
                          </Td>
                          <Td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {patient.DoctorName}
                          </Td>
                          <Td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDateInSelectedLanguage(
                              new Date(patient.createdAt)
                            )}
                          </Td>
                          <Td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {patient.CorporateID != null
                              ? "Corporate"
                              : "Non-Corporate"}
                          </Td>
                          <Td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {getPackagePrice(patient.selectedPackageID)}
                          </Td>
                        </Tr>
                      );
                    })
                ) : (
                  <Tr>
                    <Td
                      colSpan={6}
                      style={{ textAlign: "center", whiteSpace: "nowrap" }}
                    >
                      {t("NoDataFound")}
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {viewPackage && (
        <DiagnosticPackageView
          selectedPackageID={viewPackage}
          handleClose={() => setViewPackage(null)}
        />
      )}
    </div>
  );
};

export default PackageRevenueDiagnostic;
