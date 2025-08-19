import React, { useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Container, Col, Row, Table } from "react-bootstrap";

function QRCodeScanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [scannedData, setScannedData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleScanImage = async () => {
    if (!selectedImage) {
      return;
    }

    const formData = new FormData();
    formData.append("qrCodeImage", selectedImage);
    formData.append("width", selectedImage.width);
    formData.append("height", selectedImage.height);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/scan-qr-text`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setScannedData(response.data.scannedData);
      setShowModal(true);
      setShowToast(true);
      toast.success(" scanned successfully!");
    } catch (error) {
      console.error("Error scanning QR code:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleToastClose = () => {
    setShowToast(false);
  };

  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      <div>
        <label htmlFor="fileInput">Choose Image to scan</label>{" "}
        <input
          className="form-control"
          type="file"
          accept="image/*"
          id="fileInput"
          onChange={handleImageSelect}
        />{" "}
        <br></br>
        <Button variant="success" onClick={handleScanImage}>
          Scan Code Image
        </Button>
        {/* {scannedData && (
        <div>
          <h2>Scanned Data:</h2>
          <p>{scannedData}</p>
        </div>
      )} */}
        <Modal
          style={{ marginTop: "20px" }}
          centered
          show={showModal}
          onHide={handleCloseModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Scanned Code</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{scannedData}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
}

export default QRCodeScanner;
