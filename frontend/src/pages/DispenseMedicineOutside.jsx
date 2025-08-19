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
import InvoiceComponent from "./InvoiceComponent"; // Replace './InvoiceComponent' with the actual file path
import AuthService from "../services/auth.service";

import Translation from "../translations/DispenseMedicineOutside.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

function SellOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [orders, setOrders] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [patientData, setPatientData] = useState(null);
  const [expiryDays, setExpiryDays] = useState(7);
  const [fetchStatus, setFetchStatus] = useState("");
  //new
  const [patientName, setPatientName] = useState("");
  const [patientContact, setPatientContact] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorRegNo, setDoctorRegNo] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [prescriptionDate, setPrescriptionDate] = useState("");
  const [prescriptionType, setPrescriptionType] = useState("");
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [Hospitals, setHospitals] = useState([]);
  const [optionalCurrencies, setOptionalCurrencies] = useState([]);

  const [exchangeRates, setExchangeRates] = useState(null);

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
    // fetchExchangeRates();
    if (currency && exchangeRates) {
      console.log("exchangeRates::" + exchangeRates);
      console.log("exchangeRates[0]::" + exchangeRates["INR"]);

      const totalFeesInSelectedCurrency = orders.reduce((sum, order) => {
        const nativeCurrency = order.item.Currency || "USD";
        //alert(nativeCurrency);
        console.log("order.item.Currency::" + order.item.Currency);
        const nativeCurrencyRate =
          exchangeRates[nativeCurrency.replace(/[^a-zA-Z]/g, "")];
        const selectedCurrencyRate =
          exchangeRates[currency.replace(/[^a-zA-Z]/g, "")];
        console.log("nativeCurrencyRate::" + nativeCurrencyRate);
        console.log("nativeCurrencyRate::" + selectedCurrencyRate);
        console.log("order.item.unitPrice::" + order.item.unitPrice);
        // Convert unit price from native currency to selected currency
        const unitPriceInSelectedCurrency =
          order.item.unitPrice * (selectedCurrencyRate / nativeCurrencyRate);
        console.log(
          "unitPriceInSelectedCurrency::" + unitPriceInSelectedCurrency
        );

        const itemTotalInSelectedCurrency =
          Number(order.quantity) * Number(unitPriceInSelectedCurrency);
        console.log(
          "itemTotalInSelectedCurrency::" + itemTotalInSelectedCurrency
        );
        return sum + itemTotalInSelectedCurrency;
      }, 0);

      const formattedTotalFees = totalFeesInSelectedCurrency.toFixed(2);
      console.log("formattedTotalFees::" + formattedTotalFees);
      setTotalFees(Number(formattedTotalFees));
    } else {
      setTotalFees(null);
    }
  }, [currency, orders, exchangeRates]);

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

  const resetFormFields = () => {
    setPatientName("");
    setPatientContact("");
    setDoctorName("");
    setDoctorRegNo("");
    setHospitalName("");
    setPrescriptionDate("");
    setPrescriptionType("");
    setPrescriptionImage(null);
  };

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
        setErrorMessage("Item already added to the order");
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
        setErrorMessage(
          "Entered quantity Greater than available quantity in inventory"
        );
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRemoveOrder = (index) => {
    // Remove the order from the orders list
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);
  };

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
  );
  const dateid = `${parts[4].value}${parts[0].value}${parts[2].value}`; // concatenate the parts in reverse order

  //paitentDetails prescriptionID
  const ID = dateid + indianTime;

  const handlePrescriptionImageChange = (e) => {
    const file = e.target.files[0];
    setPrescriptionImage(file);
  };
  const handleSubmitOrder = () => {
    if (
      !patientName ||
      !patientContact ||
      !doctorName ||
      !doctorRegNo ||
      !hospitalName
    ) {
      toast.error(t("dispenseMedicineToasts.pleaseEnterAllfields"));
      return;
    }
    if (patientContact.length !== 10) {
      toast.error(t("dispenseMedicineToasts.pleaseEnterValidPhone"));
      return;
    }
    if (!prescriptionDate) {
      toast.error(t("dispenseMedicineToasts.pleaseselectDate"));
      return;
    }
    if (!prescriptionType) {
      toast.error(t("dispenseMedicineToasts.pleaseSelectPrescriptionType"));
      return;
    }

    if (!currency) {
      toast.error(t("SelectCurrency"));
      return;
    }
    const confirmSubmit = window.confirm(t("SubmitConfirm"));

    if (confirmSubmit) {
      const formData = new FormData();

      // Append form data
      formData.append("dispenseID", ID);
      formData.append("totalMedicineAmount", cartTotal);
      formData.append("Currency", currency);
      formData.append("TotalFees", totalFees);
      formData.append("totalMedicineAmount", cartTotal);

      formData.append("patientName", patientName);
      formData.append("patientContact", patientContact);
      formData.append("doctorName", doctorName);
      formData.append("doctorRegNo", doctorRegNo);
      formData.append("hospitalName", hospitalName);
      formData.append("prescriptionDate", prescriptionDate);
      formData.append("prescriptionType", prescriptionType);

      // Append the image
      formData.append("prescriptionImage", prescriptionImage);

      // Append orders as JSON
      formData.append("orders", JSON.stringify(orders));

      // alert();
      // return;
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/saveDispensedDataOutside`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          console.log("Order submitted successfully");
          toast.success(
            t("dispenseMedicineToasts.orderSubmittedSuccessfully"),
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 3000,
            }
          );
          resetFormFields();
          // navigate("/PharmacistPrescriptionList");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error submitting order:", error);
        });
    }
  };

  const handleOrderAndPrint = () => {
    handleSubmitOrder();
    // handlePrint();
    // navigate("/searchPatientToDispense");
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
  }

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px",
  };

  const h2Style = {
    fontSize: "14px",
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
          <h1
            style={{
              textAlign: "center",
              fontSize: "16px",
              backgroundColor: "lightblue",
              padding: "10px",
            }}
          >
            {t("dispenseMedicine")}
          </h1>
        </div>

        <div className="container mt-5">
          <div className="row">
            <div className="col-md-4">
              <label
                className="form-label"
                style={{
                  fontSize: "12px",
                  marginTop: "8px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {t("patientName")} <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={patientName}
                placeholder={t("enterPatientName")}
                onChange={(e) => setPatientName(e.target.value)}
                required
                style={{ fontSize: "12px" }}
              />
            </div>

            <div className="col-md-4">
              <label
                className="form-label"
                style={{
                  fontSize: "12px",
                  marginTop: "8px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {t("patientContactNumber")}{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={t("enterContactNumber")}
                value={patientContact}
                onChange={(e) => setPatientContact(e.target.value)}
                onKeyPress={(e) => {
                  // Allow only digits (0-9) and limit length to 10 characters
                  const isValid =
                    /^[0-9]*$/.test(e.key) && e.target.value.length < 10;
                  if (!isValid) {
                    e.preventDefault();
                  }
                }}
                required
                style={{ fontSize: "12px" }}
              />
            </div>

            <div className="col-md-4">
              <label
                className="form-label"
                style={{
                  fontSize: "12px",
                  marginTop: "8px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {t("doctorName")} <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={t("enterDoctorName")}
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                required
                style={{ fontSize: "12px" }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <label
                className="form-label"
                style={{
                  fontSize: "12px",
                  marginTop: "8px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {t("doctorRegNo")} <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={doctorRegNo}
                placeholder={t("enterDoctorRegNo")}
                onChange={(e) => setDoctorRegNo(e.target.value)}
                required
                style={{ fontSize: "12px" }}
              />
            </div>

            <div className="col-md-4">
              <label
                className="form-label"
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginTop: "8px",
                  marginBottom: "8px",
                }}
              >
                {t("hospitalName")} <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                required
                placeholder={t("enterHospitalName")}
                style={{ fontSize: "12px" }}
              />
            </div>

            <div className="col-md-4">
              <label
                className="form-label"
                style={{
                  fontSize: "12px",
                  marginTop: "8px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {t("prescriptionDate")} <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                className="form-control"
                placeholder={t("ddmmyy")}
                value={prescriptionDate}
                onChange={(e) => setPrescriptionDate(e.target.value)}
                required
                style={{ fontSize: "12px" }}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <label
                className="form-label"
                style={{
                  fontSize: "12px",
                  marginTop: "8px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {t("prescriptionType")} <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="form-select"
                value={prescriptionType}
                onChange={(e) => setPrescriptionType(e.target.value)}
                required
                style={{ fontSize: "12px" }}
              >
                <option value="">{t("selectType")}</option>
                {/* <option value="In-Hospital">In-Hospital</option> */}
                <option value="Outside Hospital">{t("outsideHospital")}</option>
              </select>
            </div>

            <div className="col-md-4">
              <label
                className="form-label"
                style={{
                  fontSize: "12px",
                  marginTop: "8px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {t("uploadPrescriptionImage")}{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handlePrescriptionImageChange}
                required
                style={{ fontSize: "12px" }}
              />
            </div>
          </div>
          <br></br>
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
                <h1 style={{ fontSize: "14px" }}>{t("enterQuantity")}:</h1>
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
                  placeholder={t("enterDays")}
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
                      label: t("selectMedicineFromInventory"),
                      value: "",
                    },
                    ...items.map((item) => ({
                      value: item.itemName,
                      label: `Name: ${item.itemName} / BatchNo: ${
                        item.batchNo
                      } / ExpiryDate: ${formatDate(item.expiryDate)}`,
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
                  {t("addtoOrder")}
                </button>
              </div>
            </div>
            <br></br>
            <div className="row align-items-center">
              <div className="col-2"></div>
              <div className="col-4">
                {fetchStatus === "success" && (
                  <div className="col-3" style={{ color: "green" }}>
                    {t("datafetchedsuccessfully")}
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
              <h2 style={h2Style}>{t("medicineOrderSummary")}</h2>
              <Table
                style={{ verticalAlign: "middle", textAlign: "center" }}
                responsive
                bordered
                hover
              >
                <thead>
                  <tr>
                    <th className="text-center nowrip">
                      {t("dispenseMedicineTable.srNo")}
                    </th>
                    <th className="text-center nowrip">
                      {t("dispenseMedicineTable.medicineName")}
                    </th>
                    <th className="text-center nowrip">
                      {t("dispenseMedicineTable.batchNumber")}
                    </th>
                    <th className="text-center nowrip">
                      {t("dispenseMedicineTable.expiryDate")}
                    </th>
                    <th className="text-center nowrip">
                      {t("dispenseMedicineTable.unitPrice")}
                    </th>
                    <th className="text-center nowrip">
                      {t("dispenseMedicineTable.quantity")}
                    </th>
                    <th className="text-center nowrip" id="print-button">
                      {t("dispenseMedicineTable.actions")}
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
                        {formatDate(order.item.expiryDate)}
                      </td>
                      <td className="text-center nowrip">
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
                          {t("dispenseMedicineTable.remove")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* <div>
              <h2 style={h1Style}>
                {t("cartTotal")}:<span>&#8377;</span> {cartTotal} <strong></strong>
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
              disabled={orders.length === 0}
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
                {t("goBack")}
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
