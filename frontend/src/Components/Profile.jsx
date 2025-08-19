import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import AuthService from "../services/auth.service";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const [showModal, setShowModal] = useState(true);
  const currentPath = window.location.pathname;
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setShowModal(true);
    }
  }, [currentUser]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(`/${extractedPart}/`);
  };

  if (!currentUser) {
    navigate("/login");
    // Handle case when currentUser is null (user is not logged in)
    return (
      <div className="col-md-12 d-flex justify-content-center">
        <h3 className="card-header">
          No user profile available. Please log in.
        </h3>
        <div className="card-body">
          <p className="card-text"></p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-12 d-flex justify-content-center">
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Name:</strong> {currentUser?.hospitalId}
          </p>
          <p>
            <strong>Name:</strong> {currentUser.name}
          </p>
          <p>
            <strong>Username:</strong> {currentUser.username}
          </p>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <p>
            <strong>Phone:</strong> {currentUser.phoneNumber}
          </p>
          <p>
            <strong>Roles:</strong>{" "}
            {currentUser.roles && currentUser.roles.join(", ")}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
