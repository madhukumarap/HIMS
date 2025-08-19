import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";

function PrescriptionForm() {
  //  data in  {selectedFirstName}
  const navigate = useNavigate();
  const [myData, setMyData] = useState([]);
  const [selectedFirstName, setSelectedFirstName] = useState(null);
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);

  const handleKeyDown = (event) => {
    if (error && event.key !== "Backspace") {
      event.preventDefault();
    }
  };

  const validateInput = (inputValue) => {
    if (/\d/.test(inputValue)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  const { id } = useParams();

  //patient details
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumberP, setPhoneNumberP] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const handleSubmit2 = (event) => {
    event.preventDefault();

    const patientData = {
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
      FirstName,
      MiddleName,
      LastName,
      PhoneNo,
      RegistrationNo,
      DoctorEmail,
      doctor_Id,
    };

    axios
      .post(`${import.meta.env.VITE_API_URL}/api/paitentRegui`, patientData)
      .then((response) => {
        console.log(response);

        toast.success("Patient Saved successfully", {
          position: toast.POSITION.TOP_END, // Set position to top center
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/PatientListCounter");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [mr, setMr] = useState("");
  const [FirstName, setFirstNameD] = useState("");
  const [MiddleName, setMiddleNameD] = useState("");
  const [LastName, setLastNameD] = useState("");
  const [RegistrationNo, setRegistrationNoD] = useState("");
  const [PhoneNo, setPhoneNoD] = useState("");
  const [DoctorEmail, setDoctorEmail] = useState("");

  //docter details
  const [prescriberFirstName, setPrescriberFirstName] = useState("");
  const [prescriberMiddleName, setPrescriberMiddleName] = useState("");
  const [prescriberLastName, setPrescriberLastName] = useState("");
  const [doctor_Id, setDoctorID] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/getDoctors`)
      .then((res) => res.json())
      .then((data) => setMyData(data));
  }, []);

  const handleFirstNameChange2 = (selectedOption) => {
    if (selectedOption === null) {
      setSelectedFirstName(null);
      setDoctorID("");
      setFirstNameD("");
      setMiddleNameD("");
      setLastNameD("");
      setPhoneNoD("");
      setRegistrationNoD("");
    } else {
      const selectedName = myData.find(
        (name) => name.FirstName === selectedOption.value
      );
      setDoctorID(selectedName.id);
      setFirstNameD(selectedName.FirstName);
      setMiddleNameD(selectedName.MiddleName);
      setLastNameD(selectedName.LastName);
      setPhoneNoD(selectedName.phoneNo);
      setDoctorEmail(selectedName.email);
      setRegistrationNoD(selectedName.registrationNo);
      setSelectedFirstName(selectedOption);
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const validatePhoneNumber = (phoneNumberP) => {
    const phoneNumberRegex = /^[6-9]\d{9}$/; // Regular expression for Indian phone number validation
    setError2(!phoneNumberRegex.test(phoneNumberP));
  };

  const handlePhoneNumberChange = (event) => {
    const enteredValue = event.target.value;
    const sanitizedValue = enteredValue.replace(/\D/g, ""); // Remove non-digit characters
    const limitedValue = sanitizedValue.slice(0, 10); // Limit the value to 10 digits
    setPhoneNumberP(limitedValue);
    validatePhoneNumber(limitedValue);
  };

  const handleBlur = () => {
    if (phoneNumberP.length !== 10) {
      setError2(true);
    }
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
    return <h3>You are not logged in</h3>;
  }
  if (currentUser && !currentUser.roles.includes("ROLE_ADMIN")) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return <h2>Admin role is required!</h2>;
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
    fontSize: "16px" /* Adjust the font size for <h3> */,
  };

  return (
    <>
      <div style={style}>
        {/* <div className="center container" style={{ backgroundColor: "#8BC34A", marginTop: "50px", padding: "10px", marginBottom: "20px", textAlign: "center" }}>
          <h2 style={h1Style}>Patient Registration</h2>
        </div> */}
        <header
          className="header"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 style={h1Style}>Patient Registration</h2>
        </header>
        <br></br>

        <form onSubmit={handleSubmit2}>
          <div className="container">
            <h4 style={h2Style}>Patient Details</h4>
            <div style={{ border: "1px solid black", padding: "20px" }}>
              <fieldset>
                <div className="row">
                  <div className="row">
                    <div className="col-md-2">
                      <strong>
                        Patient's Name
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </strong>
                    </div>

                    <div className="col-md-1">
                      <div className="form-group">
                        <select
                          required
                          className="form-control"
                          style={{ fontSize: "12px" }}
                          value={mr}
                          onChange={(event) => setMr(event.target.value)}
                        >
                          <option value="">select</option>
                          <option value="Mr">Mr</option>
                          {/* <option value="Mr's">Mr's</option> */}
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Ma">Ma</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <input
                          type="text"
                          required
                          style={{ fontSize: "12px" }}
                          placeholder="Enter Patient First Name"
                          className="form-control"
                          value={firstName}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            setFirstName(inputValue);
                            validateInput(inputValue);
                          }}
                          onKeyDown={handleKeyDown}
                        />
                        {error && (
                          <span className="text-danger">
                            Only characters are allowed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <input
                          type="text"
                          style={{ fontSize: "12px" }}
                          placeholder="Enter Patient Middle Name"
                          className="form-control"
                          value={middleName}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            setMiddleName(inputValue);
                            validateInput(inputValue);
                          }}
                          onKeyDown={handleKeyDown}
                        />
                        {error && (
                          <span className="text-danger">
                            Numbers are not allowed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <input
                          type="text"
                          required
                          style={{ fontSize: "12px" }}
                          placeholder="Enter Patient Last Name"
                          className="form-control"
                          value={lastName}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            setLastName(inputValue);
                            validateInput(inputValue);
                          }}
                          onKeyDown={handleKeyDown}
                        />
                        {error && (
                          <span className="text-danger">
                            Numbers are not allowed
                          </span>
                        )}
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
                        <option value=""></option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="text"
                        required
                        style={{ fontSize: "12px" }}
                        placeholder="Enter Patient Contact Number"
                        className="form-control"
                        value={phoneNumberP}
                        onChange={handlePhoneNumberChange}
                        onBlur={handleBlur}
                      />
                      {error2 && (
                        <span className="text-danger">
                          Invalid phone number
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-1">
                    {" "}
                    <strong>Email ID</strong>{" "}
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      {/* <label>Email ID:</label> */}
                      <input
                        style={{ fontSize: "12px" }}
                        type="email"
                        placeholder="Enter Email ID."
                        className="form-control"
                        value={email}
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
                        onChange={(event) => setEmail(event.target.value)}
                      />
                      {!email.match("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}") &&
                        email.length > 0 && (
                          <div className="error-message">
                            Invalid email address
                          </div>
                        )}
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
                          required
                          value="female"
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
                    Age
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </strong>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    {/* <label>First Name:</label> */}
                    <input
                      style={{ fontSize: "12px" }}
                      type="text"
                      required
                      placeholder="Enter Patient age"
                      className="form-control"
                      value={age}
                      onChange={(event) => {
                        const enteredValue = event.target.value;
                        // Remove any non-digit characters from the entered value
                        const sanitizedValue = enteredValue.replace(/\D/g, "");
                        // Limit the value to 10 digits
                        const limitedValue = sanitizedValue.slice(0, 3);
                        // Update the state with the limited value
                        setAge(limitedValue);
                      }}
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
                      style={{ fontSize: "12px" }}
                      type="text"
                      required
                      placeholder="Enter weight in Kg"
                      className="form-control"
                      value={weight}
                      onChange={(event) => {
                        const enteredValue = event.target.value;
                        // Remove any non-digit characters from the entered value
                        const sanitizedValue = enteredValue.replace(/\D/g, "");
                        // Limit the value to 10 digits
                        const limitedValue = sanitizedValue.slice(0, 3);
                        // Update the state with the limited value
                        setWeight(limitedValue);
                      }}
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
                      style={{ fontSize: "12px" }}
                      type="number"
                      required
                      placeholder="Enter Height in cm"
                      className="form-control"
                      value={height}
                      onChange={(event) => {
                        const enteredValue = event.target.value;
                        // Remove any non-digit characters from the entered value
                        const sanitizedValue = enteredValue.replace(/\D/g, "");
                        // Limit the value to 10 digits
                        const limitedValue = sanitizedValue.slice(0, 3);
                        // Update the state with the limited value
                        setHeight(limitedValue);
                      }}
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
            <h5 style={h2Style}>Doctor Details</h5>
            <div style={{ border: "1px solid black", padding: "20px" }}>
              <fieldset>
                <div className="row">
                  <div className="row">
                    <div className="col-md-2">
                      <strong>
                        Doctor's Name
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </strong>
                    </div>

                    <div className="col-md-1">
                      <div className="form-group">
                        <select
                          style={{ fontSize: "12px" }}
                          className="form-control"
                          // value={weekly}
                          // onChange={(event) => setWeekly(event.target.value)}
                        >
                          <option value="Dr">Dr</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        {/* <label>First Name:</label> */}
                        <Container style={style}>
                          <Row>
                            <Col xs={10}>
                              <Select
                                style={{ fontSize: "12px" }}
                                options={[
                                  { value: "Select", label: "-- Select --" },
                                  ...myData.map((name) => ({
                                    value: name.FirstName,
                                    label: `${name.FirstName} ${name.MiddleName} ${name.LastName}`,
                                  })),
                                ]}
                                value={selectedFirstName}
                                onChange={handleFirstNameChange2}
                              />
                            </Col>
                          </Row>
                        </Container>
                      </div>
                    </div>

                    {/* <div className="col-md-3">
                                        <div className="form-group">
                                           
                                            <input
                                                type="text" required placeholder="Enter Docter Middle Name"
                                                className="form-control"
                                                value={MiddleName}
                                                onChange={(event) =>
                                                    setPrescriberMiddleName(event.target.value)
                                                }
                                            />
                                            <span className="text-danger">
                                                {prescriberMiddleName.length > 0 && !prescriberMiddleName.match(/[A-Za-z]+/) &&
                                                    " Number Not allowed"}
                                            </span>
                                        </div>
                                    </div> */}

                    {/* <div className="col-md-3">
                                        <div className="form-group">
                                          
                                            <input
                                                type="text" required placeholder="Enter Docter Last Name"
                                                className="form-control"
                                                value={LastName}
                                                onChange={(event) =>
                                                    setPrescriberLastName(event.target.value)
                                                }
                                            />
                                            <span className="text-danger">
                                                {prescriberLastName.length > 0 && !prescriberLastName.match(/[A-Za-z]+/) &&
                                                    " Number Not allowed"}
                                            </span>
                                        </div>
                                    </div> */}

                    <div className="col-md-2">
                      <strong>
                        {" "}
                        Phone Number
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>{" "}
                      </strong>{" "}
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        {/* <label>Contact Number:</label> */}
                        <input
                          disabled
                          style={{ fontSize: "12px" }}
                          type="number"
                          required
                          placeholder="Enter Doctor Contact Number"
                          className="form-control"
                          value={PhoneNo}
                          onChange={(event) => setPhoneNoD(event.target.value)}
                        />
                      </div>
                    </div>
                  </div>{" "}
                  <br></br>
                  <div className="row">
                    <br></br>
                    <div></div>
                    <div className="col-md-2">
                      {" "}
                      <strong>
                        Registration Number
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </strong>{" "}
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        {/* <label>Registration Numbar:</label> */}
                        <input
                          disabled
                          style={{ fontSize: "12px" }}
                          type="text"
                          required
                          placeholder="Enter Doctor Registration No."
                          className="form-control"
                          value={RegistrationNo}
                          onChange={(event) =>
                            setRegistrationNoD(event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      {" "}
                      <strong>
                        Doctor EmailId
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </strong>{" "}
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        {/* <label>Registration Numbar:</label> */}
                        <input
                          disabled
                          style={{ fontSize: "12px" }}
                          type="text"
                          required
                          placeholder="Enter Doctor Email."
                          className="form-control"
                          value={DoctorEmail}
                          onChange={(event) =>
                            setDoctorEmail(event.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <br></br>
              <div className="row">
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
            <br></br> <br></br>
            <div style={{ textAlign: "center" }}>
              <button
                style={{
                  fontSize: "13px",
                  textAlign: "center",
                  padding: "5px 6px",
                }}
                type="submit"
                className="btn btn-primary bt-sm"
              >
                Register
              </button>
            </div>
          </div>
          <br></br>
        </form>
      </div>
    </>
  );
}
export default PrescriptionForm;
