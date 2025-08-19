import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import AuthService from "../services/auth.service";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import Translation from "../translations/CommissionCodeData.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

function EnterCodeData() {
  const [enterCodeData, setEnterCodeData] = useState([]);
  const [editingItem, setEditingItem] = useState({});
  const [newItem, setNewItem] = useState({ codeType: "", value: "" });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const currentUser = AuthService.getCurrentUser();

  ///

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
    const intervalId = setInterval(initializei18n, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  ///

  useEffect(() => {
    fetchEnterCodeData();
  }, []);

  const fetchEnterCodeData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/GetEnterCodeList`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setEnterCodeData(data);
    } catch (error) {
      console.error("Error fetching Enter Code data:", error);
    }
  };

  const handleInputChange = (e, id, field) => {
    const updatedData = enterCodeData.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: e.target.value };
      }
      return item;
    });
    setEnterCodeData(updatedData);

    if (editingItem.id === id) {
      setEditingItem({ ...editingItem, [field]: e.target.value });
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = enterCodeData.find((item) => item.id === id);
    setEditingItem(itemToEdit);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/UpdateEnterCodeTypeValue/${id}`,
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
        fetchEnterCodeData();
        toast.success(t("messageDataSaved"));
      } else {
        console.error("Error updating Enter Code data:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating Enter Code data:", error);
    }
    setEditingItem({});
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm(t("confirmDataDelete"));
      if (!confirmed) {
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/DeleteEnterCodeTypeValue/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      if (response.ok) {
        fetchEnterCodeData();
        toast.success(t("successDataDelete"));
      } else {
        console.error("Error deleting Enter Code data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting Enter Code data:", error);
    }
  };

  const handleCreate = async () => {
    try {
      if (!newItem.codeType) {
        toast.error(t("enterCodeType"), {
          style: { fontSize: "13px" },
        });
        return;
      }
      if (!newItem.value) {
        toast.error(t("enterValue"), {
          style: { fontSize: "13px" },
        });
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/EnterCodeTypeValueCreate`,
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
        fetchEnterCodeData();
        setNewItem({ codeType: "", value: "" });
        setShowCreateForm(false);
        toast.success(t("successDataCreate"), {
          style: { fontSize: "13px" },
        });
      } else {
        console.error("Error creating Enter Code data:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating Enter Code data:", error);
    }
  };

  if (!currentUser) {
    return t("accessDeniedError");
  }

  if (currentUser && !currentUser.roles.includes("ROLE_ADMIN")) {
    return t("accessDeniedError");
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
        <h2 style={h1Style}>{t("createReferralType")}</h2>
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
              <Th style={{ textAlign: "center" }}>{t("id")}</Th>
              <Th style={{ textAlign: "center" }}>{t("enterCodeType")}</Th>
              <Th style={{ textAlign: "center" }}>{t("value")}</Th>
              <Th style={{ textAlign: "center" }}>{t("createdAt")}</Th>
              <Th style={{ textAlign: "center" }}>{t("actions")}</Th>
            </Tr>
          </Thead>
          <Tbody style={{ verticalAlign: "middle", textAlign: "center" }}>
            {enterCodeData.map((item) => (
              <Tr key={item.id}>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {item.id}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      name="codeType"
                      value={editingItem.codeType || ""}
                      onChange={(e) =>
                        handleInputChange(e, item.id, "codeType")
                      }
                    />
                  ) : (
                    item.codeType
                  )}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      name="value"
                      style={{ fontSize: "12px" }}
                      value={editingItem.value || ""}
                      onChange={(e) => handleInputChange(e, item.id, "value")}
                    />
                  ) : (
                    item.value
                  )}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(new Date(item.createdAt))}
                </Td>
                <Td style={{}}>
                  {editingItem.id === item.id ? (
                    <div
                      style={{
                        display: "flex",

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
                        {t("save")}
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
                        {t("cancel")}
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
                        title={t("edit")}
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
                        title={t("delete")}
                        className="btn btn-secondary mr-2"
                        style={{
                          fontSize: "12px",
                          marginTop: "0px",
                          padding: "4px 5px",
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
                    value={newItem.codeType}
                    placeholder={t("enterCodeType")}
                    onChange={(e) =>
                      setNewItem({ ...newItem, codeType: e.target.value })
                    }
                  />
                </Td>
                <Td>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px" }}
                    value={newItem.value}
                    placeholder={t("enterValue")}
                    onChange={(e) =>
                      setNewItem({ ...newItem, value: e.target.value })
                    }
                  />
                </Td>
                <Td>-</Td>
                <Td>
                  <Button
                    style={{ fontSize: "12px" }}
                    variant="secondary"
                    size="lg"
                    onClick={handleCreate}
                  >
                    {t("create")}
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
          {showCreateForm ? t("hideForm") : t("createNew")}
        </Button>
      </div>
    </div>
  );
}

export default EnterCodeData;
