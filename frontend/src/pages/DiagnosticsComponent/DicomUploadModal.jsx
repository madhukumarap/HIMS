import React, { useState } from "react";
import { Modal, Button, Form, ProgressBar, Alert } from "react-bootstrap";
import { uploadDicomFile } from "../Diacom/api/dicom";

// Add this component to your file
const DicomUploadModal = ({
  show,
  handleClose,
  bookingData,
  onUploadSuccess,
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file); // backend multer expects "file"
      formData.append("patientId", bookingData.PatientID);
      formData.append("doctorId", bookingData.doctorId);

      await uploadDicomFile(formData);

      onUploadSuccess();
      handleClose();
    } catch (err) {
      setError("File upload failed. Please try again.");
    } finally {
      setUploading(false);
      setFile(null);
      setProgress(0);
    }
  };

  //   const handleUpload = async () => {
  //     if (!file) return;

  //     setUploading(true);
  //     setError("");

  //     try {
  //       // Create form data to send the file
  //       const formData = new FormData();
  //       formData.append("dicomFile", file);
  //       formData.append("bookingId", bookingData.id);
  //       formData.append("patientId", bookingData.PatientID);
  //       formData.append("patientName", bookingData.PatientName);

  //       // Simulate upload progress (replace with actual API call)
  //       for (let i = 0; i <= 100; i += 10) {
  //         setTimeout(() => setProgress(i), i * 50);
  //       }

  //       // Simulate API call delay
  //       await new Promise((resolve) => setTimeout(resolve, 2000));

  //       onUploadSuccess();
  //       handleClose();
  //     } catch (err) {
  //       setError("File upload failed. Please try again.");
  //     } finally {
  //       setUploading(false);
  //       setFile(null);
  //       setProgress(0);
  //     }
  //   };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Upload DICOM File for {bookingData?.PatientName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Patient:</strong> {bookingData?.PatientName}
        </p>
        <p>
          <strong>Booking ID:</strong> {bookingData?.id}
        </p>

        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select DICOM file (.dcm)</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            accept=".dcm"
            disabled={uploading}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DicomUploadModal;
