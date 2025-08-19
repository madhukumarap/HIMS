import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col, Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import AuthService from "../services/auth.service";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import Select from "react-select";
import Translation from "../translations/PatientMedecines.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

const PatientPrescriptionDetails = () => {
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const { id1, id2 } = useParams();
  const { t } = useTranslation();
  const locales = { enIN, fr };

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
    const intervalId = setInterval(initializei18n, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };
  const [patient, setPatient] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const contentRef = useRef(null);

  const [isDownloading, setIsDownloading] = useState(false);

  const [editState, setEditState] = useState({});
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
  // Function to handle changes in editable fields
  const handleFieldChange = (medicineId, field, value) => {
    setEditState((prevState) => ({
      ...prevState,
      [medicineId]: {
        ...prevState[medicineId],
        [field]: value,
      },
    }));
  };

  const [medicineOptions, setMedicineOptions] = useState([]);
  const [isMedicineExternal, setIsMedicineExternal] = useState(true);
  const [medicineName, setMedicineName] = useState("");

  // Fetch medicine data from Node.js API
  const fetchMedicineData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getInventryItems`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const medicines = response.data;

      // Transform medicine data into options array
      const options = [
        ...medicines.map((medicine) => ({
          value: medicine.id,
          label: medicine.itemName,
        })),
      ];

      setMedicineOptions(options);
    } catch (error) {
      console.error("Error fetching medicine data:", error);
    }
  };

  useEffect(() => {
    fetchMedicineData();
  }, []);
  const [InventoryitemNameID, SetInventoryitemNameID] = useState(0);
  const handleMedicineChange = (selectedOption) => {
    if (selectedOption) {
      const selectedMedicineName = selectedOption.label;
      const selectedMedicineId = selectedOption.value;
      //  alert(`Selected Medicine: ${selectedMedicineName}, ID: ${selectedMedicineId}`);
      setMedicineName(selectedMedicineName);
      SetInventoryitemNameID(selectedMedicineId);
    } else {
      //  alert('No medicine selected');
      setMedicineName("");
    }
  };

  const handleMedicineExternalChange = (event) => {
    setIsMedicineExternal(event.target.value === "yes");
  };
  // Function to save the updated prescription data
  const handleSave = () => {
    const updatedMedicines = Object.entries(editState).map(
      ([medicineId, editedFields]) => ({
        id: medicineId,
        ...editedFields,
      })
    );

    updatedMedicines[0].InventoryitemNameID = InventoryitemNameID;
    if (updatedMedicines[0].dosageAmount === "") {
      toast.error(t("PleaseEnterDosageAmount"));
      return;
    }
    if (updatedMedicines[0].food === "") {
      toast.error(t("PleaseEnterClinicalAdvice"));
      return;
    }
    if (updatedMedicines[0].weekly === "") {
      toast.error(t("PleaseEnterDurationLifeTime"));
      return;
    }
    if (updatedMedicines[0].quantity === "") {
      toast.error(t("PleaseEnterQuantity"));
      return;
    }
    const confirmResult = window.confirm(t("AreYouSureToSaveChanges"));

    if (confirmResult) {
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/api/updateMedicines`,
          updatedMedicines,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          // Handle the server response
          if (response.status === 200) {
            // Fetch the updated patient and prescription data
            const fetchData = async () => {
              try {
                const patientResponse = await axios.get(
                  `${import.meta.env.VITE_API_URL}/api/getoneP/${id1}`,
                  {
                    headers: {
                      Authorization: `${currentUser?.Token}`,
                    },
                  }
                );
                setPatient(patientResponse.data);

                const prescriptionResponse = await axios.get(
                  `${import.meta.env.VITE_API_URL}/api/getOnePrescription/${id2}`,
                  {
                    headers: {
                      Authorization: `${currentUser?.Token}`,
                    },
                  }
                );
                setPrescription(prescriptionResponse.data);

                // Close the edit mode and show the updated data
                setEditState({});
                toast.success(t("UpdatedSuccessfully"));
              } catch (error) {
                console.error(error);
                toast.error("Failed");
              }
            };

            fetchData();
          }
        })
        .catch((error) => {
          // Handle errors, if any
        });
    }
  };

  // Function to cancel editing for a specific medicine
  const handleCancel = (medicineId) => {
    setEditState((prevState) => {
      const updatedEditState = { ...prevState };
      delete updatedEditState[medicineId];
      return updatedEditState;
    });
  };

  // Function to toggle editing for a specific medicine
  const toggleEdit = (medicineId) => {
    setEditState((prevState) => ({
      ...prevState,
      [medicineId]: prevState[medicineId]
        ? undefined
        : {
            ...prescription.medicines.find(
              (medicine) => medicine.id === medicineId
            ),
          },
    }));
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
    const email = `Mail: ${hospitalData.email}`;
    const landline = `Tel: ${hospitalData.landline}`;
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
    ${t("PatientID")}: ${patient.id}
    ${t("RegistrationDate")}: ${formatDateInSelectedLanguage(
        new Date(patient.createdAt)
      )}
    ${t("PatientName")}: ${patient.firstName} ${patient.middleName} ${
        patient.lastName
      }
    ${t("Age")}: ${patient.age}
    ${t("Gender")}: ${patient.gender}
    ${t("ContactNumber")}:  ${patient.phoneNumberP}
`;

      const doctorDetails = `
    ${t("PrescriberName")}: ${prescription.PrescribedDoctor}
    ${t("RegistrationNo")}: ${prescription.RegistrationNo}
    ${t("ContactNumber")}:  ${prescription.PhoneNo}
    ${t("PrescriptionID")}: ${prescription.prescriptionId}
    ${t("PrescriptionDate")}: ${formatDateInSelectedLanguage(
        new Date(prescription.createdAt)
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

      const medicinesData = prescription.medicines.map((medicine) => [
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
        "Powered by mediAI",
        doc.internal.pageSize.getWidth() / 2 - 17,
        277
      );
      doc.save("prescription.pdf");
    };
  };
  const [selectedImage, setSelectedImage] = useState(null);

  const openImagePopup = (image) => {
    if (!image) {
      toast.error(t("NoAttachmentFound"));
      return;
    }
    setSelectedImage(image);
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  const downloadAsPdf2 = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(14);

    // Combined Details Table
    doc.text(`${t("PatientAndPrescriptionDetails")}:`, 10, 10);

    const patientDetails = [
      [t("Field"), t("Value")],
      [t("PatientName"), `${patient?.firstName} ${patient?.lastName}`],
      [t("Age"), patient?.age],
      [t("Gender"), patient?.gender],
      [t("PrescriberName"), prescription?.PrescribedDoctor],
      [
        t("PrescriptionDate"),
        formatDateInSelectedLanguage(new Date(prescription?.createdAt)),
      ],
    ];

    doc.autoTable({
      body: patientDetails,
      startY: 20,
      styles: { fontSize: 10, cellPadding: 3 },
      tableWidth: "wrap",
      headStyles: { fillColor: [240, 240, 240] },
      theme: "grid",
    });

    // Medicines Table
    doc.text(t("Medicines") + ":", 10, doc.autoTable.previous.finalY + 30);

    const tableHeaders = [
      [
        t("Name"),
        t("DosageAmount"),
        t("TotalQuantity"), // Assuming "Total" refers to "Total Quantity" based on your translation keys
        t("ClinicalAdvice"),
        t("StartDate"),
        t("DurationLifeTime"),
      ],
    ];

    const tableRows = prescription?.medicines?.map((medicine) => [
      medicine?.medicineName || "null",
      medicine?.dosageAmount || "null",
      medicine?.quantity || "null",
      medicine?.food || "null",
      medicine?.startDate || "null",
      medicine?.weekly || "null",
    ]);

    doc.autoTable({
      head: tableHeaders,
      body: tableRows,
      startY: doc.autoTable.previous.finalY + 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 50 },
        4: { cellWidth: 35 },
        5: { cellWidth: 35 },
      },
      theme: "grid",
    });

    doc.save("patient_prescription.pdf");
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${selectedImage}`;
    link.download = `Prescription_${patient.firstName}_${patient.lastName}.jpg`;
    link.click();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getoneP/${id1}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setPatient(patientResponse.data);

        const prescriptionResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getOnePrescription/${id2}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setPrescription(prescriptionResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (!patient || !prescription) {
    return <p>Loading...</p>;
  }

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });

  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_PATIENT") &&
    !currentUser.roles.includes("ROLE_NURSE")
  ) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return <h5>AccessDenied!</h5>;
    // You can handle the redirection or error message display as per your requirement
  }

  let goBackLink;
  if (currentUser.roles.includes("ROLE_DOCTOR")) {
    goBackLink = `/OnePatientPrescription/${id1}`;
  } else if (currentUser.roles.includes("ROLE_NURSE")) {
    goBackLink = `/NurseOnePatientPrescription/${id1}`;
  }

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "14px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "13px" /* Adjust the font size for <h3> */,
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  return (
    <>
      <Modal
        isOpen={!!selectedImage}
        onRequestClose={closeImagePopup}
        contentLabel="Image Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "100%",
            maxHeight: "100%",
            overflow: "auto",
            outline: "none",
            padding: "0px", // Add padding here
          },
        }}
      >
        {selectedImage && (
          <div className="popup">
            <div className="popup-content">
              <img
                src={`data:image/jpeg;base64,${selectedImage}`}
                alt="Student"
                className="img-fluid"
              />
              <div className="button-group">
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className="btn btn-secondary"
                    style={h3Style}
                    onClick={downloadImage}
                  >
                    {t("Download")}
                  </button>
                  <button
                    className="btn btn-danger  mt-3"
                    style={h3Style}
                    onClick={closeImagePopup}
                  >
                    {t("Close")}
                  </button>
                </div>

                {/* <button className="btn btn-success mt-3" onClick={() => window.print()}>Print</button> */}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <div ref={contentRef}>
        <Container style={style} className="mt-4 ">
          {/* <div className="center container" style={{ fontSize: '24px', backgroundColor: "#8BC34A", marginTop: "50px", padding: "10px", marginBottom: "20px", textAlign: "center" }}>
          <h2 >Patient and Prescription Details</h2>
        </div> */}

          <header
            className="header"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={h1Style}>{t("PatientPrescriptionDetails")}</h2>
          </header>

          <div class="row">
            <div class="col-md-8">
              {/* <button className="btn btn-secondary" onClick={downloadAsPdf2}>
                Download Data
              </button> */}
            </div>

            <div class="col-md-4">
              {/* {prescription.image ? ( */}
              <>
                {!isDownloading && (
                  <button
                    className="btn btn-primary btn-sm"
                    style={h3Style}
                    onClick={() => openImagePopup(prescription.image)}
                  >
                    {t("ViewAttachment")}
                  </button>
                )}
                <button
                  className="btn btn-primary btn-sm "
                  style={h3Style}
                  onClick={downloadAsPdf}
                >
                  {t("DownloadAsPDF")}
                </button>
              </>
              {/* ) : (
                <p>No attachments available</p>
              )} */}
            </div>
          </div>
          <Container style={{ paddingLeft: 0, marginLeft: 0 }} className="mt-5">
            <Row className="justify-content-center">
              <Col md={6} xs={12}>
                <Card className="mb-4" style={{ border: "none" }}>
                  <Card.Body>
                    <Card.Title style={h3Style}>
                      <strong>{t("PatientDetails")}:</strong>
                    </Card.Title>
                    <Card.Text>
                      <p>
                        <strong>{t("PatientID")}:</strong> {`${patient.id} `}
                        <strong>, {t("RegistrationDate")}:</strong>{" "}
                        {formatDateInSelectedLanguage(
                          new Date(patient.createdAt)
                        )}
                      </p>
                      <p>
                        <strong>{t("PatientName")}:</strong>{" "}
                        {`${patient.firstName} `}
                        {`${patient.middleName} `}
                        {`${patient.lastName}`} <strong>, {t("Age")}:</strong>{" "}
                        {patient.age} <strong>{t("Gender")}:</strong>{" "}
                        {patient.gender}
                      </p>
                      <p>
                        <strong>{t("ContactNumber")}:</strong>{" "}
                        {patient.phoneNumberP}{" "}
                        <strong>, {t("EmailAddress")}:</strong> {patient.email}
                      </p>
                      <p>
                        <strong>{t("Weight")}:</strong> {patient.weight}Kg.{" "}
                        <strong>{t("Height")}:</strong> {patient.height}cm.
                      </p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} xs={12}>
                <Card className="mb-4" style={{ border: "none" }}>
                  <Card.Body>
                    <Card.Title style={h3Style}>
                      <strong>{t("DoctorsDetails")}:</strong>{" "}
                    </Card.Title>
                    <Card.Text>
                      <p>
                        <strong>{t("PrescriberName")}:</strong>{" "}
                        {` ${prescription.PrescribedDoctor} `}
                      </p>
                      <p>
                        <strong>{t("RegistrationNo")}:</strong>{" "}
                        {prescription.RegistrationNo}{" "}
                        <strong>, {t("ContactNumber")}:</strong>{" "}
                        {prescription.PhoneNo}
                      </p>
                      <p>
                        <strong>{t("PrescriptionID")}:</strong>{" "}
                        {prescription.prescriptionId}{" "}
                        <strong>, {t("PrescriptionDate")}:</strong>{" "}
                        {formatDateInSelectedLanguage(
                          new Date(prescription.createdAt)
                        )}
                      </p>
                      <p>
                        <strong>{t("BloodPressure")}:</strong>{" "}
                        {prescription.bloodPressure}{" "}
                        <strong>, {t("HeartRate")}:</strong>{" "}
                        {prescription.heartRate}
                        <strong>, {t("Temperature")}:</strong>{" "}
                        {prescription.temperature}
                        <strong>, {t("RespiratoryRate")}:</strong>{" "}
                        {prescription.respiratoryRate}
                      </p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>

          <br></br>

          <div class="container">
            <div class="row">
              <div class="col-md-6">
                <p class="fw-bold">{t("SocialLifestyle")}: </p>
              </div>
              <div class="col-md-6">
                <p>{prescription.socialLifestyle}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p class="fw-bold">{t("FoodHabits")}: </p>
              </div>
              <div class="col-md-6">
                <p>{prescription.foodHabits}</p>
              </div>
            </div>
            {/* Add similar translation usage for other sections */}
            <div class="row">
              <div class="col-md-6">
                <p class="fw-bold">{t("Allergies")}: </p>
              </div>
              <div class="col-md-6">
                <p>{prescription.allergies}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p class="fw-bold">{t("ClinicalDiagnosis")}: </p>
              </div>
              <div class="col-md-6">
                <p>{prescription.clinicalDiagnosis}</p>
              </div>
            </div>
          </div>

          <div class="container">
            <div>
              {/* Render the prescription table */}
              <div className="card mb-4">
                <div className="card-header" style={h2Style}>
                  <strong>{t("Medicines")}:</strong>
                </div>

                {isMobile ? (
                  <div>
                    {prescription.medicines.map((medicine) => (
                      <div className="card-body">
                        <div className="card-title">
                          <strong>Name:</strong>{" "}
                          {editState[medicine.id] ? (
                            <Select
                              required
                              value={
                                editState[medicine.id].medicineName
                                  ? {
                                      label:
                                        editState[medicine.id].medicineName,
                                      value:
                                        editState[medicine.id]
                                          .InventoryitemNameID,
                                    }
                                  : null
                              }
                              onChange={(selectedOption) => {
                                handleFieldChange(
                                  medicine.id,
                                  "medicineName",
                                  selectedOption ? selectedOption.label : ""
                                );
                                SetInventoryitemNameID(
                                  selectedOption ? selectedOption.value : 0
                                );
                              }}
                              options={medicineOptions}
                              className="react-select-container"
                              classNamePrefix="react-select"
                              placeholder="Select medicine from inventory"
                            />
                          ) : (
                            <span>{medicine.medicineName}</span>
                          )}
                        </div>
                        <div className="mb-2">
                          <strong>Dosage Amount:</strong>{" "}
                          {editState[medicine.id] ? (
                            <input
                              type="text"
                              className="form-control"
                              style={{ fontSize: "12px" }}
                              required
                              value={editState[medicine.id].dosageAmount}
                              placeholder="Enter like 1M, 1A, 1E"
                              onChange={(e) =>
                                handleFieldChange(
                                  medicine.id,
                                  "dosageAmount",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <span>{medicine.dosageAmount}</span>
                          )}
                        </div>
                        <div className="mb-2">
                          <strong>Clinical Advice:</strong>{" "}
                          {editState[medicine.id] ? (
                            <input
                              required
                              type="text"
                              className="form-control"
                              style={{ fontSize: "12px" }}
                              value={editState[medicine.id].food}
                              placeholder="Enter Clinical Advice"
                              onChange={(e) =>
                                handleFieldChange(
                                  medicine.id,
                                  "food",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <span>{medicine.food}</span>
                          )}
                        </div>
                        <div className="mb-2">
                          <strong>Start Date:</strong>{" "}
                          {editState[medicine.id] ? (
                            <input
                              required
                              type="DATE"
                              className="form-control"
                              style={{ fontSize: "12px" }}
                              value={editState[medicine.id].startDate}
                              onChange={(e) =>
                                handleFieldChange(
                                  medicine.id,
                                  "startDate",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <span>{medicine.startDate}</span>
                          )}
                        </div>
                        <div className="mb-2">
                          <strong>Duration/LifeTime:</strong>{" "}
                          {editState[medicine.id] ? (
                            <input
                              required
                              type="text"
                              className="form-control"
                              style={{ fontSize: "12px" }}
                              value={editState[medicine.id].weekly}
                              placeholder="Enter Duration in days"
                              onChange={(e) =>
                                handleFieldChange(
                                  medicine.id,
                                  "weekly",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <span>{medicine.weekly}</span>
                          )}
                        </div>
                        <div className="mb-2">
                          <strong>Total Quantity:</strong>{" "}
                          {editState[medicine.id] ? (
                            <input
                              type="text"
                              className="form-control"
                              style={{ fontSize: "12px" }}
                              value={editState[medicine.id].quantity}
                              pattern="[0-9]*"
                              onKeyPress={(event) => {
                                const pattern = /[0-9]/;
                                if (!pattern.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                              required
                              placeholder="Enter Quantity"
                              onChange={(e) =>
                                handleFieldChange(
                                  medicine.id,
                                  "quantity",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <span>{medicine.quantity}</span>
                          )}
                        </div>
                        {editState[medicine.id] ? (
                          <div>
                            <button
                              style={{ fontSize: "12px", padding: "4px 5px" }}
                              className="btn btn-secondary mr-2"
                              onClick={() => handleSave(medicine.id)}
                            >
                              Save
                            </button>
                            <button
                              style={{ fontSize: "12px", padding: "4px 5px" }}
                              className="btn btn-secondary"
                              onClick={() => handleCancel(medicine.id)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            style={{ fontSize: "12px ", padding: "4px 5px" }}
                            disabled={
                              !currentUser.roles.includes("ROLE_DOCTOR")
                            }
                            className="btn btn-secondary"
                            onClick={() => toggleEdit(medicine.id)}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card-body">
                    <div className="table-responsive">
                      <table
                        style={{ verticalAlign: "middle" }}
                        className="table table-bordered"
                      >
                        <thead>
                          <tr>
                            <th style={{ textAlign: "center" }}>
                              {t("patientMedicineTable.Name")}
                            </th>
                            <th style={{ whiteSpace: "nowrap" }}>
                              {t("patientMedicineTable.DosageAmount")}
                            </th>
                            <th style={{ whiteSpace: "nowrap" }}>
                              {t("patientMedicineTable.ClinicalAdvice")}
                            </th>
                            <th style={{ whiteSpace: "nowrap" }}>
                              {t("patientMedicineTable.StartDate")}
                            </th>
                            <th style={{ whiteSpace: "nowrap" }}>
                              {t("patientMedicineTable.DurationLifeTime")}
                            </th>
                            <th style={{ whiteSpace: "nowrap" }}>
                              {t("patientMedicineTable.TotalQuantity")}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {t("patientMedicineTable.Edit")}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {prescription.medicines.map((medicine) => (
                            <tr key={medicine.id}>
                              <td>
                                {editState[medicine.id] ? (
                                  <input
                                    type="text"
                                    style={{ fontSize: "10px" }}
                                    className="form-control"
                                    required
                                    value={
                                      editState[medicine.id].medicineName
                                        ? editState[medicine.id].medicineName
                                        : ""
                                    }
                                    onChange={(e) =>
                                      handleFieldChange(
                                        medicine.id,
                                        "medicineName",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter medicine name"
                                  />
                                ) : (
                                  <span>{medicine.medicineName}</span>
                                )}
                              </td>
                              {/* <td>
                                {editState[medicine.id] ? (
                                  <Select
                                    required
                                    value={
                                      editState[medicine.id].medicineName
                                        ? {
                                            label:
                                              editState[medicine.id]
                                                .medicineName,
                                            value:
                                              editState[medicine.id]
                                                .InventoryitemNameID,
                                          }
                                        : null
                                    }
                                    onChange={(selectedOption) => {
                                      handleFieldChange(
                                        medicine.id,
                                        "medicineName",
                                        selectedOption
                                          ? selectedOption.label
                                          : ""
                                      );
                                      SetInventoryitemNameID(
                                        selectedOption
                                          ? selectedOption.value
                                          : 0
                                      );
                                    }}
                                    options={medicineOptions}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    placeholder="Select medicine from inventory"
                                  />
                                ) : (
                                  <span>{medicine.medicineName}</span>
                                )}
                              </td> */}
                              <td>
                                {editState[medicine.id] ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    style={{ fontSize: "12px" }}
                                    required
                                    value={editState[medicine.id].dosageAmount}
                                    placeholder="Enter like 1M, 1A, 1E"
                                    onChange={(e) =>
                                      handleFieldChange(
                                        medicine.id,
                                        "dosageAmount",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  <span>{medicine.dosageAmount}</span>
                                )}
                              </td>

                              <td>
                                {editState[medicine.id] ? (
                                  <input
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ fontSize: "12px" }}
                                    value={editState[medicine.id].food}
                                    placeholder="Enter Clinical Advice"
                                    onChange={(e) =>
                                      handleFieldChange(
                                        medicine.id,
                                        "food",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  <span>{medicine.food}</span>
                                )}
                              </td>
                              <td style={{ whiteSpace: "nowrap" }}>
                                {editState[medicine.id] ? (
                                  <input
                                    required
                                    type="DATE"
                                    className="form-control"
                                    style={{ fontSize: "12px" }}
                                    value={editState[medicine.id].startDate}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        medicine.id,
                                        "startDate",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  <span>{medicine.startDate}</span>
                                )}
                              </td>
                              <td>
                                {editState[medicine.id] ? (
                                  <input
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ fontSize: "12px" }}
                                    value={editState[medicine.id].weekly}
                                    placeholder="Enter Duration in days"
                                    onChange={(e) =>
                                      handleFieldChange(
                                        medicine.id,
                                        "weekly",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  <span>{medicine.weekly}</span>
                                )}
                              </td>
                              <td>
                                {editState[medicine.id] ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    style={{ fontSize: "12px" }}
                                    value={editState[medicine.id].quantity}
                                    pattern="[0-9]*"
                                    onKeyPress={(event) => {
                                      const pattern = /[0-9]/;
                                      if (!pattern.test(event.key)) {
                                        event.preventDefault();
                                      }
                                    }}
                                    required
                                    placeholder="Enter Quantity"
                                    onChange={(e) =>
                                      handleFieldChange(
                                        medicine.id,
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  <span>{medicine.quantity}</span>
                                )}
                              </td>
                              <td>
                                {editState[medicine.id] ? (
                                  <div>
                                    <button
                                      className="btn btn-secondary"
                                      style={{
                                        verticalAlign: "middle",
                                        marginRight: "10px",
                                        fontSize: "12px",
                                        padding: "4px 5px",
                                      }}
                                      onClick={() => handleSave(medicine.id)}
                                    >
                                      {t("Save")}
                                    </button>
                                    <button
                                      className="btn btn-secondary"
                                      style={{
                                        fontSize: "12px",
                                        marginTop: "15px",
                                        padding: "4px 5px",
                                      }}
                                      onClick={() => handleCancel(medicine.id)}
                                    >
                                      {t("Cancel")}
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    disabled={
                                      !currentUser.roles.includes("ROLE_DOCTOR")
                                    }
                                    className="btn btn-secondary"
                                    style={{
                                      verticalAlign: "middle",
                                      fontSize: "12px",
                                      padding: "4px 5px",
                                    }}
                                    onClick={() => toggleEdit(medicine.id)}
                                  >
                                    {t("Edit")}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "auto",
            }}
          >
            <Link
              to={`/${extractedPart}/viewPatientPrescription/${patient.phoneNumberP}`}
            >
              <button
                style={{ fontSize: "10px", padding: "4px 5px" }}
                className="btn btn-primary btn-sm"
              >
                {t("GoBack")}
              </button>
            </Link>
          </div>
          <br></br>
          <br></br>
        </Container>
      </div>
    </>
  );
};
export default PatientPrescriptionDetails;
