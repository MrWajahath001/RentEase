import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Listing Property", path: "/listing-property" },
    { name: "Listed Properties", path: "/listed-property" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container-fluid">
        <span
          className="navbar-brand fw-bold text-white me-3"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          🏡 RentEase
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav me-3">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.name}>
                <span
                  className={`nav-link ${
                    isActive(link.path) ? "active text-white" : "text-light"
                  }`}
                  style={{
                    cursor: isActive(link.path) ? "default" : "pointer",
                  }}
                  onClick={() => !isActive(link.path) && navigate(link.path)}
                >
                  {link.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}