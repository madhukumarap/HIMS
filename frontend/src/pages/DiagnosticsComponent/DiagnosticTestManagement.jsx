import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import "../pathalogytestManagement.css";
import { Modal, Button, Table, Form, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import Translation from "../../translations/PathalogytestManagements.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import AuthService from "../../services/auth.service";
import { HospitalContext } from "../../context/HospitalDataProvider";
import { CurrencyContext } from "../../context/CurrencyProvider";
import { currencySymbols } from "../../utils.js/index";

function PathalogyTestManagement() {
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();
  const [currency, setCurrency] = useState(currentUser.baseCurrency);

  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  const { hospitalData } = useContext(HospitalContext);

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
  const [tests, setTests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [fieldeditingId, setFieldEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddFieldsModal, setShowAddFieldsModal] = useState(false);
  const [TestNameSelected, setTestNameSelected] = useState("");
  const [fieldInputs, setFieldInputs] = useState([]);
  const [normalValuesData, setNormalValuesData] = useState(null);

  ///////////////////////////////////////////////////////////////////////////
  const [labCategories, setLabCategories] = useState([]);
  useEffect(() => {
    const fetchLabCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/GetLabCategoryList`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setLabCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLabCategories();
  }, []);
  //////////////////////////////////////////////////////////////////
  const [specimens, setSpecimens] = useState([]);
  useEffect(() => {
    const fetchSpecimens = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/GetListOfSpecimens`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setSpecimens(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpecimens();
  }, []);

  //////////////////////////////////////////////////////////////////////////////
  const [editedTest, setEditedTest] = useState({
    testName: "",
    description: "",
    category: "",
    testPrice: 0,
    labCategoryId: "",
    specimenId: "",
    Currency: "",
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  // Function to check if the screen size is mobile
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 200);
  };

  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener("resize", checkIsMobile);
    checkIsMobile();
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewTableName, setViewTableName] = useState("");
  const [viewColumns, setViewColumns] = useState([]);

  const handleView = async (test) => {
    const tableName =
      test.testName?.toLowerCase().replace(/\s+/g, "") +
      "resultmodeldiagnostics";
    // alert(tableName);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/getColumnsInTableDiagnostic`,
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
        setViewTableName(tableName);
        setViewColumns(data);

        // const responseAxios = await axios.get(
        //   `${import.meta.env.VITE_API_URL}/api/testmanagementnormalvalues/${test.id}`
        // );
        // const dataAxios = responseAxios.data;
        // // Assuming your API returns an array of objects
        // setNormalValuesData(dataAxios);
        setFieldEditingId(test.id);
        setTestNameSelected(test?.testName);
        //  alert(JSON.stringify(normalValuesData));
        setShowViewModal(true);
      } else {
        toast.error(t("TableNotFoundAddFields"));
        setFieldEditingId(test.id);
        setTestNameSelected(test?.testName);
        setShowViewModal(true);
        console.error("Error fetching columns");
      }
    } catch (error) {
      setFieldEditingId(test.id);
      setTestNameSelected(test?.testName);
      setShowViewModal(true);
      //alert("Error: " + error);
      console.error(error);
    }
  };

  const closeViewModal = () => {
    setTestNameSelected("");
    setFieldInputs([]);
    setViewTableName("");
    setViewColumns([]);
    setShowViewModal(false);
  };

  const handleDeleteColumn = async (fieldNameToDelete) => {
    // Create an object to send as the request body
    // alert(fieldNameToDelete);
    // return;
    if (fieldNameToDelete === "Comment") {
      toast.error(t("ThisfieldisMandatory"));
      return;
    }
    const requestBody = {
      viewTableName: viewTableName,
      fieldName: fieldNameToDelete,
    };

    // alert("hello");
    // Send a DELETE request to your Node.js server
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/deleteColumnFromTable`,
        {
          data: requestBody,
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      if (response.status === 200) {
        // Successfully deleted, you may want to update the view or take other actions
        toast.success(
          `Column '${fieldNameToDelete}' ${t("DeletedSuccessfully")}`
        );
        setShowViewModal(false);
        console.log(`Column '${fieldNameToDelete}' deleted successfully.`);
      } else {
        toast.error(`${t("ErrorDeletingColumn")} '${fieldNameToDelete}'.`);
        console.error(`Error deleting column '${fieldNameToDelete}'.`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const closeAddFieldsModal = () => {
    setShowAddFieldsModal(false);
    setFieldInputs([]);
  };
  const handleSaveFieldsCreate = async (fieldeditingId) => {
    if (fieldInputs.some((field) => !field.trim())) {
      toast.error(t("PleaseFillinAllFieldsBeforeSaving"));
      return;
    }
    if (fieldInputs.length < 1) {
      toast.error(t("PleaseAddAtLeastOneFieldsBeforeSaving"));
      return;
    }
    // Create an array of field objects
    const fieldData = fieldInputs?.map((fieldName, index) => ({
      fieldName,
    }));
    /// alert(JSON.stringify(fieldData));

    let response;
    try {
      response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/createOrUpdateTestResultTableDiagnostic`,
        {
          testId: fieldeditingId,
          testManagementID: fieldeditingId,
          fields: fieldData,
        },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      //alert(JSON.stringify(response.data));
      setFieldEditingId(null);

      closeAddFieldsModal(); // Close the modal and reset fieldInputs
      fetchTests();
      closeViewModal();
      toast.success(t("Fieldsaddedsuccessfully"));
    } catch (error) {
      console.error(error);
      toast.error("Error adding fields: " + error.response.data);
    }
  };

  const handleSaveFields = async () => {
    if (fieldInputs.some((field) => !field.trim())) {
      toast.error(t("PleaseFillinAllFieldsBeforeSaving"));
      return;
    }
    if (fieldInputs.length < 1) {
      toast.error(t("PleaseAddAtLeastOneFieldsBeforeSaving"));
      return;
    }
    // Create an array of field objects
    const fieldData = fieldInputs?.map((fieldName, index) => ({
      fieldName,
    }));
    /// alert(JSON.stringify(fieldData));

    let response;
    try {
      response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/createOrUpdateTestResultTableDiagnostic`,
        {
          testId: fieldeditingId,
          testManagementID: fieldeditingId,
          fields: fieldData,
        },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      //alert(JSON.stringify(response.data));
      setFieldEditingId(null);

      closeAddFieldsModal(); // Close the modal and reset fieldInputs
      fetchTests();
      closeViewModal();
      toast.success(t("FieldsAddedSuccessfully"));
    } catch (error) {
      console.error(error);
      toast.error("Error adding fields: " + error.response.data);
    }
  };

  const handleFieldInputChange = (e, index) => {
    if (e.target.value.includes(" ")) {
      toast.error(t("spaceNotallowed"));
      return;
    }
    if (/[^a-zA-Z0-9_]/.test(e.target.value)) {
      toast.error(t("SpecialCharnotallow"));
      return;
    }
    const updatedInputs = [...fieldInputs];
    updatedInputs[index] = e.target.value;
    setFieldInputs(updatedInputs);
  };

  const handleAddField = () => {
    setFieldInputs([...fieldInputs, ""]); // Add a new empty field input
  };

  const handleRemoveField = (indexToRemove) => {
    const updatedInputs = fieldInputs.filter(
      (_, index) => index !== indexToRemove
    );

    setFieldInputs(updatedInputs);
  };
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

  const handleEdit = (test) => {
    setEditingId(test.id);
    setEditedTest(test);
    setEditedTest({
      ...test,
      labCategoryId: test?.LabCategoryNameID,
      specimenId: test?.SpecimenNameID,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedTest({
      testName: "",
      // code: "",
      description: "",
    });
  };

  const [addingNew, setAddingNew] = useState(false); // New state for tracking new record creation

  const handleAddNew = () => {
    setShowModal(true);
    setEditingId(null);
    setEditedTest({
      testName: "",
      // code: "",
      description: "",
      category: "",
      testPrice: 0,
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCreateNew = async () => {
    if (
      !editedTest.testName ||
      // !editedTest.code ||
      !editedTest.description ||
      !editedTest.category ||
      editedTest.testPrice <= 0 ||
      !editedTest.labCategoryId
      //!editedTest.specimenId
    ) {
      toast.error(t("AllFieldsAreRequiredAndTestPriceMustBeGreaterThan0"));
      return;
    }
    if (fieldInputs.length < 1) {
      toast.error(t("PleaseAddAtLeastOneFieldsBeforeSaving"));
      return;
    }
    ////////////////////////////////////////////////////////////////////////////
    const labCategoryObject = labCategories.find(
      (specimen) => specimen.id === parseInt(editedTest?.labCategoryId)
    );
    //alert(JSON.stringify(labCategoryObject));
    editedTest.LabCategoryName = labCategoryObject?.CategoryName || "NA";

    const selectedSpecimen = specimens.find(
      (specimen) => specimen.id === parseInt(editedTest?.specimenId)
    );
    //alert(JSON.stringify(selectedSpecimen));
    editedTest.SpecimenName = selectedSpecimen?.SpecimenName || "NA";
    editedTest.Currency = currency;
    /////////////////////////////////////////////////////////////////////////////////
    try {
      // const response = await axios.post(
      //   `${import.meta.env.VITE_API_URL}/api/createDiagnosticTest`,
      //   editedTest,
      //   {
      //     headers: {
      //       Authorization: `${currentUser?.Token}`,
      //     },
      //   }
      // );
      // const createdTestId = response.data.testID;
      // console.log("Created Test ID:", createdTestId);
      // setFieldEditingId(response.data.testID);
      // if (response.data.testID) {
      //   //alert(response.data.testID);
      //   handleSaveFieldsCreate(response.data.testID);
      // }
      // setAddingNew(false);
      // toast.success(t("CreatedSuccessfully"));
      // setEditedTest({
      //   testName: "",
      //   code: "",
      //   description: "",
      //   category: "",
      //   testPrice: 0,
      //   labCategoryId: "",
      //   specimenId: "",
      // });
      // fetchTests();
      // setShowModal(false); // Close the modal

      //

      editedTest.Currency = currentUser.baseCurrency;

      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/createDiagnosticTest`,
          editedTest,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          const createdTestId = response.data.testID;
          console.log("Created Test ID:", createdTestId);
          setFieldEditingId(response.data.testID);
          if (response.data.testID) {
            //alert(response.data.testID);
            handleSaveFieldsCreate(response.data.testID);
          }
          setAddingNew(false);
          toast.success(t("CreatedSuccessfully"));
          setEditedTest({
            testName: "",
            // code: "",
            description: "",
            category: "",
            testPrice: 0,
            labCategoryId: "",
            specimenId: "",
          });
          fetchTests();
          setShowModal(false); // Close the modal
        })
        .catch((error) => {
          toast.error(
            error.response.data.message
              ? error.response.data.message
              : "Error creating text"
          );
        });
      //
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEdit = async () => {
    //alert(editedTest.Currency);
    if (
      !editedTest.testName ||
      // !editedTest.code ||
      !editedTest.description ||
      !editedTest.category ||
      editedTest.testPrice <= 0 ||
      !editedTest.labCategoryId
      // !editedTest.specimenId
      //   !editedTest.Currency
    ) {
      toast.error(t("AllFieldsAreRequiredAndTestPriceMustBeGreaterThan0"));
      return;
    }
    try {
      ////////////////////////////////////////////////////////////////////////////
      const labCategoryObject = labCategories.find(
        (specimen) => specimen.id === parseInt(editedTest?.labCategoryId)
      );
      //alert(JSON.stringify(labCategoryObject));
      editedTest.LabCategoryName = labCategoryObject?.CategoryName || "NA";

      const selectedSpecimen = specimens.find(
        (specimen) => specimen.id === parseInt(editedTest?.specimenId)
      );
      editedTest.Currency = currency;
      // alert(JSON.stringify(editedTest.Currency));
      editedTest.SpecimenName = selectedSpecimen?.SpecimenName || "NA";
      /////////////////////////////////////////////////////////////////////////////////

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/updateDiagnosticTest/${
          editedTest.id
        }`,
        editedTest,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setEditingId(null);
      setEditedTest({
        testName: "",
        // code: "",
        description: "",
        category: "",
        testPrice: 0,
        labCategoryId: "",
        specimenId: "",
      });
      fetchTests();
      toast.success(t("TestUpdatedSuccessfully"));
    } catch (error) {
      console.error(error);
      toast.error(t("ErrorUpdatingTest"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/deleteDiagnosticTest/${id}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      fetchTests();
      toast.success(t("TestDeletedSuccessfully"));
    } catch (error) {
      console.error(error);
      toast.error(t("ErrorDeletingTest"));
    }
  };

  // Listen for the storage event
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      // User data in localStorage was changed and user is not logged in
      // Log out the user and reload the page
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser) {
    return "Access Denied";
  }
  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_DIAGNOSTICTECHNICIAN") &&
    !currentUser.roles.includes("ROLE_ADMIN")
  ) {
    return "Access Denied";
  }

  const convertArrayOfObjectsToCSV = (data) => {
    const csvHeader = Object.keys(data[0]).join(",") + "\n";
    const csvRows = data.map((row) => Object.values(row).join(",") + "\n");
    return csvHeader + csvRows.join("");
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllDiagnosticTests`,
        {
          responseType: "json", // Set response type to JSON
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        },
        {}
      );

      const csvData = convertArrayOfObjectsToCSV(response.data.tests);

      const downloadUrl = URL.createObjectURL(
        new Blob([csvData], { type: "text/csv" })
      );

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "testData.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(
        t("dataExportedSuccessfully"),
        { position: toast.POSITION.TOP_RIGHT },
        {
          style: { fontSize: "13px" },
        }
      );
    } catch (error) {
      toast.error("Failed to export data", {
        style: { fontSize: "13px" },
      });
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ fontSize: "12px" }} className="test-management">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}> {t("TestManagement")}</h2>
      </header>
      <br />
      <Button
        style={{ fontSize: "13px", padding: "4px 5px" }}
        variant="secondary"
        onClick={handleAddNew}
      >
        {t("AddNewTest")}
      </Button>{" "}
      <Link to={`/${extractedPart}/UploadTestDataFromCsvDiagnostic`}>
        <Button
          style={{ fontSize: "13px", padding: "4px 5px" }}
          variant="secondary"
        >
          {t("InputTestInformation")}
        </Button>
      </Link>
      <Button
        style={{ fontSize: "13px", padding: "4px 5px" }}
        variant="secondary"
        onClick={handleExportData}
      >
        {t("downloadAsCSV")}
      </Button>{" "}
      <br></br> <br></br>
      {isMobile ? (
        <div>
          {tests?.map((test) => (
            <div className="card mb-3" key={test.id}>
              <div className="card-body">
                {editingId === test.id ? (
                  <div>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder={t("pathologyTestManagementModal.TestName")}
                      value={editedTest.testName}
                      onChange={(e) =>
                        setEditedTest({
                          ...editedTest,
                          testName: e.target.value,
                        })
                      }
                    />
                    {/* <input
                      type="text"
                      className="form-control mb-2"
                      placeholder={t("pathologyTestManagementModal.TestCode")}
                      value={editedTest.code}
                      onChange={(e) =>
                        setEditedTest({ ...editedTest, code: e.target.value })
                      }
                    /> */}
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder={t(
                        "pathologyTestManagementModal.Description"
                      )}
                      value={editedTest.description}
                      onChange={(e) =>
                        setEditedTest({
                          ...editedTest,
                          description: e.target.value,
                        })
                      }
                    />
                    <select
                      className="form-control mb-2"
                      value={editedTest.category}
                      onChange={(e) =>
                        setEditedTest({
                          ...editedTest,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">
                        {t("pathologyTestManagementModal.SelectCategory")}
                      </option>
                      {[
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
                      ]
                        .sort()
                        .map((option) => (
                          <option key={option} value={option}>
                            {t(`pathologyTestManagementModal.${option}`)}
                          </option>
                        ))}
                    </select>
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder={t("pathologyTestManagementModal.TestPrice")}
                      value={editedTest.testPrice}
                      onChange={(e) =>
                        setEditedTest({
                          ...editedTest,
                          testPrice: e.target.value,
                        })
                      }
                    />
                    <div className="d-flex justify-content-between">
                      <Button
                        style={{ fontSize: "12px", padding: "4px 5px" }}
                        className="btn btn-secondary"
                        onClick={handleSaveEdit}
                      >
                        {t("pathologyTestManagementModal.Save")}
                      </Button>
                      <Button
                        style={{ fontSize: "12px", padding: "4px 5px" }}
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        {t("pathologyTestManagementModal.Cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h5 className="card-title">
                      {t("pathologyTestManagementModal.TestName")}:{" "}
                      {test.testName}
                    </h5>
                    <p className="card-text">
                      {t("pathologyTestManagementModal.Code")}: {test.code}
                    </p>
                    <p className="card-text">
                      {t("pathologyTestManagementModal.Description")}:{" "}
                      {test.description}
                    </p>
                    <p className="card-text">
                      {t("pathologyTestManagementModal.Category")}:{" "}
                      {test.category}
                    </p>
                    <p className="card-text">
                      {t("pathologyTestManagementModal.TestPrice")}:{" "}
                      {currencySymbols[selectedGlobalCurrency]}{" "}
                      {convertCurrency(
                        test.testPrice,
                        test.Currency,
                        selectedGlobalCurrency
                      ).toFixed(2)}{" "}
                      {selectedGlobalCurrency}
                    </p>
                    <div className="d-flex justify-content-start mt-3">
                      <Button
                        style={{ fontSize: "12px", padding: "4px 5px" }}
                        title={t("pathologyTestManagementModal.EditTest")}
                        className="btn btn-secondary"
                        onClick={() => handleEdit(test)}
                      >
                        <FaPencilAlt />
                      </Button>
                      {/* <Button
                        style={{ fontSize: "12px", padding: "4px 5px" }}
                        title={t("pathologyTestManagementModal.DeleteTest")}
                        className="btn btn-secondary"
                        onClick={() => handleDelete(test.id)}
                      >
                        <FaTrashAlt />
                      </Button> */}
                      <Button
                        style={{ fontSize: "12px", padding: "4px 5px" }}
                        title={t("pathologyTestManagementModal.Add/ViewFields")}
                        className="btn btn-secondary"
                        onClick={() => handleView(test)}
                      >
                        <FaRegEye />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table
          style={{ textAlign: "center" }}
          bordered
          striped
          className="table"
        >
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th style={{ textAlign: "center" }}>
                {t("pathologyTestManagementTable.TestName")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("pathologyTestManagementTable.LabCategoryName")}
              </th>
              {/* <th style={{ textAlign: "center" }}>
                {t("pathologyTestManagementTable.SpecimenName")}
              </th> */}
              <th style={{ textAlign: "center" }}>
                {t("pathologyTestManagementTable.Code")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("pathologyTestManagementTable.Description")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("pathologyTestManagementTable.Category")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("pathologyTestManagementTable.TestPrice")}
              </th>
              <th style={{ textAlign: "center" }}>
                {t("pathologyTestManagementTable.Action")}
              </th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {tests?.map((test) => (
              <tr key={test.id}>
                <td style={{ textAlign: "center" }}>
                  {editingId === test.id ? (
                    <input
                      disabled
                      style={{ fontSize: "13px" }}
                      placeholder="Enter Test Name"
                      type="text"
                      className="form-control"
                      value={editedTest.testName}
                      onChange={(e) =>
                        setEditedTest({
                          ...editedTest,
                          testName: e.target.value,
                        })
                      }
                    />
                  ) : (
                    test.testName
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  {editingId === test.id ? (
                    <Form.Select
                      required
                      style={{ fontSize: "13px" }}
                      id="labCategory"
                      className="form-control mb-2"
                      value={editedTest.labCategoryId}
                      onChange={(e) =>
                        setEditedTest({
                          ...editedTest,
                          labCategoryId: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Lab Category</option>
                      {labCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.CategoryName}
                        </option>
                      ))}
                    </Form.Select>
                  ) : (
                    test.LabCategoryName
                  )}
                </td>
                {/* <td style={{ textAlign: "center" }}>
                  {editingId === test.id ? (
                    <Form.Select
                      required
                      style={{ fontSize: "13px" }}
                      id="specimen"
                      className="form-control mb-2"
                      value={editedTest.specimenId}
                      onChange={(e) =>
                        setEditedTest({
                          ...editedTest,
                          specimenId: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Specimen</option>
                      {specimens.map((specimen) => (
                        <option key={specimen.id} value={specimen.id}>
                          {specimen.SpecimenName}
                        </option>
                      ))}
                    </Form.Select>
                  ) : (
                    test.SpecimenName
                  )}
                </td> */}
                <td style={{ textAlign: "center" }}>
                  {editingId === test.id ? (
                    <input
                      style={{ fontSize: "13px" }}
                      type="text"
                      disabled
                      placeholder="Enter Test Code"
                      className="form-control"
                      value={editedTest.code}
                      onChange={(e) =>
                        setEditedTest({ ...editedTest, code: e.target.value })
                      }
                    />
                  ) : (
                    test.code
                  )}

                  {/* {test.code} */}
                </td>
                <td style={{ textAlign: "center" }}>
                  {editingId === test.id ? (
                    <input
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control"
                      placeholder="Enter Test description"
                      value={editedTest.description}
                      onChange={(e) =>
                        setEditedTest({
                          ...editedTest,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    test.description
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  {editingId === test.id ? (
                    <Form.Select
                      required
                      style={{ fontSize: "13px" }}
                      id="category"
                      className="form-control"
                      value={editedTest.category}
                      onChange={(e) =>
                        setEditedTest({
                          ...editedTest,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Category</option>
                      {[
                        "Bone",
                        "Scan",
                        "Heart",
                        "Thyroid",
                        "Liver",
                        "Vitamin",
                        "Blood Picture",
                        "Kidney",
                        "Blood Sugar",
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
                      ]
                        .sort()
                        .map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                    </Form.Select>
                  ) : (
                    test.category
                  )}
                </td>

                <td style={{ textAlign: "center" }}>
                  {editingId === test.id ? (
                    <>
                      <input
                        style={{ fontSize: "13px" }}
                        type="number"
                        className="form-control"
                        placeholder="Enter Test Price"
                        value={editedTest.testPrice}
                        onChange={(e) =>
                          setEditedTest({
                            ...editedTest,
                            testPrice: e.target.value,
                          })
                        }
                      />
                      <select
                        style={{ fontSize: "13px", marginTop: "10px" }}
                        className="form-control"
                        value={editedTest.Currency}
                        onChange={(e) => {
                          setEditedTest({
                            ...editedTest,
                            Currency: e.target.value,
                          });
                          setCurrency(e.target.value);
                        }}
                      >
                        <option value="USD">USD</option>
                        <option value="INR">INR</option>
                        <option value="EUR">EUR</option>
                        <option value="CDF">CDF</option>
                      </select>
                    </>
                  ) : (
                    `${convertCurrency(
                      test.testPrice,
                      test.Currency,
                      selectedGlobalCurrency
                    )} ${selectedGlobalCurrency}`
                  )}
                </td>
                <td
                  style={{
                    marginTop: "0px",
                    marginTop: "0px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {editingId === test.id ? (
                    <div>
                      <Button
                        style={{
                          marginTop: "0px",
                          fontSize: "13px",
                          padding: "4px 5px",
                        }}
                        className="btn btn-secondary mr-2"
                        onClick={handleSaveEdit}
                      >
                        {t("Save")}
                      </Button>
                      <Button
                        style={{
                          marginTop: "0px",
                          fontSize: "13px",

                          padding: "4px 5px",
                        }}
                        className="btn btn-secondary mr-2"
                        onClick={handleCancelEdit}
                      >
                        {t("Cancel")}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        title={t("EditTest")}
                        style={{
                          marginTop: "0px",
                          fontSize: "13px",
                          padding: "4px 5px",
                        }}
                        className="btn btn-secondary mr-2"
                        onClick={() => handleEdit(test)}
                      >
                        <FaPencilAlt />
                      </Button>
                      {/* <Button
                        title={t("DeleteTest")}
                        style={{
                          marginTop: "0px",
                          fontSize: "13px",

                          padding: "4px 5px",
                        }}
                        className="btn btn-secondary mr-2"
                        onClick={() => handleDelete(test.id)}
                      >
                        <FaTrashAlt />
                      </Button> */}
                      <Button
                        title={t("AddViewFields")}
                        style={{
                          textAlign: "center",
                          marginTop: "0px",
                          fontSize: "13px",
                          whiteSpace: "nowrap",
                          padding: "4px 5px",
                        }}
                        className="btn btn-secondary mr-2"
                        onClick={() => handleView(test)}
                      >
                        <FaRegEye />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal
        style={{ marginTop: "20px" }}
        centered
        backdrop="static"
        size="lg"
        show={showModal}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("pathologyTestManagementModal.CreateNewTest")}
          </Modal.Title>
        </Modal.Header>
        <Card>
          <Card.Header>
            {" "}
            {t("pathologyTestManagementModal.FillLabTestDetails")}
          </Card.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label style={{ marginTop: "10px" }} htmlFor="testName">
                    {t("pathologyTestManagementModal.TestName")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    required
                    style={{ fontSize: "13px" }}
                    type="text"
                    id="testName"
                    className="form-control"
                    placeholder={t("pathologyTestManagementModal.TestName")}
                    value={editedTest.testName}
                    onChange={(e) =>
                      setEditedTest({ ...editedTest, testName: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* <div className="col-6">
                <div className="form-group">
                  <label style={{ marginTop: "10px" }} htmlFor="code">
                    {t("pathologyTestManagementModal.TestCode")}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    id="code"
                    style={{ fontSize: "13px" }}
                    className="form-control"
                    placeholder={t("pathologyTestManagementModal.TestCode")}
                    value={editedTest.code}
                    onChange={(e) =>
                      setEditedTest({ ...editedTest, code: e.target.value })
                    }
                  />
                </div>
              </div> */}
              <div className="col-6">
                <div className="form-group">
                  <label style={{ marginTop: "10px" }} htmlFor="code">
                    {t("pathologyTestManagementModal.LabCategory")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Form.Select
                    required
                    style={{ fontSize: "13px" }}
                    id="labCategory"
                    className="form-control"
                    value={editedTest.labCategoryId} // Assume you have a property called labCategoryId in editedTest state
                    onChange={(e) =>
                      setEditedTest({
                        ...editedTest,
                        labCategoryId: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      {t("pathologyTestManagementModal.SelectLabCategory")}
                    </option>
                    {labCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.CategoryName}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-6">
                <div className="form-group">
                  <label style={{ marginTop: "10px" }} htmlFor="code">
                    {t("pathologyTestManagementModal.LabCategory")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Form.Select
                    required
                    style={{ fontSize: "13px" }}
                    id="labCategory"
                    className="form-control"
                    value={editedTest.labCategoryId} // Assume you have a property called labCategoryId in editedTest state
                    onChange={(e) =>
                      setEditedTest({
                        ...editedTest,
                        labCategoryId: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      {t("pathologyTestManagementModal.SelectLabCategory")}
                    </option>
                    {labCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.CategoryName}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div> */}
              {/* <div className="col-6">
                <div className="form-group">
                  <label style={{ marginTop: "10px" }} htmlFor="code">
                    {t("pathologyTestManagementModal.SelectSpecimen")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Form.Select
                    required
                    style={{ fontSize: "13px" }}
                    id="specimen"
                    className="form-control"
                    value={editedTest.specimenId} // Assume you have a property called specimenId in editedTest state
                    onChange={(e) =>
                      setEditedTest({
                        ...editedTest,
                        specimenId: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      {" "}
                      {t("pathologyTestManagementModal.SelectSpecimen")}
                    </option>
                    {specimens.map((specimen) => (
                      <option key={specimen.id} value={specimen.id}>
                        {specimen.SpecimenName}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div> */}
            </div>

            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label style={{ marginTop: "10px" }} htmlFor="testPrice">
                    {t("pathologyTestManagementModal.TestPrice")}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    required
                    style={{ fontSize: "13px" }}
                    type="number"
                    id="testPrice"
                    className="form-control"
                    placeholder={t("pathologyTestManagementModal.TestPrice")}
                    value={editedTest.testPrice}
                    onChange={(e) =>
                      setEditedTest({
                        ...editedTest,
                        testPrice: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label style={{ marginTop: "10px" }} htmlFor="category">
                    {t("pathologyTestManagementModal.Category")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Form.Select
                    required
                    style={{ fontSize: "13px" }}
                    id="category"
                    className="form-control"
                    value={editedTest.category}
                    onChange={(e) =>
                      setEditedTest({ ...editedTest, category: e.target.value })
                    }
                  >
                    <option value="">
                      {t("pathologyTestManagementModal.SelectCategory")}
                    </option>
                    {[
                      t("Bone"),
                      t("Scan"),
                      t("Heart"),
                      t("Thyroid"),
                      t("Liver"),
                      t("Vitamin"),
                      t("Blood Picture"),
                      t("Kidney"),
                      t("Blood Sugar"),
                      t("Pancreas"),
                      t("Lung/Heart"),
                      t("Vitals"),
                      t("Blood"),
                      t("Diabetes"),
                      t("Lung"),
                      t("Hormone"),
                      t("Joints"),
                      t("Vitals"),
                      t("Abdomen"),
                    ]

                      .sort()
                      .map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                  </Form.Select>
                </div>
              </div>
            </div>
            <div className="row">
              <div
                style={{ marginBottom: "-20px", marginTop: "10px" }}
                className="col-6"
              >
                <div className="form-group">
                  <Form.Group controlId="currency">
                    <Form.Label style={{ marginBottom: "-2px" }}>
                      {t("Currency")}
                    </Form.Label>
                    <Form.Select
                      style={{ fontSize: "13px" }}
                      as="select"
                      required
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="INR">INR</option>
                      <option value="CDF">CDF</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label style={{ marginTop: "10px" }} htmlFor="description">
                    {t("pathologyTestManagementTable.Description")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    style={{ fontSize: "13px" }}
                    required
                    id="description"
                    className="form-control"
                    placeholder="Description"
                    value={editedTest.description}
                    onChange={(e) =>
                      setEditedTest({
                        ...editedTest,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
        </Card>
        <Card>
          <Card.Header>
            {" "}
            {t("pathologyTestManagementModal.AddParametersForThisLabTest")}
          </Card.Header>
          <Modal.Body>
            {fieldInputs.map((field, index) => (
              <div className="form-group" key={index}>
                <label
                  htmlFor={`field${index}`}
                  style={{ marginBottom: "5px" }}
                >
                  {t("pathologyTestManagementModal.EnterParameterName")}{" "}
                </label>
                <div className="input-group">
                  <input
                    required
                    style={{ fontSize: "13px", marginRight: "10px" }}
                    type="text"
                    id={`field${index}`}
                    className="form-control"
                    placeholder={t(
                      "pathologyTestManagementModal.EnterParameterName"
                    )}
                    value={field}
                    onChange={(e) => handleFieldInputChange(e, index)}
                  />
                  {/* Additional input fields */}

                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ fontSize: "12px" }}
                      onClick={() => handleRemoveField(index)}
                    >
                      {t("pathologyTestManagementModal.Remove")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Modal.Body>

          <Modal.Footer>
            <Button
              style={{
                fontSize: "13px",
                padding: "4px 5px",
                marginTop: "5px",
              }}
              variant="secondary"
              onClick={handleAddField}
            >
              {t("pathologyTestManagementModal.AddMore")}
            </Button>{" "}
            {/* <Button
              style={{ fontSize: "13px", padding: "4px 5px" }}
              variant="secondary"
              onClick={handleSaveFields}
            >
              Save Fields
            </Button> */}
          </Modal.Footer>
        </Card>
        <Modal.Footer>
          <Button
            style={{
              fontSize: "13px",

              padding: "4px 5px",
            }}
            variant="secondary"
            onClick={closeModal}
          >
            {t("pathologyTestManagementModal.Close")}
          </Button>
          <Button
            style={{ fontSize: "13px", padding: "4px 5px" }}
            variant="secondary"
            onClick={handleCreateNew}
          >
            {t("pathologyTestManagementModal.CreateLabTest")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        style={{ marginTop: "20px" }}
        centered
        backdrop="static"
        show={showViewModal}
        onHide={closeViewModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("testDetailsModal.TestName")}: {TestNameSelected}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table style={{ textAlign: "center" }} className="table">
            <thead>
              <tr>
                {/* {t("pathologyViewTable.ParameterName")} */}
                {/*               <th style={{ textAlign: "center" }}>Field Name in View Columns</th> */}

                <th style={{ textAlign: "center" }}>
                  {t("pathologyViewTable.ParameterName")}
                </th>
                <th style={{ textAlign: "center" }}>
                  {t("testDetailsModal.Delete")}
                </th>
              </tr>
            </thead>
            <tbody>
              {normalValuesData?.map((data, index) => {
                return (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>{data.fieldName}</td>

                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-danger"
                        style={{
                          fontSize: "13px",

                          padding: "4px 5px",
                          color: "white",
                          border: "none",
                        }}
                        onClick={() => handleDeleteColumn(data.fieldName)}
                      >
                        <th style={{ textAlign: "center" }}>
                          {t("testDetailsModal.Delete")}
                        </th>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {viewColumns?.map((column, index) => {
                const matchingNormalValue = normalValuesData?.find(
                  (data) => data.fieldName === column
                );

                if (
                  !matchingNormalValue &&
                  ![
                    "PatientTestBookingID",
                    "id",
                    "TestManagementID",
                    "PatientID",
                    "createdAt",
                    "updatedAt",
                  ].includes(column)
                ) {
                  return (
                    <tr
                      className={`${column == "Comment" ? "d-none" : ""}`}
                      key={index}
                    >
                      <td style={{ textAlign: "center" }}>{column}</td>

                      <td style={{ textAlign: "center" }}>
                        <button
                          className="btn btn-danger"
                          style={{
                            fontSize: "13px",

                            padding: "4px 5px",
                            color: "white",
                            border: "none",
                          }}
                          onClick={() => handleDeleteColumn(column)}
                        >
                          {t("testDetailsModal.Delete")}
                        </button>
                      </td>
                    </tr>
                  );
                } else {
                  return null;
                }
              })}
            </tbody>
          </table>
        </Modal.Body>

        <Modal.Body>
          {fieldInputs.map((field, index) => (
            <div className="form-group" key={index}>
              <label htmlFor={`field${index}`} style={{ marginBottom: "5px" }}>
                {t("pathologyTestManagementModal.EnterParameterName")}
              </label>
              <div className="input-group">
                <input
                  required
                  style={{ fontSize: "13px", marginRight: "10px" }}
                  type="text"
                  id={`field${index}`}
                  className="form-control"
                  placeholder={t(
                    "pathologyTestManagementModal.EnterParameterName"
                  )}
                  value={field}
                  onChange={(e) => handleFieldInputChange(e, index)}
                />
                {/* Additional input fields */}

                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ fontSize: "12px" }}
                    onClick={() => handleRemoveField(index)}
                  >
                    {t("testDetailsModal.Remove")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button
            style={{
              fontSize: "13px",
              padding: "4px 5px",
              marginTop: "5px",
            }}
            variant="secondary"
            onClick={handleAddField}
          >
            {t("testDetailsModal.AddMore")}
          </Button>{" "}
          <Button
            style={{ fontSize: "13px", padding: "4px 5px" }}
            variant="secondary"
            onClick={handleSaveFields}
          >
            {t("testDetailsModal.SaveParameters")}
          </Button>
        </Modal.Footer>

        <Modal.Footer>
          <Button
            style={{
              fontSize: "13px",

              padding: "4px 5px",
            }}
            variant="secondary"
            onClick={closeViewModal}
          >
            {t("testDetailsModal.Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PathalogyTestManagement;
