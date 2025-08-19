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
const SidebarData = [
  ///////////......Admin Menu..........//////////////

  // {
  //   title: 'Reset User Password',
  //   path: '/forgotPass',
  //   icon: <FaSyncAlt size={32} />,
  // },

  {
    title: "Administration",

    icon: <FaCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "Reset User Password",
        path: "/forgotPass",
        icon: <RiLock2Line size={16} />,
      },
      {
        title: "Assign Role ",
        path: "/assignRole",
        icon: <IoIcons.IoMdPeople />,
      },
      {
        title: "Upload Master Data ",

        icon: <FaCog />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        isOpen: false,
        subNav: [
          {
            title: "Doctor Data",
            path: "/UploadDoctorData",
            icon: <IoIcons.IoIosPaper />,
          },
          {
            title: "Nurse Data",
            path: "/UploadNurseData",
            icon: <IoIcons.IoIosPaper />,
          },
          {
            title: "Pharmacist Data",
            path: "/UploadPharmacistData",
            icon: <IoIcons.IoIosPaper />,
          },
          {
            title: "Inventory Data",
            path: "/UploadInventoryData",
            icon: <IoIcons.IoIosPaper />,
          },
          {
            title: "Drugs Data",
            path: "/UploadDrugData",
            icon: <IoIcons.IoIosPaper />,
          },
        ],
      },

      // {
      //   title: 'Add/Update Inventory',
      //   path: '/InventoryManagementPage',
      //   icon: <IoIcons.IoIosPaper />
      // }
      // ,
      {
        title: "Add/Update Inventory",
        path: "/EditInventory",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Add/Update Drug Database",
        path: "/ManageDrugDatabase",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },

  {
    title: "Registration",
    icon: <FaCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "Patient Registration",
        path: "/PatientRegister",
        icon: <IoIcons.IoIosPaper />,
      },

      {
        title: "Doctor Registration",
        path: "/DoctorRegistration",
        icon: <IoIcons.IoIosPaper />,
      },

      {
        title: "Hospital Administrator Reg.",
        path: "/HospitalAdministratorRegistration",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Nurse Registration",
        path: "/NurseRegistration",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Pharmacist Registration",
        path: "/pharmacistReg",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Hospital Registration",
        path: "/HospitalRegistration",
        icon: <IoIcons.IoIosPaper />,
      },
      // {
      //   title: "Pathologytest Registration",
      //   path: "/Pathologytest",
      //   icon: <IoIcons.IoIosPaper />,
      // },

      {
        title: "View  Patients",
        path: "/PatientListCounter",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },

      {
        title: "View Doctor ",
        path: "/DoctorData",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "View Hospital Admin Data",
        path: "/HospitalAdminData",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "View Nurse ",
        path: "/NurseData",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "View Pharmacist",
        path: "/PharmacistData",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "OT Management",

    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "OT Calender",
        path: "/CreateEditOTCalender",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "OT Booking Data",
        path: "/ViewOTList",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      // {
      //   title: 'Add OT Name',
      //   path: '/AddOTNameNumber',
      //   icon: <IoIcons.IoIosPaper />,
      //   cName: 'sub-nav'
      // },
      {
        title: "Add/Update OT Rooms",
        path: "/ViewOTs",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
    ],
  },

  {
    title: "Pharmacy Management",

    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "View Inventory data",
        path: "/InventoryData",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "View Inventory Out data",
        path: "/InventoryDataOut",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Medication Administration Records",
        path: "/adminReport",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Expired Drugs Reports",
        path: "/expiryReport",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Medicine Dispensation Report",
        path: "/DispensedReportsList",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Drug Database",
        path: "/drugDatabase",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      // {
      //   title: 'Add-Substitute/Delete',
      //   path: '/ManageDrugDatabase',
      //   icon: <IoIcons.IoIosPaper />,
      //   cName: 'sub-nav'
      // },
    ],
  },
  {
    title: "Book Appointment",
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "Doctor Consultation",
        path: "/DoctorsAppointmentsM",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Pathologist Test",
        path: "/PathologyBookingData",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "Patient List(Pathology)",
    path: "/Pathologytest",
    icon: <IoIcons.IoIosPaper />,
  },
  {
    title: "View Package",
    path: "/TestPackageManagement",
    icon: <IoIcons.IoIosPaper />,
  },
  {
    title: "Diagnostics Management",
    path: "/DiagnosticsBookingManagement",
    icon: <IoIcons.IoIosPaper />,
  },

  /////....Doctor.../////////////

  {
    title: "Consultation List",
    path: "/PatientList",
    icon: <IoIcons.IoIosPaper />,
  },
  {
    title: "Patient list(Pathology)",
    path: "/PatientListPathologyResult",
    icon: <IoIcons.IoIosPaper />,
  },
  // {
  //   title: 'OT Managements',

  //   icon: <IoIcons.IoIosPaper />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,
  //   isOpen: false,
  //   subNav:
  //     [
  {
    title: "OT Calender",
    path: "/CreateEditOTCalender",
    icon: <IoIcons.IoIosPaper />,
  },
  {
    title: "OT Booking Data",
    path: "/ViewOTList",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },
  {
    title: "Drug Database",
    path: "/drugDatabase",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },

  //     ]
  // },

  //////////.....Nurse Menu......../////////////
  {
    title: "Patients Data",
    path: "/PatientDataNurse",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },

  {
    title: "View Drug Databases",
    path: "/drugDatabase",
    icon: <IoIcons.IoIosPaper />,
  },

  {
    title: "Pharmacist",

    icon: <FaIcons.FaCartPlus />,
  },
  {
    title: "Patient Data",
    path: "/PaitentListPharmacist",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },

  /////////for patient
  {
    title: "Patient Test's",
    path: "/PathologytestOwnReport",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },

  ////////////////////...Super Admin menu..../////////////

  {
    title: "Hospital Registration",
    path: "/HospitalRegistration",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },
  {
    title: "Hospital Admin Reg.",
    path: "/HospitalAdministratorRegistration",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },
  ,
  {
    title: "Hospital Admin Data",
    path: "/HospitalAdminData",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },

  ,
  ////////////////////...Pathologist menu..../////////////

  {
    title: "Sample Collection",
    path: "/sampleCollectionForm",
    icon: <FaIcons.FaCartPlus />,
    cName: "sub-nav",
  },
  {
    title: "Test Management",
    path: "/pathalogytestManagement",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },
  ,
  {
    title: "Referral type",
    path: "/CommissionCodeData",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },
  ////////......Pharmacist menu ........////////
  {
    title: "Dispense Medicine",
    path: "/PharmacistPrescriptionList",
    icon: <FaIcons.FaCartPlus />,
    cName: "sub-nav",
  },
  {
    title: "Dispense Medicine Outside",
    path: "/DispenseMedicineOutside",
    icon: <FaIcons.FaCartPlus />,
    cName: "sub-nav",
  },
  // {
  //   title: 'Dispense Mediciness',
  //   path: '/searchPatientToDispense',
  //   icon: <FaIcons.FaCartPlus />,
  //   cName: 'sub-nav'
  // },

  {
    title: "View Expired Drugs Report",
    path: "/expiryReport",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },
  {
    title: "Medicine Dispensation Report",
    path: "/DispensedReportsList",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },
  {
    title: "View Drug Database",
    path: "/drugDatabase",
    icon: <IoIcons.IoIosPaper />,
    cName: "sub-nav",
  },

  {
    title: "Medication Datass",

    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    isOpen: false,
    subNav: [
      {
        title: "Medication Admin Records",
        path: "/adminReport",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },

      // {
      //   title: 'Doctor Data',
      //   path: '/DoctorData',
      //   icon: <IoIcons.IoIosPaper />,
      //   cName: 'sub-nav'
      // },
      // {
      //   title: 'Nurse Data',
      //   path: '/NurseData',
      //   icon: <IoIcons.IoIosPaper />,
      //   cName: 'sub-nav'
      // },
      // {
      //   title: 'Pharmacist Data',
      //   path: '/PharmacistData',
      //   icon: <IoIcons.IoIosPaper />,
      //   cName: 'sub-nav'
      // },
    ],
  },
];

const currentUser = authService.getCurrentUser();
if (currentUser) {
  SidebarData.push({
    title: "ViewPrescription",
    path: `/viewPatientPrescription/${currentUser.phoneNumber}`,
    icon: <IoIcons.IoMdPeople />,
  });
}

if (currentUser) {
  SidebarData.push({
    title: "Reset_Password",
    path: "/forgotPass",
    icon: <IoIcons.IoMdPeople />,
  });
}

export default SidebarData;
