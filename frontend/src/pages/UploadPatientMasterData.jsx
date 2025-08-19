import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import AuthService from "../services/auth.service";
import sampleCsvFile from "../assets/PatientReg.csv";
import { FaDownload } from "react-icons/fa";

const UploadCsvFileNurse = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedExtensions = /(\.csv)$/i; // Regular expression to check for .csv extension

    // Check if the selected file has a .csv extension
    if (allowedExtensions.exec(selectedFile.name)) {
      setFile(selectedFile);
    } else {
      toast.error("Only .csv files are allowed");
    }
  };

  const handleDownloadSampleFile = () => {
    const link = document.createElement("a");
    link.href = sampleCsvFile;
    link.download = "SamplePatientData.csv";
    link.click();
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    // alert(file);
    if (!file) {
      toast.error("Please Select File!");
      return;
    }
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/uploadPatientMasterdata`,
          formData,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );

        // File uploaded successfully
        toast.success(
          "Patient's Data Saved Successfully !. If Not Present Data"
        );
        // setFile("");
        navigate("/PatientListCounter");
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "24px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "20px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "16px" /* Adjust the font size for <h3> */,
  };

  if (
    !currentUser ||
    (!currentUser.roles.includes("ROLE_ADMIN") &&
      !currentUser.roles.includes("ROLE_DOCTOR") &&
      !currentUser.roles.includes("ROLE_RECEPTIONIST"))
  ) {
    // If the user is not logged in or does not have the admin role,
    // you can show a message or redirect to another page.
    return "Access Denied";
  }

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <Card style={{ width: "30rem" }}>
        <Card.Body>
          <Card.Title style={{ fontSize: "16px" }}>
            Upload Patient Master Data .csv File
          </Card.Title>
          <form onSubmit={handleSubmit} className="row">
            <div className="col-12">
              <label htmlFor="fileInput" className="form-label">
                Select a .csv file:
              </label>
              <input
                style={{ fontSize: "12px" }}
                type="file"
                className="form-control"
                id="fileInput"
                onChange={handleFileChange}
                required
              />
            </div>
            <br></br>
            <div className="col-12 text-center">
              <br></br>
              <button
                style={{ marginTop: "0px", fontSize: "12px" }}
                type="submit"
                className="btn btn-secondary"
              >
                Upload
              </button>
              <button
                title="Download Sample .csv File"
                style={{
                  marginLeft: "10px",
                  marginTop: "0px",
                  fontSize: "13px",
                  padding: "4px 5px",
                }}
                className="btn btn-secondary btn"
                onClick={handleDownloadSampleFile}
              >
                <FaDownload />
              </button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UploadCsvFileNurse;
