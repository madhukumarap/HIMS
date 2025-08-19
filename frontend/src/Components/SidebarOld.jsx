import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import SidebarData from "./SidebarDataOld";
import AuthService from "../services/auth.service";

import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";

const Nav = styled.div`
  background: #19498f;
  height: 50px;
  width: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  @media screen and (max-width: 768px) {
    height: 50px;
    width: 60px;
  }
`;

const NavIcon = styled(Link)`
  margin-left: 1rem;
  font-size: 2rem;
  height: 80px;
  width: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 18%;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50px;
  left: ${({ sidebar }) => (sidebar ? "0" : "-310px")};
  transition: left 0.3s ease-in-out;
  z-index: 10;
  overflow-y: auto;

  @media screen and (max-width: 768px) {
    left: ${({ sidebar }) => (sidebar ? "0" : "unset")};
    transform: ${({ sidebar }) =>
      sidebar ? "translateX(0)" : "translateX(-100%)"};
    width: 80%;
  }
`;

const SidebarWrap = styled.div`
  width: 100%;
  padding-top: 0px;
`;

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const currentUser = AuthService.getCurrentUser();
  const userRoleDoctor = currentUser?.roles.includes("ROLE_DOCTOR");
  const userRoleNurse = currentUser?.roles.includes("ROLE_NURSE");
  const userRolepharmacist = currentUser?.roles.includes("ROLE_PHARMACIST");
  const userRoleUser = currentUser?.roles.includes("ROLE_USER");
  const userRoleADMIN = currentUser?.roles.includes("ROLE_ADMIN");
  const userRolePatient = currentUser?.roles.includes("ROLE_PATIENT");
  const userRoleSUPERADMIN = currentUser?.roles.includes("ROLE_SUPERADMIN");
  const userRoleSampletech = currentUser?.roles.includes(
    "ROLE_COLLECTIONTECHNICIAN"
  );
  const userRolePATHOLOGISTADMIN = currentUser?.roles.includes(
    "ROLE_PATHOLOGISTADMIN"
  );
  const filteredSidebarData = SidebarData.filter((item) => {
    if (userRoleSUPERADMIN) {
      return (
        item.title === "Hospital Registration" ||
        item.title === "Hospital Admin Reg." ||
        item.title === "Hospital Admin Data"
      );
    } else if (userRoleADMIN) {
      return (
        item.title === "Administration" ||
        item.title === "Medication Data" ||
        item.title === "Registration" ||
        item.title === "OT Management" ||
        item.title === "Pharmacy Management" ||
        item.title === "View Package" ||
        item.title === "Diagnostics Management" ||
        item.title === "Book Appointment"
      );
    } else if (userRolePATHOLOGISTADMIN) {
      return (
        item.title === "Patient List(Pathology)" ||
        item.title === "Sample Collection" ||
        item.title === "Test Management" ||
        item.title === "Referral type"
      );
    } else if (userRoleDoctor) {
      return (
        item.title === "Consultation List" ||
        item.title === "Patient list(Pathology)" ||
        item.title === "OT Calender" ||
        item.title === "OT Booking Data" ||
        // item.title === 'OT Managements' ||
        item.title === "Drug Database"
      );
    } else if (userRolepharmacist) {
      return (
        // item.title === 'Patient Data' ||
        // item.title === 'Dispense Medicine' ||
        item.title === "View Expired Drugs Report" ||
        item.title === "Dispense Medicine" ||
        item.title === "Dispense Medicine Outside" ||
        item.title === "Medicine Dispensation Report" ||
        item.title === "View Drug Database"
      );
    } else if (userRolePatient) {
      return (
        item.title === "ViewPrescription" || item.title === "Patient Test's"
      );
    } else if (userRoleSampletech) {
      return item.title === "Sample Collection";
    } else if (userRoleUser) {
      return item.title === "User";
    } else if (userRoleNurse) {
      return (
        item.title === "Patients Data" || item.title === "View Drug Database"
      );
    } else if (item.title === "Doctor" && !userRoleDoctor) {
      return false;
    }
    return false;
  });

  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleSubMenu = (title) => {
    setActiveSubMenu((prevSubMenu) => (prevSubMenu === title ? null : title));
  };

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav>
          <NavIcon to="#">
            <FaIcons.FaBars
              style={{ fontSize: "20px" }}
              onClick={toggleSidebar}
            />
          </NavIcon>
        </Nav>
        <SidebarNav sidebar={sidebarOpen}>
          <SidebarWrap>
            <NavIcon to="#">
              <AiIcons.AiOutlineClose
                style={{ fontSize: "25px" }}
                onClick={toggleSidebar}
              />
            </NavIcon>
            {filteredSidebarData.map((item, index) => (
              <SubMenu
                key={index}
                item={item}
                isActive={activeSubMenu === item.title}
                toggleSubMenu={toggleSubMenu}
              />
            ))}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
