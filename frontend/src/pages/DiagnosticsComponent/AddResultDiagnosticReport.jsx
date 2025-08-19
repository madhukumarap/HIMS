import stringSimilarity from "string-similarity";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import Translation from "../../translations/CloudImage.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import AuthService from "../../services/auth.service";
function AddResultDiagnosticReport({
  showFieldModal,
  handleCloseFieldModal,
  selectedReportData,
}) {
  const [resultDate, setResultDate] = useState(new Date());
  const [remarksValue, setRemarksValue] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const testNames = selectedReportData?.selectedTests.split(",");
  const [lastTestData, setLastTestData] = useState({});
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
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllDiagnosticTests`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      const testsData = response?.data?.tests; // Extract the tests array from the response

      setTests(testsData);

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const testName = selectedReportData?.selectedTests;
  const tableName =
    testName?.toLowerCase().replace(/\s+/g, "") + "resultmodels";
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({});

  const fetchColumns = async (selectedTest) => {
    // Pass selectedTest to fetchColumns function
    const tableName =
      selectedTest.toLowerCase().replace(/\s+/g, "") + "resultmodeldiagnostics"; // Generate tableName

    try {
      // alert(tableName);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/getColumnsInTable`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${currentUser?.Token}`,
          },
          body: JSON.stringify({ tableName }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setColumns(data);
      } else {
        console.error("Error fetching columns");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tableName =
          selectedTest.toLowerCase().replace(/\s+/g, "") +
          "resultmodeldiagnostics"; // Generate tableName

        // alert(JSON.stringify(selectedReportData));
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/getLastRecordByPatientTestBookingIDDiagnostic`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${currentUser?.Token}`,
            },
            body: JSON.stringify({
              tableName,
              PatientTestBookingID: selectedReportData?.id,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFormData(data || {});
          //alert("success");
        } else {
          // alert(JSON.stringify(response));
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [selectedTest, selectedReportData]);

  const handleSubmit = async () => {
    // Submit the formData to your Node.js API along with the tableName
    try {
      const selectedTestObject = tests.find((test) => {
        const similarity = stringSimilarity.compareTwoStrings(
          test.testName,
          selectedTest
        );
        return similarity >= 0.8;
      });

      const selectedTestId = selectedTestObject?.id;
      // alert(`Selected Test ID: ${selectedTestId}`);

      const tableName =
        selectedTest?.toLowerCase().replace(/\s+/g, "") +
        "resultmodeldiagnostics";

      formData.PatientID = selectedReportData?.PatientID;
      formData.TestManagementID = selectedTestId;
      formData.PatientTestBookingID = selectedReportData?.id;
      const testName = selectedTestObject.testName;

      //  formData.selectedTestNamestring = selectedTest;
      // alert(JSON.stringify(formData));
      // alert(selectedTestId);
      // return;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/insertTestDataDiagnostics`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${currentUser?.Token}`,
          },
          body: JSON.stringify({ tableName, formData, testName }),
        }
      );

      if (response.ok) {
        toast.success(t("Datasavedsuccessfully"));
        console.log("Data saved successfully");
        setFormData({});
      } else {
        // alert("Fail");
        toast.error("Failed!");
        console.error("Error saving data");
      }
    } catch (error) {
      console.error(error);
    }

    handleCloseFieldModal();
  };

  useEffect(() => {
    if (showFieldModal && selectedTest) {
      // Check if selectedTest is available
      fetchColumns(selectedTest); // Call fetchColumns with selectedTest
    }
  }, [showFieldModal, selectedTest]);

  const handleTestSelect = (e) => {
    const selectedTest = e.target.value;
    setSelectedTest(selectedTest);
    if (!selectedTest) {
      setColumns([]);
    }
    // alert(selectedTest);
    setFormData({});
    fetchColumns(selectedTest);
  };
  return (
    <>
      <Modal
        style={{ marginTop: "20px" }}
        centered
        show={showFieldModal}
        size="lg"
        onHide={() => {
          handleCloseFieldModal();
          setSelectedTest("");
          setColumns([]);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("AddResultforPatientName")}: {selectedReportData?.PatientName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="selectTest">
              {" "}
              <Form.Label style={{ fontSize: "12px", fontWeight: "bold" }}>
                {t("SelectTest")}
              </Form.Label>
              <Form.Select
                as="select"
                style={{ fontSize: "12px" }}
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
            {/* Render all columns except "Comment" */}
            {columns
              .filter(
                (column) =>
                  ![
                    "id",
                    "PatientID",
                    "TestManagementID",
                    "PatientTestBookingID",
                    "createdAt",
                    "updatedAt",
                    "Comment", // Exclude "Comment" column
                  ].includes(column)
              )
              .map((column) => {
                // Replace underscores with spaces
                const label = column.replace(/_/g, " ");
                const placeholder = `Enter ${label}`;

                return (
                  <Form.Group key={column} controlId={column}>
                    <Form.Label
                      style={{
                        fontSize: "12px",
                        marginTop: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {label}
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      style={{ fontSize: "12px" }}
                      placeholder={placeholder}
                      value={formData[column] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [column]: e.target.value })
                      }
                    />
                  </Form.Group>
                );
              })}

            {/* Render "Comment" column as a textarea */}
            <Form.Group controlId="Comment">
              <Form.Label
                style={{
                  fontSize: "12px",
                  marginTop: "10px",
                  fontWeight: "bold",
                }}
              >
                {t("Comment")}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                style={{ fontSize: "12px" }}
                placeholder={t("EnterComment")}
                value={formData["Comment"] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, Comment: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontSize: "12px", marginTop: "0px" }}
            variant="secondary"
            onClick={handleCloseFieldModal}
          >
            {t("Close")}
          </Button>
          <Button
            style={{ fontSize: "12px", marginTop: "0px" }}
            variant="secondary"
            onClick={handleSubmit}
          >
            {t("Save")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddResultDiagnosticReport;
