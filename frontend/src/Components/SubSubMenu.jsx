// SubSubMenu.js
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SubSubMenuLink = styled(Link)`
  display: flex;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 50px;
  background: #333;
  text-decoration: none;
  font-size: 12px;

  &:hover {
    background: #252831;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    padding: 10px 15px;
    font-size: 14px;
  }
  background: ${({ isActive }) => (isActive ? "#334" : "  #334")};
  font-size: ${({ isActive }) => (isActive ? "12px" : "10px")};
`;

const SubSubMenu = ({ item, isActive }) => {
  return (
    <li>
      <SubSubMenuLink to={item.path} isActive={isActive}>
        {item.title}
      </SubSubMenuLink>
    </li>
  );
};

export default SubSubMenu;
