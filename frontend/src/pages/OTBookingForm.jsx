import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import Translation from "../translations/OTBookingForm.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const customInputStyles = {
  fontSize: "12px",
};
const OTBookingForm = () => {
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
  const handleGoBack = () => {
    navigate(`/${extractedPart}/CreateEditOTCalender`);
  };
  const location = useLocation();

  const [duration, setDuration] = useState(0);
  const handleDurationChange = (e) => {
    setDuration(parseInt(e.target.value));
  };

  const [timerange, setTimeRange] = useState([]);
  const [otData, setOTData] = useState([]); // State to store the fetched data
  const [selectedOT, setSelectedOT] = useState(""); // State to store the selected OT
  const [inOutPatient, setInOutPatient] = useState(undefined);
  const [hospitalBookings, setHospitalBookings] = useState([]);

  useEffect(() => {
    // Fetch the data from the server
    fetch(`${import.meta.env.VITE_API_URL}/api/GetOTNameList`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOTData(data);
      })
      .catch((error) => console.error(error));

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getHospitalAdmissionList`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setHospitalBookings(response.data.data);
        console.log("443", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleOTChange = (event) => {
    // setFormData(formData.OTName)
    setSelectedOT(event.target.value);
  };

  useEffect(() => {
    const fetchTimeRange = async () => {
      try {
        const response = await axios.get("/api/getAllOtSheduledPatient");
        const data = response.data;
        setTimeRange(data);
      } catch (error) {
        console.error("Error fetching time range:", error);
      }
    };

    fetchTimeRange();
  }, []);

  const [start1, setStart1] = useState("");
  const [formData, setFormData] = useState({
    anesthetistAssistantName: "",
    anesthesia: "",
    scrubNurseName: "",
    remarks: "",
    otAssistantName: "",
    patientName: "",
    guardianName: "",
    guardianContactNo: "",
    procedure: "",
    anesthetistDoctorName: "",
    otDateTime: "",
    diagnosis: "",
    duration: "",
    typeOfSurgery: "",
    surgeonName: "",
    surgeonEmail: "",
    selectedPatient: null,
    external: "",
    OTName: "",
    admissionID: 0,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (start) {
      console.log("start:", start);

      const formattedDateTimeStart = moment(
        start,
        "ddd MMM DD YYYY HH:mm:ss [GMT] ZZ"
      ).format("MM/DD/YYYY, hh:mm A");
      const formattedDateTimeEnd = moment(
        end,
        "ddd MMM DD YYYY HH:mm:ss [GMT] ZZ"
      ).format("MM/DD/YYYY, hh:mm A");

      const endMoment = moment(formattedDateTimeEnd);
      const diffInMinutes = endMoment.diff(formattedDateTimeStart, "minutes");
      // alert(diffInMinutes)

      const isValidFormat = moment(
        formattedDateTimeStart,
        "MM/DD/YYYY, hh:mm A"
      ).isValid();
      if (isValidFormat) {
        //  alert(formattedDateTimeStart)
        setFormData({
          ...formData,
          otDateTime: new Date(formattedDateTimeStart),
          duration: diffInMinutes,
        });
      } else {
        alert("Not set");
        console.log("Invalid date and time format");
      }
    }

    // Do something with the start and end parameters
  }, [location.search]);

  const isTimeInTimerange = (time) => {
    for (let i = 0; i < timerange.length; i++) {
      const start = new Date(timerange[i].otDateTime);
      const end = new Date(timerange[i].UpToOtTime);
      if (time >= start && time <= end) {
        const options = {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour12: true,
          hour: "numeric",
          minute: "numeric",
        };
        const startTime = start.toLocaleString("en-IN", options);
        const endTime = end.toLocaleString("en-IN", options);
        const error =
          t("ThisTimeIsAlreadyBooked") + ": " + startTime + " To " + endTime;
        alert(error);
        setFormData({
          otDateTime: "",
        });
        return true;
      }
    }
    return false;
  };

  const handleDateTimeChange = (date) => {
    if (isTimeInTimerange(date)) {
      //  alert("This time is already booked!");
      return;
    }
    setFormData({ ...formData, otDateTime: date });
  };

  // const checkDuration = (duration) => {
  //     const newDatetime = new Date(otDatetime);
  //     newDatetime.setMinutes(newDatetime.getMinutes() + duration);
  //     alert(newDatetime);
  //     if (isTimeInTimerange(newDatetime)) {
  //         //  alert("This time is already booked!");
  //         return;
  //     }
  //     setDuration(duration);
  // }

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch the patient data from the server
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getallPaitents`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setPatients(response.data);
        const stringifiedArr = patients.map((obj) => JSON.stringify(obj));
        // alert(stringifiedArr);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPatients();
  }, []);

  // Fetch doctor data from Node.js API
  const [doctorOptions, setDoctorOptions] = useState([]);

  const fetchDoctorData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDoctorData`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const doctors = response.data;

      let options = [];

      if (currentUser.roles.includes("ROLE_ADMIN")) {
        options = doctors.map((doctor) => ({
          value: doctor.id,
          label:
            doctor.FirstName + " " + doctor.MiddleName + " " + doctor.LastName,
          email: doctor.email,
        }));
      } else if (currentUser.roles.includes("ROLE_DOCTOR")) {
        // Find the current user's doctor object using email
        const currentUserDoctor = doctors.find(
          (doctor) => doctor.email === currentUser.email
        );
        if (currentUserDoctor) {
          options = [
            {
              value: currentUserDoctor.id,
              label:
                currentUserDoctor.FirstName +
                " " +
                currentUserDoctor.MiddleName +
                " " +
                currentUserDoctor.LastName,
              email: currentUserDoctor.email,
            },
          ];
        }
      }

      setDoctorOptions(options);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const handleDoctorChange = (selectedOption) => {
    const surgeonName = selectedOption ? selectedOption.label : "";
    const surgeonEmail =
      selectedOption && selectedOption.email ? selectedOption.email : "";
    // alert(surgeonEmail)
    setFormData({
      ...formData,
      surgeonName: selectedOption,
      surgeonEmail: surgeonEmail,
    });
  };

  const reloadCount = localStorage.getItem("reloadCount1");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount1", "1");
  }
  localStorage.setItem("reloadCount2", "0");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePatientChange = (selectedOption) => {
    console.log("selectedOption", selectedOption);
    setFormData({ ...formData, selectedPatient: selectedOption });
  };

  const handlePatientChange2 = (value) => {
    console.log("value :", value);
    setFormData({
      ...formData,
      selectedPatient: value,
      admissionID: value.value.id,
    });
  };

  const handleDateTimeChange2 = (date) => {
    setFormData({ ...formData, otDateTime: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.external === "no") {
        const surgeonName = formData.surgeonName
          ? formData.surgeonName.label
          : "";
        // alert(formData.surgeonEmail)
        formData.surgeonName = surgeonName;
      }
      // return;
      // const originalTime = new Date(); // Set the original time to the current time

      // const updatedTime = new Date(originalTime);
      // updatedTime.setMinutes(originalTime.getMinutes() + duration);
      // formData.duration = duration;
      // alert(updatedTime)
      //  alert(JSON.stringify(formData))
      // Send the form data to the Node.js server
      // alert('OT booking saved successfully!\n\n' + JSON.stringify(formData, null, 2));
      // alert(formData.otDateTime)
      if (!formData.otDateTime) {
        toast.error(t("InvalidBookingDate"), {
          style: { fontSize: "12px" },
        });
        return;
      }

      if (formData.guardianName.length < 6) {
        toast.error(t("PleaseEnterGuardianFullName"), {
          style: { fontSize: "12px" },
        });
        return;
      }

      if (formData.guardianContactNo.length < 10) {
        toast.error(t("InvalidPhoneNumber"), {
          style: { fontSize: "12px" },
        });
        return;
      }

      formData.OTName = selectedOT;

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/OTSchedulePatient`,
        formData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      // Reset the form
      setFormData({
        anesthetistAssistantName: "",
        anesthesia: "",
        scrubNurseName: "",
        remarks: "",
        otAssistantName: "",
        patientName: "",
        guardianName: "",
        guardianContactNo: "",
        procedure: "",
        anesthetistDoctorName: "",
        otDateTime: "",
        diagnosis: "",
        typeOfSurgery: "",
        OTName: "",
        selectedPatient: null,
        surgeonName: "",
        surgeonEmail: "",
        external: "",
      });
      setSelectedOT("");
      handleOTBookingSuccess();
      navigate(`/${extractedPart}/CreateEditOTCalender`);
    } catch (error) {
      // Handle error (optional)
      console.error("Error:", error);
      toast.error("Failed to save OT booking.");
    }
  };

  const handleOTBookingSuccess = () => {
    toast.success(
      t("OTBookingSavedSuccessfully"),
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      },
      {
        style: { fontSize: "12px" },
      }
    );
  };

  const selectedPatient = formData.selectedPatient;
  let firstName = "";
  let lastName = "";

  if (selectedPatient) {
    const nameParts = selectedPatient.label.split("Name:")[1].split(" ");
    firstName = nameParts[0];
    lastName = nameParts[1].replace(/[\(\)]/g, "");
  }
  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    border: "1px solid black",
    fontSize: "12px" /* Adjust the font size as per your requirement */,
    marginTop: "20px",
    backgroundColor: "lightblue",
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "20px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "16px" /* Adjust the font size for <h3> */,
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
    return "Access Denied";
  }
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_DOCTOR")
  ) {
    return "Access Denied";
  }

  return (
    <>
      <div className="container" style={style}>
        <h1
          style={{ textAlign: "center", fontSize: "16px", marginTop: "10px" }}
        >
          {t("BookingOT")} | {firstName} {lastName}
        </h1>
        <br></br>
        <form onSubmit={handleSubmit}>
          <div className="row my-1">
            <div className="col-md-2">
              {" "}
              <strong>
                Select IN/Out patient:
                {/* <span style={{ color: "red", marginLeft: "5px" }}>*</span> */}
              </strong>{" "}
            </div>
            <div className="col-md-4">
              {/* <select className="form-select" onChange={(e)=> setInOutPatient(e.target.value)}>
                <option value={undefined}  key="">Select</option>
                <option value="InPatient" key="">In Patient</option>
                <option value="OutPatient" key="">Out Patient</option>
              </select> */}
              <Select
                onChange={(e) => setInOutPatient(e.value)}
                options={[
                  {
                    value: "InPatient",
                    label: "In Patient",
                  },
                  {
                    value: "OutPatient",
                    label: "Out Patient",
                  },
                ]}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-2">
              {" "}
              <strong>
                {t("PatientName")}:
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </strong>{" "}
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <Select
                  style={{ fontSize: "12px" }}
                  value={formData.selectedPatient}
                  onChange={
                    inOutPatient == "OutPatient"
                      ? handlePatientChange
                      : handlePatientChange2
                  }
                  options={
                    inOutPatient == "OutPatient"
                      ? patients.map((patient) => ({
                          value: patient.id,
                          patientId: `${patient.id}`,
                          patientId: patient.id,
                          patientName: ` ${patient.firstName} ${patient.lastName} `,
                          patientContactNumber: `${patient.phoneNumberP}`,
                          label: `  ${t("Name")}:${patient.firstName} ${
                            patient.lastName
                          }  (${patient.phoneNumberP})`,
                        }))
                      : hospitalBookings.map((patient) => ({
                          value: patient,
                          patientId: `${patient.PatientID}`,
                          patientId: patient.PatientID,
                          patientName: ` ${patient.PatientName} `,
                          patientContactNumber: `${patient.PatientPhoneNo}`,
                          label: `  ${t("Name")}:${patient.PatientName}  (${
                            patient.PatientPhoneNo
                          })`,
                        }))
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder={t("SelectPatient")}
                  required
                />
              </div>
            </div>
            <div className="col-md-2">
              {" "}
              <strong>
                {t("BookingDateTime")}:
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </strong>
            </div>

            <div className="col-md-4" style={{ fontSize: "12px" }}>
              <div className="form-group">
                <DatePicker
                  name="otDateTime"
                  style={{ fontSize: "12px" }}
                  selected={formData.otDateTime}
                  onChange={handleDateTimeChange}
                  showTimeSelect
                  dateFormat="Pp"
                  className="form-control"
                  placeholderText={t("SelectOTDateTime")}
                  required
                  disabled
                />
              </div>
            </div>
          </div>

          <br></br>
          <div className="row">
            <div className="col-md-2">
              <strong>
                {t("BookedBySurgeonName")}:
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </strong>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                {formData.external === "no" ? (
                  <Select
                    required
                    value={formData.surgeonName}
                    onChange={handleDoctorChange}
                    options={doctorOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder={t("SelectSurgeon")}
                  />
                ) : (
                  <input
                    required
                    type="text"
                    style={{ fontSize: "12px" }}
                    name="surgeonName"
                    value={formData.surgeonName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={t("EnterSurgeonName")}
                  />
                )}
              </div>
            </div>
            <div className="col-md-1">
              <strong>{t("External")}</strong>
            </div>
            <div className="col-md-1">
              <div className="form-group">
                <div className="form-check">
                  <input
                    type="radio"
                    name="external"
                    value="yes"
                    onChange={handleChange}
                    className="form-check-input"
                    required
                  />
                  <label className="form-check-label">{t("Yes")}</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    name="external"
                    value="no"
                    onChange={handleChange}
                    className="form-check-input"
                    required
                  />
                  <label className="form-check-label">{t("No")}</label>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <strong>
                {t("DurationOfOTMinutes")}:
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </strong>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <input
                  disabled
                  type="text"
                  name="duration"
                  style={{ fontSize: "12px" }}
                  value={isNaN(formData.duration) ? "" : formData.duration} // Display an empty string if duration is NaN
                  onChange={handleDurationChange}
                  onKeyPress={(e) => {
                    const inputValue = e.target.value + e.key;
                    if (!/^\d+$/.test(inputValue)) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      handleDurationChange(e);
                    }
                  }}
                  className="form-control"
                  placeholder={t("EnterDurationOfOT")}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-2">
              <strong>
                {t("GuardianName")}:
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </strong>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  style={{ fontSize: "12px" }}
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const regex = /^[a-zA-Z\s]*$/;
                    if (regex.test(inputValue)) {
                      handleChange(e);
                    }
                  }}
                  className="form-control"
                  placeholder={t("EnterGuardianName")}
                  required
                />
              </div>
            </div>
            <div className="col-md-2">
              <strong>
                {t("OTName")}:
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </strong>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <select
                  style={{
                    fontSize: "12px",
                  }}
                  name="OTName"
                  required
                  id="OTName"
                  value={selectedOT}
                  onChange={handleOTChange}
                  className="form-control col-4"
                >
                  <option value="">{t("SelectOT")}</option>
                  {otData?.map((item) => (
                    <option key={item.id} value={item.OTName}>
                      {item.OTName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <br></br>
          <div className="row">
            <div className="col-md-2">
              <strong>
                {t("GuardianContactNumber")}:
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </strong>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  style={{ fontSize: "12px" }}
                  name="guardianContactNo"
                  value={formData.guardianContactNo}
                  onChange={handleChange}
                  onKeyPress={(e) => {
                    const inputValue = e.target.value + e.key;
                    if (!/^\d+$/.test(inputValue) || inputValue.length > 10) {
                      e.preventDefault();
                    }
                  }}
                  className="form-control"
                  placeholder={t("EnterGuardianContactNumber")}
                  required
                />
                {formData.guardianContactNo &&
                  formData.guardianContactNo.length < 10 &&
                  formData.guardianContactNo.length > 0 && (
                    <span style={{ color: "red" }}>
                      {t("PleaseEnterAtLeast10Digits")}
                    </span>
                  )}
              </div>
            </div>
            <div className="col-md-2">
              {" "}
              <strong>{t("OTAssistantName")}:</strong>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  style={{ fontSize: "12px" }}
                  name="otAssistantName"
                  value={formData.otAssistantName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={t("EnterOTAssistantName")}
                />
              </div>
            </div>
          </div>

          <br></br>
          <div className="row">
            <div className="col-md-2">
              {" "}
              <strong>
                {t("Procedure")}:
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </strong>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <textarea
                  name="procedure"
                  style={{ fontSize: "12px" }}
                  value={formData.procedure}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={t("EnterProcedure")}
                  required
                />
              </div>
            </div>
            <div className="col-md-2">
              {" "}
              <strong>{t("AnesthetistAssistantName")}:</strong>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  style={{ fontSize: "12px" }}
                  name="anesthetistAssistantName"
                  value={formData.anesthetistAssistantName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={t("EnterAnesthetistAssistantName")}
                />
              </div>
            </div>
          </div>

          <br></br>
          <div className="row">
            <div className="col-md-2">
              <strong>
                {t("Diagnosis")}:
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </strong>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <textarea
                  name="diagnosis"
                  style={{ fontSize: "12px" }}
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={t("EnterDiagnosis")}
                  required
                />
              </div>
            </div>
            <div className="col-md-2">
              {" "}
              <strong>{t("Anesthesia")}:</strong>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  style={{ fontSize: "12px" }}
                  name="anesthesia"
                  value={formData.anesthesia}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={t("EnterAnesthesia")}
                />
              </div>
            </div>
          </div>

          <div className="row"></div>
          <br></br>
          <div className="row">
            <div className="col-md-2">
              {" "}
              <strong>
                {t("TypeOfSurgery")}:
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </strong>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <textarea
                  style={{ fontSize: "12px" }}
                  name="typeOfSurgery"
                  value={formData.typeOfSurgery}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={t("EnterTypeOfSurgery")}
                  required
                />
              </div>
            </div>{" "}
            <div className="col-md-2">
              {" "}
              <strong>{t("ScrubNurseName")}:</strong>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  style={{ fontSize: "12px" }}
                  name="scrubNurseName"
                  value={formData.scrubNurseName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={t("EnterScrubNurseName")}
                />
              </div>
            </div>
          </div>

          {/* <div className="row"></div><br></br> */}
          <div className="row"></div>
          <div className="row"></div>
          <br></br>

          <div className="row">
            <div className="col-md-2">
              {" "}
              <strong>
                {t("Remarks")}:
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </strong>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <textarea
                  name="remarks"
                  style={{ fontSize: "12px" }}
                  value={formData.remarks}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={t("EnterRemarks")}
                  required
                />
              </div>
            </div>

            <div className="col-md-2">
              {" "}
              <strong>{t("AnesthetistDoctorName")}</strong>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  style={{ fontSize: "12px" }}
                  name="anesthetistDoctorName"
                  value={formData.anesthetistDoctorName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={t("EnterAnesthetistDoctorName")}
                />
              </div>
            </div>
          </div>

          <br></br>
          <div className="row"></div>
          <div
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <button
              type="submit"
              style={{
                fontSize: "12px",
                height: "30px",
                marginTop: "10px",
                padding: "4px 5px",
              }}
              className="btn btn-secondary"
            >
              {t("Submit")}
            </button>
            <button
              type="button"
              style={{
                fontSize: "12px",

                marginTop: "10px", // Corrected typo in marginTop
                padding: "4px 5px",
              }}
              className="btn btn-secondary"
              onClick={handleGoBack}
            >
              {t("GoBack")}
            </button>
          </div>
        </form>{" "}
        <br></br>
      </div>
    </>
  );
};

export default OTBookingForm;
