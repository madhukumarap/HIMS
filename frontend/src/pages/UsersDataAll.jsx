import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Select from "react-select";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import AuthService from "../services/auth.service";
import { ToastContainer, toast } from "react-toastify";
import { FaPenAlt, FaTrashAlt } from "react-icons/fa";
import axios from "axios";

import Translation from "../translations/UsersData.json";
import { useTranslation } from "react-i18next";
import { initReactI18next } from "react-i18next";
import i18n, { t } from "i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

const UserList = (props) => {
  const currentUser = AuthService.getCurrentUser();
  const lastBackupDump = props.lastBackupDump;

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [nameOrPhoneFilter, setNameOrPhoneFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [isCardView, setIsCardView] = useState(false);
  const [editableUser, setEditableUser] = useState({});
  const [roles, setRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [mainHospitalsData, setMainHospitalsData] = useState([]);

  const getCurrentHospitalData = () => {
    const currentPath = window.location.pathname;
    const matchResult = currentPath.match(/mediai\/([^\/]+)/);
    let extractedPart;
    if (matchResult && matchResult[1]) {
      extractedPart = matchResult[1].toLocaleLowerCase();
    }

    // Find matching hospital in mainHospitalsData
    if (extractedPart && mainHospitalsData.length > 0) {
      return mainHospitalsData.find(
        (hospital) =>
          hospital.name.toLowerCase() === extractedPart.toLowerCase()
      );
    }
    return null;
  };

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

    // Initialize only once when component mounts
    initializei18n();

    // Remove the setInterval completely
    // No need to keep re-initializing i18n
  }, []); // Empty dependency array ensures this runs only once

  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPP";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };

  ///

  const toggleView = () => {
    setIsCardView(!isCardView);
  };

  const headersData = {
    headers: { Authorization: ` ${sessionStorage.getItem("token")}` },
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

  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }

  useEffect(() => {
    getRoles();
    getUsersRoles();
    getAllMainHospitals();
  }, []);

  const getUsersData = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
        // Count active users from the response
        const activeCount = data.filter(
          (user) => user.status === "active"
        ).length;
        setActiveUserCount(activeCount);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  const getUsersRoles = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/user-roles/list`, {
      // Added "/list"
      headers: {
        Authorization: `${currentUser?.Token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUserRoles(data);
      })
      .catch((error) => {
        console.error("Error fetching user roles:", error);
        // Set error state if needed
      });
  };

  const getRoles = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/roles`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRoles(data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  };

  useEffect(() => {
    // Fetch user data from the Node.js backend
    fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: {
        Authorization: `${currentUser?.Token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const getAllMainHospitals = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/get-hospitals`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
          MainDatabase: "healthcare",
        },
      })
      .then((response) => {
        setMainHospitalsData(response.data);
      })
      .catch((error) => {
        console.log("Error fetching hospitals data:", error);
        toast.error("Error fetching hospitals data");
      });
  };

  useEffect(() => {
    let filtered = users.filter((user) => {
      let nameOrPhoneMatch = true;
      if (nameOrPhoneFilter) {
        nameOrPhoneMatch =
          user.name.toLowerCase().includes(nameOrPhoneFilter.toLowerCase()) ||
          (user.phoneNumber &&
            user.phoneNumber.toString().includes(nameOrPhoneFilter));
      }
      let startDateMatch = true;
      if (startDateFilter) {
        startDateMatch = new Date(user.createdAt) >= new Date(startDateFilter);
      }
      let endDateMatch = true;
      if (endDateFilter) {
        endDateMatch = new Date(user.createdAt) <= new Date(endDateFilter);
      }
      return nameOrPhoneMatch && startDateMatch && endDateMatch;
    });
    setFilteredUsers(filtered);
  }, [users, nameOrPhoneFilter, startDateFilter, endDateFilter]);

  const updateUser = async () => {
    try {
      // Get current hospital data
      const currentHospital = getCurrentHospitalData();
      if (!currentHospital) {
        toast.error("Could not determine current hospital");
        return;
      }

      // First get all users to count active ones
      const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      });

      const allUsers = await usersResponse.json();

      // Count active users from the response
      const currentActiveCount = allUsers.filter(
        (user) => user.status === "active"
      ).length;

      // Check if we're trying to activate
      if (editableUser.status === "active") {
        // Check if user was previously inactive
        const userWasInactive =
          users.find((u) => u.id === editableUser.id)?.status === "inactive";

        // Calculate what the new active count would be
        const wouldBeActiveCount = userWasInactive
          ? currentActiveCount + 1
          : currentActiveCount;

        // Use the allowed_users from hospital data
        if (wouldBeActiveCount > currentHospital.allowed_users) {
          toast.error(
            `Maximum of ${currentHospital.allowed_users} active users reached. Cannot activate more users`
          );
          return;
        }
      }

      // Proceed with the update
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update-status`,
        editableUser,
        headersData
      );

      toast.success(
        editableUser.status === "active"
          ? t("ActivatedTheUserSuccessfully")
          : t("DeactivatedTheUserSuccessfully")
      );

      setEditableUser({});
      getUsersData(); // This will refresh both the user list and active count
    } catch (error) {
      toast.error(t("Errorupdatinguserdetails"));
      console.error("Error updating user details:", error);
    }
  };

  // //Add a useEffect to log the current hospital data for debugging:
  // useEffect(() => {
  //   const hospital = getCurrentHospitalData();
  //   console.log("Current hospital data:", hospital);
  // }, [mainHospitalsData]);

  const handleDelete = (id) => {
    // Check if the user is the super admin
    const userToDelete = filteredUsers.find((user) => user.id === id);
    if (userToDelete.username === "Hospital_Admin") {
      toast.error(t("SuperAdminCantbeDeleted"));
      return;
    }

    const confirmDelete = window.confirm(
      t("Areyousureyouwanttodeletethisuser")
    );

    if (confirmDelete) {
      // Send delete request to the Node.js backend
      fetch(`${import.meta.env.VITE_API_URL}/api/deleteUser/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            // Remove the deleted user from the filtered users list
            const updatedUsers = filteredUsers.filter((user) => user.id !== id);
            setFilteredUsers(updatedUsers);
            toast.success(t("UserdeletedSuccessfully"));
          } else {
            console.error("Error deleting user:", response.status);
          }
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    // If the user is not logged in or does not have the admin role,
    // you can show a message or redirect to another page.
    return "Access Denied";
  }

  const style = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    fontSize: "14px",
  };

  const h1Style = {
    fontSize: "16px",
  };

  const h2Style = {
    fontSize: "14px",
  };

  const h3Style = {
    fontSize: "16px",
  };

  const currentHospital = getCurrentHospitalData();
  console.log("currentHospital", currentHospital);

  return (
    <Container style={style}>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={h1Style}>{t("UsersList")}</h2>
      </header>
      <br />
      <Row>
        <Col md={3}>
          <Form.Control
            style={{ fontSize: "12px" }}
            placeholder={t("Searchbynameorphonenumber")}
            value={nameOrPhoneFilter}
            onChange={(e) => setNameOrPhoneFilter(e.target.value)}
          />
        </Col>
        <Col md={5}></Col>
      </Row>
      <br />

      {isCardView ? (
        <CardView
          users={filteredUsers}
          handleDelete={handleDelete}
          formatDateInSelectedLanguage={formatDateInSelectedLanguage}
        />
      ) : (
        <>
          {currentHospital && (
            <span
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              Current Allowed Users: {currentHospital.allowed_users}
            </span>
          )}

          <TableView
            users={filteredUsers}
            handleDelete={handleDelete}
            formatDateInSelectedLanguage={formatDateInSelectedLanguage}
            editableUser={editableUser}
            setEditableUser={setEditableUser}
            updateUser={updateUser}
            userRoles={userRoles}
            roles={roles}
            currentHospital={getCurrentHospitalData()}
            getCurrentHospitalData={getCurrentHospitalData}
          />
        </>
      )}
    </Container>
  );
};

const CardView = ({ users, handleDelete, formatDateInSelectedLanguage }) => {
  return (
    <Row>
      {users.map((user) => (
        <Col key={user.id} md={4}>
          <Card style={{ width: "18rem", margin: "12px" }}>
            <Card.Body>
              <Card.Title>{user.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {user.username}
              </Card.Subtitle>
              <Card.Text>
                {t("Email")}: {user.email}
              </Card.Text>
              <Card.Text>
                {t("ContactNumber")}: {user.phoneNumber}
              </Card.Text>
              <Card.Text>
                {t("RegistrationDate")}:{" "}
                {formatDateInSelectedLanguage(new Date(user.createdAt))}
              </Card.Text>
              <Button
                variant="danger"
                style={{ fontSize: "12px" }}
                onClick={() => handleDelete(user.id)}
              >
                {t("Delete")}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

const TableView = ({
  users,
  handleDelete,
  formatDateInSelectedLanguage,
  editableUser,
  setEditableUser,
  updateUser,
  userRoles,
  roles,
  currentHospital,
  getCurrentHospitalData,
}) => {
  // Function to get role names for a user
  const getUserRoles = (userId) => {
    const userRoleEntries = userRoles.filter((ur) => ur.userId === userId);
    const roleNames = userRoleEntries.map((ur) => {
      const role = roles.find((r) => r.id === ur.roleId);
      return role ? role.role : "Unknown Role";
    });
    return roleNames.join(", ");
  };

  return (
    <>
      <Table
        style={{ verticalAlign: "middle", textAlign: "center" }}
        striped
        bordered
        responsive
      >
        <thead>
          <tr>
            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
              {t("Name")}
            </th>
            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
              {t("Username")}
            </th>
            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
              {t("Email")}
            </th>
            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
              {t("ContactNumber")}
            </th>
            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
              {t("RegistrationDate")}
            </th>
            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
              {t("Status")}
            </th>
            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
              {t("LoggedInStatus")}
            </th>
            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
              {t("Role")}
            </th>
            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
              {t("Action")}
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            if (user.username === "Hospital_Admin") {
              return null;
            }
            return (
              <tr key={user.id}>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {user.name}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {user.username}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {user.email}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {user.phoneNumber}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {formatDateInSelectedLanguage(new Date(user.createdAt))}
                </td>

                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {editableUser.id === user.id ? (
                    <>
                      <select
                        type="select"
                        className="form-control"
                        style={{ fontSize: "12px" }}
                        onChange={(e) =>
                          setEditableUser({
                            ...editableUser,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="">{t("SelectStatus")}</option>
                        <option value="active">{t("Active")}</option>
                        <option value="inactive">{t("Inactive")}</option>
                      </select>
                    </>
                  ) : user.status === "active" ? (
                    "Active"
                  ) : (
                    "Inactive"
                  )}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {user.loggedInStatus}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {getUserRoles(user.id)}
                </td>
                {true && (
                  <td
                    style={{
                      verticalAlign: "middle",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {editableUser.id == user.id ? (
                      <>
                        <Button
                          variant="secondary"
                          size="lg"
                          style={{ padding: "4px 5px", fontSize: "12px" }}
                          onClick={updateUser}
                        >
                          {t("Save")}
                        </Button>
                        <Button
                          variant="secondary"
                          size="lg"
                          style={{ padding: "4px 5px", fontSize: "12px" }}
                          onClick={() => setEditableUser({})}
                        >
                          {t("Close")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          title={t("Edit")}
                          variant="secondary"
                          size="lg"
                          style={{ padding: "4px 5px", fontSize: "12px" }}
                          onClick={() => setEditableUser(user)}
                        >
                          <FaPenAlt />
                        </Button>
                        <Button
                          title={t("Delete")}
                          variant="danger"
                          style={{ padding: "4px 5px", fontSize: "12px" }}
                          onClick={() => handleDelete(user.id)}
                        >
                          <FaTrashAlt />
                        </Button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
export default UserList;
