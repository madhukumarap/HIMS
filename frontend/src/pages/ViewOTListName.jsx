import React, { useState, useEffect } from "react";
import { Table, Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import AuthService from "../services/auth.service";
import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import Translation from "../translations/ViewOTListName.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

function OTData() {
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();

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

  const [otData, setOTData] = useState([]);
  const [editingItem, setEditingItem] = useState({});
  const [newItem, setNewItem] = useState({ OTName: "", OTNumber: "" });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchOTData();
  }, []);

  const fetchOTData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/GetOTNameList`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const data = await response.json();
      setOTData(data);
    } catch (error) {
      console.error("Error fetching OT data:", error);
    }
  };

  const [isMobile, setIsMobile] = useState(false);
  // Function to check if the screen size is mobile
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 200);
  };

  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  const handleInputChange = (e, id, field) => {
    const updatedData = otData?.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: e.target.value };
      }
      return item;
    });
    setOTData(updatedData);

    // Update the editingItem if the edited item matches the editingItem's id
    if (editingItem.id === id) {
      setEditingItem({ ...editingItem, [field]: e.target.value });
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = otData.find((item) => item.id === id);
    setEditingItem(itemToEdit);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/UpdateOTNameNumber/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${currentUser?.Token}`,
          },
          body: JSON.stringify(editingItem),
        }
      );

      console.log(response); // Log the response object for debugging

      if (response.ok) {
        fetchOTData();
        toast.success(t("dataSaved"));
      } else {
        console.error("Error updating OT data:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating OT data:", error);
    }
    setEditingItem({});
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm(t("confirmDataDelete"));
      if (!confirmed) {
        return; // If user cancels the deletion, exit the function
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/DeleteOTNameNumber/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      if (response.ok) {
        fetchOTData();
        toast.success(t("successDataDeleted"));
      } else {
        console.error("Error deleting OT data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting OT data:", error);
    }
  };

  // const reloadCount = localStorage.getItem("reloadCount1");
  // if (reloadCount !== "1") {
  //   window.location.reload();
  //   localStorage.setItem("reloadCount1", "1");
  // }
  // localStorage.setItem("reloadCount2", "0");

  const handleCreate = async () => {
    try {
      if (!newItem.OTName) {
        toast.error("Enter OT Name  ", {
          style: { fontSize: "13px" },
        });
        return;
      }
      if (!newItem.OTNumber) {
        toast.error(t("enterOTName"), {
          style: { fontSize: "13px" },
        });
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/OTNameNumberCreate`,
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
        fetchOTData();
        setNewItem({ OTName: "", OTNumber: "" });
        setShowCreateForm(false);
        toast.success(t("successOTCreated"), {
          style: { fontSize: "13px" },
        });
      } else {
        console.error("Error creating OT data:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating OT data:", error);
    }
  };

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  if (!currentUser) {
    return "Access Denied";
  }

  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_OTTECHNICIAN")
  ) {
    // Redirect or show error message when the user is not a doctor
    return "Access Denied";
    // You can handle the redirection or error message display as per your requirement
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
        <h2 style={h1Style}>{t("listOTName")}</h2>
      </header>
      <br />

      {isMobile ? (
        <div className="row">
          {otData?.map((item) => (
            <div className="card mb-3" key={item.id}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title">
                    {t("id")}: {item.id}
                  </h5>
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
                  {t("otName")}:{" "}
                  {editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      name="OTName"
                      value={editingItem.OTName || ""}
                      onChange={(e) => handleInputChange(e, item.id, "OTName")}
                    />
                  ) : (
                    item.OTName
                  )}
                </div>
                <div className="mb-2">
                  {t("otNumber")}:{" "}
                  {editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      name="OTNumber"
                      value={editingItem.OTNumber || ""}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        const filteredValue = enteredValue.replace(
                          /[^0-9]/g,
                          ""
                        );
                        const maxLength = 10;

                        if (filteredValue.length <= maxLength) {
                          handleInputChange(e, item.id, "OTNumber");
                        }
                      }}
                    />
                  ) : (
                    item.OTNumber
                  )}
                </div>
                {t("createdAt")}:{" "}
                {formatDateInSelectedLanguage(new Date(item.createdAt))}
                {editingItem.id === item.id && (
                  <div className="mt-2">
                    <button
                      className="btn btn-primary btn-sm mr-2"
                      onClick={() => handleUpdate(item.id)}
                    >
                      {t("save")}
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setEditingItem({})}
                    >
                      {t("cancel")}
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
                      placeholder={t("otName")}
                      value={newItem.OTName}
                      onChange={(e) =>
                        setNewItem({ ...newItem, OTName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("otNumber")}
                      value={newItem.OTNumber}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        const filteredValue = enteredValue.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setNewItem({ ...newItem, OTNumber: filteredValue });
                      }}
                    />
                  </div>
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleCreate}
                    >
                      {t("create")}
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
          <thead style={{ verticalAlign: "middle", textAlign: "center" }}>
            <tr>
              <th style={{ textAlign: "center" }}>{t("id")}</th>
              <th style={{ textAlign: "center" }}>{t("otName")}</th>
              <th style={{ textAlign: "center" }}>{t("otNumber")}</th>
              <th style={{ textAlign: "center" }}>{t("createdAt")}</th>
              <th style={{ textAlign: "center" }}>{t("actions")}</th>
            </tr>
          </thead>
          <tbody style={{ verticalAlign: "middle", textAlign: "center" }}>
            {otData?.map((item) => (
              <tr key={item.id}>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {item.id}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      name="OTName"
                      value={editingItem.OTName || ""}
                      onChange={(e) => handleInputChange(e, item.id, "OTName")}
                    />
                  ) : (
                    item.OTName
                  )}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      name="OTNumber"
                      style={{ fontSize: "12px" }}
                      value={editingItem.OTNumber || ""}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        const filteredValue = enteredValue.replace(
                          /[^0-9]/g,
                          ""
                        ); // Allow only digits
                        const maxLength = 10; // Set maximum length for the input

                        if (
                          enteredValue === filteredValue &&
                          filteredValue.length <= maxLength
                        ) {
                          handleInputChange(e, item.id, "OTNumber");
                        }
                      }}
                    />
                  ) : (
                    item.OTNumber
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
                    value={newItem.OTName}
                    placeholder={t("otName")}
                    onChange={(e) =>
                      setNewItem({ ...newItem, OTName: e.target.value })
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px" }}
                    value={newItem.OTNumber}
                    placeholder={t("otNumber")}
                    onChange={(e) => {
                      const enteredValue = e.target.value;
                      const filteredValue = enteredValue.replace(/[^0-9]/g, ""); // Allow only numbers
                      const maxLength = 10; // Set maximum length for the input

                      if (filteredValue.length <= maxLength) {
                        setNewItem({ ...newItem, OTNumber: filteredValue });
                      }
                    }}
                  />
                </td>
                <td>-</td>
                <td>
                  <Button
                    style={{ fontSize: "12px" }}
                    variant="secondary"
                    size="lg"
                    onClick={handleCreate}
                  >
                    {t("create")}
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
          {showCreateForm ? t("hideForm") : t("create")}
        </Button>
      </div>
    </div>
  );
}

export default OTData;
