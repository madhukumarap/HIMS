import React, { useState } from "react";
import { Modal, Button, ListGroup, Badge, Alert, Form, Dropdown } from "react-bootstrap";
import {
  FaEye,
  FaDownload,
  FaCalendarAlt,
  FaTimes,
  FaArrowLeft,
  FaShare,
} from "react-icons/fa";
import DicomViewer from "../Diacom/DicomViewer";
import AuthService from "../../services/auth.service";
import { toast } from "react-toastify";

const DicomViewerModal = ({
  show,
  handleClose,
  dicomFiles,
  imageFiles,
  patientData,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDicomViewer, setShowDicomViewer] = useState(false);
  const [selectedDicomId, setSelectedDicomId] = useState(null);
  const [viewType, setViewType] = useState("dicom"); // "dicom" | "image"
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]); // You'll need to populate this from your API
  const [isForwarding, setIsForwarding] = useState(false);

  const currentUser = AuthService.getCurrentUser();

  // Convert dicomFiles to the format expected by DicomViewer
  const convertedFiles = dicomFiles.map((file) => ({
    id: file.id,
    original_name: `DICOM-${file.orthancInstanceId || file.id}`,
    file_name: `DICOM-${file.orthancInstanceId || file.id}`,
    file_size: 0, // You might need to get this from your API
    file_type: "dicom",
    mime_type: "application/dicom",
    is_dicom: true,
    orthanc_instance_id: file.orthancInstanceId,
    orthanc_study_id: file.orthancStudyId,
    dicom_metadata: file.metadata || {},
    consultation_id: 0, // You might need to get this from your API
    tenant_id: 0, // You might need to get this from your API
  }));

  // Fetch doctors list - you'll need to implement this based on your API
  const fetchDoctors = async () => {
    try {
      // Replace this with your actual API call to get doctors list
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/getDoctorData`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      });
      
      if (response.ok) {
        const doctorsData = await response.json();
        console.log(doctorsData, "doctorsData");
        setDoctors(doctorsData);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Filter doctors to exclude the current doctor associated with the selected file
  const getFilteredDoctors = () => {
    console.log(selectedFile,"selectedFile")
    if (!selectedFile) return doctors;
    
    // Filter out the doctor who is already associated with this DICOM file
    return doctors.filter(doctor => 
      doctor.id !== selectedFile.userId
    );
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    // Reset doctor dropdown when selecting a new file
    setShowDoctorDropdown(false);
    setSelectedDoctor(null);
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

  const handleForwardReport = () => {
    setShowDoctorDropdown(true);
    fetchDoctors(); // Fetch doctors when the button is clicked
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleConfirmForward = async () => {
    if (!selectedDoctor || !selectedFile) {
      alert("Please select a doctor to forward the report.");
      return;
    }

    setIsForwarding(true);
    try {
      // API call to forward the report
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/report-forward`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${currentUser?.Token}`,
          },
          body: JSON.stringify({
            dicomId: selectedFile.id, // Send DICOM file ID
            doctorId: selectedDoctor.id, // Send selected doctor ID
            fromDoctor: selectedFile.userId // from doctor ID
            // Add any other necessary data
          }),
        }
      );

      if (response.ok) {
        toast.success('Report forwarded successfully!')
        // alert("Report forwarded successfully!");
        setShowDoctorDropdown(false);
        setSelectedDoctor(null);
      } else {
        const errorData = await response.json();
        alert(`Failed to forward report: ${errorData.message || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error forwarding report:", error);
      alert("Error forwarding report. Please try again.");
    } finally {
      setIsForwarding(false);
    }
  };

  const handleCancelForward = () => {
    setShowDoctorDropdown(false);
    setSelectedDoctor(null);
  };

  const handleCloseDicomViewer = () => {
    setShowDicomViewer(false);
    setSelectedDicomId(null);
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setShowDicomViewer(false);
    setSelectedDicomId(null);
    setShowDoctorDropdown(false);
    setSelectedDoctor(null);
    handleClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredDoctors = getFilteredDoctors();

  return (
    <>
      {/* Main Modal */}
      <Modal
        centered
        show={show}
        onHide={handleCloseModal}
        size="lg"
        className="mt-5 "
      >
        <Modal.Header
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
            color: "black",
          }}
          closeButton
        >
          <Modal.Title>
            Files for Patient : {patientData?.PatientName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Dropdown to choose view type */}
          <Form.Group className="mb-3">
            <Form.Label>Choose File Type</Form.Label>
            <Form.Select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
            >
              <option value="dicom">DICOM Files</option>
              <option value="image">Images</option>
            </Form.Select>
          </Form.Group>

          {/* Conditionally render content */}
          {viewType === "dicom" ? (
            dicomFiles.length === 0 ? (
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
                          <small className=" text-white">
                            <FaCalendarAlt className="me-1 text-white" />
                            {formatDate(new Date(file.createdAt))}
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
                            <strong>Current Doctor ID:</strong>{" "}
                            {selectedFile.doctorId || "N/A"}
                          </p>
                          <p>
                            <strong>Created:</strong>{" "}
                            {formatDate(new Date(selectedFile.createdAt))}
                          </p>

                          {selectedFile.orthancInstanceId && (
                            <div className="mt-3">
                              <div className="">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleDownload(selectedFile)}
                                  className="me-2 mt-0 btn btn-primary btn-sm"
                                >
                                  <FaDownload /> Download DICOM
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleViewInViewer(selectedFile)}
                                  className="me-2  btn btn-secondary btn-sm "
                                >
                                  <FaEye /> View in Viewer
                                </Button>
                                <Button
                                  variant="info"
                                  size="sm"
                                  onClick={handleForwardReport}
                                  className="flex-fill"
                                >
                                  <FaShare /> Forward Report
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Doctor Selection Dropdown */}
                          {showDoctorDropdown && (
                            <div className="mt-3 p-3 border rounded">
                              <h6>Select Doctor to Forward Report</h6>
                              <Form.Group className="mb-3">
                                <Form.Label>Choose Doctor</Form.Label>
                                <Form.Select
                                  value={selectedDoctor?.id || ""}
                                  onChange={(e) => {
                                    const doctorId = e.target.value;
                                    const doctor = filteredDoctors.find(d => d.id === parseInt(doctorId));
                                    handleDoctorSelect(doctor);
                                  }}
                                >
                                  <option value="">Select a doctor</option>
                                  {filteredDoctors.length > 0 ? (
                                    filteredDoctors.map((doctor) => (
                                      <option key={doctor.id} value={doctor.id}>
                                        {doctor.Dr} - {doctor.FirstName} {doctor.LastName}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="" disabled>
                                      No other doctors available
                                    </option>
                                  )}
                                </Form.Select>
                              </Form.Group>
                              {selectedFile.doctorId && (
                                <Alert variant="info" className="small">
                                  <strong>Note:</strong> The current doctor (ID: {selectedFile.doctorId}) is excluded from this list.
                                </Alert>
                              )}
                              <div className="d-flex gap-2">
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={handleConfirmForward}
                                  disabled={!selectedDoctor || isForwarding || filteredDoctors.length === 0}
                                >
                                  {isForwarding ? "Forwarding..." : "Confirm Forward"}
                                </Button>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={handleCancelForward}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center" style={{ padding: "100px 0" }}>
                      <p className="h6">Select a DICOM file to view details</p>
                      <small className="text-muted">
                        {dicomFiles.length} files available for this patient
                      </small>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : imageFiles.length === 0 ? (
            <Alert variant="info" className="text-center">
              <FaTimes className="me-2" />
              No Images found for this booking.
            </Alert>
          ) : (
            <div>
              <h6>Available Images ({imageFiles.length}):</h6>
              <div className="d-flex flex-wrap">
                {imageFiles.map((img, index) => (
                  <div key={img.id} className="m-2 text-center">
                    <a
                      href={img.imagePath}
                      download={`${index + 1}.png`} // <-- numbered names
                    >
                      <img
                        src={img.imagePath}
                        alt={`Scan ${index + 1}`}
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          cursor: "pointer",
                        }}
                      />
                    </a>
                    <p className="small mt-1">Image {index + 1}</p>
                  </div>
                ))}
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
        dialogClassName="dicom-viewer-modal"
        contentClassName="dicom-viewer-content"
        style={{ marginTop: "2rem", marginLeft: "auto", marginRight: "100px" }}
        dialogStyle={{
          maxWidth: "95%",
          width: "95%",
          margin: "1.75rem auto 1.75rem 50px",
        }}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
            color: "black",
            padding: "10px 15px",
          }}
        >
          <Modal.Title style={{ fontSize: "1.2rem" }}>
            DICOM Viewer - File #{selectedDicomId}{" "}
            {selectedFile && (
              <small>Patient : {patientData?.PatientName}</small>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            marginTop: "10px",
            overflow: "hidden",
            minHeight: "80vh",
          }}
        >
          {selectedDicomId && (
            <DicomViewer
              dicomId={selectedDicomId}
              consultationFiles={convertedFiles} // Pass the converted files
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