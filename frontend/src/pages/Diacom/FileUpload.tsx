import React, { useState } from "react";
import { Form, Button, ProgressBar, Alert } from "react-bootstrap";
import { uploadDicomFile } from "./api/dicom";

interface FileUploadProps {
  onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await uploadDicomFile(file);
      onUploadSuccess();
    } catch (err) {
      setError("File upload failed. Please try again.");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="my-4 p-3 border rounded">
      <h4>Upload New DICOM File</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Control type="file" onChange={handleFileChange} accept=".dcm" />
      </Form.Group>
      {uploading && (
        <ProgressBar now={progress} label={`${progress}%`} className="mb-3" />
      )}
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default FileUpload;
