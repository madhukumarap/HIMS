import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Row, Col, Button, Modal } from "react-bootstrap"; // <-- Make sure Modal is imported
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import AuthService from "../services/auth.service";

const CorporatePackageAssignedPatientList = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/getAllCorporatePatientWithHealthPackage`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const filteredData = data.filter((item) => {
    return (
      item.PatientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.PatientPhone.toString().includes(searchQuery)
    );
  });

  const handleDelete = (patientId) => {
    setSelectedPatientId(patientId);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/deletePatientPackageCorporate/${selectedPatientId}`;

    axios
      .delete(url, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        console.log("Patient deleted successfully");
        toast.success("Patient deleted successfully");
        setShowModal(false);
        setSelectedPatientId(null);
        // Fetch updated data after deletion
        axios
          .get(
            `${
              import.meta.env.VITE_API_URL
            }/api/getAllCorporatePatientWithHealthPackage`,
            {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            }
          )
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        toast.error("Failed to delete patient");
        console.error(error);
      });
  };

  return (
    <div
      style={{
        width: "98%",
        height: "100%",
        margin: "0 auto",
        fontSize: "12px",
      }}
    >
      <h1 className="header" style={{ fontSize: "16px" }}>
        Corporate Patient List(Assigned Package)
      </h1>

      <Row>
        <Col sm={6} md={3}>
          <Form.Group controlId="search">
            <Form.Label style={{ fontSize: "12px" }}>
              Search by Name or Phone
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: "12px", marginBottom: "10px" }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Table
        style={{ textAlign: "center", whiteSpace: "nowrap" }}
        striped
        responsive
        bordered
        hover
      >
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>ID</th>
            <th style={{ textAlign: "center" }}>Patient ID</th>
            <th style={{ textAlign: "center" }}>Patient Name</th>{" "}
            <th style={{ textAlign: "center" }}>Patient Phone</th>
            <th style={{ textAlign: "center" }}>Corporate ID</th>
            <th style={{ textAlign: "center" }}>PackageID</th>
            <th style={{ textAlign: "center" }}>Package Name</th>
            <th style={{ textAlign: "center" }}>MRP</th>
            <th style={{ textAlign: "center" }}>Discount</th>
            <th style={{ textAlign: "center" }}>Final Price</th>
            <th style={{ textAlign: "center" }}>Assigned Date</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {item.id}
              </td>

              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {item.PatientID}
              </td>

              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {item.PatientName}
              </td>
              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {item.PatientPhone}
              </td>
              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {item.PatientCorporateID}
              </td>
              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {item.PackageID}
              </td>
              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {item.packageName}
              </td>
              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                ₹ {item.MRPOfPackage}
              </td>
              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {item.discount} %
              </td>
              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {item.finalPrice}
              </td>
              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                {formatDate(item.createdAt)}
              </td>
              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                <Button
                  style={{ fontSize: "12px", padding: "4px,5px" }}
                  variant="secondary"
                  size="lg"
                  onClick={() => handleDelete(item.id)}
                >
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal
        style={{ fontSize: "14px" }}
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this patient?</Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "14px" }}
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button
            style={{ fontSize: "14px" }}
            variant="danger"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CorporatePackageAssignedPatientList;
