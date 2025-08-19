import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./print-styles.css";
import Select from "react-select";
import { Table, Container, Form, Button, Modal } from "react-bootstrap";

import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InvoiceComponent from "./InvoiceComponent"; // Replace './InvoiceComponent' with the actual file path
import AuthService from "../services/auth.service";

function SellOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [orders, setOrders] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [patientData, setPatientData] = useState(null);
  const [expiryDays, setExpiryDays] = useState(7);
  const [fetchStatus, setFetchStatus] = useState("");

  //dispensed medicine get from node js
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/GetDispensedListOfPr/${id}`)
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
          `${import.meta.env.VITE_API_URL}/api/getOnePrescription/${id}`
        );
        setPatientData(response.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFetchData2 = () => {
    const prescriptionId = id;
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/getIfExpiryMore-7/${prescriptionId}`,
        {
          params: {
            expiryDays: expiryDays, // Pass the expiryDays value as a query parameter,
          },
        }
      )
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
        setErrorMessage("Item already added to the order");
        return;
      }

      //alert(JSON.stringify(selected));

      // Create a new order object
      const newOrder = {
        id: selected.id,
        item: selected,
        quantity: quantity,
      };

      const matchingMedicine = patientData.medicines.find(
        (medicine) => medicine.InventoryitemNameID === newOrder.id
      );
      // alert(JSON.stringify(matchingMedicine));
      if (matchingMedicine && matchingMedicine.quantity < newOrder.quantity) {
        //alert("not more quantity")
        setErrorMessage("Entered quantity Greater than prescribed quantiity");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000); // Clear the error message after 5 seconds
        return;
      }
      const quantity2 = newOrder.item;
      if (newOrder.quantity > quantity2.balanceQuantity) {
        //  setOrders([...orders, newOrder]);
        //alert()
        setErrorMessage(
          "Entered quantity Greater than available quantity in inventory"
        );
        setTimeout(() => {
          setErrorMessage("");
        }, 5000); // Clear the error message after 5 seconds
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
    // Show a confirmation alert
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the order ?"
    );

    if (confirmSubmit) {
      // Send the orders data to the server
      const data = {
        dispenseID: patientData.prescriptionId + ID,
        totalMedicineAmount: cartTotal,
        orders: orders,
        patientData: patientData,
      };

      axios
        .post(`${import.meta.env.VITE_API_URL}/api/saveDispensedData`, data)
        .then((response) => {
          console.log("Order submitted successfully");
          // Print the page
          // window.print();
          toast.success(
            "Order submitted successfully!",
            {
              position: toast.POSITION.TOP_END,
              autoClose: 3000,
            },
            {
              style: { fontSize: "13px" },
            }
          );
          // navigate("/PharmacistPrescriptionList")
        })
        .catch((error) => {
          console.error("Error submitting order:", error);
        });
    }
  };

  const handleOrderAndPrint = () => {
    handleSubmitOrder();
    // handlePrint();
    //  navigate("/PharmacistPrescriptionList");
    window.location.reload();
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
  if (currentUser && !currentUser.roles.includes("ROLE_PHARMACIST")) {
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={h1Style}> Dispense Medicine</h2>
          </header>
        </div>

        <div className="container mt-5">
          <h1 className="mb-4">
            {/* <h1 style={h3Style}>Search Medicine From Inventory</h1> */}
          </h1>

          <div className="col-md-2"></div>

          <div
            className="mb-12"
            style={{ width: "100%", marginBottom: "0rem" }}
          >
            <div className="row align-items-center">
              <div className="col-2">Enter Expiry Days:</div>
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
                  Fetch Data
                </button>
              </div>

              <div className="col-3">
                <Select
                  styles={customStyles}
                  value={
                    selectedItem
                      ? { label: selectedItem, value: selectedItem }
                      : {
                          label:
                            "-- Select prescribed Medicine From Inventory --",
                          value: "",
                        }
                  }
                  onChange={(selectedOption) =>
                    setSelectedItem(selectedOption.value)
                  }
                  options={[
                    {
                      label: "-- Select Prescribed Medicine From Inventory --",
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
                  Enter Quantity:
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
                  style={{ fontSize: "13px", padding: "4px 5px" }}
                  className="btn btn-primary btn-sm"
                  onClick={handleAddOrder}
                  disabled={!selectedItem || quantity <= 0}
                >
                  Add to Order
                </button>
              </div>
            </div>
            <br></br>
            <div className="row align-items-center">
              <div className="col-2"></div>
              <div className="col-4">
                {fetchStatus === "success" && (
                  <div className="col-3" style={{ color: "green" }}>
                    Data fetched successfully
                  </div>
                )}
                {fetchStatus === "error" && (
                  <div className="col-2" style={{ color: "red" }}>
                    Error fetching data
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
            <h1 style={{ fontSize: "18px", textAlign: "center" }}>
              Dispensed Details
            </h1>

            <div className="container">
              {patientData && (
                <div>
                  <h2 style={h2Style}>
                    Patient Details And Prescribed Medicine
                  </h2>
                  <div className="card">
                    <div className="card-body">
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
                          style={{ paddingLeft: "0px", marginRight: "10px" }}
                        >
                          <p className="card-text">
                            <strong>Patient Name:</strong>{" "}
                            {patientData.PatientName}
                            <span style={{ marginRight: "60px" }}></span>
                            <strong>Prescribed by Doctor:</strong>{" "}
                            {patientData.PrescribedDoctor}
                          </p>

                          <p className="card-text">
                            <strong>Prescription Id:</strong>{" "}
                            {patientData.prescriptionId}
                            <span style={{ marginRight: "55px" }}></span>
                            <strong>Doctor RegistrationNo:</strong>{" "}
                            {patientData.RegistrationNo}
                          </p>

                          <p className="card-text">
                            <strong>Date of Prescription:</strong>{" "}
                            {formatDate(patientData.createdAt)}
                            <span style={{ marginRight: "42px" }}></span>
                            <strong>Dispensing ID:</strong>{" "}
                            {patientData.prescriptionId + "/" + ID}
                          </p>

                          <p className="card-text">
                            <strong>Date of Dispention:</strong>{" "}
                            {formatDate(today)}
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
                            <h2 style={h2Style}>
                              {" "}
                              <strong>Prescribed Medicines:</strong>{" "}
                            </h2>
                            <Table
                              style={{ verticalAlign: "middle" }}
                              responsive
                              bordered
                              striped
                            >
                              <thead>
                                <tr>
                                  <th style={{ whiteSpace: "nowrap" }}>
                                    Medicine Name
                                  </th>
                                  <th style={{ whiteSpace: "nowrap" }}>
                                    Dosage Amount
                                  </th>
                                  <th style={{ whiteSpace: "nowrap" }}>
                                    Clinical Advice
                                  </th>
                                  <th style={{ whiteSpace: "nowrap" }}>
                                    Start Date
                                  </th>
                                  <th style={{ whiteSpace: "nowrap" }}>
                                    Duration/LifeTime
                                  </th>
                                  {/*               <th style={{ textAlign: "center" }}>Timing</th> */}
                                  <th style={{ textAlign: "center" }}>
                                    Prescribed Quantity
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {patientData.medicines.map((medicine) => (
                                  <tr key={medicine.id}>
                                    <td>{medicine.medicineName}</td>
                                    <td>{medicine.dosageAmount}</td>
                                    <td>{medicine.food}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                      {formatDate(medicine.startDate)}
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

                      <br></br>

                      {patientData &&
                        patientData.medicines &&
                        patientData.medicines.length > 0 &&
                        medicines.length > 0 && (
                          <div>
                            <h2 style={h2Style}>
                              <strong>Dispensed Medicines:</strong>{" "}
                            </h2>
                            <Table
                              style={{ verticalAlign: "middle" }}
                              responsive
                              bordered
                              striped
                            >
                              <thead>
                                <tr>
                                  <th style={{ textAlign: "center" }}>
                                    DispenseID
                                  </th>
                                  <th style={{ whiteSpace: "nowrap" }}>
                                    Medicine Name
                                  </th>
                                  <th style={{ textAlign: "center" }}>
                                    BatchNo
                                  </th>
                                  <th style={{ textAlign: "center" }}>
                                    ExpiryDate
                                  </th>
                                  <th style={{ textAlign: "center" }}>
                                    UnitPrice
                                  </th>
                                  {/*               <th style={{ textAlign: "center" }}>Dosage Amount</th>
                                              <th style={{ textAlign: "center" }}>Clinical Advice</th> */}

                                  <th style={{ textAlign: "center" }}>
                                    Dispensed Quantity
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {medicines.map((medicine) => (
                                  <tr key={medicine.id}>
                                    <td>{medicine.DispenseID}</td>
                                    <td>{medicine.MedicineName}</td>
                                    <td>{medicine.BatchNumber}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                      {formatDate(medicine.ExpiryDate)}
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

            <div>
              <h2 style={h2Style}> Medicine Order Summary</h2>
              <Table
                style={{ verticalAlign: "middle", textAlign: "center" }}
                responsive
                bordered
                hover
              >
                <thead>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>Sr. No.</th>
                    <th style={{ whiteSpace: "nowrap" }}>Medicine Name</th>
                    <th style={{ whiteSpace: "nowrap" }}>Batch Number</th>
                    <th style={{ whiteSpace: "nowrap" }}>Expiry Date</th>
                    <th style={{ whiteSpace: "nowrap" }}>Unit Price</th>
                    <th style={{ textAlign: "center" }}>Quantity</th>
                    <th id="print-button">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{order.item.itemName}</td>
                      <td>{order.item.batchNo}</td>
                      <td>{formatDate(order.item.expiryDate)}</td>
                      <td>
                        <span>&#8377;</span>
                        {order.item.unitPrice}
                        <strong></strong>
                      </td>
                      <td>{order.quantity}</td>
                      <td>
                        <button
                          id="print-button"
                          className="btn btn-danger"
                          style={{ fontSize: "12px" }}
                          onClick={() => handleRemoveOrder(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div>
              <h2 style={h1Style}>
                Cart Total:<span>&#8377;</span> {cartTotal} <strong></strong>
              </h2>
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
              Submit Order
            </button>

            <Link to={`/PharmacistPrescriptionList`}>
              <button
                style={{
                  fontSize: "12px",
                  marginTop: "0px",
                  marginLeft: "20px",
                  padding: "4px 5px",
                }}
                className="btn btn-primary btn-sm"
              >
                Go Back
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
