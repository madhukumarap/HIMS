import React, { useState, useEffect } from "react";
import { ListGroup, Alert, Badge, Button } from "react-bootstrap";
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

const DicomList: React.FC = () => {
  const [files, setFiles] = useState<DicomFile[]>([]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<DicomFile | null>(null);

  const fetchFiles = async () => {
    try {
      const response = await getDicomFiles();
      const data: DicomResponse = response.data;
      setFiles(data.rows);
    } catch (err) {
      setError("Failed to fetch DICOM files.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

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
                  {/* <small className="text-muted">
                    Uploaded: {new Date(file.createdAt).toLocaleString()}
                  </small> */}
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

      {/* <Card className="mb-3">
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
      </Card> */}

      <div className="mt-4">
        <DicomViewer
          dicomId={selectedFile.id}
          onBack={() => setSelectedFile(null)}
        />
      </div>
    </div>
  );
};

export default DicomList;
