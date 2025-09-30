import React, { useEffect, useState } from "react";
import { Modal, Button, ListGroup, Badge, Alert, Card } from "react-bootstrap";
import {
  FaEye,
  FaCalendarAlt,
  FaArrowLeft,
  FaUserMd,
  FaUserInjured,
  FaStethoscope,
  FaComment
} from "react-icons/fa";
import DicomViewer from "../Diacom/DicomViewer";
import AuthService from "../../services/auth.service";
import { toast } from "react-toastify";
import { getReportedDicomFiles } from "../Diacom/api/dicom";

const ReportedCase = () => {
  const currentUser = AuthService.getCurrentUser();
  const [loadingDicom, setLoadingDicom] = useState(false);
  const [dicomCases, setDicomCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showDicomViewer, setShowDicomViewer] = useState(false);
  const [selectedDicomId, setSelectedDicomId] = useState(null);
  
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoadingDicom(true);
        const response = await getReportedDicomFiles(currentUser?.email);
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          setDicomCases(response.data.data);
          setSelectedCase(response.data.data[0]); // Auto-select first case
        } else {
          toast.info(response.data.message || "No reported cases found");
        }
      } catch (error) {
        console.error("Error fetching reported cases:", error);
        toast.error("Failed to fetch reported cases");
      } finally {
        setLoadingDicom(false);
      }
    };
    
    fetchFiles();
  }, [currentUser?.email]);

  const handleCaseSelect = (caseItem) => {
    setSelectedCase(caseItem);
  };

  const handleViewInViewer = (caseItem) => {
    if (caseItem?.orthancInstanceId) {
      setSelectedDicomId(caseItem.orthancInstanceId);
      setShowDicomViewer(true);
    } else {
      toast.error("DICOM instance not available for viewing");
    }
  };

  const handleCloseDicomViewer = () => {
    setShowDicomViewer(false);
    setSelectedDicomId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Convert to the format expected by DicomViewer
  const getConvertedFiles = () => {
    if (!selectedCase) return [];
    
    return [{
      id: selectedCase.id,
      original_name: `DICOM-${selectedCase.orthancInstanceId || selectedCase.id}`,
      file_name: `DICOM-${selectedCase.orthancInstanceId || selectedCase.id}`,
      file_size: 0,
      file_type: "dicom",
      mime_type: "application/dicom",
      is_dicom: true,
      orthanc_instance_id: selectedCase.orthancInstanceId,
      orthanc_study_id: selectedCase.orthancStudyId,
      dicom_metadata: selectedCase.metadata || {},
      consultation_id: selectedCase.consultationId || 0,
      tenant_id: 0,
    }];
  };

  if (loadingDicom) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading reported cases...</p>
        </div>
      </div>
    );
  }

  if (!dicomCases || dicomCases.length === 0) {
    return (
      <div className="container-fluid">
        <Alert variant="info" className="text-center">
          No reported cases found for your account.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="text-primary">
            <FaStethoscope className="me-2" />
            Reported Cases ({dicomCases.length})
          </h2>
          <p className="text-muted">
            View your medical imaging reports and DICOM files
          </p>
        </div>
      </div>

      <div className="row">
        {/* Cases List */}
        <div className="col-md-4">
          <Card>
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">
                <FaUserInjured className="me-2" />
                Cases List
              </h6>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush" style={{ maxHeight: "600px", overflowY: "auto" }}>
                {dicomCases.map((caseItem) => (
                  <ListGroup.Item
                    key={caseItem.id}
                    action
                    active={selectedCase?.id === caseItem.id}
                    onClick={() => handleCaseSelect(caseItem)}
                    className="d-flex justify-content-between align-items-start py-3"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Case #{caseItem.id}</div>
                      <small className="text-muted d-block">
                        <FaCalendarAlt className="me-1" />
                        {formatDate(caseItem.createdAt)}
                      </small>
                      <small className="text-muted">
                        Patient: {caseItem.patientId || "N/A"}
                      </small>
                      {caseItem.comments && (
                        <small className="d-block text-info mt-1">
                          <FaComment className="me-1" />
                          Has comments
                        </small>
                      )}
                    </div>
                    <Badge
                      bg={caseItem.orthancInstanceId ? "success" : "warning"}
                      pill
                    >
                      {caseItem.orthancInstanceId ? "Ready" : "Pending"}
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>

        {/* Case Details Section */}
        <div className="col-md-8">
          <Card>
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Case Details</h6>
              {selectedCase && (
                <Badge bg="primary">
                  Case #{selectedCase.id}
                </Badge>
              )}
            </Card.Header>
            <Card.Body>
              {selectedCase ? (
                <div>
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="border-bottom pb-2 text-primary">
                        <FaUserInjured className="me-2" />
                        Patient Information
                      </h6>
                      <div className="mb-3">
                        <strong>Patient ID:</strong>
                        <br />
                        <span className="text-muted">{selectedCase.patientId || "N/A"}</span>
                      </div>
                      <div className="mb-3">
                        <strong>Test Booking ID:</strong>
                        <br />
                        <span className="text-muted">{selectedCase.testBookingID || "N/A"}</span>
                      </div>
                      <div className="mb-3">
                        <strong>Consultation ID:</strong>
                        <br />
                        <span className="text-muted">{selectedCase.consultationId || "N/A"}</span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <h6 className="border-bottom pb-2 text-primary">
                        <FaUserMd className="me-2" />
                        Medical Information
                      </h6>
                      <div className="mb-3">
                        <strong>Reporting Doctor:</strong>
                        <br />
                        <span className="text-muted">{selectedCase.doctorId || "N/A"}</span>
                      </div>
                      <div className="mb-3">
                        <strong>Reported By:</strong>
                        <br />
                        <span className="text-muted">{selectedCase.reported_by || "N/A"}</span>
                      </div>
                      <div className="mb-3">
                        <strong>Report Forwarded From:</strong>
                        <br />
                        <span className="text-muted">{selectedCase.report_forward_from || "N/A"}</span>
                      </div>
                      <div className="mb-3">
                        <strong>Report Forwarded To:</strong>
                        <br />
                        <span className="text-muted">{selectedCase.report_forward_to || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* DICOM Information */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <h6 className="border-bottom pb-2 text-primary">
                        DICOM Information
                      </h6>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-2">
                            <strong>Orthanc Instance ID:</strong>
                            <br />
                            <code className="text-muted small">
                              {selectedCase.orthancInstanceId || "N/A"}
                            </code>
                          </div>
                          <div className="mb-2">
                            <strong>Orthanc Study ID:</strong>
                            <br />
                            <code className="text-muted small">
                              {selectedCase.orthancStudyId || "N/A"}
                            </code>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-2">
                            <strong>Instance Status:</strong>
                            <br />
                            <Badge 
                              bg={selectedCase.metadata?.Status === "AlreadyStored" ? "success" : "warning"}
                            >
                              {selectedCase.metadata?.Status || "Unknown"}
                            </Badge>
                          </div>
                          <div className="mb-2">
                            <strong>Parent Study:</strong>
                            <br />
                            <code className="text-muted small">
                              {selectedCase.metadata?.ParentStudy || "N/A"}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {selectedCase.comments && (
                    <div className="row mt-4">
                      <div className="col-12">
                        <h6 className="border-bottom pb-2 text-primary">
                          <FaComment className="me-2" />
                          Doctor's Comments
                        </h6>
                        <div className="alert alert-info">
                          <p className="mb-0">{selectedCase.comments}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dates Information */}
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <div className="mb-2">
                        <strong>Created Date:</strong>
                        <br />
                        <span className="text-muted">{formatDate(selectedCase.createdAt)}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-2">
                        <strong>Last Updated:</strong>
                        <br />
                        <span className="text-muted">{formatDate(selectedCase.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedCase.orthancInstanceId && (
                    <div className="row mt-4">
                      <div className="col-12">
                        <Button
                          variant="primary"
                          onClick={() => handleViewInViewer(selectedCase)}
                          className="d-flex align-items-center"
                          size="lg"
                        >
                          <FaEye className="me-2" />
                          View DICOM Images
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="h6 text-muted">Select a case to view details</p>
                  <small className="text-muted">
                    {dicomCases.length} cases available
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* DICOM Viewer Modal */}
      <Modal
        show={showDicomViewer}
        onHide={handleCloseDicomViewer}
        size="xl"
        fullscreen="lg-down"
        centered
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>
            <FaEye className="me-2" />
            DICOM Viewer - Case #{selectedCase?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: "70vh", padding: 0 }}>
          {selectedDicomId && (
            <DicomViewer
              dicomId={selectedDicomId}
              consultationFiles={getConvertedFiles()}
              onBack={handleCloseDicomViewer}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDicomViewer}>
            <FaArrowLeft className="me-1" />
            Back to Cases
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReportedCase;