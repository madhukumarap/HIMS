import React, { useState, useEffect, useContext, useCallback } from "react";
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Pagination, Modal, Button } from "react-bootstrap";
import axios from "axios";
import Datepickrange from "./DateRangeCalender";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import generatePatientReportPDF from "./generatePatientReportPDF";
import generatePatientReportPDF1 from "./generatePatientReportPDF1";

import {
  FaPencilAlt,
  FaTrashAlt,
  FaRegEye,
  FaPlusSquare,
  FaDownload,
} from "react-icons/fa";
import UploadDiagnosticImages from "../pages/DiagnosticsComponent/UploadDiagnosticImages";
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../services/auth.service";
import Translation from "../translations/DiagnosticsBookingManagement.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { CurrencyContext } from "../context/CurrencyProvider";

function AllPatientList() {
  const currentUser = AuthService.getCurrentUser();
  const { t } = useTranslation();
  const { selectedGlobalCurrency, convertCurrency, rates } =
    useContext(CurrencyContext);

  // State management
  const [bookings, setBookings] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [hopsitalDatadata, setHopsitalData] = useState(null)
  const [hopsitalDatadata1, setHopsitalData1] = useState(null)
  const [appointments, setAppointments] = useState([]);
  const [diagnosticsBookings, setDiagnosticsBookings] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );
  const [isMobile, setIsMobile] = useState(false);

  // New state for test reports
  const [testStatuses, setTestStatuses] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Check if user has access
  if (!currentUser) return "Access Denied";

  const roleCurrentUser = currentUser.roles[0];
  const allowedRoles = [
    "ROLE_DIAGNOSTICTECHNICIAN",
    "ROLE_DOCTOR",
    "ROLE_ADMIN",
    "ROLE_RECEPTIONIST",
  ];

  if (!allowedRoles.includes(roleCurrentUser)) return "Access Denied";

  // Date formatting
  const locales = { enIN, fr };

  // Initialize i18n - Fixed to run only once
  useEffect(() => {
    const initializei18n = () => {
      // Only initialize if not already initialized
      if (!i18n.isInitialized) {
        const resources = {
          en: { translation: Translation["en"] },
          fr: { translation: Translation["fr"] },
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
      }
    };

    initializei18n();
  }, []);

  // Responsive design
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Fetch data from all APIs
  useEffect(() => {
    fetchAllData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchBookings(),
        fetchAppointments(),
        fetchDiagnosticsBookings(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllBookingsTest`,
        {
          headers: { Authorization: `${currentUser?.Token}` },
        }
      );
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchDiagnosticsBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDiagnosticsBooking`,
        {
          headers: { Authorization: `${currentUser?.Token}` },
        }
      );
      setDiagnosticsBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching diagnostics bookings:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllDoctorsAppointments`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Fetch test statuses based on booking type
  const fetchTestStatuses = async (bookingId, type) => {
    try {
      let endpoint = "";

      if (type === "pathology") {
        endpoint = `${
          import.meta.env.VITE_API_URL
        }/api/PathologyTestStatuses/${bookingId}`;
      } else if (type === "diagnostics") {
        endpoint = `${
          import.meta.env.VITE_API_URL
        }/api/DiagnosticTestStatuses/${bookingId}`;
      } else {
        // Appointments don't have test reports
        toast.info(t("No Test Reports Available For Appointments"));
        return [];
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching test statuses:", error);
      toast.error(t("Error Fetching Test Reports"));
      return [];
    }
  };

  // Combine and format data from all APIs
  useEffect(() => {


    const combined = [
      ...bookings.map((booking) => ({
        id: booking.id,
        type: "pathology",
        patientName: booking.PatientName,
        phone: booking.PatientPhoneNo,
        doctorName: booking.DoctorName,
        doctorMobile: booking.DoctorPhone,
        status: booking.status,
        paymentStatus: booking.PaymentStatus,
        amount: booking.PaidAmount,
        totalFees: booking.TotalFees,
        currency: booking.Currency,
        date: booking.createdAt,
        referralType: booking.commissionValue,
        remarks: booking.remarks,
        selectedTests: booking.selectedTests,
      })),
      ...appointments.map((appointment) => ({
        id: appointment.id,
        type: "appointment",
        patientName: appointment.PatientName,
        phone: appointment.PatientPhone,
        doctorName: appointment.DoctorName,
        doctorMobile: appointment.DoctorPhone,
        status: appointment.paymentStatus === "paid" ? "Completed" : "Pending",
        paymentStatus: appointment.paymentStatus,
        amount: appointment.amount,
        totalFees: appointment.amount,
        currency: appointment.Currency || "INR",
        date: appointment.createdAt,
        referralType: appointment.visitType,
        remarks: appointment.reason,
        selectedTests: "",
      })),
      ...diagnosticsBookings.map((booking) => ({
        id: booking.id,
        type: "diagnostics",
        patientName: booking.PatientName,
        phone: booking.PatientPhoneNo,
        doctorName: booking.DoctorName,
        doctorMobile: booking.DoctorPhone,
        status: booking.status,
        paymentStatus: booking.PaymentStatus,
        amount: booking.PaidAmount,
        totalFees: booking.TotalFees,
        currency: booking.Currency || "INR",
        date: booking.createdAt,
        referralType: booking.commissionValue,
        remarks: booking.remarks,
        selectedTests: booking.selectedTests,
      })),
    ];

    setCombinedData(combined);
  }, [bookings, appointments, diagnosticsBookings]);

  // Date handlers
  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1); // Reset to first page when date changes
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
    setCurrentPage(1); // Reset to first page when date is cleared
  };

  // Filter data based on search query and date range
  const filteredData = combinedData.filter((item) => {
    const isNameMatch =
      (item.patientName &&
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.phone && item.phone.toString().includes(searchQuery));

    const itemDate = new Date(item.date);
    const isDateMatch =
      (!startDate || itemDate >= startDate) &&
      (!endDate || itemDate <= endDate);

    return isNameMatch || isDateMatch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate pagination items
  const renderPaginationItems = () => {
    let items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => paginate(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" />);
      }
    }

    // Page numbers
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => paginate(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => paginate(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  // View test report
  const handleViewTestReport = async (item) => {

    if (item.type === "appointment") {
      toast.info(t("No Test Reports Available For Appointments"));
      return;
    }

    setLoading(true);
    try {
      const reports = await fetchTestStatuses(item.id, item.type);

      if (reports.length === 0) {
        toast.info(t("No Test Reports Available"));
        return;
      }

      setSelectedReport({
        patientName: item.patientName,
        type: item.type,
        reports: reports,
      });
      setShowReportModal(true);
      return reports;
    } catch (error) {
      console.error("Error viewing test report:", error);
      toast.error(t("ErrorLoadingTestReports"));
    } finally {
      setLoading(false);
    }
  };

 

const generateBill = async (rowData) => {
  const typeData = rowData.type
  try {
    let testReports = [];
    if (rowData.type !== "appointment") {
      try {
        testReports = await fetchTestStatuses(rowData.id, rowData.type);
      } catch (error) {
        console.error("Error fetching test reports:", error);
        toast.error(t("ErrorLoadingTestReports"));
        return; // Return early on error
      }
      
      if (!testReports || testReports.length === 0) {
        toast.error(t("No Test Reports Available"));
        return;
      }

      if (rowData.id) {
        try {
          // Fetch test results (which already includes Doctor data)
          const testResponse = await fetch(
            `${
              import.meta.env.VITE_API_URL
            }/api/getLastRecordByPatientTestBookingIDForMultipleTest/${rowData.id}`,
            {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            }
          );

          if (!testResponse.ok) {
            throw new Error(`Failed to fetch test data: ${testResponse.status}`);
          }

          const testData = await testResponse.json();

          const filteredResults = Object.fromEntries(
            Object.entries(testData.results).filter(
              ([key, value]) => value !== null
            )
          );
          
          // Fetch medicine data with await instead of .then()
          const medicineResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/GetDispensedListOfPr/${rowData.id}`,
            {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            }
          );
          
          if (!medicineResponse.ok) {
            throw new Error(`Failed to fetch medicine data: ${medicineResponse.status}`);
          }
          
          const medicineData = await medicineResponse.json();
          console.log(medicineData);
          
          // If you need this data in state, set it but don't rely on it immediately
          setHopsitalData1(medicineData);

          const hospitalResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
            {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            }
          );
              
          const hospitalData = hospitalResponse.data.data;
                  
          const hospitalLogoBase64 = hospitalData.logo;
          const hospitalLogo = new Image();
          hospitalLogo.src = `data:image/png;base64,${hospitalLogoBase64}`;

          setHopsitalData(hospitalData);
          
          // Use medicineData directly (the variable), not the state
          console.log(medicineData, "medicineData");
          
          const reportData = {
            typeData,
            hospitalData,
            pathologyTest: testData.pathologyTest,
            selectedTests: testData.selectedTestsArray,
            doctor: testData.Doctor,
            results: testData.results,
            medicineData: medicineData // Add medicineData to the report
          };
          
          return reportData;

        } catch (error) {
          console.error("Error in fetchData:", error);
          toast.error(error.message || "Failed to fetch data");
          throw error; // Re-throw to handle in outer catch
        }
      }
    }
  } catch (error) {
    console.error("Error generating bill:", error);
    toast.error(t("ErrorGeneratingBill"));
  }
};

