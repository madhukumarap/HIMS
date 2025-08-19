import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import Translation from "../translations/EditInventory.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { CurrencyContext } from "../context/CurrencyProvider";

function InventoryManagementPage() {
  const navigate = useNavigate();
  const locales = { enIN, fr };
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

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

  const [inventory, setInventory] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const currentDate = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format
  const [selectedOption, setSelectedOption] = useState("monthly");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [multiplier, setMultiplier] = useState(10);
  // Update the multiplier based on the input value
  const handleMultiplierChange = (event) => {
    const inputValue = event.target.value;

    // Validate input using regex pattern
    if (/^\d*$/.test(inputValue)) {
      setMultiplier(inputValue);
    }
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  // Event handler for input key down
  const handleInputKeyDown = (event) => {
    const allowedKeys = ["Backspace", "Tab"];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const handleCheckboxChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [newItem, setNewItem] = useState({
    SKU: "",
    itemName: "",
    composition: "",
    description: "",
    unitPrice: 0,
    batchNo: "",
    expiryDate: "",
    unit: "",
    dateIn: "",
    quantityIn: 0,
    dateOut: currentDate,
    quantityOut: 0,
    balanceQuantity: 0,
  });

  ///

  const { t } = useTranslation();

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

  ///

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getInventryItems`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setInventory(response.data);
      });
  }, []);

  useEffect(() => {
    const filteredItems = inventory.filter((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filteredItems);
  }, [inventory, searchTerm]);

  const handleEditButtonClick = (item) => {
    setEditingItem({ ...item });
  };

  const handleCancelEdit = (itemId) => {
    // Logic to cancel editing for the item with the given itemId
    // This may involve resetting the state or reverting any changes made during editing

    // Example code to reset the state
    setEditingItem(null);
  };

  const handleSaveButtonClick = () => {
    editingItem.balanceQuantity = editingItem.quantityIn;
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/inventory/${editingItem.id}`,
        editingItem,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        // Handle success
        toast.success(t("itemUpdatedSuccessfully"), {
          style: { fontSize: "13px" },
        });
        // Refresh inventory data
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/getInventryItems`, {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          })
          .then((response) => {
            setInventory(response.data);
          });
        // Reset editing item
        setEditingItem(null);
      })
      .catch((error) => {
        // Handle error
        toast.error(t("errorUpdatingItem"), {
          style: { fontSize: "13px" },
        });
        console.error(error);
      });
  };

  const handleDeleteButtonClick = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/api/inventory/${id}`, {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        })
        .then((response) => {
          // Handle success
          toast.success(t("itemDeletedSuccessfully"), {
            style: { fontSize: "13px" },
          });
          // Refresh inventory data
          axios
            .get(`${import.meta.env.VITE_API_URL}/api/getInventryItems`, {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            })
            .then((response) => {
              setInventory(response.data);
            });
        })
        .catch((error) => {
          // Handle error
          toast.error(t("errorDeletingItem"), {
            style: { fontSize: "13px" },
          });
          console.error(error);
        });
    }
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
  };

  const handleAddModalOpen = () => {
    setShowAddModal(true);
  };

  const handleAddButtonClick = () => {
    console.log("hellloooo");
    newItem.balanceQuantity = newItem.quantityIn;
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/createItem`, newItem, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        // Handle success
        toast.success(t("itemAddedSuccessfully"), {
          style: { fontSize: "13px" },
        });
        // Refresh inventory data
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/getInventryItems`, {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          })
          .then((response) => {
            setInventory(response.data);
          });
        // Reset new item data
        setNewItem({
          SKU: "",
          itemName: "",
          composition: "",
          description: "",
          unitPrice: 0,
          batchNo: "",
          expiryDate: "",
          unit: "",
          dateIn: "",
          quantityIn: 0,
          dateOut: "",
          quantityOut: 0,
          balanceQuantity: 0,
        });
        // Close add modal
        setShowAddModal(false);
      })
      .catch((error) => {
        console.error("323", error);
        // Handle error
        toast.error(t("errorAddingItem"));
      });
  };

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const formatDate2 = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const currentUser = AuthService.getCurrentUser();

  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser) {
    return "Access Denied";
  }
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_PHARMACIST")
  ) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return "Access Denied";
    // You can handle the redirection or error message display as per your requirement
  }
  const isFormValid = () => {
    // Check if any of the required fields are empty
    return (
      newItem.SKU !== "" &&
      newItem.itemName !== "" &&
      newItem.composition !== "" &&
      newItem.description !== "" &&
      newItem.unitPrice !== "" &&
      newItem.batchNo !== "" &&
      newItem.expiryDate !== "" &&
      newItem.unit !== "" &&
      newItem.dateIn !== "" &&
      newItem.quantityIn !== ""
    );
  };

  const handleColumnHeaderClick = (field) => {
    if (sortField === field) {
      // Reverse the sort direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set the new sort field and default sort direction
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    const fieldValueA = a[sortField];
    const fieldValueB = b[sortField];

    if (fieldValueA < fieldValueB) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (fieldValueA > fieldValueB) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const isExpired = (expiryDate) => {
    const currentDate = new Date();
    const formattedExpiryDate = new Date(expiryDate);
    return formattedExpiryDate < currentDate;
  };

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "14px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "16px" /* Adjust the font size for <h3> */,
  };

  const convertArrayOfObjectsToCSV = (data) => {
    const csvHeader = Object.keys(data[0]).join(",") + "\n";
    const csvRows = data.map((row) => Object.values(row).join(",") + "\n");
    return csvHeader + csvRows.join("");
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getInventryItems`,
        {
          responseType: "json", // Set response type to JSON
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
        // {
        //   headers: {
        //     Authorization: `${currentUser?.Token}`,
        //   },
        // }
      );

      const csvData = convertArrayOfObjectsToCSV(response.data);

      const downloadUrl = URL.createObjectURL(
        new Blob([csvData], { type: "text/csv" })
      );

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "Inventory_data.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(
        t("dataExportedSuccessfully"),
        { position: toast.POSITION.TOP_RIGHT },
        {
          style: { fontSize: "13px" },
        }
      );
    } catch (error) {
      toast.error("Failed to export data", {
        style: { fontSize: "13px" },
      });
      console.error("Error:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedInventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedInventory.length / itemsPerPage);

  const handleNextPage = () => {
    if (indexOfLastItem < sortedInventory.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container style={style}>
      {/* <h1 style={h1Style}>Inventory Management</h1> */}

      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("inventoryManagement")}</h2>
      </header>
      <br></br>

      <div className="d-flex justify-content-end mb-2">
        <strong>
          {" "}
          <p className="text-muted">
            <span style={{ color: "red" }}>*</span>
            {t("toSortClickOnColumnName")}
          </p>
        </strong>
      </div>

      <Row>
        <Col className="col-12 col-md-4 mb-3 order-2 order-md-1">
          {" "}
          {/* Adjusted column size for mobile and changed order */}
          <Form>
            <Form.Group controlId="itemName">
              <Form.Label style={{ fontWeight: "bold" }}>
                Search by Item Name
              </Form.Label>
              <Form.Control
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter item name"
                style={{ fontSize: "12px", width: "100%" }}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col className="col-12 col-md-4 mb-3 order-1 order-md-2">
          {" "}
          {/* Adjusted column size for mobile and changed order */}
          <Button
            style={{ fontSize: "12px", marginTop: "25px", padding: "4px 5px" }}
            variant="secondary"
            onClick={() => {
              navigate(`/${extractedPart}/InventoryDataOut`);
            }}
            block
          >
            View Stock Out
          </Button>
        </Col>

        <Col className="col-12 col-md-4 d-flex justify-content-end order-3">
          {" "}
          {/* Adjusted column size for mobile and changed order */}
          <button
            className="btn btn-secondary bt-sm"
            style={{
              fontSize: "12px",
              height: "29px",
              marginTop: "25px",
              verticalAlign: "center",
              padding: "4px 5px",
            }}
            onClick={handleExportData}
          >
            {t("downloadAsCSV")}
          </button>
        </Col>
      </Row>
      <div style={{ marginTop: "5px", display: "flex", alignItems: "center" }}>
        {/* <Button
          variant="secondary"
          style={{ fontSize: "12px", padding: "4px 5px", marginRight: "10px" }}
          onClick={handleAddModalOpen}
        >
          {t("addItem")}
        </Button>
        <Link
          to="/UploadInventoryData"
          style={{ fontSize: "12px", padding: "4px 5px", marginRight: "10px" }}
        >
          <Button
            variant="secondary"
            style={{
              fontSize: "12px",
              padding: "4px 5px",
              marginRight: "10px",
            }}
          >
            {t("uploadMultipleItems")}
          </Button>
          <br></br>
        </Link> */}

        {/* 
<Link
  to="/CompanyListInventory"
  style={{ fontSize: "12px", padding: "4px 5px", marginRight: "10px" }}
>
  <Button
    variant="secondary"
    style={{
      fontSize: "12px",
      padding: "4px 5px",
      marginRight: "10px",
    }}
  >
    Company List
  </Button>
  <br></br>
</Link>
<Link
  to="/VendorListInventory"
  style={{ fontSize: "12px", padding: "4px 5px", marginRight: "10px" }}
>
  <Button
    variant="secondary"
    style={{
      fontSize: "12px",
      padding: "4px 5px",
      marginRight: "10px",
    }}
  >
    Vendor List
  </Button>
  <br></br>
</Link>
*/}

        {/* <Button
          variant="secondary"
          style={{ padding: "4px 5px", fontSize: "12px", marginLeft: "0px" }}
          onClick={handleExportData}
        >
          {t("downloadAsCSV")}
        </Button> */}
      </div>
      <br></br>

      <div className="row justify-content-end mb-2">
        <div className="col-12 col-sm-12 col-md-2"></div>
        <div
          className="col-12 col-sm-12 col-md-2"
          style={{ verticalAlign: "middle", fontWeight: "bold" }}
        >
          {t("leadTimeToOrderInDays")}
        </div>
        <div className="col-12 col-sm-12 col-md-1">
          <input
            type="text"
            className="form-control"
            value={multiplier}
            onChange={handleMultiplierChange}
            style={{ verticalAlign: "middle", fontSize: "12px" }}
            min="1"
            pattern="[0-9]*"
            placeholder={t("EnterNoOfDays")}
          />
        </div>
        <div className="col-12 col-sm-12 col-md-2">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              value="monthly"
              checked={selectedOption === "monthly"}
              onChange={handleCheckboxChange}
              style={{ width: "15px", height: "15px" }}
            />{" "}
            <label
              className="form-check-label"
              htmlFor="monthlyCheckbox"
              style={{ marginLeft: "10px", fontSize: "13px" }}
            >
              {t("monthlyAvg")}.
            </label>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-2">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              value="weekly"
              style={{ width: "15px", height: "15px" }}
              checked={selectedOption === "weekly"}
              onChange={handleCheckboxChange}
            />
            <label
              className="form-check-label"
              style={{ marginLeft: "10px", fontSize: "13px" }}
            >
              {t("weeklyAvg")}.
            </label>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <Table
          className="table-striped table-hover table-bordered"
          style={{ verticalAlign: "middle", textAlign: "center" }}
          responsive
          bordered
          hover
        >
          <Thead>
            <Tr>
              <Th
                onClick={() => handleColumnHeaderClick("id")}
                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {t("inventoryManagementTable.id")}
              </Th>
              <Th
                onClick={() => handleColumnHeaderClick("SKU")}
                style={{ cursor: "pointer" }}
              >
                {t("inventoryManagementTable.sku")}
              </Th>
              <Th
                onClick={() => handleColumnHeaderClick("itemName")}
                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {t("inventoryManagementTable.itemName")}
              </Th>
              {/* <Th
                onClick={() => handleColumnHeaderClick("composition")}
                style={{ cursor: "pointer" }}
              >
                {t("inventoryManagementTable.composition")}
              </Th>
              <Th
                onClick={() => handleColumnHeaderClick("description")}
                style={{ cursor: "pointer" }}
              >
                {t("inventoryManagementTable.description")}
              </Th> */}
              <Th
                onClick={() => handleColumnHeaderClick("unitPrice")}
                style={{
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {t("inventoryManagementTable.unitPrice")}
              </Th>
              <Th
                onClick={() => handleColumnHeaderClick("batchNo")}
                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {t("inventoryManagementTable.batchNo")}
              </Th>
              <Th
                onClick={() => handleColumnHeaderClick("expiryDate")}
                style={{
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {t("inventoryManagementTable.expiryDate")}
              </Th>
              <Th
                onClick={() => handleColumnHeaderClick("unit")}
                style={{ cursor: "pointer" }}
              >
                {t("inventoryManagementTable.unit")}
              </Th>
              <Th
                onClick={() => handleColumnHeaderClick("dateIn")}
                style={{
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {t("inventoryManagementTable.dateIn")}
              </Th>
              <Th
                onClick={() => handleColumnHeaderClick("quantityIn")}
                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {t("inventoryManagementTable.quantityIn")}
              </Th>
              <Th
                onClick={() => handleColumnHeaderClick("dateOut")}
                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {t("inventoryManagementTable.dateOut")}
              </Th>
              <Th
                onClick={() => handleColumnHeaderClick("quantityOut")}
                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {t("inventoryManagementTable.quantityOut")}
              </Th>
              <Th style={{ whiteSpace: "nowrap" }}>{t("balanceQuantity")}</Th>
              <Th style={{ width: "200px", whiteSpace: "nowrap" }}>
                {t("inventoryManagementTable.avgMonthlyQtyOut")}{" "}
              </Th>
              <Th style={{ width: "200px", whiteSpace: "nowrap" }}>
                {t("inventoryManagementTable.avgWeeklyQtyOut")}
              </Th>
              <Th style={{ textAlign: "center" }}>
                {t("inventoryManagementTable.reOrder")}
              </Th>
              {/*               <Th style={{ textAlign: "center" }}>{t("inventoryManagementTable.action")}</Th> */}
            </Tr>
          </Thead>
          <Tbody style={style}>
            {currentItems.map((item) => (
              <Tr key={item.id}>
                <Td style={{ textAlign: "center" }}>{item.id}</Td>
                <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {editingItem && editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      value={editingItem.SKU}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, SKU: e.target.value })
                      }
                    />
                  ) : (
                    item.SKU
                  )}
                </Td>
                <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {editingItem && editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      value={editingItem.itemName}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          itemName: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.itemName
                  )}
                </Td>
                {/* <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {editingItem && editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      value={editingItem.composition}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          composition: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.composition
                  )}
                </Td>
                <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {editingItem && editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      value={editingItem.description}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.description
                  )}
                </Td> */}
                <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {/* <span>&#8377;</span>{" "} */}
                  {editingItem && editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      value={editingItem.unitPrice}
                      onChange={(e) => {
                        const inputPrice = e.target.value;
                        if (inputPrice === "" || inputPrice > 0) {
                          setEditingItem({
                            ...editingItem,
                            unitPrice: inputPrice,
                          });
                        }
                      }}
                    />
                  ) : (
                    convertCurrency(
                      item.unitPrice,
                      item.Currency,
                      selectedGlobalCurrency
                    )
                  )}{" "}
                  {selectedGlobalCurrency ? selectedGlobalCurrency : ""}
                </Td>
                <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {editingItem && editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      value={editingItem.batchNo}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          batchNo: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.batchNo
                  )}
                </Td>
                <Td
                  style={{
                    textAlign: "center",

                    whiteSpace: "nowrap",
                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {editingItem && editingItem.id === item.id ? (
                    <Form.Control
                      type="date"
                      style={{ fontSize: "12px" }}
                      value={editingItem.expiryDate}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          expiryDate: e.target.value,
                        })
                      }
                    />
                  ) : (
                    formatDateInSelectedLanguage(new Date(item.expiryDate))
                  )}
                </Td>

                <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {editingItem && editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      value={editingItem.unit}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, unit: e.target.value })
                      }
                    />
                  ) : (
                    item.unit
                  )}
                </Td>
                <Td
                  style={{
                    whiteSpace: "nowrap",
                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {editingItem && editingItem.id === item.id ? (
                    <Form.Control
                      type="date"
                      style={{ fontSize: "12px" }}
                      value={editingItem.dateIn}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          dateIn: e.target.value,
                        })
                      }
                    />
                  ) : (
                    formatDateInSelectedLanguage(new Date(item.dateIn))
                  )}
                </Td>
                <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {editingItem && editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      style={{ fontSize: "12px" }}
                      value={editingItem.quantityIn}
                      onChange={(e) => {
                        const value = e.target.value;
                        const isValidInput =
                          /^\d*$/.test(value) &&
                          (value === "" ||
                            (value !== "-" && parseInt(value) > 0));

                        if (isValidInput) {
                          setEditingItem({
                            ...editingItem,
                            quantityIn: value === "" ? "" : parseInt(value),
                          });
                        }
                      }}
                    />
                  ) : (
                    item.quantityIn
                  )}
                </Td>
                <Td
                  style={{
                    textAlign: "center",

                    whiteSpace: "nowrap",
                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {editingItem && editingItem.id === item.id ? (
                    <Form.Control
                      type="text"
                      disabled
                      style={{ fontSize: "12px" }}
                      value={editingItem.dateOut}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          dateOut: e.target.value,
                        })
                      }
                    />
                  ) : (
                    formatDateInSelectedLanguage(new Date(item.dateOut))
                  )}
                </Td>
                <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {editingItem && editingItem.id === item.id ? (
                    <Form.Control
                      disabled
                      type="number"
                      style={{ fontSize: "12px" }}
                      value={editingItem.quantityOut}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          quantityOut: parseInt(e.target.value),
                        })
                      }
                    />
                  ) : (
                    item.quantityOut
                  )}
                </Td>
                <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {item.balanceQuantity}
                </Td>

                <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {item.AverageMonthlyQuantityOut ?? 0}
                </Td>
                <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {item.AverageWeeklyQuantityOut ?? 0}
                </Td>

                <Td
                  style={{
                    textAlign: "center",

                    color: isExpired(item.expiryDate) ? "red" : "inherit",
                    fontWeight:
                      selectedOption === "monthly"
                        ? item.AverageMonthlyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                          ? "bold"
                          : "inherit"
                        : item.AverageWeeklyQuantityOut * multiplier >
                            item.balanceQuantity && !isExpired(item.expiryDate)
                        ? "bold"
                        : "inherit",
                  }}
                >
                  {isExpired(item.expiryDate)
                    ? "Expired"
                    : selectedOption === "monthly"
                    ? item.AverageMonthlyQuantityOut * multiplier >
                      item.balanceQuantity
                      ? "Yes"
                      : "No"
                    : item.AverageWeeklyQuantityOut * multiplier >
                      item.balanceQuantity
                    ? "Yes"
                    : "No"}
                </Td>

                {/* <Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  {editingItem && editingItem.id === item.id ? (
                    <div>
                      <Button
                        variant="secondary"
                        style={{
                          fontSize: "12px",
                          marginTop: "0px",
                          padding: "4px 5px",
                        }}
                        onClick={handleSaveButtonClick}
                      >
                        {t("save")}
                      </Button>
                      <Button
                        style={{
                          fontSize: "12px",
                          marginTop: "0px",
                          padding: "4px 5px",
                          marginLeft: "5px",
                        }}
                        variant="secondary"
                        size="lg"
                        onClick={() => handleCancelEdit(item.id)}
                      >
                        {t("cancel")}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        title="Edit Data"
                        className="btn btn-secondary mr-2"
                        style={{
                          fontSize: "12px",
                          marginTop: "10px",
                          padding: "4px 5px",
                        }}
                        onClick={() => handleEditButtonClick(item)}
                      >
                        <FaPencilAlt />
                      </Button>
                      <Button
                        title="Delete"
                        className="btn btn-secondary mr-2"
                        style={{
                          fontSize: "12px",
                          marginTop: "10px",
                          padding: "4px 5px",
                          marginLeft: "5px",
                        }}
                        onClick={() => handleDeleteButtonClick(item.id)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </div>
                  )}
                </Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <br></br>
      <br></br>

      <Modal
        size="lg"
        backdrop="static"
        style={style}
        show={showAddModal}
        onHide={handleAddModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title style={h1Style}>{t("addNewItem")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="sku">
                  <Form.Label>
                    <strong>{t("inventoryManagementTable.sku")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px", marginBottom: "8px" }}
                    value={newItem.SKU}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // Use a regular expression to check for special characters
                      if (!/^[a-zA-Z0-9]*$/.test(newValue)) {
                        // If a special character is found, don't update the state
                        return;
                      }
                      setNewItem({ ...newItem, SKU: newValue });
                    }}
                    required
                    placeholder={t("enterSKU")}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group controlId="itemName">
                  <Form.Label>
                    <strong>{t("inventoryManagementTable.itemName")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px", marginBottom: "8px" }}
                    value={newItem.itemName}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // Use a regular expression to check for special characters
                      if (!/^[a-zA-Z0-9\s]*$/.test(newValue)) {
                        // If a special character is found, don't update the state
                        return;
                      }
                      setNewItem({ ...newItem, itemName: newValue });
                    }}
                    required
                    placeholder={t("enterItemName")}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="composition">
                  <Form.Label>
                    <strong>{t("inventoryManagementTable.composition")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px", marginBottom: "8px" }}
                    value={newItem.composition}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // Use a regular expression to check for special characters
                      if (!/^[a-zA-Z0-9\s]*$/.test(newValue)) {
                        // If a special character is found, don't update the state
                        return;
                      }
                      setNewItem({ ...newItem, composition: newValue });
                    }}
                    required
                    placeholder={t("enterComposition")}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="description">
                  <Form.Label>
                    <strong>{t("inventoryManagementTable.description")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px", marginBottom: "8px" }}
                    value={newItem.description}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // Use a regular expression to check for special characters
                      if (!/^[a-zA-Z0-9\s]*$/.test(newValue)) {
                        // If a special character is found, don't update the state
                        return;
                      }
                      setNewItem({ ...newItem, description: newValue });
                    }}
                    required
                    placeholder={t("enterDescription")}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="unitPrice">
                  <Form.Label>
                    <strong>{t("inventoryManagementTable.unitPrice")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px", marginBottom: "8px" }}
                    value={newItem.unitPrice}
                    onChange={(e) => {
                      const inputPrice = e.target.value;
                      if (inputPrice === "" || inputPrice > 0) {
                        setNewItem({ ...newItem, unitPrice: inputPrice });
                      }
                    }}
                    required
                    placeholder={t("enterUnitPrice")}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="batchNo">
                  <Form.Label>
                    <strong>{t("inventoryManagementTable.batchNo")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px", marginBottom: "8px" }}
                    value={newItem.batchNo}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // Use a regular expression to check for special characters
                      if (!/^[a-zA-Z0-9\s]*$/.test(newValue)) {
                        // If a special character is found, don't update the state
                        return;
                      }
                      setNewItem({ ...newItem, batchNo: newValue });
                    }}
                    required
                    placeholder={t("enterBatchNo")}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="expiryDate">
                  <Form.Label>
                    <strong>{t("inventoryManagementTable.expiryDate")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    style={{ fontSize: "12px", marginBottom: "8px" }}
                    value={newItem.expiryDate}
                    onChange={(e) =>
                      setNewItem({ ...newItem, expiryDate: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group controlId="unit">
                  <Form.Label>
                    <strong>{t("inventoryManagementTable.unit")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ fontSize: "12px", marginBottom: "8px" }}
                    value={newItem.unit}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // Use a regular expression to check for special characters
                      if (!/^[a-zA-Z\s]*$/.test(newValue)) {
                        // If a special character is found, don't update the state
                        return;
                      }
                      setNewItem({ ...newItem, unit: newValue });
                    }}
                    required
                    placeholder={t("enterUnit")}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="dateIn">
                  <Form.Label>
                    <strong>{t("inventoryManagementTable.dateIn")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    style={{ fontSize: "12px", marginBottom: "8px" }}
                    value={newItem.dateIn}
                    onChange={(e) =>
                      setNewItem({ ...newItem, dateIn: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group controlId="quantityIn">
                  <Form.Label>
                    <strong>{t("inventoryManagementTable.quantityIn")}</strong>
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    style={{ fontSize: "12px" }}
                    value={newItem.quantityIn}
                    onChange={(e) => {
                      const inputPrice = e.target.value;
                      if (inputPrice === "" || inputPrice > 0) {
                        setNewItem({ ...newItem, quantityIn: inputPrice });
                      }
                    }}
                    required
                    placeholder={t("enterQuantityIn")}
                  />
                </Form.Group>
              </div>
            </div>
            {/* <Form.Group controlId="dateOut">
                            <Form.Label>Date Out</Form.Label>
                            <Form.Control
                                type="text"
                                value={newItem.dateOut}
                                onChange={e => setNewItem({ ...newItem, dateOut: e.target.value })}
                            />
                        </Form.Group> */}
            {/* <Form.Group controlId="quantityOut">
                            <Form.Label>Quantity Out</Form.Label>
                            <Form.Control
                                type="number"
                                value={newItem.quantityOut}
                                onChange={e => setNewItem({ ...newItem, quantityOut: parseInt(e.target.value) })}
                            />
                        </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ fontSize: "12px", padding: "4px 5px" }}
            onClick={handleAddButtonClick}
            disabled={!isFormValid()}
          >
            {t("add")}
          </Button>
          <Button
            variant="secondary"
            style={{
              fontSize: "12px",
              backgroundColor: "#777777",
              margintop: "10px",
              padding: "4px 5px",
            }}
            onClick={handleAddModalClose}
          >
            {t("cancel")}
          </Button>
        </Modal.Footer>
      </Modal>

      <br></br>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            style={{ fontSize: "12px" }}
            variant="secondary"
          >
            {t("previous")}
          </Button>
        </Col>
        <Col xs="auto" className="text-center">
          <span className="mx-2" style={{ fontSize: "12px" }}>
            {t("page")} {currentPage} {t("of")} {totalPages}
          </span>
        </Col>
        <Col xs="auto">
          <Button
            variant="secondary"
            onClick={handleNextPage}
            disabled={indexOfLastItem >= sortedInventory.length}
            style={{ fontSize: "12px" }}
          >
            {t("next")}
          </Button>
        </Col>
      </Row>
      <br></br>
    </Container>
  );
}
export default InventoryManagementPage;
