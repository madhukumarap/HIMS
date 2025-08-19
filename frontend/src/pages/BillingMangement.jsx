import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import DownloadPDFButton from "./DiagnosticsComponent/DownloadResultDiagnosticReport";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import { FaDownload } from "react-icons/fa";
import DownloadPDFButtonPathology from "./PathologyAllTest/PathologyTestReportAllTest";
import { format as formatDate, isDate } from "date-fns";
import i18n from "i18next";
import { fr, enIN } from "date-fns/locale";
import Datepickrange from "../pages/DateRangeCalender";
import Select from "react-select";

import Translation from "../translations/BillingManagement.json";
import { useTranslation } from "react-i18next";
import { initReactI18next } from "react-i18next";
import AuthService from "../services/auth.service";
import { CurrencyContext } from "../context/CurrencyProvider";

const BillingMangement = () => {
  const currentUser = AuthService.getCurrentUser();

  const [patientData, setPatientData] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [DiagnosticID, setDiagnosticID] = useState(null);
  const [PathologyID, setPathologyID] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(undefined);
  // const [finalData, setFinalData] = useState([])
  const [patient, setPatient] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };
  const locales = { enIN, fr };

  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  useEffect(() => {
    getHospitalAdmissionList();
    fetchDataFromPathology();
  }, []);

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

  const fetchDataFromPathology = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getHospitalBillingData`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPatientData(response.data);
      })
      .catch((error) => {
        console.log("error 25 : ", error);
      });
  };

  const getHospitalAdmissionList = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getHospitalAdmissionList`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response2) => {
        setAdmissions(response2.data.data);
        //  console.log("admissions", admissions?.length);
        // console.log("admissions", admissions.length);
      })
      .catch((error) => {
        console.log("error 21 : ", error);
      });
  };

  let data = patientData.map((patient) => {
    for (let i = 0; i < admissions.length; i++) {
      if (
        patient.PatientID == admissions[i].PatientID ||
        patient.PatientID == admissions[i].PatientId
      ) {
        return {
          ...patient,
          AdmissionDate: admissions[i].AdmissionDate,
          DischargeDate: admissions[i].DischargeDate,
        };
      }
    }
  });

  let filteredData = data?.filter((obj, index, self) => {
    if (obj && obj["admissionID"]) {
      return (
        index === self.findIndex((o) => o["admissionID"] === obj["admissionID"])
      );
    }
    return false;
  });

  console.log("filteredData :", filteredData);

  const handleGenerateReportNew = (DiagnosticID) => {
    if (DiagnosticID.status !== "Completed") {
      toast.error(t("resultNotFound"));
      return;
    }
    setDiagnosticID(DiagnosticID.id);
  };

  const handleGenerateReportNewPathology = (PathologyID) => {
    if (PathologyID?.PaymentStatus === "Not-Paid") {
      toast.error(t("PaymentNotPaidforthisPatient"));
      return;
    }
    if (PathologyID.status !== "Completed") {
      toast.error(t("resultNotFound"));
      return;
    }
    setPathologyID(PathologyID.id);
  };

  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  const generatebill = async (rowData) => {
    console.log(rowData);
    //alert(rowData.PaymentStatus);
    if (rowData.PaymentStatus !== "Paid") {
      toast.error(t("paymentNotPaid"));
      return;
    }
    const hospitalResponse = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
      {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      }
    );

    const hospitalData = hospitalResponse.data.data; // Assuming the hospital data is in the 'data' property

    const pdf = new jsPDF();
    pdf.setFontSize(12);

    // Add Hospital Name and Address
    // Add Hospital Name and Logo
    const hospitalName = hospitalData.hospitalName;
    const hospitalLogoBase64 = hospitalData.logo; // Assuming the logo is provided as a base64 string
    const hospitalAddressLine1 = hospitalData.address;
    const hospitalAddressLine2 = `${hospitalData.pincode}, India`;
    const email = `${t("Mail")}: ${hospitalData.email}`;
    const landline = `${t("Tel")}: ${hospitalData.landline}`;
    // Create a new Image object for the hospital logo
    const hospitalLogo = new Image();
    hospitalLogo.src = `data:image/png;base64,${hospitalLogoBase64}`; // Embed the base64 image data

    hospitalLogo.onload = function () {
      // Add the hospital logo as an image to the PDF
      pdf.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);

      pdf.text(hospitalName, 20, 20);
      pdf.text(hospitalAddressLine1, 20, 30);
      pdf.text(hospitalAddressLine2, 20, 35);
      pdf.text(landline, 20, 40);
      pdf.text(email, 20, 45);
      pdf.setFillColor("#48bcdf");
      const titleText = t("Receipt.TestBookingReceipt");
      const titleHeight = 10;
      pdf.rect(0, 53, pdf.internal.pageSize.getWidth(), titleHeight, "F");
      pdf.setTextColor("#ffffff"); // Set text color to white
      pdf.setFontSize(16); // Adjust font size as needed
      pdf.text(
        titleText,
        pdf.internal.pageSize.getWidth() / 2,
        55 + titleHeight / 2,
        {
          align: "center",
        }
      );

      pdf.setTextColor("#000000"); // Set text color to black

      const patientInfo = `${t("Receipt.patientName")} : ${
        rowData?.PatientName
      }`;
      const patientPhone = `${t("Receipt.patientPhone")} : ${
        rowData?.PatientPhoneNo
      }`;
      const createdAT = `${t(
        "Receipt.bookingDate"
      )} : ${formatDateInSelectedLanguage(new Date(rowData?.createdAt))}`;
      const doctorInfo = `${t("Receipt.doctorName")} : Dr ${
        rowData?.DoctorName
      }`;

      const doctorPhone = `${t("Receipt.doctorPhone")} : ${
        rowData?.DoctorPhone
      }`;

      const paymentStatus = ` ${t(
        "Receipt.paymentStatus"
      )} : ${rowData?.PaymentStatus?.toUpperCase()}`;
      const paymentDateTime = rowData?.PaymentDate
        ? `${t("Receipt.paymentDate")}:  ${formatDateInSelectedLanguage(
            new Date(rowData?.PaymentDate)
          )}`
        : `${t("Receipt.paymentDate")} : ${t("MMDDYYYY")}`;
      const amount = `${t("Receipt.amount")} : ${rowData?.PaidAmount} ${
        rowData?.Currency
      }`;
      const selectedTest = ` ${t("Receipt.selectedTest")} : ${
        rowData?.selectedTests
      }`;
      pdf.setFontSize(12);

      // Define the coordinates for the first column (patient details)
      const col1X = 20;
      const col1Y = 80;
      const col1Spacing = 10;

      // Define the coordinates for the second column (doctor details)
      const col2X = 130; // Adjust this value to create space between columns
      const col2Y = 80;

      pdf.text(t("Receipt.patientDetails"), col1X, col1Y);
      pdf.text(patientInfo, col1X, col1Y + col1Spacing);
      pdf.text(patientPhone, col1X, col1Y + 2 * col1Spacing);
      pdf.text(createdAT, col1X, col1Y + 3 * col1Spacing);

      pdf.text(t("Receipt.doctorDetails"), col2X, col2Y);
      pdf.text(doctorInfo, col2X, col2Y + col1Spacing);
      pdf.text(doctorPhone, col2X, col2Y + 2 * col1Spacing);
      pdf.line(0, 120, 210, 120);

      pdf.text(selectedTest, 20, 140);
      pdf.text(paymentStatus, 20, 150);
      pdf.text(paymentDateTime, 20, 160);
      pdf.text(amount, 20, 170);

      pdf.setFillColor("#48bcdf");
      pdf.rect(0, 270, pdf.internal.pageSize.getWidth(), 10, "F");
      pdf.setTextColor("#ffffff");
      //pdf.setTextColor("#000000");
      pdf.setFontSize(12);

      pdf.text(
        t("Reciept.poweredByMediAI"),
        pdf.internal.pageSize.getWidth() / 2 - 17,
        277
      );
      // Save the bill as a PDF file
      pdf.save("Receipt.pdf");
    };
  };

  const generateBillDrVisit = async (rowData) => {
    console.log("rowData=", rowData);
    const hospitalResponse = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/getLastCreatedHospital`,
      {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      }
    );

    console.log("hospitalResponse=", hospitalResponse);
    const hospitalData = hospitalResponse.data.data; // Assuming the hospital data is in the 'data' property

    const pdf = new jsPDF();
    pdf.setFontSize(12);

    // Add Hospital Name and Address
    // Add Hospital Name and Logo
    const hospitalName = hospitalData.hospitalName;
    const hospitalLogoBase64 = hospitalData.logo; // Assuming the logo is provided as a base64 string
    const hospitalAddressLine1 = hospitalData.address;
    const hospitalAddressLine2 = `${hospitalData.pincode}, India`;
    const email = `${t("Mail")}: ${hospitalData.email}`;
    const landline = `${t("Tel")}: ${hospitalData.landline}`;
    // Create a new Image object for the hospital logo
    const hospitalLogo = new Image();
    hospitalLogo.src = `data:image/png;base64,${hospitalLogoBase64}`; // Embed the base64 image data

    // Wait for the hospital logo to load before rendering the PDF
    hospitalLogo.onload = function () {
      // Add the hospital logo as an image to the PDF
      pdf.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);

      pdf.text(hospitalName, 20, 20);
      pdf.text(hospitalAddressLine1, 20, 30);
      pdf.text(hospitalAddressLine2, 20, 35);
      pdf.text(landline, 20, 40);
      pdf.text(email, 20, 45);
      pdf.setFillColor("#48bcdf");
      const titleText = t("Receipt.ConsultantBookingReceipt"); // Use the translation key
      const titleHeight = 10;
      pdf.rect(0, 53, pdf.internal.pageSize.getWidth(), titleHeight, "F");
      pdf.setTextColor("#ffffff"); // Set text color to white
      pdf.setFontSize(16); // Adjust font size as needed
      pdf.text(
        titleText,
        pdf.internal.pageSize.getWidth() / 2,
        55 + titleHeight / 2,
        {
          align: "center",
        }
      );

      pdf.setTextColor("#000000"); // Set text color to black

      const patientInfo = `${t("Receipt.patientDetails")} : ${
        rowData.PatientName
      }`;
      const patientPhone = `${t("Receipt.patientPhone")} : ${
        rowData.PatientPhone
      }`;
      const createdAT = `${t(
        "Receipt.bookingDate"
      )} : ${formatDateInSelectedLanguage(new Date(rowData.createdAt))}`;
      const doctorInfo = `${t("Receipt.doctorDetails")} : ${t("Receipt.dr")} ${
        rowData.DoctorName
      }`;
      const doctorPhone = `${t("Receipt.doctorPhone")} : ${
        rowData.DoctorPhone
      }`;
      const bookingStartEnd = `${t(
        "Receipt.ConsultantBookingReceipt"
      )} : ${formatDateInSelectedLanguage(
        new Date(rowData.bookingStartDate)
      )} ${new Date(rowData.bookingStartDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${new Date(rowData.bookingEndDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
      const paymentStatus = `${t(
        "Receipt.paymentStatus"
      )} : ${rowData.paymentStatus.toUpperCase()}`;
      const paymentDateTime = rowData?.paymentDateTime
        ? `${t("Receipt.paymentDate")} : ${formatDateInSelectedLanguage(
            new Date(rowData.paymentDateTime)
          )}`
        : `${t("Receipt.paymentDate")} : ${t("Receipt.MMDDYYYY")}`;
      const amount = `${t("Receipt.amount")}: ${rowData?.amount} ${
        rowData?.Currency
      }`;

      pdf.setFontSize(12);
      // Define the coordinates for the first column (patient details)
      const col1X = 20;
      const col1Y = 80;
      const col1Spacing = 10;

      // Define the coordinates for the second column (doctor details)
      const col2X = 130; // Adjust this value to create space between columns
      const col2Y = 80;

      pdf.text(t("Receipt.patientDetails"), col1X, col1Y);
      pdf.text(patientInfo, col1X, col1Y + col1Spacing);
      pdf.text(patientPhone, col1X, col1Y + 2 * col1Spacing);
      pdf.text(createdAT, col1X, col1Y + 3 * col1Spacing);

      pdf.text(t("Receipt.doctorDetails"), col2X, col2Y);
      pdf.text(doctorInfo, col2X, col2Y + col1Spacing);
      pdf.text(doctorPhone, col2X, col2Y + 2 * col1Spacing);
      pdf.line(0, 120, 210, 120);

      pdf.text(bookingStartEnd, 20, 140);
      pdf.text(paymentStatus, 20, 150);
      pdf.text(paymentDateTime, 20, 160);
      pdf.text(amount, 20, 170);

      pdf.setFillColor("#48bcdf");
      pdf.rect(0, 270, pdf.internal.pageSize.getWidth(), 10, "F");
      pdf.setTextColor("#ffffff");
      //pdf.setTextColor("#000000");
      pdf.setFontSize(12);

      pdf.text(
        t("PoweredByMediAI"),
        pdf.internal.pageSize.getWidth() / 2 - 17,
        277
      );
      // Save the bill as a PDF file
      pdf.save("Receipt.pdf");
    };
  };

  const [prescriptionData, setPrescriptionData] = useState(null);
  const handleFetchPrescriptionData = (admissionId) => {
    //alert(admissionId);
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/getOnePrescriptionForIn-patient/${admissionId}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        setPrescriptionData(response.data?.prescription);
        // Show the modal with prescription data here
        setPrescription(response.data?.prescription);
        setPatient(response.data?.patient);
        // setPrescriptionModalShow(true);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(`Error: ${error.response.data.message}`);
        } else {
          toast.error(t("AnErrorOccurredWhileFetchingPrescriptionData"));
        }
        console.error(`${t("ErrorFetchingPrescriptionData")} :`, error);
      });
  };

  const downloadAsPdf = async () => {
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
    const doc = new jsPDF();

    doc.setFontSize(12);
    // Add Hospital Name and Address
    // Add Hospital Name and Logo
    const hospitalName = hospitalData.hospitalName;
    const hospitalLogoBase64 = hospitalData.logo;
    const hospitalAddressLine1 = hospitalData.address;
    const hospitalAddressLine2 = `${hospitalData.pincode}, India`;
    const email = `${t("Mail")}: ${hospitalData.email}`;
    const landline = `${t("Tel")}: ${hospitalData.landline}`;
    // Create a new Image object for the hospital logo
    const hospitalLogo = new Image();
    hospitalLogo.src = `data:image/png;base64,${hospitalLogoBase64}`;
    // Wait for the hospital logo to load before rendering the PDF
    hospitalLogo.onload = function () {
      // Add the hospital logo as an image to the PDF
      doc.addImage(hospitalLogo, "PNG", 160, 15, 30, 30);

      doc.text(hospitalName, 20, 20);
      doc.text(hospitalAddressLine1, 20, 30);
      doc.text(hospitalAddressLine2, 20, 35);
      doc.text(landline, 20, 40);
      doc.text(email, 20, 45);
      doc.setFillColor("#48bcdf");
      const titleText = `Patient-Prescription`; // Update the title as needed
      const titleHeight = 10;
      doc.rect(0, 53, doc.internal.pageSize.getWidth(), titleHeight, "F");
      doc.setTextColor("#ffffff"); // Set text color to white
      doc.setFontSize(16); // Adjust font size as needed
      doc.text(
        titleText,
        doc.internal.pageSize.getWidth() / 2,
        55 + titleHeight / 2,
        {
          align: "center",
        }
      );

      const marginLeft = 10;
      const marginTop = 75;
      const columnSeparator = 105;
      const padding = 5;

      // Draw vertical lines
      doc.setLineWidth(0.1);
      doc.line(
        marginLeft - padding,
        marginTop - padding,
        marginLeft - padding,
        266
      );
      // Replace the existing doc.line for the right vertical line with this one
      doc.line(
        columnSeparator + columnSeparator - padding,
        marginTop - padding,
        columnSeparator + columnSeparator - padding,
        266
      );

      // Draw horizontal lines
      doc.line(
        marginLeft - padding,
        marginTop - padding,
        columnSeparator + columnSeparator - padding,
        marginTop - padding
      );
      doc.line(
        marginLeft - padding,
        266,
        columnSeparator + columnSeparator - padding,
        266
      );

      // const prescriptionTitle = "Patient-Prescription";
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(20);
      // doc.text(prescriptionTitle, 105, marginTop + 10, null, null, "center");

      const patientDetails = `
    ${t("PatientID")}: ${patient?.id}
    ${t("RegistrationDate")}: ${formatDateInSelectedLanguage(
        new Date(patient?.createdAt)
      )}
    ${t("PatientName")}: ${patient?.firstName} ${patient?.middleName} ${
        patient?.lastName
      }
    ${t("Age")}: ${patient?.age}
    ${t("Gender")}: ${patient?.gender}
    ${t("ContactNumber")}:  ${patient?.phoneNumberP}
`;

      const doctorDetails = `
    ${t("PrescriberName")}: ${prescription?.PrescribedDoctor}
    ${t("RegistrationNo")}: ${prescription?.RegistrationNo}
    ${t("ContactNumber")}:  ${prescription?.PhoneNo}
    ${t("PrescriptionID")}: ${prescription?.prescriptionId}
    ${t("PrescriptionDate")}: ${formatDateInSelectedLanguage(
        new Date(prescription?.createdAt)
      )}
`;

      doc.setFontSize(12); // Adjusted font size

      doc.text(patientDetails, marginLeft, marginTop + 5);

      doc.text(doctorDetails, columnSeparator + 10, marginTop + 5);

      doc.setLineWidth(0.1);
      doc.line(marginLeft, 125, 200, 125); // Adjusted horizontal line position

      const medicinesHeader = [
        t("Name"),
        t("DosageAmount"),
        t("TotalQuantity"),
        t("ClinicalAdvice"),
        t("StartDate"),
        t("DurationLifeTime"),
      ];

      const medicinesData = prescription?.medicines.map((medicine) => [
        medicine.medicineName,
        medicine.dosageAmount,
        medicine.quantity,
        medicine.food,
        formatDateInSelectedLanguage(new Date(medicine.startDate)),
        medicine.weekly,
      ]);

      doc.autoTable({
        head: [medicinesHeader],
        body: medicinesData,
        startY: 135, // Adjusted start position for the table
        theme: "grid",
        styles: {
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          fontSize: 10, // Adjusted font size for table
        },
      });

      const endOfPageY = 280; // Adjust this value as needed for the vertical position
      doc.text(
        `${t("DoctorsSignature")}:__________`,
        marginLeft,
        endOfPageY - 20
      );
      doc.setFillColor("#48bcdf");
      doc.rect(0, 270, pdf.internal.pageSize.getWidth(), 10, "F");
      doc.setTextColor("#ffffff");
      //pdf.setTextColor("#000000");
      doc.setFontSize(12);

      doc.text(
        t("PoweredByMediAI"),
        doc.internal.pageSize.getWidth() / 2 - 17,
        277
      );
      doc.save("prescription.pdf");
    };
  };

  useEffect(() => {
    patient != null && downloadAsPdf();
  }, [patient, prescription]);

  const isDateInRange = (date, startDate, endDate) => {
    return startDate <= date && date <= endDate;
  };

  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    return "Access Denied";
  }
  return (
    <div className="container">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {t("billingManagement")}
      </header>
      <br />
      <div className="row">
        <div
          style={{ fontSize: "12px", fontWeight: "bold" }}
          className="col-md-4 col-12"
        >
          <label
            style={{ marginLeft: "5px", marginTop: "0px", marginBottom: "9px" }}
            htmlFor=""
          >
            {t("patientName")} :
          </label>
          <Select
            menuPortalTarget={document.body}
            menuPosition={"fixed"}
            placeholder={t("selectPatient")}
            styles={{
              control: (provided) => ({
                ...provided,

                fontSize: "12px",
              }),
            }}
            options={[
              { value: "", label: t("selectPatient") },
              ...filteredData.map((patient) => ({
                value: JSON.stringify(patient),
                label: patient.PatientName,
              })),
            ]}
            onChange={(selectedOption) => {
              try {
                const selectedValue = selectedOption.value;
                const parsedPatient = selectedValue
                  ? JSON.parse(selectedValue)
                  : undefined;
                setSelectedPatient(parsedPatient);
              } catch (error) {
                console.error("Error parsing JSON:", error);
                setSelectedPatient(undefined);
              }
            }}
          />
        </div>
        <div style={{ marginTop: "0px" }} className="col-md-3 col-12">
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </div>
      </div>
      <br></br>
      <Table
        style={{ textAlign: "center", fontSize: "12px" }}
        striped
        bordered
        hover
        responsive
      >
        <thead>
          <tr>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("billingManagementTable.SrNO")}
            </th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("billingManagementTable.patientName")}
            </th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("billingManagementTable.admissionID")}
            </th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("billingManagementTable.admissionDate")}
            </th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("billingManagementTable.dischargeDate")}
            </th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("billingManagementTable.typeOfProcedures")}
            </th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("billingManagementTable.procedureDate")}
            </th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("billingManagementTable.procedureCost")}
            </th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("billingManagementTable.reportPublished")}
            </th>
            <th style={{ whiteSpace: "nowrap" }}>
              {t("billingManagementTable.receipt")}
              {/* {t("receipt")} */}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 1 &&
            data
              .filter((element) => {
                const admissionIDFilter =
                  selectedPatient === undefined ||
                  element.admissionID === selectedPatient.admissionID;

                const startDateFilter =
                  startDate === null ||
                  isDateInRange(
                    new Date(element.createdAt),
                    new Date(startDate),
                    new Date(endDate)
                  );

                return admissionIDFilter && startDateFilter;
              })
              .map((patient, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{patient?.PatientName}</td>
                    <td className="text-center">{patient?.admissionID}</td>
                    <td className="text-center">
                      {patient?.AdmissionDate
                        ? formatDateInSelectedLanguage(
                            new Date(patient?.AdmissionDate)
                          )
                        : "NA"}{" "}
                    </td>
                    <td className="text-center">
                      {patient?.DischargeDate
                        ? formatDateInSelectedLanguage(
                            new Date(patient?.DischargeDate)
                          )
                        : "NA"}
                    </td>
                    <td className="text-center">{patient?.procedure}</td>
                    <td className="text-center">
                      {patient?.createdAt
                        ? formatDateInSelectedLanguage(
                            new Date(patient?.createdAt)
                          )
                        : "NA"}
                    </td>
                    <td className="text-center">
                      {patient?.procedure === "Doctor Visit"
                        ? ` ${convertCurrency(
                            patient?.amount,
                            patient?.Currency,
                            selectedGlobalCurrency
                          )} ${selectedGlobalCurrency}`
                        : ` ${convertCurrency(
                            patient?.TotalFees,
                            patient?.Currency,
                            selectedGlobalCurrency
                          )} ${selectedGlobalCurrency}`}
                      {/* {patient.TotalFees}{" "}
                      {patient.TotalFees && patient.Currency} */}
                    </td>
                    {/* <td>{patient.Currency}</td> */}
                    <td className="text-center">
                      {patient?.procedure == "Doctor Visit" ? (
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: "12px", padding: "4px 5px" }}
                        >
                          <FaDownload
                            onClick={() =>
                              handleFetchPrescriptionData(patient?.admissionID)
                            }
                          />
                        </button>
                      ) : (
                        <button
                          style={{ fontSize: "12px", padding: "4px 5px" }}
                          title={t("DownloadReport")}
                          className="btn btn-secondary"
                          onClick={() => {
                            patient?.procedure == "Diagnostic"
                              ? handleGenerateReportNew(patient)
                              : handleGenerateReportNewPathology(patient);
                          }}
                        >
                          <FaDownload />
                        </button>
                      )}
                    </td>
                    <td className="text-center">
                      <button
                        title={t("Downloadaspdf")}
                        style={{
                          fontSize: "12px",
                          padding: "4px 5px",
                          marginTop: "0px",
                        }}
                        className="btn btn-secondary mr-2"
                        onClick={() => {
                          patient?.procedure == "Doctor Visit"
                            ? generateBillDrVisit(patient)
                            : generatebill(patient);
                        }}
                      >
                        <FaDownload />
                      </button>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </Table>
      {DiagnosticID && <DownloadPDFButton testBookingID={DiagnosticID} />}
      {PathologyID && (
        <DownloadPDFButtonPathology testBookingID={PathologyID} />
      )}
    </div>
  );
};

export default BillingMangement;
