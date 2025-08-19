import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Button, Modal, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import AuthService from "../services/auth.service";
import {
  FaPencilAlt,
  FaPlus,
  FaTrashAlt,
  FaRegEye,
  FaPenAlt,
} from "react-icons/fa";
import Translation from "../translations/HospitalRooms.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import Select from "react-select";
import axios from "axios";
import { json } from "react-router";
import { CurrencyContext } from "../context/CurrencyProvider";

const HospitalRooms = () => {
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();
  const { selectedGlobalCurrency, convertCurrency } =
    useContext(CurrencyContext);

  const [hospitalRooms, setHospitalRooms] = useState([]);
  const [room, setRoom] = useState({
    department: "",
    name: "",
    type: "",
    number: "",
    beds: [],
    bedStatusOptions: [t("Active"), t("Inactive")],
    bedStatus: "Active",
    number_of_beds: "",
    totalCost: "",
    currency: "",
    status: "",
  });
  const [editableRoom, setEditableRoom] = useState({});
  const [showModal, setShowModal] = useState(false);

  ///

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

  ///

  const getRoomsData = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/hospital-rooms`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setHospitalRooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  };

  const handleClose = () => {
    setEditableRoom({});
    setShowModal(false);
  };

  const handleAddBed = () => {
    setEditableRoom((prevRoom) => {
      const updatedBeds = prevRoom.beds ? [...prevRoom.beds] : [];
      updatedBeds.push({
        bedNumber: "",
        bedType: "",
        bedPrice: "",
        bedStatus: prevRoom.bedStatus,
      });
      return { ...prevRoom, beds: updatedBeds };
    });
  };

  const handleRemoveBed = (index) => {
    setEditableRoom((prevRoom) => {
      const updatedBeds = [...prevRoom.beds];
      updatedBeds.splice(index, 1);
      return { ...prevRoom, beds: updatedBeds };
    });
  };
  const handleBedChange = (bedIndex, field, value) => {
    setEditableRoom((prevRoom) => {
      const updatedBeds = [...prevRoom.beds];
      updatedBeds[bedIndex][field] = value;
      return { ...prevRoom, beds: updatedBeds };
    });
  };

  const handleEdit = (room) => {
    // Check if room.beds is defined and not null
    const beds =
      room.beds && room.beds.length
        ? room.beds.map((bed) => ({
            bedNumber: bed.bedNumber || "",
            bedType: bed.bedType || "",
            bedPrice: bed.bedPrice || "",
            bedStatus: bed.BedStatus || "",
          }))
        : [];

    setEditableRoom({
      ...room,
      beds: beds,
    });

    setShowModal(true);
  };

  const handleCreateOrUpdate = () => {
    if (
      !editableRoom.department ||
      !editableRoom.name ||
      !editableRoom.type ||
      !editableRoom.number ||
      !editableRoom.currency ||
      !editableRoom.status ||
      editableRoom.beds.some(
        (bed) =>
          !bed.bedNumber || !bed.bedType || !bed.bedPrice || !bed.bedStatus
      )
    ) {
      // Display a toast error if any required field is empty
      toast.error(t("AllFieldsAreRequired"));
      return;
    }

    if (!editableRoom.beds || editableRoom.beds?.length < 1) {
      toast.error(t("PleaseAddAtLeastOneBed"));
      return;
    }
    const isAnyBedFieldMissing = editableRoom.beds.some(
      (bed) =>
        bed.bedNumber.trim() === "" ||
        bed.bedType.trim() === "" ||
        bed.bedStatus.trim() === "" ||
        bed.bedPrice === ""
    );

    if (isAnyBedFieldMissing) {
      // Show toast error if any bed field is missing
      toast.error(t("FillInAllBedDetailsBeforeAdding"));
      return;
    }
    const totalFees = editableRoom.beds
      ? editableRoom.beds.reduce(
          (total, bed) => total + parseFloat(bed.bedPrice || 0),
          0
        )
      : 0;

    //alert(totalFees);
    //return;
    setEditableRoom((prevRoom) => ({
      ...prevRoom,
      totalCost: totalFees.toFixed(2),
      number_of_beds: prevRoom.beds ? prevRoom.beds.length : 0,
    }));

    const apiEndpoint = editableRoom.id
      ? `${import.meta.env.VITE_API_URL}/api/hospital-rooms/${editableRoom.id}`
      : `${import.meta.env.VITE_API_URL}/api/add-hospital-room`;

    // alert(JSON.stringify(editableRoom));
    axios
      .post(apiEndpoint, editableRoom, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        toast.success(
          editableRoom.id
            ? t("RoomUpdatedSuccessfully")
            : t("RoomCreatedSuccessfully")
        );
        setEditableRoom({});
        handleClose();
        getRoomsData();
      })
      .catch((error) => {
        console.error("Error creating/updating room:", error);
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error(t("ErrorCreatingUpdatingRoom"));
        }
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/hospital-rooms/${id}`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        toast.success(t("RoomDeletedSuccessfully"));
        getRoomsData();
      })
      .catch((error) => {
        console.error("Error deleting room:", error);
        toast.error(t("ErrorDeletingRoom"));
      });
  };

  useEffect(() => {
    getRoomsData();
  }, []);

  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    return "Access Denied";
  }
  return (
    <div className="container">
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {t("BedCategoryAndManagement")}
      </header>
      <br />
      <Button
        style={{ fontSize: "12px" }}
        variant="secondary"
        onClick={() => {
          setEditableRoom((prevEditableRoom) => ({
            ...prevEditableRoom,
            status: "active",
          }));
          setShowModal(true);
        }}
      >
        {t("CreateRoom")}
      </Button>
      <br></br>
      <br></br>
      <Table
        style={{ textAlign: "center", fontSize: "12px" }}
        bordered
        striped
        responsive
      >
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>{t("hospitalRoomTable.ID")}</th>
            <th style={{ textAlign: "center" }}>
              {t("hospitalRoomTable.DepartmentType")}
            </th>
            <th style={{ textAlign: "center" }}>
              {t("hospitalRoomTable.RoomName")}
            </th>
            <th style={{ textAlign: "center" }}>
              {t("hospitalRoomTable.RoomType")}
            </th>
            <th style={{ textAlign: "center" }}>
              {t("hospitalRoomTable.RoomNumber")}
            </th>
            <th style={{ textAlign: "center" }}>
              {t("hospitalRoomTable.NoOfBeds")}
            </th>
            <th style={{ textAlign: "center" }}>
              {t("hospitalRoomTable.Currency")}
            </th>
            <th style={{ textAlign: "center" }}>
              {t("hospitalRoomTable.TotalCost")}
            </th>
            {/*               <th style={{ textAlign: "center" }}>Status</th> */}
            <th style={{ textAlign: "center" }}>
              {t("hospitalRoomTable.CreatedDate")}
            </th>
            <th style={{ textAlign: "center" }}>
              {t("hospitalRoomTable.Actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {hospitalRooms.map((room, index) => (
            <tr key={index}>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {index + 1}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {room.department}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {room.name}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {room.type}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {room.number}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {room.number_of_beds}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {selectedGlobalCurrency}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {convertCurrency(
                  room.totalCost,
                  room.currency,
                  selectedGlobalCurrency
                )}
              </td>
              {/* <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {room.status}
              </td> */}
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                {new Date(room.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                <Button
                  style={{
                    fontSize: "12px",
                    marginTop: "0px",
                    padding: "4px 8px",
                  }}
                  variant="secondary"
                  title="Edit"
                  onClick={() => handleEdit(room)}
                >
                  <FaPencilAlt />
                </Button>{" "}
                <Button
                  style={{
                    fontSize: "12px",
                    marginTop: "0px",
                    padding: "4px 8px",
                  }}
                  variant="danger"
                  title="Delete"
                  onClick={() => handleDelete(room.id)}
                >
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for creating/editing rooms */}
      <Modal
        size="lg"
        show={showModal}
        style={{ marginTop: "20px" }}
        centered
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {editableRoom.id ? t("UpdateBedsAndRoom") : t("CreateBedsAndRoom")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="department">
                  <Form.Label>{t("DepartmentType")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("EnterDepartmentType")}
                    name="department"
                    value={editableRoom.department || ""}
                    onChange={(e) =>
                      setEditableRoom({
                        ...editableRoom,
                        department: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="name">
                  <Form.Label>{t("RoomName")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("EnterRoomName")}
                    name="name"
                    value={editableRoom.name || ""}
                    onChange={(e) =>
                      setEditableRoom({ ...editableRoom, name: e.target.value })
                    }
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="type">
                  <Form.Label>{t("RoomType")}</Form.Label>
                  <Form.Select
                    name="type"
                    value={editableRoom.type || ""}
                    onChange={(e) =>
                      setEditableRoom({ ...editableRoom, type: e.target.value })
                    }
                  >
                    <option value="">{t("Select")}...</option>
                    <option value="AC">{t("AC")}</option>
                    <option value="Non-AC">{t("NonAC")}</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="number">
                  <Form.Label>{t("RoomNumber")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("EnterRoomNumber")}
                    name="number"
                    value={editableRoom.number || ""}
                    onChange={(e) => {
                      // Allow only digits
                      const sanitizedValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      setEditableRoom({
                        ...editableRoom,
                        number: sanitizedValue,
                      });
                    }}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-6">
                <Form.Group controlId="number_of_beds">
                  <Form.Label>No of Beds</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter number of beds"
                    name="number_of_beds"
                    value={editableRoom.number_of_beds || ""}
                    onChange={(e) =>
                      setEditableRoom({
                        ...editableRoom,
                        number_of_beds: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div> */}

              <div className="col-6">
                <Form.Group controlId="status">
                  <Form.Label>{t("Status")}</Form.Label>
                  <Form.Select
                    name="status"
                    disabled={!editableRoom.id}
                    value={editableRoom.status || ""}
                    onChange={(e) =>
                      setEditableRoom({
                        ...editableRoom,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="">{t("Select")}...</option>
                    <option value="active">{t("Active")}</option>
                    <option value="inactive">{t("Inactive")}</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="currency">
                  <Form.Label>{t("Currency")}</Form.Label>
                  <Form.Select
                    name="currency"
                    value={editableRoom.currency || ""}
                    onChange={(e) =>
                      setEditableRoom({
                        ...editableRoom,
                        currency: e.target.value,
                      })
                    }
                  >
                    <option value="">{t("Select")}...</option>
                    <option value="EUR">EUR</option>
                    <option value="CDF">CDF</option>

                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            {/* <div className="row">
              <div className="col-6">
                <Form.Group controlId="totalCost">
                  <Form.Label>Total cost</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter total cost"
                    name="totalCost"
                    value={editableRoom.totalCost || ""}
                    onChange={(e) =>
                      setEditableRoom({
                        ...editableRoom,
                        totalCost: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
              
            </div> */}
            <>
              {/* Dynamic Bed Fields */}
              {editableRoom.beds?.map((bed, index) => (
                <div key={index} className="row">
                  <div className="col-2">
                    <Form.Group controlId={`bedNumber-${index}`}>
                      <Form.Label>{t("BedNumber")}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t("EnterBedNumber")}
                        value={bed.bedNumber}
                        onChange={(e) => {
                          // Allow only digits
                          const sanitizedValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          handleBedChange(index, "bedNumber", sanitizedValue);
                        }}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-3">
                    <Form.Group controlId={`bedType-${index}`}>
                      <Form.Label>{t("BedType")}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t("EnterBedType")}
                        value={bed.bedType}
                        onChange={(e) =>
                          handleBedChange(index, "bedType", e.target.value)
                        }
                      />
                    </Form.Group>
                  </div>
                  <div className="col-2">
                    <Form.Group controlId={`bedPrice-${index}`}>
                      <Form.Label>{t("BedPrice")}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t("EnterBedPrice")}
                        value={bed.bedPrice}
                        onChange={(e) =>
                          handleBedChange(index, "bedPrice", e.target.value)
                        }
                        onKeyPress={(e) => {
                          // Allow only digits and one dot
                          const isValidInput = /^[0-9.]$/.test(e.key);
                          if (!isValidInput) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-2">
                    <Form.Group controlId={`bedStatus-${index}`}>
                      <Form.Label>{t("BedStatus")}</Form.Label>
                      <Form.Select
                        value={bed.bedStatus}
                        onChange={(e) =>
                          handleBedChange(index, "bedStatus", e.target.value)
                        }
                      >
                        <option>{t("SelectStatus")}</option>
                        {room.bedStatusOptions.map((status, statusIndex) => (
                          <option key={statusIndex} value={status}>
                            {status}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <div className="col-2">
                    <Button
                      style={{ fontSize: "12px", marginTop: "35px" }}
                      variant="danger"
                      onClick={() => handleRemoveBed(index)}
                    >
                      {t("Remove")}
                    </Button>
                  </div>
                </div>
              ))}
              <br></br>
              <Button
                style={{ fontSize: "12px" }}
                variant="secondary"
                onClick={handleAddBed}
              >
                {t("AddBed")}
              </Button>
            </>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("Close")}
          </Button>
          <Button variant="primary" onClick={handleCreateOrUpdate}>
            {editableRoom.id ? t("Update") : t("Create")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HospitalRooms;
