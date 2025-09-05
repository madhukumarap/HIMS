import React, { useState } from "react";
import { Modal, Button, ListGroup, Badge, Alert } from "react-bootstrap";
import {
  FaEye,
  FaDownload,
  FaCalendarAlt,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import DicomViewer from "../Diacom/DicomViewer";
import AuthService from "../../services/auth.service";

const DicomViewerModal = ({ show, handleClose, dicomFiles, patientData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDicomViewer, setShowDicomViewer] = useState(false);
  const [selectedDicomId, setSelectedDicomId] = useState(null);

  const currentUser = AuthService.getCurrentUser();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleDownload = async (file) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/${file.id}/download`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dicom-${file.orthancInstanceId || file.id}.dcm`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Download failed:", response.status);
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleViewInViewer = (file) => {
    setSelectedDicomId(file.id);
    setShowDicomViewer(true);
  };

  const handleCloseDicomViewer = () => {
    setShowDicomViewer(false);
    setSelectedDicomId(null);
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setShowDicomViewer(false);
    setSelectedDicomId(null);
    handleClose();
  };

  return (
    <>
      {/* Main Modal */}
      <Modal show={show} onHide={handleCloseModal} size="lg" className="mt-5">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEye className="me-2" />
            DICOM Files for Patient: {patientData?.PatientName} (ID:{" "}
            {patientData?.PatientID})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {dicomFiles.length === 0 ? (
            <Alert variant="info" className="text-center">
              <FaTimes className="me-2" />
              No DICOM files found for this patient.
            </Alert>
          ) : (
            <div className="row">
              <div className="col-md-4">
                <h6>Available DICOM Files ({dicomFiles.length}):</h6>
                <ListGroup style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {dicomFiles.map((file) => (
                    <ListGroup.Item
                      key={file.id}
                      action
                      active={selectedFile?.id === file.id}
                      onClick={() => handleFileSelect(file)}
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">File #{file.id}</div>
                        <small className="text-muted">
                          <FaCalendarAlt className="me-1" />
                          {new Date(file.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <Badge
                        bg={file.orthancInstanceId ? "success" : "warning"}
                        pill
                      >
                        {file.orthancInstanceId ? "Uploaded" : "Pending"}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
              <div className="col-md-8">
                {selectedFile ? (
                  <div>
                    <h6>DICOM File Details</h6>
                    <div className="card">
                      <div className="card-body">
                        <p>
                          <strong>File ID:</strong> {selectedFile.id}
                        </p>
                        <p>
                          <strong>Orthanc Instance ID:</strong>{" "}
                          {selectedFile.orthancInstanceId || "N/A"}
                        </p>
                        <p>
                          <strong>Orthanc Study ID:</strong>{" "}
                          {selectedFile.orthancStudyId || "N/A"}
                        </p>
                        <p>
                          <strong>Patient ID:</strong>{" "}
                          {selectedFile.patientId || "N/A"}
                        </p>
                        <p>
                          <strong>Doctor ID:</strong>{" "}
                          {selectedFile.doctorId || "N/A"}
                        </p>
                        <p>
                          <strong>Consultation ID:</strong>{" "}
                          {selectedFile.consultationId || "N/A"}
                        </p>
                        <p>
                          <strong>Created:</strong>{" "}
                          {new Date(selectedFile.createdAt).toLocaleString()}
                        </p>
                        <p>
                          <strong>Updated:</strong>{" "}
                          {new Date(selectedFile.updatedAt).toLocaleString()}
                        </p>

                        {selectedFile.orthancInstanceId && (
                          <div className="mt-3">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleDownload(selectedFile)}
                              className="me-2"
                            >
                              <FaDownload /> Download DICOM
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleViewInViewer(selectedFile)}
                              style={{ marginTop: "1rem" }}
                            >
                              <FaEye /> View in Viewer
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center" style={{ padding: "100px 0" }}>
                    <FaEye size={48} className="text-muted mb-3" />
                    <p>Select a DICOM file to view details</p>
                    <small className="text-muted">
                      {dicomFiles.length} files available for this patient
                    </small>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* DICOM Viewer Modal */}
      <Modal
        show={showDicomViewer}
        onHide={handleCloseDicomViewer}
        size="xl"
        fullscreen="lg-down"
        dialogClassName="dicom-viewer-modal" // Add custom class
        contentClassName="dicom-viewer-content" // Add custom class for content
        style={{ marginTop: "2rem", marginLeft: "auto", marginRight: "100px" }} // Push to right
        dialogStyle={{
          maxWidth: "95%",
          width: "95%",
          margin: "1.75rem auto 1.75rem 50px",
        }}
      >
        <Modal.Header closeButton style={{ padding: "10px 15px" }}>
          <Modal.Title style={{ fontSize: "1.2rem" }}>
            <FaEye className="me-2" />
            DICOM Viewer - File #{selectedDicomId}
            {selectedFile && (
              <small className="text-muted ms-2">
                Patient: {patientData?.PatientName}
              </small>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            marginTop: "10px",
            // padding: 0,
            overflow: "hidden",
            minHeight: "80vh",
          }}
        >
          {selectedDicomId && (
            <DicomViewer
              dicomId={selectedDicomId}
              onBack={handleCloseDicomViewer}
            />
          )}
        </Modal.Body>
        <Modal.Footer style={{ padding: "10px 15px" }}>
          <Button variant="secondary" onClick={handleCloseDicomViewer}>
            <FaArrowLeft className="me-1" />
            Back to Files
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DicomViewerModal;
