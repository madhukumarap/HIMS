import Barcode from "react-barcode";
import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import AuthService from "../services/auth.service";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import JsBarcode from "jsbarcode";
import "./print-styles.css";
import Datepickrange from "./DateRangeCalender";

import {
  Modal,
  Button,
  Form,
  Table,
  InputGroup,
  FormControl,
  Card,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Translation from "../translations/SampleCollection.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

function SampleCollectionForm() {
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
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [testType, setTestType] = useState("fast");
  const [remarks, setRemarks] = useState("");
  const [sampleLocation, setSampleLocation] = useState("");
  const [selectedTestNames, setSelectedTestNames] = useState([]);
  const [testData, setTestData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowIndexInModal, setSelectedRowIndexInModal] = useState(null);
  const today = new Date();

  const [startDate, setStartDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
  );
  const [endDate, setEndDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
  );
  const [showLabSample, setShowLabSample] = useState(true);
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };
  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };
  const handleLabSampleChange = (e) => {
    setShowLabSample(e.target.checked);
  };

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
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllPathologyTests`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        const options = response.data.tests.map((test) => ({
          value: test.testName,
          label: test.testName,
        }));
        setTestData(options);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const [sampleData, setSampleData] = useState({
    sampleName: "",
    sampleDate: "",
    sampleTime: "",
    sampleTakerName: "",
    selectedTestNames: "",
  });
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewReCollectionDate, setViewReCollectionDate] = useState("");
  const [viewReCollectionTime, setViewReCollectionTime] = useState("");
  const [showViewReCollectionModal, setShowViewReCollectionModal] =
    useState(false);
  const currentDate = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format

  const handleViewReCollection = (reCollectionDate, reCollectionTime) => {
    setViewReCollectionDate(reCollectionDate);
    setViewReCollectionTime(reCollectionTime);
    setShowViewReCollectionModal(true); // Show the modal for viewing reCollection date and time
  };

  const generateBarcode = (test) => {
    const firstWord = test.label.split(" ")[0]; // Assuming label contains the test name
    const barcodeValue =
      firstWord + currentDate.replace(/-/g, "") + "PID" + selectedPatient;
    return barcodeValue;
  };

  // const downloadBarcode = (test) => {
  //   const barcodeValue = generateBarcode(test);
  //   // Use a library or method to trigger a download of the barcode (e.g., FileSaver.js)
  // };

  const [editBookingId, setEditBookingId] = useState(null); // To store the ID of the booking being edited
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const [reCollectionId, setReCollectionId] = useState(null);
  const [reCollectionForm, setReCollectionForm] = useState({
    reCollection: "no",
    reCollectionDate: "",
    reCollectionTime: "",
  });
  const [showReCollectionModal, setShowReCollectionModal] = useState(false);
  const handleReCollection = (bookingId) => {
    setReCollectionId(bookingId);
    setShowReCollectionModal(true);
  };
  const findPatientID = (id) => {
    const patient = patients.find((patient) => patient.id === id);
    return patient ? patient.PatientID : null;
  };
  const handleSaveBarcodes = (selectedRow) => {
    if (selectedRow !== null) {
      const barcodeValues = filteredBookings[selectedRow]?.sampleName
        .split(",")
        .map((testName) => {
          const firstWord = testName.trim().split(" ")[0];
          return (
            firstWord +
            currentDate.replace(/-/g, "") +
            "PID" +
            filteredBookings[selectedRow].PatientID
          );
        });

      // Join barcode values with the selectedRow number and send to Node.js
      const dataToSend = {
        barcodes: barcodeValues.join(", "),
        selectedRowID: filteredBookings[selectedRow]?.id,
      };

      // alert(dataToSend.selectedRow);
      // return;
      // Send the data to your Node.js server using Axios or any other method
      axios
        .put(
          `${
            import.meta.env.VITE_API_URL
          }/api/updateSampleBookingBarcodeValue/${dataToSend.selectedRowID}`,
          dataToSend,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          // Handle the response from the server
          toast.success("Barcodes saved");
          getData();
          console.log("Barcodes saved:", response.data);
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error saving barcodes:", error);
        });
    }
  };

  const handleReCollectionSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      reCollection: reCollectionForm.reCollection,
      reCollectionDate: reCollectionForm.reCollectionDate,
      reCollectionTime: reCollectionForm.reCollectionTime,
    };

    //alert(reCollectionId);
    //return;
    axios
      .put(
        `${
          import.meta.env.VITE_API_URL
        }/api/updateSampleBookingRecollectionDate/${reCollectionId}`,
        dataToSend,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        console.log("Re-collection data updated successfully:", response.data);
        setShowReCollectionModal(false);
        toast.success("Re-collection data updated successfully");
        getData(); // Fetch updated data after successful update
      })
      .catch((error) => {
        toast.error("Failed to update re-collection data");
        console.error("Error updating re-collection data:", error);
      });
  };

  const handleDeleteConfirmation = (bookingId) => {
    setDeleteConfirmationId(bookingId); // Show the confirmation for the provided booking ID
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteConfirmed = (bookingId) => {
    axios
      .delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/deleteSampleTestBooking/${bookingId}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        console.log("Sample data deleted successfully:", response.data);
        setDeleteConfirmationId(null); // Hide the confirmation modal
        toast.success("Sample data deleted successfully");
        getData(); // Fetch updated data after successful delete
      })
      .catch((error) => {
        toast.error("Failed");
        console.error("Error deleting sample data:", error);
      });
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllBookingsTest`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPatients(response?.data?.bookings);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllSampleBookingsTest`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setBookings(response.data.bookings);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getData = () => {
    // Fetch updated data after successful PUT
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllSampleBookingsTest`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setBookings(response.data.bookings);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const filtered = bookings.filter((booking) =>
      booking.PatientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

  const filteredBookings2 = bookings.filter((booking) => {
    // Filter by date range
    const bookingDate = new Date(booking.createdAt);
    const startDateTime = startDate ? new Date(startDate) : null;
    const endDateTime = endDate ? new Date(endDate) : null;

    if (startDateTime && bookingDate < startDateTime) return false;
    if (endDateTime && bookingDate > endDateTime) return false;

    // Filter by sample location (Lab Sample)
    if (showLabSample && booking.sampleLocation !== "Lab Sample") return false;

    // Filter by patient name
    if (
      searchTerm &&
      !booking.PatientName.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    return true;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const selectedTestNamesArray = selectedTestNames.map(
      (selectedOption) => selectedOption.value
    );
    let sampleNames = "";
    for (let i = 0; i < selectedTestNamesArray.length; i++) {
      if (i === selectedTestNamesArray.length - 1) {
        sampleNames = sampleNames + selectedTestNamesArray[i];
      } else {
        sampleNames = sampleNames + selectedTestNamesArray[i] + ",";
      }
    }

    const patientID = findPatientID(parseInt(selectedPatient, 10));
    const dataToSend = {
      ...sampleData,
      patientId: patientID,
      sampleName: sampleNames,

      testType,
      remarks,
    };
    dataToSend.sampleLocation = sampleLocation;
    dataToSend.PathologyTestBookingId = parseInt(selectedPatient);
    const sampleNamesArray = dataToSend.sampleName.split(",");
    let barcodeValues = ""; // Initialize barcodeValues

    for (let i = 0; i < sampleNamesArray.length; i++) {
      const testName = sampleNamesArray[i].trim();
      const firstWord = testName.split(" ")[0];
      const currentDate = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, ""); // Get current date in yyyymmdd format

      const barcodeValue = `${firstWord}${currentDate}PID${selectedPatient}`;

      if (i !== 0) {
        barcodeValues += ","; // Add comma separator if it's not the first test
      }

      barcodeValues += barcodeValue;
    }

    dataToSend.barcodeValues = barcodeValues;

    // alert(barcodeValues);
    // return;
    //alert(barcodeValues);
    //  alert(dataToSend.sampleName);

    if (editBookingId) {
      // alert(editBookingId);
      // If editBookingId is set, it means we're editing an existing entry
      axios
        .put(
          `${
            import.meta.env.VITE_API_URL
          }/api/updateSampleBooking/${editBookingId}`,
          dataToSend,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          console.log("Sample data updated successfully:", response.data);
          setShowModal(false);
          toast.success("Sample data updated successfully");
          getData();
          resetForm();
        })
        .catch((error) => {
          toast.error("Failed");
          console.error("Error updating sample data:", error);
        });
    } else {
      // If editBookingId is not set, it means we're creating a new entry
      // alert(selectedPatient);
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/testSampleBooking`,
          dataToSend,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          console.log("Sample data created successfully:", response.data);
          setShowModal(false);
          resetForm();
          getData();
          if (response.status === 200) {
            toast.success("Data Saved Successfully");
          }
          // alert();
          console.log("Sample data created successfully:", response.data);
          if (response.data.includes("Sample for")) {
            toast.error(response.data);
          } else {
            toast.success("Sample Collected data saved");
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data);
          console.error("Error creating sample data:", error);
        });
    }
  };

  const downloadBarcode = (barcodeValue) => {
    // Create a hidden canvas element
    // alert(barcodeValue);
    const canvas = document.createElement("canvas");
    canvas.style.display = "none";
    document.body.appendChild(canvas);

    // Generate the barcode image using JsBarcode library
    JsBarcode(canvas, barcodeValue, {
      format: "CODE128", // Specify the barcode format
      displayValue: true, // Show the barcode value as text
      fontSize: 16, // Adjust the font size as needed
      margin: 10, // Adjust the margin as needed
    });

    // Convert canvas to data URL
    const dataURL = canvas.toDataURL("image/png");

    // Create a download link and trigger the download
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = `${barcodeValue}.png`; // Set the filename
    a.style.display = "none"; // Hide the link
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    document.body.removeChild(canvas);
  };

  // Example usage:
  //downloadBarcode("123456789");

  const resetForm = () => {
    setSelectedPatient(""); // Reset selectedPatient to empty string
    setTestType("fast"); // Reset testType to 'fast'
    setRemarks("");
    setSampleLocation("");
    setSelectedTestNames("");
    setSampleData({
      sampleName: "",
      sampleDate: "",
      sampleTime: "",
      sampleTakerName: "",
    });
  };

  const handleCreateNew = () => {
    setEditBookingId(null); // Reset editBookingId to indicate creating new entry
    setShowModal(true);
  };

  const handleEdit = (bookingId) => {
    setEditBookingId(bookingId); // Set the ID of the booking to be edited
    const bookingToEdit = bookings.find((booking) => booking.id === bookingId);
    //alert(JSON.stringify(bookingToEdit));
    const selectedPatient1 =
      "PID:" +
      bookingToEdit.PatientID +
      "," +
      bookingToEdit.PatientName +
      " (" +
      bookingToEdit.PatientPhoneNo +
      ")";

    setSelectedPatient(bookingToEdit.PatientID);
    setSampleLocation(bookingToEdit.sampleLocation);
    setIsEditMode(true);
    setTestType(bookingToEdit.testType);
    setRemarks(bookingToEdit.remarks);
    const selectedTestNamesArray = bookingToEdit.sampleName
      .split(",")
      .map((testName) => ({ value: testName, label: testName }));
    setSelectedTestNames(selectedTestNamesArray);
    setSampleData({
      sampleName: bookingToEdit.sampleName,
      sampleDate: bookingToEdit.sampleDate,
      sampleTime: bookingToEdit.sampleTime,
      selectedTestNames: bookingToEdit.sampleName.split(","),
      sampleTakerName: bookingToEdit.sampleTakerName,
    });

    setShowModal(true); // Open the modal for editing
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
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_PATHOLOGISTADMIN") &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_COLLECTIONTECHNICIAN")
  ) {
    return "Access Denied";
  }

  return (
    <div style={{ fontSize: "12px" }} className="container mt-0">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{t("SampleCollectedList")}</h2>
      </header>
      <br />
      <Button
        style={{ fontSize: "12px" }}
        variant="secondary"
        onClick={handleCreateNew}
      >
        {t("GenerateBarcode")}
      </Button>{" "}
      {/* <Link to={"/Pathologytest"}>
        <button
          style={{ marginLeft: "10px", fontSize: "12px" }}
          className="btn btn-primary btn"
        >
          Go Back
        </button>
      </Link> */}
      <Modal
        style={{ fontSize: "13px" }}
        backdrop="static"
        size="lg"
        style={{ marginTop: "20px" }}
        centered
        show={showModal}
        onHide={() => {
          setShowModal(false);
          resetForm();
          setIsEditMode(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("generatebarcodeModal.GenerateBarcodeForTestSample")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label style={{ fontWeight: "bold" }}>
                    {t("generatebarcodeModal.SelectPatient")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    style={{ fontSize: "12px", marginTop: "10px" }}
                    value={selectedPatient}
                    onChange={(e) => {
                      setSelectedPatient(e.target.value);

                      // Update selectedTestNames based on the selected patient
                      const selectedPatientObject = patients.find(
                        (patient) => patient.id === parseInt(e.target.value)
                      );
                      //  alert(selectedPatientObject);
                      if (
                        selectedPatientObject &&
                        selectedPatientObject?.selectedTests
                      ) {
                        // alert("hello2");
                        const selectedTestNamesArray =
                          selectedPatientObject?.selectedTests
                            .split(",")
                            .map((testName) => ({
                              value: testName.trim(),
                              label: testName.trim(),
                            }));
                        setSelectedTestNames(selectedTestNamesArray);
                      }
                    }}
                    required
                    disabled={isEditMode}
                  >
                    <option value="">
                      {t("generatebarcodeModal.SelectPatient")}
                    </option>
                    {patients
                      .filter(
                        (patient) =>
                          patient.PaymentStatus === "Paid" &&
                          patient.status !== "Completed"
                      )
                      .map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          PID:{patient.PatientID}, {patient.PatientName} (
                          {patient.PatientPhoneNo})
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {t("generatebarcodeModal.SampleLocation")}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    style={{ fontSize: "12px", marginTop: "10px" }}
                    value={sampleLocation}
                    onChange={(e) => setSampleLocation(e.target.value)}
                    required
                  >
                    <option value="">
                      {t("generatebarcodeModal.SelectSampleLocation")}
                    </option>
                    <option value="Lab Sample">
                      {t("generatebarcodeModal.LabSample")}
                    </option>
                    <option value="Home Sample">
                      {t("generatebarcodeModal.HomeSample")}
                    </option>
                  </Form.Control>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {t("generatebarcodeModal.SelectTestNames")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Select
                    isMulti
                    className="custom-Select-picker"
                    options={testData}
                    value={selectedTestNames}
                    onChange={(selectedOptions) =>
                      setSelectedTestNames(selectedOptions)
                    }
                    placeholder={t("generatebarcodeModal.SelectTestNames")}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {t("generatebarcodeModal.SampleDate")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    style={{ fontSize: "12px" }}
                    value={sampleData.sampleDate}
                    onChange={(e) =>
                      setSampleData({
                        ...sampleData,
                        sampleDate: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {t("generatebarcodeModal.SampleTime")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="time"
                    style={{ fontSize: "12px" }}
                    value={sampleData.sampleTime}
                    onChange={(e) =>
                      setSampleData({
                        ...sampleData,
                        sampleTime: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {t("generatebarcodeModal.SampleTakerName")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px" }}
                    placeholder={t("generatebarcodeModal.SampleTakerName")}
                    value={sampleData.sampleTakerName}
                    onChange={(e) =>
                      setSampleData({
                        ...sampleData,
                        sampleTakerName: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {t("generatebarcodeModal.Remarks")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    style={{ fontSize: "12px" }}
                    required
                    placeholder={t("Remarks")}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <br></br>
            <div style={{ textAlign: "center" }}>
              <Button
                style={{ fontSize: "13px" }}
                variant="secondary"
                type="submit"
              >
                {t("generatebarcodeModal.Submit")}
              </Button>
            </div>
          </Form>
          <br></br>

          {selectedTestNames.length > 0 && (
            <div>
              {/* <h5 style={{ fontSize: "16px" }}>
                Download Barcode For Selected Test
              </h5> */}
              <div className="card">
                <div className="card-body">
                  {selectedTestNames.length > 0 && (
                    <div>
                      <h5 style={{ fontSize: "16px" }}>
                        {t(
                          "generatebarcodeModal.DownloadBarcodeForSelectedTest"
                        )}
                      </h5>
                      <div>
                        <div className="card-body">
                          {selectedTestNames.map((test, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center justify-content-between mb-3"
                            >
                              <div>
                                <Barcode value={generateBarcode(test)} />
                              </div>
                              <div>
                                <button
                                  style={{ fontSize: "12px" }}
                                  className="btn btn-secondary"
                                  onClick={() =>
                                    downloadBarcode(generateBarcode(test))
                                  }
                                >
                                  {t("generatebarcodeModal.DownloadBarcode")}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <div className="row">
        <Form.Group className="col-lg-3 col-md-6 col-12 mt-3 mb-3">
          <Form.Label style={{ fontWeight: "bold", fontSize: "12px" }}>
            {t("SearchByPatientName")}
          </Form.Label>
          <InputGroup>
            <FormControl
              style={{ fontSize: "13px" }}
              placeholder={t("SearchByPatientName")}
              aria-label={t("SearchByPatientName")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="col-lg-3 col-md-6 col-12 mt-3 mb-3">
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </Form.Group>
        {/* <Form.Group className="col-3 mt-3 mb-3">
          <Form.Check
            style={{ fontSize: "16px", marginTop: "30px" }}
            type="checkbox"
            label="Lab Sample"
            checked={showLabSample}
            onChange={handleLabSampleChange}
          />
        </Form.Group> */}
      </div>
      {isMobile ? (
        <div className="row">
          {filteredBookings2.map((booking, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {t("sampleCollectTable.PatientName")}: {booking.PatientName}
                  </h5>
                  <p className="card-text">
                    {t("sampleCollectTable.PatientPhoneNo")}:{" "}
                    {booking.PatientPhoneNo}
                  </p>
                  <p className="card-text">
                    {t("sampleCollectTable.SampleName")}: {booking.sampleName}
                  </p>
                  <p className="card-text">
                    {t("sampleCollectTable.SampleLocation")}:{" "}
                    {booking.sampleLocation}
                  </p>
                  <p className="card-text">
                    {t("sampleCollectTable.SampleDate")}: {booking.sampleDate}
                  </p>
                  <p className="card-text">
                    {t("sampleCollectTable.SampleTime")}: {booking.sampleTime}
                  </p>
                  <p className="card-text">
                    {t("sampleCollectTable.SavedBarcodeValues")}:{" "}
                    {booking.BarcodeValuesAllSelectedTest}
                  </p>
                  <p className="card-text">
                    {t("sampleCollectTable.SampleTakerName")}:{" "}
                    {booking.sampleTakerName}
                  </p>
                  <p className="card-text">
                    {t("sampleCollectTable.Remarks")}: {booking.remarks}
                  </p>
                  <p className="card-text">
                    {t("sampleCollectTable.CollectedDate")}:{" "}
                    {formatDate(booking.createdAt)}
                  </p>
                  <div className="btn-group">
                    <button
                      title={t("sampleCollectTable.ViewBarcode")}
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedRowIndexInModal(index);
                        setSelectedRow(index);
                      }}
                    >
                      <FaRegEye />
                    </button>
                    <button
                      title={t("sampleCollectTable.EditCollection")}
                      className="btn btn-secondary"
                      onClick={() => handleEdit(booking.id)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      title={t("sampleCollectTable.Delete")}
                      className="btn btn-secondary"
                      onClick={() => handleDeleteConfirmation(booking.id)}
                    >
                      <FaTrashAlt />
                    </button>
                    {booking.reCollection === "yes" ? (
                      <button
                        title={t("sampleCollectTable.ViewRecollectionDateTime")}
                        className="btn btn-secondary"
                        onClick={() =>
                          handleViewReCollection(
                            booking.reCollectionDate,
                            booking.reCollectionTime
                          )
                        }
                      >
                        <FaRegEye />
                      </button>
                    ) : (
                      <button
                        title={t("sampleCollectTable.AddRecollectionDateTime")}
                        className="btn btn-secondary"
                        onClick={() => handleReCollection(booking.id)}
                      >
                        <FaPlus />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table
          style={{ textAlign: "center" }}
          responsive
          striped
          bordered
          hover
        >
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("sampleCollectTable.SrNo")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("sampleCollectTable.PatientName")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("sampleCollectTable.PatientPhoneNo")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("sampleCollectTable.SampleName")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("sampleCollectTable.SampleLocation")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("sampleCollectTable.SampleDate")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("sampleCollectTable.SampleTime")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("sampleCollectTable.SavedBarcodeValues")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("sampleCollectTable.SampleTakerName")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("sampleCollectTable.Remarks")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("sampleCollectTable.CollectedDate")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
    {t("sampleCollectTable.Barcode")}
  </th> */}
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("sampleCollectTable.Action")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("sampleCollectTable.ReCollection")}</th> */}
              {/* <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
    {t("sampleCollectTable.ReCollection")}
  </th> */}
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {filteredBookings2.map((booking, index) => (
              <tr key={index}>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {index + 1}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {booking.PatientName}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {booking.PatientPhoneNo}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {booking.sampleName}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {booking.sampleLocation}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {booking.sampleDate}
                </td>
                <td style={{ textAlign: "center" }}>{booking.sampleTime}</td>
                <td style={{ textAlign: "center" }}>
                  {booking.BarcodeValuesAllSelectedTest}
                </td>

                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {booking.sampleTakerName}
                </td>

                <td style={{ textAlign: "center" }}>{booking.remarks}</td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {formatDate(booking.createdAt)}
                </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  <button
                    title={t("sampleCollectTable.ViewBarcode")}
                    style={{
                      fontSize: "13px",
                      marginTop: "0px",
                      padding: "4px 5px",
                    }}
                    className="btn btn-secondary mr-2"
                    onClick={() => {
                      setSelectedRowIndexInModal(index);
                      setSelectedRow(index);
                    }}
                  >
                    <FaRegEye />
                  </button>
                  <button
                    title={t("sampleCollectTable.EditCollection")}
                    style={{
                      marginTop: "0px",
                      fontSize: "13px",
                      padding: "4px 5px",
                    }}
                    className="btn btn-secondary mr-2"
                    onClick={() => handleEdit(booking.id)}
                  >
                    <FaPencilAlt />
                  </button>{" "}
                  <Button
                    title={t("sampleCollectTable.Delete")}
                    style={{
                      marginTop: "0px",
                      fontSize: "13px",
                      padding: "4px 5px",
                    }}
                    className="btn btn-secondary mr-2"
                    onClick={() => handleDeleteConfirmation(booking.id)}
                  >
                    <FaTrashAlt />
                  </Button>
                  {/* </td>
  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}> */}
                  {booking.reCollection === "yes" ? (
                    <Button
                      title={t("sampleCollectTable.ViewRecollectionDateTime")}
                      style={{
                        fontSize: "13px",
                        marginTop: "0px",
                        padding: "4px 5px",
                      }}
                      className="btn btn-secondary"
                      onClick={() =>
                        handleViewReCollection(
                          booking.reCollectionDate,
                          booking.reCollectionTime
                        )
                      }
                    >
                      <FaRegEye />
                    </Button>
                  ) : (
                    <Button
                      title={t("sampleCollectTable.AddRecollectionDateTime")}
                      style={{
                        fontSize: "13px",
                        marginTop: "0px",
                        padding: "4px 5px",
                      }}
                      className="btn btn-secondary mr-2"
                      onClick={() => handleReCollection(booking.id)}
                    >
                      <FaPlus />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal
        style={{ fontSize: "13px" }}
        backdrop="static"
        style={{ marginTop: "20px" }}
        centered
        size="lg"
        show={selectedRow !== null}
        onHide={() => setSelectedRow(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            Barcode Of selected Test
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedRow !== null && (
            <>
              {filteredBookings2[selectedRow]?.sampleName
                .split(",")
                .map((testName, index) => {
                  const firstWord = testName.trim().split(" ")[0];
                  // alert(filteredBookings[selectedRow]?.sampleName);
                  return (
                    <div key={index}>
                      <Barcode
                        value={
                          firstWord +
                          currentDate.replace(/-/g, "") + // Remove hyphens from the date
                          "PID" +
                          filteredBookings[selectedRow].PatientID
                        }
                        style={{
                          maxWidth: "100%", // Set a maximum width
                          height: "auto", // Auto-adjust height to maintain aspect ratio
                          display: "block", // Ensure the barcode is treated as a block element
                          margin: "0 auto", // Center align the barcode
                        }}
                      />
                      <div className="d-flex justify-content-end">
                        <button
                          style={{ fontSize: "12px" }}
                          className="btn btn-primary justify-content-end"
                          onClick={() =>
                            downloadBarcode(
                              firstWord +
                                currentDate.replace(/-/g, "") + // Remove hyphens from the date
                                "PID" +
                                filteredBookings[selectedRow].PatientID
                            )
                          }
                        >
                          {t("generatebarcodeModal.DownloadBarcode")}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            style={{ fontSize: "12px" }}
            className="btn btn-info"
            onClick={() => handleSaveBarcodes(selectedRowIndexInModal)}
          >
            Save Barcodes
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={deleteConfirmationId !== null}
        onHide={() => setDeleteConfirmationId(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "12px" }}>
          Are you sure you want to delete this booking?
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "12px" }}
            variant="secondary"
            onClick={() => setDeleteConfirmationId(null)}
          >
            Cancel
          </Button>
          <Button
            style={{ fontSize: "12px" }}
            variant="danger"
            onClick={() => handleDeleteConfirmed(deleteConfirmationId)} // Call handleDeleteConfirmed with the booking ID
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        style={{ fontSize: "13px" }}
        backdrop="static"
        style={{ marginTop: "20px" }}
        centered
        show={showReCollectionModal}
        onHide={() => {
          setShowReCollectionModal(false);
          setReCollectionForm({
            reCollection: "yes",
            reCollectionDate: "",
            reCollectionTime: "",
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>Re-collection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReCollectionSubmit}>
            <Form.Group>
              <Form.Label>Re-collection</Form.Label>
              <Form.Control
                as="select"
                style={{ fontSize: "13px" }}
                value={reCollectionForm.reCollection}
                onChange={(e) =>
                  setReCollectionForm({
                    ...reCollectionForm,
                    reCollection: e.target.value,
                  })
                }
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Re-collection Date</Form.Label>
              <Form.Control
                type="date"
                style={{ fontSize: "13px" }}
                value={reCollectionForm.reCollectionDate}
                onChange={(e) =>
                  setReCollectionForm({
                    ...reCollectionForm,
                    reCollectionDate: e.target.value,
                  })
                }
                disabled={reCollectionForm.reCollection === "no"}
                required={reCollectionForm.reCollection === "yes"}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Re-collection Time</Form.Label>
              <Form.Control
                type="time"
                style={{ fontSize: "13px" }}
                value={reCollectionForm.reCollectionTime}
                onChange={(e) =>
                  setReCollectionForm({
                    ...reCollectionForm,
                    reCollectionTime: e.target.value,
                  })
                }
                disabled={reCollectionForm.reCollection === "no"}
                required={reCollectionForm.reCollection === "yes"}
              />
            </Form.Group>
            <br></br>
            <Button
              style={{ fontSize: "13px" }}
              variant="secondary"
              type="submit"
            >
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        style={{ fontSize: "13px" }}
        backdrop="static"
        style={{ marginTop: "20px" }}
        centered
        show={showViewReCollectionModal}
        onHide={() => setShowViewReCollectionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            View Re-collection Date and time
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Re-collection Date:</strong> {viewReCollectionDate}
          </p>
          <p>
            <strong>Re-collection Time:</strong> {viewReCollectionTime}
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default SampleCollectionForm;
