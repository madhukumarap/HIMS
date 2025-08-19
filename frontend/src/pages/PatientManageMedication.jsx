import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";

const ViewMedicationReport = () => {
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [filteredMedicationDays, setFilteredMedicationDays] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [medicineFilter, setMedicineFilter] = useState("");
  const [showAllDates, setShowAllDates] = useState({});
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

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
    return <h2>Access denied!</h2>;
  }

  if (
    currentUser &&
    (!currentUser.roles.includes("ROLE_PATIENT") ||
      !currentUser.roles.includes("ROLE_DOCTOR") ||
      !currentUser.roles.includes("ROLE_PHARMACIST"))
  ) {
    if (
      prescriptionData &&
      currentUser.phoneNumber !== prescriptionData.phoneNumberP
    ) {
      return <h2>Access denied!</h2>;
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
        Medication Administration Records
      </h5>
      {/* Rest of the code */}
      {prescriptionData ? (
        <>
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 style={h2Style} className="card-title">
                    Patient Details
                  </h5>
                  <p className="card-text">
                    Prescription ID: {prescriptionData.prescriptionId}
                    <br />
                    Patient Name: {prescriptionData.PatientName}
                    <br />
                    Patient PhoneNo: {prescriptionData.phoneNumberP}
                    <br />
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 style={h2Style} className="card-title">
                    Doctor Details
                  </h5>
                  <p className="card-text">
                    Prescribed Doctor: {prescriptionData.PrescribedDoctor}
                    <br />
                    Registration No: {prescriptionData.RegistrationNo}
                    <br />
                    Doctor PhoneNo: {prescriptionData.PhoneNo}
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
                    Clinical Diagnosis:
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
        <p>Loading prescription data...</p>
      )}
      <div className="row">
        <div className="col-md-3 mb-3">
          <label htmlFor="medicineFilter">Medicine Name:</label>
          <input
            type="text"
            style={{ fontSize: "12px" }}
            id="medicineFilter"
            className="form-control"
            value={medicineFilter}
            placeholder="Search By Medicine Name"
            onChange={(e) => setMedicineFilter(e.target.value)}
          />
        </div>{" "}
        <div className="col-md-2"></div>
        <div className="col-md-3"></div>
        <div className="col-md-2">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            style={{ fontSize: "12px" }}
            id="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-2 mb-3">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            style={{ fontSize: "12px" }}
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
                    <th style={{ textAlign: "center" }}>Sr.No</th>
                    <th style={{ textAlign: "center" }}>Medicine Name</th>
                    <th style={{ textAlign: "center" }}>Dosage Amount</th>
                    <th style={{ textAlign: "center" }}>Medication Advice</th>
                    <th style={{ textAlign: "center" }}>Date</th>
                    <th style={{ textAlign: "center" }}>Morning Time</th>
                    <th style={{ textAlign: "center" }}>Afternoon Time</th>
                    <th style={{ textAlign: "center" }}>Evening Time</th>
                    <th style={{ textAlign: "center" }}>Night Time</th>
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
                                >
                                  Download as PDF
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
        <p>Loading medication days...</p>
      )}
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

export default ViewMedicationReport;
