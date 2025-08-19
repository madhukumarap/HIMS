import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./print-styles.css";
import Select from "react-select";
import { Table, Container, Form, Button, Modal } from "react-bootstrap";
import "./stylesClassname.css"; // Import the CSS file

import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InvoiceComponent from "./InvoiceComponent";
import AuthService from "../services/auth.service";
import Translation from "../translations/DispensingForm.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

function SellOrderPage() {
  const { id } = useParams();
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  const [orders, setOrders] = useState([]);

  const [exchangeRates, setExchangeRates] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);

  const [Hospitals, setHospitals] = useState([]);
  const [optionalCurrencies, setOptionalCurrencies] = useState([]);

  const [totalFees, setTotalFees] = useState(null);
  const [currency, setCurrency] = useState("");
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/GetExchangeRates/USD`
        );

        const exchangeRatesData = response.data.exchangeRatesData;
        const firstCurrencyData = exchangeRatesData[0].data;
        const rates = firstCurrencyData.rates;
        setExchangeRates(rates);
        //  alert(JSON.stringify(response.data.rates["CDF"]));
      } catch (error) {
        console.error(error);
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    // Fetch hospital data from your Node.js API endpoint
    fetch(`${import.meta.env.VITE_API_URL}/api/getAllHospitals`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setHospitals(data.data);
        setOptionalCurrencies(data.data[0].OptionalCurrency.split(","));
        console.log(
          "OptionalCurrencies :",
          data.data[0].OptionalCurrency.split(",")
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (currency && exchangeRates) {
      const totalFeesInSelectedCurrency = orders.reduce((sum, order) => {
        const nativeCurrency = order.item.Currency || "USD";

        const nativeCurrencyRate =
          exchangeRates[nativeCurrency.replace(/[^a-zA-Z]/g, "")];
        const selectedCurrencyRate =
          exchangeRates[currency.replace(/[^a-zA-Z]/g, "")];

        // Convert unit price from native currency to selected currency
        const unitPriceInSelectedCurrency =
          order.item.unitPrice * (selectedCurrencyRate / nativeCurrencyRate);

        const itemTotalInSelectedCurrency =
          order.quantity * unitPriceInSelectedCurrency;

        return sum + itemTotalInSelectedCurrency;
      }, 0);

      const formattedTotalFees = totalFeesInSelectedCurrency.toFixed(2);
      setTotalFees(formattedTotalFees);
    } else {
      setTotalFees(null);
    }
  }, [currency, orders, exchangeRates]);

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
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [patientData, setPatientData] = useState(null);
  const [expiryDays, setExpiryDays] = useState(7);
  const [fetchStatus, setFetchStatus] = useState("");

  //dispensed medicine get from node js
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/GetDispensedListOfPr/${id}`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMedicines(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getOnePrescription/${id}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setPatientData(response.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFetchData2 = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getIfExpiryMore-7`, {
        params: {
          expiryDays: expiryDays, // Pass the expiryDays value as a query parameter
        },
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setItems(response.data);
        setFetchStatus("success");
        setTimeout(() => {
          setFetchStatus("");
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        // setFetchStatus('error');
      });
  };

  useEffect(() => {
    handleFetchData2(); // Call the API initially
  }, []);

  useEffect(() => {
    // Calculate the total cart value whenever orders change
    const total = orders.reduce((sum, order) => {
      return sum + order.item.unitPrice * order.quantity;
    }, 0);
    const formattedTotal = total.toFixed(2); // Format total to two decimal places
    setCartTotal(formattedTotal);
  }, [orders]);

  const [errorMessage, setErrorMessage] = useState("");

  const handleExpiryDaysChange = (event) => {
    setExpiryDays(event.target.value);
  };

  const handleFetchData = () => {
    handleFetchData2();
  };

  const handleAddOrder = () => {
    // Find the selected item object from the items list
    const selected = items.find((item) => item.itemName === selectedItem);

    if (selected) {
      // Check if the selected item is already in the orders list
      const existingOrder = orders.find(
        (order) => order.item.itemName === selectedItem
      );

      if (existingOrder) {
        // Item already exists in the orders list, show an error message
        setErrorMessage(t("AlreadyCart"));
        return;
      }

      // Create a new order object
      const newOrder = {
        item: selected,
        quantity: quantity,
      };

      const quantity2 = newOrder.item;
      if (newOrder.quantity > quantity2.balanceQuantity) {
        //  setOrders([...orders, newOrder]);
        setErrorMessage(t("EneteredQuantityGreaterThanBalanchQuantity"));
        return;
      }

      // Update the orders state with the new order
      setOrders([...orders, newOrder]);

      // Reset the input fields and error message
      setSelectedItem("");
      setQuantity(0);
      setErrorMessage("");
    }
  };

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const handleRemoveOrder = (index) => {
    // Remove the order from the orders list
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);
  };

  //set time
  // ading timedate

  const [indianTime, setIndianTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const indianTime = now
        .toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        })
        .replace(/:/g, "")
        .replace(/\s/g, "");
      setIndianTime(indianTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const today = new Date(); // creates a new Date object with the current date and time
  const options = { year: "numeric", month: "2-digit", day: "2-digit" }; // date options for formatting
  const parts = new Intl.DateTimeFormat("default", options).formatToParts(
    today
  ); // get the date parts
  const dateid = `${parts[4].value}${parts[0].value}${parts[2].value}`; // concatenate the parts in reverse order

  const handlePrint = () => {
    const printContent = document.getElementById("print-section");
    if (printContent) {
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
    }
  };

  //paitentDetails prescriptionID
  const ID = dateid + indianTime;

  const handleSubmitOrder = () => {
    if (!currency) {
      toast.error(t("SelectCurrency"));
      return;
    }
    // Show a confirmation alert
    const confirmSubmit = window.confirm(t("SubmitConfirm"));

    if (confirmSubmit) {
      // Send the orders data to the server
      const data = {
        dispenseID: patientData.prescriptionId + ID,
        totalMedicineAmount: cartTotal,
        orders: orders,
        patientData: patientData,
        Currency: currency,
        TotalFees: totalFees,
      };

      axios
        .post(`${import.meta.env.VITE_API_URL}/api/saveDispensedData`, data, {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        })
        .then((response) => {
          console.log("Order submitted successfully");
          // Print the page
          // window.print();
          toast.success(t("OrderSubmitted"), {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
          });
          navigate(`/${extractedPart}/PharmacistPrescriptionList`);
        })
        .catch((error) => {
          console.error("Error submitting order:", error);
        });
    }
  };

  const handleOrderAndPrint = () => {
    handleSubmitOrder();
    // handlePrint();
    // navigate("/PharmacistPrescriptionList");
  };

  if (!currentUser) {
    return "Access Denied";
  }
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_PHARMACIST") &&
    !currentUser.roles.includes("ROLE_ADMIN")
  ) {
    // Redirect or show error message when the user is not an admin
    return "Access Denied";
    // You can handle the redirection or error message display as per your requirement
  }

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
    fontSize: "13px",
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "10px",
    }),
    input: (provided) => ({
      ...provided,
      minHeight: "10px",
    }),
  };

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  return (
    <>
      <div style={style}>
        <div>
          <header
            className="header"
            style={{
              textAlign: "center",
              fontSize: "16px",
              // backgroundColor: "lightblue",
              padding: "10px",
            }}
          >
            {t("prescriptionDetails")}
          </header>
        </div>
        <br></br>
        <div className="container">
          {patientData && (
            <div>
              <div className="card">
                <div className="card-body">
                  <h2 style={h2Style}>{t("patientDetails")} </h2>
                  <div
                    className="patient-info-container"
                    style={{
                      display: "flex",
                      justifyContent: "space-start",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      className="patient-info-left"
                      style={{ paddingLeft: "0px", marginRight: "0px" }}
                    >
                      <p className="card-text">
                        <div className="row">
                          <div className="col-6">
                            <strong>{t("patientName")}</strong>:{" "}
                            {patientData.PatientName}
                          </div>
                          <div
                            style={{ whiteSpace: "nowrap" }}
                            className="col-6"
                          >
                            <strong>{t("prescribedDoctor")}</strong>:{" "}
                            {patientData.PrescribedDoctor}
                          </div>
                        </div>
                      </p>

                      <p className="card-text">
                        <div className="row">
                          <div className="col-6">
                            <strong>{t("prescriptionID")}</strong>:{" "}
                            {patientData.prescriptionId}
                          </div>
                          <div
                            style={{ whiteSpace: "nowrap" }}
                            className="col-6"
                          >
                            <strong>{t("doctorRegistrationNumber")}</strong>:{" "}
                            {patientData.RegistrationNo}
                          </div>
                        </div>
                      </p>

                      <p className="card-text">
                        <div className="row">
                          <div className="col-6">
                            <strong>{t("prescriptionDate")}</strong>:{" "}
                            {formatDateInSelectedLanguage(
                              new Date(patientData.createdAt)
                            )}
                          </div>
                          <div
                            style={{ whiteSpace: "nowrap" }}
                            className="col-6"
                          >
                            <strong>{t("dispensingID")}</strong>:{" "}
                            {patientData.prescriptionId + "/" + ID}
                          </div>
                        </div>
                      </p>

                      <p className="card-text">
                        <strong>{t("dateOfDispention")}</strong>:{" "}
                        {formatDateInSelectedLanguage(new Date(today))}
                        <span style={{ marginRight: "57px" }}></span>
                      </p>
                    </div>

                    <div
                      className="patient-info-middle"
                      style={{ marginTop: "0px", marginLeft: "10px" }}
                    ></div>
                  </div>
                  {patientData &&
                    patientData.medicines &&
                    patientData.medicines.length > 0 && (
                      <div>
                        <br></br>
                        <h2 style={h2Style}>{t("prescribedMedicines")}</h2>
                        <Table
                          style={{ verticalAlign: "middle" }}
                          responsive
                          bordered
                          striped
                        >
                          <thead>
                            <tr>
                              <th>{t("prescriptionTable.medicineName")}</th>
                              <th>{t("prescriptionTable.dosageAmount")}</th>
                              <th>{t("prescriptionTable.clinicalAdvice")}</th>
                              <th>{t("prescriptionTable.startDate")}</th>
                              <th>{t("duration")}</th>
                              {/*              <th>{t("timing")}</th> */}
                              <th>{t("prescriptionTable.quantity")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patientData.medicines.map((medicine) => (
                              <tr key={medicine.id}>
                                <td>{medicine.medicineName}</td>
                                <td>{medicine.dosageAmount}</td>
                                <td>{medicine.food}</td>
                                <td>
                                  {formatDateInSelectedLanguage(
                                    new Date(medicine.startDate)
                                  )}
                                </td>
                                <td>{medicine.weekly}</td>
                                {/* <td>{medicine.timing}</td> */}
                                <td>{medicine.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}

                  {patientData &&
                    patientData.medicines &&
                    patientData.medicines.length > 0 &&
                    medicines.length > 0 && (
                      <div>
                        <h2 style={h2Style}> {t("dispensedMedicines")}</h2>
                        <Table
                          style={{ verticalAlign: "middle" }}
                          responsive
                          bordered
                          striped
                        >
                          <thead>
                            <tr>
                              <th>{t("dispensedMedicinesTable.dispenseID")}</th>
                              <th>
                                {t("dispensedMedicinesTable.medicineName")}
                              </th>
                              <th>
                                {t("dispensedMedicinesTable.batchNumber")}
                              </th>
                              <th>{t("dispensedMedicinesTable.expiryDate")}</th>
                              <th>{t("dispensedMedicinesTable.unitPrice")}</th>
                              {/*              <th>{t("dispensedMedicinesTable.dosageAmount")}</th>
               <th>{t("dispensedMedicinesTable.clinicalAdvice")}</th> */}
                              <th>{t("dispensedMedicinesTable.quantity")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {medicines.map((medicine) => (
                              <tr key={medicine.id}>
                                <td>{medicine.DispenseID}</td>
                                <td>{medicine.MedicineName}</td>
                                <td>{medicine.BatchNumber}</td>
                                <td>
                                  {formatDateInSelectedLanguage(
                                    new Date(medicine.ExpiryDate)
                                  )}
                                </td>

                                <td>{medicine.UnitPrice}</td>
                                {/* <td>{medicine.timing}</td> */}
                                <td>{medicine.Quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="container mt-5">
          <div className="row align-items-center">
            <div className="col-md-5"></div>
            <div className="col-md-3">
              {" "}
              <h1 className="mb-4">
                <h1 style={{ fontSize: "14px" }}>{t("searchMedicine")}</h1>
              </h1>
            </div>
            <div className="col-md-3">
              {" "}
              <h1 className="mb-4">
                <h1 style={{ fontSize: "14px" }}>{t("enterQuantity")}</h1>
              </h1>
            </div>
          </div>

          <div
            className="mb-12"
            style={{ width: "100%", marginBottom: "0rem" }}
          >
            <div
              style={{ marginTop: "-20px" }}
              className="row align-items-center"
            >
              <div
                style={{ fontSize: "13px", fontWeight: "bold" }}
                className="col-2"
              >
                {t("enterExpiryDays")}
              </div>
              <div className="col-1">
                <input
                  style={{ fontSize: "12px" }}
                  type="text"
                  required
                  placeholder="Enter Days"
                  className="form-control"
                  value={expiryDays}
                  onChange={(event) => {
                    const enteredValue = event.target.value;
                    // Remove any non-digit characters from the entered value
                    const sanitizedValue = enteredValue.replace(/\D/g, "");
                    // Limit the value to 10 digits
                    const limitedValue = sanitizedValue.slice(0, 3);
                    // Update the state with the limited value
                    setExpiryDays(limitedValue);
                  }}
                />
              </div>
              <div className="col-2">
                <button
                  style={{ fontSize: "12px", marginTop: "0rem" }}
                  className="btn btn-primary btn-sm"
                  onClick={handleFetchData}
                >
                  {t("fetchData")}
                </button>
              </div>

              <div className="col-3">
                <Select
                  styles={customStyles}
                  value={
                    selectedItem
                      ? { label: selectedItem, value: selectedItem }
                      : {
                          label: t("selectMedicineFromInventory"),
                          value: "",
                        }
                  }
                  onChange={(selectedOption) =>
                    setSelectedItem(selectedOption.value)
                  }
                  options={[
                    {
                      label: "-- Select Medicine From Inventory --",
                      value: "",
                    },
                    ...items.map((item) => ({
                      value: item.itemName,
                      label: `Name: ${item.itemName} / BatchNo: ${
                        item.batchNo
                      } / ExpiryDate: ${formatDateInSelectedLanguage(
                        new Date(item.expiryDate)
                      )}`,
                    })),
                  ]}
                />
              </div>

              <div className="col-2">
                <label className="form-label">
                  {/* Enter Quantity: */}
                  <input
                    style={{ fontSize: "12px" }}
                    type="text"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => {
                      const inputValue = Number(e.target.value);
                      if (inputValue > 0 || e.target.value === "") {
                        setQuantity(inputValue);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="col-2">
                <button
                  style={{
                    fontSize: "13px",
                    marginBottom: "25px",
                    padding: "4px 5px",
                  }}
                  className="btn btn-primary btn-sm"
                  onClick={handleAddOrder}
                  disabled={!selectedItem || quantity <= 0}
                >
                  {t("addToOrder")}
                </button>
              </div>
            </div>
            <br></br>
            <div className="row align-items-center">
              <div className="col-2"></div>
              <div className="col-4">
                {fetchStatus === "success" && (
                  <div className="col-3" style={{ color: "green" }}>
                    {t("dataFetchedSuccessfully")}
                  </div>
                )}
                {fetchStatus === "error" && (
                  <div className="col-2" style={{ color: "red" }}>
                    {t("errorFetchingData")}
                  </div>
                )}
              </div>
              <div className="col-2" style={{ color: "red" }}></div>
              <div className="col-4" style={{ color: "red" }}>
                {errorMessage && (
                  <span style={{ color: "red" }}>{errorMessage}</span>
                )}
              </div>
            </div>
          </div>

          <br></br>
          <div id="print-section">
            {/* <h1 style={{ fontSize: "18px", textAlign: "center" }}>
              Dispensed Details
            </h1> */}

            <div>
              <h2 style={h2Style}> {t("MedicineOrderSummary")}</h2>
              <Table
                style={{ verticalAlign: "middle", textAlign: "center" }}
                responsive
                bordered
                hover
              >
                <thead>
                  <tr>
                    <th className="text-center nowrip">
                      {t("medicineOrderSummaryTable.srNum")}
                    </th>
                    <th className="text-center nowrip">
                      {t("medicineOrderSummaryTable.medicineName")}
                    </th>
                    <th className="text-center nowrip">
                      {t("medicineOrderSummaryTable.batchNumber")}
                    </th>
                    <th className="text-center nowrip">
                      {t("medicineOrderSummaryTable.expiryDate")}
                    </th>
                    <th className="text-center nowrip">
                      {t("medicineOrderSummaryTable.unitPrice")}
                    </th>
                    <th className="text-center nowrip">
                      {t("medicineOrderSummaryTable.quantity")}
                    </th>

                    <th className="text-center nowrip" id="print-button">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td className="text-center nowrip">{index + 1}</td>
                      <td className="text-center nowrip">
                        {order.item.itemName}
                      </td>
                      <td className="text-center nowrip">
                        {order.item.batchNo}
                      </td>
                      <td className="text-center nowrip">
                        {formatDateInSelectedLanguage(
                          new Date(order.item.expiryDate)
                        )}
                      </td>
                      <td className="text-center nowrip">
                        {/* <span>&#8377;</span> */}
                        {order.item.unitPrice} {order.item.Currency}
                        <strong></strong>
                      </td>
                      <td className="text-center nowrip">{order.quantity}</td>
                      <td className="text-center nowrip">
                        <button
                          id="print-button"
                          className="btn btn-danger"
                          style={{ fontSize: "13px" }}
                          onClick={() => handleRemoveOrder(index)}
                        >
                          {t("medicineOrderSummaryTable.remove")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* <div>
              <h2 style={h1Style}>
                {t("cartTotal")}
                <span>&#8377;</span> {cartTotal} <strong></strong>
              </h2>
            </div> */}
            <div className="row">
              <div className="col-md-2">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {t("SelectCurrency")}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  {/* Dropdown for currency */}
                  <select
                    style={{ fontSize: "13px" }}
                    className="form-control"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value={Hospitals[0]?.baseCurrency}>
                      {Hospitals[0]?.baseCurrency}
                    </option>
                    {optionalCurrencies?.map((currency) => {
                      return <option value={currency}>{currency}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label
                    style={{
                      fontSize: "12px",
                      marginTop: "40px",
                      fontWeight: "bold",
                      marginBottom: "-10px",
                    }}
                  >
                    {t("cartTotal")} {" = "}
                    {totalFees} {currency}
                  </label>
                  <span></span>
                </div>
              </div>
            </div>

            <br />
            {/* <div>
            <h2>Invoice</h2>
            <InvoiceComponent patientData={patientData} orders={orders} cartTotal={cartTotal} />
          </div> */}
          </div>
          <div className="text-center">
            <button
              className="btn btn-success btn-sm"
              onClick={handleOrderAndPrint}
              disabled={orders.length === 0 || !patientData}
              style={{ fontSize: "12px", padding: "4px 5px" }}
            >
              {t("submitOrder")}
            </button>

            <Link to={`/${extractedPart}/PharmacistPrescriptionList`}>
              <button
                style={{
                  fontSize: "12px",
                  marginTop: "0px",
                  marginLeft: "20px",
                  padding: "4px 5px",
                }}
                className="btn btn-primary btn-sm"
              >
                {t("GoBack")}
              </button>
            </Link>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </>
  );
}

export default SellOrderPage;
