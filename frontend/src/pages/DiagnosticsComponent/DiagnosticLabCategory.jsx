import React, { useState, useEffect } from "react";
import { Table, Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import AuthService from "../../services/auth.service";
import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import Translation from "../../translations/DiagnosticLabCategory.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

function LabCategoryManagement() {
  const currentUser = AuthService.getCurrentUser();

  const [labData, setLabData] = useState([]);
  const [editingItem, setEditingItem] = useState({});
  const [newItem, setNewItem] = useState({
    CategoryName: "",
    LabCode: "",
    Status: "Active",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { t } = useTranslation();
  const locales = { enIN, fr };

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
          format: (value, format, lng) => {
            if (isDate(value)) {
              const locale = locales[lng];
              return formatDate(value, format, { locale });
            }
          },
        },
      });
    };

    initializei18n();
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  useEffect(() => {
    fetchLabData();
  }, []);

  const fetchLabData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/GetLabCategoryList`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      const data = await response.json();
      setLabData(data);
    } catch (error) {
      console.error("Error fetching Lab data:", error);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 200);
  };

  useEffect(() => {
    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const handleInputChange = (e, id, field) => {
    const updatedData = labData.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: e.target.value };
      }
      return item;
    });
    setLabData(updatedData);

    if (editingItem.id === id) {
      setEditingItem({ ...editingItem, [field]: e.target.value });
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = labData.find((item) => item.id === id);
    setEditingItem(itemToEdit);
  };

  const handleUpdate = async (id) => {
    try {
      // alert(currentUser?.Token);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/UpdateLabCategory/${id}`,
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
        fetchLabData();
        toast.success(t("Datasavedsuccessfully"));
      } else {
        console.error("Error updating Lab data:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating Lab data:", error);
    }
    setEditingItem({});
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm(t("Areyousureyouwanttodeletethisdata"));
      if (!confirmed) {
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/DeleteLabCategory/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      if (response.ok) {
        fetchLabData();
        toast.success(t("DeleteddataSuccessfully"));
      } else {
        console.error("Error deleting Lab data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting Lab data:", error);
    }
  };

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };
  const handleCreate = async () => {
    try {
      if (!newItem.CategoryName) {
        toast.error(t("EnterCategoryName"), {
          style: { fontSize: "13px" },
        });
        return;
      }
      if (!newItem.LabCode) {
        toast.error(t("EnterLabCode"), {
          style: { fontSize: "13px" },
        });
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/LabCategoryCreate`,
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
        fetchLabData();
        setNewItem({ CategoryName: "", LabCode: "", Status: "Active" });
        setShowCreateForm(false);
        toast.success(t("CreateddataSuccessfully"), {
          style: { fontSize: "13px" },
        });
      } else {
        console.error("Error creating Lab data:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating Lab data:", error);
    }
  };

  if (!currentUser) {
    return "Access Denied";
  }

  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
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
        <h2 style={h1Style}>{t("LabCategoryList")}</h2>
      </header>
      <br />

      {isMobile ? (
        <div className="row">
          {labData.map((item) => (
            <div className="card mb-3" key={item.id}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title">ID: {item.id}</h5>
                  <div>
                    <button
                      className="btn btn-secondary btn-sm mr-2"
                      onClick={() => handleEdit(item.id)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  Category Name:{" "}
                  {editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      name="CategoryName"
                      value={editingItem.CategoryName || ""}
                      onChange={(e) =>
                        handleInputChange(e, item.id, "CategoryName")
                      }
                    />
                  ) : (
                    item.CategoryName
                  )}
                </div>
                <div className="mb-2">
                  Lab Code:{" "}
                  {editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      name="LabCode"
                      value={editingItem.LabCode || ""}
                      onChange={(e) => handleInputChange(e, item.id, "LabCode")}
                    />
                  ) : (
                    item.LabCode
                  )}
                </div>
                <div className="mb-2">
                  Status:{" "}
                  {editingItem.id === item.id ? (
                    <Form.Control
                      as="select"
                      name="Status"
                      value={editingItem.Status || ""}
                      onChange={(e) => handleInputChange(e, item.id, "Status")}
                    >
                      <option value="Active">Active</option>
                      <option value="In-Active">In-Active</option>
                    </Form.Control>
                  ) : (
                    item.Status
                  )}
                </div>
                <div>
                  Created At:{" "}
                  {formatDateInSelectedLanguage(new Date(item.createdAt))}
                </div>
                {editingItem.id === item.id && (
                  <div className="mt-2">
                    <button
                      className="btn btn-primary btn-sm mr-2"
                      onClick={() => handleUpdate(item.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setEditingItem({})}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {showCreateForm && (
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">#</h5>
                  <div className="form-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Category name"
                      value={newItem.CategoryName}
                      onChange={(e) =>
                        setNewItem({ ...newItem, CategoryName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Lab Code"
                      value={newItem.LabCode}
                      onChange={(e) =>
                        setNewItem({ ...newItem, LabCode: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group mb-3">
                    <Form.Control
                      as="select"
                      value={newItem.Status}
                      onChange={(e) =>
                        setNewItem({ ...newItem, Status: e.target.value })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="In-Active">In-Active</option>
                    </Form.Control>
                  </div>
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleCreate}
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Table
          style={{ verticalAlign: "middle", textAlign: "center" }}
          bordered
          striped
          responsive
        >
          <thead>
            <tr>
              <th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("LabCategoryTable.ID")}
              </th>
              <th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("LabCategoryTable.CategoryName")}
              </th>
              <th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("LabCategoryTable.LabCode")}
              </th>
              <th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("LabCategoryTable.Status")}
              </th>
              <th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("LabCategoryTable.CreatedAt")}
              </th>
              <th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("LabCategoryTable.Actions")}
              </th>
            </tr>
          </thead>
          <tbody style={{ verticalAlign: "middle", textAlign: "center" }}>
            {labData.map((item) => (
              <tr key={item.id}>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {item.id}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      name="CategoryName"
                      value={editingItem.CategoryName || ""}
                      onChange={(e) =>
                        handleInputChange(e, item.id, "CategoryName")
                      }
                    />
                  ) : (
                    item.CategoryName
                  )}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      name="LabCode"
                      style={{ fontSize: "12px" }}
                      value={editingItem.LabCode || ""}
                      onChange={(e) => handleInputChange(e, item.id, "LabCode")}
                    />
                  ) : (
                    item.LabCode
                  )}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {editingItem.id === item.id ? (
                    <Form.Control
                      as="select"
                      name="Status"
                      style={{ fontSize: "12px" }}
                      value={editingItem.Status || ""}
                      onChange={(e) => handleInputChange(e, item.id, "Status")}
                    >
                      <option value="Active">{t("Active")}</option>
                      <option value="In-Active">{t("In-Active")}</option>
                    </Form.Control>
                  ) : (
                    item.Status
                  )}
                </td>

                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(new Date(item.createdAt))}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
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
                        {t("LabCategoryTable.save")}
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
                        {t("LabCategoryTable.cancel")}
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
                        title={t("LabCategoryTable.Edit") || "Edit"}
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
                        title={t("LabCategoryTable.Delete") || "Delete"}
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
                </td>
              </tr>
            ))}
            {showCreateForm && (
              <tr>
                <td>#</td>
                <td>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px" }}
                    value={newItem.CategoryName}
                    placeholder={t("EnterCategoryName")}
                    onChange={(e) =>
                      setNewItem({ ...newItem, CategoryName: e.target.value })
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px" }}
                    value={newItem.LabCode}
                    placeholder={t("EnterLabCode")}
                    onChange={(e) =>
                      setNewItem({ ...newItem, LabCode: e.target.value })
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    as="select"
                    style={{ fontSize: "12px" }}
                    value={newItem.Status}
                    onChange={(e) =>
                      setNewItem({ ...newItem, Status: e.target.value })
                    }
                  >
                    <option value="Active">{t("Active")}</option>
                    <option value="In-Active">{t("In-Active")}</option>
                  </Form.Control>
                </td>
                <td>-</td>
                <td>
                  <Button
                    style={{ fontSize: "12px" }}
                    variant="secondary"
                    size="lg"
                    onClick={handleCreate}
                  >
                    {t("LabCategoryTable.create")}
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      <div className="text-center">
        <Button
          variant="secondary"
          size="lg"
          style={{ fontSize: "12px" }}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm
            ? t("LabCategoryTable.HideForm")
            : t("LabCategoryTable.CreateNew")}
        </Button>
      </div>
    </div>
  );
}

export default LabCategoryManagement;
