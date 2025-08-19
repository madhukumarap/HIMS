import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const UpdatePatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumberP, setContactNumber] = useState("");
  const [email, setEmailID] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Define the errorMessage state variable

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
        setErrorMessage("Failed to fetch patient data");
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

      alert("Patient updated successfully");
      navigate("/PaitentList");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update patient");
    }
  };
  const currentUser = AuthService.getCurrentUser();
  if (!currentUser) {
    return <h3>You are not logged in</h3>;
  }
  if (currentUser && !currentUser.roles.includes("ROLE_ADMIN")) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return <h2>Admin role is required!</h2>;
    // You can handle the redirection or error message display as per your requirement
  }
  return (
    <Container className="d-flex justify-content-center">
      <div className="w-50">
        <br></br>
        <h2 style={{ textAlign: "center", marginTop: "30px" }}>
          Update contact Details of : {firstName} {lastName}
        </h2>{" "}
        <br></br>
        <Form onSubmit={handleSubmit}>
          <br></br>
          <Form.Group controlId="contactNumber">
            <Form.Label style={{ fontWeight: "bold" }}>
              Contact Number:
            </Form.Label>
            <Form.Control
              required
              type="number"
              value={phoneNumberP}
              onChange={(event) => setContactNumber(event.target.value)}
            />
          </Form.Group>{" "}
          <br></br>
          <Form.Group controlId="emailID">
            <Form.Label style={{ fontWeight: "bold" }}>Email ID:</Form.Label>
            <Form.Control
              type="text"
              value={email}
              onChange={(event) => setEmailID(event.target.value)}
            />
          </Form.Group>
          <br></br>
          <div style={{ textAlign: "center" }}>
            <Button
              style={{ fontSize: "25px", padding: "10px 20px" }}
              variant="secondary"
              type="submit"
            >
              Update
            </Button>
          </div>
          <br></br> <br></br>
        </Form>
      </div>
    </Container>
  );
};

export default UpdatePatientForm;
