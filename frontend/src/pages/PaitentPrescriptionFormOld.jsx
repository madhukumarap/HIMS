import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col, Container } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";
import Select from "react-select";

function PrescriptionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  //patient details
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState(" ");
  const [lastName, setLastName] = useState("");
  const [phoneNumberP, setPhoneNumberP] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [gender, setGender] = useState("");

  const [food, setFood] = useState("");
  const [image, setImage] = useState(null);

  //docter details
  const [prescriberFirstName, setPrescriberFirstName] = useState("");
  const [prescriberMiddleName, setPrescriberMiddleName] = useState(" ");

  const [prescriberLastName, setPrescriberLastName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [prescriptionId, setPrescriptionId] = useState("");
  const [date, setDate] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState("");
  const [tablets, setTablets] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [weekly, setWeekly] = useState("");
  const [timing, setTiming] = useState("");
  const [dosageAmount, setDosageAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  //   const [socialLifestyle, setSocialLifestyle] = useState('');
  //   const [foodHabits, setFoodHabits] = useState('');

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      height: "40px", // Adjust the height as per your requirement
    }),
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const [smoker, setSmoker] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [remarks, setRemarks] = useState("");
  const [vegetarian, setVegetarian] = useState("");
  const [eggetarian, setEggetarian] = useState("  ");
  const [remarkFood, setRemarkFood] = useState("");

  const handleSmokingChange = (event) => {
    setSmoker(event.target.value);
  };

  const handleDrinkingChange = (event) => {
    setAlcohol(event.target.value);
  };

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const handleVegetarianChange = (event) => {
    setVegetarian(event.target.value);
  };

  const handleEggetarianChange = (event) => {
    setEggetarian(event.target.value);
  };

  const handleRemarkFoodChange = (event) => {
    setRemarkFood(event.target.value);
  };
  // ading timedate

  const [indianTime, setIndianTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const indianTime = now
        .toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        })
        .replace(/:/g, "")
        .replace(/\s/g, "");
      setIndianTime(indianTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const today = new Date(); // creates a new Date object with the current date and time
  const options = { year: "numeric", month: "2-digit", day: "2-digit" }; // date options for formatting
  const parts = new Intl.DateTimeFormat("default", options).formatToParts(
    today
  ); // get the date parts
  const dateid = `${parts[4].value}${parts[0].value}${parts[2].value}`; // concatenate the parts in reverse order

  //paitentDetails prescriptionID
  const [patient, setPatients] = useState({});
  const ID = "P" + patient.id + "/" + dateid + "/" + indianTime;
  const socialLifestyle = smoker + " " + alcohol + " " + remarks;
  const foodHabits = vegetarian + " " + eggetarian + " " + remarkFood;
  const [fetchStatus, setFetchStatus] = useState("");

  const [doctor_Id, setDoctorID] = useState();
  const [mr, setMr] = useState("");

  const [medicineOptions, setMedicineOptions] = useState([]);
  const [isMedicineExternal, setIsMedicineExternal] = useState(true);

  // Fetch medicine data from Node.js API
  const fetchMedicineData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getInventryItems`
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

  useEffect(() => {
    // Fetch patient data from the server when the component mounts
    const fetchPatient = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getoneP/${id}`
        );
        const patient = response.data;
        setPatients(patient);
        setMr(patient.mr);
        setDoctorID(patient.doctor_Id);
        setFirstName(patient.firstName);
        setMiddleName(patient.middleName);
        setLastName(patient.lastName);
        setPhoneNumberP(patient.phoneNumberP);
        setEmail(patient.email);
        setAge(patient.age);
        setWeight(patient.weight);
        setHeight(patient.height);
        setGender(patient.gender);
        setPrescriberFirstName(patient.DFirstName);
        setPrescriberMiddleName(patient.DMiddleName);
        setPrescriberLastName(patient.DLastName);
        setPhoneNo(patient.PhoneNo);
        setRegistrationNo(patient.RegistrationNo);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch patient data");
      }
    };
    fetchPatient();
  }, [id]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    // Check if a file is selected
    if (selectedImage) {
      // Check the file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/svg+xml",
      ];
      const fileType = selectedImage.type;

      if (!allowedTypes.includes(fileType)) {
        // Display an error message or perform any desired action
        alert("Only image files are allowed.");
        return;
      }

      // Set the selected image as the state or perform any desired action
      setImage(selectedImage);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const patientData = {
      patientId: patient.id,
      mr,
      firstName,
      middleName,
      lastName,
      phoneNumberP,
      email,
      gender,
      age,
      weight,
      height,
      prescriberFirstName: prescriberFirstName,
      prescriberMiddleName,
      prescriberLastName,
      registrationNo,
      phoneNo,
      doctor_Id,
    };

    const formdata = new FormData();
    formdata.append("image", image);
    const prescriptionData = {
      patientData,
      prescriptionId: ID,

      socialLifestyle,
      foodHabits,
      medicalHistory,
      allergies,
      clinicalDiagnosis,
      prescribeMedicineQuantity: tablets.length,
      tablets: tablets,
    };

    formdata.append("prescriptionData", JSON.stringify(prescriptionData));

    if (tablets.length > 0) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/newMPrescription`,
          formdata
        );
        // alert("Prescription submitted successfully!");
        toast.success("Prescription submitted successfully", {
          position: toast.POSITION.TOP_END, // Set position to top center
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/PatientList");

        // window.location.reload();
      } catch (error) {
        console.log(error);
        alert("Error submitting prescription.");
        window.location.reload();
      }
    } else {
      //  alert("Please add Medicine in prescription.");
      toast.error("Please add Medicine", {
        style: { fontSize: "13px" },
      });
      return;
    }
    //   // reset the form
    setPrescriberFirstName("");
    setPrescriberMiddleName("");
    setPrescriberLastName("");
    setRegistrationNo("");
    setPhoneNo("");
    setAllergies("");
    setClinicalDiagnosis("");
    setPrescriptionId("");
    setMedicalHistory("");
    setDate("");

    setTablets([]);
  };

  const handleAddTablet = () => {
    // Check if the required fields are not empty
    // Check if the required fields are not empty
    const pattern = /^\d[AZMEN](,\s*\d[AZMEN])*$/;

    // Remove any spaces from the dosageAmount value
    const trimmedDosageAmount = dosageAmount.replace(/\s/g, "");

    // Validate the pattern against the input value
    const isValidInput = pattern.test(trimmedDosageAmount);

    if (!isValidInput) {
      setFetchStatus("success");
      setTimeout(() => {
        setFetchStatus("");
      }, 10000);
      // toast.error("Enter Dosage like this pattern 1M or 2M, or 1M,1E etc...  ", {
      //   style: { fontSize: '12px' },
      // })
      return;
    }

    if (
      medicineName !== "" &&
      quantity > 0 &&
      dosageAmount !== "" &&
      startDate !== "" &&
      food !== "" &&
      weekly !== ""
    ) {
      const newTablet = {
        InventoryitemNameID,
        medicineName: medicineName,
        quantity: quantity,
        dosageAmount: dosageAmount,
        startDate: startDate,
        food: food,
        weekly: weekly,
        timing: timing,
      };

      setTablets([...tablets, newTablet]);

      // Reset the tablet input fields
      setMedicineName("");
      SetInventoryitemNameID(0);
      setQuantity("");
      setStartDate("");
      setFood("");
      setWeekly("");
      setTiming("");
      setDosageAmount("");
    } else {
      // Handle the case where any of the required fields are empty
      toast.error("Medicine All fields are required", {
        style: { fontSize: "13px" },
      });
      // Display an error message or take appropriate action
    }
  };

  const handleRemoveTablet = (index) => {
    const newTablets = [...tablets];
    newTablets.splice(index, 1);
    setTablets(newTablets);
  };

  const currentUser = AuthService.getCurrentUser();
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
    return "Access Denied!";
  }
  if (currentUser && !currentUser.roles.includes("ROLE_DOCTOR")) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return "Access Denied";
    // You can handle the redirection or error message display as per your requirement
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

  const handleDosageChange = (event) => {
    const inputValue = event.target.value;

    setDosageAmount(inputValue);
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  const customStyles = {};

  return (
    <>
      {/* <Container className="mt-4 "> */}
      {/* <div className="center container" style={{ fontSize: '24px', backgroundColor: "#8BC34A", marginTop: "50px", padding: "10px", marginBottom: "20px", textAlign: "center" }}>
        <h2 style={h1Style} >CREATE PRESCRIPTION</h2>
      </div> */}

      <header
        className="header"
        style={{
          fontSize: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>CREATE PRESCRIPTION</h2>
      </header>
      <br></br>

      <form style={style} onSubmit={handleSubmit}>
        <div className="container">
          <h4 style={h2Style}>Patient Details</h4>
          <div style={{ border: "1px solid black", padding: "20px" }}>
            <fieldset>
              <div className="row">
                <div className="row">
                  <div className="col-md-2">
                    <strong>
                      Patient's Name
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </strong>
                  </div>

                  <div className="col-md-1">
                    <div className="form-group">
                      <select
                        required
                        disabled
                        className="form-control"
                        value={mr}
                        style={{ fontSize: "12px" }}
                        onChange={(event) => setMr(event.target.value)}
                      >
                        <option value="">select</option>
                        <option value="Mr">Mr</option>
                        <option value="Mr's">Mr's</option>
                        <option value="Miss">Miss</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      {/* <label>First Name:</label> */}
                      <input
                        disabled
                        type="text"
                        required
                        placeholder="Enter Patient First Name"
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                      />
                      <span className="text-danger">
                        {firstName.length > 0 &&
                          !firstName.match(/[A-Za-z]+/) &&
                          " Number Not allowed"}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      {/* <label>Middle Name:</label> */}
                      <input
                        disabled
                        type="text"
                        placeholder="Enter Patient Middle Name"
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        value={middleName}
                        onChange={(event) => setMiddleName(event.target.value)}
                      />
                      <span className="text-danger">
                        {middleName.length > 0 &&
                          !middleName.match(/[A-Za-z]+/) &&
                          " Number Not allowed"}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      {/* <label>Last Name:</label> */}
                      <input
                        disabled
                        style={{ fontSize: "12px" }}
                        type="text"
                        required
                        placeholder="Enter Patient Last Name"
                        className="form-control"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                      />
                      <span className="text-danger">
                        {lastName.length > 0 &&
                          !lastName.match(/[A-Za-z]+/) &&
                          " Number Not allowed"}
                      </span>
                    </div>
                  </div>
                </div>
                <br></br>
              </div>
              <br></br>
              <div className="row">
                <div className="col-md-2">
                  <strong>
                    {" "}
                    Phone Number
                    <span style={{ color: "red", marginLeft: "5px" }}>
                      *
                    </span>{" "}
                  </strong>{" "}
                </div>

                <div className="col-md-1">
                  <div className="form-group">
                    <select
                      className="form-control"
                      style={{ fontSize: "12px" }}
                      disabled
                    >
                      <option value="91"></option>
                    </select>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    {/* <label>Contact Number:</label> */}
                    <input
                      disabled
                      style={{ fontSize: "12px" }}
                      type="number"
                      required
                      placeholder="Enter Patient Contact Number"
                      className="form-control"
                      value={phoneNumberP}
                      onChange={(event) => setPhoneNumberP(event.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-1">
                  {" "}
                  <strong>Email ID</strong>{" "}
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    {/* <label>Registration Numbar:</label> */}
                    <input
                      disabled
                      style={{ fontSize: "12px" }}
                      type="text"
                      required
                      pattern="[a-z0-9._%+-]+@gmail.com"
                      placeholder="Enter Email Address."
                      className="form-control"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-1">
                  {" "}
                  <strong>
                    Gender
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </strong>{" "}
                </div>
                <div className="col-md-2 form-group">
                  <div>
                    <label className="form-check-inline mr-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        required
                        value="male"
                        checked={gender === "male"}
                        onChange={handleGenderChange}
                        style={{ marginRight: "0.5rem" }}
                      />
                      Male
                    </label>
                    <label className="form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="female"
                        required
                        checked={gender === "female"}
                        onChange={handleGenderChange}
                        style={{ marginRight: "0.5rem" }}
                      />
                      Female
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
            <br></br>
            <div className="row">
              <div className="col-md-1">
                <strong>
                  Age<span style={{ color: "red", marginLeft: "5px" }}>*</span>
                </strong>
              </div>

              <div className="col-md-2">
                <div className="form-group">
                  {/* <label>First Name:</label> */}
                  <input
                    required
                    style={{ fontSize: "12px" }}
                    type="text"
                    placeholder="Enter Patient age"
                    className="form-control"
                    value={age}
                    pattern="[0-9]*"
                    onKeyPress={(event) => {
                      const pattern = /[0-9]/;
                      if (!pattern.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={(event) => setAge(event.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-1">
                <strong>
                  Weight(kg)
                  <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                </strong>
              </div>

              <div className="col-md-2">
                <div className="form-group">
                  {/* <label>First Name:</label> */}
                  <input
                    type="text"
                    required
                    style={{ fontSize: "12px" }}
                    placeholder="Enter weight in Kg"
                    className="form-control"
                    value={weight}
                    pattern="[0-9]*"
                    onKeyPress={(event) => {
                      const pattern = /[0-9]/;
                      if (!pattern.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={(event) => setWeight(event.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-1">
                <strong>
                  Height(cm)
                  <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                </strong>
              </div>

              <div className="col-md-2">
                <div className="form-group">
                  {/* <label>First Name:</label> */}
                  <input
                    type="text"
                    required
                    placeholder="Enter Height in cm"
                    className="form-control"
                    value={height}
                    pattern="[0-9]*"
                    style={{ fontSize: "12px" }}
                    onKeyPress={(event) => {
                      const pattern = /[0-9]/;
                      if (!pattern.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={(event) => setHeight(event.target.value)}
                  />
                </div>
              </div>

              {/* <div className="col-md-3"><strong> <label>Prescription Date:</label></strong></div>
            <div className="col-md-3">
              <div className="form-group">
               
                <input
                  type="date" required
                  className="form-control"
                  value={date} min={new Date().toISOString().split('T')[0]}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
            </div> */}
            </div>
          </div>
          <br></br>
          <h4 style={h2Style}>Doctor Details</h4>
          <div style={{ border: "1px solid black", padding: "20px" }}>
            <fieldset>
              <div className="row">
                <div className="row">
                  <div className="col-md-2">
                    <strong>
                      Doctor's Name
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </strong>
                  </div>

                  <div className="col-md-1">
                    <div className="form-group">
                      <select
                        required
                        disabled
                        style={{ fontSize: "12px" }}
                        className="form-control"
                        // value={weekly}
                        // onChange={(event) => setWeekly(event.target.value)}
                      >
                        <option value="Dr">Dr</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      {/* <label>First Name:</label> */}
                      <input
                        style={{ fontSize: "12px" }}
                        type="text"
                        required
                        placeholder="Enter Docter First Name"
                        className="form-control"
                        value={prescriberFirstName}
                        disabled
                        onChange={(event) =>
                          setPrescriberFirstName(event.target.value)
                        }
                      />
                      <span className="text-danger">
                        {prescriberFirstName.length > 0 &&
                          !prescriberFirstName.match(/[A-Za-z]+/) &&
                          " Number Not allowed"}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      {/* <label>Middle Name:</label> */}
                      <input
                        style={{ fontSize: "12px" }}
                        type="text"
                        placeholder="Enter Docter Middle Name"
                        className="form-control"
                        value={prescriberMiddleName}
                        disabled
                        onChange={(event) =>
                          setPrescriberMiddleName(event.target.value)
                        }
                      />
                      <span className="text-danger">
                        {prescriberMiddleName.length > 0 &&
                          !prescriberMiddleName.match(/[A-Za-z]+/) &&
                          " Number Not allowed"}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      {/* <label>Last Name:</label> */}
                      <input
                        style={{ fontSize: "12px" }}
                        type="text"
                        required
                        placeholder="Enter Docter Last Name"
                        className="form-control"
                        value={prescriberLastName}
                        disabled
                        onChange={(event) =>
                          setPrescriberLastName(event.target.value)
                        }
                      />
                      <span className="text-danger">
                        {prescriberLastName.length > 0 &&
                          !prescriberLastName.match(/[A-Za-z]+/) &&
                          " Number Not allowed"}
                      </span>
                    </div>
                  </div>
                </div>
                <br></br>
              </div>
              <br></br>
              <div className="row">
                <div className="col-md-2">
                  <strong>
                    {" "}
                    Phone{" "}
                    <span style={{ color: "red", marginLeft: "5px" }}>
                      *
                    </span>{" "}
                  </strong>{" "}
                </div>

                <div className="col-md-1">
                  <div className="form-group">
                    <select
                      className="form-control"
                      style={{ fontSize: "12px" }}
                      disabled
                    >
                      <option value="91"></option>
                    </select>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    {/* <label>Contact Number:</label> */}
                    <input
                      style={{ fontSize: "12px" }}
                      type="number"
                      required
                      placeholder="Enter Docter Contact Number"
                      className="form-control"
                      value={phoneNo}
                      disabled
                      onChange={(event) => setPhoneNo(event.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  {" "}
                  <strong>Registration Number</strong>{" "}
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    {/* <label>Registration Numbar:</label> */}
                    <input
                      disabled
                      style={{ fontSize: "12px" }}
                      type="text"
                      required
                      placeholder="Enter Docter Registration No."
                      className="form-control"
                      value={registrationNo}
                      onChange={(event) =>
                        setRegistrationNo(event.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </fieldset>
            <br></br>
            {/* <div className="row">
          <div className="col-md-3"><strong> <label>Prescription Date:</label></strong></div>
            <div className="col-md-3">
              <div className="form-group">
               
                <input
                  type="date" required
                  className="form-control"
                  value={date} min={new Date().toISOString().split('T')[0]}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
            </div>
          </div> */}
          </div>
          <br></br>
          <div style={{ border: "1px solid black", padding: "20px" }}>
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-3 form-group">
                    <h4 style={h2Style}>
                      {" "}
                      Social Lifestyle
                      <span style={{ color: "red", marginLeft: "5px" }}>
                        *
                      </span>{" "}
                    </h4>
                  </div>
                  <div className="col-md-3 form-group">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="smoker"
                        id="smoking-yes"
                        value="Smoker"
                        checked={smoker === "Smoker"}
                        onChange={handleSmokingChange}
                        style={{ marginRight: "0.5rem" }}
                      />
                      <label className="form-check-label" htmlFor="smoking-yes">
                        <strong>Smoker</strong>
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="smoker"
                        id="smoking-no"
                        value="Non Smoker"
                        checked={smoker === "Non Smoker"}
                        onChange={handleSmokingChange}
                      />
                      <label className="form-check-label" htmlFor="smoking-no">
                        <strong>Non Smoker</strong>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 form-group">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="alcohol"
                        id="drinking-yes"
                        value="Alcoholic"
                        checked={alcohol === "Alcoholic"}
                        onChange={handleDrinkingChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="drinking-yes"
                      >
                        <strong>Alcoholic</strong>
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="alcohol"
                        id="drinking-no"
                        value="Non Alcoholic"
                        checked={alcohol === "Non Alcoholic"}
                        onChange={handleDrinkingChange}
                      />
                      <label className="form-check-label" htmlFor="drinking-no">
                        <strong>Non Alcoholic</strong>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 form-group">
                    <strong>
                      {" "}
                      Remarks
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                    <input
                      type="text"
                      required
                      style={{ fontSize: "12px" }}
                      className="form-control"
                      id="remarks"
                      placeholder="Enter remarks"
                      value={remarks}
                      onChange={handleRemarksChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <br></br>
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-3 form-group">
                    <h4 style={h2Style}>
                      {" "}
                      Food Habits{" "}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </h4>
                  </div>

                  <div className="col-md-3 form-group">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="vegetarian"
                        id="vegetarian-yes"
                        value="Vegetarian"
                        checked={vegetarian === "Vegetarian"}
                        onChange={handleVegetarianChange}
                        required
                      />
                      <label
                        className="form-check-label"
                        htmlFor="vegetarian-yes"
                      >
                        <strong>Vegetarian</strong>
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="vegetarian"
                        id="vegetarian-no"
                        value="Non Vegetarian"
                        checked={vegetarian === "Non Vegetarian"}
                        onChange={handleVegetarianChange}
                        required
                      />
                      <label
                        className="form-check-label"
                        htmlFor="vegetarian-no"
                      >
                        <strong>Non Vegetarian</strong>
                      </label>
                    </div>
                  </div>

                  {/* <div className="col-md-3 form-group">

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio" required
                        name="eggetarian"
                        value="Eggetarian"
                        checked={eggetarian === 'Eggetarian'}
                        onChange={handleEggetarianChange}
                      />
                      <strong><label className="form-check-label" htmlFor="drinking-yes">
                        Eggetarian
                      </label> </strong>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio" required
                        name="eggetarian"
                        value="Vegan"
                        checked={eggetarian === 'Vegan'}
                        onChange={handleEggetarianChange}
                      />
                      <strong>  <label className="form-check-label" htmlFor="drinking-no">
                        Vegan
                      </label></strong>
                    </div>
                  </div> */}
                  <div className="col-md-3 form-group">
                    <strong>
                      {" "}
                      Remarks
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                      :
                    </strong>
                    <input
                      type="text"
                      required
                      style={{ fontSize: "12px" }}
                      className="form-control"
                      id="remarks"
                      placeholder="Enter remarks"
                      value={remarkFood}
                      onChange={handleRemarkFoodChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <br></br>

            <h4 style={h2Style}>
              Medical History
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>:
            </h4>
            <textarea
              style={{ fontSize: "12px" }}
              className="form-control col-8 col-mb-3"
              required
              placeholder="Enter Paitent Medical History"
              onChange={(event) => setMedicalHistory(event.target.value)}
              value={medicalHistory}
              name="medicalHistory"
            ></textarea>
            {/* <textarea className="col-8" id="medical-history" name="medical_history"></textarea> */}

            <br></br>

            <h4 style={h2Style}>
              Allergies
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>:
            </h4>
            <textarea
              style={{ fontSize: "12px" }}
              className="form-control col-8 col-md-3"
              required
              placeholder="Enter Patient Allergies"
              onChange={(event) => setAllergies(event.target.value)}
              value={allergies}
              name="medicalHistory"
            ></textarea>
          </div>
          <br></br>
          <h2 style={h2Style}>
            Clinical Diagnosis and Prescription
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </h2>
          <fieldset>
            <div style={{ border: "1px solid black", padding: "10px 20px" }}>
              <br></br>
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="clinicalDiagnosis">
                      <strong>Clinical Diagnosis</strong>
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="imageUpload">
                      <strong>Upload Prescription:</strong>
                    </label>
                    <input
                      style={{ fontSize: "12px" }}
                      type="file"
                      className="form-control-file form-control"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
              <br></br>
              <textarea
                style={{ fontSize: "12px" }}
                className="form-control col-8 col-md-3"
                required
                placeholder="Enter Paitent Clinical Diagnosis "
                onChange={(event) => setClinicalDiagnosis(event.target.value)}
                value={clinicalDiagnosis}
                name="medicalHistory"
              ></textarea>
              <br></br>
              <div className="row">
                <div className="col">
                  <div className="form-group d-flex align-items-center">
                    <label style={{ marginRight: "10px" }}>
                      Add from Inventory:
                    </label>

                    <div
                      style={{ marginRight: "10px", marginTop: "15px" }}
                      className="form-check mr-3"
                    >
                      <input
                        type="radio"
                        id="medicineExternalYes"
                        name="medicineExternal"
                        value="yes"
                        checked={isMedicineExternal}
                        onChange={handleMedicineExternalChange}
                        className="form-check-input"
                      />
                      <label
                        htmlFor="medicineExternalYes"
                        className="form-check-label"
                      >
                        Yes
                      </label>
                    </div>
                    <div
                      style={{ marginRight: "10px", marginTop: "15px" }}
                      className="form-check"
                    >
                      <input
                        type="radio"
                        id="medicineExternalNo"
                        name="medicineExternal"
                        value="no"
                        checked={!isMedicineExternal}
                        onChange={handleMedicineExternalChange}
                        className="form-check-input"
                      />
                      <label
                        htmlFor="medicineExternalNo"
                        className="form-check-label"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <br></br>
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Medicine Name:</label>
                    {isMedicineExternal ? (
                      <Select
                        value={
                          medicineName
                            ? { label: medicineName, value: medicineName }
                            : null
                        }
                        onChange={handleMedicineChange}
                        options={medicineOptions}
                        styles={customStyles}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select medicine  from inventory"
                      />
                    ) : (
                      <input
                        style={{ fontSize: "12px" }}
                        type="text"
                        placeholder="Enter Medicine Name"
                        className="form-control"
                        value={medicineName}
                        onChange={(event) =>
                          setMedicineName(event.target.value)
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    <label>Dosage:</label>
                    <input
                      style={{ fontSize: "12px" }}
                      type="text"
                      placeholder="Enter like 1M, 1A, 1E"
                      className="form-control"
                      value={dosageAmount}
                      onChange={handleDosageChange}
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    <label>Start Date:</label>
                    <input
                      style={{ fontSize: "12px" }}
                      type="date"
                      className="form-control"
                      value={startDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(event) => setStartDate(event.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    <label>Clinical Advice:</label>
                    <input
                      style={{ fontSize: "12px" }}
                      type="text"
                      className="form-control"
                      placeholder="Enter Advice "
                      value={food}
                      onChange={(event) => setFood(event.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    <label>Duration Days:</label>
                    <input
                      type="text"
                      style={{ fontSize: "12px" }}
                      className="form-control"
                      placeholder=" Duration or LifeTime"
                      value={weekly}
                      onChange={(event) => setWeekly(event.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-1">
                  <div className="form-group">
                    <label>Total:</label>
                    <input
                      type="text"
                      style={{ fontSize: "12px" }}
                      placeholder="Enter medicine quantity"
                      className="form-control"
                      value={quantity}
                      pattern="[0-9]*"
                      onKeyPress={(event) => {
                        const pattern = /[0-9]/;
                        if (!pattern.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onChange={(event) => setQuantity(event.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-1">
                  <button
                    style={{
                      fontSize: "12px",
                      backgroundColor: "green",
                      fontSize: "25px",
                      padding: "1px 4px",
                      color: "#fff",
                    }}
                    type="button"
                    className="btn btn-primary bt-sm"
                    onClick={handleAddTablet}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-6">
                  {fetchStatus === "success" && (
                    <p style={{ color: "red" }}>
                      {" "}
                      Enter Dosage like this pattern 1M or 2M, or 1M, 1E
                      etc...(M-morning,A-Afternoon,E-Evening,N-Night){" "}
                    </p>
                  )}
                </div>
              </div>

              <br></br>
              {/* {fetchStatus === 'error' && <p style={{ color: 'red' }}> drug not found</p>} */}
              {/* <div className="row"></div> <br></br> */}
              {/* <div className="col-md-2">
                  <div className="form-group">
                    <label>Timing:</label>
                    <select
                      className="form-control"
                      value={timing}
                      onChange={(event) => setTiming(event.target.value)}
                    >
                      <option value="">select</option>
                      <option value="Every 4 Hour">Every 4 Hour</option>
                      <option value="Morning_Only">Morning_Only</option>
                      <option value="Evening_Only">Evening_Only</option>
                      <option value="Morning_Evening">Morning_Evening</option>
                      <option value="Morning_AfterNoon_Evening">Morning_AfterNoon_Evening</option>
                    </select>
                  </div>
                  <br></br>
                </div> */}

              <br></br>

              <div className="row">
                <div className="col-md-12">
                  {tablets.length > 0 && (
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ textAlign: "center" }}>Medicine Name</th>
                          <th style={{ textAlign: "center" }}>Dosage Amount</th>

                          <th style={{ textAlign: "center" }}>Start Date</th>
                          <th style={{ textAlign: "center" }}>
                            Clinical Advice:
                          </th>
                          <th style={{ textAlign: "center" }}>
                            Duration Days:
                          </th>

                          <th style={{ textAlign: "center" }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tablets.map((tablet, index) => (
                          <tr key={index}>
                            <td>{tablet.medicineName}</td>
                            <td>{tablet.dosageAmount}</td>

                            <td>{tablet.startDate}</td>
                            <td>{tablet.food}</td>
                            <td>{tablet.weekly}</td>

                            <td>{tablet.quantity}</td>

                            <td>
                              <button
                                type="button"
                                style={{ fontSize: "13px" }}
                                className="btn btn-danger"
                                onClick={() => handleRemoveTablet(index)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </fieldset>
          <br></br> <br></br>
          <div style={{ textAlign: "center" }}>
            <button
              style={{ fontSize: "13px", padding: "4px 5px" }}
              type="submit"
              className="btn btn-secondary"
            >
              Submit
            </button>
            <Link to={`/PatientList`}>
              <button
                style={{
                  fontSize: "13px",
                  marginTop: "16px",
                  marginLeft: "20px",
                  padding: "4px 5px",
                }}
                className="btn btn-primary btn-sm"
              >
                Go Back
              </button>
            </Link>
          </div>
        </div>
        <br></br>
      </form>
      {/* </Container> */}
    </>
  );
}
export default PrescriptionForm;
