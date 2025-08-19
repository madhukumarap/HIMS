import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import AuthService from "../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { RiEdit2Line, RiDeleteBin6Line } from "react-icons/ri";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import Translation from "../translations/PackagePathology.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { CurrencyContext } from "../context/CurrencyProvider";
import { HospitalContext } from "../context/HospitalDataProvider";

const PackageForm = () => {
  const currentUser = AuthService.getCurrentUser();

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedPackageID, setSelectedPackageID] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [packageName, setPackageName] = useState("");
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [selectedPackageDetails, setSelectedPackageDetails] = useState(null);
  const handleViewDetailsClick = (Testpackage) => {
    setSelectedPackageID(Testpackage?.id);
    setSelectedPackageDetails(Testpackage);
    setShowViewDetailsModal(true);
  };
  const [currency, setCurrency] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  ///

  const { t } = useTranslation();
  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  const { hospitalData } = useContext(HospitalContext);

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

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const handleDeleteClick = (TestPackage) => {
    setSelectedPackageID(TestPackage.id);
    setPackageName(TestPackage.packageName);
    handleShowDeleteModal();
  };
  const handleDelete = () => {
    axios
      .delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/deleteHealthPackageTest/${selectedPackageID}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success(t("packageDeletedSuccessfully"));
        fetchPackages();
        handleCloseDeleteModal();
        resetForm();
      })
      .catch((error) => {
        console.error(error);
        toast.error(t("errorDeletingPackage"));
        handleCloseDeleteModal();
      });
  };

  const handleEditClick = (TestPackage) => {
    setSelectedPackageID(TestPackage.id);
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/selectedTestsHealthPackage/${
          TestPackage.id
        }`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        const allTests = response.data;

        // Separate tests based on category
        const scanTests = allTests.filter((test) => test.category === "Scan");
        const otherTests = allTests.filter((test) => test.category !== "Scan");

        // Set selectedTests and selectedScanTests
        setSelectedTests(otherTests);
        // setSelectedScanTests(scanTests);

        const selectedAllTests = otherTests.map((option) => ({
          value: option.TestName,
          TestId: option.TestId,
          testType: option.testType,
          category: option.category,
          label: option.TestName,
        }));
        const selectedScanAllTests = scanTests.map((option) => ({
          value: option.TestName,
          TestId: option.TestId,
          testType: option.testType,
          category: option.category,
          label: option.TestName,
        }));
        setCurrency(TestPackage?.Currency);
        setFormData({
          ...formData,
          selectedTests: selectedAllTests,
          selectedScanTests: selectedScanAllTests,
          packageName: TestPackage.packageName,
          MRPOfPackage: TestPackage.MRPOfPackage,
          discount: TestPackage.discount,
          finalPrice: TestPackage.finalPrice,
        });

        setShowModal(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const resetForm = () => {
    setSelectedPackageID("");
    setPackageName("");

    setFormData({
      packageName: "",
      selectedTests: [],
      selectedScanTests: [],
      MRPOfPackage: 0,
      discount: 0,

      finalPrice: 0,
    });
  };

  const [formData, setFormData] = useState({
    packageName: "",
    selectedTests: [],
    selectedScanTests: [],
    MRPOfPackage: 0,
    discount: 0,
    finalPrice: 0,
  });
  const [testOptions, setTestOptions] = useState([]);
  const [packages, setPackages] = useState([]);
  const handleScanTestSelect = (selectedScanTests) => {
    setFormData({
      ...formData,
      selectedScanTests,
    });
  };

  useEffect(() => {
    if (selectedPackageID !== null) {
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

  const handleViewClick = (Testpackage) => {
    setPackageName(Testpackage.packageName);
    setSelectedPackageID(Testpackage.id);
    setShowModal2(true);
  };
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

  const fetchPackages = () => {
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
  };
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/getAllTestsBothPathologyandDiagnostic`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        const options = response.data.tests
          .filter((test) => test.testName && test.category && test.id)
          .map((test) => ({
            value: test.testName,
            TestId: test.id,
            testType: test.testType,
            category: test.category,
            label: test.testName,
          }));
        // alert(options.length);
        setTestOptions(options);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "discount") {
      const finalPrice =
        formData.MRPOfPackage - formData.MRPOfPackage * (value / 100);

      //alert(finalPrice);
      setFormData({
        ...formData,
        [name]: value,
        finalPrice,
      });
    }
    if (name === "MRPOfPackage") {
      const finalPrice = value - value * (formData.discount / 100);

      //alert(finalPrice);
      setFormData({
        ...formData,
        [name]: value,
        finalPrice,
      });
    }
  };

  const handleTestSelect = (selectedTests) => {
    //alert(JSON.stringify(selectedTests));
    setFormData({
      ...formData,
      selectedTests,
    });
  };

  const handleSelectAllTests = () => {
    const selectedAllTests = testOptions
      .filter((option) => option.category !== "Scan")
      .map((option) => ({
        value: option.value,
        TestId: option.TestId,
        testType: option.testType,
        category: option.category,
        label: option.label,
      }));
    setFormData({
      ...formData,
      selectedTests: selectedAllTests,
    });
  };

  const handleSave = () => {
    if (formData.selectedTests.length < 1) {
      toast.error(t("pleaseSelectAtLeastOneTest"));
      return;
    }
    if (!currency) {
      toast.error(t("SelectCurrency"));
      return;
    }

    if (formData.MRPOfPackage < 0 || !formData.MRPOfPackage) {
      toast.error(t("pleaseEnterCorrectMRP"));
      return;
    }
    if (formData.discount < 0 || !formData.discount) {
      toast.error(t("pleaseEnterCorrectDiscount"));
      return;
    }
    if (formData.finalPrice < 1) {
      toast.error(t("pleaseEnterCorrectMRPAndDiscount"));
      return;
    }
    console.log(formData);
    // alert(JSON.stringify(formData));

    const postData = {
      packageName: formData.packageName,
      Currency: currency,
      selectedTests: [
        ...formData.selectedTests,
        ...formData.selectedScanTests.filter(
          (scanTest) =>
            !formData.selectedTests.some(
              (selectedTest) =>
                selectedTest.TestId === scanTest.TestId &&
                selectedTest.testType === scanTest.testType
            )
        ),
      ],
      MRPOfPackage: formData.MRPOfPackage,
      discount: formData.discount,
      finalPrice: formData.finalPrice,
    };

    if (!selectedPackageID) {
      //alert("Post");
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/createHealthPackageTest`,
          postData,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          fetchPackages();
          resetForm();
          toast.success(t("packageSavedSuccessfully"));
        })
        .catch((error) => {
          console.error(error);
          toast.error(t("errorSavingPackage"));
        });
      setShowModal(false);
    } else {
      //  alert("Put");
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/api/updateHealthPackageTest/${selectedPackageID}`,
          postData,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          toast.success(t("packageUpdatedSuccessfully"));
          setShowModal(false);
          fetchPackages();
          resetForm();
        })
        .catch((error) => {
          console.error(error);
          toast.error(t("errorUpdatingPackage"));
        });
    }
  };

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
        <h2 style={{ fontSize: "16px" }}>{t("createPackageHealth")}</h2>
      </header>
      <br></br>
      <Button
        style={{ fontSize: "12px" }}
        variant="secondary"
        onClick={() => setShowModal(true)}
      >
        {t("createPackage")}
      </Button>{" "}
      <br></br> <br></br>
      <div className="table-responsive">
        <Table
          className="table-striped table-hover table-bordered"
          style={{ textAlign: "center" }}
          striped
          bordered
          hover
          responsive
        >
          <Thead>
            <Tr>
              <Th style={{ textAlign: "center" }}>
                {t("createPackagePathologyTable.id")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("createPackagePathologyTable.packageName")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("createPackagePathologyTable.MRPINR")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("createPackagePathologyTable.discount")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("createPackagePathologyTable.finalPriceINR")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("createPackagePathologyTable.action")}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {packages.map((testpackage) => (
              <Tr key={testpackage.id}>
                <Td style={{ textAlign: "center" }}>{testpackage.id}</Td>
                <Td style={{ textAlign: "center" }}>
                  {testpackage.packageName}
                </Td>
                <Td style={{ textAlign: "center" }}>
                  {convertCurrency(
                    testpackage.MRPOfPackage,
                    testpackage.Currency,
                    selectedGlobalCurrency
                  )}{" "}
                  {selectedGlobalCurrency}
                </Td>
                <Td style={{ textAlign: "center" }}>{testpackage.discount}</Td>
                <Td style={{ textAlign: "center" }}>
                  {convertCurrency(
                    testpackage.finalPrice,
                    testpackage.Currency,
                    selectedGlobalCurrency
                  )}{" "}
                  {selectedGlobalCurrency}
                </Td>

                <Td style={{ textAlign: "center" }}>
                  <Button
                    style={{
                      fontSize: "12px",
                      marginTop: "0px",
                      padding: "4px 5px",
                    }}
                    title="Edit Package "
                    onClick={() => handleEditClick(testpackage)}
                    className="btn btn-secondary mr-2"
                  >
                    <FaPencilAlt />
                  </Button>
                  <Button
                    style={{
                      fontSize: "12px",
                      marginTop: "0px",
                      padding: "4px 5px",
                    }}
                    title="Delete Package "
                    onClick={() => handleDeleteClick(testpackage)}
                    className="btn btn-secondary mr-2"
                  >
                    <FaTrashAlt />
                  </Button>
                  <Button
                    style={{
                      fontSize: "12px",
                      marginTop: "0px",
                      padding: "4px 5px",
                    }}
                    title="View Package test"
                    // onClick={() => handleViewClick(testpackage)}
                    onClick={() => handleViewDetailsClick(testpackage)}
                    className="btn btn-secondary mr-2"
                  >
                    <FaRegEye />
                  </Button>
                </Td>
                {/* <Td style={{ textAlign: "center" }}>
                <Button
                  style={{
                    fontSize: "12px",
                    marginTop: "0px",
                    padding: "4px 5px",
                  }}
                  title="View Package Details"
                  onClick={() => handleViewDetailsClick(testpackage)}
                  className="btn btn-secondary mr-2"
                >
                  <FaRegEye />
                </Button>
              </Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <Modal centered show={showModal} size="lg" backdrop="static">
        <Modal.Header>
          <Modal.Title style={{ fontSize: "18px" }}>
            {selectedPackageID ? t("updatePackage") : t("createPackage")}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginTop: "15px",
              }}
              as={Row}
              controlId="packageName"
            >
              <Form.Label column sm="4">
                {t("packageName")} <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  required
                  type="text"
                  placeholder={t("enterPackageName")}
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group
              style={{
                fontSize: "14px",

                marginTop: "15px",
              }}
              as={Row}
              controlId="selectedTests"
            >
              <Form.Label
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginTop: "15px",
                }}
                column
                sm="4"
              >
                {t("selectTests")} <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm="8">
                <Select
                  options={testOptions
                    .filter(
                      (option) =>
                        option.testName !== null && option.testName !== ""
                    )
                    .filter((option) => option.category !== "Scan")}
                  isMulti
                  name="selectedTests"
                  value={formData.selectedTests}
                  onChange={handleTestSelect}
                />

                <Button variant="link" onClick={handleSelectAllTests}>
                  {t("selectAllTests")}
                </Button>
              </Col>
            </Form.Group>
            <Form.Group
              style={{
                fontSize: "14px",

                marginTop: "15px",
              }}
              as={Row}
              controlId="scanTests"
            >
              <Form.Label
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginTop: "15px",
                }}
                column
                sm="4"
              >
                {t("selectScanTests")}
              </Form.Label>
              <Col sm="8">
                <Select
                  options={testOptions.filter(
                    (test) => test.category === "Scan"
                  )}
                  isMulti
                  name="selectedScanTests"
                  value={formData.selectedScanTests}
                  onChange={handleScanTestSelect}
                />
              </Col>
            </Form.Group>
            <Form.Group
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginTop: "15px",
              }}
              as={Row}
              controlId="MRPOfPackage"
            >
              <Form.Label column sm="4">
                {t("MRPofPackage")} <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  type="number"
                  placeholder={t("enterMRPofPackage")}
                  name="MRPOfPackage"
                  value={formData.MRPOfPackage}
                  onChange={handleInputChange}
                />
              </Col>
              <Col sm="3">
                <Form.Group controlId="currency">
                  <select
                    style={{ fontSize: "13px", marginTop: "0px" }}
                    className="form-control"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="">{t("SelectCurrency")}</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                    <option value="CDF">CDF</option>
                  </select>
                </Form.Group>
              </Col>
            </Form.Group>
            <Form.Group
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginTop: "15px",
              }}
              as={Row}
              controlId="discount"
            >
              <Form.Label column sm="4">
                {t("discount")} (%) <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="number"
                  placeholder={t("enterDiscount")}
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginTop: "15px",
              }}
              as={Row}
              controlId="finalPrice"
            >
              <Form.Label column sm="4">
                {t("finalPrice")} <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="number"
                  required
                  disabled
                  value={formData.finalPrice}
                  readOnly
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "13px" }}
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            {t("close")}
          </Button>
          <Button
            style={{ fontSize: "13px" }}
            variant="secondary"
            onClick={handleSave}
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        centered
        show={showModal2}
        onHide={() => setShowModal2(false)}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "18px" }}>
            {t("packageName")}: {packageName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <header
            className="header"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "16px" }}>Test List</h2>
          </header>{" "}
          <br></br> */}
          <Table
            style={{ textAlign: "center" }}
            striped
            bordered
            hover
            responsive
          >
            <Thead>
              <Tr>
                <Th style={{ textAlign: "center" }}>
                  {t("createPackagePathologyTable.id")}
                </Th>
                <Th style={{ textAlign: "center" }}>
                  {t("createPackagePathologyTable.category")}
                </Th>
                <Th style={{ textAlign: "center" }}>
                  {t("createPackagePathologyTable.testName")}
                </Th>
                <Th style={{ textAlign: "center" }}>
                  {t("createPackagePathologyTable.testType")}
                </Th>
                <Th style={{ textAlign: "center" }}>
                  {t("createPackagePathologyTable.testID")}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {selectedTests.map((test) => (
                <Tr key={test.id}>
                  <Td style={{ textAlign: "center" }}>{test.id}</Td>
                  <Td style={{ textAlign: "center" }}>{test.category}</Td>
                  <Td style={{ textAlign: "center" }}>{test.TestName}</Td>
                  <Td style={{ textAlign: "center" }}>{test.testType}</Td>

                  <Td style={{ textAlign: "center" }}>{test.TestId}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal2(false);
              resetForm();
            }}
          >
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        style={{ marginTop: "20px", fontSize: "12px" }}
        centered
        backdrop="static"
        show={showDeleteModal}
        size="lg"
        onHide={handleCloseDeleteModal}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("deleteConfirmation")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("areYouSureYouWantToDeleteThePackageWithName")}: {packageName}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={handleCloseDeleteModal}
          >
            {t("cancel")}
          </Button>
          <Button
            style={{ fontSize: "12px" }}
            variant="danger"
            onClick={handleDelete}
          >
            {t("delete")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        centered
        style={{ marginTop: "20px" }}
        show={showViewDetailsModal}
        onHide={() => setShowViewDetailsModal(false)}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "18px", textAlign: "center" }}>
            {t("packageName")}: {selectedPackageDetails?.packageName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <div className="card-header">{t("tests")}</div>
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
            <h5>
              {t("packageFinalPrice")}: &#x20B9;{" "}
              {selectedPackageDetails?.finalPrice}
            </h5>
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
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PackageForm;
