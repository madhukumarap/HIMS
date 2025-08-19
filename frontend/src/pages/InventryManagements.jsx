import { useState, useEffect } from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Table, Form, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";

import { Link } from "react-router-dom";

function InventoryManagementPage() {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const [inventory, setInventory] = useState([]);
  const [SKU, setSKU] = useState("");
  const [itemName, setName] = useState("");
  const [composition, setComposition] = useState("");
  const [description, setDescription] = useState("");
  const [quantityIn, setQuantityIn] = useState(0);
  const [quantityOut, setQuantityOut] = useState(0);
  const [unitPrice, setPrice] = useState(0);
  const [balanceQuantity, setBalanceQuantity] = useState(0);
  const [batchNo, setBatchDetails] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [unit, setUnit] = useState("");
  const [dateIn, setDateIn] = useState("");
  const currentDate = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format
  const [dateOut, setDateOut] = useState(currentDate);

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

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }
  const [showForm, setShowForm] = useState(false);

  const handleAddButtonClick = () => {
    setShowForm(true);
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const handleAddInventoryItem = (event) => {
    event.preventDefault();
    const newInventoryItem = {
      itemName: itemName,
      SKU: SKU,
      composition: composition,
      description: description,
      quantityIn: quantityIn,
      quantityOut: quantityOut,
      unitPrice: unitPrice,
      batchNo: batchNo,
      expiryDate: expiryDate,
      unit: unit,
      dateIn: dateIn,
      dateOut: dateOut,
      balanceQuantity: quantityIn - quantityOut,
    };
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/createItem`,
        newInventoryItem,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        setInventory([...inventory, response.data]);
        toast.success("Saved successfully", {
          position: toast.POSITION.TOP_CENTER, // Set position to top center
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        window.location.reload();
      });
  };

  const handleDeleteInventoryItem = (inventoryItemId) => {
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/api/inventory/${inventoryItemId}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        toast.success("Deleted successfully", {
          position: toast.POSITION.TOP_CENTER, // Set position to top center
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setInventory(inventory.filter((item) => item.id !== inventoryItemId));
      });
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
      headerStyle: { cursor: "pointer" },
    },

    {
      dataField: "SKU",
      text: "SKU",
    },
    {
      dataField: "itemName",
      text: "ItemName",
      sort: true,
      headerStyle: { cursor: "pointer" },
    },

    {
      dataField: "composition",
      text: "Composition",
    },
    {
      dataField: "description",
      text: "Description",
    },
    {
      dataField: "batchNo",
      text: "Batch No",
      sort: true,
      headerStyle: { cursor: "pointer" },
    },
    {
      dataField: "expiryDate",
      text: "Expiry Date",
      formatter: (cell, row) => {
        const currentDate = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format
        const expired = cell < currentDate; // Check if the expiry date is before the current date

        const formattedDate = new Date(cell).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format the date as a localized string

        const cellStyle = expired
          ? { backgroundColor: "red", color: "white" }
          : {}; // Define the style object with 'background-color: red; color: white;' if expired, or empty object otherwise

        return <span style={cellStyle}>{formattedDate}</span>;
      },
      sort: true,
      headerStyle: { cursor: "pointer" },
    },

    {
      dataField: "unitPrice",
      text: "UnitPrice",
    },
    {
      dataField: "unit",
      text: "Unit",
      sort: true,
      headerStyle: { cursor: "pointer" },
    },
    {
      dataField: "dateIn",
      text: "Date In",
      formatter: (cell, row) => {
        const date = new Date(cell);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
      sort: true,
      headerStyle: { cursor: "pointer" },
    },

    {
      dataField: "quantityIn",
      text: "QuantityIn",
    },

    {
      dataField: "dateOut",
      text: "Date Out",
      formatter: (cell, row) => {
        const date = new Date(cell);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      dataField: "quantityOut",
      text: "Sold Quantity",
    },
    {
      dataField: "balanceQuantity",
      text: " Balance Quantity ",
    },

    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <>
          <Link to={`/updateItem/${row.id}`}>
            <button style={{ marginTop: "10px" }} className="btn btn-secondary">
              Update
            </button>
          </Link>

          <br />

          <button
            style={{ marginTop: "10px" }}
            className="btn btn-danger"
            onClick={() => handleDeleteInventoryItem(row.id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  const filteredInventory = inventory.filter((item) => {
    return (
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const [error, setError] = useState(false);

  const handlePriceChange = (e) => {
    const inputPrice = e.target.value;
    // Validate if the input contains only digits
    const isValidPrice = /^\d+$/.test(inputPrice);
    if (isValidPrice) {
      setPrice(inputPrice);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!currentUser) {
    return <h3>You are not logged in</h3>;
  }
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_PHARMACIST")
  ) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return <h2>Admin or Pharmacist role is required!</h2>;
    // You can handle the redirection or error message display as per your requirement
  }

  const style = {
    width:
      "100%" /* Adjust the Inventory Inventory Management as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
  };
  return (
    <div style={style}>
      <Container className="mt-5 text-center">
        <div className="container mt-5">
          <h2 className="my-4">Add Inventory Item</h2>
          <div className="d-flex justify-content-end mb-2">
            <strong>
              {" "}
              <p className="text-muted">
                <span style={{ color: "red" }}>*</span>To Sort, click on column
                Name
              </p>
            </strong>
          </div>
          <button
            onClick={handleAddButtonClick}
            className="btn btn-primary mb-3"
          >
            Add Item
          </button>

          {showForm && (
            <div className="row justify-content-center">
              <div className="col-3">
                <form onSubmit={handleAddInventoryItem} className="mb-5">
                  {/* Add Inventory Item Form */}
                  <div className="form-group">
                    <strong>
                      <label>
                        SKU
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                        :
                      </label>
                    </strong>
                    <input
                      type="text"
                      placeholder="Enter Item SKU Code"
                      required
                      value={SKU}
                      onChange={(e) => setSKU(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <br />
                  <div className="form-group">
                    <strong>
                      <label>
                        Item Name
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                        :
                      </label>
                    </strong>
                    <input
                      type="text"
                      placeholder="Enter Item Name"
                      required
                      value={itemName}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <br />
                  <div className="form-group">
                    <strong>
                      <label>
                        Composition
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                        :
                      </label>
                    </strong>
                    <input
                      type="text"
                      required
                      placeholder="Enter Item Composition"
                      value={composition}
                      onChange={(e) => setComposition(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <br />
                  <div className="form-group">
                    <strong>
                      <label>
                        Description
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                        :
                      </label>
                    </strong>
                    <input
                      placeholder="Enter Item Description"
                      type="text"
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <br />

                  <div className="form-group">
                    <strong>
                      <label>
                        Unit Price
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                        :
                      </label>
                    </strong>
                    <input
                      type="number"
                      required
                      value={unitPrice}
                      onChange={(e) => {
                        const inputPrice = e.target.value;
                        if (inputPrice === "" || inputPrice > 0) {
                          setPrice(inputPrice);
                        }
                      }}
                      className="form-control"
                    />
                  </div>
                  <br />

                  <div className="form-group">
                    <strong>
                      <label>
                        Unit
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                        :
                      </label>
                    </strong>
                    <input
                      placeholder="Enter Item Unit"
                      type="text"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <br />
                  <div className="form-group">
                    <strong>
                      <label>
                        Batch No
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                        :
                      </label>
                    </strong>
                    <input
                      type="text"
                      required
                      placeholder="Enter Item Batch Number"
                      value={batchNo}
                      onChange={(e) => setBatchDetails(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <br />
                  <div className="form-group">
                    <strong>
                      <label>
                        Expiry Date
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                        :
                      </label>
                    </strong>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      required
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <br />
                  <div className="form-group">
                    <strong>
                      <label>
                        DateIn
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                        :
                      </label>
                    </strong>
                    <input
                      type="date"
                      required
                      value={dateIn}
                      onChange={(e) => setDateIn(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <br />
                  <div className="form-group">
                    <strong>
                      <label>
                        QuantityIn
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                        :
                      </label>
                    </strong>
                    <input
                      type="number"
                      required
                      value={quantityIn}
                      onChange={(e) => {
                        const inputQuantity = e.target.value;
                        if (inputQuantity === "" || inputQuantity > 0) {
                          setQuantityIn(inputQuantity);
                        }
                      }}
                      className="form-control"
                    />
                  </div>
                  <br />
                  {/* <div className="form-group">
                  <strong><label>DateOut<span style={{ color: 'red', marginLeft: '5px' }}>*</span>:</label></strong>
                  <input type="date" required value={dateOut} onChange={e => setDateOut(e.target.value)} className="form-control" />
                </div>
                <br />
                <div className="form-group">
                  <strong><label>QuantityOut<span style={{ color: 'red', marginLeft: '5px' }}>*</span>:</label></strong>
                  <input
                    type="number"
                    required
                    value={quantityOut}
                    onChange={e => {
                      const inputQuantity = e.target.value;
                      if (inputQuantity === '' || inputQuantity > 0) {
                        setQuantityOut(inputQuantity);
                      }
                    }}
                    className="form-control"
                  />
                </div>
                <br /> */}

                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <button type="submit" className="btn btn-secondary">
                      Add Item
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleToggleForm}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-md-6">
              <h2 className="my-4">Inventory Items List</h2>
            </div>
            <div className="col-md-6">
              <input
                type="text"
                placeholder="Search Items by Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control mb-3"
              />
            </div>
          </div>

          <BootstrapTable
            keyField="id"
            data={filteredInventory}
            columns={columns}
          />
        </div>
      </Container>
    </div>
  );
}

export default InventoryManagementPage;
