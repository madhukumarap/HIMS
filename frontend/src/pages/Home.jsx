import mediAiImage from "../Components/mediailogo-final.png";
import backgroundImg from "../Components/Background2.jpg";

import React, { useEffect } from "react";
import "./Home.css";
import { Helmet } from "react-helmet";

const Home = () => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.location.reload();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    height: "100vh",
    marginTop: "-50px",
  };

  return (
    <div className="home-container" style={backgroundStyle}>
      {/* <Helmet>
        <title>MediAI | Home</title>
      </Helmet> */}
      <br></br> <br></br>
      <h2 className="display-4">Welcome to MediAI</h2>
      <br></br>
      <img
        src={mediAiImage}
        alt="Logo"
        className="logo-image"
        style={{
          borderRadius: "0%",
          width: "200px",
          maxWidth: "500%",
          height: "auto",
        }}
      />
    </div>
  );
};

export default Home;
