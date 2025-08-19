import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    SKU: "",
    itemName: "",
    composition: "",
    description: "",
    quantityIn: 0,
    quantityOut: "",
    unitPrice: 0,
    batchNo: "",
    expiryDate: "",
    unit: "",
    dateIn: "",
    dateOut: "",
    balanceQuantity: 0,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getInventryItems/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      product.balanceQuantity = product.quantityIn - product.quantityOut;
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/inventory/${id}`,
        product
      );
      toast.success("Updated successfully", {
        position: toast.POSITION.TOP_CENTER, // Set position to top center
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate(`/InventoryManagementPage`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <form onSubmit={handleSubmit}>
        <div className="container mt-5">
          <div className="form-group">
            <br />
            <br />
            <h2>
              <label htmlFor="id">Update Inventory Item of Id :{id}</label>
            </h2>
            <br />
            <strong>
              {" "}
              <label htmlFor="SKU">SKU:</label>
            </strong>
            <input
              className="form-control"
              type="text"
              name="SKU"
              id="SKU"
              value={product.SKU}
              onChange={handleInputChange}
              required
            />
            <strong>
              {" "}
              <label htmlFor="itemName">ItemName:</label>
            </strong>
            <input
              className="form-control"
              type="text"
              name="itemName"
              id="itemName"
              value={product.itemName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <strong>
              {" "}
              <label htmlFor="description">Composition:</label>
            </strong>
            <input
              className="form-control"
              type="text"
              name="composition"
              id="composition"
              value={product.composition}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <strong>
              {" "}
              <label htmlFor="description">Description:</label>
            </strong>
            <input
              className="form-control"
              type="text"
              name="description"
              id="description"
              value={product.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <strong>
              {" "}
              <label htmlFor="batchNo">BatchNo:</label>
            </strong>
            <input
              className="form-control"
              type="text"
              name="batchNo"
              id="batchNo"
              value={product.batchNo}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <strong>
              {" "}
              <label htmlFor="unitPrice">Unit Price:</label>
            </strong>
            <input
              className="form-control"
              type="number"
              name="unitPrice"
              id="unitPrice"
              value={product.unitPrice}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <strong>
              {" "}
              <label htmlFor="unit">Unit:</label>
            </strong>
            <input
              className="form-control"
              type="text"
              name="unit"
              id="unit"
              value={product.unit}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <strong>
              {" "}
              <label>Expiry Date:</label>
            </strong>
            <br />
            <input
              type="date"
              name="expiryDate"
              min={new Date().toISOString().split("T")[0]}
              id="expiryDate"
              className="form-control"
              value={product.expiryDate}
              onChange={handleInputChange}
              placeholder="Enter expiry date"
              required
            />
          </div>
          {/* <div className="form-group">
          <strong>  <label>DateIn:</label></strong>
            <br />
            <input
              type="date"
              name="dateIn"
              id="dateIn"
              className="form-control"
              value={product.dateIn}
              onChange={handleInputChange}
              required
            />
          </div> */}
          <div className="form-group">
            <strong>
              {" "}
              <label htmlFor="quantity">QuantityIn:</label>
            </strong>
            <input
              className="form-control"
              type="number"
              name="quantityIn"
              id="quantityIn"
              value={product.quantityIn}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* <div className="form-group">
            <strong>  <label>DateOut:</label></strong>
            <br />
            <input
              type="date"
              name="dateOut"
              id="dateOut"
              className="form-control"
              value={product.dateOut}
              onChange={handleInputChange}
              required
            />
          </div> */}
          {/* <div className="form-group">
            <strong>   <label htmlFor="quantity">QuantityOut:</label></strong>
            <input
              className="form-control"
              type="number"
              name="quantityOut"
              id="quantityOut"
              value={product.quantityOut}
              onChange={handleInputChange} required
            />
          </div> */}
          {/* <div className="form-group">
            <strong>    <label htmlFor="quantity">Balance Quantity [Quatity In - Quatity Out]:</label></strong>
            <input
              className="form-control"
              type="number"
              name="balanceQuantity"
              id="balanceQuantity"
              value={product.quantityIn - product.quantityOut}
              onChange={handleInputChange} required
            />
          </div> */}
          <br />
          <button className="btn btn-secondary" type="submit">
            Update Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateForm;
