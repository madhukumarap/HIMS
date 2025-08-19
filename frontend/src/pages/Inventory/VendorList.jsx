import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const VendorComponentInventory = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [vendor, setVendor] = useState({
    vendorName: "",
    contactAddress: "",
    contactNumber: "",
    panNumber: "",
    vendorCountry: "Afghanistan",
    currencyCode: "",
    bankDetails: "",
    vendorCode: "",
    contactPerson: "",
    email: "",
    creditPeriod: 0,
    govtRegDate: "",
    isActive: true,
    receiveDonation: false,
  });
  const today = new Date().toISOString().split("T")[0];

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);
  ////////////
  const fetchVendors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/AllVendors`
      );
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const handlePhoneNumberChange = (event) => {
    const enteredValue = event.target.value;
    const sanitizedValue = enteredValue.replace(/\D/g, "");
    const limitedValue = sanitizedValue.slice(0, 10);
    setVendor({ ...vendor, contactNumber: limitedValue });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setVendor({ ...vendor, [name]: checked });
  };

  const saveVendor = async () => {
    try {
      if (
        !vendor.vendorName ||
        !vendor.contactAddress ||
        !vendor.contactNumber ||
        !vendor.panNumber ||
        !vendor.bankDetails ||
        !vendor.contactPerson ||
        !vendor.email ||
        !vendor.govtRegDate
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }
      //  alert(JSON.stringify(vendor));
      if (vendor?.contactNumber?.length < 10) {
        toast.error("Please Enter Valid Phone.");
        return;
      }
      if (
        !vendor?.email?.match(
          "^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        ) &&
        vendor?.panNumber.length > 0
      ) {
        toast.error("Enter Valid Email.", {
          style: { fontSize: "13px" },
        });
        return;
      }
      if (vendor?.contactNo?.length < 10) {
        toast.error("Please Enter Valid Phone.");
        return;
      }
      const url = editMode
        ? `${import.meta.env.VITE_API_URL}/api/UpdateVendor/${vendor.id}`
        : `${import.meta.env.VITE_API_URL}/api/CreateVendor`;
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendor),
      });

      if (response.ok) {
        fetchVendors();
        handleCloseModal();
        if (!editMode) {
          toast.success("Vendor created successfully");
        } else {
          toast.success("Vendor updated successfully");
        }
      } else {
        console.error("Failed to save vendor");
      }
    } catch (error) {
      console.error("Error saving vendor:", error);
    }
  };

  const editVendor = (selectedVendor) => {
    const formattedDate = selectedVendor.govtRegDate
      ? selectedVendor.govtRegDate.slice(0, 10)
      : "";

    // Set the formatted date to the vendor state
    setVendor({
      ...selectedVendor,
      govtRegDate: formattedDate,
    });
    setShowModal(true);
    setEditMode(true);
  };

  const deleteVendor = async (vendorId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/deleteVendor/${vendorId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Deleted Vendor successfully");
        fetchVendors();
      } else {
        console.error("Failed to delete vendor");
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  const handleCloseModal = () => {
    setVendor({
      vendorName: "",
      contactAddress: "",
      contactNumber: "",
      panNumber: "",
      vendorCountry: "Afghanistan",
      currencyCode: "",
      bankDetails: "",
      vendorCode: "",
      contactPerson: "",
      email: "",
      creditPeriod: 0,
      govtRegDate: "",
      isActive: true,
      receiveDonation: false,
    });
    setShowModal(false);
    setEditMode(false);
  };

  return (
    <div style={{ fontSize: "13px", padding: "4px 5px" }}>
      {/* Header */}
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>Vendor List</h2>
      </header>
      <br />
      {/* Search and Add Vendor button */}
      <div className="row">
        <div className="col-3">
          <input
            type="text"
            value={searchTerm}
            style={{ fontSize: "12px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by vendor name"
            className="form-control"
          />
        </div>
        <div className="col-3">
          <Button
            variant="secondary"
            style={{ fontSize: "13px", padding: "4px 5px", marginTop: "3px" }}
            onClick={() => setShowModal(true)}
          >
            Add Vendor
          </Button>

          <Button
            style={{ fontSize: "13px", padding: "4px 5px", marginTop: "3px" }}
            variant="secondary"
            onClick={() => {
              navigate("/EditInventory");
            }}
            block
          >
            Go Back
          </Button>
        </div>
      </div>
      <br></br>
      {/* Modal for adding/editing vendor */}
      <Modal size="lg" show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px", padding: "4px 5px" }}>
            {editMode ? "Edit Vendor" : "Add Vendor"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Vendor Name and Contact Address */}
            <Row>
              <Col>
                <Form.Group controlId="vendorName">
                  <Form.Label>
                    Vendor Name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    required
                    name="vendorName"
                    value={vendor.vendorName}
                    onChange={handleInputChange}
                    placeholder="Enter vendor name"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="govtRegDate">
                  <Form.Label>
                    GovtRegDate <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    required
                    name="govtRegDate"
                    value={vendor.govtRegDate}
                    onChange={handleInputChange}
                    max={today}
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Contact Number and PAN Number */}
            <Row>
              <Col>
                <Form.Group controlId="contactNumber">
                  <Form.Label>
                    Contact Number <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    required
                    name="contactNumber"
                    value={vendor.contactNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="Enter contact number"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="panNumber">
                  <Form.Label>
                    PAN Number <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="panNumber"
                    required
                    value={vendor.panNumber}
                    onChange={handleInputChange}
                    placeholder="Enter PAN number"
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Vendor Country and Currency Code */}
            {/* <Row>
              <Col>
                <Form.Group controlId="vendorCountry">
                  <Form.Label>Vendor Country</Form.Label>
                  <Form.Control
                    as="select"
                    name="vendorCountry"
                    value={vendor.vendorCountry}
                    onChange={handleInputChange}
                  >
                  
                    
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="currencyCode">
                  <Form.Label>Currency Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="currencyCode"
                    value={vendor.currencyCode}
                    onChange={handleInputChange}
                    placeholder="Enter currency code"
                  />
                </Form.Group>
              </Col>
            </Row> */}
            {/* Bank Details and Vendor Code */}
            <Row>
              <Col>
                <Form.Group controlId="bankDetails">
                  <Form.Label>
                    Bank Details <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    required
                    name="bankDetails"
                    value={vendor.bankDetails}
                    onChange={handleInputChange}
                    placeholder="Enter bank details"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="contactAddress">
                  <Form.Label>
                    {" "}
                    Address <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    required
                    name="contactAddress"
                    value={vendor.contactAddress}
                    onChange={handleInputChange}
                    placeholder="Enter contact address"
                  />
                </Form.Group>
              </Col>
              {/* <Col>
                <Form.Group controlId="vendorCode">
                  <Form.Label>Vendor Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="vendorCode"
                    value={vendor.vendorCode}
                    onChange={handleInputChange}
                    placeholder="Enter vendor code"
                  />
                </Form.Group>
              </Col> */}
            </Row>
            {/* Contact Person and Email */}
            <Row>
              <Col>
                <Form.Group controlId="contactPerson">
                  <Form.Label>
                    Contact Person <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="contactPerson"
                    value={vendor.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Enter contact person"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="email">
                  <Form.Label>
                    Email <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    required
                    value={vendor.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Credit Period and GovtRegDate */}
            <Row>
              {/* <Col>
                <Form.Group controlId="creditPeriod">
                  <Form.Label>Credit Period (days)</Form.Label>
                  <Form.Control
                    type="number"
                    name="creditPeriod"
                    value={vendor.creditPeriod}
                    onChange={handleInputChange}
                    placeholder="Enter credit period"
                  />
                </Form.Group>
              </Col> */}
            </Row>
            {/* IsActive and Receive Donation */}
            {/* <Row>
              <Col>
                <Form.Group controlId="isActive">
                  <Form.Check
                    type="checkbox"
                    name="isActive"
                    label="Is Active"
                    checked={vendor.isActive}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="receiveDonation">
                  <Form.Check
                    type="checkbox"
                    name="receiveDonation"
                    label="Receive Donation"
                    checked={vendor.receiveDonation}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={saveVendor}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Table to display vendors */}
      <Table
        style={{ textAlign: "center", padding: "4px 5px" }}
        className="table-striped table-bordered table-hover"
      >
        <Thead>
          <Tr>
            {/* Table headers */}
            <Th style={{ textAlign: "center" }}>Vendor Name</Th>
            <Th style={{ textAlign: "center" }}> Address</Th>
            <Th style={{ textAlign: "center" }}>Contact Number</Th>
            <Th style={{ textAlign: "center" }}>PAN Number</Th>

            <Th style={{ textAlign: "center" }}>Bank Details</Th>

            <Th style={{ textAlign: "center" }}>Contact Person</Th>
            <Th style={{ textAlign: "center" }}>Email</Th>

            <Th style={{ textAlign: "center" }}>GovtRegDate</Th>

            <Th style={{ textAlign: "center" }}>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* Map through vendors and display each row */}
          {vendors
            .filter((ven) =>
              ven.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((ven) => (
              <Tr key={ven.id}>
                {/* Table data for each field */}
                <Td style={{ textAlign: "center", withspace: "nowrap" }}>
                  {ven.vendorName}
                </Td>
                <Td style={{ textAlign: "center" }}>{ven.contactAddress}</Td>
                <Td style={{ textAlign: "center", withspace: "nowrap" }}>
                  {ven.contactNumber}
                </Td>
                <Td style={{ textAlign: "center", withspace: "nowrap" }}>
                  {ven.panNumber}
                </Td>

                <Td style={{ textAlign: "center", withspace: "nowrap" }}>
                  {ven.bankDetails}
                </Td>

                <Td style={{ textAlign: "center", withspace: "nowrap" }}>
                  {ven.contactPerson}
                </Td>
                <Td style={{ textAlign: "center", withspace: "nowrap" }}>
                  {ven.email}
                </Td>

                <Td style={{ textAlign: "center", withspace: "nowrap" }}>
                  {formatDate(ven.govtRegDate)}
                </Td>
                {/* <Td>{ven.isActive ? "Yes" : "No"}</Td> */}
                {/* <Td>{ven.receiveDonation ? "Yes" : "No"}</Td>*/}
                <Td style={{ textAlign: "center", withspace: "nowrap" }}>
                  <Button
                    variant="secondary"
                    style={{ textAlign: "center", padding: "4px 5px" }}
                    onClick={() => editVendor(ven)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    style={{ textAlign: "center", padding: "4px 5px" }}
                    onClick={() => deleteVendor(ven.id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default VendorComponentInventory;
