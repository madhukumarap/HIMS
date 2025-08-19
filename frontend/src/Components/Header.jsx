import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Import CSS file

const Header = () => {
    return (
        <header className="header-container">
            <nav>
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/signup">Signup</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin">Admin Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/doctor">Doctor Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/pharmacist">Pharmacist Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/patient">Patient Dashboard</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
