import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import AuthService from "../../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import { RiEdit2Line, RiDeleteBin6Line } from "react-icons/ri";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import Translation from "../../translations/PackagePathology.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { CurrencyContext } from "../../context/CurrencyProvider";

const ConsultationPriceSetup = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedPackageID, setSelectedPackageID] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [packageName, setPackageName] = useState("");
  const currentUser = AuthService.getCurrentUser();
  const [doctors, setDoctors] = useState([]);

  const [currency, setCurrency] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState({});

  const { t } = useTranslation();

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        }/api/DiagnosticsDeletePackageTest/${selectedPackageID}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success(t("packageDeletedSuccessfully"));
        // fetchPackages();
        handleCloseDeleteModal();
        resetForm();
      })
      .catch((error) => {
        console.error(error);
        toast.error(t("errorDeletingPackage"));
        handleCloseDeleteModal();
      });
  };

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor); // Store full doctor data
    setCurrency(doctor.consultationCurrency || "");
    setFormData({
      ...formData,
      consultationFee: doctor.consultationFee || 0,
      discount: doctor.discount || 0,
      finalPrice:
        doctor.consultationFee -
        (doctor.consultationFee * (doctor.discount || 0)) / 100,
    });
    setShowModal(true);
  };

  const handleEditClick22 = (doctor) => {
    setSelectedPackageID(doctor.id);
    setSelectedDoctor(doctor);
    setCurrency(doctor.consultationCurrency || "");
    setFormData({
      ...formData,
      MRPOfPackage: doctor.consultationFee || 0,
      discount: doctor.discount || 0,
      finalPrice:
        doctor.consultationFee -
        (doctor.consultationFee * (doctor.discount || 0)) / 100,
    });
    setShowModal(true);
    // axios
    //   .get(
    //     `${import.meta.env.VITE_API_URL}/api/DiagnosticsSelectedTests/${doctor.id}`,
    //     {
    //       headers: {
    //         Authorization: `${currentUser?.Token}`,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     setSelectedTests(response.data);
    //     const selectedAllTests = response.data.map((option) => ({
    //       value: option.TestName,
    //       TestId: option.TestId,
    //       category: option.category,
    //       testType: option.testType,
    //       label: option.TestName,
    //     }));
    //     setFormData({
    //       ...formData,
    //        consultationFee:
    //       discount: TestPackage: doctor.discount,

    //     });

    //     setShowModal(true);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };

  const handleEditClick2 = (TestPackage) => {
    setSelectedPackageID(TestPackage.id);
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/DiagnosticsSelectedTests/${
          TestPackage.id
        }`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        setSelectedTests(response.data);
        const selectedAllTests = response.data.map((option) => ({
          value: option.TestName,
          TestId: option.TestId,
          category: option.category,
          testType: option.testType,
          label: option.TestName,
        }));
        setFormData({
          ...formData,
          selectedTests: selectedAllTests,
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
      MRPOfPackage: 0,
      discount: 0,

      finalPrice: 0,
    });
  };

  const [formData, setFormData] = useState({
    packageName: "",
    selectedTests: [],
    MRPOfPackage: 0,
    consultationFee: 0,
    discount: 0,
    finalPrice: 0,
  });
  const [testOptions, setTestOptions] = useState([]);
  const [packages, setPackages] = useState([]);
  console.log("selectedPackageID=", selectedPackageID);
  useEffect(() => {
    if (selectedPackageID !== null) {
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/DiagnosticsSelectedTests/${selectedPackageID}`,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = { ...formData, [name]: value };

    if (name === "discount" || name === "consultationFee") {
      const fee =
        parseFloat(
          name === "consultationFee" ? value : formData.consultationFee
        ) || 0;

      const discount =
        parseFloat(name === "discount" ? value : formData.discount) || 0;

      updatedForm.finalPrice = fee - (fee * discount) / 100;
    }

    setFormData(updatedForm);
  };

  const handleInputChange2 = (e) => {
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
    setFormData({
      ...formData,
      selectedTests,
    });
  };

  const fetchDoctors = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/getDoctorData`;
      const newUrl = "http://localhost:8080/api/getDoctors";
      const response = await axios.get(newUrl, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      });
      setDoctors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSave = async () => {
    // if (formData.selectedTests.length < 1) {
    //   toast.error(t("pleaseSelectAtLeastOneTest"));
    //   return;
    // }
    if (!currency) {
      toast.error(t("SelectCurrency"));
      return;
    }

    if (!formData.consultationFee) {
      toast.error(t("EnterConsultationFee"));
      return;
    }

    if (!selectedDoctor.username) {
      return;
    }

    if (formData.discount < 0 || !formData.discount) {
      toast.error(t("pleaseEnterCorrectDiscount"));
      return;
    }

    console.log(formData);

    const postData = {
      username: selectedDoctor.username,
      consultationFee: formData.consultationFee,
      discount: formData.discount,
      consultationCurrency: currency,
    };

    // const url = "http://localhost:8080/api/saveDoctor";

    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const REMOTE_URL = `${API_BASE_URL}/api/saveDoctor`;
    const res = await axios.post(REMOTE_URL, postData, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    });

    if (res.status !== 200 && res.status !== 201) {
      toast.error("FailedToUpdateDoctor");
      return;
    }

    toast.success("DoctorDetailsUpdated");
    setShowModal2(false);
    setShowModal(false);
    fetchDoctors();
    return;
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
        <h2 style={{ fontSize: "16px" }}>{t("SetDoctorConsultationPrice")}</h2>
      </header>
      <br></br>
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
              <Th style={{ textAlign: "center" }}>{t("DoctorName")}</Th>
              <Th style={{ textAlign: "center" }}>{t("Fees")}</Th>
              <Th style={{ textAlign: "center" }}>
                {t("createPackagePathologyTable.discount")}
              </Th>
              <Th style={{ textAlign: "center" }}>{t("TotalFees")}</Th>
              <Th style={{ textAlign: "center" }}>
                {t("createPackagePathologyTable.action")}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {doctors.map((doctor) => (
              <Tr key={doctor.id}>
                <Td style={{ textAlign: "center" }}>{doctor.id}</Td>
                <Td style={{ textAlign: "center" }}>
                  {doctor.FirstName ||
                    "" + " " + doctor.MiddleName ||
                    "" + " " + doctor.LastName ||
                    ""}
                </Td>
                <Td style={{ textAlign: "center" }}>
                  {selectedGlobalCurrency}{" "}
                  {convertCurrency(
                    doctor.consultationFee,
                    doctor.consultationCurrency,
                    selectedGlobalCurrency
                  )}
                </Td>
                <Td style={{ textAlign: "center" }}>{doctor.discount}</Td>
                <Td style={{ textAlign: "center" }}>
                  {selectedGlobalCurrency}{" "}
                  {convertCurrency(
                    doctor.consultationFee -
                      (doctor.consultationFee * doctor.discount) / 100,
                    doctor.consultationCurrency,
                    selectedGlobalCurrency
                  )}
                </Td>

                <Td style={{ textAlign: "center" }}>
                  <Button
                    style={{
                      fontSize: "12px",
                      marginTop: "0px",
                      padding: "4px 5px",
                    }}
                    title="Edit Package "
                    onClick={() => handleEditClick(doctor)}
                    className="btn btn-secondary mr-2"
                  >
                    <FaPencilAlt />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <Modal centered show={showModal} size="lg" backdrop="static">
        <Modal.Header>
          <Modal.Title style={{ fontSize: "18px" }}>
            {t("UpdateDoctorConsultationFee")}
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
                {t("DoctorName")}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  required
                  type="text"
                  placeholder={t("EnterDoctorName")}
                  name="doctorName"
                  value={`${selectedDoctor.FirstName || ""} ${
                    selectedDoctor.MiddleName || ""
                  } ${selectedDoctor.LastName || ""}`}
                  onChange={handleInputChange}
                  disabled
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
              controlId="consultationFee"
            >
              <Form.Label column sm="4">
                {t("ConsultationFees")}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
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
              <Col sm="5">
                <Form.Control
                  type="number"
                  placeholder={t("EnterConsultationFee")}
                  name="consultationFee"
                  value={formData.consultationFee}
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
              controlId="ConsultationFees"
            >
              <Form.Label column sm="4">
                {t("ConsultationFees")}
                <span style={{ color: "red" }}>*</span>
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
          <Table
            style={{ textAlign: "center" }}
            striped
            bordered
            hover
            responsive
          >
            <thead>
              <tr>
                {/*               <th style={{ textAlign: "center" }}>ID</th> */}
                <th style={{ textAlign: "center" }}>{t("testName")}</th>
                {/*               <th style={{ textAlign: "center" }}>Test Type</th> */}
                <th style={{ textAlign: "center" }}>{t("testID")}</th>
              </tr>
            </thead>
            <tbody>
              {selectedTests.map((test) => (
                <tr key={test.id}>
                  {/* <td style={{ textAlign: "center" }}>{test.id}</td> */}
                  <td style={{ textAlign: "center" }}>{test.TestName}</td>
                  {/* <td style={{ textAlign: "center" }}>{test.testType}</td> */}

                  <td style={{ textAlign: "center" }}>{test.TestId}</td>
                </tr>
              ))}
            </tbody>
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
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        style={{ marginTop: "20px", fontSize: "12px" }}
        centered
        backdrop="static"
        show={showDeleteModal}
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
    </div>
  );
};

export default ConsultationPriceSetup;
