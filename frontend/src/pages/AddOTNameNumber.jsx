import React, { useState } from "react";
import { toast } from "react-toastify";
import AuthService from "../services/auth.service";

function MyForm() {
  const [otName, setOTName] = useState("");
  const [otNumber, setOTNumber] = useState("");
  const currentUser = AuthService.getCurrentUser();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      OTName: otName,
      OTNumber: otNumber,
    };

    if (!formData.OTName) {
      toast.error("Enter OT Name  ", {
        style: { fontSize: "12px" },
      });
      return;
    }
    if (!formData.OTNumber) {
      toast.error("Enter OT Number  ", {
        style: { fontSize: "12px" },
      });
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/OTNameNumberCreate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${currentUser?.Token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        toast.success("Data saved successfully!");
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors
        toast.error("Error saving data.", {
          style: { fontSize: "12px" },
        });
        console.error("Error:", error);
      });
  };

  const style = {
    width: "100%" /* Adjust the width as per your requirement */,
    height: "100%" /* Adjust the height as per your requirement */,
    margin: "0 auto" /* Optional: Centers the page horizontally */,
    fontSize: "10px" /* Adjust the font size as per your requirement */,
  };

  const h1Style = {
    fontSize: "16px" /* Adjust the font size for <h1> */,
  };

  const h2Style = {
    fontSize: "14px" /* Adjust the font size for <h2> */,
  };

  const h3Style = {
    fontSize: "12px" /* Adjust the font size for <h3> */,
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

  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    // If the user is not logged in or does not have the admin role,
    // you can show a message or redirect to another page.
    return "Access Denied";
  }
  localStorage.setItem("reloadCount1", "0");
  const reloadCount = localStorage.getItem("reloadCount2");
  if (reloadCount !== "1") {
    window.location.reload();
    localStorage.setItem("reloadCount2", "1");
  }
  return (
    <div style={{ width: "20%" }} className="container">
      <div style={style} className="card">
        <div
          className="card-body d-flex align-items-center justify-content-center"
          style={{ height: "30vh" }}
        >
          <form style={style} onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="otName">OT Name</label>
              <input
                type="text"
                className="form-control"
                id="otName"
                value={otName}
                placeholder="Enter OT Name"
                onChange={(e) => setOTName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="otNumber">OT Number</label>
              <input
                type="text"
                className="form-control"
                id="otNumber"
                value={otNumber}
                placeholder="Enter OT Number"
                onChange={(e) => {
                  const input = e.target.value;
                  const regex = /^[0-9\b]+$/; // Regex to allow only numbers and backspace

                  if (input === "" || regex.test(input)) {
                    setOTNumber(input);
                  }
                }}
              />
            </div>

            <button type="submit" className="btn btn-secondary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyForm;
