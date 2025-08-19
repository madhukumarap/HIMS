import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import authService from "../services/auth.service";
import Spinner from "react-bootstrap/Spinner";
import { Modal, Button, Form } from "react-bootstrap";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import axios from "axios";

const HospitalForm = () => {
  const currentUser = authService.getCurrentUser();

  // State management
  const [formData, setFormData] = useState({
    hospitalName: "",
    allowedUsers: "",
    contactPersonName: "",
    hospitalEmailId: "",
    contactNumber: ""
  });
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [currentActiveUsers, setCurrentActiveUsers] = useState(0);
  const [newLimit, setNewLimit] = useState(0);

  // Data fetching
  useEffect(() => {
    getAllHospitals();
  }, []);

  useEffect(() => {
    if (editingHospital) {
      fetchActiveUsersCount(editingHospital.id);
      setNewLimit(editingHospital.allowed_users);
    }
  }, [editingHospital]);

  const fetchActiveUsersCount = async (hospitalId) => {
    if (!editingHospital?.databaseName) {
      toast.error("Hospital database not identified");
      return;
    }
    console.log(editingHospital, "data");

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/hospitals/${hospitalId}/active-count`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
            userDatabase: editingHospital.databaseName,
          },
        }
      );
      setCurrentActiveUsers(response.data.count);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired - please login again");
        authService.logout();
      } else {
        toast.error("Failed to fetch active users count");
      }
    }
  };

  const getAllHospitals = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/get-hospitals`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
            MainDatabase: "healthcare",
          },
        }
      );
      setHospitals(response.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      toast.error("Error fetching hospitals data");
    }
  };

  // Form handling
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
    if (!formData.contactPersonName.trim())
      errors.contactPersonName = "Contact person name is required";
    if (!formData.hospitalEmailId.trim())
      errors.hospitalEmailId = "Email ID is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.hospitalEmailId))
      errors.hospitalEmailId = "Please enter a valid email address";
    if (!formData.contactNumber.trim())
      errors.contactNumber = "Contact number is required";
    else if (!/^\d{10,15}$/.test(formData.contactNumber))
      errors.contactNumber = "Please enter a valid contact number (10-15 digits)";

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
          contactPersonName: formData.contactPersonName,
          hospitalEmailId: formData.hospitalEmailId,
          contactNumber: formData.contactNumber
        },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
            MainDatabase: "healthcare",
          },
        }
      );

      toast.success("Hospital created successfully!");
      setFormData({ hospitalName: "", allowedUsers: "", contactPersonName: "", hospitalEmailId: "", contactNumber: "" });
      await getAllHospitals();
    } catch (error) {
      console.error("Failed to save hospital:", error);
      toast.error(error.response?.data?.message || "Failed to save hospital");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimitChange = async () => {
    if (newLimit < 1) {
      toast.error("Limit must be at least 1");
      return;
    }

    try {
      setIsLoading(true);

      // ✅ Step 1: Update allowed_users in main DB first
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/hospitals/${
          editingHospital.id
        }/allowed-users`,
        { allowed_users: newLimit },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
            MainDatabase: "healthcare",
          },
        }
      );

      // ✅ Step 2: Reduce or Extend users in hospital DB
      if (newLimit < editingHospital.allowed_users) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/hospitals/${
            editingHospital.id
          }/reduce-users`,
          { newLimit },
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
              userDatabase: editingHospital.databaseName,
            },
          }
        );

        if (response.data.deactivatedUsers.length > 0) {
          toast.warning(
            `Reduced to ${newLimit}. ${response.data.deactivatedUsers.length} users deactivated`
          );
        } else {
          toast.info("No users needed deactivation");
        }
      } else if (newLimit > editingHospital.allowed_users) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/hospitals/${
            editingHospital.id
          }/extend-users`,
          { newLimit },
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
              userDatabase: editingHospital.databaseName,
            },
          }
        );

        if (response.data.updatedUsers.length > 0) {
          toast.success(
            `Increased to ${newLimit}. ${response.data.updatedUsers.length} users reactivated`
          );
        } else {
          toast.info(`Increased to ${newLimit}. No users needed reactivation`);
        }
      } else {
        toast.success(`Capacity updated to ${newLimit}`);
      }

      await getAllHospitals();
      setShowEditModal(false);
    } catch (error) {
      console.error("Limit change error:", error);
      toast.error(error.response?.data?.error || "Failed to update capacity");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (hospital) => {
    setEditingHospital(hospital);
    setNewLimit(hospital.allowed_users);
    setShowEditModal(true);
  };
  const handleDeleteClick = async (hospital) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${hospital.hospitalName}? This action cannot be undone.`
  );
  
  if (confirmDelete) {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/delete-hospital`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
            'Content-Type': 'application/json'
          },
          data: { // Axios DELETE sends data in the 'data' property
            hospitalId: hospital.id,
            databaseName: hospital.databaseName
          }
        }
      );

      if (response.data.success) {
        // Refresh hospital list or update state
        toast.success(`Hospital ${hospital.hospitalName} deleted successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        alert(`Failed to delete hospital: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Error deleting hospital: ${error.response?.data?.message || error.message}`);
    }
  } else {
    console.log("User cancelled the deletion");
  }
};
  // Check user authorization
  if (!currentUser || !currentUser.roles.includes("ROLE_SUPERADMIN")) {
    return <div className="alert alert-danger">Access Denied</div>;
  }

  return (
    <div
      className="container-fluid"
      style={{ fontSize: "12px", padding: "3rem", marginTop: "-3rem" }}
    >
      <header className="text-center mb-3">
        <h2 style={{ fontSize: "18px" }}>Hospitals Management</h2>
      </header>

      <div className="card mb-3">
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
              <div className="col-md-4 mb-3">
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="contactPersonName"
                    placeholder="Enter Contact Person Name"
                    className={formErrors.contactPersonName ? "is-invalid" : ""}
                    value={formData.contactPersonName}
                    onChange={handleInputChange}
                  />
                  {formErrors.contactPersonName && (
                    <div className="invalid-feedback">
                      {formErrors.contactPersonName}
                    </div>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-4 mb-3">
                <Form.Group>
                  <Form.Control
                    type="email"
                    name="hospitalEmailId"
                    placeholder="Enter Email Id"
                    className={formErrors.hospitalEmailId ? "is-invalid" : ""}
                    value={formData.hospitalEmailId}
                    onChange={handleInputChange}
                  />
                  {formErrors.hospitalEmailId && (
                    <div className="invalid-feedback">
                      {formErrors.hospitalEmailId}
                    </div>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-4 mb-3">
                <Form.Group>
                  <Form.Control
                    type="tel"
                    name="contactNumber"
                    placeholder="Enter Contact Number"
                    className={formErrors.contactNumber ? "is-invalid" : ""}
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                  />
                  {formErrors.contactNumber && (
                    <div className="invalid-feedback">
                      {formErrors.contactNumber}
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

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <Table className="table-striped table-hover table-bordered">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Hospital Name</Th>
                  <Th>Base URL</Th>
                  <Th>GUID</Th>
                  <Th>ClientID</Th>
                  <Th>Contact Person</Th>
                  <Th>Email ID</Th>
                  <Th>Contact Number</Th>
                  <Th>Database Name</Th>
                  <Th>Allowed Users</Th>
                  <Th>Created Date</Th>
                  <Th>Action</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {hospitals.length > 0 ? (
                  hospitals.map((hospital, index) => (
                    <Tr key={hospital.id}>
                      <Td>{index + 1}</Td>
                      <Td>{hospital.hospitalName}</Td>
                      {/* <Td>
                        {hospital.hospitalURL?.split("/").slice(0, 4).join("/")}/{hospital.name}
                      </Td> */}
                      <Td>
                        <a
                          href={`${hospital.hospitalURL?.split("/").slice(0, 4).join("/")}/${hospital.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {hospital.hospitalURL?.split("/").slice(0, 4).join("/")}/{hospital.name}
                        </a>
                      </Td>
                      <Td>{hospital.HospitalGUID}</Td>
                      <Td>{hospital.name}</Td>
                      <Td>{hospital.HospitalUserName}</Td>
                      <Td>{hospital.hospitalEmailId}</Td>
                      <Td>{hospital.phone}</Td>
                      <Td>{hospital.databaseName}</Td>
                      <Td>{hospital.allowed_users}</Td>
                      <Td>
                        {new Date(hospital.createdAt).toLocaleDateString(
                          "en-GB"
                        )}{" "}
                        {/* dd/mm/yyyy format */}
                      </Td>
                      <Td>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEditClick(hospital)}
                          disabled={isLoading}
                          title="Edit user limit"
                        >
                          <FaPencilAlt />
                        </Button>
                      </Td>
                      <Td>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleDeleteClick(hospital)}
                          disabled={isLoading}
                          title="Edit user limit"
                        >
                          <FaTrashAlt  />
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="9" className="text-center">
                      No hospitals found
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        style={{ marginTop: "2rem" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit User Limit for {editingHospital?.hospitalName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Allowed Users</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={newLimit}
              onChange={(e) => setNewLimit(parseInt(e.target.value))}
            />
            <div className="mt-2">
              <small className="text-muted">
                Current active users: {currentActiveUsers}
              </small>
            </div>
            <div className="mt-2">
              <small className="text-muted">
                Current limit: {editingHospital?.allowed_users}
              </small>
            </div>

            {newLimit < currentActiveUsers && (
              <div className="alert alert-warning mt-2 text-center fs-6">
                Limit is below current active users {currentActiveUsers}. Extra
                users will be deactivated automatically.
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleLimitChange}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Update Limit"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HospitalForm;
