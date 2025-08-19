import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Translation from "../translations/ViewMedicationReport.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
const PrescriptionForm = () => {
  const [prescriptionData, setPrescriptionData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

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

  if (!currentUser) {
    navigate(`/${extractedPart}/login`);
  }
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/medicines/${id}`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPrescriptionData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while fetching data. Please try again later.");
      });
  }, []);

  const handleAddDay = () => {
    setPrescriptionData((prevPrescriptionData) => {
      const medicationMedicine = prevPrescriptionData.map((medicine) => {
        const newDay = {
          date: "",
          morningTime: "",
          afternoonTime: "",
          eveningTime: "",
          nightTime: "",
        };
        return {
          ...medicine,
          days: [...medicine.days, newDay],
        };
      });
      return medicationMedicine;
    });
  };

  const handleDateChange = (medicationIndex, dayIndex, event) => {
    const { value } = event.target;
    setPrescriptionData((prevPrescriptionData) => {
      const medicationMedicine = [...prevPrescriptionData];
      medicationMedicine[medicationIndex].days[dayIndex].date = value;
      return medicationMedicine;
    });
  };

  const validateTimeSelection = (dosageAmount, timeIndex) => {
    if (dosageAmount === "1M" && timeIndex !== 0) {
      // showIncorrectTimingToast();
      return; // Only morning time allowed
    }
    if (dosageAmount === "1A" && timeIndex !== 1) {
      return false; // Only afternoon time allowed
    }
    if (dosageAmount === "1E" && timeIndex !== 2) {
      // showIncorrectTimingToast();
      return; // Only evening time allowed
    }
    if (dosageAmount === "1N" && timeIndex !== 3) {
      return false; // Only night time allowed
    }
    if (
      dosageAmount.replace(/\s+/g, "") === "1M,1E" &&
      timeIndex !== 0 &&
      timeIndex !== 2
    ) {
      //  showIncorrectTimingToast();
      return false; // Only morning and evening time allowed
    }
    if (
      dosageAmount === "1M,1E,1N" &&
      timeIndex !== 0 &&
      timeIndex !== 2 &&
      timeIndex !== 3
    ) {
      return false; // Only morning, evening, and night time allowed
    }
    if (dosageAmount === "1M,1A" && timeIndex !== 0 && timeIndex !== 1) {
      return false; // Only morning and afternoon time allowed
    }
    if (dosageAmount === "1A,1E" && timeIndex !== 1 && timeIndex !== 2) {
      return false; // Only morning and afternoon time allowed
    }
    return true;
  };

  // const showIncorrectTimingToast = () => {
  //     toast.error('Please select the correct timing.', {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 2000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined
  //     });
  // };
  const [isToastVisible, setToastVisible] = useState(false);

  const handleTimeChange = (medicationIndex, dayIndex, timeIndex, event) => {
    const { value } = event.target;
    setPrescriptionData((prevPrescriptionData) => {
      const medicationMedicine = [...prevPrescriptionData];
      const dosageAmount = medicationMedicine[medicationIndex].dosageAmount;

      // Validate the time selection based on dosage amount
      if (!validateTimeSelection(dosageAmount, timeIndex)) {
        toast.error("Please select timing as per Dosage Amount.", {
          autoClose: 200, // Set the duration to 1 second (1000 milliseconds)
        });
        return medicationMedicine; // Invalid time selection, do not update the state
      }

      if (timeIndex === 0) {
        medicationMedicine[medicationIndex].days[dayIndex].morningTime = value;
      } else if (timeIndex === 1) {
        medicationMedicine[medicationIndex].days[dayIndex].afternoonTime =
          value;
      } else if (timeIndex === 2) {
        medicationMedicine[medicationIndex].days[dayIndex].eveningTime = value;
      } else if (timeIndex === 3) {
        medicationMedicine[medicationIndex].days[dayIndex].nightTime = value;
      }
      return medicationMedicine;
    });
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const prescriptionDataString = JSON.stringify(prescriptionData);
    // alert(prescriptionDataString)
    fetch(`${import.meta.env.VITE_API_URL}/api/medications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${currentUser?.Token}`,
      },
      body: prescriptionDataString,
    })
      .then((response) => {
        if (response.ok) {
          //alert('Prescription submitted successfully!');
          // window.location.reload();

          toast.success(t("Datasavedsuccessfully"), {
            position: toast.POSITION.TOP_END,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          let patientId;
          if (currentUser.roles.includes("ROLE_NURSE")) {
            patientId = prescriptionData[0].patient_Id;
            navigate(
              `/${extractedPart}/NurseOnePatientPrescription/${patientId}`
            );
          } else {
            navigate(
              `/${extractedPart}/viewPatientPrescription/${currentUser.phoneNumber}`
            );
          }
        } else {
          alert("Failed to submit data. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Add leading zero to month and day if they are single digits
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };
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
    fontSize: "12px" /* Adjust the font size for <h3> */,
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

  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_PATIENT") &&
    !currentUser.roles.includes("ROLE_NURSE")
  ) {
    if (!currentUser.phoneNumber) return "Access denied!";
  }

  let goBackLink, patientId;
  if (prescriptionData && prescriptionData.length > 0) {
    patientId = prescriptionData[0].patient_Id;
  }
  if (currentUser.roles.includes("ROLE_PATIENT")) {
    goBackLink = `/${extractedPart}/viewPatientPrescription/${currentUser.phoneNumber}`;
  } else if (currentUser.roles.includes("ROLE_NURSE")) {
    goBackLink = `/${extractedPart}/NurseOnePatientPrescription/${patientId}`;
  }

  const renderTable = () => {
    return (
      <div>
        <header
          className="header"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 style={h1Style}>{t("UpdateMedicineTakenDateandTime")}</h2>
        </header>
        <br></br>

        <div style={style} className="table-responsive">
          <table
            className="table mx-auto "
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "center",
                    border: "1px solid black",
                    whiteSpace: "nowrap",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    border: "1px solid black",
                  }}
                >
                  {t("medicationAdministrationRecordsTable.medicineName")}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    border: "1px solid black",
                  }}
                >
                  {t("medicationAdministrationRecordsTable.dosageAmount")}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    border: "1px solid black",
                  }}
                >
                  {t("medicationAdministrationRecordsTable.TakenDate")}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    border: "1px solid black",
                  }}
                >
                  {t("medicationAdministrationRecordsTable.morningTime")}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    border: "1px solid black",
                  }}
                >
                  {t("medicationAdministrationRecordsTable.afternoonTime")}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    border: "1px solid black",
                  }}
                >
                  {t("medicationAdministrationRecordsTable.eveningTime")}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    border: "1px solid black",
                  }}
                >
                  {t("medicationAdministrationRecordsTable.nightTime")}
                </th>
              </tr>
            </thead>
            <tbody>
              {prescriptionData.map((medicine, medicationIndex) => (
                <React.Fragment key={medicine.id}>
                  {medicine.days.map((day, dayIndex) => (
                    <tr key={`med_${medicine.id}_day_${dayIndex}`}>
                      {dayIndex === 0 && (
                        <React.Fragment>
                          <td
                            style={{
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                            rowSpan={medicine.days.length}
                          >
                            {medicine.id}
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                            rowSpan={medicine.days.length}
                          >
                            {medicine.medicineName}
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                            rowSpan={medicine.days.length}
                          >
                            {medicine.dosageAmount}
                          </td>
                        </React.Fragment>
                      )}
                      <td>
                        <input
                          className="form-control"
                          type="date"
                          min={getCurrentDate()}
                          style={{ fontSize: "12px" }}
                          value={day.date}
                          onChange={(event) =>
                            handleDateChange(medicationIndex, dayIndex, event)
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="time"
                          style={{ fontSize: "12px" }}
                          value={day.morningTime}
                          onChange={(event) =>
                            handleTimeChange(
                              medicationIndex,
                              dayIndex,
                              0,
                              event
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="time"
                          style={{ fontSize: "12px" }}
                          value={day.afternoonTime}
                          onChange={(event) =>
                            handleTimeChange(
                              medicationIndex,
                              dayIndex,
                              1,
                              event
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="time"
                          style={{ fontSize: "12px" }}
                          value={day.eveningTime}
                          onChange={(event) =>
                            handleTimeChange(
                              medicationIndex,
                              dayIndex,
                              2,
                              event
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="time"
                          style={{ fontSize: "12px" }}
                          value={day.nightTime}
                          onChange={(event) =>
                            handleTimeChange(
                              medicationIndex,
                              dayIndex,
                              3,
                              event
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {renderTable()}
        {prescriptionData.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {/* <Button
              variant="secondary"
              style={{
                fontSize: "11px",
                height: "30px",
                marginTop: "13px",
                padding: "4px 5px",
              }}
              className="btn btn-secondary"
              type="button"
              onClick={handleAddDay}
            >
              {t("AddDay")}
            </Button> */}
            <Button
              variant="secondary"
              className="btn btn-secondary"
              type="submit"
              style={{
                fontSize: "11px",
                marginLeft: "10px",
                height: "30px",
                marginTop: "13px",
                padding: "4px 5px",
              }}
            >
              {t("Submit")}
            </Button>

            <Link to={goBackLink}>
              <Button
                variant="secondary"
                style={{
                  fontSize: "11px",
                  height: "30px",
                  marginTop: "13px",
                  marginLeft: "10px",
                  // padding: "4px 5px",
                }}
                className="btn btn-primary btn-sm"
              >
                {t("goBack")}
              </Button>
            </Link>
          </div>
        )}
      </form>

      {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>
                <Link to={goBackLink}>
                    <button style={{ fontSize: '12px', padding: '4px 5px' }} className="btn btn-primary btn-sm">Go Back</button>
                </Link>
            </div> */}
    </>
  );
};

export default PrescriptionForm;
