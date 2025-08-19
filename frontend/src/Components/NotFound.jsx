import React from "react";
import backgroundImg from "../Components/Background2.jpg";

const NotFound = (data) => {
  console.log("Path: " + window.location.pathname);
  console.log("href: " + window.location.href);

  console.log("Data: " + data);
  const containerStyle = {
    position: "fixed",
    top: -100,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    backgroundImage: `url(${backgroundImg})`,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  };

  return (
    <div style={containerStyle}>
      <h3>Coming Soon</h3>
    </div>
  );
};

export default NotFound;
