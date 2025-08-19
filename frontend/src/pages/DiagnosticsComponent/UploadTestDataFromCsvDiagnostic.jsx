import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";
import sampleCsvFile from "../../assets/diagnosticdata.csv";

import Translation from "../../translations/PathalogytestManagements.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Modal } from "react-bootstrap";

const UploadTestDataFromCsvDiagnostic = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const [specimensWithCategory, setSpecimensWithCategory] = useState([]);
  const { t } = useTranslation();
  useEffect(() => {
    const initializei18n = () => {
      const resources = {
        en: {
          translation: Translation["en"],
        },
        fr: {
          translation: Translation["fr"],
        },
      };

      const storedLanguage = localStorage.getItem("SelectedLanguage");
      const defaultLanguage = storedLanguage || "en";

      i18n.use(initReactI18next).init({
        resources,
        lng: defaultLanguage,
        fallbackLng: "en",
        interpolation: {
          escapeValue: false,
        },
      });
    };

    initializei18n();
  }, []);

  useEffect(() => {
    async function fetchSpecimensWithCategory() {
      if (currentUser) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/getSpecimenWithCategory`,
            {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            }
          );
          setSpecimensWithCategory(response.data);
          // alert(JSON.stringify(response.data));
        } catch (error) {
          setError(error.message);
        }
      }
    }
    fetchSpecimensWithCategory();
  }, []);
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
    link.download = "Diagnostic_test_information.csv";
    link.click();
    downloadCSV();
  };

  const downloadCSV = () => {
    //
    const labCategories = specimensWithCategory?.LabCategory.map(
      (category) => ({
        id: category.id,
        CategoryName: category.CategoryName,
      })
    );

    const additionalCategories = [
      "Bone",
      "Scan",
      "Heart",
      "Thyroid",
      "Liver",
      "Vitamin",
      "BloodPicture",
      "Kidney",
      "BloodSugar",
      "Pancreas",
      "Lung/Heart",
      "Vitals",
      "Blood",
      "Diabetes",
      "Lung",
      "Hormone",
      "Joints",
      "Vitals",
      "Abdomen",
    ].map((name, index) => ({
      ID: index + 1, // Assuming the ID is generated based on the array index
      SpecimenName: name,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "LabCategory",
        "id,CategoryName",
        ...labCategories.map((category) => Object.values(category).join(",")),
        "Categories",
        "ID,category",
        ...additionalCategories.map((category) =>
          Object.values(category).join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      "reference_data_Diagnostic_UseIN_UploadCSV.csv"
    );
    document.body.appendChild(link);
    link.click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    alert(t("PleaseReferThisCsvToAddMultipleTestData"));
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("BaseCurrency", currentUser?.baseCurrency);
        if (!currentUser.baseCurrency) {
          toast.error("Please set base Currency First!");
          return;
        }
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/UploadTestDataFromCsvDiagnostic`,
          formData,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );

        toast.success("Test Data Add/Update Successfully!");
        setFile(null);
        navigate(`/${extractedPart}/DiagnosticTestManagement`);
      } catch (error) {
        setFile(null);
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
    (!currentUser.roles.includes("ROLE_PATHOLOGISTADMIN") &&
      !currentUser.roles.includes("ROLE_ADMIN"))
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
            {t("UploadDiagnosticData")}
          </Card.Title>
          <form onSubmit={handleSubmit} className="row">
            <div className="col-12">
              <label htmlFor="fileInput" className="form-label">
                {t("Selectacsvfile")}:
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
            <div className="col-12 text-center">
              <button
                style={{ marginTop: "15px", fontSize: "12px" }}
                className="btn btn-secondary btn"
                onClick={handleSubmit}
              >
                {t("upload")}
              </button>
              <button
                style={{
                  marginLeft: "10px",
                  marginTop: "15px",
                  fontSize: "13px",
                  padding: "4px 5px",
                }}
                className="btn btn-secondary btn"
                onClick={handleDownloadSampleFile}
              >
                {t("samplediagnosticdata")}
              </button>
              <Link to={`/${extractedPart}/DiagnosticTestManagement`}>
                <button
                  style={{
                    marginLeft: "10px",
                    marginTop: "15px",
                    fontSize: "13px",
                    padding: "4px 5px",
                  }}
                  className="btn btn-secondary btn"
                >
                  {t("goBack")}
                </button>
              </Link>
            </div>
          </form>
        </Card.Body>
      </Card>

      <Modal
        centered
        size="lg"
        backdrop="static"
        show={showAlert}
        onHide={() => setShowAlert(false)}
      >
        <Modal.Header>{/* Alert */}</Modal.Header>
        <Modal.Body>
          <h3 className="text-center">
            {t(
              "PleaseClickOnDownloadIconAndReferSampleCsvDataToAddMultipleTestData"
            )}
          </h3>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowAlert(false)}
          >
            {t("Close")}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UploadTestDataFromCsvDiagnostic;
