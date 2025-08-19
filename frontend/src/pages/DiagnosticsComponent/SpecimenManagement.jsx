import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import AuthService from "../../services/auth.service";
import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Translation from "../../translations/SpecimenManagement.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

function SpecimenManagement() {
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
  const [specimenData, setSpecimenData] = useState([]);
  const [editingItem, setEditingItem] = useState({});
  const [newItem, setNewItem] = useState({
    SpecimenName: "",
    SpecimenCode: "",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchSpecimenData();
  }, []);

  const fetchSpecimenData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/GetListOfSpecimens`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setSpecimenData(data);
    } catch (error) {
      console.error("Error fetching Specimen data:", error);
    }
  };

  const handleInputChange = (e, id, field) => {
    const updatedData = specimenData.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: e.target.value };
      }
      return item;
    });
    setSpecimenData(updatedData);

    if (editingItem.id === id) {
      setEditingItem({ ...editingItem, [field]: e.target.value });
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = specimenData.find((item) => item.id === id);
    setEditingItem(itemToEdit);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/UpdateSpecimen/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${currentUser?.Token}`,
          },
          body: JSON.stringify(editingItem),
        }
      );

      if (response.ok) {
        fetchSpecimenData();
        toast.success(t("DataSaved"));
      } else {
        console.error("Error updating Specimen data:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating Specimen data:", error);
    }
    setEditingItem({});
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm(t("AreYouSureYouWanttoDeletethisData"));
      if (!confirmed) {
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/DeleteSpecimen/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      if (response.ok) {
        fetchSpecimenData();
        toast.success(t("DeletedDataSuccessfully"));
      } else {
        console.error("Error deleting Specimen data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting Specimen data:", error);
    }
  };

  const handleCreate = async () => {
    try {
      if (!newItem.SpecimenName) {
        toast.error(t("EnterSpecimenName"), {
          style: { fontSize: "13px" },
        });
        return;
      }
      if (!newItem.SpecimenCode) {
        toast.error(t("EnterSpecimenCode"), {
          style: { fontSize: "13px" },
        });
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/SpecimenCreate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${currentUser?.Token}`,
          },
          body: JSON.stringify(newItem),
        }
      );
      if (response.ok) {
        fetchSpecimenData();
        setNewItem({ SpecimenName: "", SpecimenCode: "" });
        setShowCreateForm(false);
        toast.success(t("CreatedDataSuccessfully"), {
          style: { fontSize: "13px" },
        });
      } else {
        console.error("Error creating Specimen data:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating Specimen data:", error);
    }
  };

  if (!currentUser) {
    return "Access Denied";
  }

  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_PATHOLOGISTADMIN") &&
    !currentUser.roles.includes("ROLE_LABTECHNICIAN")
  ) {
    return "Access Denied";
  }

  const style = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    fontSize: "12px",
  };

  const h1Style = {
    fontSize: "16px",
  };

  return (
    <div style={style} className="container">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("SpecimenList")}</h2>
      </header>
      <br />
      <div className="table-responsive">
        <Table
          className="table-striped table-hover table-bordered"
          style={{ verticalAlign: "middle", textAlign: "center" }}
          bordered
          striped
          responsive
        >
          <Thead style={{ verticalAlign: "middle", textAlign: "center" }}>
            <Tr>
              <Th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("specimenManagementTable.ID")}
              </Th>
              <Th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("specimenManagementTable.SpecimenName")}
              </Th>
              <Th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("specimenManagementTable.SpecimenCode")}
              </Th>
              <Th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("specimenManagementTable.Actions")}
              </Th>
            </Tr>
          </Thead>
          <Tbody style={{ verticalAlign: "middle", textAlign: "center" }}>
            {specimenData.map((item) => (
              <Tr key={item.id}>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {item.id}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      name="SpecimenName"
                      value={editingItem.SpecimenName || ""}
                      onChange={(e) =>
                        handleInputChange(e, item.id, "SpecimenName")
                      }
                    />
                  ) : (
                    item.SpecimenName
                  )}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      name="SpecimenCode"
                      style={{ fontSize: "12px" }}
                      value={editingItem.SpecimenCode || ""}
                      onChange={(e) =>
                        handleInputChange(e, item.id, "SpecimenCode")
                      }
                    />
                  ) : (
                    item.SpecimenCode
                  )}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {editingItem.id === item.id ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <button
                        className="btn btn-primary btn-sm"
                        style={{
                          fontSize: "12px",
                          padding: "4px 5px",
                          marginTop: "0px",
                        }}
                        onClick={() => handleUpdate(item.id)}
                      >
                        {t("specimenManagementTable.Save")}
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{
                          fontSize: "12px",
                          backgroundColor: "#777777",
                          padding: "4px 5px",
                          marginTop: "0px",
                        }}
                        onClick={() => setEditingItem({})}
                      >
                        {t("specimenManagementTable.Cancel")}
                      </button>
                    </div>
                  ) : (
                    <div
                      className="button-group"
                      style={{
                        fontSize: "12px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <button
                        title={t("specimenManagementTable.Edit")}
                        className="btn btn-secondary mr-2"
                        style={{
                          fontSize: "12px",
                          marginTop: "0px",
                          padding: "4px 5px",
                        }}
                        onClick={() => handleEdit(item.id)}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        title={t("specimenManagementTable.Delete")}
                        className="btn btn-secondary mr-2"
                        style={{
                          fontSize: "12px",
                          padding: "4px 5px",
                          marginTop: "0px",
                        }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  )}
                </Td>
              </Tr>
            ))}
            {showCreateForm && (
              <Tr>
                <Td>#</Td>
                <Td>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px" }}
                    value={newItem.SpecimenName}
                    placeholder={t("EnterSpecimenName")}
                    onChange={(e) =>
                      setNewItem({ ...newItem, SpecimenName: e.target.value })
                    }
                  />
                </Td>
                <Td>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px" }}
                    value={newItem.SpecimenCode}
                    placeholder={t("EnterSpecimenCode")}
                    onChange={(e) =>
                      setNewItem({ ...newItem, SpecimenCode: e.target.value })
                    }
                  />
                </Td>
                {/* <Td>-</Td> */}
                <Td>
                  <Button
                    style={{ fontSize: "12px" }}
                    variant="secondary"
                    size="lg"
                    onClick={handleCreate}
                  >
                    {t("CreateNew")}
                  </Button>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </div>
      <br></br>
      <div className="text-center">
        <Button
          variant="secondary"
          size="lg"
          style={{ fontSize: "12px" }}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? t("HideForm") : t("CreateNew")}
        </Button>
      </div>
    </div>
  );
}

export default SpecimenManagement;
