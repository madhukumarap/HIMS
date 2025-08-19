import { FaPencilAlt, FaTrashAlt, FaRegEye } from "react-icons/fa";
import AuthService from "../../services/auth.service";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const PathologyPackageView = ({ selectedPackageID, handleClose }) => {
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [selectedPackageDetails, setSelectedPackageDetails] = useState(null);
  const [PathologyPackages, setPathologyPackages] = useState([]);
  const [selectedPathologyPackageID, setSelectedPathologyPackageID] =
    useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [filterOption, setFilterOption] = useState("Pathology");
  const currentUser = AuthService.getCurrentUser();

  const handleViewDetailsClick = (selectedPackageID) => {
    console.log("TestpackageID:", selectedPackageID);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/GetAllPackagesWithTests`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPathologyPackages(response.data);
        const selectedPackage = response?.data?.find(
          (packages) => packages.id === parseInt(selectedPackageID)
        );

        if (selectedPackage) {
          setSelectedPathologyPackageID(selectedPackage.id);
          setSelectedPackageDetails(selectedPackage);
          setShowViewDetailsModal(true);
        } else {
          console.error(
            `Package with id ${selectedPackageID} not found in PathologyPackages.`
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCloseModal = () => {
    setSelectedPathologyPackageID(null);
    setSelectedPackageDetails(null);
    setSelectedTests([]);
    setShowViewDetailsModal(false);
  };

  useEffect(() => {
    if (selectedPackageID !== null) {
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/selectedTests/${selectedPackageID}`,
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        )
        .then((response) => {
          setSelectedTests(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedPackageID]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/GetAllPackagesWithTests`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPathologyPackages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (selectedPackageID) {
      handleViewDetailsClick(selectedPackageID);
    }
  }, [selectedPackageID]);
  window.addEventListener("storage", (event) => {
    if (event.key === "user" && !AuthService.getCurrentUser()) {
      AuthService.logout();
      window.location.reload();
    }
  });

  if (!currentUser) {
    return "Access Denied";
  }

  if (
    currentUser &&
    !currentUser.roles.includes("ROLE_ADMIN") &&
    !currentUser.roles.includes("ROLE_DOCTOR") &&
    !currentUser.roles.includes("ROLE_PATHOLOGISTADMIN")
  ) {
    return "Access Denied";
  }

  return (
    <div
      style={{
        width: "98%",
        height: "100%",
        margin: "0 auto",
        fontSize: "12px",
        opacity: "0",
      }}
    >
      <Modal
        centered
        style={{ fontSize: "20px" }}
        show={showViewDetailsModal}
        onHide={handleCloseModal}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "18px", textAlign: "center" }}>
            Package Name: {selectedPackageDetails?.packageName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <div className="card-header">Tests</div>
            <div className="card-body">
              {selectedTests?.length > 0 && (
                <div className="row">
                  <div className="col-md-5">
                    {" "}
                    {/* First Column */}
                    {selectedTests
                      .slice(0, Math.ceil(selectedTests.length / 2))
                      .sort((a, b) => a.category.localeCompare(b.category))
                      .map((test, index, tests) => (
                        <div key={test.id}>
                          {index === 0 ||
                          test.category !== tests[index - 1].category ? (
                            <h5>{test.category}</h5>
                          ) : null}
                          <ul>
                            <li>{test.TestName}</li>
                          </ul>
                          {index !== tests.length - 1 && <hr />}{" "}
                        </div>
                      ))}
                  </div>
                  <div className="col-md-1"></div>
                  <div className="col-md-6">
                    {" "}
                    {/* Second Column */}
                    {selectedTests
                      .slice(Math.ceil(selectedTests.length / 2))
                      .sort((a, b) => a.category.localeCompare(b.category))
                      .map((test, index, tests) => (
                        <div key={test.id}>
                          {index === 0 ||
                          test.category !== tests[index - 1].category ? (
                            <h5>{test.category}</h5>
                          ) : null}
                          <ul>
                            <li>{test.TestName}</li>
                          </ul>
                          {index !== tests.length - 1 && <hr />}{" "}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="text-center mt-4">
            <p style={{ marginBottom: "5px" }}>
              <span
                style={{
                  color: "#888",
                  textDecoration: "line-through",
                  marginRight: "10px",
                  fontSize: "16px",
                }}
              >
                MRP: {selectedPackageDetails?.MRPOfPackage}.00{" "}
                {selectedPackageDetails?.Currency}
              </span>
              <span style={{ color: "#f00", fontSize: "16px" }}>
                Discount: {selectedPackageDetails?.discount}%
              </span>
            </p>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#00f",
                marginBottom: "20px",
              }}
            >
              Final Price: {selectedPackageDetails?.finalPrice}{" "}
              {selectedPackageDetails?.Currency}
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowViewDetailsModal(false);
              setSelectedPackageDetails(null);
              handleClose();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PathologyPackageView;
