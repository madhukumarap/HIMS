import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import SidebarData from "./SidebarData";
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
  height: 93vh;
  display: flex;

  flex-direction: column;
  position: fixed;
  background: #595959;
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
  const userDiagnosticsTech = currentUser?.roles.includes(
    "ROLE_DIAGNOSTICTECHNICIAN"
  );
  const userOTTechnician = currentUser?.roles.includes("ROLE_OTTECHNICIAN");
  const userReceptionist = currentUser?.roles.includes("ROLE_RECEPTIONIST");

  const filteredSidebarData = SidebarData.filter((item) => {
    if (userRoleSUPERADMIN) {
      return (
        item.title === "Hospitals" ||
        item.title === "HospitalRegistration" ||
        item.title === "HospitalAdminReg." ||
        // item.title === "Packages" ||
        item.title === "Hospital Admin Data"
      );
    } else if (userRoleADMIN) {
      return (
        item.title === "DoctorsList" ||
        item.title === "Hospital Earnings" ||
        item.title === "Doctors Managment" ||
        item.title === "HospitalConfiguration" ||
        item.title === "BackUpRestore" ||
        item.title === "OperationTheater" ||
        item.title === "Analytics" ||
        item.title === "Pharmacy" ||
        item.title === "Diagnostics" ||
        item.title === "Packages" ||
        item.title === "Pathology" ||
        item.title === "Pharmacy" ||
        item.title === "MySpaces" ||
        item.title === "Laboratory" ||
        item.title === "OutPatient" ||
        item.title === "InPatient"
      );
    } else if (userReceptionist) {
      return (
        item.title === "Diagnostics" ||
        item.title === "Packages" ||
        item.title === "OutPatient"
      );
    } else if (userDiagnosticsTech) {
      return item.title === "Diagnostics" || item.title === "Packages";
    } else if (userRolePATHOLOGISTADMIN) {
      return (
        item.title === "Pathology" ||
        item.title === "Packages" ||
        item.title === "Laboratory"
      );
    } else if (userRoleDoctor) {
      return (
        item.title === "Diagnostics" ||
        item.title === "OperationTheater" ||
        item.title === "Pathology" ||
        item.title === "Packages" ||
        item.title === "OutPatient"
      );
    } else if (userOTTechnician) {
      return (
        //item.title === "Diagnostics" ||
        item.title === "OperationTheater"
      );
    } else if (userRolepharmacist) {
      return item.title === "Pharmacy";
    } else if (userRolePatient) {
      return item.title === "MySpaces" || item.title === "Packages";
    } else if (userRoleSampletech) {
      return item.title === "SampleCollection";
    } else if (userRoleUser) {
      return item.title === "User";
    } else if (userRoleNurse) {
      return (
        item.title === "PatientList" || item.title === "View Drug Database"
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

  const sortedSidebarData = [...filteredSidebarData].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
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
                style={{ fontSize: "25px", marginBottom: "-10px" }}
                onClick={toggleSidebar}
              />
            </NavIcon>
            {sortedSidebarData.map((item, index) => (
              <SubMenu
                key={index}
                item={item}
                toggleSidebar={toggleSidebar}
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
