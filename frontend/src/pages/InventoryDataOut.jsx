import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Row, Col, Button } from "react-bootstrap";
import { CSVLink } from "react-csv";
import AuthService from "../services/auth.service";
import Form from "react-bootstrap/Form";
import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import Datepickrange from "./DateRangeCalender";

import Translation from "../translations/StockOutData.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const InventoryOutData = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [itemNameFilter, setItemNameFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

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

  const handleSetDate = (start, end) => {
    setStartDateFilter(start);
    setEndDateFilter(end);
  };

  const handleClearDate = () => {
    setStartDateFilter("");
    setEndDateFilter("");
  };
  useEffect(() => {
    fetchInventoryOutData();
  }, []);

  useEffect(() => {
    filterData();
  }, [data, itemNameFilter, startDateFilter, endDateFilter]);

  const fetchInventoryOutData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getOutData`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filterData = () => {
    let filtered = [...data];
    if (itemNameFilter) {
      filtered = filtered.filter((item) =>
        item.ItemName.toLowerCase().includes(itemNameFilter.toLowerCase())
      );
    }
    if (startDateFilter) {
      filtered = filtered.filter(
        (item) => new Date(item.dateOut) >= new Date(startDateFilter)
      );
    }
    if (endDateFilter) {
      filtered = filtered.filter(
        (item) => new Date(item.dateOut) <= new Date(endDateFilter)
      );
    }

    if (startDateFilter && endDateFilter) {
      // If both start and end dates are present, show all records within the range
      const startDate = new Date(startDateFilter);
      const endDate = new Date(endDateFilter);
      filtered = filtered.filter((item) => {
        const dateOut = new Date(item.dateOut);
        return dateOut >= startDate && dateOut <= endDate;
      });
    } else {
      // Otherwise, show only records from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(
        (item) => new Date(item.dateOut) >= sevenDaysAgo
      );
    }

    filtered = filtered.map((item) => ({
      ...item,
      limitedDateOut: new Date(item.dateOut),
    }));

    filtered.sort((a, b) => {
      // Sort by medicine name in ascending order
      if (a.ItemName < b.ItemName) return -1;
      if (a.ItemName > b.ItemName) return 1;
      return 0;
    });

    setFilteredData(filtered);
  };

  const handleItemNameFilterChange = (event) => {
    setItemNameFilter(event.target.value);
  };

  const handleStartDateFilterChange = (event) => {
    setStartDateFilter(event.target.value);
  };

  const handleEndDateFilterChange = (event) => {
    setEndDateFilter(event.target.value);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getUniqueBatchNumbers = () => {
    const batchNumbers = new Set();
    filteredData.forEach((item) => batchNumbers.add(item.BatchNumber));
    return Array.from(batchNumbers);
  };

  // localStorage.setItem("reloadCount1", "0");
  // const reloadCount = localStorage.getItem("reloadCount2");
  // if (reloadCount !== "1") {
  //   window.location.reload();
  //   localStorage.setItem("reloadCount2", "1");
  // }

  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });

  if (
    !currentUser ||
    (!currentUser?.roles.includes("ROLE_ADMIN") &&
      !currentUser?.roles.includes("ROLE_PHARMACIST"))
  ) {
    // If the user is not logged in or does not have the admin role,
    // you can show a message or redirect to another page.
    return "Access Denied";
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

  const csvData = [];
  let prevBatchNumber = null;

  filteredData.forEach((item) => {
    if (item.BatchNumber !== prevBatchNumber) {
      csvData.push({
        "Item Name": "",
        "Batch Number": "",
        "Expiry Date": "",
        DateOut: "",
        QuantityOut: "",
      });
    }

    csvData.push({
      "Item Name": item.ItemName,
      "Batch Number": item.BatchNumber,
      "Expiry Date": formatDate(item.ExpiryDate),
      DateOut: formatDate(item.limitedDateOut),
      QuantityOut: item.Quantity,
    });

    prevBatchNumber = item.BatchNumber;
  });

  return (
    <div style={style}>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("stockOutData")}</h2>
      </header>

      <br />
      <Row>
        <Col md={3}>
          <div>
            <label
              style={{ fontWeight: "bold", marginBottom: "8px" }}
              htmlFor="itemNameFilter"
            >
              {t("searchbyItemName")}
            </label>
            <input
              style={{ fontSize: "12px" }}
              type="text"
              id="itemNameFilter"
              className="form-control"
              value={itemNameFilter}
              placeholder={t("searchbyItemName")}
              onChange={handleItemNameFilterChange}
            />
          </div>
        </Col>
        <Col md={2}>
          <Datepickrange
            onSetDate={handleSetDate}
            onClearDate={handleClearDate}
          />
        </Col>{" "}
        <Col md={2}>
          <Button
            style={{ fontSize: "12px", marginTop: "27px", padding: "4px 5px" }}
            variant="secondary"
            onClick={() => {
              navigate(`/${extractedPart}/InventoryData`);
            }}
          >
            {t("viewStockIn")}
          </Button>{" "}
        </Col>
        <Col md={5}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <CSVLink data={csvData} filename={"inventory_data.csv"}>
              <Button
                variant="secondary"
                style={{
                  fontSize: "12px",
                  marginTop: "35px",
                  padding: "4px 5px",
                  marginBottom: "10px",
                }}
              >
                {t("downloadAsCSV")}
              </Button>
            </CSVLink>
          </div>
        </Col>
      </Row>
      <br />
      <Table responsive bordered hover striped>
        <thead>
          <tr>
            <th
              style={{
                verticalAlign: "middle",
                whiteSpace: "nowrap",
                textAlign: "center",
                backgroundColor: "transparent",
              }}
            >
              {t("stockOutDataTable.srNo")}
            </th>
            <th
              style={{
                verticalAlign: "middle",
                whiteSpace: "nowrap",
                textAlign: "center",
                backgroundColor: "transparent",
              }}
            >
              {t("itemName")}
            </th>
            <th
              style={{
                verticalAlign: "middle",
                whiteSpace: "nowrap",
                textAlign: "center",
                backgroundColor: "transparent",
              }}
            >
              {t("stockOutDataTable.batchNumber")}
            </th>
            <th
              style={{
                verticalAlign: "middle",
                whiteSpace: "nowrap",
                textAlign: "center",
                backgroundColor: "transparent",
              }}
            >
              {t("stockOutDataTable.expiryDate")}
            </th>
            <th
              style={{
                verticalAlign: "middle",
                whiteSpace: "nowrap",
                textAlign: "center",
                backgroundColor: "transparent",
              }}
            >
              {t("stockOutDataTable.dateOut")}
            </th>
            <th
              style={{
                verticalAlign: "middle",
                textAlign: "center",
                backgroundColor: "transparent",
              }}
            >
              {t("stockOutDataTable.quantityOut")}
            </th>
          </tr>
        </thead>
        <tbody>
          {getUniqueBatchNumbers().map((batchNumber, index) => {
            const batchItems = filteredData.filter(
              (item) => item.BatchNumber === batchNumber
            );
            return (
              <React.Fragment key={batchNumber}>
                {batchItems.map((item, itemIndex) => (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor:
                        (index % 2 === 0 && index % 2 === 0) ||
                        (index % 2 === 1 && index % 2 === 1)
                          ? "#F9F9F9"
                          : "white",
                    }}
                  >
                    {itemIndex === 0 && (
                      <>
                        <td
                          rowSpan={batchItems.length}
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                            fontWeight: "bold",
                            backgroundColor:
                              index % 2 === 0 ? "transparent" : "white",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          rowSpan={batchItems.length}
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                            fontWeight: "bold",
                            backgroundColor:
                              index % 2 === 0 ? "transparent" : "white",
                          }}
                        >
                          {item.ItemName}
                        </td>
                      </>
                    )}
                    <td style={{ textAlign: "center" }}>{item.BatchNumber}</td>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {formatDate(item.ExpiryDate)}
                    </td>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {formatDate(item.limitedDateOut)}
                    </td>
                    <td style={{ textAlign: "center" }}>{item.Quantity}</td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default InventoryOutData;
