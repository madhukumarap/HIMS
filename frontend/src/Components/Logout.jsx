import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const parts = currentPath.split("/");
  const matchResult = currentPath.match(/mediai\/([^\/]+)/);
  let extractedPart;
  if (matchResult && matchResult[1]) {
    extractedPart = matchResult[1];
    console.log(extractedPart);
  }
  const logout = async () => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");

    try {
      // alert("Hello");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ token }),
        }
      );

      if (response.ok) {
        console.log("User logged out successfully");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }

    toast.info("Logout in progress... Please wait!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    });

    // Clear sessionStorage items
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("reloadCount2");
    sessionStorage.removeItem("reloadCount1");
    sessionStorage.removeItem("checksum");
    //clear localstorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("reloadCount2");
    localStorage.removeItem("reloadCount1");
    localStorage.removeItem("checksum");

    // const logoutURL =
    //     import.meta.env.MODE === 'production'
    //         ? 'https://silfratech.in/pharmacymanagement/login'
    //         : '/login';

    navigate(`/${extractedPart}/login`);
    // Reload the page after logout
    window.location.reload();
    toast.dismiss();
  };

  useEffect(() => {
    logout();
  }, []);
  if (!extractedPart) {
    return extractedPart;
  }
  return <div>Logout</div>;
};

export default Logout;
