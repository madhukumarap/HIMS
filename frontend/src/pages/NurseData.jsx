import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import { OverlayTrigger, Popover } from "react-bootstrap";
import AuthService from "../services/auth.service";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Datepickrange from "./DateRangeCalender";
import { useNavigate } from "react-router-dom";
import Translation from "../translations/PharmacistData.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import "jspdf-autotable";
import { CSVLink } from "react-csv";
const NurseList = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const { t } = useTranslation();
  const locales = { enIN, fr };
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
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
  const [nurseList, setNurseList] = useState([]);
  const [filteredNurseList, setFilteredNurseList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingNurseId, setEditingNurseId] = useState(null);
  const [editedNurse, setEditedNurse] = useState({});

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };
  useEffect(() => {
    fetchNurseList();
  }, []);

  const fetchNurseList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getNurseList`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setNurseList(response.data);
      setFilteredNurseList(response.data);
    } catch (error) {
      console.log("Error fetching nurse list:", error);
    }
  };

  const filterNurseList = () => {
    const filteredList = nurseList.filter((nurse) => {
      const fullName = `${nurse.FirstName} ${nurse.MiddleName} ${nurse.LastName}`;
      const phoneNumber = `${nurse.phoneNo}`;
      return (
        fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        phoneNumber.includes(searchText)
      );
    });
    setFilteredNurseList(filteredList);
  };

  useEffect(() => {
    filterNurseList();
  }, [searchText, phoneNumber]);

  useEffect(() => {
    const filteredList = nurseList.filter((nurse) => {
      const createdAt = new Date(nurse.createdAt);
      const selectedStartDate = startDate ? new Date(startDate) : null;
      const selectedEndDate = endDate ? new Date(endDate) : null;

      if (selectedStartDate && selectedEndDate) {
        return createdAt >= selectedStartDate && createdAt <= selectedEndDate;
      } else if (selectedStartDate) {
        return createdAt >= selectedStartDate;
      } else if (selectedEndDate) {
        return createdAt <= selectedEndDate;
      }
      return true;
    });
    setFilteredNurseList(filteredList);
  }, [startDate, endDate]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = (nurseId) => {
    setEditingNurseId(nurseId);
    const nurse = nurseList.find((nurse) => nurse.id === nurseId);
    setEditedNurse({ ...nurse });
  };

  const handleSave = async (nurseId) => {
    try {
      if (editedNurse.phoneNo.length < 10) {
        toast.error(t("enterValidPhoneNumber"), {
          style: { fontSize: "13px" },
        });
        return;
      }
      if (!/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(editedNurse.email)) {
        toast.error(t("enterValidEmail"), {
          style: { fontSize: "13px" },
        });
        return;
      }
      // Send a PUT request to update the nurse data
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/EditNurseData/${nurseId}`,
        editedNurse,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      // Update the nurseList state with the updated nurse data
      setNurseList((prevList) =>
        prevList.map((nurse) =>
          nurse.id === nurseId ? { ...nurse, ...editedNurse } : nurse
        )
      );

      // Update the filteredNurseList state with the updated nurse data
      setFilteredNurseList((prevList) =>
        prevList.map((nurse) =>
          nurse.id === nurseId ? { ...nurse, ...editedNurse } : nurse
        )
      );

      // Reset the editing state
      setEditingNurseId(null);
      setEditedNurse({});

      // Show a success toast message
      toast.success("Nurse updated successfully", {
        style: { fontSize: "13px" },
      });
    } catch (error) {
      console.log("Error updating nurse:", error);
      // Show an error toast message
      toast.error("Error updating nurse", {
        style: { fontSize: "13px" },
      });
    }
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }
  const handleCancel = () => {
    setEditingNurseId(null);
    setEditedNurse({});
  };

  const handleDelete = async (nurseId) => {
    const confirmed = window.confirm(t("areYouSureYouWantToDeleteThisNurse"));
    if (confirmed) {
      try {
        // Send a delete request to the server to delete the nurse by ID
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/DeleteNurse/${nurseId}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        // Update the nurseList state by removing the deleted nurse
        setNurseList((prevList) =>
          prevList.filter((nurse) => nurse.id !== nurseId)
        );
        // Update the filteredNurseList state as well
        setFilteredNurseList((prevList) =>
          prevList.filter((nurse) => nurse.id !== nurseId)
        );
        toast.success("Nurse deleted successfully", {
          style: { fontSize: "13px" },
        });
      } catch (error) {
        console.log("Error deleting nurse:", error);
      }
    }
  };

  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });

  const fetchDataAndDownloadPDF = async () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Define the table headers
      const headers = [
        "Sr No.",
        "Username",
        "Name",

        "Phone No",
        "Email",
        "Address",
      ];

      const rows = [];

      filteredNurseList.forEach((user, index) => {
        const fullName = ` ${user.FirstName || ""} ${user.MiddleName || ""} ${
          user.LastName || ""
        }`;

        rows.push([
          index + 1,
          user.username || "",
          fullName.trim(),

          `${user.phoneNo || ""}`,
          user.email || "",
          user.Address || "",
        ]);
      });

      // Set the table position and style
      const tableX = 10;
      const tableY = 20;
      const tableOptions = {
        startY: tableY,
        styles: { fontSize: 10 },
        headStyles: { lineWidth: 0.5 },
        bodyStyles: { lineWidth: 0.5 },
        footStyles: { lineWidth: 0.5 },
        margin: { top: 10 },
      };

      // Add the table to the PDF document
      const title = "Nurse List";
      const titleX = doc.internal.pageSize.getWidth() / 2;
      doc.setFontSize(16);
      doc.text(title, titleX, 10, { align: "center" });

      doc.autoTable(headers, rows, tableOptions);

      // Save the PDF document
      doc.save("NurseList.pdf");
    } catch (error) {
      console.error(error);
    }
  };

  const downloadCSV = () => {
    if (filteredNurseList.length === 0) {
      toast.error("No data to export as CSV");
      return;
    }

    const csvHeaders = Object.keys(filteredNurseList[0]);
    const csvValues = filteredNurseList.map((row) =>
      csvHeaders.map((key) => row[key])
    );

    const csvContent = [csvHeaders, ...csvValues].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "NurseList.csv");
  };

  if (!currentUser) {
    return "Access Denied";
  }

  if (currentUser && !currentUser.roles.includes("ROLE_ADMIN")) {
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

  const h2Style = {
    fontSize: "14px",
  };

  const h3Style = {
    fontSize: "16px",
  };
  //////
  return (
    <div style={style} className="container">
      <div style={{ display: "flex", justifyContent: "left" }}>
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/PatientListCounter`);
          }}
        >
          {t("patientData")}
        </Button>{" "}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/DoctorData`);
          }}
        >
          {t("doctorData")}
        </Button>{" "}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate(`/${extractedPart}/PharmacistData`);
          }}
        >
          {t("pharmacistData")}
        </Button>{" "}
        {/* <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate("/HospitalAdminData");
          }}
        >
          Hospital Administrator Data
        </Button> */}
      </div>
      <br></br>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("NurseData")}</h2>
      </header>
      <br></br>
      <div className="mb-12">
        <div className="form-row">
          <div className="input-group">
            <div className="col-3">
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                htmlFor="nameInput"
              >
                {t("searchByNameOrPhone")}
              </label>

              <input
                id="nameInput"
                type="text"
                className="form-control"
                placeholder={t("searchByNameOrPhone")}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ fontSize: "12px" }}
              />
            </div>
            <div className="col-1">&nbsp;</div>

            <div className="col-2">
              <Datepickrange
                onSetDate={handleSetDate}
                onClearDate={handleClearDate}
              />
            </div>
            <div className="col-2"></div>
            <div className="col-4 d-flex align-items-center justify-content-end">
              <Button
                variant="secondary"
                style={{ fontSize: "12px", padding: "4px 5px" }}
                onClick={downloadCSV}
              >
                {t("downloadAsCSV")}
              </Button>{" "}
              <Button
                variant="secondary"
                style={{ fontSize: "12px", padding: "4px 5px" }}
                onClick={fetchDataAndDownloadPDF}
              >
                {t("downloadPDF")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <br></br>
      <div className="table-responsive">
        <Table
          style={{ verticalAlign: "middle", textAlign: "center" }}
          className="table table-hover table-bordered"
        >
          <Thead>
            <Tr>
              <Th style={{ textAlign: "center" }}>
                {t("pharmacistDataTable.id")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("pharmacistDataTable.name")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("pharmacistDataTable.address")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>
                {t("pharmacistDataTable.phoneNumber")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("pharmacistDataTable.email")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("pharmacistDataTable.userName")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>
                {t("pharmacistDataTable.registrationDate")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("pharmacistDataTable.actions")}
              </Th>
            </Tr>
          </Thead>
          <tbody>
            {filteredNurseList.map((nurse) => (
              <Tr key={nurse.id}>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {nurse.id}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingNurseId === nurse.id ? (
                    <div className="row">
                      <div className="col">
                        <input
                          className="form-control"
                          type="text"
                          style={{ fontSize: "12px" }}
                          placeholder="First Name"
                          value={editedNurse.FirstName || ""}
                          onChange={(e) =>
                            setEditedNurse({
                              ...editedNurse,
                              FirstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col">
                        <input
                          className="form-control"
                          type="text"
                          style={{ fontSize: "12px" }}
                          placeholder="Middle Name"
                          value={editedNurse.MiddleName || ""}
                          onChange={(e) =>
                            setEditedNurse({
                              ...editedNurse,
                              MiddleName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col">
                        <input
                          className="form-control"
                          type="text"
                          style={{ fontSize: "12px" }}
                          placeholder="Last Name"
                          value={editedNurse.LastName || ""}
                          onChange={(e) =>
                            setEditedNurse({
                              ...editedNurse,
                              LastName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    `${nurse.FirstName} ${nurse.MiddleName} ${nurse.LastName}`
                  )}
                </Td>

                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingNurseId === nurse.id ? (
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: "12px" }}
                      value={editedNurse.Address || ""}
                      onChange={(e) =>
                        setEditedNurse({
                          ...editedNurse,
                          Address: e.target.value,
                        })
                      }
                    />
                  ) : (
                    nurse.Address
                  )}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingNurseId === nurse.id ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ marginRight: "5px" }}></span>
                      <input
                        type="text"
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        value={editedNurse.phoneNo || ""}
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*$/;
                          if (input === "" || regex.test(input)) {
                            setEditedNurse({
                              ...editedNurse,
                              phoneNo: input,
                            });
                          }
                        }}
                        onKeyDown={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*$/;
                          if (!regex.test(input) && e.keyCode !== 8) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={10}
                      />
                    </div>
                  ) : (
                    `${nurse.phoneNo}`
                  )}
                  {editingNurseId === nurse.id &&
                    editedNurse.phoneNo &&
                    editedNurse.phoneNo.length < 10 && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {t("phoneNumberMustBeAtLeast10digits")}
                      </span>
                    )}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingNurseId === nurse.id ? (
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        style={{ fontSize: "13px" }}
                        value={editedNurse.email || ""}
                        pattern="[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
                        onChange={(e) =>
                          setEditedNurse({
                            ...editedNurse,
                            email: e.target.value,
                          })
                        }
                      />
                      {!/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(
                        editedNurse.email
                      ) && (
                        <span style={{ color: "red" }}>
                          {t("enterAValidEmail")}
                        </span>
                      )}
                    </div>
                  ) : (
                    nurse.email
                  )}
                </Td>

                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {nurse.username}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {formatDate(nurse.createdAt)}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingNurseId === nurse.id ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <button
                          className="btn btn-primary btn-sm"
                          style={{
                            fontSize: "12px",
                            marginTop: "0px",
                            padding: "4px 5px",
                          }}
                          onClick={() => handleSave(nurse.id)}
                        >
                          {t("save")}
                        </button>
                        <button
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#777777",
                            padding: "4px 5px",
                            marginTop: "0px",
                          }}
                          className="btn btn-primary btn-sm"
                          onClick={handleCancel}
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="button-group"
                        style={{
                          display: "flex",
                          marginTop: "0px",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <button
                          title={t("EditData")}
                          className="btn btn-secondary mr-2"
                          style={{
                            fontSize: "12px",
                            marginTop: "0px",
                            padding: "4px 5px",
                          }}
                          onClick={() => handleEdit(nurse.id)}
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          title="Delete"
                          className="btn btn-secondary mr-2"
                          style={{
                            fontSize: "12px",
                            marginTop: "0px",
                            padding: "4px 5px",
                          }}
                          onClick={() => handleDelete(nurse.id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default NurseList;
