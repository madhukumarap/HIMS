import jsPDF from "jspdf";
import { Table } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import {
  FaPencilAlt,
  FaPlus,
  FaTrashAlt,
  FaRegEye,
  FaPlusSquare,
  FaCartPlus,
  FaCalendarPlus,
  FaUpload,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Translation from "../../translations/CloudImage.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import AuthService from "../../services/auth.service";

function ImageUploader({ testBookingID, SelectedTest }) {
  //alert(SelectedTest);
  const currentUser = AuthService.getCurrentUser();

  const { t } = useTranslation();

  const locales = { enIN, fr };

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
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewImageIndex, setViewImageIndex] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [testNames, setTestNames] = useState([]);
  useEffect(() => {
    const testNamesArray = SelectedTest.split(",");

    setTestNames(testNamesArray);
  }, [SelectedTest]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [id, setId] = useState("");
  const [viewImageSrc, setViewImageSrc] = useState(null);
  const handleViewImage = (index) => {
    setViewImageSrc(URL.createObjectURL(selectedFiles[index]));
    setShowViewModal(true);
  };
  const handleViewImages = (base64String) => {
    console.log("base64String:" + base64String);
    setViewImageSrc(base64String);
    setShowViewModal(true);
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    tableData.forEach((item, index) => {
      if (item.imagePath) {
        const img = new Image();
        img.src = item.imagePath;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");

          doc.addImage(dataURL, "JPEG", 10, 10, 190, 277); // Adjust coordinates and size as needed
          if (index !== tableData.length - 1) {
            doc.addPage();
          } else {
            doc.save("images.pdf");
          }
        };
      }
    });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  useEffect(() => {
    // Fetch data with images
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/getImagesByTestBookingIDAndTestName?testBookingID=${"11"}&testName=${"testName"}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setTableData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handleUpload = async () => {
    if (!selectedTest || !selectedFiles || !testBookingID) {
      toast.error(t("PleaseSelecttest"));
      return;
    }
    const formData = new FormData();
    formData.append("id", "1"); // Convert to string
    formData.append("testBookingID", testBookingID); // Convert to string
    formData.append("testName", selectedTest.trim());
    formData.append("testType", "testType");

    selectedFiles.forEach((file, index) => {
      formData.append(`images`, file);
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/uploadTestImages`,
        formData,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      // alert("Images uploaded successfully");
      toast.success(t("Imagesuploadedsuccessfully"));
      setSelectedTest("");
      setSelectedFiles([]);
      setShowModal(false);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const addMoreInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = handleFileChange;
    input.click();
  };
  const handleTestSelect = (e) => {
    const selectedTest = e.target.value;
    setSelectedTest(selectedTest);
    if (!selectedTest) {
    }
    // alert(selectedTest);
    // setFormData({});
  };

  return (
    <div>
      <Button
        style={{ marginTop: "0px", fontSize: "12px", padding: "4px 5px" }}
        variant="secondary"
        title={t("UploadResultImages")}
        className="btn btn-secondary mr-2"
        onClick={() => setShowModal(true)}
      >
        <FaUpload />
      </Button>
      {/* <Button variant="success" onClick={handleDownloadPDF}>
        Download Images PDF
      </Button> */}
      {/* <Table striped bordered hover>
        <thead>
          <tr>
                          <th style={{ textAlign: "center" }}>ID</th>
                          <th style={{ textAlign: "center" }}>Test Booking ID</th>
                          <th style={{ textAlign: "center" }}>Test Name</th>
                          <th style={{ textAlign: "center" }}>Test Type</th>
                          <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.testBookingID}</td>
              <td>{item.testName}</td>
              <td>{item.testType}</td>
              <td>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => handleViewImages(item.imagePath)}
                >
                  View Images
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> */}

      <Modal
        centered
        size="lg"
        style={{ marginTop: "20px", fontSize: "12px" }}
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "18px" }}>
            {" "}
            {t("UploadTestResultImages")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <br></br>
          <hr />

          <Form>
            <Form.Group controlId="selectTest">
              {" "}
              <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
                {t("SelectTest")}
              </Form.Label>
              <Form.Select
                as="select"
                style={{ fontSize: "14px" }}
                onChange={handleTestSelect}
                value={selectedTest}
              >
                <option value="">{t("SelectTest")}</option>
                {testNames?.map((test, index) => (
                  <option key={index} value={test}>
                    {test}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
          <hr />
          <br></br>
          <Form.Group controlId="images">
            <Form.Label>{t("UploadImages")}:</Form.Label>
            <Button
              style={{ fontSize: "12px" }}
              variant="secondary"
              onClick={addMoreInput}
            >
              {t("UploadMultiple")}
            </Button>
          </Form.Group>
        </Modal.Body>
        <Modal.Body>
          {selectedFiles.length > 0 && (
            <div>
              <h5>{t("SelectedImages")}:</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>{t("ImageName")}</th>
                    <th style={{ textAlign: "center" }}>{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFiles.map((file, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: "center" }}>{file.name}</td>
                      <td style={{ textAlign: "center" }}>
                        <Button
                          variant="danger"
                          size="lg"
                          style={{ fontSize: "12px" }}
                          onClick={() => handleRemoveFile(index)}
                        >
                          {t("Remove")}
                        </Button>{" "}
                        <Button
                          variant="secondary"
                          size="lg"
                          style={{ fontSize: "12px" }}
                          onClick={() => handleViewImage(index)}
                        >
                          {t("View")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t("Close")}
          </Button>
          <Button
            style={{ fontSize: "14px" }}
            variant="secondary"
            onClick={handleUpload}
          >
            {t("Upload")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
        style={{ marginTop: "20px" }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("ViewImage")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewImageSrc && (
            <img
              src={viewImageSrc}
              // alt={`View ${selectedFiles[viewImageIndex].name}`}
              style={{ width: "50%", height: "50%" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ImageUploader;
