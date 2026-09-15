// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);


  const fetchAllProperties = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/property`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.properties)) {
        const stored = localStorage.getItem("user");
        const uid = stored ? JSON.parse(stored)._id : null;
        const filtered = uid
          ? data.properties.filter(p => {
              const owner = typeof p.ownerId === "string" ? p.ownerId : p.ownerId?._id;
              return String(owner) !== String(uid);
            })
          : data.properties;
        setProperties(filtered);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProperties();
  }, []);

  // 🔍 Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      fetchAllProperties(); // show all again
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/property/search?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data && data.success && Array.isArray(data.properties)) {
        const stored = localStorage.getItem("user");
        const uid = stored ? JSON.parse(stored)._id : null;
        const filtered = uid
          ? data.properties.filter(p => {
              const owner = typeof p.ownerId === "string" ? p.ownerId : p.ownerId?._id;
              return String(owner) !== String(uid);
            })
          : data.properties;
        setProperties(filtered);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/home";
  };


  const navLinks = [
    { name: "Home", path: "/home" },
    // { name: "Rental Property", path: "/rental-property" },
    { name: "Listing Property", path: "/listing-property" },
    { name: "Listed Property", path: "/listed-property" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <div>
      <style>
        {`
          .nav-item .nav-link {
            position: relative;
            display: inline-block;
            padding-bottom: 4px;
          }
          .nav-item .nav-link::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 0%;
            height: 2px;
            background-color: white;
            transition: width 0.3s;
          }
          .nav-item .nav-link.active::after {
            width: 50%;
          }
          .nav-item .nav-link:hover::after {
            width: 50%;
          }
        `}
      </style>

      {/* ===== Navbar ===== */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container-fluid">
          <span
            className="navbar-brand fw-bold text-white me-3"
            onClick={() => {
              setQuery("");
              fetchAllProperties();
              if (location.pathname !== "/home") navigate("/home");
            }}
            style={{ cursor: "pointer" }}
          >
            🏡 RentEase
          </span>

          {/* 🔍 Inline Search Bar */}
          <form className="d-flex flex-grow-1 me-3" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search by name, city, street, or pin..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end position-relative" id="navbarNav">
            <ul className="navbar-nav me-3">
              {navLinks.map((link) => (
                <li className="nav-item" key={link.name}>
                  <span
                    className={`nav-link ${
                      location.pathname === link.path ? "active text-white" : "text-light"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(link.path)}
                  >
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>

            {/* 👤 User Buttons */}
            {user ? (
              <div className="ms-2">
                <button className="btn btn-primary" onClick={() => setShowUserMenu(s => !s)}>
                  {user.firstName || "Account"}
                </button>
                {showUserMenu && (
                  <div className="position-absolute end-0 mt-2 card shadow" style={{ minWidth: 220 }}>
                    <div className="list-group list-group-flush">
                      <button className="list-group-item list-group-item-action" onClick={() => { setShowUserMenu(false); navigate("/requested-houses"); }}>Requested Houses</button>
                      <button className="list-group-item list-group-item-action text-danger" onClick={logout}>Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className="btn btn-outline-light me-2"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button className="btn btn-primary" onClick={() => navigate("/signup")}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== Hero Carousel ===== */}
      <div id="heroCarousel" className="carousel slide mt-3" data-bs-ride="carousel">
        <div className="carousel-inner">
          {properties.slice(0, 3).map((p, i) => (
            <div key={p._id} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <img
                src={
                  p.photos && p.photos.length > 0
                    ? (String(p.photos[0]).startsWith("http")
                        ? String(p.photos[0])
                        : `${API_BASE}/${String(p.photos[0]).replaceAll("\\\\", "/")}`)
                    : "https://via.placeholder.com/1200x500?text=No+Image"
                }
                className="d-block w-100"
                style={{ height: "500px", objectFit: "cover" }}
                alt={p.title}
              />
              <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
                <h5 className="fw-bold">{p.title}</h5>
                <p>
                  ₹{p.price}/mo • {p.beds} Beds • {p.baths} Baths • {p.district}, {p.state}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/property/${p._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* ===== Listed Properties ===== */}
      <section className="container py-5">
        <h2 className="text-center mb-4 fw-bold">
          {query ? "Search Results" : "Listed Properties"}
        </h2>

        {loading ? (
          <p className="text-center">Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-muted">No properties found.</p>
        ) : (
          <div className="row g-4">
            {properties.map((p) => (
              <div className="col-md-4" key={p._id}>
                <div className="card shadow-sm h-100">
                  <img
                    src={
                      p.photos && p.photos.length > 0
                        ? (String(p.photos[0]).startsWith("http")
                            ? String(p.photos[0])
                            : `${API_BASE}/${String(p.photos[0]).replaceAll("\\\\", "/")}`)
                        : "https://via.placeholder.com/400x250?text=No+Image"
                    }
                    className="card-img-top"
                    alt={p.title}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">{p.title}</h5>
                    <p className="card-text text-muted">
                      ₹{p.price}/mo • {p.beds} Beds • {p.baths} Baths
                    </p>
                    <p className="text-muted">
                      {p.district}, {p.state}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/property/${p._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-dark text-white py-4 text-center">
        &copy; {new Date().getFullYear()} RentEase. All rights reserved.
      </footer>
    </div>
  );
}
