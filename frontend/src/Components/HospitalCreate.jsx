import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Spinner } from "react-bootstrap";
import authService from "../services/auth.service";
import axios from "axios";

const HospitalCreate = ({ onHospitalCreated }) => {
  const currentUser = authService.getCurrentUser();

  const [formData, setFormData] = useState({
    hospitalName: "",
    allowedUsers: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Check user authorization
  if (!currentUser || !currentUser.roles.includes("ROLE_SUPERADMIN")) {
    return <div className="alert alert-danger">Access Denied</div>;
  }

  const validateForm = () => {
    const errors = {};
    if (!formData.hospitalName.trim())
      errors.hospitalName = "Hospital name is required";
    if (
      !formData.allowedUsers ||
      isNaN(formData.allowedUsers) ||
      formData.allowedUsers < 1
    ) {
      errors.allowedUsers = "Please enter a valid number (minimum 1)";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "allowedUsers" ? parseInt(value) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formData.hospitalName.toLowerCase() === "healthcare") {
      toast.error("This clientID is not available!");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/save-hospital-Main`,
        {
          hospitalName: formData.hospitalName,
          currentUrl: window.location.href,
          allowed_users: formData.allowedUsers,
        },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
            MainDatabase: "healthcare",
          },
        }
      );

      toast.success("Hospital created successfully!");
      setFormData({ hospitalName: "", allowedUsers: "" });
      if (onHospitalCreated) onHospitalCreated();
    } catch (error) {
      console.error("Failed to save hospital:", error);
      toast.error(error.response?.data?.message || "Failed to save hospital");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container-fluid"
      style={{ fontSize: "12px", padding: "2rem", marginTop: "-3rem" }}
    >
      <header className="text-center mb-3">
        <h2 style={{ fontSize: "18px" }}>Hospitals Management</h2>
      </header>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div
              className="row align-items-center"
              style={{ marginBottom: "-1.5rem" }}
            >
              <div className="col-md-12 mb-1">
                <h6 className="card-title">Create New Hospital</h6>
              </div>
              <div className="col-md-4 mb-3">
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="hospitalName"
                    placeholder="Enter Hospital Name"
                    className={formErrors.hospitalName ? "is-invalid" : ""}
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                  />
                  {formErrors.hospitalName && (
                    <div className="invalid-feedback">
                      {formErrors.hospitalName}
                    </div>
                  )}
                </Form.Group>
              </div>

              <div className="col-md-3 mb-3">
                <Form.Group>
                  <Form.Control
                    type="number"
                    name="allowedUsers"
                    min="1"
                    placeholder="Allowed Users"
                    className={formErrors.allowedUsers ? "is-invalid" : ""}
                    value={formData.allowedUsers}
                    onChange={handleInputChange}
                  />
                  {formErrors.allowedUsers && (
                    <div className="invalid-feedback">
                      {formErrors.allowedUsers}
                    </div>
                  )}
                </Form.Group>
              </div>

              <div className="col-md-3 mb-4 d-flex align-items-end">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalCreate;
