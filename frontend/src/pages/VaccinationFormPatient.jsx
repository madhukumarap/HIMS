import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import AuthService from "../services/auth.service";

import Translation from "../translations/VaccinationFormPatient.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const VaccinationFormPatient = () => {
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    const initializei18n = () => {
      const resources = {
        en: {
          translation: Translation["en"],
        },
        fr: {
          translation: Translation["fr"],
        },
      };

      const storedLanguage = localStorage.getItem("SelectedLanguage");
      const defaultLanguage = storedLanguage || "en";

      i18n.use(initReactI18next).init({
        resources,
        lng: defaultLanguage,
        fallbackLng: "en",
        interpolation: {
          escapeValue: false,
        },
      });
    };

    initializei18n();
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    motherName: "",
    babyName: "",
    age: "",

    gender: "",
    address: "",
    vaccinationRegNo: "",
    fatherName: "",
    phoneNumber: "",
    ageOption: "",
  });

  const resetForm = () => {
    setFormData({
      motherName: "",
      babyName: "",
      age: "",
      gender: "",
      address: "",
      vaccinationRegNo: "",
      fatherName: "",
      phoneNumber: "",
      ageOption: "",
    });
    setAgeOption("");
  };

  useEffect(() => {
    fetchAllRecords();
  }, []);
  const [isEditMode, setIsEditMode] = useState(false); // State to manage edit mode

  const [ageOption, setAgeOption] = useState("");
  const handlePhoneNumberChange = (event) => {
    const enteredValue = event.target.value;
    const sanitizedValue = enteredValue.replace(/\D/g, ""); // Remove non-digit characters
    const limitedValue = sanitizedValue.slice(0, 10); // Limit the value to 10 digits
    setFormData({ ...formData, phoneNumber: limitedValue });
  };
  const [tableData, setTableData] = useState([]);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isEditing, setIsEditing] = useState(false);

  // Function to handle edit action
  const handleEdit = (data) => {
    setIsEditMode(true);
    setFormData(data);
    setAgeOption(data?.ageOption);
    setIsEditing(true);
    openModal();
  };

  // Function to handle delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/vaccinationPatients/${id}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      // Remove the deleted record from the table
      const updatedTableData = tableData.filter((data) => data.id !== id);
      setTableData(updatedTableData);
      fetchAllRecords();
      toast.success("Record deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record");
    }
  };

  // Function to handle update action
  const handleUpdate = async () => {
    try {
      formData.ageOption = ageOption;
      const hasEmptyFields = Object.values(formData).some((value) => !value);
      if (hasEmptyFields) {
        toast.error("Please fill in all required fields.");
        return;
      }
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/vaccinationPatients/${
          formData.id
        }`,
        formData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      // Perform any necessary update in the tableData state
      toast.success("Record updated successfully");
      closeModal();
      fetchAllRecords();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error("Failed to update record");
    }
  };

  // Function to fetch all records
  const fetchAllRecords = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vaccinationPatients`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };
  const handleSubmit = async () => {
    try {
      // Check for empty or null values in the form data

      formData.ageOption = ageOption;
      const hasEmptyFields = Object.values(formData).some((value) => !value);
      if (hasEmptyFields) {
        toast.error("Please fill in all required fields.");
        return;
      }
      if (formData.phoneNumber.length < 10) {
        toast.error("Please Enter Valid Phone.");
        return;
      }
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/CreateVaccinationPatient`,
        formData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      toast.success("Successfully Saved");
      closeModal();
      fetchAllRecords();
      // Reset form fields after successful submission
      setFormData({
        motherName: "",
        babyName: "",
        age: "",

        gender: "",
        address: "",
        vaccinationRegNo: "",
        fatherName: "",
        phoneNumber: "",
        ageOption: "",
      });
      setAgeOption("");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data. Please try again.");
    }
  };
  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    return "Access Denied";
  }
  return (
    <div>
      <Button
        variant="secondary"
        style={{ fontSize: "12px", padding: "4px 5px" }}
        onClick={openModal}
      >
        {t("createVaccinationPatient")}
      </Button>
      <br></br>
      <header
        className="header"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("vaccinationPatientList")}</h2>
      </header>
      <br></br>
      <Modal size="lg" show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("vaccinationpatientRegister")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="babyName">
                  <Form.Label>
                    {t("babyName")} <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="babyName"
                    placeholder={t("enterBaby'sName")}
                    value={formData.babyName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="motherName">
                  <Form.Label>
                    {t("motherName")} <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="motherName"
                    placeholder={t("enterMother'sName")}
                    value={formData.motherName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>{" "}
            <div className="row">
              <div className="col-4">
                <Form.Group controlId="age">
                  <Form.Label>
                    {t("age")} <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="age"
                    placeholder={t("enterAge")}
                    value={formData.age}
                    onChange={(event) => {
                      const enteredValue = event.target.value;
                      // Remove any non-digit characters from the entered value
                      const sanitizedValue = enteredValue.replace(/\D/g, "");
                      // Limit the value to 10 digits
                      const limitedValue = sanitizedValue.slice(0, 3);
                      // Update the state with the limited value
                      setFormData({ ...formData, age: limitedValue });
                    }}
                  />
                </Form.Group>
              </div>
              <div style={{ marginTop: "35px" }} className="col-2">
                <div className="form-group">
                  <select
                    type="select"
                    className="form-control"
                    style={{ fontSize: "12px" }}
                    value={ageOption}
                    onChange={(event) => setAgeOption(event.target.value)}
                  >
                    <option value="">{t("select")}</option>
                    <option value={t("day")}>{t("day")}</option>
                    <option value={t("month")}>{t("month")}</option>
                    <option value={t("year")}>{t("year")}</option>
                  </select>
                </div>
              </div>
              <div className="col-6">
                {" "}
                <Form.Group controlId="phoneNumber">
                  <Form.Label>
                    {t("phoneNumber")} <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    placeholder={t("enterPhoneNumber")}
                    value={formData.phoneNumber}
                    onChange={handlePhoneNumberChange}
                  />
                </Form.Group>
              </div>
            </div>{" "}
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="gender">
                  <Form.Label>
                    {t("gender")} <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    as="select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">{t("selectGender")}</option>
                    <option value={t("male")}>{t("male")}</option>
                    <option value={t("female")}>{t("female")}</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="address">
                  <Form.Label>
                    {t("address")} <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    placeholder={t("enterAddress")}
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="vaccinationRegNo">
                  <Form.Label>
                    {t("Vacc.Reg.No.")} <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="vaccinationRegNo"
                    placeholder={t("enterVaccinationRegistrationNo")}
                    value={formData.vaccinationRegNo}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="fatherName">
                  <Form.Label>
                    {t("fatherName")} <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fatherName"
                    placeholder={t("enterFather'sName")}
                    value={formData.fatherName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>{" "}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {!isEditMode ? (
            <>
              <Button
                style={{ fontSize: "12px", padding: "4px 5px" }}
                variant="secondary"
                onClick={handleSubmit}
              >
                {t("save")}
              </Button>
              <Button
                style={{ fontSize: "12px", padding: "4px 5px" }}
                variant="secondary"
                onClick={() => {
                  setIsEditMode(false);
                  closeModal();
                }}
              >
                {t("cancel")}
              </Button>
            </>
          ) : (
            <>
              <Button
                style={{ fontSize: "12px", padding: "4px 5px" }}
                variant="secondary"
                onClick={() => {
                  setIsEditMode(false);
                  closeModal();
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                style={{ fontSize: "12px", padding: "4px 5px" }}
                variant="secondary"
                onClick={handleUpdate}
              >
                {t("save")}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      <Table
        style={{ fontSize: "13px" }}
        className="table table-bordered table-striped"
      >
        <Thead>
          <Tr style={{ fontSize: "13px", textAlign: "center" }}>
            <Th style={{ textAlign: "center" }}>
              {t("TmotherName") || "Mother Name"}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("vaccinationPatientTable.babyName")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("vaccinationPatientTable.Age")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("vaccinationPatientTable.Gender")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("vaccinationPatientTable.Address")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("vaccinationPatientTable.VaccRegNo")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("vaccinationPatientTable.FatherName")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("vaccinationPatientTable.Phonenumber")}
            </Th>
            <Th style={{ textAlign: "center" }}>
              {t("vaccinationPatientTable.Action")}
            </Th>
          </Tr>
        </Thead>
        <Tbody style={{ fontSize: "13px", textAlign: "center" }}>
          {tableData.map((data, index) => (
            <Tr key={index}>
              <Td style={{ fontSize: "13px", textAlign: "center" }}>
                {data.motherName}
              </Td>
              <Td style={{ fontSize: "13px", textAlign: "center" }}>
                {data.babyName}
              </Td>
              <Td style={{ fontSize: "13px", textAlign: "center" }}>
                {data.age} {data.ageOption.charAt(0)}
              </Td>
              <Td style={{ fontSize: "13px", textAlign: "center" }}>
                {data.gender}
              </Td>
              <Td style={{ fontSize: "13px", textAlign: "center" }}>
                {data.address}
              </Td>
              <Td style={{ fontSize: "13px", textAlign: "center" }}>
                {data.vaccinationRegNo}
              </Td>
              <Td style={{ fontSize: "13px", textAlign: "center" }}>
                {data.fatherName}
              </Td>
              <Td style={{ fontSize: "13px", textAlign: "center" }}>
                {data.phoneNumber}
              </Td>
              <Td style={{ fontSize: "13px", textAlign: "center" }}>
                {/* Edit Button */}
                <Button
                  style={{ fontSize: "12px", padding: "4px 5px" }}
                  variant="secondary"
                  onClick={() => handleEdit(data)}
                >
                  {t("edit")}
                </Button>{" "}
                {/* Delete Button */}
                <Button
                  style={{ fontSize: "12px", padding: "4px 5px" }}
                  variant="secondary"
                  onClick={() => handleDelete(data.id)}
                >
                  {t("delete")}
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      ;
    </div>
  );
};

export default VaccinationFormPatient;
