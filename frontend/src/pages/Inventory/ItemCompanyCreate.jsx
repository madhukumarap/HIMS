import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { toast } from "react-toastify";
const CompanyComponentInventory = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState({
    name: "",
    code: "",
    address: "",
    email: "",
    contactNo: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      // alert();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/AllcompanyItem`
      );
      //  alert(JSON.stringify(response.data));
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };
  const handlePhoneNumberChange = (event) => {
    const enteredValue = event.target.value;
    const sanitizedValue = enteredValue.replace(/\D/g, ""); // Remove non-digit characters
    const limitedValue = sanitizedValue.slice(0, 10); // Limit the value to 10 digits
    setCompany({ ...company, contactNo: limitedValue });
  };

  const saveCompany = async () => {
    try {
      if (company?.contactNo?.length < 10) {
        toast.error("Please Enter Valid Phone.");
        return;
      }
      if (
        !company?.email?.match(
          "^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        ) &&
        company?.email.length > 0
      ) {
        toast.error("Enter Valid Email.", {
          style: { fontSize: "13px" },
        });

        return;
      }
      const url = editMode
        ? `${import.meta.env.VITE_API_URL}/api/UpdatecompanyItem/${company.id}`
        : `${import.meta.env.VITE_API_URL}/api/CreateCompanyItem`; // Replace with your actual API endpoints
      const method = editMode ? "PUT" : "POST";
      //alert(url);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(company),
      });

      if (response.ok) {
        fetchCompanies();
        handleCloseModal();
        if (!editMode) {
          toast.success("Created Successfully");
        } else {
          toast.success("Updated Successfully");
        }
      } else {
        console.error("Failed to save company");
      }
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  const editCompany = (selectedCompany) => {
    setCompany(selectedCompany);
    setShowModal(true);
    setEditMode(true);
  };

  const deleteCompany = async (companyId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/deletecompanyItem/${companyId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchCompanies();
      } else {
        console.error("Failed to delete company");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const handleCloseModal = () => {
    setCompany({
      name: "",
      code: "",
      address: "",
      email: "",
      contactNo: "",
      description: "",
    });
    setShowModal(false);
    setEditMode(false);
  };

  return (
    <div style={{ fontSize: "13px", padding: "4px 5px" }}>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}>Company List</h2>
      </header>
      <br></br>
      <div className="row">
        <div className="col-3">
          <input
            type="text"
            value={searchTerm}
            style={{ fontSize: "12px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company name"
            className="form-control"
          />
        </div>
        <div className="col-3">
          <Button
            variant="secondary"
            style={{ fontSize: "13px", padding: "4px 5px", marginTop: "3px" }}
            onClick={() => setShowModal(true)}
          >
            Create Company
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
      <Modal size="lg" show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px", padding: "4px 5px" }}>
            {editMode ? "Edit Company" : "Create Company"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              style={{ marginTop: "10px" }}
              controlId="formCompanyName"
              className="row"
            >
              <Form.Label column sm={3}>
                Company Name <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="name"
                  value={company.name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                />
              </Col>
            </Form.Group>

            <Form.Group
              style={{ marginTop: "16px" }}
              controlId="formCompanyCode"
              className="row"
            >
              <Form.Label column sm={3}>
                Company Code <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="code"
                  value={company.code}
                  onChange={handleInputChange}
                  placeholder="Enter company code"
                />
              </Col>
            </Form.Group>

            <Form.Group
              style={{ marginTop: "16px" }}
              controlId="formCompanyAddress"
              className="row"
            >
              <Form.Label column sm={3}>
                Address <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="address"
                  value={company.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                />
              </Col>
            </Form.Group>

            <Form.Group
              style={{ marginTop: "16px" }}
              controlId="formCompanyEmail"
              className="row"
            >
              <Form.Label column sm={3}>
                Email <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="email"
                  name="email"
                  value={company.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </Col>
            </Form.Group>

            <Form.Group
              style={{ marginTop: "16px" }}
              controlId="formCompanyContactNo"
              className="row"
            >
              <Form.Label column sm={3}>
                Contact Number <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="contactNo"
                  value={company.contactNo}
                  onChange={handlePhoneNumberChange}
                  placeholder="Enter contact number"
                />
              </Col>
            </Form.Group>

            <Form.Group
              style={{ marginTop: "16px" }}
              controlId="formCompanyDescription"
              className="row"
            >
              <Form.Label column sm={3}>
                Description <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={company.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={saveCompany}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <br></br>
      <br></br>{" "}
      <Table
        style={{ textAlign: "center", padding: "4px 5px" }}
        className="table-striped table-bordered table-hover"
      >
        <Thead>
          <Tr>
            <Th style={{ textAlign: "center" }}>Name</Th>
            <Th style={{ textAlign: "center" }}>Code</Th>
            <Th style={{ textAlign: "center" }}>Address</Th>
            <Th style={{ textAlign: "center" }}>Email</Th>
            <Th style={{ textAlign: "center" }}>Contact No</Th>
            <Th style={{ textAlign: "center" }}>Description</Th>
            <Th style={{ textAlign: "center" }}>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {companies
            .filter((comp) =>
              comp.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((comp) => (
              <Tr key={comp.id}>
                <Td style={{ textAlign: "center" }}>{comp.name}</Td>
                <Td style={{ textAlign: "center" }}>{comp.code}</Td>
                <Td style={{ textAlign: "center" }}>{comp.address}</Td>
                <Td style={{ textAlign: "center" }}>{comp.email}</Td>
                <Td style={{ textAlign: "center" }}>{comp.contactNo}</Td>
                <Td style={{ textAlign: "center" }}>{comp.description}</Td>
                <Td style={{ textAlign: "center" }}>
                  <Button
                    variant="secondary"
                    style={{ textAlign: "center", padding: "4px 5px" }}
                    onClick={() => editCompany(comp)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    style={{ textAlign: "center", padding: "4px 5px" }}
                    onClick={() => deleteCompany(comp.id)}
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

export default CompanyComponentInventory;
