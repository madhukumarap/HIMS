import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import AuthService from "../services/auth.service";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import Translation from "../translations/AllPackagesView.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { CurrencyContext } from "../context/CurrencyProvider";

const AllPackagesView = () => {
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();
  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

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
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [selectedPackageDetails, setSelectedPackageDetails] = useState(null);
  const [testOptions, setTestOptions] = useState([]);
  //////Health Packages//////
  const [packages, setPackages] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  // const [FilterOptionTest, setFilterOptionTest] = useState([]);

  const [selectedPackageID, setSelectedPackageID] = useState(null);

  //////Diagnostic Packages//////
  const [DiagnosticPackages, setDiagnosticPackages] = useState([]);
  const [DiagnosticSelectedTests, setDiagnosticSelectedTests] = useState([]);
  const [selectedDiagnosticPackageID, setSelectedDiagnosticPackageID] =
    useState(null);

  //////Pathology Packages//////
  const [PathologyPackages, setPathologyPackages] = useState([]);
  const [PathologySelectedTests, setPathologySelectedTests] = useState([]);
  const [selectedPathologyPackageID, setSelectedPathologyPackageID] =
    useState(null);

  ///////////////////////////////////////////////////////////////////////////////////////////
  const handleViewDetailsClick = (Testpackage) => {
    if (filterOption === "Health") {
      setSelectedPackageID(Testpackage?.id);
    } else if (filterOption === "Pathology") {
      setSelectedPathologyPackageID(Testpackage?.id);
    } else if (filterOption === "Diagnostic") {
      setSelectedDiagnosticPackageID(Testpackage?.id);
    }
    setSelectedPackageDetails(Testpackage);
    setShowViewDetailsModal(true);
  };

  //let FilterOptionTest;
  const handleCloseModal = () => {
    // Reset all IDs and selectedPackageDetails
    setSelectedPackageID(null);
    setSelectedPathologyPackageID(null);
    setSelectedDiagnosticPackageID(null);
    setSelectedPackageDetails(null);
    setSelectedPackageDetails(null);
    setSelectedTests([]);
    // Close the modal
    setShowViewDetailsModal(false);
  };

  ///////////////////HealthPackages//////////////////////
  useEffect(() => {
    if (selectedPackageID !== null) {
      //alert("selectedPackageID");

      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/selectedTestsHealthPackage/${selectedPackageID}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          setSelectedTests(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedPackageID]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/GetAllHealthPackagesWithTests`,
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
        console.error(error);
      });
  }, []);
  ///////////////////PathologyPackages//////////////////////

  useEffect(() => {
    if (selectedPathologyPackageID !== null) {
      //alert("selectedPathologyPackageID");

      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/selectedTests/${selectedPathologyPackageID}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          setSelectedTests(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedPathologyPackageID]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/GetAllPackagesWithTests`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPathologyPackages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  ///////////////////DiagnosticPackages//////////////////////

  useEffect(() => {
    if (selectedDiagnosticPackageID !== null) {
      //alert("selectedDiagnosticPackageID");
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/DiagnosticsSelectedTests/${selectedDiagnosticPackageID}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          setSelectedTests(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedDiagnosticPackageID]);

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
        setDiagnosticPackages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  ///////////////////////////////////////////////////////////
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [filterOption, setFilterOption] = useState("Pathology");

  // Function to handle filter change
  const handleFilterChange = (option) => {
    setFilterOption(option);
  };

  // Filter packages based on selected option
  useEffect(() => {
    switch (filterOption) {
      case "Health":
        setFilteredPackages(packages);
        break;
      case "Pathology":
        setFilteredPackages(PathologyPackages);
        break;
      case "Diagnostic":
        setFilteredPackages(DiagnosticPackages);
        break;
      default:
        setFilteredPackages([]);
        break;
    }
  }, [filterOption, packages, PathologyPackages, DiagnosticPackages]);

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
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_DIAGNOSTICTECHNICIAN") &&
    !currentUser.roles.includes("ROLE_PATHOLOGISTADMIN") &&
    !currentUser.roles.includes("ROLE_RECEPTIONIST") &&
    !currentUser.roles.includes("ROLE_DOCTOR") &&
    !currentUser.roles.includes("ROLE_PHARMACIST") &&
    !currentUser.roles.includes("ROLE_PATIENT") &&
    !currentUser.roles.includes("ROLE_SUPERADMIN")
  ) {
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
        <h2 style={{ fontSize: "17px" }}> {t("Packages")} </h2>
      </header>
      <br></br>
      <div className="mb-3 col-12 col-md-3">
        <label
          style={{ fontSize: "14px" }}
          htmlFor="filterDropdown"
          className="form-label"
        >
          {t("SelectPackage")}
        </label>
        <select
          style={{ fontSize: "12px", width: "100%" }}
          id="filterDropdown"
          className="form-select"
          value={filterOption}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          {/* <option value="">{t("Select")}</option> */}
          <option value="Health">{t("HealthPackages")}</option>
          <option value="Pathology">{t("PathologyPackages")}</option>
          <option value="Diagnostic">{t("DiagnosticPackages")}</option>
        </select>
      </div>
      <br></br> <br></br>
      <Modal
        style={{ marginTop: "20px" }}
        centered
        show={showViewDetailsModal}
        onHide={handleCloseModal}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "18px", textAlign: "center" }}>
            {t("PackageName")}: {selectedPackageDetails?.packageName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <div className="card-header">{t("Tests")}</div>
            <div className="card-body">
              {selectedTests?.length > 0 && (
                <div className="row">
                  <div className="col-md-5">
                    {" "}
                    {/* First Column */}
                    {selectedTests
                      .slice(0, Math.ceil(selectedTests.length / 2))
                      .sort((a, b) => a.category.localeCompare(b.category))
                      .map((test, index, tests) => (
                        <div key={test.id}>
                          {index === 0 ||
                          test.category !== tests[index - 1].category ? (
                            <h5>{test.category}</h5>
                          ) : null}
                          <ul>
                            <li>{test.TestName}</li>
                          </ul>
                          {index !== tests.length - 1 && <hr />}{" "}
                        </div>
                      ))}
                  </div>
                  <div className="col-md-1"></div>
                  <div className="col-md-6">
                    {" "}
                    {/* Second Column */}
                    {selectedTests
                      .slice(Math.ceil(selectedTests.length / 2))
                      .sort((a, b) => a.category.localeCompare(b.category))
                      .map((test, index, tests) => (
                        <div key={test.id}>
                          {index === 0 ||
                          test.category !== tests[index - 1].category ? (
                            <h5>{test.category}</h5>
                          ) : null}
                          <ul>
                            <li>{test.TestName}</li>
                          </ul>
                          {index !== tests.length - 1 && <hr />}{" "}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="text-center mt-4">
            <p style={{ marginBottom: "5px" }}>
              <span
                style={{
                  color: "#888",
                  textDecoration: "line-through",
                  marginRight: "10px",
                  fontSize: "16px",
                }}
              >
                {t("MRP")}:{" "}
                {convertCurrency(
                  selectedPackageDetails?.MRPOfPackage,
                  selectedPackageDetails?.Currency,
                  selectedGlobalCurrency
                )}{" "}
              </span>
              <span style={{ color: "#f00", fontSize: "16px" }}>
                {t("Discount")}: {selectedPackageDetails?.discount}%
              </span>
            </p>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#00f",
                marginBottom: "20px",
              }}
            >
              {t("FinalPrice")}:{" "}
              {convertCurrency(
                selectedPackageDetails?.finalPrice,
                selectedPackageDetails?.Currency,
                selectedGlobalCurrency
              )}{" "}
              {selectedGlobalCurrency}
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowViewDetailsModal(false);
              setSelectedPackageDetails(null);
            }}
          >
            {t("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="row">
        {filteredPackages.map((testpackage) => (
          <div key={testpackage.id} className="col-md-4">
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s",
                marginBottom: "20px",
                padding: "15px",
                backgroundColor: "#f8f9fa" /* Updated background color */,
                cursor: "pointer" /* Added cursor pointer */,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={() => handleViewDetailsClick(testpackage)}
            >
              <h5
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                {testpackage.packageName}
              </h5>
              <p style={{ marginBottom: "5px" }}>
                <span
                  style={{
                    color: "#888",
                    textDecoration: "line-through",
                    marginRight: "10px",
                    fontSize: "16px",
                  }}
                >
                  {t("MRP")}:{" "}
                  {convertCurrency(
                    testpackage.MRPOfPackage,
                    testpackage?.Currency,
                    selectedGlobalCurrency
                  )}{" "}
                  {selectedGlobalCurrency}
                </span>
                <span style={{ color: "#f00", fontSize: "16px" }}>
                  {t("Discount")}: {testpackage.discount}%
                </span>
              </p>

              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#00f",
                  marginBottom: "20px",
                }}
              >
                {t("FinalPrice")}:{" "}
                {convertCurrency(
                  testpackage.finalPrice,
                  testpackage?.Currency,
                  selectedGlobalCurrency
                )}{" "}
                {selectedGlobalCurrency}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPackagesView;
