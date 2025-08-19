import { FaPencilAlt, FaPlus, FaTrashAlt, FaRegEye } from "react-icons/fa";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Translation from "../translations/ManageDrugDatabase.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import UploadFiveDrugIfmedicineList from "../assets/Drugs_Five.csv";
import { CurrencyContext } from "../context/CurrencyProvider";

const DrugDatabaseList = () => {
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

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
  const [medicineList, setMedicineList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [allSubstitutes, setAllSubstitutes] = useState([]);
  const [drugOptions, setDrugOptions] = useState([]);
  const [showInitialModal, setShowInitialModal] = useState(false);

  useEffect(() => {
    fetchMedicineList();
  }, []);

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  const fetchMedicineList = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const REMOTE_URL = `${API_BASE_URL}/api/drugs`;
      const response = await axios.get(REMOTE_URL, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      });
      const options = response.data.map((drug) => ({
        medicine_Id: drug.id,
        value: drug.medicineName,
        label: drug.medicineName,
        medicineName: drug.medicineName,
      }));
      setDrugOptions(options);

      setMedicineList(response.data);
      if (response.data.length === 0) {
        setShowInitialModal(true);
      }
    } catch (error) {
      console.error("Error fetching medicine list:", error);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "20px", // Adjust the height as per your requirement
    }),
    input: (provided) => ({
      ...provided,
      minHeight: "15px", // Adjust the height as per your requirement
    }),
  };

  const handleSubmit2 = async () => {
    try {
      const formData = new FormData();
      const response = await fetch(UploadFiveDrugIfmedicineList);
      const fileBlob = await response.blob();

      const file = new File([fileBlob], "Drugs_Five.csv");

      formData.append("file", file);
      // alert(file);
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
      fetchMedicineList();
      setShowInitialModal(false);
      //  navigate(`/${extractedPart}/ManageDrugDatabase`);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prevState) => ({ ...prevState, [name]: value }));
  };

  const filterMedicineList = (medicine) => {
    const { medicineName, createdAt } = medicine;
    const searchMatches = medicineName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const dateMatches = checkDateRange(createdAt);

    return searchMatches && dateMatches;
  };

  const checkDateRange = (date) => {
    if (!dateRange.start && !dateRange.end) {
      return true;
    }

    if (dateRange.start && !dateRange.end) {
      return date >= dateRange.start;
    }

    if (!dateRange.start && dateRange.end) {
      return date <= dateRange.end;
    }

    return date >= dateRange.start && date <= dateRange.end;
  };

  const handleAddButtonClick = (medicine) => {
    setSelectedMedicine(medicine);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedMedicine(null);
    setAllSubstitutes([]);
  };

  const handleSubstitutesChange = (selectedOptions) => {
    setAllSubstitutes(selectedOptions);
  };

  const handleSubmit = async () => {
    try {
      if (!allSubstitutes || allSubstitutes.length === 0) {
        // Display a toast error if no substitutes are selected
        toast.error(t("Pleaseselectatleastonesubstitute"), {
          style: { fontSize: "13px" },
        });
        return;
      }

      const data = {
        selectedMedicine: selectedMedicine,
        allSubstitutes: allSubstitutes,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/addDrugSubstitute`,
        data,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      console.log("Response from server:", response.data);

      handleModalClose();
      toast.success(t("Substitutesaddedsuccessfully"), {
        style: { fontSize: "13px" },
      });
    } catch (error) {
      console.error("Error saving medicine:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteButtonClick = async (id) => {
    const confirmed = window.confirm(t("Areyousureyouwanttodeletethisdrug"));
    if (confirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/deletedrugs/${id}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        toast.success(t("Drugdeletedsuccessfully"), {
          style: { fontSize: "13px" },
        });
        fetchMedicineList();
      } catch (error) {
        console.error("Error deleting drug:", error);
        toast.error(t("Failedtodeletedrug"), {
          style: { fontSize: "13px" },
        });
      }
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
    return "Access Denied!";
  }
  if (currentUser && !currentUser.roles.includes("ROLE_ADMIN")) {
    // Redirect or show error message when the user is not an admin or pharmacist
    return "Access Denied!";
  }

  const style = {
    width: "98%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "12px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "14px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "16px" /* Adjust the font size for <h3> */,
  };

  const convertArrayOfObjectsToCSV = (data) => {
    const csvHeader = Object.keys(data[0]).join(",") + "\n";
    const csvRows = data.map((row) => Object.values(row).join(",") + "\n");
    return csvHeader + csvRows.join("");
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/drugs`,
        {
          responseType: "json", // Set response type to JSON
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        },
        {}
      );

      const csvData = convertArrayOfObjectsToCSV(response.data);

      const downloadUrl = URL.createObjectURL(
        new Blob([csvData], { type: "text/csv" })
      );

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "drugs.csv");
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
    <div style={style}>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("DrugDatabase")}</h2>
      </header>
      <br></br>
      <div style={{ fontWeight: "bold" }} class="row">
        <div class="col-md-3 mb-3">
          <label for="searchInput" class="form-label">
            {t("SearchMedicinebyname")}
          </label>
          <input
            type="text"
            placeholder={t("SearchMedicinebyname")}
            style={{ fontSize: "12px" }}
            class="form-control"
            id="searchInput"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div
          style={{ marginTop: "5px" }}
          class="col-md-auto mb-3 d-flex justify-content-center align-items-center"
        >
          <Link
            to={`/${extractedPart}/addDrugToDatabase`}
            style={{
              fontSize: "13px",
              padding: "4px 5px",
              marginRight: "10px",
            }}
          >
            <Button
              variant="secondary"
              style={{
                marginTop: "20px",
                fontSize: "12px",
                padding: "4px 5px",
                whiteSpace: "nowrap",
                marginRight: "10px",
              }}
            >
              {t("AddDrug")}
            </Button>
            <br></br>
          </Link>
          <Link
            to={`/${extractedPart}/UploadDrugData`}
            style={{
              fontSize: "12px",
              padding: "4px 5px",
              marginRight: "10px",
            }}
          >
            <Button
              variant="secondary"
              style={{
                marginTop: "20px",
                fontSize: "12px",
                padding: "4px 5px",
                marginRight: "10px",
              }}
            >
              {t("UploadDrugData")}
            </Button>
            <br></br>
          </Link>
        </div>
        {/* <div style={{ marginTop: "5px" }} class="col-md-auto mb-3">
          <Button
            variant="secondary"
            style={{
              marginTop: "24px",
              fontSize: "12px",
              padding: "4px 5px",
              marginRight: "10px",
            }}
            onClick={handleExportData}
          >
            {t("downloadAsCSV")}
          </Button>
        </div> */}
        {/* <div style={{ marginTop: "30px" }} class="col-md-auto mb-3">
          
        </div> */}
        <div class="col-md-4 mb-3"></div>
        {/* <div class="col-md-2 mb-3">
          <label
            for="startDate"
            style={{ fontSize: "12px" }}
            class="form-label"
          >
            Start Date:
          </label>
          <input
            type="date"
            style={{ fontSize: "12px" }}
            class="form-control"
            id="startDate"
            name="start"
            value={dateRange.start}
            onChange={handleDateRangeChange}
          />
        </div>
        <div class="col-md-2 mb-3">
          <label for="endDate" class="form-label">
            End Date:
          </label>
          <input
            type="date"
            style={{ fontSize: "12px" }}
            class="form-control"
            id="endDate"
            name="end"
            value={dateRange.end}
            onChange={handleDateRangeChange}
          />
        </div> */}
      </div>
      <div className="table-responsive">
        <Table
          className="table-striped table-hover table-bordered"
          style={{ verticalAlign: "middle", textAlign: "center" }}
          responsive
          striped
          bordered
          hover
        >
          <Thead>
            <Tr>
              <Th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("manageDrugTable.SrNo")}
              </Th>
              <Th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("manageDrugTable.DrugName")}
              </Th>
              <Th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("manageDrugTable.Manufacturer")}
              </Th>
              <Th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {t("manageDrugTable.Composition")}
              </Th>
              <Th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("manageDrugTable.Packaging")}
              </Th>
              <Th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("manageDrugTable.Price")}
              </Th>
              <Th style={{ verticalAlign: "middle", textAlign: "center" }}>
                {t("manageDrugTable.Action")}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {medicineList.filter(filterMedicineList).map((medicine, index) => (
              <Tr key={medicine.id}>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {index + 1}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {medicine.medicineName}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {medicine.manufacturer}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {medicine.saltComposition}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {medicine.packaging}
                </Td>
                <Td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {convertCurrency(medicine.price, medicine.Currency, "")}{" "}
                  {selectedGlobalCurrency}
                </Td>
                {/* <Td>{formatDate(medicine.createdAt)}</Td> */}

                <Td
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Link
                    to={`/${extractedPart}/ViewDrugMedicine/${medicine.id}`}
                  >
                    <Button
                      title={t("manageDrugTable.ViewDrug")}
                      className="btn btn-secondary mr-2"
                      style={{
                        fontSize: "12px",
                        marginTop: "0px",
                        padding: "4px 5px",
                      }}
                      onClick={() => handleAddButtonClick(medicine)}
                    >
                      <FaRegEye />
                    </Button>
                  </Link>{" "}
                  <Link
                    to={`/${extractedPart}/UpdateDrugOFDatabase/${medicine.id}`}
                  >
                    <Button
                      title={t("manageDrugTable.Edit")}
                      className="btn btn-secondary mr-2"
                      style={{
                        fontSize: "12px",
                        marginTop: "0px",
                        padding: "4px 5px",
                      }}
                      onClick={() => handleAddButtonClick(medicine)}
                    >
                      <FaPencilAlt />
                    </Button>
                  </Link>{" "}
                  <Button
                    title={t("manageDrugTable.Delete")}
                    className="btn btn-secondary mr-2"
                    style={{
                      marginTop: "0px",
                      fontSize: "12px",
                      padding: "4px 5px",
                    }}
                    onClick={() => handleDeleteButtonClick(medicine.id)}
                  >
                    <FaTrashAlt />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <Modal style={style} show={showModal} onHide={handleModalClose}>
        <br></br>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("AddSubstitutes")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {t("SelectedMedicine")}:{" "}
            <strong> {selectedMedicine?.medicineName}</strong>
          </p>
          <label htmlFor="substitutesSelect" className="form-label">
            {t("SelectSubstitutes")}:
          </label>
          <Select
            style={{ fontSize: "12px" }}
            options={drugOptions}
            value={allSubstitutes}
            styles={customStyles}
            isMulti
            onChange={(selectedOptions) => setAllSubstitutes(selectedOptions)}
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ fontSize: "12px", padding: "4px 5px" }}
            onClick={handleSubmit}
          >
            {t("Submit")}
          </Button>

          <Button
            variant="secondary"
            style={{
              fontSize: "12px",
              margintop: "10px",
              padding: "4px 5px",
            }}
            onClick={handleModalClose}
          >
            {t("Cancel")}
          </Button>
        </Modal.Footer>
      </Modal>
      {showInitialModal && (
        <Modal
          size="lg"
          style={{ marginTop: "20px" }}
          centered
          show={showInitialModal}
          onHide={() => setShowInitialModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "16px" }}>
              {t("InitialModalTitle")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ fontSize: "12px" }}>
            {t("InitialModalMessage")}
          </Modal.Body>
          <Modal.Footer>
            <Button
              style={{ fontSize: "12px" }}
              variant="secondary"
              onClick={() => setShowInitialModal(false)}
            >
              {t("NoThanksButtonLabel")}
            </Button>
            <Button
              style={{ fontSize: "12px" }}
              variant="secondary"
              onClick={handleSubmit2}
            >
              {t("UploadDrugsButtonLabel")}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default DrugDatabaseList;
