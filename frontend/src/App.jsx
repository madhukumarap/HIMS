import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import Helthpackagemanagement from "./pages/HelthPackageManagement";
import DiagnosticTestManagement from "./pages/DiagnosticsComponent/DiagnosticTestManagement";
import { AES, SHA256 } from "crypto-js";
import { Helmet } from "react-helmet";

import BillingforConsultation from "./pages/BillingForConsultation";
import Diagnosticspackagemanagement from "./pages/Diagnosticspackagemanagement";
import Translation from "./translations/App.json";
import UploadPatientMasterData from "./pages/UploadPatientMasterData";
import TestPackageManagement from "./pages/TestPackageManagement";
import UploadCsvFileTestData from "./pages/UploadCsvFileTestData";
import CompanyRegistration from "./pages/CompanyRegistration";
import DiagnosticsBookingManagement from "./pages/DiagnosticsComponent/DiagnosticsBookingManagement";
import DiagnosticCloudPackImage from "./pages/DiagnosticsComponent/DiagnosticCloudImagePackage";
import BillingForDiagnostics from "./pages/DiagnosticsComponent/BillingForDiagnostics";
import CommissionCodeData from "./pages/CommissionCodeData";
import ReferralManagementPathalogy from "./pages/ReferralManagementPathalogy";
import BarcodeScan from "./pages/BarcodeScan";
import SampleCollectionForm from "./pages/SampleCollection";
import HospitalAdministratorRegistration from "./pages/HospitalAdministratorRegistration";
import SampleHomeCollectionForm from "./pages/SampleHomeCollection";
import PathalogytestManagement from "./pages/PathalogytestManagements";
import PathologyBookingData from "./pages/PathologyBookingData";
import CreateEditOTCalender from "./pages/CreateEditOTCalender";
import DoctorsAppointmentsM from "./pages/DoctorsAppointmentsM";
import ViewDrugMedicine from "./pages/ViewDrugMedicine";
import PatientListPathologyResult from "./pages/PatientListPathologyResult";
import PathologytestOwnReport from "./pages/PatientTestReport";
import DispenseMedicineOutside from "./pages/DispenseMedicineOutside";
import PathologyAnalytics from "./pages/Reports/PathologyAnalytics";
import HospitalRegistration from "./pages/HospitalRegistration";
import React, { useState, useEffect, useContext } from "react";
import HospitalAdminData from "./pages/HospitalAdminData";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Pathologytest from "./pages/Pathologytest";
import PatientViewPrescription from "./pages/PatientViewPrescription";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Components/Sidebar";
import { Modal, Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { BsPersonFill } from "react-icons/bs";
import { Form } from "react-bootstrap";
import axios from "axios";
import ForgetPasswordOTP from "./Components/ForgetPasswordOTP";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Practice from "./pages/Practice";
import PatientRoleMedecines from "./pages/PatientRoleMedecines";
import Home from "./pages/Home";
import InventoryManagementPage from "./pages/InventryManagements";
import UpdateForm from "./pages/UpdateItem";
import PaitentPrecriptionForm from "./pages/PaitentPrescriptionForm";
import MedicineAdministrationReport from "./pages/MedicineAdministrationReport";
import PatientLists from "./pages/PaitentList";
import UpdatePatientForm from "./pages/UpdatePatient";
import PrescribedPatientsList from "./pages/PrescribedPatientList";
import OnePatientPrescription from "./pages/OnePatientPrescription";
import PatientMedecines from "./pages/PatientMedecines";
import PatientRegUI from "./pages/PatientRegUI";
import DrugDatabase from "./pages/DrugDatabase";
import DrugMedecine from "./pages/DrugMedecine";
import PatientListCounter from "./pages/PatientForCounter";
import ExpiryReportForm from "./pages/ExpiryReport";
import Dispensation from "./pages/Dispensation";
import DispensingForm from "./pages/DispensingForm";
import DoctorRegistration from "./pages/DoctorRegistration";
import DoctorData from "./pages/DoctorData";
import DispensedReportsList from "./pages/DispensedReportsList";
import Logout from "./Components/Logout";
import ViewDispensedOnePatient from "./pages/ViewDispensedOnePatient";
import AddDrugToDataBase from "./pages/AddDrugToDataBase";
import InventoryData from "./pages/InventoryData";
import PatientDataPharmacist from "./pages/PatientDataPharmacist";
import AssignRoleToUser from "./pages/AssignRoleToUser";
import AuthService from "./services/auth.service";
import ForgotPassword from "./Components/ForgotPassword";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Profile from "./Components/Profile";
import AdminDashboard from "./Components/AdminDashboard";
import DoctorDashboard from "./Components/DoctorDashboard";
import PharmacistDashboard from "./Components/PharmacistDashboard";
import PatientDashboard from "./Components/PatientDashboard";
import NotFound from "./Components/NotFound";
import Unauthorized from "./Components/Unauthorized";
import PharmacistForm from "./pages/PharmacistReg";
import EditInventoryData from "./pages/EditInventoryData";
import OTBookingForm from "./pages/OTBookingForm";
import ViewOTBookingList from "./pages/ViewOTBookingList";
import PrescriptionForm from "./pages/PatientMedicationManage";
import ViewMedicationReport from "./pages/ViewMedicationReport";
import BookingCalendar from "./pages/ViewOTCalender";
import PatientMedicationReport from "./pages/PatientMedicationReport";
import PharmacistData from "./pages/PharmacistData";
import NurseData from "./pages/NurseData";
import NurseRegistration from "./pages/NurseRegistration";
import PatientDataNurse from "./pages/PatientDataForNurse";
import NurseOnePatientPrescription from "./pages/NurseOnePatientPrescription";
import UploadCsvFileDoctor from "./pages/DoctorCsvFileUpload";
import UploadPharmacistData from "./pages/UploadPharmacistData";
import UploadNurseData from "./pages/UploadNurseData";
import UploadInventoryData from "./pages/UploadInventoryData";
import Check from "./Components/Check";
import UploadDrugData from "./pages/UploadDrugData";
import UpdateOTTiming from "./pages/UpdateOTTimingDates";
import InventoryDataOut from "./pages/InventoryDataOut";
import AddOTNameNumber from "./pages/AddOTNameNumber";
import ViewOTListName from "./pages/ViewOTListName";
import PharmacistPrescriptionList from "./pages/PatientPrescriptionListForPharmacist";
import ManageDrugDatabase from "./pages/ManageDrugDatabase";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import UpdateDrugOFDatabase from "./pages/UpdateDrugOfDrugDatabase";
import UsersDataall from "./pages/UsersDataAll";
import PatientBill from "./pages/PatientBill";
import PathologyBills from "./pages/PathologyBills";
import Diagonosticsbill from "./pages/Diagonosticsbill";
import DoctorConsaltationBills from "./pages/DoctorConsaltationBills";
import PharmacyPacientBill from "./pages/PharmacyPacientBill";
import PatientTrendsReport from "./pages/Reports/PatientTrendsReport";
import DiagnosticAnalytics from "./pages/Reports/DiagnosticAnalytics";
import ConsultationAnalytics from "./pages/Reports/ConsultationAnalytics";
import CorporatePersonalVisits from "./pages/CorporatePersonalVisits";
import DiagnosticsBookingForDoctor from "./pages/DiagnosticsComponent/DignosticPatientListForDoctor";
import DiagnosticsBookingForPatient from "./pages/PatientOwnDiagnosticTestReport";
import CorporatePackageAssignedPatientList from "./pages/CorporatePackageAssignedPatientList";
import ReferralAnalysisPathology from "./pages/Reports/ReferralAnalysisPathology";
import PatientOwnTestHistory from "./pages/Reports/PatientOwnTestHistory";
import ReferralAnalysisDiagnostic from "./pages/Reports/ReferralAnalysisDiagnostic";
import BillingAtRegistration from "./pages/BillingAtRegistration";
import AllPackagesView from "./pages/AllPackagesView";
import PatientTestHistory from "./pages/Reports/PatientTestHistory";
import PathologyPackageView from "./pages/PathologyAllTest/PathologyPatientPackage";
import PackageRevenuePathology from "./pages/Reports/PackageRevenuePathology";
import PackageRevenueDiagnostic from "./pages/Reports/PackageRevenueDiagnostic";
import PerTestRevenuePathology from "./pages/Reports/PerTestRevenuePathology";
import PerTestRevenueDiagnostic from "./pages/Reports/PerTestRevenueDiagnostic";
import PerVisitPathologyRevenue from "./pages/Reports/PerVisitPathologyRevenue";
import PerVisitDiagnosticRevenue from "./pages/Reports/PerVisitDiagnosticRevenue";
import PerVisitConsultationEarning from "./pages/Reports/PerVisitConsultationEarning";
import RevenueForReferralDoctor from "./pages/Reports/RevenueForReferralDoctor";
import LostInFollow from "./pages/Reports/LostInFollow";
import DiagnosticLabCategory from "./pages/DiagnosticsComponent/DiagnosticLabCategory";
import SpecimenManagement from "./pages/DiagnosticsComponent/SpecimenManagement";
import VaccinationFormPatient from "./pages/VaccinationFormPatient";
import CompanyComponentInventory from "./pages/Inventory/ItemCompanyCreate";
import VendorComponentInventory from "./pages/Inventory/VendorList";
import HospitalRooms from "./Components/HospitalRooms";
import HospitalAdmissionForm from "./pages/InPatient/HospitalAdmission";
import AdmissionAndDischarge from "./pages/InPatient/HospitalAdmissionAndDischarge";
import InPatientCalender from "./pages/InPatient/In-PatientCalender";
import BillingMangement from "./pages/BillingMangement";
import StatusUpdateAndDischare from "./pages/InPatient/StatusUpdateAndDischarge";
import DischargePatient from "./pages/InPatient/DischargedPatient";
import EHRReport from "./pages/InPatient/EHRReport";
import HospitalForm from "./Components/HospitalRegBySuperAdmin";
import Backup from "./pages/Backup";
import UploadTestDataFromCsvDiagnostic from "./pages/DiagnosticsComponent/UploadTestDataFromCsvDiagnostic";
import ConsultationPriceSetup from "./pages/ConsultationComponent/ConsultationPriceSetup";
import PatientRegistrationFee from "./pages/PatientRegistrationFee";
import { HospitalContext } from "./context/HospitalDataProvider";
import { CurrencyContext } from "./context/CurrencyProvider";
import ShowDoctorList from "./pages/Doctor/ShowDoctorList";
import HospitalAnalytics from "./pages/Reports/HospitalAnalytics"
const Container = styled.div``;

const Content = styled.div`
  flex-grow: 1;
  transition: margin-left 0.3s ease-in-out;
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? "18%" : "0")};
  padding-left: ${({ sidebarOpen }) => (sidebarOpen ? "18%" : "0")};
  height: 100vh;
  padding-left: 0px;
  padding-right: 0px;
  overflow: auto;
`;

function App() {
  const currentPath = window.location.pathname;
  const initialLanguage = localStorage.getItem("SelectedLanguage") || "en";
  const [lastBackupConfig, setLastBackupConfig] = useState(null);

  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [hospitals, setHospitals] = useState([]);
  const startIndex = currentPath.indexOf("/mediai/") + "/mediai/".length;
  const endIndex = currentPath.indexOf("/", startIndex);
  //const extractedPart = currentPath?.match(/mediai\/([^\/]+)/)[1];
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1].toLocaleLowerCase();
  }
  // alert(extractedPart);

  const { hospitalData } = useContext(HospitalContext);
  const { selectedGlobalCurrency, setSelectedGlobalCurrency } =
    useContext(CurrencyContext);

  useEffect(() => {
    if (hospitalData) {
      setSelectedGlobalCurrency(hospitalData.baseCurrency);
    }
  }, [hospitalData]);

  const handleCurrencyChange = (event) => {
    setSelectedGlobalCurrency(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    // Save selected language to localStorage
    localStorage.setItem("SelectedLanguage", event.target.value);
    window.location.reload();
  };
  let showOperationTheater = false;

  if (import.meta.env.MODE === "production") {
    showOperationTheater = [
      "/mediai/ViewOTCalender",
      "/mediai/CreateEditOTCalender",
      "/mediai/OTBookingForm",
      "/mediai/ViewOTs",
      "/mediai/ViewOTList",
      "/mediai/UpdateOTTiming",
    ].includes(currentPath);
  } else {
    showOperationTheater = [
      "/ViewOTCalender",
      "/CreateEditOTCalender",
      "/OTBookingForm",
      "/ViewOTs",
      "/ViewOTList",
      "/UpdateOTTiming",
    ].includes(currentPath);
  }

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/get-last-backup-config`, {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        })
        .then((response) => {
          //alert(response.data.lastBackupConfig.time);
          setLastBackupConfig(response.data.lastBackupConfig);
        })
        .catch((error) => {})
        .finally(() => {});
    }
  }, []);

  useEffect(() => {
    const showWarning = () => {
      if (lastBackupConfig) {
        const [hours, minutes] = lastBackupConfig?.time.split(":");
        const backupTime = new Date();
        backupTime.setHours(parseInt(hours, 10));
        backupTime.setMinutes(parseInt(minutes, 10));

        if (!isNaN(backupTime.getTime())) {
          const currentTime = new Date();

          const timeDiffInMinutes =
            (backupTime.getTime() - currentTime.getTime()) / (1000 * 60);

          if (lastBackupConfig.period === "daily") {
            // Check only on time for daily backups
            if (timeDiffInMinutes > 0 && timeDiffInMinutes <= 30) {
              toast.warning(
                `Backup is scheduled at ${lastBackupConfig.time}. All users will logout on this time.`
              );
            }
          } else if (lastBackupConfig.period === "weekly") {
            // Check both day and time for weekly backups
            const currentDayOfWeek = currentTime.getDay();

            if (
              lastBackupConfig.day === currentDayOfWeek.toString() &&
              timeDiffInMinutes > 0 &&
              timeDiffInMinutes <= 30
            ) {
              toast.warning(
                `Backup is scheduled at ${
                  lastBackupConfig.time
                } on ${getDayName(
                  lastBackupConfig.day
                )}. All users will logout on this time.`
              );
            }
          }
        } else {
          toast.error("Invalid date format");
        }
      }
    };

    const getDayName = (dayValue) => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[dayValue];
    };

    // Initial check when the component mounts
    showWarning();

    // Check every minute
    const intervalId = setInterval(showWarning, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastBackupConfig]);

  useEffect(() => {
    // Function to make the API call
    const getLoggedInStatus = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/get-logged-in-status-by-userid`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${currentUser?.Token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          //alert(JSON.stringify(data));
          if (data.loggedInStatus === "LoggedOut") {
            //  alert(data.loggedInStatus);
            window.location.replace(`/mediai/${extractedPart}/logout`);
          }
        } else {
          console.error("Failed to get logged-in status");
        }
      } catch (error) {
        console.error("Error during API call:", error);
      }
    };

    getLoggedInStatus();
    const intervalId = setInterval(() => {
      getLoggedInStatus();
    }, 500000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  const navbarStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999,
    background: "#19498f",
    height: "50px",
    width: "100vw",
    display: "flex",

    justifyContent: "flex-start",
    alignItems: "center",
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [currentUser, setCurrentUser] = useState(undefined);
  const [showPatientBoard, setShowPatientBoard] = useState(false);
  const [showDoctorBoard, setShowDoctorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showpharmacistBoard, setShowpharmacistBoard] = useState(false);

  useEffect(() => {
    if (extractedPart === "healthcare") {
      setHospitals([
        {
          id: 0,
          hospitalName: "Healthcare",
          hospitalURL: "http://localhost:3000/mediai/healthcare",
          HospitalGUID: "",
          name: "healthcare",
          databaseName: "pharmacymanagement",
        },
      ]);
    } else {
      fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/get-hospitalsMain/${extractedPart}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
            MainDatabase: "pharmacymanagement",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Hospital data not found");
          }
          return response.json();
        })
        .then((data) => {
          setHospitals(data);
          if (data.length < 1) {
            toast.error("Client ID not found");
            window.location.replace("/mediai/healthcare");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          // Show toast message
          alert("Client ID not found");
          // Reload page after 1 second
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
    }
  }, []);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowPatientBoard(user.roles.includes("ROLE_PATIENT"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
      setShowDoctorBoard(user.roles.includes("ROLE_DOCTOR"));
      setShowpharmacistBoard(user.roles.includes("ROLE_PHARMACIST"));
    }
  }, []);

  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar2 = () => {
    setShowSidebar(!showSidebar);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  const [showProfileModal, setShowProfileModal] = useState(false);
  // const [userInfo, setUserInfo] = useState({});

  const [editMode, setEditMode] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    roles: [],
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => {
    window.location.href = "/";
    window.location.reload();
  };
  const openProfileModal = () => {
    // Fetch or set the user information
    const user = AuthService.getCurrentUser();
    setUserInfo(user);
    setEditMode(false); // Disable edit mode initially
    setShowProfileModal(true);
  };

  const SECRET_KEY = "your-secret-key";
  const encryptData = (data) => {
    const encryptedData = AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY
    ).toString();
    return encryptedData;
  };
  const handleUpdateProfile = () => {
    // Prepare the updated user profile data
    const updatedProfileData = {
      name: userInfo.name,
      email: userInfo.email,
      username: userInfo.username,
      password: userInfo.password,
      phoneNumber: userInfo.phoneNumber,
    };
    currentUser.name = userInfo.name;
    currentUser.email = userInfo.email;
    currentUser.phoneNumber = userInfo.phoneNumber;
    const encryptedUser = encryptData(currentUser);
    const checksum = SHA256(encryptedUser).toString();
    sessionStorage.setItem("user", encryptedUser);
    sessionStorage.setItem("checksum", checksum);
    if (
      userInfo.password &&
      !userInfo.password.match(
        "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{6,}"
      ) &&
      userInfo.password.length > 0
    ) {
      toast.error("Enter Valid password");
      return;
    }
    if (
      !userInfo.email.match("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}") &&
      userInfo.email.length > 0
    ) {
      toast.error("Enter Valid Email");
      return;
    }
    if (
      String(userInfo.phoneNumber).length !== 10 &&
      userInfo.phoneNumber.length > 0
    ) {
      toast.error("Enter valid PhoneNo.");
      return;
    }

    // alert(currentUser?.Token);
    // Make an API call to update the user profile
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/update-profile`,
        updatedProfileData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        // Handle the response from the server, such as displaying a success message
        toast.success("Profile updated successfully");
        console.log("Profile updated successfully");

        // Update the local user data
        const updatedUser = { ...userInfo, ...updatedProfileData };
        setUserInfo(updatedUser);
        localStorage.setItem("token", updatedUser.Token);

        // Update the local storage with the updated user information and checksum
        const encryptedUser = AuthService.encryptData(updatedUser);
        const checksum = SHA256(encryptedUser).toString();
        localStorage.setItem("user", encryptedUser);
        localStorage.setItem("checksum", checksum);

        // Close the modal and perform any additional actions
        setEditMode(false);
        setShowProfileModal(false);
      })
      .catch((error) => {
        toast.error("already in use");
        // Handle the error, such as displaying an error message
        console.error("Error updating profile:", error);
      });
  };

  const style = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    fontSize: "12px",
  };

  const h1Style = {
    fontSize: "16px",
  };

  const h2Style = {
    fontSize: "14px",
  };

  const h3Style = {
    fontSize: "13px",
  };

  // State to track the screen size
  const [isMobile, setIsMobile] = useState(false);

  // Function to check if the screen size is mobile
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 200); // Adjust the breakpoint as per your requirement
  };

  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener("resize", checkIsMobile);

    // Check the initial screen size
    checkIsMobile();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  //alert(currentUser.name.length);
  const calculatedMargin = currentUser
    ? `${currentUser.name.length * 20}px`
    : "220px";
  const marginRightValue =
    currentUser && currentUser.name.length >= 15 ? calculatedMargin : "350px";

  if (currentUser && extractedPart) {
    //alert(currentUser?.HospitalName);
    if (currentUser?.HospitalName.toLowerCase() !== extractedPart) {
      window.location.replace("/");
    }
  }
  setTimeout(function () {
    if (hospitals.length < 1) {
      return "ClientID not found";
    }
  }, 100);

  return (
    <BrowserRouter basename="mediai">
      <Modal
        centered
        style={style}
        show={showProfileModal}
        onHide={closeProfileModal}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {Translation[initialLanguage]["UserProfile"]}
          </Modal.Title>
        </Modal.Header>
        {editMode ? (
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>{Translation[initialLanguage]["Name"]}:</Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "12px" }}
                  value={userInfo.name}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formUsername">
                <Form.Label>
                  {Translation[initialLanguage]["Username"]}:
                </Form.Label>
                <Form.Control
                  type="text"
                  value={userInfo.username}
                  style={{ fontSize: "12px" }}
                  disabled
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label>
                  {Translation[initialLanguage]["NewPassword"]}:
                </Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    style={{ fontSize: "12px" }}
                    value={userInfo.password || ""}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, password: e.target.value })
                    }
                    required
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}"
                    placeholder={
                      Translation[initialLanguage]["CreateNewPassWord"]
                    }
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </div>
                </div>
                {userInfo.password &&
                  !userInfo.password.match(
                    "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{6,}"
                  ) &&
                  userInfo.password.length > 0 && (
                    <div className="error-message">
                      {Translation[initialLanguage]["PasswordError"]}
                    </div>
                  )}
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  style={{ fontSize: "12px" }}
                  value={userInfo.email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
                  placeholder="Enter your email"
                />
                {!userInfo.email.match(
                  "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}"
                ) &&
                  userInfo.email.length > 0 && (
                    <div className="error-message">
                      {" "}
                      {Translation[initialLanguage]["emailerror"]}
                    </div>
                  )}
              </Form.Group>

              <Form.Group controlId="formPhone">
                <Form.Label>
                  {Translation[initialLanguage]["Phone"]}:
                </Form.Label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* <span style={{ marginRight: "5px" }}></span> */}
                  <Form.Control
                    type="tel"
                    style={{ fontSize: "12px" }}
                    value={userInfo.phoneNumber}
                    onChange={(e) => {
                      const inputPhoneNumber = e.target.value;
                      const numericPhoneNumber = inputPhoneNumber
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10); // Remove non-digit characters and limit to 10 digits
                      setUserInfo({
                        ...userInfo,
                        phoneNumber: numericPhoneNumber,
                      });
                    }}
                    required
                    pattern="[0-9]{10}"
                    placeholder="Enter your phone number"
                  />
                </div>
                {String(userInfo.phoneNumber).length !== 10 &&
                  userInfo.phoneNumber.length > 0 && (
                    <div className="error-message">
                      {Translation[initialLanguage]["Phoneerror"]}
                    </div>
                  )}
              </Form.Group>

              <Form.Group controlId="formRoles">
                <Form.Label>
                  {Translation[initialLanguage]["Roles"]}:
                </Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "12px" }}
                  disabled
                  value={userInfo.roles && userInfo.roles.join(", ")}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
        ) : (
          <Modal.Body>
            <p>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqVg_URh9Mvrm3NYaTlCUyiM7r382ohELc1g&usqp=CAU "
                alt="profile"
                style={{
                  width: "30px",
                  marginTop: "3px",
                  marginLeft: "0%",
                }}
              />
            </p>
            {/* {!currentUser?.roles.includes("ROLE_SUPERADMIN") && (
              <p>
                <strong>Hospital ID:</strong> {currentUser?.hospitalId}
              </p>
            )} */}

            <p>
              <strong>{Translation[initialLanguage]["Name"]}:</strong>{" "}
              {userInfo.name}
            </p>
            <p>
              <strong>{Translation[initialLanguage]["Username"]}:</strong>{" "}
              {userInfo.username}
            </p>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>{Translation[initialLanguage]["Phone"]}:</strong>{" "}
              {userInfo.phoneNumber}
            </p>
            <p>
              <strong>{Translation[initialLanguage]["Roles"]}: </strong>{" "}
              {currentUser?.roles?.map((role) => {
                const formattedRole = role?.replace("ROLE_", "").toLowerCase();
                return (
                  formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1)
                );
              })}
            </p>
          </Modal.Body>
        )}
        <Modal.Footer>
          {!editMode ? (
            <Button
              variant="secondary"
              style={{ fontSize: "12px" }}
              onClick={() => setEditMode(true)}
            >
              {Translation[initialLanguage]["UpdateProfile"]}
            </Button>
          ) : (
            <>
              <Button
                style={{
                  fontSize: "13px",
                  marginRight: "5px",
                  padding: "4px 5px",
                }}
                variant="secondary"
                onClick={handleUpdateProfile}
              >
                {Translation[initialLanguage]["Save"]}
              </Button>
              <Button
                variant="secondary"
                style={{
                  fontSize: "13px",
                  backgroundColor: "#777777",
                  marginLeft: "10px",
                  padding: "4px 5px",
                }}
                onClick={() => setEditMode(false)}
              >
                {Translation[initialLanguage]["Close"]}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      <Helmet>
        <title>{hospitals[0]?.hospitalName || "Mediai"}</title>
      </Helmet>
      <nav
        style={navbarStyles}
        className="navbar navbar-expand navbar-dark bg-blue"
      >
        {currentUser && (
          <Sidebar sidebarOpen={showSidebar} toggleSidebar={toggleSidebar2} />
        )}
        <div className="navbar-nav mr-auto" style={{ marginLeft: "20px" }}>
          {/* {showDoctorBoard && (
            <li className="nav-item">
              <Link to="/PaitentList" className="nav-link" style={{ fontSize: '15px', color: 'white' }}>
                PatientList
              </Link>
            </li>
          )} */}
        </div>

        {!isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginRight: currentUser ? "-2%" : "-7%",
              marginLeft: marginRightValue,
            }}
            className="container navbar-center"
          >
            <ul className="navbar-nav navbar-center">
              <li className="nav-item navbar-center">
                {showOperationTheater ? (
                  <Link
                    to="/"
                    className="nav-link"
                    style={{ fontSize: "16px", color: "white" }}
                  >
                    Operation Theatre
                  </Link>
                ) : (
                  <Link
                    to={`/${hospitals[0]?.name}`}
                    className="nav-link"
                    // onClick={handleClick}

                    style={{ fontSize: "16px", color: "white" }}
                  >
                    MediAI
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}

        {/* /Currency selector/ */}
        {!isMobile && (
          <div className="navbar-nav mr-auto" style={{ marginRight: "0px" }}>
            <p style={{ fontSize: "16px", color: "white" }}>
              {" "}
              <select
                className="form-select"
                style={{
                  fontSize: "12px",
                  marginTop: "30px",
                  width: "74px",
                  colour: "white",
                }}
                value={selectedGlobalCurrency}
                onChange={handleCurrencyChange}
              >
                <option value="" disabled>
                  --
                </option>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </p>
          </div>
        )}

        {/* // */}
        {!isMobile && (
          <div
            className="navbar-nav mr-auto"
            style={{ marginRight: marginRightValue }}
          >
            <p style={{ fontSize: "16px", color: "white" }}>
              {" "}
              <select
                className="form-select"
                style={{
                  fontSize: "12px",
                  marginTop: "30px",
                  width: "70px",
                  //  backgroundColor: "blue",
                  colour: "white",
                }}
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
              </select>
            </p>
          </div>
        )}
        {currentUser ? (
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Dropdown
                align="end"
                style={{ position: "absolute", right: "0", marginTop: "-17px" }}
              >
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-profile"
                  style={{
                    fontSize: "16px",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  {/* <BsPersonFill size={20} /> */}
                  {Translation[initialLanguage]["Welcome"]}: {currentUser?.name}{" "}
                  {isMobile
                    ? null
                    : `(${currentUser?.roles
                        ?.map((role) => {
                          const formattedRole = role
                            .replace("ROLE_", "")
                            .toLowerCase();
                          return (
                            formattedRole.charAt(0).toUpperCase() +
                            formattedRole.slice(1)
                          );
                        })
                        .join(", ")})`}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {/* Add menu items/options here */}
                  <Dropdown.Item onClick={openProfileModal}>
                    <BsPersonFill size={20} />{" "}
                    {Translation[initialLanguage]["UserProfile"]}
                  </Dropdown.Item>
                  <hr style={{ margin: "0.5rem 0" }} />
                  <Dropdown.Item
                    style={{
                      display: "flex",
                      color: "red",
                      justifyContent: "center",
                    }}
                    as={Link}
                    to={`${hospitals[0]?.name}/logout`}
                  >
                    {Translation[initialLanguage]["Logout"]}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        ) : (
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              id="dropdown-auth"
              style={{
                fontSize: "15px",
                color: "white",
                textDecoration: "none",
              }}
            >
              {/* <span>Login / Sign Up</span> */}
              <BsPersonFill size={20} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Link
                  to={`${hospitals[0]?.name}/login`}
                  className="nav-link"
                  style={{
                    fontSize: "15px",
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  Login
                </Link>
              </Dropdown.Item>
              <hr style={{ margin: "0.5rem 0" }} />
              <Dropdown.Item>
                <Link
                  to={`${hospitals[0]?.name}/signup`}
                  className="nav-link"
                  style={{
                    fontSize: "15px",
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  Sign Up
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </nav>

      <ToastContainer />

      <Container>
        {/* <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
        <Content sidebarOpen={showSidebar}>
          <div
            style={{
              flex: 1,

              paddingTop: "80px",
              overflowY: "auto",
            }}
          >
            <Routes>
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/hospitalRegistration`}
                    element={<HospitalRegistration />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/logout`}
                    element={<Logout />}
                  />

                  <Route
                    path={`/${hospitals[0]?.name}/login`}
                    element={<Login />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/signup`}
                    element={<Signup />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/unauthorized`}
                    element={<Unauthorized />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/profile`}
                    element={<Profile />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/admin`}
                    element={<AdminDashboard />}
                  />
                </>
              )}
              <Route
                path={`/hospitalRegistration`}
                element={<HospitalRegistration />}
              ></Route>
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/CreateEditOTCalender`}
                    element={<CreateEditOTCalender />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/doctor`}
                    element={<DoctorDashboard />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/UploadDoctorData`}
                    element={<UploadCsvFileDoctor />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/UploadNurseData`}
                    element={<UploadNurseData />}
                  />
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/UploadPharmacistData`}
                    element={<UploadPharmacistData />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/Check`}
                    element={<Check />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/UpdateOTTiming`}
                    element={<UpdateOTTiming />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/ManageDrugDatabase`}
                    element={<ManageDrugDatabase />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/pharmacist`}
                    element={<PharmacistDashboard />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/WelcomeP`}
                    element={<PatientDashboard />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/forgotPass`}
                    element={<ForgotPassword />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/pharmacistReg`}
                    element={<PharmacistForm />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/PatientDataNurse`}
                    element={<PatientDataNurse />}
                  />
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/NurseOnePatientPrescription/:id`}
                    element={<NurseOnePatientPrescription />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/UploadDrugData`}
                    element={<UploadDrugData />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/AddOTNameNumber`}
                    element={<AddOTNameNumber />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/ViewOTs`}
                    element={<ViewOTListName />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/PharmacistPrescriptionList`}
                    element={<PharmacistPrescriptionList />}
                  />
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/*`}
                    element={<NotFound />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/InventoryDataOut`}
                    element={<InventoryDataOut />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/UpdateDrugOFDatabase/:id`}
                    element={<UpdateDrugOFDatabase />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/PatientMedication/:id`}
                    element={<PrescriptionForm />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/ViewMedicationReport/:id`}
                    element={<ViewMedicationReport />}
                  />
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/ViewOTCalender`}
                    element={<BookingCalendar />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/assignRole`}
                    element={<AssignRoleToUser />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/OTBookingForm`}
                    element={<OTBookingForm />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/ViewOTList`}
                    element={<ViewOTBookingList />}
                  />
                  <Route path={`/${hospitals[0]?.name}/`} element={<Home />} />
                  <Route
                    path={`/${hospitals[0]?.name}/InventoryManagementPage`}
                    element={<InventoryManagementPage />}
                  />
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/InventoryData`}
                    element={<InventoryData />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/viewPatientPrescription/:phoneNumber`}
                    element={<PatientViewPrescription />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/UsersDataall`}
                    element={<UsersDataall />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/updateItem/:id`}
                    element={<UpdateForm />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/adminReport`}
                    element={<MedicineAdministrationReport />}
                  />
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/PatientRegister`}
                    element={<PatientRegUI />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/DoctorRegistration`}
                    element={<DoctorRegistration />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/DoctorData`}
                    element={<DoctorData />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/PaitentListPharmacist`}
                    element={<PatientDataPharmacist />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/EditInventory`}
                    element={<EditInventoryData />}
                  />
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/PatientRoleMedecines/:id1/:id2`}
                    element={<PatientRoleMedecines />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/PatientList`}
                    element={<PatientLists />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/PaitentPrescription/:id`}
                    element={<PaitentPrecriptionForm />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/updatepatient/:id`}
                    element={<UpdatePatientForm />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/prescribedList`}
                    element={<PrescribedPatientsList />}
                  />
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/OnePatientPrescription/:id`}
                    element={<OnePatientPrescription />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/PatientMedecines/:id`}
                    element={<PatientMedecines />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/patientMedecines/:id1/:id2`}
                    element={<PatientMedecines />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/paitentReg`}
                    element={<PatientRegUI />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/drugDatabase`}
                    element={<DrugDatabase />}
                  />
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/medecine/:id`}
                    element={<DrugMedecine />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PatientListCounter/`}
                    element={<PatientListCounter />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/Dispensation/:id`}
                    element={<DispensingForm />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/searchPatientToDispense`}
                    element={<Dispensation />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/DispensedReportsList`}
                    element={<DispensedReportsList />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/dispensedPatient/:id/:prescription_Id`}
                    element={<ViewDispensedOnePatient />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/addDrugToDatabase`}
                    element={<AddDrugToDataBase />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/NurseRegistration`}
                    element={<NurseRegistration />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/NurseData`}
                    element={<NurseData />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PharmacistData`}
                    element={<PharmacistData />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/UploadInventoryData`}
                    element={<UploadInventoryData />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/Pathologytest`}
                    element={<Pathologytest />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/BarcodeScan`}
                    element={<BarcodeScan />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/sampleCollectionForm`}
                    element={<SampleCollectionForm />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/sampleHomeCollectionForm`}
                    element={<SampleHomeCollectionForm />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/pathalogytestManagement`}
                    element={<PathalogytestManagement />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/ReferralManagementPathalogy`}
                    element={<ReferralManagementPathalogy />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/ViewDrugMedicine/:id`}
                    element={<ViewDrugMedicine />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/practice`}
                    element={<Practice />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PatientMedicationReport/:id`}
                    element={<PatientMedicationReport />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/DoctorsAppointmentsM`}
                    element={<DoctorsAppointmentsM />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/HospitalAdministratorRegistration`}
                    element={<HospitalAdministratorRegistration />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/ForgetPasswordOTP`}
                    element={<ForgetPasswordOTP />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/HospitalAdminData`}
                    element={<HospitalAdminData />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PathologytestOwnReport`}
                    element={<PathologytestOwnReport />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/expiryReport`}
                    element={<ExpiryReportForm />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/CommissionCodeData`}
                    element={<CommissionCodeData />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/DispenseMedicineOutside`}
                    element={<DispenseMedicineOutside />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PatientListPathologyResult`}
                    element={<PatientListPathologyResult />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PathologyBookingData`}
                    element={<PathologyBookingData />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/UploadCsvFileTestData`}
                    element={<UploadCsvFileTestData />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/TestPackageManagement`}
                    element={<TestPackageManagement />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/DiagnosticsBookingManagement`}
                    element={<DiagnosticsBookingManagement />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/UploadPatientMasterData`}
                    element={<UploadPatientMasterData />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/CompanyRegistration`}
                    element={<CompanyRegistration />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/BillingforConsultation`}
                    element={<BillingforConsultation />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/DiagnosticTestManagement`}
                    element={<DiagnosticTestManagement />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/Helthpackagemanagement`}
                    element={<Helthpackagemanagement />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PathologyAnalytics`}
                    element={<PathologyAnalytics />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/HospitalAnalytics`}
                    element={<HospitalAnalytics />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/BillingForDiagnostics`}
                    element={<BillingForDiagnostics />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/DiagnosticCloudPackImage`}
                    element={<DiagnosticCloudPackImage />}
                  ></Route>

                  <Route
                    path={`/${hospitals[0]?.name}/ConsultationPriceSetup`}
                    element={<ConsultationPriceSetup />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PatientRegistrationFee`}
                    element={<PatientRegistrationFee />}
                  ></Route>

                  <Route
                    path={`/${hospitals[0]?.name}/Diagnosticspackagemanagement`}
                    element={<Diagnosticspackagemanagement />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PatientBill`}
                    element={<PatientBill />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/pathologyBills`}
                    element={<PathologyBills />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/diagonosticsBills`}
                    element={<Diagonosticsbill />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/doctorConsaltationBills`}
                    element={<DoctorConsaltationBills />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PharmacyPacientBill`}
                    element={<PharmacyPacientBill />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PatientTrendsReport`}
                    element={<PatientTrendsReport />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/DiagnosticAnalytics`}
                    element={<DiagnosticAnalytics />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/ConsultationAnalytics`}
                    element={<ConsultationAnalytics />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/CorporatePersonalVisits`}
                    element={<CorporatePersonalVisits />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/DignosticPatientList`}
                    element={<DiagnosticsBookingForDoctor />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/DiagnosticsBookingForPatient`}
                    element={<DiagnosticsBookingForPatient />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/CorporatePackageAssignedPatientList`}
                    element={<CorporatePackageAssignedPatientList />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/ReferralAnalysisDiagnostic`}
                    element={<ReferralAnalysisDiagnostic />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/ReferralAnalysisPathology`}
                    element={<ReferralAnalysisPathology />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/BillingAtRegistration`}
                    element={<BillingAtRegistration />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/AllPackagesView`}
                    element={<AllPackagesView />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PatientTestHistory`}
                    element={<PatientTestHistory />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PathologyPackageView`}
                    element={<PathologyPackageView />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/PatientOwnTestHistory`}
                    element={<PatientOwnTestHistory />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PackageRevenueDiagnostic`}
                    element={<PackageRevenueDiagnostic />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PackageRevenuePathology`}
                    element={<PackageRevenuePathology />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PerTestRevenuePathology`}
                    element={<PerTestRevenuePathology />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/PerTestRevenueDiagnostic`}
                    element={<PerTestRevenueDiagnostic />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PerVisitPathologyRevenue`}
                    element={<PerVisitPathologyRevenue />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PerVisitDiagnosticRevenue`}
                    element={<PerVisitDiagnosticRevenue />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/PerVisitConsultationEarning`}
                    element={<PerVisitConsultationEarning />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/RevenueForReferralDoctor`}
                    element={<RevenueForReferralDoctor />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/DiagnosticLabCategory`}
                    element={<DiagnosticLabCategory />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/SpecimenManagement`}
                    element={<SpecimenManagement />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/LostInFollow`}
                    element={<LostInFollow />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/VaccinationFormPatient`}
                    element={<VaccinationFormPatient />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/CompanyListInventory`}
                    element={<CompanyComponentInventory />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/VendorListInventory`}
                    element={<VendorComponentInventory />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/HospitalAdmission`}
                    element={<HospitalAdmissionForm />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/AdmissionAndDischarge`}
                    element={<AdmissionAndDischarge />}
                  ></Route>
                </>
              )}
              {hospitals && (
                <>
                  <Route
                    path={`/${hospitals[0]?.name}/InpatientCalender`}
                    element={<InPatientCalender />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/StatusUpdateAndDischare`}
                    element={<StatusUpdateAndDischare />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/DischargePatient`}
                    element={<DischargePatient />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/EHRReport`}
                    element={<EHRReport />}
                  ></Route>
                  <Route
                    path={`/${hospitals[0]?.name}/hospital-rooms`}
                    element={<HospitalRooms />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/billing-Mangement`}
                    element={<BillingMangement />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/HospitalForm`}
                    element={<HospitalForm />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/backup`}
                    element={<Backup />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/UploadTestDataFromCsvDiagnostic`}
                    element={<UploadTestDataFromCsvDiagnostic />}
                  />
                  <Route
                    path={`/${hospitals[0]?.name}/doctorsList`}
                    element={<ShowDoctorList />}
                  />
                </>
              )}
            </Routes>
          </div>
        </Content>
      </Container>
    </BrowserRouter>
  );
}

export default App;
