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
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import "jspdf-autotable";
import { CSVLink } from "react-csv";
const HospitalAdminData = () => {
  const navigate = useNavigate();

  const [hospitalAdminList, setHospitalAdminList] = useState([]);
  const [filteredHospitalAdminList, setFilteredHospitalAdminList] = useState(
    []
  );
  const [searchText, setSearchText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingHospitalAdminId, setEditingHospitalAdminId] = useState(null);
  const [editedHospitalAdmin, setEditedHospitalAdmin] = useState({});

  const currentUser = AuthService.getCurrentUser();

  const handleSetDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
  };
  useEffect(() => {
    fetchHospitalAdminList();
  }, []);

  const fetchHospitalAdminList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getHospitalAdminList`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setHospitalAdminList(response.data);
      setFilteredHospitalAdminList(response.data);
    } catch (error) {
      console.log("Error fetching hospital admin list:", error);
    }
  };

  const filterHospitalAdminList = () => {
    const filteredList = hospitalAdminList.filter((admin) => {
      const fullName = `${admin.firstName} ${admin.middleName} ${admin.lastName}`;
      const phoneNumber = `${admin.phoneNo}`;
      return (
        fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        phoneNumber.includes(searchText)
      );
    });
    setFilteredHospitalAdminList(filteredList);
  };

  useEffect(() => {
    filterHospitalAdminList();
  }, [searchText, phoneNumber]);

  useEffect(() => {
    const filteredList = hospitalAdminList.filter((admin) => {
      const createdAt = new Date(admin.createdAt);
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
    setFilteredHospitalAdminList(filteredList);
  }, [startDate, endDate]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = (adminId) => {
    setEditingHospitalAdminId(adminId);
    const admin = hospitalAdminList.find((admin) => admin.id === adminId);
    setEditedHospitalAdmin({ ...admin });
  };

  const handleSave = async (adminId) => {
    try {
      if (editedHospitalAdmin.phoneNo.length < 10) {
        toast.error("Enter Valid Phone Number", {
          style: { fontSize: "13px" },
        });
        return;
      }
      if (
        !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(editedHospitalAdmin.email)
      ) {
        toast.error("Enter Valid Email", {
          style: { fontSize: "13px" },
        });
        return;
      }
      // Send a PUT request to update the hospital admin data
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/EditHospitalAdminData/${adminId}`,
        editedHospitalAdmin,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      // Update the hospitalAdminList state with the updated admin data
      setHospitalAdminList((prevList) =>
        prevList.map((admin) =>
          admin.id === adminId ? { ...admin, ...editedHospitalAdmin } : admin
        )
      );

      // Update the filteredHospitalAdminList state with the updated admin data
      setFilteredHospitalAdminList((prevList) =>
        prevList.map((admin) =>
          admin.id === adminId ? { ...admin, ...editedHospitalAdmin } : admin
        )
      );

      // Reset the editing state
      setEditingHospitalAdminId(null);
      setEditedHospitalAdmin({});

      // Show a success toast message
      toast.success("Hospital admin updated successfully", {
        style: { fontSize: "13px" },
      });
    } catch (error) {
      console.log("Error updating hospital admin:", error);
      // Show an error toast message
      toast.error("Error updating hospital admin", {
        style: { fontSize: "13px" },
      });
    }
  };

  const handleCancel = () => {
    setEditingHospitalAdminId(null);
    setEditedHospitalAdmin({});
  };

  const handleDelete = async (adminId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hospital admin?"
    );
    if (confirmed) {
      try {
        // Send a delete request to the server to delete the hospital admin by ID
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/DeleteHospitalAdmin/${adminId}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        // Update the hospitalAdminList state by removing the deleted admin
        setHospitalAdminList((prevList) =>
          prevList.filter((admin) => admin.id !== adminId)
        );
        // Update the filteredHospitalAdminList state as well
        setFilteredHospitalAdminList((prevList) =>
          prevList.filter((admin) => admin.id !== adminId)
        );
        toast.success("Hospital admin deleted successfully", {
          style: { fontSize: "13px" },
        });
      } catch (error) {
        console.log("Error deleting hospital admin:", error);
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

      filteredHospitalAdminList.forEach((user, index) => {
        const fullName = ` ${user.firstName || ""} ${user.middleName || ""} ${
          user.lastName || ""
        }`;

        rows.push([
          index + 1,
          user.username || "",
          fullName.trim(),

          `${user.phoneNo || ""}`,
          user.email || "",
          user.address || "",
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
      const title = "Hospital Administrator List";
      const titleX = doc.internal.pageSize.getWidth() / 2;
      doc.setFontSize(16);
      doc.text(title, titleX, 10, { align: "center" });

      doc.autoTable(headers, rows, tableOptions);

      // Save the PDF document
      doc.save("HospitalAdminList.pdf");
    } catch (error) {
      console.error(error);
    }
  };

  const downloadCSV = () => {
    if (filteredHospitalAdminList.length === 0) {
      toast.error("No data to export as CSV");
      return;
    }

    const csvHeaders = Object.keys(filteredHospitalAdminList[0]);
    const csvValues = filteredHospitalAdminList.map((row) =>
      csvHeaders.map((key) => row[key])
    );

    const csvContent = [csvHeaders, ...csvValues].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "HospitalAdminList.csv");
  };
  if (!currentUser) {
    return "Access Denied";
  }

  if (
    currentUser &&
    !currentUser?.roles?.includes("ROLE_ADMIN") &&
    !currentUser?.roles?.includes("ROLE_SUPERADMIN")
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
    textAlign: "center",
  };

  const h2Style = {
    fontSize: "14px",
  };

  const h3Style = {
    fontSize: "16px",
  };

  return (
    <div style={style} className="container">
      <div style={{ display: "flex", justifyContent: "left" }}>
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate("/PatientListCounter");
          }}
        >
          Patient Data
        </Button>{" "}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate("/DoctorData");
          }}
        >
          Doctor Data
        </Button>{" "}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate("/NurseData");
          }}
        >
          Nurse Data
        </Button>{" "}
        <Button
          style={{ fontSize: "12px", padding: "4px 5px" }}
          variant="secondary"
          onClick={() => {
            navigate("/PharmacistData");
          }}
        >
          Pharmacist Data
        </Button>{" "}
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
        <h2 style={h1Style}>Hospital Administrator Data</h2>
      </header>
      <br></br>
      <div className="mb-12">
        <div className="row">
          <div className="col-12 col-md-3 mb-2">
            <label
              className="justify-content-center align-items-center"
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "8px",
                display: "flex", // Enable Flexbox
              }}
              htmlFor="searchByName"
            >
              Search by Name or Phone
            </label>

            <input
              style={{ fontSize: "12px" }}
              type="text"
              id="searchByName"
              className="form-control"
              placeholder="Search by Name or Phone"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-1 mb-2">&nbsp;</div>

          <div className="col-12 col-md-2 mb-2">
            <Datepickrange
              onSetDate={handleSetDate}
              onClearDate={handleClearDate}
            />
          </div>
          <div className="col-12 col-md-2 mb-2"></div>
          <div className="col-12 col-md-4 mb-2 d-flex align-items-center justify-content-end">
            <Button
              variant="secondary"
              style={{ fontSize: "12px", padding: "4px 5px" }}
              onClick={downloadCSV}
            >
              Download as CSV
            </Button>{" "}
            <Button
              variant="secondary"
              style={{ fontSize: "12px", padding: "4px 5px" }}
              onClick={fetchDataAndDownloadPDF}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <br></br>
      <div className="table-responsive">
        <Table
          style={{ verticalAlign: "middle", textAlign: "center" }}
          className="table table-hover table-striped table-bordered"
        >
          <Thead>
            <Tr>
              <Th style={{ textAlign: "center" }}>ID</Th>
              <Th style={{ textAlign: "center" }}>Name</Th>
              <Th style={{ textAlign: "center" }}>Address</Th>
              <Th style={{ whiteSpace: "nowrap" }}>Phone Number</Th>
              <Th style={{ textAlign: "center" }}>Email</Th>
              <Th style={{ textAlign: "center" }}>UserName</Th>
              <Th style={{ whiteSpace: "nowrap" }}>Registration Date</Th>
              <Th style={{ textAlign: "center" }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredHospitalAdminList.map((admin) => (
              <Tr key={admin.id}>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {admin.id}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingHospitalAdminId === admin.id ? (
                    <div className="row">
                      <div className="col-12 mb-2">
                        <label
                          style={{ fontSize: "12px", marginBottom: "8px" }}
                        >
                          First Name
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          style={{ fontSize: "12px" }}
                          placeholder="First Name"
                          value={editedHospitalAdmin.firstName || ""}
                          onChange={(e) =>
                            setEditedHospitalAdmin({
                              ...editedHospitalAdmin,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-12 mb-2">
                        <label
                          style={{ fontSize: "12px", marginBottom: "8px" }}
                        >
                          Middle Name
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          style={{ fontSize: "12px" }}
                          placeholder="Middle Name"
                          value={editedHospitalAdmin.middleName || ""}
                          onChange={(e) =>
                            setEditedHospitalAdmin({
                              ...editedHospitalAdmin,
                              middleName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-12 mb-2">
                        <label
                          style={{ fontSize: "12px", marginBottom: "8px" }}
                        >
                          Last Name
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          style={{ fontSize: "12px" }}
                          placeholder="Last Name"
                          value={editedHospitalAdmin.lastName || ""}
                          onChange={(e) =>
                            setEditedHospitalAdmin({
                              ...editedHospitalAdmin,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    `${admin.firstName} ${admin.middleName} ${admin.lastName}`
                  )}
                </Td>

                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingHospitalAdminId === admin.id ? (
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: "12px" }}
                      value={editedHospitalAdmin.address || ""}
                      onChange={(e) =>
                        setEditedHospitalAdmin({
                          ...editedHospitalAdmin,
                          address: e.target.value,
                        })
                      }
                    />
                  ) : (
                    admin.address
                  )}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingHospitalAdminId === admin.id ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ marginRight: "5px" }}></span>
                      <input
                        type="text"
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        value={editedHospitalAdmin.phoneNo || ""}
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*$/;
                          if (input === "" || regex.test(input)) {
                            setEditedHospitalAdmin({
                              ...editedHospitalAdmin,
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
                    `${admin.phoneNo}`
                  )}
                  {editingHospitalAdminId === admin.id &&
                    editedHospitalAdmin.phoneNo &&
                    editedHospitalAdmin.phoneNo.length < 10 && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        Phone number must be 10-digits
                      </span>
                    )}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingHospitalAdminId === admin.id ? (
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        style={{ fontSize: "13px" }}
                        value={editedHospitalAdmin.email || ""}
                        pattern="[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
                        onChange={(e) =>
                          setEditedHospitalAdmin({
                            ...editedHospitalAdmin,
                            email: e.target.value,
                          })
                        }
                      />
                      {!/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(
                        editedHospitalAdmin.email
                      ) && (
                        <span style={{ color: "red" }}>
                          Enter a valid email
                        </span>
                      )}
                    </div>
                  ) : (
                    admin.email
                  )}
                </Td>

                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {admin.username}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {formatDate(admin.createdAt)}
                </Td>
                <Td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  {editingHospitalAdminId === admin.id ? (
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
                            padding: "4px 5px",
                            marginTop: "0px",
                          }}
                          onClick={() => handleSave(admin.id)}
                        >
                          Save
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
                          Cancel
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
                          title="Edit Data"
                          className="btn btn-secondary mr-2"
                          style={{
                            fontSize: "12px",
                            marginTop: "0px",
                            padding: "4px 5px",
                          }}
                          onClick={() => handleEdit(admin.id)}
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
                          onClick={() => handleDelete(admin.id)}
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

export default HospitalAdminData;
