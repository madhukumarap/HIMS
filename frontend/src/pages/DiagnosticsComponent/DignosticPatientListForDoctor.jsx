import jsPDF from "jspdf";
import { IoPrintSharp, IoDownload, IoCloudDownload } from "react-icons/io5";
import Select from "react-select";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Col, Button, Table, Card } from "react-bootstrap";
import axios from "axios";
import Datepickrange from "../DateRangeCalender";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  FaPencilAlt,
  FaPlus,
  FaTrashAlt,
  FaRegEye,
  FaPlusSquare,
  FaDownload,
} from "react-icons/fa";
import AddResultModalForBloodSugarForFastingTest from "../DiagnosticsComponent/AddResultDiagnosticReport";
import DownloadPDFButton from "../DiagnosticsComponent/DownloadResultDiagnosticReport";
import UploadDiagnosticImages from "../DiagnosticsComponent/UploadDiagnosticImages";
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../../services/auth.service";
import DiagnosticPackageView from "./DiagnosticViewPackage";

import Translation from "../../translations/DiagnosticsBookingManagement.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

function DiagnosticsBooking() {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const [testBookingID, setTestBookingID] = useState(null);
  const [selectedPackageID, setSelectedPackageID] = useState(null);
  const [PackageSelectedTests, setPackageSelectedTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [currency, setCurrency] = useState("");
  const [exchangeRates, setExchangeRates] = useState(null);
  const [inOutPatient, setInOutPatient] = useState(undefined);
  const [hospitalBookings, setHospitalBookings] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getallPaitents`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getHospitalAdmissionList`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setHospitalBookings(response.data.data);
        console.log("443", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  
  const [totalFees, setTotalFees] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    status: "Registered",
    id: null,
    lapName: "NA",
    PatientID: "",
    remarks: "",
    instrumentsUsed: "",
    selectedTests: [],
    selectedPatient: "",
    testFees: "",
    results: "",
    TestManagementID: "",
    commissionType: "NA",
    paymentStatus: "",
    paymentDate: "",
    commissionValue: "NA",
    Currency: "",
    TotalFees: "",
  });
  localStorage.removeItem("reloadCounts");

  const handleChange1 = (e) => {
    let patient = JSON.parse(e.target.value);
    console.log("patient :", patient);
    if (inOutPatient == "InPatient") {
      setFormData({
        ...formData,
        admissionID: patient.id,
        PatientID: patient.PatientID,
        selectedPatient: patient.PatientID,
      });
    } else {
      setFormData({
        ...formData,
        PatientID: patient.PatientID,
        selectedPatient: patient.PatientID,
      });
    }
  };
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/GetExchangeRates/USD`
        );

        const exchangeRatesData = response.data.exchangeRatesData;
        const firstCurrencyData = exchangeRatesData[0].data;
        const rates = firstCurrencyData.rates;
        setExchangeRates(rates);
        //  alert(JSON.stringify(response.data.rates["CDF"]));
      } catch (error) {
        console.error(error);
      }
    };

    fetchExchangeRates();
  }, []);

  //update autorization
  const [PatientNapeStatus, setPatientNapeStatus] = useState("");

  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [authorizationStatus, setAuthorizationStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const handleUpdateAuthorizationStatus = (row) => {
    setSelectedRowId(row.id);
    setAuthorizationStatus(row?.Authorization);
    setFeedback(row?.feedback);
    setPatientNapeStatus(row.PatientName + " (" + row.PatientPhoneNo + ")");
    setShowAuthorizationModal(true);
  };
  const handleUpdateAuthorization = () => {
    if (!authorizationStatus) {
      toast.error(t("PleaseSelectStatus"));
      return;
    }
    if (!feedback) {
      toast.error(t("PleaseAddFeedback"));
      return;
    }
    const data = {
      id: selectedRowId,
      authorizationStatus,
      feedback,
    };

    // alert(JSON.stringify(data));

    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/updateAuthorizationDiagnostic`,
        data,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        if (response.status == 200) {
          toast.success(t("Authorizationstatusupdatedsuccessfully"));
          fetchBookings();
        } else {
          // There was an error updating the authorization status
          toast.error("Error updating authorization status. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error updating authorization status:", error);
        toast.error("An error occurred. Please try again later.");
      })
      .finally(() => {
        setShowAuthorizationModal(false);
        setSelectedRowId(null);
        setAuthorizationStatus("");
        setFeedback("");
      });
  };
  useEffect(() => {
    if (formData.paymentStatus === "Paid" && currency && exchangeRates) {
      const selectedCurrencyRate = exchangeRates[currency];
      // alert(formData.testFees);
      const fees = selectedPackageObject?.finalPrice
        ? parseInt(selectedPackageObject.finalPrice) +
          parseInt(formData.testFees)
        : formData.testFees;
      const totalFeesInSelectedCurrency = fees * selectedCurrencyRate;
      // alert(totalFeesInSelectedCurrency);
      const formattedTotalFees = totalFeesInSelectedCurrency.toFixed(2);

      setTotalFees(formattedTotalFees);
    } else {
      setTotalFees(null);
    }
  }, [currency, formData.testFees]);

  const [testNames, setTestNames] = useState([]);
  const [enterCodeData, setEnterCodeData] = useState([]);
  const [selectedReportData, setSelectedReportData] = useState(null);
  //////////////////////////////////////////////////////////////////////////////////
  const [selectedTestBooking, setSelectedTestBooking] = useState(null);
  const [showTestNamesModal, setShowTestNamesModal] = useState(false);

  // Create a function to handle the View button click
  const [testStatuses, setTestStatuses] = useState([]);

  ///

  const { t } = useTranslation();

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
    const intervalId = setInterval(initializei18n, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  ///

  // Function to fetch test statuses
  const fetchTestStatuses = async (bookingId) => {
    try {
      // alert(bookingId);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/DiagnosticTestStatuses/${bookingId}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setTestStatuses(data);
      console.log("testStatuses", testStatuses);
      // alert(JSON.stringify(testStatuses));
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };
  const handleViewTestNames = (testBooking) => {
    setSelectedTestBooking(testBooking);
    const bookingId = testBooking.id;

    // Fetch test statuses
    fetchTestStatuses(bookingId);
    //alert();
    setShowTestNamesModal(true);
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
        console.error(error);
      });
  }, []);
  useEffect(() => {
    if (selectedPackageID !== null) {
      // alert(selectedPackageID);
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
          console.log("PackageData List" + JSON.stringify(response.data));
          setPackageSelectedTests(response.data);
          const transformedOptions = PackageSelectedTests.map((test) => ({
            value: test.TestName,
            label: test.TestName,
            TestManagementID: test.TestId,
          }));

          // setSelectedTests(transformedOptions);
          // // alert(transformedOptions[0].TestManagementID);
          // setFormData((prevFormData) => ({
          //   ...prevFormData,
          //   selectedTests: transformedOptions.map((option) => option.value),
          // }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedPackageID]);

  const [selectedViewPackageID, setSelectedViewPackageID] = useState(null);

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

  const [selectedPackage, setSelectedPackage] = useState("");
  // const handlePackageSelection = (e) => {
  //   const selectedPackageID = e.target.value;

  //   setSelectedPackage(selectedPackageID);
  //   setSelectedPackageID(selectedPackageID);
  //   // alert(JSON.stringify(transformedOptions));
  // };
  const [selectedPackageObject, setSelectedPackageObject] = useState("");

  const handlePackageSelection = (e) => {
    const selectedPackageID = e.target.value;
    // filteredTestNames();
    const selectedPackageObject = packages?.find(
      (packages) => packages.id === parseInt(selectedPackageID)
    );
    setFormData({
      ...formData,
      selectedTests: [],
      testFees: 0,
    });
    if (!selectedPackageID) {
      setPackageSelectedTests([]);
    }
    setSelectedPackageObject(selectedPackageObject);

    setSelectedPackage(selectedPackageID);
    setSelectedPackageID(selectedPackageID);
    // alert(JSON.stringify(transformedOptions));
  };
  const handleSelectChange = (selectedOptions) => {
    //(JSON.stringify(selectedOptions));

    const selectedTests = selectedOptions.map((option) => option.value);

    // Calculate total test fees
    const totalTestFees = selectedTests.reduce((acc, testName) => {
      const selectedTest = testNames.find((test) => test.testName === testName);
      return acc + (selectedTest ? selectedTest.testPrice : 0);
    }, 0);

    setSelectedTests(selectedOptions);
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedTests: selectedOptions.map((option) => option.value),
      testFees: totalTestFees,
    }));
    //alert(JSON.stringify(formData.selectedTests));
  };
  const handleAddResult = (booking) => {
    if (booking?.PaymentStatus === "Not-Paid") {
      toast.error(t("PaymentNotPaidforthisPatient"));
      return;
    }
    console.log("Selected Report Data:", booking);
    setSelectedReportData(booking);
    //alert(JSON.stringify(booking));
  };

  const handleGenerateReportNew = (testBookingID) => {
    if (testBookingID.status !== "Completed") {
      toast.error(t("ResultNotFound"));
      return;
    }
    setTestBookingID(testBookingID.id);
  };
  const [
    showReportModalBloodSugarFasting,
    setShowReportModalBloodSugarFasting,
  ] = useState(false);
  useEffect(() => {
    if (true && selectedReportData?.selectedTests) {
      setShowReportModalBloodSugarFasting(true);
    } else {
      console.log("Manage The Test Result Fields first");
      setShowReportModalBloodSugarFasting(false);
    }
  }, [selectedReportData]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllDiagnosticTests`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setTestNames(response?.data?.tests || []);
        //alert(JSON.stringify(testNames));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetchEnterCodeData();
  }, []);

  function formatDate2(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const fetchEnterCodeData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/GetEnterCodeList`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setEnterCodeData(data);
    } catch (error) {
      console.error("Error fetching Enter Code data:", error);
    }
  };

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [SelectedTests, setSelectedTests] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null); // To store the ID of the booking being deleted
  const today = new Date();

  const currentDate = new Date();

  const [startDate, setStartDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  );
  // alert(showReportModalBloodForPP);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };

  const filteredBookings = bookings.filter((booking) => {
    const isNameMatch =
      booking.PatientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.PatientPhoneNo.toString().includes(searchQuery) &&
        searchQuery.trim() !== "");

    const isDateMatch =
      (!startDate || new Date(booking.createdAt) >= startDate) &&
      (!endDate || new Date(booking.createdAt) <= endDate);

    return isNameMatch && isDateMatch;
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDoctorData`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const [reportselectedTest, setReportSelectedTest] = useState("");

  const fetchBookings = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getDiagnosticsBooking`, {
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
    fetchBookings();
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getallPaitents`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "selectedTest") {
      // Find the selected test by its name
      const selectedTest = testNames.find((test) => test.testName === value);

      if (selectedTest) {
        // If the test is found, set both the test name and its ID
        setFormData((prevData) => ({
          ...prevData,
          selectedTests: value, // Set the test name
          TestManagementID: selectedTest.id, // Set the test ID
        }));
        setSelectedTests(formData.selectedTests);
      }
    } else if (name === "testFees") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === "results") {
      setFormData((prevData) => ({
        ...prevData,
        results: value,
      }));
    } else if (name === "DoctorSelected") {
      setSelectedDoctor((prevData) => ({
        ...prevData,
        results: value,
      }));
    } else if (name === "referralType") {
      setFormData((prevData) => ({
        ...prevData,
        commissionType: value,
        referralType: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleEdit = (rowData) => {
    //alert(JSON.stringify(rowData.selectedTests));
    //alert(rowData.TestManagementID);
    console.log("Selected Patient ID:", rowData.PatientID);
    console.log("Patients Data:", patients);
    setCurrency(rowData.Currency);

    const selectedTestNamesArray = rowData.selectedTests
      .split(",")
      .map((test) => test.trim());

    // Map the test names to an array of objects with value and label properties
    const selectedTestOptions = selectedTestNamesArray.map((testName) => ({
      value: testName,
      label: testName,
    }));

    // alert(selectedTestNamesArray);
    // return;

    let patient =
      "PID:" +
      rowData?.PatientID +
      "," +
      rowData?.firstName +
      " " +
      rowData?.lastName +
      " (" +
      rowData?.PatientPhoneNo +
      ")";
    // alert(patient);
    setSelectedDoctor(rowData?.doctorId);
    // alert(rowData.commissionType);

    setFormData({
      ...rowData,
      selectedPatient: `${rowData.PatientID}`,
      id: rowData.id,
      testFees: rowData.testFees,
      patientId: `${rowData.PatientID}`,
      selectedTests: selectedTestNamesArray,
      referralType: rowData.commissionType,
      TestManagementID: rowData.TestManagementID,
      paymentDate: rowData.PaymentDate,
      paymentStatus: rowData.PaymentStatus,
    });
    setSelectedTests(rowData.selectedTests);
    // alert(formData.selectedPatient);
    setShowModal(true);
    setIsEditMode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;

      // alert(formData.commissionType);
      //return;
      if (formData.id) {
        // Updating an existing booking
        //alert(formData.id);

        if (formData.paymentStatus === "Not-Paid") {
          formData.paymentDate = "";
          formData.Currency = "";
          // formData.TotalFees = "";
        }

        formData.TotalFees = totalFees;
        formData.Currency = currency;

        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/updateDiagnosticsBooking/${
            formData.id
          }`,
          {
            ...formData,
            patientId: formData?.PatientID,
            testFees: formData?.testFees,
            results: formData?.results,
            doctorID: selectedDoctor,
            selectedTest: formData?.selectedTests,
            TestManagementID: formData?.TestManagementID,
            TotalFees: totalFees,
            Currency: currency,
          },
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        toast.success(t("UpdatedSuccessfully"));
        fetchBookings();
        setIsEditMode(false);
      } else {
        //alert(formData.paymentStatus);
        //return;
        // Creating a new booking
        if (!selectedPackageID) {
          setSelectedPackageID(0);
          // return;
        }
        let updatedSelectedTests = SelectedTests;

        if (selectedPackageID) {
          const updatedPackageTestsPackage = PackageSelectedTests.map(
            (test) => ({
              value: test.TestName,
              label: test.TestName,
              TestManagementID: test.TestId,
            })
          );

          updatedSelectedTests = [
            ...updatedSelectedTests,
            ...updatedPackageTestsPackage,
          ];
        }
        const convertedTestData = updatedSelectedTests.map(
          (item) => item.value
        );
        const selectedPackage = packages.find(
          (item) => item?.id === parseInt(selectedPackageID, 10)
        );
        const finalPrice = selectedPackage ? selectedPackage.finalPrice : 0;

        let finalPriceWithoutDecimal = parseFloat(finalPrice);
        let updatedTestFees = formData.testFees + finalPriceWithoutDecimal;
        // setSelectedTests(updatedSelectedTests);
        //alert(JSON.stringify(updatedSelectedTests));
        // return;
        if (!convertedTestData) {
          toast.error(t("Pleaseselecttestorpackage"));
          return;
        }
        if (
          !formData.selectedPatient ||
          !selectedDoctor ||
          !formData.status ||
          !formData.paymentStatus
        ) {
          toast.error(t("Pleasefillrequiredfields"));
          return;
        }
        //  if (formData.paymentDate) alert(currency);

        formData.TotalFees = totalFees;
        formData.Currency = currency;
        // alert("Hello");
        // return;
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/createDiagnosticsBooking`,
          {
            ...formData,
            patientId: formData.selectedPatient,
            testFees: updatedTestFees,
            results: formData.results,
            doctorID: selectedDoctor,
            selectedTest: convertedTestData,
            SelectedTests: convertedTestData,
            selectedPackageID: selectedPackageID,
            TestManagementID: SelectedTests[0]?.TestManagementID || 0,
            TotalFees: totalFees,
            Currency: currency,
          },
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        toast.success(t("SavedSuccessfully"));
      }

      fetchBookings(); // Refetch bookings after saving/editing
      // return;
      console.log(response.data);
      setShowModal(false);
      setSelectedDoctor("");
      setSelectedPackageID(null);
      setSelectedPackage("");
      setFormData({
        status: "Pending",
        lapName: "",
        remarks: "",
        instrumentsUsed: "",
        selectedTests: [],
        selectedPatient: "",
        testFees: "",
      });
    } catch (error) {
      toast.error(t("Failed") + error);

      console.error(error);
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/deleteDiagnosticTestBooking/${bookingId}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      toast.success(t("BookingDeletedSuccessfully"));
      fetchBookings(); // Refetch bookings after deletion
    } catch (error) {
      toast.error(t("FailedtoDeleteBooking"));
      console.error(error);
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
  const roleCurrentUser = currentUser.roles[0];
  //alert(roleCurrentUser);
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_DIAGNOSTICTECHNICIAN") &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_DOCTOR") &&
    !currentUser.roles.includes("ROLE_RECEPTIONIST")
  ) {
    return "Access Denied";
  }
  //console.log("testNames: " + JSON.stringify(testNames));
  console.log("testNames: " + JSON.stringify(PackageSelectedTests));

  const filteredTestNames = PackageSelectedTests
    ? testNames.filter(
        (test) =>
          !PackageSelectedTests.some(
            (packageTest) => packageTest.TestId === test.id
          )
      )
    : testNames;

  return (
    <div style={{ fontSize: "12px" }} className="container">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>{t("TestBookingPatientList")}</h2>
      </header>
      <br />
      <button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        className="btn btn-secondary mr-3"
        onClick={() => setShowModal(true)}
      >
        {t("TestRegistration")}
      </button>{" "}
      {/* <Button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        onClick={() => {
          navigate("/sampleCollectionForm");
        }}
      >
        Sample Collection
      </Button> */}
      {/* <Button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        onClick={() => {
          navigate("/sampleHomeCollectionForm");
        }}
      >
        Sample Home Collection
      </Button> */}
      {/* <Button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        onClick={() => {
          navigate("/pathalogytestManagement");
        }}
      >
        Pathalogy test Management
      </Button> */}
      {/* <Button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        onClick={() => {
          navigate("/CommissionCodeData");
        }}
      >
        Referral type code
      </Button> */}
      <br></br> <br></br>
      <div className="row mb-3">
        <div className="col-md-4 col-sm-12  ">
          <label
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            {t("SearchbyPatientNameorPhone")}
            <input
              style={{ fontSize: "12px", marginTop: "10px" }}
              type="text"
              className="form-control"
              placeholder={t("SearchpatientbyNameorPhone")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="col-md-4 col-sm-12 mb-2">
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>
      </div>
      <Modal
        style={{ marginTop: "20px" }}
        centered
        backdrop="static"
        size="lg"
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setIsEditMode(false);
          setFormData({
            status: "Registered",
            lapName: "",
            remarks: "",
            instrumentsUsed: "",
            selectedTests: [],
            selectedPatient: "",
            paymentDate: "",
            paymentStatus: "",
            testFees: "",
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {formData.id ? t("EditData") : t("RegisterforTest")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {t("SelectINOUTPatient")}{" "}
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </label>
                  <select
                    style={{ fontSize: "12px" }}
                    className="form-control"
                    name="selectedPatient"
                    // disabled={isEditMode}
                    // value={formData.selectedPatient}
                    onChange={(e) => setInOutPatient(e.target.value)}
                  >
                    <option value=""> {t("SelectINOUTPatient")}</option>
                    <option value="InPatient">IN Patient</option>
                    <option value="OutPatient">OUT Patient</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {t("SelectaPatient")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    style={{ fontSize: "12px" }}
                    className="form-control"
                    name="selectedPatient"
                    disabled={isEditMode}
                    // value={formData.selectedPatient}
                    onChange={
                      inOutPatient == "OutPatient"
                        ? handleChange
                        : handleChange1
                    }
                    required
                  >
                    <option value="">{t("SelectaPatient")}</option>
                    {inOutPatient == "OutPatient"
                      ? patients.map((patient) => (
                          <option key={patient.PatientID} value={patient.id}>
                            PID:{patient.id},{patient.firstName}{" "}
                            {patient.middleName} {patient.lastName} (
                            {patient.phoneNumberP})
                          </option>
                        ))
                      : hospitalBookings.map((patient) => {
                          return (
                            <option
                              key={patient.id}
                              value={JSON.stringify(patient)}
                            >
                              PID:{patient.PatientID},{patient.PatientName} (
                              {patient.PatientPhoneNo}{" "}
                              {"AdmissionID :" + patient.id})
                            </option>
                          );
                        })}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                {" "}
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                    htmlFor="selectDoctor"
                    className="control-label"
                  >
                    {t("ReferralDoctor")}
                  </label>
                  <div>
                    <select
                      id="selectDoctor"
                      className="form-control"
                      style={{ fontSize: "12px" }}
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                      <option value="">{t("SelectDoctor")}</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {t("Dr")}. {doctor.FirstName} {doctor.LastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {t("Status")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    style={{ fontSize: "12px" }}
                    className="form-control"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("SelectStatus")}</option>
                    <option value="Registered">{t("Registered")}</option>
                    <option value="SampleCollected">
                      {t("SampleCollected")}
                    </option>
                    <option value="Completed">{t("Completed")}</option>
                    <option value="Cancelled">{t("Cancelled")}</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {t("ReferralType")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    style={{ fontSize: "12px" }}
                    className="form-control"
                    name="referralType" // Change the name to referralType
                    value={formData.referralType} // Update the value to formData.referralType
                    onChange={handleChange} // Update the handler to handleChange
                  >
                    <option value="">{t("SelectReferralType")}</option>
                    {enterCodeData?.map((referralType) => (
                      <option key={referralType.id} value={referralType.id}>
                        {referralType.codeType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {t("SelectaPackage")}
                  </label>
                  <select
                    style={{ fontSize: "12px" }}
                    className="form-control"
                    name="selectedPackage"
                    value={selectedPackage}
                    disabled={isEditMode}
                    onChange={handlePackageSelection}
                  >
                    <option value="">{t("SelectPackage")}</option>
                    {packages.map((Testpackage) => (
                      <option key={Testpackage.id} value={Testpackage.id}>
                        {Testpackage.packageName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {t("ViewTest")}
                  </label>
                  <button
                    disabled={!selectedPackageID}
                    onClick={() => setSelectedViewPackageID(selectedPackageID)}
                    className="btn btn-link"
                  >
                    <FaRegEye />
                    <td></td>
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {t("SelectaTestName")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    isMulti
                    className="custom-Select-picker"
                    options={filteredTestNames?.map((test) => ({
                      value: test.testName,
                      label: test.testName,
                      TestManagementID: test.id,
                    }))}
                    value={formData?.selectedTests.map((selectedTest) => ({
                      value: selectedTest,
                      label: selectedTest,
                      TestManagementID: selectedTest.id,
                    }))}
                    onChange={handleSelectChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {t("PaymentStatus")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    style={{ fontSize: "12px" }}
                    className="form-control"
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("SelectPaymentStatus")}</option>
                    <option value="Paid">{t("Paid")}</option>
                    <option value="Not-Paid">{t("NotPaid")}</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {t("ViewFees")}(USD)
                  </label>
                  <input
                    disabled
                    style={{ fontSize: "12px" }}
                    type="number"
                    className="form-control"
                    name="testFees"
                    value={
                      selectedPackageObject?.finalPrice
                        ? parseInt(selectedPackageObject.finalPrice) +
                          parseInt(formData.testFees)
                        : formData.testFees
                    }
                    onChange={handleChange}
                    required
                    placeholder={t("EnterFees")}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {t("EnterRemarks")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    required
                    style={{ fontSize: "12px" }}
                    className="form-control"
                    name="remarks"
                    rows="1"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder={t("EnterRemarks")}
                  />
                </div>
              </div>
              <div className="col-md-6">
                {formData.paymentStatus === "Paid" && (
                  <div className="form-group">
                    <label
                      style={{
                        fontSize: "12px",
                        marginTop: "8px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                      }}
                    >
                      {t("PaymentDate")} <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      style={{ fontSize: "12px" }}
                      type="date"
                      className="form-control"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleChange}
                      {...(isEditMode
                        ? {}
                        : { min: new Date().toISOString().split("T")[0] })}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="col-md-6">
                {formData.paymentStatus === "Paid" && (
                  <div className="form-group">
                    <label
                      style={{
                        fontSize: "12px",
                        marginTop: "8px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                      }}
                    >
                      {t("SelectCurrency")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    {/* Dropdown for currency */}
                    <select
                      style={{ fontSize: "13px" }}
                      className="form-control"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="INR">INR</option>
                      <option value="CDF">CDF</option>
                    </select>
                  </div>
                )}
              </div>

              <div style={{ marginTop: "35px" }} className="col-md-6">
                {formData.paymentStatus === "Paid" && (
                  <div className="form-group">
                    <label
                      style={{
                        fontSize: "12px",
                        marginTop: "8px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                      }}
                    >
                      {t("TotalFees")} {" = "}
                      {totalFees} {currency}
                    </label>
                    <span></span>
                  </div>
                )}
              </div>
            </div>
            <br></br>
            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                style={{ fontSize: "12px" }}
                className="btn btn-secondary"
              >
                {formData.id ? t("Update") : t("RegisterNow")}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <br></br>
      {isMobile ? (
        <div>
          {filteredBookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((booking, index) => (
              <div className="card mb-3" key={booking.id}>
                <div className="card-body">
                  <h5 className="card-title">
                    {t("PatientName")}: {booking.PatientName}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {t("TestNames")}:{" "}
                    <button
                      title="View Tests"
                      style={{ fontSize: "13px", padding: "4px 5px" }}
                      className="btn btn-secondary"
                      onClick={() => handleViewTestNames(booking)}
                    >
                      <FaRegEye />
                    </button>
                  </h6>
                  <p className="card-text">Sr No: {index + 1}</p>
                  <p className="card-text">
                    {t("ReferralDoctor")}:{" "}
                    {booking.DoctorName !== "NA NA NA"
                      ? `Dr. ${booking.DoctorName}`
                      : "NA"}
                  </p>
                  <p className="card-text">
                    {t("ReferralType")}: {booking.commissionValue}
                  </p>
                  <p className="card-text">
                    {t("PatientPhone")}: {booking.PatientPhoneNo}
                  </p>
                  <p className="card-text">
                    {t("Status")}: {booking.status}
                  </p>
                  <p className="card-text">
                    {t("PaymentStatus")}: {booking.PaymentStatus}
                  </p>
                  <p className="card-text">
                    {t("PaymentDate")}:{" "}
                    {booking.PaymentDate !== null ? booking.PaymentDate : "NA"}
                  </p>
                  <p className="card-text">
                    {t("TestFees")}: ₹{booking.testFees}
                  </p>
                  <p className="card-text">
                    {t("AuthorizationStatus")}: {booking.Authorization}
                  </p>
                  <p className="card-text">
                    {t("RegistrationDate")}:{" "}
                    {formatDateInSelectedLanguage(new Date(booking.createdAt))}
                  </p>
                  <div
                    style={{ fontSize: "12px" }}
                    className="d-flex justify-content-center mt-3"
                  >
                    <button
                      style={{ fontSize: "12px", padding: "4px 5px" }}
                      title={t("EditBooking")}
                      className="btn btn-secondary"
                      onClick={() => handleEdit(booking)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      style={{ fontSize: "12px", padding: "4px 5px" }}
                      title={t("DeleteBooking")}
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedBookingId(booking.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                    <UploadDiagnosticImages
                      testBookingID={booking.id}
                      SelectedTest={booking.selectedTests}
                    />
                    <button
                      style={{ fontSize: "12px", padding: "4px 5px" }}
                      title={t("AddResult")}
                      className="btn btn-secondary"
                      onClick={() => handleAddResult(booking)}
                    >
                      <FaPlusSquare />
                    </button>
                    <button
                      style={{ fontSize: "12px", padding: "4px 5px" }}
                      title={t("DownloadReport")}
                      className="btn btn-secondary"
                      onClick={() => handleGenerateReportNew(booking)}
                    >
                      <FaDownload />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <Table
          style={{ textAlign: "center" }}
          striped
          bordered
          hover
          responsive
        >
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.SrNo")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>Lab Name</th> */}
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.TestName")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.PatientName")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.ReferralDoctor")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.ReferralType")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.PatientPhone")}
              </th>
              {/*               <th style={{ textAlign: "center" }}>InstrumentsUsed</th> */}
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.Remarks")}
              </th>
              <th style={{ textAlign: "center" }}>{t("Status")}</th>
              {/*               <th style={{ textAlign: "center" }}>Results</th> */}
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.PaymentStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.PaymentDate")}
              </th>

              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.TotalFees")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.TotalFees")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.ViewPackage")}
              </th>

              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.AuthorizationStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.RegistrationDate")}
              </th>
              <th style={{ whiteSpace: "nowrap" }}>
                {t("diagnsticPatientListTable.Action")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>Add/Upload Result</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredBookings
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((booking, index) => {
                if (currentUser.email === booking.DoctorEmail) {
                  return (
                    <tr key={booking.id}>
                      <td style={{ textAlign: "center" }}>{index + 1}</td>

                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        <button
                          title={t("diagnsticPatientListTable.ViewTests")}
                          style={{ fontSize: "13px", padding: "4px 5px" }}
                          className="btn btn-secondary"
                          onClick={() => handleViewTestNames(booking)}
                        >
                          <FaRegEye />
                        </button>
                      </td>
                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        {booking.PatientName}
                      </td>
                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        {booking.DoctorName !== "NA NA NA"
                          ? `Dr. ${booking.DoctorName}`
                          : "NA"}
                      </td>
                      <td
                        style={{
                          whiteSpace: "nowrap",
                          textAlign: "center",
                          textAlign: "center",
                        }}
                      >
                        {booking.commissionValue}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {booking.PatientPhoneNo}
                      </td>

                      <td style={{ textAlign: "center" }}>{booking.remarks}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{booking.status}</td>

                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        {booking.PaymentStatus}
                      </td>
                      <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        {booking.PaymentDate !== null
                          ? formatDateInSelectedLanguage(
                              new Date(booking.PaymentDate)
                            )
                          : "NA"}
                      </td>

                      <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {/* <span>&#8377;</span> */}
                        {booking.testFees} USD
                      </td>
                      <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        {booking.TotalFees
                          ? `${booking.TotalFees} ${booking.Currency}`
                          : "NA"}
                      </th>

                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() =>
                            setSelectedViewPackageID(booking?.selectedPackageID)
                          }
                          className="btn btn-link"
                        >
                          {booking.selectedPackageID}
                          <td></td>
                        </button>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {booking.Authorization}
                      </td>
                      <td>
                        {formatDateInSelectedLanguage(
                          new Date(booking.createdAt)
                        )}
                      </td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <button
                          title={t("diagnsticPatientListTable.EditBooking")}
                          style={{ fontSize: "12px", padding: "4px 5px" }}
                          className="btn btn-secondary mr-2"
                          onClick={() => handleEdit(booking)}
                        >
                          <FaPencilAlt />
                        </button>
                        {"  "}{" "}
                        {/* <button
                      title={t("diagnsticPatientListTable.DeleteBooking")}
                      style={{ fontSize: "12px", padding: "4px 5px" }}
                      className="btn btn-secondary mr-2"
                      onClick={() => {
                        setSelectedBookingId(booking.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrashAlt />
                    </button> */}
                        {roleCurrentUser !== "ROLE_RECEPTIONIST" &&
                          roleCurrentUser !== "ROLE_DOCTOR" && (
                            <UploadDiagnosticImages
                              testBookingID={booking.id}
                              SelectedTest={booking.selectedTests}
                            />
                          )}
                        {roleCurrentUser !== "ROLE_RECEPTIONIST" &&
                          roleCurrentUser !== "ROLE_DOCTOR" && (
                            <button
                              title={t("diagnsticPatientListTable.AddResult")}
                              style={{ fontSize: "12px", padding: "4px 5px" }}
                              className="btn btn-secondary mr-2"
                              onClick={() => handleAddResult(booking)}
                            >
                              <FaPlusSquare />
                            </button>
                          )}
                        {roleCurrentUser === "ROLE_DOCTOR" && (
                          <button
                            title="Update Authorization"
                            style={{
                              whiteSpace: "nowrap",
                              fontSize: "12px",
                              padding: "4px 5px",
                            }}
                            className="btn btn-secondary mr-2"
                            onClick={() =>
                              handleUpdateAuthorizationStatus(booking)
                            }
                          >
                            <FaPlusSquare />
                          </button>
                        )}
                        {roleCurrentUser !== "ROLE_RECEPTIONIST" && (
                          <button
                            title={t(
                              "diagnsticPatientListTable.DownloadReport"
                            )}
                            style={{
                              whiteSpace: "nowrap",
                              fontSize: "12px",
                              padding: "4px 5px",
                            }}
                            className="btn btn-secondary mr-2"
                            onClick={() => handleGenerateReportNew(booking)}
                          >
                            <FaDownload />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
          </tbody>
        </Table>
      )}
      <Modal
        style={{ fontSize: "13px", marginTop: "20px" }}
        centered
        backdrop="static"
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("ConfirmDelete")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("AreYouSureyouWanttoDeletethisTestBooking")}</Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "13px" }}
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            {t("diagnsticPatientListTable.Cancel")}
          </Button>
          <Button
            style={{ fontSize: "13px" }}
            variant="danger"
            onClick={() => {
              handleDelete(selectedBookingId);
              setShowDeleteModal(false);
            }}
          >
            {t("diagnsticPatientListTable.Delete")}
          </Button>
        </Modal.Footer>
      </Modal>
      <AddResultModalForBloodSugarForFastingTest
        showFieldModal={showReportModalBloodSugarFasting}
        handleCloseFieldModal={() => {
          setShowReportModalBloodSugarFasting(false);
          setSelectedReportData(null);
          // window.location.reload();
        }}
        selectedReportData={selectedReportData}
      />
      {testBookingID && <DownloadPDFButton testBookingID={testBookingID} />}
      <Modal
        style={{ marginTop: "20px" }}
        centered
        size="lg"
        backdrop="static"
        show={showTestNamesModal}
        onHide={() => setShowTestNamesModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("diagnosticsModal.TestNamesForPatient")}:
            {selectedTestBooking?.PatientName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isMobile ? (
            <div>
              {testStatuses.map((status, index) => (
                <div className="card mb-3" key={index}>
                  <div className="card-body">
                    <h5 className="card-title">
                      {t("diagnosticsModal.TestName")}: {status.testName}
                    </h5>
                    <p className="card-text">
                      {t("diagnosticsModal.CurrentStatus")}: {status.TestStatus}
                    </p>
                    <p className="card-text">
                      {t("diagnosticsModal.RegisteredDate")}:{" "}
                      {formatDateInSelectedLanguage(
                        new Date(status.TestRegisteredDateTime)
                      )}
                    </p>

                    <p className="card-text">
                      {t("pathologyStatusModalTable.CompletedDate")}:{" "}
                      {status.TestCompletedDateTime
                        ? formatDateInSelectedLanguage(
                            new Date(status.TestCompletedDateTime)
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table style={{ fontSize: "14px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>
                    {t("diagnosticsModal.TestName")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("diagnosticsModal.CurrentStatus")}
                  </th>

                  <th style={{ textAlign: "center" }}>
                    {t("diagnosticsModal.RegisteredDate")}
                  </th>

                  <th style={{ textAlign: "center" }}>
                    {t("diagnosticsModal.CompletedDate")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {testStatuses.map((status, index) => (
                  <tr key={index}>
                    <td>{status.testName}</td>
                    <td>{status.TestStatus}</td>
                    <td>
                      {formatDateInSelectedLanguage(
                        new Date(status.TestRegisteredDateTime)
                      )}
                    </td>

                    <td>
                      {formatDateInSelectedLanguage(
                        new Date(status.TestRegisteredDateTime)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
      </Modal>
      {selectedViewPackageID && (
        <DiagnosticPackageView
          selectedPackageID={selectedViewPackageID}
          handleClose={() => setSelectedViewPackageID(null)}
        />
      )}
      <Modal
        style={{ marginTop: "20px" }}
        centered
        backdrop="static"
        show={showAuthorizationModal}
        onHide={() => {
          setShowAuthorizationModal(false);
          setSelectedRowId(null);
          setAuthorizationStatus("Approved");
          setFeedback("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("UpdateAuthorizationStatusforPatient")}: {PatientNapeStatus}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="authorizationStatus">
              <Form.Label
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                {t("SelectStatus")} <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="select"
                required
                style={{ fontSize: "12px" }}
                value={authorizationStatus}
                onChange={(e) => setAuthorizationStatus(e.target.value)}
              >
                <option value="">{t("SelectStatus")}</option>

                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="feedback">
              <Form.Label
                style={{
                  fontSize: "12px",
                  marginBottom: "15px",
                  marginTop: "15px",
                  fontWeight: "bold",
                }}
              >
                {t("Feedback")} <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                required
                placeholder={t("EnterFeedback")}
                style={{ fontSize: "12px" }}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "12px", marginTop: "0px" }}
            variant="secondary"
            onClick={handleUpdateAuthorization}
          >
            {t("Submit")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DiagnosticsBooking;
