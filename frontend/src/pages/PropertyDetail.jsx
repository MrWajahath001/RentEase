import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/property/${id}`);
        const data = await res.json();
        if (data.success) setProperty(data.property);
        else setError(data.message || "Failed to load property");
      } catch (e) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container-fluid">
          <span
            className="navbar-brand fw-bold text-white me-3"
            onClick={() => { if (location.pathname !== "/home") navigate("/home"); }}
            style={{ cursor: location.pathname === "/home" ? "default" : "pointer" }}
          >
            🏡 RentEase
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav me-3">
              {navLinks.map((link) => (
                <li className="nav-item" key={link.name}>
                  <span
                    className={`nav-link ${location.pathname === link.path ? "active text-white" : "text-light"}`}
                    style={{ cursor: location.pathname === link.path ? "default" : "pointer" }}
                    onClick={() => { if (location.pathname !== link.path) navigate(link.path); }}
                  >
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <section className="container py-4">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : !property ? (
          <div className="text-center">Property not found</div>
        ) : (
          <div className="row g-4">
            <div className="col-md-7">
              <div id="propertyCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {(property.photos?.length ? property.photos : ["uploads/default.jpg"]).map((p, i) => (
                    <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                      <img
                        src={String(p).startsWith("http") ? String(p) : `${API_BASE}/${String(p).replaceAll("\\\\", "/")}`}
                        className="d-block w-100"
                        style={{ height: "420px", objectFit: "cover" }}
                        alt={`Photo ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#propertyCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#propertyCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
            <div className="col-md-5">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h3 className="fw-bold mb-2">{property.title}</h3>
                  <div className="text-primary fw-semibold mb-2">${property.price}/month</div>
                  <div className="text-muted mb-2">
                    {property.state}, {property.district} ({property.pin})
                  </div>
                  <div className="mb-3">
                    <span className="badge bg-secondary me-2">{property.propertyType}</span>
                    <span className="badge bg-secondary me-2">{property.beds} Beds</span>
                    <span className="badge bg-secondary">{property.baths} Baths</span>
                  </div>
                  <p className="mb-3">{property.description}</p>

                  <div className="mb-3">
                    {(property.amenities || []).map(a => (
                      <span key={a} className="badge bg-light text-dark border me-1">{a}</span>
                    ))}
                  </div>
                  <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i> Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="bg-dark text-white text-center py-4">
        &copy; {new Date().getFullYear()} RentEase. All rights reserved.
      </footer>
    </div>
  );
}


