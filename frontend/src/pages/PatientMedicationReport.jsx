import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import Datepickrange from "./DateRangeCalender";

import Form from "react-bootstrap/Form";
import { Container, Col, Table, Card } from "react-bootstrap";

import Translation from "../translations/ViewMedicationReport.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const ViewMedicationReport = () => {
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const [prescriptionData, setPrescriptionData] = useState(null);
  const [filteredMedicationDays, setFilteredMedicationDays] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [medicineFilter, setMedicineFilter] = useState("");
  const [showAllDates, setShowAllDates] = useState({});

  const [isMobile, setIsMobile] = useState(false);
  // Function to check if the screen size is mobile
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 200);
  };

  ///

  const { t } = useTranslation();

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

  ///

  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };
  const { id } = useParams();
  useEffect(() => {
    const prescriptionId = 2;
    fetch(`${import.meta.env.VITE_API_URL}/api/getMedicationData/${id}`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPrescriptionData(data);
        setFilteredMedicationDays(data.medicationdays);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const style = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    fontSize: "12px",
  };

  const h1Style = {
    fontSize: "16px",
    background: "whitesmoke",
    padding: "4px",
  };

  const h2Style = {
    fontSize: "14px",
  };

  const h3Style = {
    fontSize: "16px",
  };

  if (!currentUser) {
    return <h8>Access denied! </h8>;
  }

  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_PATIENT") &&
    !currentUser.roles.includes("ROLE_ PHARMACIST") &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_NURSE")
  ) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return "Access denied!";
    // You can handle the redirection or error message display as per your requirement
  }

  let goBackLink;
  if (prescriptionData) {
    if (currentUser.roles.includes("ROLE_ADMIN")) {
      goBackLink = `/adminReport`;
    } else if (currentUser.roles.includes("ROLE_DOCTOR")) {
      goBackLink = `/OnePatientPrescription/${prescriptionData.patient_Id}`;
    } else if (currentUser.roles.includes("ROLE_NURSE")) {
      goBackLink = `/NurseOnePatientPrescription/${prescriptionData.patient_Id}`;
    }
  }

  const convertToIndianTime = (time) => {
    const [hours, minutes] = time.split(":");
    let hoursNum = parseInt(hours, 10);
    const period = hoursNum >= 12 ? "PM" : "AM";
    hoursNum = hoursNum % 12 || 12;
    return `${hoursNum}:${minutes} ${period}`;
  };

  const groupMedicationDaysByMedicineName = () => {
    const groupedData = [];
    const medicineNames = [];

    filteredMedicationDays.forEach((day) => {
      if (!medicineNames.includes(day.medicineName)) {
        medicineNames.push(day.medicineName);
        groupedData.push({
          medicineName: day.medicineName,
          dosageAmount: day.dosageAmount,
          food: day.food,
          dates: [day.date],
          times: {
            morning: [day.morningTime],
            afternoon: [day.afternoonTime],
            evening: [day.eveningTime],
            night: [day.nightTime],
          },
        });
      } else {
        const index = medicineNames.indexOf(day.medicineName);

        groupedData[index].dates.push(day.date);
        groupedData[index].times.morning.push(day.morningTime);
        groupedData[index].times.afternoon.push(day.afternoonTime);
        groupedData[index].times.evening.push(day.eveningTime);
        groupedData[index].times.night.push(day.nightTime);
      }
    });

    // Filter and limit grouped data by date range and medicine name for each row
    const filteredData = groupedData.map((group) => {
      const filteredDates = group.dates.filter((date, index) => {
        const currentDate = new Date(date);
        const startDateObj = startDate !== "" ? new Date(startDate) : null;
        const endDateObj = endDate !== "" ? new Date(endDate) : null;

        return (
          (startDateObj === null || currentDate >= startDateObj) &&
          (endDateObj === null || currentDate <= endDateObj)
        );
      });

      return {
        ...group,
        dates: filteredDates,
        times: {
          morning: group.times.morning.slice(0, filteredDates.length),
          afternoon: group.times.afternoon.slice(0, filteredDates.length),
          evening: group.times.evening.slice(0, filteredDates.length),
          night: group.times.night.slice(0, filteredDates.length),
        },
      };
    });

    // Filter by medicine name
    const filteredByMedicineName = filteredData.filter((group) =>
      group.medicineName.toLowerCase().includes(medicineFilter.toLowerCase())
    );

    // Sort dates in ascending order
    filteredByMedicineName.forEach((group) => {
      group.dates.sort((a, b) => new Date(a) - new Date(b));
    });

    return filteredByMedicineName;
  };

  // Rest of your code

  const handleShowAllDates = (medicineName) => {
    setShowAllDates((prevState) => ({
      ...prevState,
      [medicineName]: !prevState[medicineName],
    }));
  };

  const tdStyle = {
    backgroundColor: "lightblue",
  };

  const handleDownloadPDF = async (
    medicineName,
    dosageAmount,
    medicationAdvice,
    dates,
    morningTimes,
    afternoonTimes,
    eveningTimes,
    nightTimes,
    prescriptionData
  ) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(
      "Medication Administration Records",
      doc.internal.pageSize.getWidth() / 2,
      10,
      { align: "center" }
    );

    const prescriptionTableData = [
      ["Prescription ID", prescriptionData.prescriptionId],
      ["Patient Name", prescriptionData.PatientName],
      ["Patient PhoneNo", prescriptionData.phoneNumberP],
      ["Clinical Diagnosis", prescriptionData.clinicalDiagnosis],
      ["Doctor Name", prescriptionData.PrescribedDoctor],
      ["Registration No", prescriptionData.RegistrationNo],
      ["Doctor PhoneNo", prescriptionData.PhoneNo],
    ];

    doc.autoTable({
      startY: 25,
      head: [["Prescription Data", ""]],
      body: prescriptionTableData,
      theme: "grid",
      styles: {
        fontSize: 12,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    // Add medicine details table
    const medicineTableData = [
      ["Medicine Name", medicineName],
      ["Dosage Amount", dosageAmount],
      ["Medication Advice", medicationAdvice],
    ];

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 10,
      head: [["Medicine Details", ""]],
      body: medicineTableData,
      theme: "grid",
      styles: {
        fontSize: 12,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    // Add medication details table
    const medicationTableData = [];
    for (let i = 0; i < dates.length; i++) {
      const morningTime =
        morningTimes[i] === "00:00:00"
          ? "[X]"
          : convertTo12HourFormat(morningTimes[i]);
      const afternoonTime =
        afternoonTimes[i] === "00:00:00"
          ? "[X]"
          : convertTo12HourFormat(afternoonTimes[i]);
      const eveningTime =
        eveningTimes[i] === "00:00:00"
          ? "[X]"
          : convertTo12HourFormat(eveningTimes[i]);
      const nightTime =
        nightTimes[i] === "00:00:00"
          ? "[X]"
          : convertTo12HourFormat(nightTimes[i]);

      const rowData = [
        dates[i],
        morningTime,
        afternoonTime,
        eveningTime,
        nightTime,
      ];
      medicationTableData.push(rowData);
    }

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 10,
      head: [["Date", "Morning", "Afternoon", "Evening", "Night"]],
      body: medicationTableData,
      theme: "grid",
      styles: {
        fontSize: 12,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    doc.save(`${medicineName}_data.pdf`);

    function convertTo12HourFormat(time) {
      const [hours, minutes, seconds] = time.split(":");
      let period = "AM";
      let hours12 = parseInt(hours);

      if (hours12 >= 12) {
        period = "PM";
        if (hours12 > 12) {
          hours12 -= 12;
        }
      }

      const time12HourFormat = `${hours12}:${minutes} ${period}`;
      return time12HourFormat;
    }
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  return (
    <div style={style} className="container">
      <h5 style={h1Style} className="text-center mt-4 mb-3">
        {t("medicationAdministrationRecords")}
      </h5>
      {/* Rest of the code */}
      {prescriptionData ? (
        <>
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 style={h2Style} className="card-title">
                    {t("patientDetails")}
                  </h5>
                  <p className="card-text">
                    {t("prescriptionID")}: {prescriptionData.prescriptionId}
                    <br />
                    {t("patientName")}: {prescriptionData.PatientName}
                    <br />
                    {t("patientPhoneNo")}: {prescriptionData.phoneNumberP}
                    <br />
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 style={h2Style} className="card-title">
                    {t("doctorDetails")}
                  </h5>
                  <p className="card-text">
                    {t("prescribedDoctor")}: {prescriptionData.PrescribedDoctor}
                    <br />
                    {t("registrationNo")}: {prescriptionData.RegistrationNo}
                    <br />
                    {t("doctorPhoneNo")}: {prescriptionData.PhoneNo}
                    <br />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 style={h2Style} className="card-title">
                    {" "}
                    {t("clinicalDiagnosis")}:
                  </h5>
                  <p className="card-text">
                    {prescriptionData.clinicalDiagnosis}
                    <br />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <br></br>
        </>
      ) : (
        <p>{t("loadingPrescriptionData")}...</p>
      )}
      <div className="row">
        <div className="col-md-3 mb-3">
          <label
            style={{ fontWeight: "bold", marginBottom: "8px" }}
            htmlFor="medicineFilter"
          >
            {t("medicineName")}:
          </label>
          <input
            type="text"
            style={{ fontSize: "12px" }}
            id="medicineFilter"
            className="form-control"
            value={medicineFilter}
            placeholder={t("searchByMedicineName")}
            onChange={(e) => setMedicineFilter(e.target.value)}
          />
        </div>{" "}
        <div className="col-md-1"></div>
        <div className="col-md-2">
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>
      </div>
      {filteredMedicationDays ? (
        <div>
          {/* ... */}
          <div className="table-responsive">
            <div id="table-container">
              <table className="table table-striped">
                <thead>
                  <tr style={{ border: "2px solid #ccc" }}>
                    <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                      {t("medicationAdministrationRecordsTable.srNo")}
                    </th>
                    <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                      {t("medicationAdministrationRecordsTable.medicineName")}
                    </th>
                    <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                      {t("medicationAdministrationRecordsTable.dosageAmount")}
                    </th>
                    <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                      {t(
                        "medicationAdministrationRecordsTable.medicationAdvice"
                      )}
                    </th>
                    <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                      {t("Date")}
                    </th>
                    <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                      {t("medicationAdministrationRecordsTable.morningTime")}
                    </th>
                    <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                      {t("medicationAdministrationRecordsTable.afternoonTime")}
                    </th>
                    <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                      {t("medicationAdministrationRecordsTable.eveningTime")}
                    </th>
                    <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                      {t("medicationAdministrationRecordsTable.nightTime")}
                    </th>
                  </tr>
                </thead>
                <tbody style={{ border: "2px solid #ccc" }}>
                  {groupMedicationDaysByMedicineName().map((group, index) => {
                    const limitedDates = showAllDates[group.medicineName]
                      ? group.dates
                      : group.dates.slice(-7); // Show last 7 days' dates

                    return (
                      <React.Fragment key={group.medicineName}>
                        {limitedDates.map((date, dateIndex) => (
                          <tr
                            key={date}
                            style={{
                              backgroundColor:
                                (dateIndex % 2 === 0 && index % 2 === 0) ||
                                (dateIndex % 2 === 1 && index % 2 === 1)
                                  ? "#F9F9F9"
                                  : "white",
                            }}
                          >
                            {dateIndex === 0 ? (
                              <React.Fragment>
                                <td
                                  rowSpan={limitedDates.length}
                                  style={{
                                    backgroundColor:
                                      index % 2 === 0 ? "transparent" : "white",
                                    verticalAlign: "middle",
                                    textAlign: "center",
                                  }}
                                >
                                  {index + 1}
                                </td>
                                <td
                                  rowSpan={limitedDates.length}
                                  style={{
                                    backgroundColor:
                                      index % 2 === 0 ? "transparent" : "white",
                                    verticalAlign: "middle",
                                    textAlign: "center",
                                  }}
                                >
                                  {group.medicineName}
                                </td>
                                <td
                                  rowSpan={limitedDates.length}
                                  style={{
                                    backgroundColor:
                                      index % 2 === 0 ? "transparent" : "white",
                                    verticalAlign: "middle",
                                    textAlign: "center",
                                  }}
                                >
                                  {group.dosageAmount}
                                </td>
                                <td
                                  rowSpan={limitedDates.length}
                                  style={{
                                    backgroundColor:
                                      index % 2 === 0 ? "transparent" : "white",
                                    verticalAlign: "middle",
                                    textAlign: "center",
                                  }}
                                >
                                  {group.food}
                                </td>
                              </React.Fragment>
                            ) : null}
                            <td style={{ textAlign: "center" }}>{date}</td>
                            <td style={{ textAlign: "center" }}>
                              {convertToIndianTime(
                                group.times.morning[dateIndex]
                              ) !== "12:00 AM"
                                ? convertToIndianTime(
                                    group.times.morning[dateIndex]
                                  )
                                : "[X]"}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {convertToIndianTime(
                                group.times.afternoon[dateIndex]
                              ) !== "12:00 AM"
                                ? convertToIndianTime(
                                    group.times.afternoon[dateIndex]
                                  )
                                : "[X]"}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {convertToIndianTime(
                                group.times.evening[dateIndex]
                              ) !== "12:00 AM"
                                ? convertToIndianTime(
                                    group.times.evening[dateIndex]
                                  )
                                : "[X]"}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {convertToIndianTime(
                                group.times.night[dateIndex]
                              ) !== "12:00 AM"
                                ? convertToIndianTime(
                                    group.times.night[dateIndex]
                                  )
                                : "[X]"}
                            </td>
                          </tr>
                        ))}
                        {group.dates.length > 10 && (
                          <tr>
                            <td colSpan="9">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                {/* <button
                                                                className="btn btn-link"
                                                                onClick={() => handleShowAllDates(group.medicineName)}
                                                            >
                                                                Show All Dates
                                                            </button> */}
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() =>
                                    handleDownloadPDF(
                                      group.medicineName,
                                      group.dosageAmount,
                                      group.food,
                                      group.dates,
                                      group.times.morning,
                                      group.times.afternoon,
                                      group.times.evening,
                                      group.times.night,
                                      prescriptionData
                                    )
                                  }
                                  style={{ fontSize: "12px" }}
                                >
                                  {t(
                                    "medicationAdministrationRecordsTable.downloadAsPDF"
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p>{t("loadingMedicationDays")}...</p>
      )}
      <br></br>
      <br></br>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
        }}
      >
        <Link
          to={`/${extractedPart}/viewPatientPrescription/${currentUser.phoneNumber}`}
        >
          <button
            style={{ fontSize: "12px", padding: "4px 5px" }}
            className="btn btn-primary btn-sm"
          >
            {t("GoBack")}
          </button>
        </Link>
      </div>
      <br></br>
      <br></br>
    </div>
  );
};

export default ViewMedicationReport;
