// src/pages/RealEstateLanding.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function RealEstateLanding() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // 🔍 Handle Search (redirects to /home with query)
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      // Pass query to /home search page
      navigate(`/home?query=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate("/home");
    }
  };

  // Sample rental houses data
  const houses = [
    {
      title: "Cozy Apartment",
      price: "$1,200 / mo",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Luxury Villa",
      price: "$3,500 / mo",
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Modern Condo",
      price: "$2,000 / mo",
      img: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const overlayStyle = {
    position: "absolute",
    top: "50%",
    left: "8%",
    transform: "translateY(-50%)",
    color: "white",
    padding: "20px",
    textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
    zIndex: 10,
    maxWidth: "600px",
  };

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Listing Property", path: "/listing-property" },
    { name: "Listed Properties", path: "/listed-property" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* ===== Navbar ===== */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container-fluid">
          <span
            className="navbar-brand fw-bold text-white"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
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
                    className="nav-link text-light"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(link.path)}
                  >
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>
            <div className="d-flex">
              <button
                className="btn btn-outline-light me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== Carousel ===== */}
      <div id="houseCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {[
            {
              img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
              title: "Find Your Dream Home",
              desc: "Explore the best rental properties in your city with RentEase.",
              btnText: "Get Started",
            },
            {
              img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80",
              title: "Luxury Villas & Apartments",
              desc: "Comfortable living spaces available for rent at affordable prices.",
              btnText: "Sign Up Now",
            },
            {
              img: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1920&q=80",
              title: "Modern Condos for Rent",
              desc: "Find stylish condos in prime locations across the city.",
              btnText: "Explore Now",
            },
          ].map((slide, i) => (
            <div
              key={i}
              className={`carousel-item position-relative ${i === 0 ? "active" : ""}`}
            >
              <img
                src={slide.img}
                className="d-block w-100"
                style={{ height: "550px", objectFit: "cover" }}
                alt={`Slide ${i + 1}`}
              />
              <div style={overlayStyle}>
                <h1 className="display-4 fw-bold">{slide.title}</h1>
                <p className="lead">{slide.desc}</p>
                <button
                  className="btn btn-primary btn-lg mt-3"
                  onClick={() => navigate("/signup")}
                >
                  {slide.btnText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#houseCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#houseCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* ===== Featured Houses ===== */}
      {/* <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Featured Rental Houses</h2>
          <div className="row g-4">
            {houses.map((house, i) => (
              <div className="col-md-4" key={i}>
                <div className="card shadow-sm h-100 border-0">
                  <img
                    src={house.img}
                    className="card-img-top"
                    alt={house.title}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">{house.title}</h5>
                    <p className="card-text text-muted">{house.price}</p>
                    <button className="btn btn-primary">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      
      {/* ===== Footer ===== */}
      <footer className="bg-dark text-white py-4 text-center">
        <div>
          <div className="mb-3">
            <a href="#" className="text-white fs-4 mx-2">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-white fs-4 mx-2">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="text-white fs-4 mx-2">
              <i className="bi bi-youtube"></i>
            </a>
          </div>
          <p className="mb-0">&copy; 2025 RentEase. All rights reserved.</p>
        </div>

      </footer>
    </div>
  );
}
