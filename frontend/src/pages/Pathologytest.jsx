import { IoPrintSharp } from "react-icons/io5";
import Select from "react-select";
import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Col, Button, Table, Card } from "react-bootstrap";
import axios from "axios";
import Datepickrange from "./DateRangeCalender";
import DownloadPDFButton from "./PathologyAllTest/PathologyTestReportAllTest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  FaPencilAlt,
  FaPlus,
  FaTrashAlt,
  FaRegEye,
  FaSquare,
  FaPlusSquare,
} from "react-icons/fa";

import ReportModal from "./TestReportModalPathalogy";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../services/auth.service";
import AddResultModalForBloodSugarForFastingTest from "./PathologyAllTest/AddResultModalForBloodSugarForFastingTest";
import PathologyPackageView from "./PathologyAllTest/PathologyPatientPackage";

//report generate Modal for all test
import ReportGenerateModalBloodSugarForFasting from "./PathologyAllTest/ReportGenerateModalBloodSugarForFasting";
import Translation from "../translations/Pathologytest.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { CurrencyContext } from "../context/CurrencyProvider";
import { HospitalContext } from "../context/HospitalDataProvider";

function Pathologytest() {
  const navigate = useNavigate();
  const [testBookingID, setTestBookingID] = useState(null);
  const [packages, setPackages] = useState([]);
  const [currency, setCurrency] = useState("");
  const [Hospitals, setHospitals] = useState([]);
  const [optionalCurrencies, setOptionalCurrencies] = useState([]);

  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedPackageObject, setSelectedPackageObject] = useState("");
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  const currentUser = AuthService.getCurrentUser();
  const { t } = useTranslation();
  const { selectedGlobalCurrency, convertCurrency, rates } =
    useContext(CurrencyContext);

  const locales = { enIN, fr };
  const [PaidAmount, setPaidAmount] = useState(0);
  const [EditPaidAmount, setEditPaidAmount] = useState(0);

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
        setOptionalCurrencies(data.data[0].OptionalCurrency.split(","));
        console.log(
          "OptionalCurrencies :",
          data.data[0].OptionalCurrency.split(",")
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };
  const [exchangeRates, setExchangeRates] = useState(() => {
    if (rates) {
      if (Array.isArray(rates)) {
        return rates;
      } else {
        return JSON.parse(JSON.stringify(rates));
      }
    } else {
      return null;
    }
  });

  const [inOutPatient, setInOutPatient] = useState(undefined);
  const [hospitalBookings, setHospitalBookings] = useState([]);
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
    paymentDate: new Date(),
    commissionValue: "NA",
    Currency: "",
    TotalFees: "",
    admissionID: 0,
  });

  useEffect(() => {
    if (
      (formData.paymentStatus === "Paid" ||
        formData.paymentStatus === "Partial-Paid") &&
      currency &&
      Array.isArray(exchangeRates)
    ) {
      const selectedCurrencyObject = exchangeRates.find(
        (rate) => rate.currency === currency
      );

      if (!selectedCurrencyObject || !selectedCurrencyObject.rates[currency]) {
        console.warn("No matching currency rate found!");
        setTotalFees(null);
        return;
      }

      const selectedRate = selectedCurrencyObject.rates[currency];

      const baseFees = selectedPackageObject?.finalPrice
        ? parseFloat(selectedPackageObject.finalPrice) +
          parseFloat(formData.testFees || "0")
        : parseFloat(formData.testFees || "0");

      const totalFeesInSelectedCurrency = baseFees * selectedRate;
      const formattedTotalFees = totalFeesInSelectedCurrency.toFixed(2);

      console.log("formattedTotalFees: ", formattedTotalFees);
      setTotalFees(Number(formattedTotalFees));
    } else {
      setTotalFees(null);
    }
  }, [
    currency,
    formData.testFees,
    formData.paymentStatus,
    selectedPackageObject,
    exchangeRates,
  ]);

  const [testNames, setTestNames] = useState([]);
  const [enterCodeData, setEnterCodeData] = useState([]);
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

  const handleGenerateReportNew = (testBookingID) => {

    console.log(testBookingID,'id');
    
    if (testBookingID?.PaymentStatus === "Not-Paid") {
      toast.error(t("PaymentNotPaidforthisPatient"));
      return;
    }
    //alert(testBookingID?.PaymentStatus);
    if (testBookingID?.PaymentStatus === "Partial-Paid") {
      const confirmed = window.confirm(t("PaymentWasPartialAreYouSure"));
      if (!confirmed) {
        return; // User canceled, do nothing
      }
    }

    if (testBookingID.status !== "Completed") {
      toast.error(t("ResultNotFound"));
      return;
    }
    setTestBookingID(testBookingID.id);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllPathologyTests`, {
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

  const [PackageSelectedTests, setPackageSelectedTests] = useState([]);
  const [selectedPackageID, setSelectedPackageID] = useState(null);
  const [selectedViewPackageID, setSelectedViewPackageID] = useState(null);

  useEffect(() => {
    if (selectedPackageID !== null) {
      // alert(selectedPackageID);
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/selectedTests/${selectedPackageID}`,
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

  // useEffect(() => {
  //   if (selectedPackageID !== null) {
  //     // alert(selectedPackageID);

  //     const transformedOptions = PackageSelectedTests.map((test) => ({
  //       value: test.TestName,
  //       label: test.TestName,
  //       TestManagementID: test.TestId,
  //     }));

  //     setSelectedTests(transformedOptions);
  //     // alert(transformedOptions[0].TestManagementID);
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       selectedTests: transformedOptions.map((option) => option.value),
  //     }));
  //   }
  // }, [PackageSelectedTests]);

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

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/GetExchangeRates/USD`
      );

      const exchangeRatesData = response.data.exchangeRatesData;
      const firstCurrencyData = exchangeRatesData[0].data;
      const rates = firstCurrencyData.rates;
      console.log("Rates:: " + JSON.stringify(rates));
      setExchangeRates(rates);
      //  alert(JSON.stringify(response.data.rates["CDF"]));
      return response.data?.rates;
    } catch (error) {
      console.error(error);
    }
  };
  const convertToUSD = (amount, fromCurrency, exchangeRates) => {
    const exchangeRate = exchangeRates?.[fromCurrency];
    //alert(exchangeRate);
    // return;
    // Check if exchangeRate is a valid number
    return typeof exchangeRate === "number" ? amount / exchangeRate : amount;
  };
  const handleSelectChange = async (selectedOptions) => {
    if (isEditMode) {
      return;
    }
    const selectedTests = selectedOptions.map((option) => option.value);

    // Fetch exchange rates
    await fetchExchangeRates();
    if (!exchangeRates) {
      // Handle the case where exchange rates are not fetched
      toast.error("Failed to fetch exchange rates");
      return; // Exit the function early
    }

    ///alert(JSON.stringify("rates:" + exchangeRates));
    const totalTestFeesUSD = selectedTests.reduce((acc, testName) => {
      const selectedTest = testNames.find((test) => test.testName === testName);
      const testPrice = selectedTest ? selectedTest.testPrice : 0;

      const testPriceUSD = convertToUSD(
        testPrice,
        selectedTest.Currency,
        exchangeRates
      );
      console.log(
        "testPrice: " +
          testPrice +
          " selectedTest.Currency::" +
          selectedTest.Currency
      );
      //alert(testPriceUSD);
      return Number(acc) + Number(testPriceUSD);
    }, 0);
    const formattedTestFees = totalTestFeesUSD.toFixed(2);

    // Update state with selected tests and total test fees
    setSelectedTests(selectedOptions);
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedTests: selectedOptions.map((option) => option.value),
      testFees: Number(formattedTestFees),
    }));
  };
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/GetAllPackagesWithTests`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetchEnterCodeData();
  }, []);

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
  const [showResultModal2, setShowResultModal2] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [SelectedTests, setSelectedTests] = useState("");

  const [showReportModal, setShowReportModal] = useState(false);
  useState(false);

  const [
    showReportResultModalBloodSugarForFasting,
    setShowReportResultModalBloodSugarForFasting,
  ] = useState(false);

  const [
    showReportModalBloodSugarFasting,
    setShowReportModalBloodSugarFasting,
  ] = useState(false);
  const [selectedReportData, setSelectedReportData] = useState(null);
  const [selectedReportData2, setSelectedReportData2] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
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

  //
  const [testBookingData, setTestBookingData] = useState(null);

  const [tableName, setTableName] = useState("");
  const [PatientTestBookingID, setPatientTestBookingID] = useState("");
  const [lastRecord, setLastRecord] = useState(null);

  const fetchLastRecord = async () => {
    try {
      // alert(tableName + " " + PatientTestBookingID);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/getLastRecordByPatientTestBookingID`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${currentUser?.Token}`,
          },
          body: JSON.stringify({ tableName, PatientTestBookingID }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        //  alert(JSON.stringify(data));
        // return;

        setLastRecord(data); // Update state with the last record
      } else if (response.status === 404) {
        // Record not found
        const errorMessage = await response.text();
        toast.error(errorMessage);
      } else {
        // Handle other errors here
        console.error("Error fetching last record");
      }
    } catch (error) {
      //  alert("hello2");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);
  useEffect(() => {
    if (reportselectedTest) fetchLastRecord();
  }, [tableName, PatientTestBookingID]);
  const roleCurrentUser = currentUser.roles[0];

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
      const currentUserEmail = currentUser?.email;
      //  alert(currentUserEmail);
      // setDoctors(response.data);
      if (roleCurrentUser === "ROLE_DOCTOR") {
        const filteredDoctors = response.data.filter(
          (doctor) => doctor.email === currentUserEmail
        );
        setDoctors(filteredDoctors);
      } else {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const [selectedTestNames, setSelectedTestNames] = useState("");
  const [reportselectedTest, setReportSelectedTest] = useState("");
  const [reportselectedTestModal, setReportSelectedTestModal] = useState(false);
  const [BookingsrowData, setBookingsrowData] = useState("");
  const [PatienttestBookID, setPatienttestBookID] = useState("");
  const [ReporttestName, setReporttestName] = useState("");
  const handleGenerateReport = async (bookings) => {
    setBookingsrowData(bookings);

    //  alert(JSON.stringify(bookings.status));
    if (bookings?.status !== "Completed") {
      toast.error(t("errorMessage"));
      return;
    }

    //alert(bookings?.selectedTests);
    setSelectedTestNames(bookings?.selectedTests.split(","));

    if (!reportselectedTest) {
      setReportSelectedTestModal(true);
    }

    setReporttestName(reportselectedTest);
    const tableName =
      reportselectedTest.replace(/\s/g, "").toLowerCase() + "resultmodels";
    //alert(tableName);
    // return;
    setTableName(tableName);

    setPatientTestBookingID(BookingsrowData.id);
    //  fetchLastRecord();
    //alert(JSON.stringify(lastRecord));
    //return;
    const bookingResultData = { bookings, lastRecord };
    // return;
    console.log("testBookingData: " + testBookingData);
    // alert(JSON.stringify(bookings));
    // return;
    setSelectedReportData2(bookingResultData);
    if (lastRecord) {
      //  alert(JSON.stringify(selectedReportData));
      setShowReportResultModalBloodSugarForFasting(true);
    } else if (
      !selectedReportData?.T3T4TSHTestModelData ||
      !selectedReportData?.BloodSugarPPTestModelData ||
      !selectedReportData?.PlateletCountModelData ||
      !selectedReportData?.LipidProfileModelData
    ) {
      console.log("Please add result first!");
      //toast.error("Please add result first!");
    }
  };
  const handleAddResult = (booking) => {
    if (booking?.PaymentStatus === "Not-Paid") {
      toast.error(t("PaymentNotPaidforthisPatient"));
      return;
    }
    if (booking?.PaymentStatus === "Partial-Paid") {
      const confirmed = window.confirm(t("PaymentWasPartialAreYouSure"));
      if (!confirmed) {
        return; // User canceled, do nothing
      }
    }
    console.log("Selected Report Data:", booking);
    setSelectedReportData(booking);
  };

  useEffect(() => {
    const T3T4Result =
      selectedReportData && selectedReportData?.selectedTests === "T3 T4 TSH1";

    if (T3T4Result) {
      setShowReportModalBloodSugarFasting(false); // Ensure other modals are hidden
    } else if (true && selectedReportData?.selectedTests) {
      setShowReportModalBloodSugarFasting(true);
    } else {
      console.log("Manage The Test Result Fields first");
      setShowReportModalBloodSugarFasting(false);
    }
  }, [selectedReportData]);

  const fetchBookings = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getAllBookingsTest`, {
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

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getHospitalAdmissionList`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setHospitalBookings(response.data.data);
        console.log("540", response.data);
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
      alert(value);
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
    setEditPaidAmount(rowData.PaidAmount);
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

    if (rowData.selectedPackageID) {
      const packageObject = packages?.find(
        (pkg) => pkg.id === parseInt(rowData.selectedPackageID)
      );
      setSelectedPackageObject(packageObject || null);
      setSelectedPackage(rowData.selectedPackageID.toString());
      setSelectedPackageID(rowData.selectedPackageID);
    } else {
      setSelectedPackageObject(null);
      setSelectedPackage("");
      setSelectedPackageID(null);
    }

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
      if (PaidAmount < 0) {
        toast.error("Please Enter Valid Amount");
        return;
      }
      if (formData.id) {
        // Updating an existing booking
        //alert(formData.id);

        if (formData.paymentStatus === "Not-Paid") {
          formData.paymentDate = "";
        }
        if (formData.paymentStatus === "Paid") {
          setPaidAmount(totalFees);
        }
        if (
          parseInt(PaidAmount) + parseInt(EditPaidAmount) >
          parseInt(totalFees)
        ) {
          toast.error("Please Enter Valid Amount");
          return;
        }
        formData.TotalFees = totalFees;
        formData.Currency = currency;
        formData.PaidAmount = PaidAmount;
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/updateBooking/${formData.id}`,
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
            PaidAmount: PaidAmount,
          },
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        toast.success(t("UpdatedSuccessfully"));
        fetchBookings();
      } else {
        //alert(formData.paymentStatus);
        //return;
        // Creating a new booking
        if (parseInt(PaidAmount) > parseInt(totalFees)) {
          toast.error("Please Enter Valid Amount");
          return;
        }
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
        if (formData.paymentStatus === "Paid") {
          setPaidAmount(totalFees);
        }

        const selectedPackage = packages.find(
          (item) => item?.id === parseInt(selectedPackageID, 10)
        );
        const finalPrice = selectedPackage ? selectedPackage.finalPrice : 0;

        let finalPriceWithoutDecimal = parseFloat(finalPrice);
        let updatedTestFees = formData.testFees + finalPriceWithoutDecimal;
        // alert(JSON.stringify(updatedTestFees));
        // return;
        formData.TotalFees = totalFees;
        formData.Currency = currency;
        formData.PaidAmount = PaidAmount;
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/testBooking`,
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
            PaidAmount: PaidAmount,
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
      setSelectedPackageID(null);
      setSelectedPackage("");
      setPaidAmount(0);
      setEditPaidAmount(0);
      console.log(response.data);
      setShowModal(false);
      setSelectedDoctor("");
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
      toast.error("Failed!" + error);

      console.error(error);
    }
  };

  /////////////////////////////////////////////////
  const [selectedTestBooking, setSelectedTestBooking] = useState(null);
  const [showTestNamesModal, setShowTestNamesModal] = useState(false);

  // Create a function to handle the View button click
  const [testStatuses, setTestStatuses] = useState([]);

  // Function to fetch test statuses
  const fetchTestStatuses = async (bookingId) => {
    try {
      // alert(bookingId);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/PathologyTestStatuses/${bookingId}`,
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

  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/deleteTestBooking/${bookingId}`,
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

  // localStorage.setItem("reloadCount1", "0");
  // const reloadCount = localStorage.getItem("reloadCount2");
  // if (reloadCount !== "1") {
  //   window.location.reload();
  //   localStorage.setItem("reloadCount2", "1");
  // }

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
    !currentUser.roles.includes("ROLE_DOCTOR")
  ) {
    return "Access Denied";
  }

  const datePickerStyle = {
    fontSize: "12px",
  };

  // console.log("???????????????????: " + testNames);
  //alert(JSON.stringify(testNames));
  const filteredTestNames = PackageSelectedTests
    ? testNames.filter(
        (test) =>
          !PackageSelectedTests.some(
            (packageTest) => packageTest.TestId === test.id
          )
      )
    : testNames;

  console.log("Exchange rates:", rates);
  console.log(
    "Converting 86206.90 INR to USD:",
    convertCurrency(86206.9, "INR", "USD")
  );
  console.log(
    "Converting 1000 INR to USD:",
    convertCurrency(1000, "INR", "USD")
  );
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
        className="btn btn-secondary"
        onClick={() => {
          setShowModal(true);
          setIsEditMode(false);
        }}
      >
        {t("TestRegistration")}
      </button>{" "}
      <button
        style={{ fontSize: "12px", padding: "4px 5px" }}
        className="btn btn-secondary"
        onClick={() => navigate(`/${extractedPart}/PathologyBookingData`)}
      >
        {t("PathologyBilling")}
      </button>{" "}
      <br></br> <br></br>
      <div className="row mb-3">
        <div className="col-md-4 col-sm-12">
          <label
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              marginBottom: "10px",
            }}
          >
            {t("SearchbyPatientNameorPhone")}
            <input
              style={{ fontSize: "12px", marginTop: "10px" }}
              type="text"
              className="form-control"
              placeholder={t("SearchbyPatientNameorPhone")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="col-md-3 col-sm-12">
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
            admissionID: 0,
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {formData.id ? t("EditBooking") : t("RegisterforTest")}
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
                    {"Select IN / OUT Patient"}{" "}
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
                    <option value="">Select IN / OUT Patient</option>
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
                          Dr. {doctor.FirstName} {doctor.LastName}
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
                <div
                  style={{
                    marginTop: "10px",
                  }}
                  className="form-group"
                >
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "-20px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {t("ViewTest")}
                  </label>

                  <button
                    style={{ marginTop: "16px" }}
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
                    disabled={isEditMode}
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
                    disabled={isEditMode}
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("SelectPaymentStatus")}</option>
                    <option value="Partial-Paid">Partial-Paid</option>
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
                    {t("ViewFees")} ({selectedGlobalCurrency})
                  </label>
                  <input
                    disabled
                    style={{ fontSize: "12px" }}
                    type="text"
                    className="form-control"
                    name="testFees"
                    // value={
                    //   selectedPackageObject?.finalPrice
                    //     ? parseInt(selectedPackageObject.finalPrice) +
                    //       parseInt(formData.testFees)
                    //     : formData.testFees
                    // }

                    value={
                      isEditMode
                        ? convertCurrency(
                            parseFloat(
                              formData.TotalFees || formData.testFees || 0
                            ),
                            formData.Currency ||
                              currency ||
                              Hospitals[0]?.baseCurrency,
                            selectedGlobalCurrency
                          )
                        : convertCurrency(
                            selectedPackageObject?.finalPrice
                              ? parseInt(selectedPackageObject.finalPrice) +
                                  parseInt(formData.testFees)
                              : formData.testFees || 0,
                            selectedPackageObject?.Currency ||
                              currency ||
                              Hospitals[0]?.baseCurrency, // ← Use package currency!
                            selectedGlobalCurrency
                          )
                    }
                    // value={convertCurrency(
                    //   selectedPackageObject?.finalPrice
                    //     ? parseInt(selectedPackageObject.finalPrice) +
                    //         parseInt(formData.testFees)
                    //     : parseInt(formData.testFees || 0),
                    //   hospitalData.baseCurrency,
                    //   selectedGlobalCurrency
                    // )}
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
                    {t("Remarks")} <span style={{ color: "red" }}>*</span>
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
                {(formData.paymentStatus === "Paid" ||
                  formData.paymentStatus === "Partial-Paid") && (
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
              <div className="col-md-3">
                {(formData.paymentStatus === "Paid" ||
                  formData.paymentStatus === "Partial-Paid") && (
                  <div className="form-group">
                    <label
                      style={{
                        fontSize: "12px",
                        marginTop: "8px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                      }}
                    >
                      {t("Currency")} (
                      {currency || Hospitals[0]?.baseCurrency || "Select"}){" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    {/* Dropdown for currency */}
                    <select
                      style={{ fontSize: "13px" }}
                      className="form-control"
                      value={currency}
                      disabled={EditPaidAmount}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      {/* <option value="">{t("Select")}</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="INR">INR</option>
                      <option value="CDF">CDF</option> */}
                      <option value="">Select</option>
                      <option value={Hospitals[0]?.baseCurrency}>
                        {Hospitals[0]?.baseCurrency}
                      </option>
                      {optionalCurrencies?.map((currency) => {
                        return <option value={currency}>{currency}</option>;
                      })}
                    </select>
                  </div>
                )}
              </div>

              {/* <div style={{ marginTop: "35px" }} className="col-md-3">
                {(formData.paymentStatus === "Paid" ||
                  formData.paymentStatus === "Partial-Paid") && (
                  <div className="form-group">
                    <label
                      style={{
                        fontSize: "12px",
                        marginTop: "8px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                      }}
                    >
                      {t("Total Fees")} {" = "}
                      {totalFees} {currency}
                    </label>
                    <span></span>
                  </div>
                )}
              </div> */}
              {!EditPaidAmount && (
                <div style={{ marginTop: "35px" }} className="col-md-4">
                  {formData.paymentStatus === "Partial-Paid" && (
                    <div className="form-group">
                      <label
                        style={{
                          fontSize: "12px",
                          marginTop: "8px",
                          fontWeight: "bold",
                          marginBottom: "10px",
                        }}
                      >
                        {t("Enter Advance Amount")} {" = "}
                      </label>
                    </div>
                  )}
                </div>
              )}
              {EditPaidAmount > 0 && (
                <div style={{ marginTop: "35px" }} className="col-md-4">
                  {formData.paymentStatus === "Partial-Paid" && (
                    <div className="form-group">
                      <label
                        style={{
                          fontSize: "12px",
                          marginTop: "8px",
                          fontWeight: "bold",
                          marginBottom: "10px",
                        }}
                      >
                        {/* {EditPaidAmount ? EditPaidAmount : ""} {currency} Paid , */}
                        {t("Pay Remaining Amount")}
                        {"="}
                      </label>
                    </div>
                  )}
                </div>
              )}
              <div style={{ marginTop: "35px" }} className="col-md-2">
                {formData.paymentStatus === "Partial-Paid" && (
                  <div className="form-group">
                    <input
                      type="number"
                      style={{ fontSize: "12px" }}
                      className="form-control"
                      value={PaidAmount}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (
                          parseInt(value) + parseInt(EditPaidAmount) >
                          parseInt(totalFees)
                        ) {
                          toast.error(
                            "Amount should be less than or equal to total."
                          );
                          return;
                        }
                        setPaidAmount(parseFloat(e.target.value));
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {currency && (
              <div className="row">
                <div className="col-md-12">
                  {isEditMode && formData?.paymentStatus == "Paid" && (
                    <span className="my-4 text-success">
                      {t("PaymentSuccessfullyCompleted")}
                    </span>
                  )}

                  <div className="d-flex my-2">
                    <span
                      className="fw-bold me-2 py-1 px-2 bg-secondary rounded"
                      style={{ backgroundColor: "#6c757d92" }}
                    >
                      {/* {t("Total")} : {totalFees} {currency} */}
                      {t("Total")} :{" "}
                      {convertCurrency(
                        isEditMode
                          ? parseFloat(
                              formData.TotalFees || formData.testFees || 0
                            )
                          : selectedPackageObject?.finalPrice
                          ? parseInt(selectedPackageObject.finalPrice) +
                            parseInt(formData.testFees)
                          : formData.testFees || 0,
                        isEditMode
                          ? formData.Currency ||
                              currency ||
                              Hospitals[0]?.baseCurrency
                          : selectedPackageObject?.Currency ||
                              currency ||
                              Hospitals[0]?.baseCurrency, // ← Same as View Fees!
                        selectedGlobalCurrency
                      )}{" "}
                      {selectedGlobalCurrency}
                    </span>
                    {formData.paymentStatus === "Partial-Paid" && (
                      <>
                        <span
                          className="fw-bold mx-2 py-1 px-2  rounded"
                          style={{ backgroundColor: "#ffc1079a" }}
                        >
                          {t("AdvancedPaid")} :{" "}
                          {/* {isEditMode ? EditPaidAmount : PaidAmount} {currency} */}
                          {convertCurrency(
                            isEditMode ? EditPaidAmount : PaidAmount,
                            formData.Currency ||
                              currency ||
                              Hospitals[0]?.baseCurrency,
                            selectedGlobalCurrency
                          )}{" "}
                          {selectedGlobalCurrency}
                        </span>
                        <span
                          className="fw-bold mx-2 py-1 px-2 rounded"
                          style={{ backgroundColor: "#dc35468f" }}
                        >
                          {t("DueAmount")} :{" "}
                          {/* {isEditMode
                            ? totalFees - EditPaidAmount
                            : totalFees - PaidAmount}{" "}
                          {currency} */}
                          {convertCurrency(
                            isEditMode
                              ? parseFloat(
                                  formData.TotalFees || formData.testFees || 0
                                ) - EditPaidAmount
                              : (selectedPackageObject?.finalPrice
                                  ? parseInt(selectedPackageObject.finalPrice) +
                                    parseInt(formData.testFees)
                                  : formData.testFees || 0) - PaidAmount,
                            isEditMode
                              ? formData.Currency ||
                                  currency ||
                                  Hospitals[0]?.baseCurrency
                              : selectedPackageObject?.Currency ||
                                  currency ||
                                  Hospitals[0]?.baseCurrency,
                            selectedGlobalCurrency
                          )}{" "}
                          {selectedGlobalCurrency}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
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
        <div style={{ textAlign: "left" }}>
          <div className="row">
            {filteredBookings
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((booking, index) => (
                <div className="col-md-4 mb-3" key={booking.id}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        {t("pathologyPatientListTable.PatientName")}:{" "}
                        {booking.PatientName}
                      </h5>
                      <p className="card-text">
                        {t("pathologyPatientListTable.TestName")}:{" "}
                        <button
                          title={t("pathologyPatientListTable.ViewTests")}
                          style={{ fontSize: "13px", padding: "4px 5px" }}
                          className="btn btn-secondary"
                          onClick={() => handleViewTestNames(booking)}
                        >
                          <FaRegEye />
                        </button>{" "}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.SrNo")} {index + 1}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.ReferralDoctor")}:{" "}
                        {booking.DoctorName !== "NA NA NA"
                          ? `Dr. ${booking.DoctorName}`
                          : "NA"}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.ReferralType")}:{" "}
                        {booking.commissionValue}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.PatientPhone")}:
                        {booking.PatientPhoneNo}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.Status")}:{" "}
                        {booking.status}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.PaymentStatus")}:{" "}
                        {booking.PaymentStatus}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.PaymentDate")}:{" "}
                        {booking.PaymentDate !== null
                          ? formatDateInSelectedLanguage(
                              new Date(booking.PaymentDate)
                            )
                          : "NA"}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.TestFees")}: ₹
                        {/* {booking.testFees} */}
                        {convertCurrency(
                          booking.testFees,
                          booking.currency,
                          selectedGlobalCurrency
                        )}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.AuthorizationStatus")}:{" "}
                        {booking.Authorization}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.PackageID")}:{" "}
                        {booking.selectedPackageID}
                      </p>
                      <p className="card-text">
                        {t("pathologyPatientListTable.RegistrationDate")}:{" "}
                        {formatDateInSelectedLanguage(
                          new Date(booking.createdAt)
                        )}
                      </p>
                      <div className="btn-group">
                        <button
                          style={{ fontSize: "12px", padding: "4px 5px" }}
                          title={t("pathologyPatientListTable.EditBooking")}
                          className="btn btn-secondary"
                          onClick={() => handleEdit(booking)}
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          title={t("pathologyPatientListTable.Delete")}
                          style={{ fontSize: "12px", padding: "4px 5px" }}
                          className="btn btn-secondary"
                          onClick={() => {
                            setSelectedBookingId(booking.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrashAlt />
                        </button>
                        <button
                          style={{ fontSize: "12px", padding: "4px 5px" }}
                          title={t("pathologyPatientListTable.AddResult")}
                          className="btn btn-secondary"
                          onClick={() => handleAddResult(booking)}
                        >
                          <FaPlusSquare />
                        </button>
                        <button
                          style={{ fontSize: "12px", padding: "4px 5px" }}
                          title={t("pathologyPatientListTable.DownloadReport")}
                          className="btn btn-secondary"
                          onClick={() => handleGenerateReportNew(booking)}
                        >
                          <IoPrintSharp />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
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
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologyPatientListTable.SrNo")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("pathologyPatientListTable.LabName")}</th> */}
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologyPatientListTable.TestName")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologyPatientListTable.PatientName")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologyPatientListTable.ReferralDoctor")}
              </th>

              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologyPatientListTable.ReferralType")}
              </th>

              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologyPatientListTable.PatientPhone")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("Status")}
              </th>
              {/*               <th style={{ textAlign: "center" }}>{t("pathologyPatientListTable.InstrumentsUsed")}</th> */}
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("pathologyPatientListTable.Remarks")}</th> */}
              <th style={{ textAlign: "center", textAlign: "center" }}>
                {t("pathologyPatientListTable.PaymentStatus")}
              </th>
              {/*               <th style={{ textAlign: "center" }}>{t("pathologyPatientListTable.Results")}</th> */}
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologyPatientListTable.PaymentDate")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("Paid")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologyPatientListTable.TestFees")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologyPatientListTable.AuthorizationStatus")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologyPatientListTable.PackageID")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologyPatientListTable.RegistrationDate")}
              </th>
              <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("pathologyPatientListTable.Action")}
              </th>
              {/* <th style={{ whiteSpace: "nowrap" }}>{t("pathologyPatientListTable.Report")}</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredBookings
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((booking, index) => (
                <tr key={booking.id}>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {index + 1}
                  </td>
                  {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {booking.lapName}
                </td> */}
                  {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {booking.selectedTests}
                </td> */}
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    <button
                      title="View Tests"
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
                  {/* <td style={{ whiteSpace: "nowrap" }}>
                  {booking.instrumentsUsed}
                </td> */}
                  {/* <td style={{ textAlign: "center" }}>{booking.remarks}</td> */}
                  <td style={{ whiteSpace: "nowrap" }}>{booking.status}</td>
                  {/* <td style={{ textAlign: "center" }}>
                  <button
                    style={{ fontSize: "13px", padding: "4px 5px" }}
                    className="btn btn-secondary mr-2"
                    onClick={() => handleAddResult2(booking)}
                  >
                    <FaRegEye />
                  </button>
                </td> */}
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
                    {booking.PaidAmount
                      ? ` ${convertCurrency(
                          booking.PaidAmount,
                          booking.Currency,
                          selectedGlobalCurrency
                        )} ${selectedGlobalCurrency}`
                      : "NA"}
                  </td>
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {booking.TotalFees
                      ? ` ${convertCurrency(
                          booking.TotalFees,
                          booking.Currency,
                          selectedGlobalCurrency
                        )} ${selectedGlobalCurrency}`
                      : "NA"}
                  </th>
                  <td style={{ textAlign: "center" }}>
                    {booking.Authorization}
                  </td>
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

                  <td>
                    {formatDateInSelectedLanguage(new Date(booking.createdAt))}
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    <button
                      title={t("pathologyPatientListTable.EditBooking")}
                      style={{ fontSize: "12px", padding: "4px 5px" }}
                      className="btn btn-secondary mr-2"
                      onClick={() => handleEdit(booking)}
                    >
                      <FaPencilAlt />
                    </button>
                    {"  "}{" "}
                    {roleCurrentUser !== "ROLE_DOCTOR" && (
                      <>
                        <button
                          title={t("pathologyPatientListTable.Delete")}
                          style={{ fontSize: "12px", padding: "4px 5px" }}
                          className="btn btn-secondary mr-2"
                          onClick={() => {
                            setSelectedBookingId(booking.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrashAlt />
                        </button>

                        <button
                          title={t("pathologyPatientListTable.AddResult")}
                          style={{ fontSize: "12px", padding: "4px 5px" }}
                          className="btn btn-secondary mr-2"
                          onClick={() => handleAddResult(booking)}
                        >
                          <FaPlusSquare />
                        </button>
                      </>
                    )}
                    {/* </td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}> */}
                    <button
                      title={t("pathologyPatientListTable.DownloadReport")}
                      style={{
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                        padding: "4px 5px",
                      }}
                      className="btn btn-secondary mr-2"
                      onClick={() => handleGenerateReportNew(booking)}
                    >
                      <IoPrintSharp />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
      <AddResultModalForBloodSugarForFastingTest
        showFieldModal={showReportModalBloodSugarFasting}
        handleCloseFieldModal={() => {
          setShowReportModalBloodSugarFasting(false);
          setSelectedReportData(null);
          // window.location.reload();
        }}
        selectedReportData={selectedReportData}
      />
      <ReportModal
        show={showReportModal}
        handleClose={() => {
          setShowReportModal(false);
          setSelectedReportData(null);
          window.location.reload();
        }}
        reportData={selectedReportData}
      />
      <ReportGenerateModalBloodSugarForFasting
        show={showReportResultModalBloodSugarForFasting}
        handleClose={() => {
          setShowReportResultModalBloodSugarForFasting(false);
          setSelectedReportData2(null);
          window.location.reload();
        }}
        reportData={selectedReportData2}
        ReporttestName={ReporttestName}
      />
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
            {t("Cancel")}
          </Button>
          <Button
            style={{ fontSize: "13px" }}
            variant="danger"
            onClick={() => {
              handleDelete(selectedBookingId);
              setShowDeleteModal(false);
            }}
          >
            {t("Delete")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        style={{ marginTop: "20px" }}
        centered
        backdrop="static"
        show={reportselectedTestModal}
        onHide={() => {
          setReportSelectedTestModal(false);
          setReportSelectedTest("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            Patient:
            {BookingsrowData.PatientName} ({BookingsrowData.PatientPhoneNo})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="selectTest">
              {" "}
              <Form.Label style={{ fontSize: "12px", fontWeight: "bold" }}>
                Select Test
              </Form.Label>
              <Form.Control
                as="select"
                style={{ fontSize: "12px" }}
                onChange={(e) => {
                  setReportSelectedTest(e.target.value);
                }}
                value={reportselectedTest}
              >
                <option value="">Select Test</option>
                {Array.isArray(selectedTestNames) &&
                  selectedTestNames.map((test, index) => (
                    <option key={index} value={test}>
                      {test}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "12px", marginTop: "0px" }}
            variant="secondary"
            onClick={() => {
              handleGenerateReport(BookingsrowData);
              fetchLastRecord();
            }}
          >
            View
          </Button>
        </Modal.Footer>
      </Modal>
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
            {t("pathologyModalTable.TestNamesForPatient")}:
            {selectedTestBooking?.PatientName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isMobile ? (
            <div>
              {testStatuses.map((status, index) => (
                <div className="card mb-3" key={index}>
                  <div className="card-body">
                    <h5 className="card-title">{status.testName}</h5>
                    <p className="card-text">
                      {t("pathologyModalTable.CurrentStatus")}:{" "}
                      {status.TestStatus}
                    </p>
                    <p className="card-text">
                      {t("pathologyModalTable.RegisteredDate")}:{" "}
                      {formatDateInSelectedLanguage(
                        new Date(status.TestRegisteredDateTime)
                      )}
                    </p>
                    <p className="card-text">
                      {t("pathologyModalTable.SampleCollectedDate")}:{" "}
                      {status.TestSamplecollectedDateTime
                        ? formatDateInSelectedLanguage(
                            new Date(status.TestSamplecollectedDateTime)
                          )
                        : t("NA")}
                    </p>
                    <p className="card-text">
                      {t("pathologyModalTable.CompletedDate")}:{" "}
                      {status.TestCompletedDateTime
                        ? formatDateInSelectedLanguage(
                            new Date(status.TestCompletedDateTime)
                          )
                        : t("NA")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table responsive style={{ fontSize: "14px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>
                    {t("pathologyModalTable.TestName")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("pathologyModalTable.CurrentStatus")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("pathologyModalTable.RegisteredDate")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("pathologyModalTable.SampleCollectedDate")}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    {t("pathologyModalTable.CompletedDate")}
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
                      {status.TestSamplecollectedDateTime
                        ? formatDateInSelectedLanguage(
                            new Date(status.TestSamplecollectedDateTime)
                          )
                        : "N/A"}
                    </td>
                    <td>
                      {status.TestCompletedDateTime
                        ? formatDateInSelectedLanguage(
                            new Date(status.TestCompletedDateTime)
                          )
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
      {testBookingID && <DownloadPDFButton testBookingID={testBookingID} />}
      {/* Render PathologyPackageView component */}
      {selectedViewPackageID && (
        <PathologyPackageView
          selectedPackageID={selectedViewPackageID}
          handleClose={() => setSelectedViewPackageID(null)}
        />
      )}
    </div>
  );
}

export default Pathologytest;
