import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FaCog } from "react-icons/fa";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { FaSyncAlt } from "react-icons/fa";
import { RiLock2Line } from "react-icons/ri";

import * as RiIcons from "react-icons/ri";
import authService from "../services/auth.service";
const currentUser = authService.getCurrentUser();

const SidebarData = [
  ///////////.......SuperAdmin........../////////////////
  {
    title: "Hospitals",

    icon: <FaCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "HospitalsList",
        path: "/HospitalForm",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },

  {
    title: "BackUpRestore",

    icon: <FaCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "BackUpRestore",
        path: "/backup",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },

  ///////////......Admin Menu..........//////////////
  {
    title: "HospitalConfiguration",

    icon: <FaCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "AddUpdateDrugDatabase",
        path: "/ManageDrugDatabase",
        icon: <IoIcons.IoIosWallet />,
      },
      // {
      //   title: "BackUpRestore",
      //   path: "/backup",
      //   icon: <IoIcons.IoIosWallet />,
      // },
      {
        title: "UsersDataAll",
        path: "/UsersDataAll",
        icon: <IoIcons.IoIosWallet />,
      },
      {
        title: "AddUpdateInventory",
        path: "/EditInventory",
        icon: <IoIcons.IoLogoBitbucket />,
      },
      {
        title: "AssignRole",
        path: "/assignRole",
        icon: <IoIcons.IoMdPeople size={16} />,
      },
      {
        title: "PatientRegistrationFee",
        path: "/PatientRegistrationFee",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "PatientRegistration",
        path: "/PatientRegister",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "ConsultationPriceSetup",
        path: "/ConsultationPriceSetup",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "DoctorRegistration",
        path: "/DoctorRegistration",
        icon: <IoIcons.IoIosPaper />,
      },

      {
        title: "HospitalAdministratorReg",
        path: "/HospitalAdministratorRegistration",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "NurseRegistration",
        path: "/NurseRegistration",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "PharmacistRegistration",
        path: "/pharmacistReg",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "HospitalRegistration",
        path: "/HospitalRegistration",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "CompanyRegistration",
        path: "/CompanyRegistration",
        icon: <IoIcons.IoIosPaper />,
      },

      {
        title: "ViewUsers",
        path: "/PatientListCounter",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "ResetUserPassword",
        path: "/forgotPass",
        icon: <RiLock2Line size={16} />,
      },
      {
        title: "UploadMasterData",

        icon: <FaCog />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        isOpen: false,
        subNav: [
          {
            title: "DoctorData",
            path: "/UploadDoctorData",
            icon: <IoIcons.IoIosPaper />,
          },
          {
            title: "NurseData",
            path: "/UploadNurseData",
            icon: <IoIcons.IoIosPaper />,
          },
          {
            title: "PharmacistData",
            path: "/UploadPharmacistData",
            icon: <IoIcons.IoIosPaper />,
          },
          {
            title: "InventoryData",
            path: "/UploadInventoryData",
            icon: <IoIcons.IoIosPaper />,
          },
          {
            title: "DrugsData",
            path: "/UploadDrugData",
            icon: <IoIcons.IoIosPaper />,
          },
        ],
      },
      {
        title: "CreatePackagePathology",
        path: "/TestPackageManagement",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "CreatePackageDiagnostics",
        path: "/Diagnosticspackagemanagement",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "CreatePackageHealth",
        path: "/Helthpackagemanagement",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "CreateReferralType",
        path: "/CommissionCodeData",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
    ],
  },

  {
    title: "Analytics",

    icon: <FaCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "Hospital Earnings",
        path: "/HospitalAnalytics",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "All Patinent List",
        path: "/OverAllPatientList",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "PatientTrends",
        path: "/PatientTrendsReport",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "PatientSpends",
        path: "/PathologyAnalytics",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "TestHistory",
        path: "/PatientTestHistory",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "PackageRevenue",
        path: "/PackageRevenuePathology",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "PerTestRevenue",
        path: "/PerTestRevenuePathology",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "PerVisitRevenue",
        path: "/PerVisitPathologyRevenue",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "ReferralAnalysis",
        path: "/ReferralAnalysisPathology",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "RevenueForDoctor",
        path: "/RevenueForReferralDoctor",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "LostInFollowUp",
        path: "/LostInFollow",
        icon: <IoIcons.IoIosPaper />,
      },
      // {
      //   title: "Pathology Analysis",
      //   path: "/PathologyAnalytics",
      //   icon: <IoIcons.IoIosPaper />,
      // },
      // {
      //   title: "Diagnostic Analysis",
      //   path: "/DiagnosticAnalytics",
      //   icon: <IoIcons.IoIosPaper />,
      // },
    ],
  },

  {
    title: "PatientList",

    icon: <FaCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "PatientList",
        path: "/PatientDataNurse",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },

  {
    title: "Diagnostics",

    icon: <FaCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "TestBookingPatientList",
        path: "/DiagnosticsBookingManagement",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "TestManagementReport",
        path: "/DiagnosticTestManagement",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "LabCategory",
        path: "/DiagnosticLabCategory",
        icon: <IoIcons.IoIosPaper />,
      },

      {
        title: "CloudPACSImageStorage",
        path: "/DiagnosticCloudPackImage",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "BillGeneration",
        path: "/BillingForDiagnostics",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "PatientLists",
        path: "/DignosticPatientList",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },

  {
    title: "Doctors Managment",

    icon: <FaCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "DoctorsList",
        path: "/doctorsList",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "ReferalDoctorsList",
        path: "/referaldoctorsList",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "YourEarnings",
        path: "/showAllEarningDoctor",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },

  ///////////////////////////////Pharmacist//////////////////////////////////
  {
    title: "Pharmacy",

    icon: <FaCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "DispenseMedicine",
        path: "/PharmacistPrescriptionList",
        icon: <FaIcons.FaCartPlus />,
        cName: "sub-nav",
      },
      {
        title: "DrugDatabase",
        path: "/drugDatabase",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "ExpiredDrugReports",
        path: "/expiryReport",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "MedicineDispensationReport",
        path: "/DispensedReportsList",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "MedicationAdministration",
        path: "/adminReport",
        icon: <IoIcons.IoIosPaper />,
      },
      // {
      //   title: "View Inventory",
      //   path: "/InventoryData",
      //   icon: <IoIcons.IoIosPaper />,
      // },
      {
        title: "StockInOut",
        path: "/InventoryData",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "OperationTheater",

    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "OTCalender",
        path: "/CreateEditOTCalender",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "OTBookingData",
        path: "/ViewOTList",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },

      {
        title: "AddUpdateOTRooms",
        path: "/ViewOTs",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "OutPatient",

    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "PatientRegistration",
        path: "/PatientRegister",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "DoctorsAppointment",
        path: "/DoctorsAppointmentsM",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "PathologyAppointment",
        path: "/PathologyBookingData",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "BillingforRegistration",
        path: "/BillingAtRegistration",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },

      {
        title: "BillingforConsultation",
        path: "/BillingforConsultation",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "CorporatePersonalVisits",
        path: "/CorporatePersonalVisits",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Prescription",
        path: "/notcreated",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "ConsultationPatientlist",
        path: "/PatientList",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "VaccinationPatient",
        path: "/VaccinationFormPatient",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      // {
      //   title: "TRF/Referral Prescription scan",
      //   path: "/notcreated",
      //   icon: <IoIcons.IoIosPaper />,
      //   cName: "sub-nav",
      // },
    ],
  },
  {
    title: "InPatient",

    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "AdmissionAndDischargeManagement",
        path: "/admissionAndDischarge",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "EHRManagement",
        path: "/EHRReport",
        icon: <IoIcons.IoIosPaper />,
      },
      // {
      //   title: "Hospital-Rooms",
      //   path: "/Hospital-Rooms",
      //   icon: <IoIcons.IoIosPaper />,
      // },
      // {
      //   title: "DiagnosticReportManagement",
      //   path: "/non",
      //   icon: <IoIcons.IoIosPaper />,
      // },
      {
        title: "BedAllocationAndManagement",
        path: "/InpatientCalender",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "BedCategoryAndDistribution",
        path: "/Hospital-Rooms",
        icon: <IoIcons.IoIosPaper />,
      },
      // {
      //   title: "MonitoringAndSupervision",
      //   path: "/non",
      //   icon: <IoIcons.IoIosPaper />,
      // },
      // {
      //   title: "MedicationManagement",
      //   path: "/non",
      //   icon: <IoIcons.IoIosPaper />,
      // },
      {
        title: "BillingManagement",
        path: "/billing-Mangement",
        icon: <IoIcons.IoIosPaper />,
      },
      // {
      //   title: "Hospital Rooms",
      //   path: "/hospital-rooms",
      //   icon: <IoIcons.IoIosPaper />,
      // },
    ],
  },
  {
    title: "Packages",

    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "ViewPackages",
        path: "/AllPackagesView",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "Pathology",

    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "PatientList",
        path: "/Pathologytest",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "SpecimenManagement",
        path: "/SpecimenManagement",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "PatientLists",
        path: "/PatientListPathologyResult",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "LabCategory",
        path: "/DiagnosticLabCategory",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Specimen Management",
        path: "/SpecimenManagement",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "SampleCollection",
        path: "/sampleCollectionForm",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "TestManagement",
        path: "/pathalogytestManagement",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      // {
      //   title: "TRFReferralPrescriptionscan",
      //   path: "/CommingSoon",
      //   icon: <IoIcons.IoIosPaper />,
      //   cName: "sub-nav",
      // },
    ],
  },
  /////////////////////Patient/////////////////////////////
  {
    title: "MySpaces",

    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "MyTests",
        path: "/PathologytestOwnReport",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "MyPrescriptions",
        path: `/viewPatientPrescription/${currentUser?.phoneNumber}`,
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "MyBills",
        path: "/pathologyBills",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "TestHistory",
        path: "/PatientOwnTestHistory",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "Laboratory",
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "LabEquipmentIntegration",
        path: "/lab",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
    ],
  },
];

export default SidebarData;
