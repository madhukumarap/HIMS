import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import AuthService from "../services/auth.service";
import sampleCsvFile from "../assets/DrugDataSample.csv";
import { Modal } from "react-bootstrap";
import Translation from "../translations/Uploadcsv_data.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import { FaDownload } from "react-icons/fa";

const UploadCsvFileNurse = () => {
  const [file, setFile] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const navigate = useNavigate();
  const { t } = useTranslation();
  const locales = { enIN, fr };
  const currentUser = AuthService.getCurrentUser();

  const handleDownloadSampleFile = () => {
    const link = document.createElement("a");
    link.href = sampleCsvFile;
    link.download = "SampleDrugData.csv";
    link.click();
  };
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
          format: (value, format, lng) => {
            if (isDate(value)) {
              const locale = locales[lng];
              return formatDate(value, format, { locale });
            }
          },
        },
      });
    };

    initializei18n();
    const intervalId = setInterval(initializei18n, 1000);
    return () => clearInterval(intervalId);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

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
          `${import.meta.env.VITE_API_URL}/api/UploadDrugData`,
          formData,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );

        // File uploaded successfully
        toast.success(t("DrugsDataSavedSuccessfullyIfNotPresentData"));

        navigate(`/${extractedPart}/ManageDrugDatabase`);
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

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
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
            {t("UploadDrugDatatoDrugDatabasecsvFile")}
          </Card.Title>
          <form onSubmit={handleSubmit} className="row">
            <div className="col-12">
              <label
                htmlFor="fileInput"
                className="form-label d-flex align-items-center"
              >
                {t("Selectacsvfile")}
                <button
                  title={
                    t("DownloadSamplecsvFile") || "Download Sample .csv File"
                  }
                  style={{
                    marginLeft: "10px",
                    // marginTop: "27px",
                    fontSize: "13px",
                    padding: "4px 5px",
                  }}
                  className="btn btn-secondary btn"
                  onClick={handleDownloadSampleFile}
                >
                  <FaDownload />
                </button>
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
                style={{ marginTop: "27px", fontSize: "12px" }}
                type="submit"
                className="btn btn-secondary"
              >
                {t("Upload")}
              </button>
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

export default UploadCsvFileNurse;