const generateBillAppoinment = async (rowData) => {
  const typeData = rowData.type;
  
  // Initialize all data with default values
  let reportData = {
    typeData,
    hospitalData: null,
    pathologyTest: null,
    selectedTests: null,
    doctor: null,
    results: null,
    medicineData: [],
    prescriptionData: null,
    inventoryData: []
  };

  try {
    let testReports = [];
    if (rowData.type == "appointment") {
      try {
        testReports = await fetchTestStatuses(rowData.id, rowData.type);
      } catch (error) {
        console.error("Error fetching test reports:", error);
        toast.error(t("ErrorLoadingTestReports"));
        // Continue execution even if test reports fail
      }
      
      if (!testReports || testReports.length === 0) {
        toast.error(t("No Test Reports Available"));
      }

      if (rowData.id) {
        const id2 = rowData.id || rowData.prescriptionId;
        
        // Fetch all data in parallel with error handling for each request
        try {
          // Fetch test results
          const testResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/getLastRecordByPatientTestBookingIDForMultipleTest/${rowData.id}`,
            {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            }
          );

          if (testResponse.ok) {
            const testData = await testResponse.json();
            reportData = {
              ...reportData,
              pathologyTest: testData.pathologyTest,
              selectedTests: testData.selectedTestsArray,
              doctor: testData.Doctor,
              results: testData.results
            };
          } else {
            console.warn("Test data API failed:", testResponse.status);
          }
        } catch (error) {
          console.error("Error fetching test data:", error);
        }

        try {
          // Fetch medicine inventory
          const medicinesResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/getInventryItems`,
            {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            }
          );
          reportData.inventoryData = medicinesResponse.data;
        } catch (error) {
          console.error("Error fetching inventory data:", error);
        }

        try {
          // Fetch prescription data
          const prescriptionResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/getOnePrescription/${id2}`,
            {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            }
          );
          reportData.prescriptionData = prescriptionResponse.data;
        } catch (error) {
          console.error("Error fetching prescription data:", error);
        }

        try {
          // Fetch medicine dispensation data
          const medicineResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/GetDispensedListOfPr/${id2}`,
            {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            }
          );
          reportData.medicineData = medicineResponse.data;
        } catch (error) {
          console.error("Error fetching medicine data:", error);
        }

        try {
          // Fetch hospital data
          const hospitalResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
            {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            }
          );
          reportData.hospitalData = hospitalResponse.data.data;
          setHopsitalData(hospitalResponse.data.data);
        } catch (error) {
          console.error("Error fetching hospital data:", error);
        }

        console.log("Final report data:", reportData);
        return reportData;
      }
    }
  } catch (error) {
    console.error("Error generating bill:", error);
    toast.error(t("ErrorGeneratingBill"));
    // Return whatever data we have collected so far
    return reportData;
  }
  return reportData;
};
  const handleGenerateBill = async (rowData) => {
    if (rowData.type == "appointment"){
      console.log("jhdkjsahjkashdkj")
      const data = await generateBillAppoinment(rowData)
      if (data){
        setReportData(data);
      }
      const hospitalData = data?.hospitalData || hopsitalDatadata
    generatePatientReportPDF1  (
      rowData,
          data?.typeData,
          hospitalData,
          data?.medicineData || [],
          data?.inventoryData
      )
    }
    else {
    const data = await generateBill(rowData);
    if (data) {
      setReportData(data);
    }
    const hospitalData = data?.hospitalData || hopsitalDatadata
    generatePatientReportPDF  (
          data?.typeData,
          hospitalData,
          data?.pathologyTest || [],
          data?.selectedTests || [],
          data?.doctor || [],
          data?.results || [],
          data?.medicineData || []
      )
  }
  };
  
  // Download test report

  const generateBill = async (rowData) => {
    console.log("rowData=", rowData);

    try {
      let testReports = [];
      if (rowData.type !== "appointment") {
        try {
          testReports = await fetchTestStatuses(rowData.id, rowData.type);
        } catch (error) {
          console.error("Error fetching test reports:", error);
          toast.error(t("ErrorLoadingTestReports"));
        }

        if (!testReports || testReports.length === 0) {
          toast.error(t("No Test Reports Available"));
          return;
        }
      }

      const hospitalResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      const hospitalData = hospitalResponse.data.data;
      const pdf = new jsPDF();

      const hospitalLogoBase64 = hospitalData.logo;
      const hospitalLogo = new Image();
      hospitalLogo.src = `data:image/png;base64,${hospitalLogoBase64}`;

      hospitalLogo.onload = function () {
        pdf.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);
        pdf.setFontSize(12);

        pdf.text(hospitalData.hospitalName, 20, 20);
        pdf.text(hospitalData.address, 20, 30);
        pdf.text(`${hospitalData.pincode}, India`, 20, 35);
        pdf.text(`Tel: ${hospitalData.landline}`, 20, 40);
        pdf.text(`Mail: ${hospitalData.email}`, 20, 45);

        pdf.setFillColor("#48bcdf");
        const titleText = t("Consultant Booking Receipt");
        const titleHeight = 10;
        pdf.rect(0, 53, pdf.internal.pageSize.getWidth(), titleHeight, "F");
        pdf.setTextColor("#ffffff");
        pdf.setFontSize(16);
        pdf.text(titleText, pdf.internal.pageSize.getWidth() / 2, 59, {
          align: "center",
        });
        pdf.setTextColor("#000000");

        const formatDateSafely = (dateString) => {
          if (!dateString) return "N/A";
          const date = new Date(dateString);
          return isNaN(date.getTime()) ? "N/A" : formatDate(date);
        };

        const formatTimeSafely = (dateString) => {
          if (!dateString) return "N/A";
          const date = new Date(dateString);
          return isNaN(date.getTime())
            ? "N/A"
            : date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
        };

        // Prepare table data
        const tableData = [
          [
            t("Patient Name"),
            rowData.patientName || rowData.PatientName || "N/A",
          ],
          [t("Patient Phone"), rowData.phone || rowData.PatientPhone || "N/A"],
          [
            t("Booking Date"),
            formatDateSafely(rowData.createdAt || rowData.date),
          ],
          [
            t("Doctor Name"),
            `Dr. ${rowData.doctorName || rowData.DoctorName || "N/A"}`,
          ],
          [
            t("Doctor Phone"),
            rowData.doctorMobile || rowData.DoctorPhone || "N/A",
          ],
          [
            t("Booking Start - End"),
            `${formatDateSafely(
              rowData.bookingStartDate || rowData.date
            )} ${formatTimeSafely(
              rowData.bookingStartDate || rowData.date
            )} - ${formatDateSafely(testReports[0]?.TestCompletedDateTime)}`,
          ],
          [t("Payment Status"), (rowData.paymentStatus || "N/A").toUpperCase()],
          [
            t("Payment Date"),
            rowData?.date ? formatDateSafely(rowData.date) : "MM-DD-YYYY",
          ],
          [
            t("Amount"),
            `${rowData?.amount || rowData?.totalFees || "0.00"} ${
              rowData?.currency || "INR"
            }`,
          ],
          [t("Service Type"), rowData.type || "N/A"],
          [t("Status"), rowData.status || "N/A"],
          [
            t("Tests"),
            rowData.selectedTests || "No Report Available for this Patient",
          ],
        ];

        // Generate the table
        pdf.autoTable({
          startY: 70,
          head: [[t("Field"), t("Details")]],
          body: tableData,
          theme: "grid",
          headStyles: {
            fillColor: [72, 188, 223],
            textColor: 255,
            fontStyle: "bold",
          },
          styles: { fontSize: 10, cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 110 },
          },
        });

        // Footer
        pdf.setFillColor("#48bcdf");
        pdf.rect(0, 270, pdf.internal.pageSize.getWidth(), 10, "F");
        pdf.setTextColor("#ffffff");
        pdf.setFontSize(12);
        pdf.text(
          "Powered by mediAI",
          pdf.internal.pageSize.getWidth() / 2,
          277,
          { align: "center" }
        );

        // Generate file name
        const reportEndDate =
          testReports?.[0]?.TestCompletedDateTime || rowData.date;
        const reportType =
          rowData.type === "appointment"
            ? "consultation"
            : rowData.type || "diagnostic";
        const safePatientName = (rowData.patientName || "Unknown").replace(
          /\s+/g,
          "_"
        );

        const fileName = `${safePatientName}_${
          rowData.id
        }_${reportType}_${formatDateSafely(rowData.date)}_${formatDateSafely(
          reportEndDate
        )}_Report.pdf`;
        pdf.save(fileName);
      };
    } catch (error) {
      console.error("Error generating bill:", error);
      toast.error(t("ErrorGeneratingBill"));
    }
  };

  // Convert report data to CSV format

  const handleViewTestNames = (item) => {
    console.log("View details for:", item);
  };

  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };

  const handleAddResult = (item) => {
    if (item?.paymentStatus === "Not-Paid") {
      toast.error(t("PaymentNotPaidforthisPatient"));
      return;
    }

    if (item?.paymentStatus === "Partial-Paid") {
      const confirmed = window.confirm(t("PaymentWasPartialAreYouSure"));
      if (!confirmed) return;
    }
  };

  const handleGenerateReportNew = (item) => {
    if (item.status !== "Completed") {
      toast.error(t("ResultNotFound"));
      return;
    }
    // Implement report generation
  };

  // Test Report Modal
  const TestReportModal = ({ show, onHide, report }) => {
    if (!report) return null;

    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered // ✅ This centers the modal vertically
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {t("Test Report For")}: {report.patientName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{t("Test Name")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Registered Date")}</th>
                  <th>{t("Sample Collected Date")}</th>
                  <th>{t("Completed Date")}</th>
                </tr>
              </thead>
              <tbody>
                {report.reports.map((test, index) => (
                  <tr key={index}>
                    <td>{test.testName || "N/A"}</td>
                    <td>{test.TestStatus || "N/A"}</td>
                    <td>
                      {test.TestRegisteredDateTime
                        ? formatDate(new Date(test.TestRegisteredDateTime))
                        : "N/A"}
                    </td>
                    <td>
                      {test.TestSamplecollectedDateTime
                        ? formatDate(new Date(test.TestSamplecollectedDateTime))
                        : formatDate(test.TestRegisteredDateTime)}
                    </td>
                    <td>
                      {test.TestCompletedDateTime
                        ? formatDate(new Date(test.TestCompletedDateTime))
                        : test.TestCompletedDateTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            {t("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Mobile card component
  const MobileItemCard = ({ item, index }) => (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">
          {t("PatientName")}: {item.patientName}
        </h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Type:{" "}
          {item.type === "pathology"
            ? "Pathology Booking"
            : item.type === "diagnostics"
            ? "Diagnostics Booking"
            : "Appointment"}
        </h6>
        <p className="card-text">
          Sr No: {(currentPage - 1) * itemsPerPage + index + 1}
        </p>
        <p className="card-text">
          {t("Doctor Name")}:{" "}
          {item.doctorName && item.doctorName !== "NA NA"
            ? `Dr. ${item.doctorName}`
            : "NA"}
        </p>
        <p className="card-text">
          {t("Doctor Phone")}:{" "}
          {item.doctorMobile && item.doctorMobile !== "NA NA NA"
            ? `Dr. ${item.doctorMobile}`
            : "NA"}
        </p>
        <p className="card-text">
          {t("ReferralType")}: {item.referralType || "N/A"}
        </p>
        <p className="card-text">
          {t("PatientPhone")}: {item.phone || "N/A"}
        </p>
        <p className="card-text">
          {t("Status")}: {item.status || "N/A"}
        </p>
        <p className="card-text">
          {t("PaymentStatus")}: {item.paymentStatus || "N/A"}
        </p>
        <p className="card-text">
          {t("TestFees")}:{" "}
          {convertCurrency(
            item.totalFees || item.amount || 0,
            item.currency || "INR",
            selectedGlobalCurrency
          )}{" "}
          {selectedGlobalCurrency}
        </p>
        <p className="card-text">
          {t("RegistrationDate")}:{" "}
          {item.date ? formatDate(new Date(item.date)) : "N/A"}
        </p>

        <div className="d-flex justify-content-center mt-3 flex-wrap gap-2">
          <button
            title={t("ViewDetails")}
            className="btn btn-secondary btn-sm"
            onClick={() => handleViewTestNames(item)}
          >
            <FaRegEye />
          </button>

          <button
            title={t("ViewReport")}
            className="btn btn-info btn-sm"
            onClick={() => handleViewTestReport(item)}
            disabled={loading}
          >
            <FaRegEye />
          </button>

          <button
            title={t("DownloadReport")}
            className="btn btn-success btn-sm"
            onClick={() => handleGenerateBill(item)}
            disabled={loading}
          >
            <FaDownload />
          </button>

          <button
            title={t("EditBooking")}
            className="btn btn-secondary btn-sm"
            onClick={() => handleEdit(item)}
          >
            <FaPencilAlt />
          </button>

          {!["ROLE_RECEPTIONIST", "ROLE_DOCTOR"].includes(roleCurrentUser) && (
            <>
              {(item.type === "pathology" || item.type === "diagnostics") && (
                <UploadDiagnosticImages
                  testBookingID={item.id}
                  SelectedTest={item.selectedTests}
                />
              )}
              <button
                title={t("diagnsticPatientListTable.AddResult")}
                className="btn btn-secondary btn-sm"
                onClick={() => handleAddResult(item)}
              >
                <FaPlusSquare />
              </button>
            </>
          )}

          {roleCurrentUser !== "ROLE_RECEPTIONIST" && (
            <button
              title={t("diagnsticPatientListTable.DownloadReport")}
              className="btn btn-secondary btn-sm"
              onClick={() => handleGenerateReportNew(item)}
            >
              <FaDownload />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Desktop table component
  const DesktopItemTable = () => (
    <>
      <Table striped bordered hover responsive className="small">
        <thead>
          <tr>
            <th>SrNo</th>
            {/* <th>Type</th> */}
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Referral Type</th>
            <th>Patient Phone</th>
            <th>Remarks</th>
            <th>{t("Status")}</th>
            <th>{t("Payment Status")}</th>
            <th>{t("Paid")}</th>
            <th>{t("Total Fees")}</th>
            <th>{t("Registration Date")}</th>
            <th>{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((item, index) => (
                <tr key={`${item.type}-${item.id}`}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  {/* <td>
                    {item.type === "pathology" ? "Pathology" : 
                     item.type === "diagnostics" ? "Diagnostics" : "Appointment"}
                  </td> */}
                  <td>{item.patientName || "N/A"}</td>
                  <td>
                    {item.doctorName && item.doctorName !== "NA NA NA"
                      ? `Dr. ${item.doctorName}`
                      : "NA"}
                  </td>
                  <td>{item.referralType || "N/A"}</td>
                  <td>{item.phone || "N/A"}</td>
                  <td>{item.remarks || "N/A"}</td>
                  <td>{item.status || "N/A"}</td>
                  <td>{item.paymentStatus || "N/A"}</td>
                  <td>
                    {item.amount
                      ? `${convertCurrency(
                          item.amount,
                          item.currency || "INR",
                          selectedGlobalCurrency
                        )} ${selectedGlobalCurrency}`
                      : "NA"}
                  </td>
                  <td>
                    {item.totalFees || item.amount
                      ? `${convertCurrency(
                          item.totalFees || item.amount,
                          item.currency || "INR",
                          selectedGlobalCurrency
                        )} ${selectedGlobalCurrency}`
                      : "NA"}
                  </td>
                  <td>{item.date ? formatDate(new Date(item.date)) : "N/A"}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        title={t("ViewReport")}
                        className="btn  btn-sm border border-dark"
                        onClick={() => handleViewTestReport(item)}
                        disabled={loading}
                      >
                        <FaRegEye />
                      </button>
                      <button
                        title={t("DownloadReport")}
                        className="btn  btn-sm border border-dark"
                        onClick={() => handleGenerateBill(item)}
                        disabled={loading}
                      >
                        <FaDownload />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="14" className="text-center py-4">
                {t("NoRecordsFound")}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Prev
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            />
            {renderPaginationItems()}
            <Pagination.Next
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </>
  );

  return (
    <div className="container-fluid py-3" style={{ padding: "3rem" }}>
      <header className="text-center mb-4">
        <h2 className="h5">{t("Patient List")}</h2>
      </header>

      {/* Search and Filter Section */}
      <div className="row mb-3 g-3">
        <div className="col-md-4">
          <label className="form-label fw-bold small">
            {t("Search by Patient Name or Phone")}
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={t("Search patient by Name or Phone")}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when search changes
              }}
            />
          </label>
        </div>
        <div className="col-md-4">
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <div className="text-muted small">
            Showing {currentItems.length} of {filteredData.length} records
          </div>
        </div>
      </div>

      {/* Data List */}
      {isMobile ? (
        <div>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <MobileItemCard
                key={`${item.type}-${item.id}`}
                item={item}
                index={index}
              />
            ))
          ) : (
            <div className="text-center py-4">
              <p>{t("No Records Found")}</p>
            </div>
          )}

          {/* Pagination for mobile */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination size="sm">
                <Pagination.Prev
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                />
                <Pagination.Item active>{currentPage}</Pagination.Item>
                <Pagination.Next
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </div>
      ) : (
        <DesktopItemTable />
      )}

      {/* Test Report Modal */}
      <TestReportModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        report={selectedReport}
      />
      
    </div>
  );
}

export default AllPatientList;
