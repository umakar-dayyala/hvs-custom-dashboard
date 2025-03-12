import React from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
    return (
        <header className="header-banner">
            <div className="logo-container">
                <img src="/hitachi_blue_logo.png" alt="Logo" className="logo" /> {/* Replace with your logo path */}
                <h1 className="site-name">Sensor Monitor</h1>
            </div>
            <nav>
                <ul className="nav-links">
                    {/* <li><Link to="/slideshow">Home</Link></li>
                    <li><Link to="/LimitsIBAC">About</Link></li>
                    <li><Link to="/IndvSensor">Contact</Link></li>
                    <li><Link to="/sensorstatus">Sensor Status</Link></li> */}
                    <li><Link to="/individulSensor">Ibac Sensor </Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
