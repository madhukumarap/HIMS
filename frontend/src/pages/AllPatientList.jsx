import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Pagination } from "react-bootstrap";
import axios from "axios";
import Datepickrange from "./DateRangeCalender";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    "ROLE_RECEPTIONIST"
  ];
  
  if (!allowedRoles.includes(roleCurrentUser)) return "Access Denied";

  // Date formatting
  const locales = { enIN, fr };
  
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const locale = locales[selectedLanguage];
    return formatDate(date, "PPPP", { locale });
  };

  // Initialize i18n
  useEffect(() => {
    const initializei18n = () => {
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
    };

    initializei18n();
    const intervalId = setInterval(initializei18n, 500);
    return () => clearInterval(intervalId);
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

  const fetchAllData = async () => {
    try {
      await Promise.all([fetchBookings(), fetchAppointments(), fetchDiagnosticsBookings()]);
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

  // Combine and format data from all APIs
  useEffect(() => {
    const combined = [
      ...bookings.map(booking => ({
        id: booking.id,
        type: "pathology",
        patientName: booking.PatientName,
        phone: booking.PatientPhoneNo,
        doctorName: booking.DoctorName,
        status: booking.status,
        paymentStatus: booking.PaymentStatus,
        amount: booking.PaidAmount,
        totalFees: booking.TotalFees,
        currency: booking.Currency,
        date: booking.createdAt,
        referralType: booking.commissionValue,
        remarks: booking.remarks,
        selectedTests: booking.selectedTests
      })),
      ...appointments.map(appointment => ({
        id: appointment.id,
        type: "appointment",
        patientName: appointment.PatientName,
        phone: appointment.PatientPhone,
        doctorName: appointment.DoctorName,
        status: appointment.paymentStatus === "paid" ? "Completed" : "Pending",
        paymentStatus: appointment.paymentStatus,
        amount: appointment.amount,
        totalFees: appointment.amount,
        currency: appointment.Currency || "INR",
        date: appointment.createdAt,
        referralType: appointment.visitType,
        remarks: appointment.reason,
        selectedTests: ""
      })),
      ...diagnosticsBookings.map(booking => ({
        id: booking.id,
        type: "diagnostics",
        patientName: booking.PatientName,
        phone: booking.PatientPhoneNo,
        doctorName: booking.DoctorName,
        status: booking.status,
        paymentStatus: booking.PaymentStatus,
        amount: booking.PaidAmount,
        totalFees: booking.TotalFees,
        currency: booking.Currency || "INR",
        date: booking.createdAt,
        referralType: booking.commissionValue,
        remarks: booking.remarks,
        selectedTests: booking.selectedTests
      }))
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
      item.patientName && item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone && item.phone.toString().includes(searchQuery);
    
    const itemDate = new Date(item.date);
    const isDateMatch =
      (!startDate || itemDate >= startDate) &&
      (!endDate || itemDate <= endDate);

    return isNameMatch && isDateMatch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate pagination items
  let paginationItems = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let number = startPage; number <= endPage; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => paginate(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  // Booking actions
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

  // Mobile card component
  const MobileItemCard = ({ item, index }) => (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">
          {t("PatientName")}: {item.patientName}
        </h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Type: {item.type === "booking" ? "Diagnostic Booking" : 
                item.type === "diagnostics" ? "Diagnostics Booking" : "Appointment"}
        </h6>
        <p className="card-text">Sr No: {(currentPage - 1) * itemsPerPage + index + 1}</p>
        <p className="card-text">
          {t("ReferralDoctor")}:{" "}
          {item.doctorName && item.doctorName !== "NA NA NA" ? `Dr. ${item.doctorName}` : "NA"}
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
          {t("TestFees")}: {convertCurrency(
            item.totalFees || item.amount || 0,
            item.currency || "INR",
            selectedGlobalCurrency
          )} {selectedGlobalCurrency}
        </p>
        <p className="card-text">
          {t("RegistrationDate")}: {item.date ? formatDateInSelectedLanguage(new Date(item.date)) : "N/A"}
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
            title={t("EditBooking")}
            className="btn btn-secondary btn-sm"
            onClick={() => handleEdit(item)}
          >
            <FaPencilAlt />
          </button>

          {!["ROLE_RECEPTIONIST", "ROLE_DOCTOR"].includes(roleCurrentUser) && (
            <>
              {(item.type === "booking" || item.type === "diagnostics") && (
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
            <th>{t("diagnsticPatientListTable.SrNo")}</th>
            <th>Type</th>
            <th>{t("diagnsticPatientListTable.PatientName")}</th>
            <th>{t("diagnsticPatientListTable.ReferralDoctor")}</th>
            <th>{t("diagnsticPatientListTable.ReferralType")}</th>
            <th>{t("diagnsticPatientListTable.PatientPhone")}</th>
            <th>{t("diagnsticPatientListTable.Remarks")}</th>
            <th>{t("Status")}</th>
            <th>{t("diagnsticPatientListTable.PaymentStatus")}</th>
            <th>{t("Paid")}</th>
            <th>{t("diagnsticPatientListTable.TotalFees")}</th>
            <th>{t("diagnsticPatientListTable.RegistrationDate")}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((item, index) => (
                <tr key={`${item.type}-${item.id}`}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    {item.type === "booking" ? "Diagnostic" : 
                     item.type === "diagnostics" ? "Diagnostics" : "Appointment"}
                  </td>
                  <td>{item.patientName || "N/A"}</td>
                  <td>
                    {item.doctorName && item.doctorName !== "NA NA NA" ? `Dr. ${item.doctorName}` : "NA"}
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
                  <td>{item.date ? formatDateInSelectedLanguage(new Date(item.date)) : "N/A"}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="12" className="text-center py-4">
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
            {paginationItems}
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
    <div className="container-fluid py-3">
      <header className="text-center mb-4">
        <h2 className="h5">{t("PatientList")}</h2>
      </header>

      {/* Search and Filter Section */}
      <div className="row mb-3 g-3">
        <div className="col-md-4">
          <label className="form-label fw-bold small">
            {t("SearchbyPatientNameorPhone")}
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={t("SearchpatientbyNameorPhone")}
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
              <MobileItemCard key={`${item.type}-${item.id}`} item={item} index={index} />
            ))
          ) : (
            <div className="text-center py-4">
              <p>{t("NoRecordsFound")}</p>
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
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))} 
                  disabled={currentPage === totalPages} 
                />
              </Pagination>
            </div>
          )}
        </div>
      ) : (
        <DesktopItemTable />
      )}
    </div>
  );
}

export default AllPatientList;