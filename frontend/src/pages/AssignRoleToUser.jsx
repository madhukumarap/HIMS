import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import AuthService from "../services/auth.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Translation from "../translations/Uploadcsv_data.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const AddUserRoleForm = React.memo(() => {
  // All hooks must be called unconditionally at the top level
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useRef(AuthService.getCurrentUser());
  const { t } = useTranslation();

  // Initialize i18n once when component mounts
  useEffect(() => {
    const initializei18n = () => {
      const resources = {
        en: { translation: Translation["en"] },
        fr: { translation: Translation["fr"] },
      };
      const storedLanguage = localStorage.getItem("SelectedLanguage") || "en";

      i18n.use(initReactI18next).init({
        resources,
        lng: storedLanguage,
        fallbackLng: "en",
        interpolation: { escapeValue: false },
      });
    };

    initializei18n();
  }, []); // Empty dependency array ensures this runs only once

  // Memoized user options - moved before any conditional returns
  const userOptions = useMemo(
    () =>
      users.map((user) => (
        <option key={user.id} value={`${user.name} - ${user.username}`}>
          {user.name} - {user.username}
        </option>
      )),
    [users]
  );

  // Memoized role options - moved before any conditional returns
  const roleOptions = useMemo(
    () =>
      roles.map(
        (role) =>
          ![
            "user",
            "superAdmin",
            "collectionTechnician",
            "admins",
            "OTTechnician",
            "doctor",
          ].includes(role.role) && (
            <option key={role.id} value={role.role}>
              {role.role}
            </option>
          )
      ),
    [roles]
  );

  // Storage event listener
  const handleStorageChange = useCallback((event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [handleStorageChange]);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (
      !currentUser.current ||
      !currentUser.current.roles.includes("ROLE_ADMIN")
    )
      return;

    setLoading(true);
    try {
      const token = currentUser.current.Token;
      const [rolesResponse, usersResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/roles`, {
          headers: { Authorization: `${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: { Authorization: `${token}` },
        }),
      ]);

      setRoles(rolesResponse.data);
      setUsers(
        usersResponse.data.filter((user) => user.username !== "Hospital_Admin")
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(t("Errorfetchingdata"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData();
    return () => controller.abort();
  }, [fetchData]);

  // Submit handler
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!currentUser.current?.Token || !selectedUser) return;

      const token = currentUser.current.Token;
      const username = selectedUser.split("-")[1].trim();

      try {
        setLoading(true);
        await axios.put(
          `${import.meta.env.VITE_API_URL}/users/${username}`,
          { roleName: role },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success(t("Roleassignedsuccessfully"), {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });

        setSelectedUser("");
        setRole("");
      } catch (error) {
        error.response?.status === 404
          ? toast.error(t("UserNameNotFound"))
          : toast.error(t("Errorassigningrole"));
      } finally {
        setLoading(false);
      }
    },
    [selectedUser, role, t]
  );

  if (
    !currentUser.current ||
    !currentUser.current.roles.includes("ROLE_ADMIN")
  ) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-70">
      <Container style={{ maxWidth: "500px" }}>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title style={{ fontSize: "14px" }}>
                  Select User to Assign Role
                </Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="user" className="mb-3">
                    <Form.Label>
                      {t("User")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      size="sm"
                      required
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      disabled={loading}
                    >
                      <option value="">{t("SelectUser")}</option>
                      {userOptions}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="role" className="mb-3">
                    <Form.Label>
                      {t("Role")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      size="sm"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled={loading}
                    >
                      <option value="">{t("SelectRole")}</option>
                      {roleOptions}
                    </Form.Control>
                  </Form.Group>

                  <div className="text-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? t("Loading...") : t("AssignRole")}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
});

export default AddUserRoleForm;
