import React, { useState, useEffect } from "react";
import { ListGroup, Alert, Badge, Button, Card } from "react-bootstrap";
import { getDicomFiles } from "./api/dicom";
import FileUpload from "./FileUpload";
import DicomViewer from "./DicomViewer";

interface DicomFile {
  id: number;
  userId: number;
  orthancInstanceId: string;
  orthancStudyId: string;
  metadata: {
    ID: string;
    Path: string;
    Status: string;
    ParentStudy: string;
    ParentSeries: string;
    ParentPatient: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface DicomResponse {
  count: number;
  rows: DicomFile[];
}

// Add this interface to match what DicomViewer expects
interface ConsultationFile {
  id: number;
  original_name: string;
  file_name: string;
  file_path?: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  is_dicom: boolean;
  orthanc_instance_id?: string;
  orthanc_study_id?: string;
  dicom_metadata?: any;
  consultation_id: number;
  tenant_id: number;
}

const DicomList: React.FC = () => {
  const [files, setFiles] = useState<DicomFile[]>([]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<DicomFile | null>(null);
  const [consultationFiles, setConsultationFiles] = useState<ConsultationFile[]>([]);

  const fetchFiles = async () => {
    try {
      const response = await getDicomFiles();
      alert("hello")
      console.log(response,"response")
      const data: DicomResponse = response.data;
      console.log(data,"data")
      setFiles(data.rows);
      
      // Convert the fetched files to the format expected by DicomViewer
      const convertedFiles: ConsultationFile[] = data.rows.map(file => ({
        id: file.id,
        original_name: `DICOM-${file.orthancInstanceId}`,
        file_name: `DICOM-${file.orthancInstanceId}`,
        file_size: 0, // You might need to get this from your API
        file_type: "dicom",
        mime_type: "application/dicom",
        is_dicom: true,
        orthanc_instance_id: file.orthancInstanceId,
        orthanc_study_id: file.orthancStudyId,
        dicom_metadata: file.metadata,
        consultation_id: 0, // You might need to get this from your API
        tenant_id: 0, // You might need to get this from your API
      }));
      console.log(convertedFiles,"convertedFiles")
      setConsultationFiles(convertedFiles);
    } catch (err) {
      setError("Failed to fetch DICOM files.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);
  console.log(consultationFiles,"consultationFiles")
  // -------------------------
  // LIST VIEW
  // -------------------------
  if (!selectedFile) {
    return (
      <div className="p-5">
        <h3>My DICOM Files</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <FileUpload onUploadSuccess={fetchFiles} />

        <ListGroup className="my-4">
          {files.map((file) => (
            <ListGroup.Item
              key={file.id}
              action
              onClick={() => setSelectedFile(file)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>ID:</strong> {file.id} <br />
                  <strong>Instance:</strong> {file.orthancInstanceId} <br />
                  <strong>Study:</strong> {file.orthancStudyId} <br />
                </div>
                <Badge bg="info">
                  {new Date(file.createdAt).toLocaleString()}
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }

  // -------------------------
  // DETAIL VIEW WITH VIEWER
  // -------------------------
  return (
    <div style={{ marginTop: "-10px" }}>
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => setSelectedFile(null)}
      >
        ← Back to List
      </Button>

      <Card className="mb-3">
        <Card.Body>
          <h4>DICOM File Details</h4>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>ID:</strong> {selectedFile.id}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Instance:</strong> {selectedFile.orthancInstanceId}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Study:</strong> {selectedFile.orthancStudyId}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Uploaded:</strong>{" "}
              {new Date(selectedFile.createdAt).toLocaleString()}
            </p>
          </div>
        </Card.Body>
      </Card>

      <div className="mt-4">
        <DicomViewer
          dicomId={selectedFile.id}
          consultationFiles={consultationFiles}
          onBack={() => setSelectedFile(null)}
        />
      </div>
    </div>
  );
};

export default DicomList;