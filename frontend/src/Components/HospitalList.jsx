import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import authService from "../services/auth.service";

const HospitalList = () => {
  const currentUser = authService.getCurrentUser();
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [currentActiveUsers, setCurrentActiveUsers] = useState(0);
  const [newLimit, setNewLimit] = useState(0);

  useEffect(() => {
    getAllHospitals();
  }, []);

  useEffect(() => {
    if (editingHospital) {
      fetchActiveUsersCount(editingHospital.id);
      setNewLimit(editingHospital.allowed_users);
    }
  }, [editingHospital]);

  // Check user authorization
  if (!currentUser || !currentUser.roles.includes("ROLE_SUPERADMIN")) {
    return <div className="alert alert-danger">Access Denied</div>;
  }

  const fetchActiveUsersCount = async (hospitalId) => {
    if (!editingHospital?.databaseName) {
      toast.error("Hospital database not identified");
      return;
    }

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

  const handleLimitChange = async () => {
    if (newLimit < 1) {
      toast.error("Limit must be at least 1");
      return;
    }

    try {
      setIsLoading(true);

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

  return (
    <div
      className="container-fluid"
      style={{ fontSize: "12px", padding: "2rem", marginTop: "-3rem" }}
    >
      <header className="text-center mb-3">
        <h2 style={{ fontSize: "18px" }}>Hospitals List</h2>
      </header>
      <>
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
                    <Th>Database Name</Th>
                    <Th>Allowed Users</Th>
                    <Th>Created Date</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {hospitals.length > 0 ? (
                    hospitals.map((hospital, index) => (
                      <Tr key={hospital.id}>
                        <Td>{index + 1}</Td>
                        <Td>{hospital.hospitalName}</Td>
                        <Td>
                          {hospital.hospitalURL
                            ?.split("/")
                            .slice(0, 4)
                            .join("/")}
                        </Td>
                        <Td>{hospital.HospitalGUID}</Td>
                        <Td>{hospital.name}</Td>
                        <Td>{hospital.databaseName}</Td>
                        <Td>{hospital.allowed_users}</Td>
                        <Td>
                          {new Date(hospital.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
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
                  Limit is below current active users {currentActiveUsers}.
                  Extra users will be deactivated automatically.
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
      </>
    </div>
  );
};

export default HospitalList;
