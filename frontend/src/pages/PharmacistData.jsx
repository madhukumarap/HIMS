import { useNavigate } from "react-router-dom";
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
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import "jspdf-autotable";
import { CSVLink } from "react-csv";

import Translation from "../translations/PharmacistData.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
const currentPath = window.location.pathname;
const matchResult = currentPath.match(/mediai\/([^\/]+)/);
let extractedPart;
if (matchResult && matchResult[1]) {
  extractedPart = matchResult[1];
  console.log(extractedPart);
}
const PharmacistList = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const [pharmacistList, setPharmacistList] = useState([]);
  const [filteredPharmacistList, setFilteredPharmacistList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingPharmacistId, setEditingPharmacistId] = useState(null);
  const [editedPharmacist, setEditedPharmacist] = useState({});

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

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
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

  useEffect(() => {
    fetchPharmacistList();
  }, []);

  const fetchPharmacistList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getPharmacistList`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setPharmacistList(response.data);
      setFilteredPharmacistList(response.data);
    } catch (error) {
      console.log("Error fetching pharmacist list:", error);
    }
  };

  const filterPharmacistList = () => {
    const filteredList = pharmacistList.filter((pharmacist) => {
      const fullName = `${pharmacist.FirstName} ${pharmacist.MiddleName} ${pharmacist.LastName}`;
      const phoneNumber = `${pharmacist.phoneNo}`;
      return (
        fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        phoneNumber.includes(searchText)
      );
    });
    setFilteredPharmacistList(filteredList);
  };

  useEffect(() => {
    filterPharmacistList();
  }, [searchText, phoneNumber]);

  useEffect(() => {
    const filteredList = pharmacistList.filter((pharmacist) => {
      const createdAt = new Date(pharmacist.createdAt);
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
    setFilteredPharmacistList(filteredList);
  }, [startDate, endDate]);

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const handleEdit = (pharmacistId) => {
    setEditingPharmacistId(pharmacistId);
    const pharmacist = pharmacistList.find(
      (pharmacist) => pharmacist.id === pharmacistId
    );
    setEditedPharmacist({ ...pharmacist });
  };

  const handleSave = async (pharmacistId) => {
    try {
      if (editedPharmacist.phoneNo.length < 10) {
        toast.error(t("enterValidPhoneNumber"), {
          style: { fontSize: "13px" },
        });
        return;
      }
      if (
        !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(editedPharmacist.email)
      ) {
        toast.error(t("enterValidEmail"), {
          style: { fontSize: "13px" },
        });
        return;
      }
      // Send a PUT request to update the pharmacist data
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/EditPharmacist/${pharmacistId}`,
        editedPharmacist,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      // Update the pharmacistList state with the updated pharmacist data
      setPharmacistList((prevList) =>
        prevList.map((pharmacist) =>
          pharmacist.id === pharmacistId
            ? { ...pharmacist, ...editedPharmacist }
            : pharmacist
        )
      );

      // Update the filteredPharmacistList state with the updated pharmacist data
      setFilteredPharmacistList((prevList) =>
        prevList.map((pharmacist) =>
          pharmacist.id === pharmacistId
            ? { ...pharmacist, ...editedPharmacist }
            : pharmacist
        )
      );

      // Reset the editing state
      setEditingPharmacistId(null);
      setEditedPharmacist({});

      // Show a success toast message
      toast.success(t("pharmacistUpdatedSuccessfully"), {
        style: { fontSize: "13px" },
      });
    } catch (error) {
      console.log("Error updating pharmacist:", error);
      // Show an error toast message
      toast.error(t("errorUpdatingPharmacist"), {
        style: { fontSize: "13px" },
      });
    }
  };

  const handleCancel = () => {
    setEditingPharmacistId(null);
    setEditedPharmacist({});
  };

  const handleDelete = async (pharmacistId) => {
    const confirmed = window.confirm(
      t("areYouSureYouWantToDeleteThisPharmacist")
    );
    if (confirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/DeletePharmacist/${pharmacistId}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setPharmacistList((prevList) =>
          prevList.filter((pharmacist) => pharmacist.id !== pharmacistId)
        );
        setFilteredPharmacistList((prevList) =>
          prevList.filter((pharmacist) => pharmacist.id !== pharmacistId)
        );
        toast.success(t("pharmacistDeletedSuccessfully"), {
          style: { fontSize: "13px" },
        });
      } catch (error) {
        console.log("Error deleting pharmacist:", error);
      }
    }
  };

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

      filteredPharmacistList.forEach((user, index) => {
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
      doc.save("PharmacistList.pdf");
    } catch (error) {
      console.error(error);
    }
  };

  const downloadCSV = () => {
    if (filteredPharmacistList.length === 0) {
      toast.error(t("noDataToExportAsCSV"));
      return;
    }

    const csvHeaders = Object.keys(filteredPharmacistList[0]);
    const csvValues = filteredPharmacistList.map((row) =>
      csvHeaders.map((key) => row[key])
    );

    const csvContent = [csvHeaders, ...csvValues].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "PharmacistList.csv");
  };
  if (!currentUser) {
    return <h3>{t("youAreNotLoggedIn")}</h3>;
  }

  if (currentUser && !currentUser.roles.includes("ROLE_ADMIN")) {
    return <h2>{t("accessDenied")}</h2>;
  }

  const style = {
    width: "98%",
    height: "100%",
    margin: "0 auto",
    fontSize: "12px",
  };

  const h1Style = {
    fontSize: "16px",
  };

  const h2Style = {
    fontSize: "20px",
  };

  const h3Style = {
    fontSize: "16px",
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  // rest of the code remains the same
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
            navigate(`/${extractedPart}/NurseData`);
          }}
        >
          {t("nurseData")}
        </Button>{" "}
        {/* <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate("/HospitalAdminData");
          }}
        >
          {t("hospitalAdministratorData")}
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
        <h2 style={h1Style}>{t("pharmacistData")}</h2>
      </header>
      <br></br>
      <div className="mb-12">
        <div className="row">
          <div className="col-sm-12 col-md-3 ">
            <div style={{ textAlign: "center" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
                htmlFor="nameInput"
              >
                {t("searchByNameOrPhone")}
              </label>
            </div>
            <input
              style={{ fontSize: "12px" }}
              type="text"
              className="form-control"
              placeholder={t("searchByNameOrPhone")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          {/* <div className="col-sm-12 col-md-1 ">&nbsp;</div> */}

          <div className="col-sm-12 col-md-3">
            <Datepickrange
              onSetDate={handleSetDate}
              onClearDate={handleClearDate}
            />
          </div>
          <div className="col-sm-12 col-md-2 "></div>

          <div className="col-sm-12 col-md-4  d-flex align-items-center justify-content-end">
            <Button
              variant="secondary"
              style={{
                fontSize: "12px",
                marginTop: "10px",
                padding: "4px 5px",
              }}
              onClick={downloadCSV}
            >
              {t("downloadAsCSV")}
            </Button>{" "}
            <Button
              variant="secondary"
              style={{
                fontSize: "12px",
                marginTop: "10px",
                padding: "4px 5px",
              }}
              onClick={fetchDataAndDownloadPDF}
            >
              {t("downloadPDF")}
            </Button>
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
          <Tbody>
            {filteredPharmacistList.map((pharmacist) => (
              <Tr key={pharmacist.id}>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {pharmacist.id}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingPharmacistId === pharmacist.id ? (
                    <div className="row">
                      <div className="col-12 mb-2">
                        <label
                          style={{ fontSize: "12px", marginBottom: "8px" }}
                        >
                          {t("firstName")}
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          style={{ fontSize: "12px" }}
                          placeholder="First Name"
                          value={editedPharmacist.FirstName || ""}
                          onChange={(e) =>
                            setEditedPharmacist({
                              ...editedPharmacist,
                              FirstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-12 mb-2">
                        <label
                          style={{ fontSize: "12px", marginBottom: "8px" }}
                        >
                          {t("middleName")}
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          style={{ fontSize: "12px" }}
                          placeholder="Middle Name"
                          value={editedPharmacist.MiddleName || ""}
                          onChange={(e) =>
                            setEditedPharmacist({
                              ...editedPharmacist,
                              MiddleName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-12 mb-2">
                        <label
                          style={{ fontSize: "12px", marginBottom: "8px" }}
                        >
                          {t("lastName")}
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          style={{ fontSize: "12px" }}
                          placeholder="Last Name"
                          value={editedPharmacist.LastName || ""}
                          onChange={(e) =>
                            setEditedPharmacist({
                              ...editedPharmacist,
                              LastName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    `${pharmacist.FirstName} ${pharmacist.MiddleName} ${pharmacist.LastName}`
                  )}
                </Td>

                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingPharmacistId === pharmacist.id ? (
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: "12px" }}
                      value={editedPharmacist.Address || ""}
                      onChange={(e) =>
                        setEditedPharmacist({
                          ...editedPharmacist,
                          Address: e.target.value,
                        })
                      }
                    />
                  ) : (
                    pharmacist.Address
                  )}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingPharmacistId === pharmacist.id ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ marginRight: "5px" }}></span>
                      <input
                        type="text"
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        value={editedPharmacist.phoneNo || ""}
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*$/;
                          if (input === "" || regex.test(input)) {
                            setEditedPharmacist({
                              ...editedPharmacist,
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
                    `${pharmacist.phoneNo}`
                  )}
                  {editingPharmacistId === pharmacist.id &&
                    editedPharmacist.phoneNo &&
                    editedPharmacist.phoneNo.length < 10 && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {t("phoneNumberMustBeAtLeast10digits")}
                      </span>
                    )}
                </Td>

                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingPharmacistId === pharmacist.id ? (
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        value={editedPharmacist.email || ""}
                        pattern="[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
                        onChange={(e) =>
                          setEditedPharmacist({
                            ...editedPharmacist,
                            email: e.target.value,
                          })
                        }
                      />
                      {!/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(
                        editedPharmacist.email
                      ) && (
                        <span style={{ color: "red" }}>
                          {t("enterAValidEmail")}
                        </span>
                      )}
                    </div>
                  ) : (
                    pharmacist.email
                  )}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {pharmacist.username}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(new Date(pharmacist.createdAt))}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingPharmacistId === pharmacist.id ? (
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
                          style={{ fontSize: "12px", padding: "4px 5px" }}
                          onClick={() => handleSave(pharmacist.id)}
                        >
                          {t("save")}
                        </button>
                        <button
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#777777",
                            padding: "4px 5px",
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
                          onClick={() => handleEdit(pharmacist.id)}
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
                          onClick={() => handleDelete(pharmacist.id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};

export default PharmacistList;
