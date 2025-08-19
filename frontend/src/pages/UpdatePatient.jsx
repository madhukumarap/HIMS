import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";

const UpdatePatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumberP, setContactNumber] = useState("");
  const [email, setEmailID] = useState("");

  useEffect(() => {
    // Fetch patient data from the server when the component mounts
    const fetchPatient = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getoneP/${id}`
        );
        const patient = response.data;
        setFirstName(patient.firstName);
        setLastName(patient.lastName);
        setContactNumber(patient.phoneNumberP);
        setEmailID(patient.email);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch patient data");
      }
    };
    fetchPatient();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/updatePatient/${id}`,
        {
          firstName,
          lastName,
          phoneNumberP,
          email,
        }
      );

      toast.success("Patient updated successfully", {
        position: toast.POSITION.TOP_CENTER, // Set position to top center
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/PatientListCounter");
    } catch (error) {
      console.error(error);
      alert("Failed to update patient");
    }
  };

  const currentUser = AuthService.getCurrentUser();

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    // If the user is not logged in or does not have the admin role,
    // you can show a message or redirect to another page.
    return <h2>Admin role is required!</h2>;
  }

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "24px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "20px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "16px" /* Adjust the font size for <h3> */,
  };

  return (
    <Container style={style} className="d-flex justify-content-center">
      <div className="w-50">
        <br />
        {/* <h2 style={{ fontSize: '24px', textAlign: 'center', marginTop: '30px' }}>
          Update contact Details of : {firstName} {lastName}
        </h2>{' '}
        <br /> */}
        <header
          className="header"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 style={h1Style}> Update contact Details of :</h2>
        </header>
        <br></br>
        <Form onSubmit={handleSubmit}>
          <br />
          <Form.Group controlId="contactNumber">
            <Form.Label style={{ fontWeight: "bold" }}>
              Contact Number
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>:
            </Form.Label>

            <Form.Group controlId="contactNumber">
              <div className="row">
                <div className="col-md-2">
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
                <div className="col-md-4">
                  <Form.Control
                    required
                    style={{ fontSize: "12px" }}
                    type="text"
                    value={phoneNumberP}
                    onChange={(event) =>
                      setContactNumber(
                        event.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                  />
                </div>
              </div>
            </Form.Group>
          </Form.Group>
          <br />
          <Form.Group controlId="emailID">
            <Form.Label style={{ fontWeight: "bold" }}>Email ID:</Form.Label>
            <Form.Control
              type="text"
              pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
              value={email}
              style={{ fontSize: "12px" }}
              onChange={(event) => setEmailID(event.target.value)}
              className="col-md-2"
            />
          </Form.Group>
          <br />
          <div style={{ textAlign: "center" }}>
            <Button
              style={{ fontSize: "14px", padding: "10px 20px" }}
              variant="secondary"
              type="submit"
            >
              Update
            </Button>
          </div>
          <br /> <br />
        </Form>
      </div>
    </Container>
  );
};

export default UpdatePatientForm;
