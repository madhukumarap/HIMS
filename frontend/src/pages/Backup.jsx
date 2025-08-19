import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";
import Translation from "../translations/Backup.json";
import { MdRestore } from "react-icons/md";
import { MdDownload } from "react-icons/md";
import Spinner from "react-bootstrap/Spinner";
import UserList from "./UsersDataAll";
import AuthService from "../services/auth.service";
const getDayName = (dayValue) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayValue];
};
const Backup = () => {
  const [period, setPeriod] = useState(undefined);
  const [day, setDay] = useState("");
  const [time, setTime] = useState(undefined);
  const [showRestoredData, setShowRestoredData] = useState(false);
  const [restoredData, setRestoredData] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);
  const currentUser = AuthService.getCurrentUser();
  const { t } = useTranslation();
  const locales = { enIN, fr };
  const [backupInProgress, setBackupInProgress] = useState(false);

  const getBackupData = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/get-last-backup-Dump`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
          userDatabase: currentUser?.databaseName,
        },
      })
      .then((response) => {
        setLastBackupDump(response.data.BackupDataDump);
      })
      .catch((error) => {
        toast.error(
          error.response.data.message
            ? error.response.data.message
            : t("somethingWentWrong")
        );
        console.log("Error fetching last backup dump:", error);
      });
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
  }, []);
  const formatDateInSelectedLanguage = (date) => {
    const selectedLanguage = i18n.language || "en";
    const format = "PPPPp";
    const locale = locales[selectedLanguage];
    return formatDate(date, format, { locale });
  };
  const getBackup = () => {
    if (!period) {
      toast.error(t("pleaseSelectTimePeriod"));
      return;
    }
    if (period === "weekly" && !day) {
      toast.error(t("pleaseSelectDay"));
      return;
    }
    if (!time) {
      toast.error(t("pleaseSelectTime"));
      return;
    }

    const confirmation = window.confirm(
      t("areYouSureYouWantToSetNewBackupConfiguration")
    );

    if (!confirmation) {
      return 0;
    } else {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/add-backup-config`,
          { period, day, time },
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          toast.success(response.data.message);
          axios
            .get(`${import.meta.env.VITE_API_URL}/api/get-last-backup-config`, {
              headers: {
                Authorization: `${currentUser?.Token}`,
              },
            })
            .then((response) => {
              setLastBackupConfig(response.data.lastBackupConfig);
            });
        })
        .catch((error) => {
          toast.error(
            error.response.data.message
              ? error.response.data.message
              : "Something went wrong"
          );
          console.log("Error 19:", error);
        });
    }
  };

  const [lastBackupConfig, setLastBackupConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restoreStatus, setRestoreStatus] = useState(null);

  const restoreBackup = async (filename, path, id) => {
    const confirmation = window.confirm(t("areYouSureToRestoreThisBackup"));

    if (!confirmation) {
      return 0;
    } else {
      try {
        setIsRestoring(true);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/Restore-Dump`,
          { filename, path, id },
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        setRestoreStatus(response.data.message);
        toast.success(response.data.message);
        setIsRestoring(false);
        getBackupData();
      } catch (error) {
        console.error("Error restoring backup:", error);
        setRestoreStatus("Error restoring backup");
        setIsRestoring(false);
      }
    }
  };
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/get-last-backup-config`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setLastBackupConfig(response.data.lastBackupConfig);
      })
      .catch((error) => {
        toast.error(
          error.response.data.message
            ? t("pleaseChooseATimePeriodForTheBackupSchedule")
            : t("somethingWentWrong")
        );
        console.log("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUser?.Token]);

  const [lastBackupDump, setLastBackupDump] = useState([]);

  useEffect(() => {
    getBackupData();
  }, [currentUser?.Token, currentUser?.databaseName]);

  const backupNow = () => {
    const confirmation = window.confirm(
      t("areYouSureYouWantToSetNewBackupNow")
    );

    if (!confirmation) {
      return;
    }

    setBackupInProgress(true);

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/Backup-Now`,
        {},
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        toast.success(response.data.message);
        getBackupData();
      })
      .catch((error) => {
        toast.error(
          error.response.data.message
            ? error.response.data.message
            : t("somethingWentWrong")
        );
        console.log("Error during backup now:", error);
      })
      .finally(() => {
        setBackupInProgress(false);
      });
  };

  const downloadDump = (backup) => {
    const path = backup.path;
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/download-dump`,
        { path },
        {
          responseType: "blob",
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      )
      .then((response) => {
        console.log("response 229 :", response);
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(response.data);
        downloadLink.download = `${backup.filename}`;
        downloadLink.click();
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };
  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    // If the user is not logged in or does not have the admin role,
    // you can show a message or redirect to another page.
    return "Access Denied";
  }
  return (
    <>
      {isRestoring && (
        <div
          style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            position: "absolute",
            backgroundColor: "#0000008a",
            zIndex: "2",
            top: "0",
          }}
        >
          <h4 className="m-auto text-light d-flex align-items-center">
            {" "}
            <Spinner
              className="m-auto text-light mx-2"
              animation="border"
              role="status"
            />{" "}
            {t("restoringYourData")}
          </h4>
        </div>
      )}
      {backupInProgress && (
        <div
          style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            position: "absolute",
            backgroundColor: "#0000008a",
            zIndex: "2",
            top: "0",
          }}
        >
          <h4 className="m-auto text-light d-flex align-items-center">
            {" "}
            <Spinner
              className="m-auto text-light mx-2"
              animation="border"
              role="status"
            />{" "}
            <p>{t("backupInProgressMessage")}</p>
          </h4>
        </div>
      )}

      <div className="container">
        <header
          className="header"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {t("backupAndRestore")}
        </header>
        <br />
        <div className="d-flex">
          <div className="row m-auto" style={{ width: "100%" }}>
            <div className="col-md-3">
              <label htmlFor="" className="my-1">
                {t("selectTimePeriod")}
              </label>
              <ReactSelect
                required
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                placeholder={t("dailyWeekly")}
                options={[
                  { value: "daily", label: t("Daily") },
                  { value: "weekly", label: t("Weekly") },
                ]}
                onChange={(e) => setPeriod(e.value)}
              />
            </div>
            {period == "weekly" && (
              <div className="col-md-3">
                <label htmlFor="" className="my-1">
                  {t("selectDay")}
                </label>
                <ReactSelect
                  required
                  menuPortalTarget={document.body}
                  menuPosition={"fixed"}
                  placeholder={t("selectDay")}
                  options={[
                    { value: "0", label: t("sunday") },
                    { value: "1", label: t("monday") },
                    { value: "2", label: t("tuesday") },
                    { value: "3", label: t("wednesday") },
                    { value: "4", label: t("thursday") },
                    { value: "5", label: t("friday") },
                    { value: "6", label: t("saturday") },
                  ]}
                  onChange={(e) => setDay(e.value)}
                />
              </div>
            )}
            <div className="col-md-3">
              <label htmlFor="" className="my-1">
                {t("selectTimeIn24Hrs")}
              </label>
              <input
                required
                value={time}
                type="time"
                className="form-control"
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="col-md-3 d-flex">
              <Button
                style={{ fontSize: "12px", marginTop: "30px", height: "35px" }}
                onClick={getBackup}
                className="btn btn-primary mx-auto"
              >
                {t("save")}
              </Button>
              <Button
                style={{
                  fontSize: "12px",
                  marginTop: "30px",
                  height: "35px",
                  marginLeft: "10px",
                }}
                onClick={backupNow}
                className="btn btn-success mx-auto"
              >
                {t("backupNow")}
              </Button>
            </div>
          </div>
        </div>
        <br />
        {loading ? (
          <p>{t("loading")}</p>
        ) : (
          <div>
            <h6>{t("backupConfiguration")}</h6>
            {lastBackupConfig ? (
              <Table
                style={{ textAlign: "center", whiteSpace: "nowrap" }}
                striped
                responsive
                bordered
                hover
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("period")}
                    </th>
                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("dayOfWeek")}
                    </th>
                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {t("timeIn24Hrs")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {lastBackupConfig.period.charAt(0).toUpperCase() +
                        lastBackupConfig.period.slice(1).toLowerCase()}
                    </td>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {lastBackupConfig.period === "weekly"
                        ? getDayName(lastBackupConfig.day)
                        : "EveryDay"}
                    </td>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      {lastBackupConfig.time}
                    </td>
                  </tr>
                </tbody>
              </Table>
            ) : (
              <p>{t("pleaseChooseATimePeriodForTheBackupSchedule")}</p>
            )}
          </div>
        )}
        {loading ? (
          <p>{t("loading")}</p>
        ) : (
          <div>
            <h6>{t("lastCreatedBackup")}</h6>
            <Table
              responsive
              style={{ textAlign: "center", whiteSpace: "nowrap" }}
              striped
              bordered
              hover
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {t("backUpRestore")}
                  </th>
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {" "}
                    {t("dateTime")}
                  </th>
                  {/*               <th style={{ textAlign: "center" }}>Path</th> */}
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {t("user")}
                  </th>
                  {/*               <th style={{ textAlign: "center" }}>{t("restoreStatus")}</th> */}
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {t("actions")}
                  </th>
                  <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    {t("filename")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {lastBackupDump.length > 0 ? (
                  lastBackupDump.map((backup, index) => {
                    return (
                      <React.Fragment key={index}>
                        <tr>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t("backup")}
                          </td>

                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDateInSelectedLanguage(
                              new Date(backup.createdAt)
                            )}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {backup.user}
                          </td>

                          {/* <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {backup.status === "restored" ? (
                              <span>
                                {t("restoreOn") +
                                  formatDateInSelectedLanguage(
                                    new Date(backup.updatedAt)
                                  )}
                              </span>
                            ) : (
                              "NA"
                            )}
                          </td> */}
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <div>
                              <Button
                                variant="secondary"
                                style={{
                                  fontSize: "12px",
                                  marginTop: "0px",
                                  backgroundColor:
                                    backup.status === "restored"
                                      ? "#0d6dfdbf"
                                      : "#0d6efd",
                                }}
                                title={
                                  backup.status === "restored"
                                    ? t("restoreOn") +
                                      formatDateInSelectedLanguage(
                                        new Date(backup.updatedAt)
                                      )
                                    : t("restore")
                                }
                                onClick={
                                  backup.status === "restored"
                                    ? () => {
                                        setShowRestoredData(true);
                                        setRestoredData(backup.updatedAt);
                                      }
                                    : () =>
                                        restoreBackup(
                                          backup.filename,
                                          backup.path,
                                          backup.id
                                        )
                                }
                              >
                                <MdRestore size={21} />
                              </Button>
                              <Button
                                title={t("download")}
                                style={{ fontSize: "12px", marginTop: "0px" }}
                                onClick={() => downloadDump(backup)}
                              >
                                <MdDownload size={21} />
                              </Button>
                            </div>
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              title={backup.filename}
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              {backup.filename.substring(0, 10)}...
                            </span>
                          </td>
                        </tr>
                        {backup.status === "restored" && (
                          <tr>
                            <td
                              style={{
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {t("restore")}
                            </td>

                            <td
                              colSpan={1}
                              style={{
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <strong> {t("restoredAt")} </strong>{" "}
                              {backup.updatedAt !== "" &&
                                formatDateInSelectedLanguage(
                                  new Date(backup.updatedAt)
                                )}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {backup?.restoredBy}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            ></td>
                            <td
                              style={{
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span
                                title={backup.filename}
                                style={{
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                              >
                                {backup.filename.substring(0, 10)}...
                              </span>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td style={{ textAlign: "center" }} colSpan={6}>
                      {t("noBackupFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        <Modal
          style={{ fontSize: "14px" }}
          style={{ marginTop: "20px" }}
          centered
          show={showRestoredData}
          onHide={() => {
            setShowRestoredData(false);
            setRestoredData("");
          }}
        >
          <Modal.Body>
            {/* <Modal.Header>
                     <Button onClick={()=> {setShowRestoredData(false); setRestoredData("")}}>
                            Close
                        </Button>
                    </Modal.Header> */}
            <h6 style={{ textAlign: "center" }}>
              {t("restoredAt")}{" "}
              {restoredData != "" &&
                formatDateInSelectedLanguage(new Date(restoredData))}
            </h6>
          </Modal.Body>
        </Modal>
        {lastBackupDump && <UserList lastBackupDump={lastBackupDump} />}
      </div>
    </>
  );
};

export default Backup;
