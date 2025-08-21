import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigation } from "react-router-dom";
import AuthService from "../services/auth.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Translation from "./SidebarTranslation.json";
import Logout from "./Logout";
const SidebarLink = styled(Link)`
  display: flex;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 23px;
  list-style: none;
  height: 20px;
  text-decoration: none;
  font-size: 11px;

  &:hover {
    background: #252831;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    padding: 20px;
    font-size: 14px;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 5px;
`;

const SubMenuItem = styled(Link)`
  display: flex;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 50px;
  background: ${({ isActive }) => (isActive ? "#333" : "#333")};
  text-decoration: none;
  font-size: 11px;

  &:hover {
    background: #252831;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    padding: 10px 15px;
    font-size: 14px;
  }
`;

const SubMenu = ({ item, isActive, toggleSidebar, toggleSubMenu }) => {
  const [activeSubSubMenu, setActiveSubSubMenu] = useState(null);
  const [loggedInStatus, setLoggedInStatus] = useState("");

  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1].toLocaleLowerCase();
  }

  useEffect(() => {
    // Function to make the API call
    const getLoggedInStatus = async () => {
      try {
        // alert("Hello");
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
          setLoggedInStatus(data.status); // Update the state with the logged-in status
        } else {
          console.error("Failed to get logged-in status");
        }
      } catch (error) {
        console.error("Error during API call:", error);
      }
    };

    // Call the function when activeSubSubMenu changes
    if (activeSubSubMenu) {
      getLoggedInStatus();
    }
  }, [activeSubSubMenu]);
  const [hospitals, setHospitals] = useState([]);
  useEffect(() => {
    if (extractedPart !== "healthcare") {
      fetch(
        `${import.meta.env.VITE_API_URL}/api/get-hospitalsMain/${extractedPart}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
            MainDatabase: "pharmacymanagement",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          //alert(JSON.stringify(data));
          setHospitals(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      setHospitals([
        {
          id: 0,
          hospitalName: "Super Admin",
          hospitalURL: "http://localhost:3000/mediai/healthcare",
          HospitalGUID: "",
          name: "healthcare",
          databaseName: "pharmacymanagement",
        },
      ]);
    }
  }, []);
  const currentUrl = window.location.href;

  const usernameStartIndex = currentUrl.indexOf("/mediai/") + "/mediai/".length;
  const usernameEndIndex = currentUrl.indexOf("/", usernameStartIndex);
  const hospitalUsername = currentUrl.substring(
    usernameStartIndex,
    usernameEndIndex
  );

  const guidStartIndex = usernameEndIndex + 1;
  const guidEndIndex = currentUrl.indexOf("/", guidStartIndex);
  const guid = currentUrl.substring(guidStartIndex, guidEndIndex);
  //alert(hospitalUsername);
  const toggleSubSubMenu = (title) => {
    setActiveSubSubMenu((prevSubSubMenu) =>
      prevSubSubMenu === title ? null : title
    );
  };

  const [isMobile, setIsMobile] = useState(false);
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

  const currentUser = AuthService.getCurrentUser();
  const userRoleDoctor = currentUser?.roles.includes("ROLE_DOCTOR");
  const userRoleNurse = currentUser?.roles.includes("ROLE_NURSE");
  const userRolepharmacist = currentUser?.roles.includes("ROLE_PHARMACIST");
  const userRoleUser = currentUser?.roles.includes("ROLE_USER");
  const userRoleADMIN = currentUser?.roles.includes("ROLE_ADMIN");
  const userRolePatient = currentUser?.roles.includes("ROLE_PATIENT");
  const userRoleSUPERADMIN = currentUser?.roles.includes("ROLE_SUPERADMIN");
  const userRoleSampletech = currentUser?.roles.includes(
    "ROLE_COLLECTIONTECHNICIAN"
  );
  const userRolePATHOLOGISTADMIN = currentUser?.roles.includes(
    "ROLE_PATHOLOGISTADMIN"
  );
  const userDiagnosticsTech = currentUser?.roles.includes(
    "ROLE_DIAGNOSTICTECHNICIAN"
  );
  const userReceptionist = currentUser?.roles.includes("ROLE_RECEPTIONIST");
  const userOTTechnician = currentUser?.roles.includes("ROLE_OTTECHNICIAN");

  const filteredSubNav = item.subNav.filter((subItem) => {
    if (userRoleSUPERADMIN) {
      return (
        subItem.title === "HospitalRegistration" ||
        subItem.title === "HospitalsList" ||
        subItem.title === "HospitalAdministratorReg" ||
        subItem.title === "HospitalAdministratorData"
      );
    } else if (userRoleADMIN) {
      return (
        subItem.title === "ReferalDoctorsList" ||
        subItem.title === "DoctorsList" ||
        subItem.title === "Doctors Managment" ||
        subItem.title === "AddUpdateDrugDatabase" ||
        subItem.title === "AddUpdateInventory" ||
        subItem.title === "UsersDataAll" ||
        subItem.title === "BackUpRestore" ||
        subItem.title === "AssignRole" ||
        subItem.title === "PatientRegistration" ||
        subItem.title === "DoctorRegistration" ||
        subItem.title === "HospitalAdministratorReg" ||
        subItem.title === "NurseRegistration" ||
        subItem.title === "PharmacistRegistration" ||
        subItem.title === "HospitalRegistration" ||
        subItem.title === "CompanyRegistration" ||
        subItem.title === "ViewUsers" ||
        subItem.title === "ResetUserPassword" ||
        // subItem.title === "UploadMasterData" ||
        subItem.title === "CreatePackagePathology" ||
        subItem.title === "CreatePackageDiagnostics" ||
        subItem.title === "Hospital-Rooms" ||
        subItem.title === "CreatePackageHealth" ||
        subItem.title === "CreateReferralType" ||
        subItem.title === "PatientTrends" ||
        subItem.title === "LabCategory" ||
        subItem.title === "SpecimenManagement" ||
        subItem.title === "PackageRevenue" ||
        // subItem.title === "PerTestRevenue" ||
        subItem.title === "PatientSpends" ||
        subItem.title === "PerVisitRevenue" ||
        //subItem.title === t("RevenueForDoctor") ||
        subItem.title === "LostInFollowUp" ||
        subItem.title === "VaccinationPatient" ||
        subItem.title === "TestHistory" ||
        subItem.title === "PathologyAnalysis" ||
        subItem.title === "DiagnosticAnalysis" ||
        subItem.title === "ReferralAnalysis" ||
        subItem.title === "MedicationAdministration" ||
        subItem.title === "AddUpdateOTRooms" ||
        subItem.title === "ConsultationPriceSetup" ||
        subItem.title === "PatientRegistrationFee" ||
        //In-Patient ||
        subItem.title === "AdmissionAndDischargeManagement" ||
        subItem.title === "EHRManagement" ||
        subItem.title === "DiagnosticReportManagement" ||
        subItem.title === "BedAllocationAndManagement" ||
        subItem.title === "BedCategoryAndDistribution" ||
        subItem.title === "MonitoringAndSupervision" ||
        subItem.title === "MedicationManagement" ||
        subItem.title === "BillingManagement" ||
        subItem.title === "HospitalRooms" ||
        /////////////////Diagnostics///////////////////
        subItem.title === "TestBookingPatientList" ||
        subItem.title === "TestManagementReport" ||
        subItem.title === "CloudPACSImageStorage" ||
        subItem.title === "BillGeneration" ||
        ////////////////Pathology//////////////
        subItem.title === "PatientList" ||
        subItem.title === "SampleCollection" ||
        subItem.title === "TestManagement" ||
        subItem.title === "TRFReferralPrescriptionscan" ||
        subItem.title === "DrugDatabase" ||
        subItem.title === "ViewPackages" ||
        ////////////Doctor//////////////
        subItem.title === "OTCalender" ||
        subItem.title === "OTBookingData" ||
        // subItem.title === t("ConsultationPatientlist") ||
        // subItem.title === t("PatientLists") ||

        //////////////Pharmacy///////////////
        subItem.title === "DispenseMedicine" ||
        subItem.title === "ExpiredDrugReports" ||
        // subItem.title === t("MedicineDispensationReport") ||
        subItem.title === "ViewInventory" ||
        subItem.title === "StockInOut" ||
        ///////////Receptionist//////////
        subItem.title === "BillingforRegistration" ||
        subItem.title === "TRFReferralPrescriptionscan" ||
        subItem.title === "PatientRegistration" ||
        subItem.title === "DoctorsAppointment" ||
        subItem.title === "PathologyAppointment" ||
        subItem.title === "BillingforConsultation" ||
        subItem.title === "TestBookingPatientList" ||
        subItem.title === "CorporatePersonalVisits" ||
        subItem.title === "BillGeneration" ||
        //////////////////Patient///////////////
        subItem.title === "MyTests" ||
        subItem.title === "MyPrescriptions" ||
        subItem.title === "MyBills" ||
        subItem.title === "LabEquipmentIntegration"
      );
    } else if (userDiagnosticsTech) {
      return (
        subItem.title === "TestBookingPatientList" ||
        subItem.title === "TestManagementReport" ||
        subItem.title === "ViewPackages" ||
        subItem.title === "CloudPACSImageStorage" ||
        subItem.title === "BillGeneration"
      );
    } else if (userRolePATHOLOGISTADMIN) {
      return (
        subItem.title === "PatientList" ||
        subItem.title === "SampleCollection" ||
        subItem.title === "ViewPackages" ||
        subItem.title === "SpecimenManagement" ||
        subItem.title === "TestManagement" ||
        subItem.title === "TRFReferralPrescriptionscan" ||
        subItem.title === "LabEquipmentIntegration"
      );
    } else if (userRoleDoctor) {
      return (
        subItem.title === "OTCalender" ||
        subItem.title === "OTBookingData" ||
        subItem.title === "ConsultationPatientlist" ||
        subItem.title === "ViewPackages" ||
        subItem.title === "PatientLists" ||
        // subItem.title === t("PatientList") ||
        subItem.title === "PatientRegistration" ||
        subItem.title === "DoctorsAppointment"
      );
    } else if (userOTTechnician) {
      return true;
    } else if (userRolepharmacist) {
      return (
        subItem.title === "DispenseMedicine" ||
        subItem.title === "ExpiredDrugReports" ||
        subItem.title === "MedicationAdministration" ||
        subItem.title === "ViewPackages" ||
        subItem.title === "ViewInventory" ||
        subItem.title === "DrugDatabase" ||
        subItem.title === "VaccinationPatient" ||
        subItem.title === "StockInOut"
      );
    } else if (userRolePatient) {
      return (
        subItem.title === "MyTests" ||
        subItem.title === "MyPrescriptions" ||
        subItem.title === "ViewPackages" ||
        subItem.title === "TestHistory" ||
        subItem.title === "MyBills"
      );
    } else if (userReceptionist) {
      return (
        subItem.title === "BillingforRegistration" ||
        subItem.title === "TRFReferralPrescriptionscan" ||
        subItem.title === "PatientRegistration" ||
        subItem.title === "DoctorsAppointment" ||
        subItem.title === "ViewPackages" ||
        subItem.title === "PathologyAppointment" ||
        subItem.title === "BillingforConsultation" ||
        subItem.title === "CorporatePersonalVisits" ||
        subItem.title === "TestBookingPatientList" ||
        subItem.title === "BillGeneration"
      );
    } else if (userRoleUser) {
      return subItem.title === "User";
    } else if (userRoleNurse) {
      return (
        subItem.title === "PatientList" ||
        subItem.title === "View Drug Database"
      );
    }
    return false;
  });

  const sortedFilteredSubNav = [...filteredSubNav].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  const allowedSubmenuTitles = [
    "PatientTrends",
    "PatientSpends",

    "PackageRevenue",
    "PerTestRevenue",
    "PerVisitRevenue",
    "ReferralAnalysis",
    "RevenueForDoctor",
    "LostInFollowUp",
  ];

  const handleSubMenuItemClick = (event, subItem) => {
    if (allowedSubmenuTitles.includes(subItem.title)) {
      if (
        extractedPart === "beniker" ||
        extractedPart === "beniker.hospital" ||
        extractedPart === "beniker_hospital"
      ) {
        event.preventDefault();
        toast.error(
          "This feature is not included in your subscription. Please get in touch with support to upgrade."
        );
        return;
      }
    }

    toggleSubSubMenu(subItem.title);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const storedLanguage = localStorage.getItem("SelectedLanguage");
  const defaultLanguage = storedLanguage || "en";

  return (
    <>
      <SidebarLink to={item.path} onClick={() => toggleSubMenu(item.title)}>
        <div style={{ fontSize: "14px" }}>
          {item.icon}
          {/* <SidebarLabel>{item.title}</SidebarLabel> */}
          <SidebarLabel>
            {Translation[defaultLanguage][item.title]}
          </SidebarLabel>
        </div>
        <div>
          {item.subNav && (isActive ? item.iconOpened : item.iconClosed)}
        </div>
      </SidebarLink>
      {isActive && item.subNav && item.subNav.length > 0 && (
        <ul style={{ listStyle: "none" }}>
          {sortedFilteredSubNav.map((subItem, index) => (
            <li key={index}>
              <SubMenuItem
                to={hospitals[0]?.name + "/" + subItem.path}
                isActive={activeSubSubMenu === subItem.title}
                onClick={(event) => handleSubMenuItemClick(event, subItem)}
              >
                <div>
                  {subItem.icon}
                  <SidebarLabel>
                    {" "}
                    {Translation[defaultLanguage][subItem.title]}
                  </SidebarLabel>
                </div>
                <div>
                  {subItem.subNav &&
                    (activeSubSubMenu === subItem.title
                      ? subItem.iconOpened
                      : subItem.iconClosed)}
                </div>
              </SubMenuItem>
              {activeSubSubMenu === subItem.title &&
                subItem.subNav &&
                subItem.subNav.length > 0 && (
                  <ul style={{ listStyle: "none" }}>
                    {subItem.subNav.map((subSubItem, subIndex) => (
                      <li key={subIndex}>
                        <SubMenuItem
                          to={subSubItem.path}
                          isActive={activeSubSubMenu === subSubItem.title}
                        >
                          <div>
                            {subSubItem.icon}
                            <SidebarLabel>{subSubItem.title}</SidebarLabel>
                          </div>
                        </SubMenuItem>
                      </li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SubMenu;
