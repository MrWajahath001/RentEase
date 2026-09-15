import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ContactUs() {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/home" },
    // { name: "Rental Property", path: "/rental-property" },
    { name: "Listing Property", path: "/listing-property" },
    { name: "Listed Properties", path: "/listed-property" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container-fluid">
          <span
            className="navbar-brand fw-bold text-white me-3"
            onClick={() => navigate("/home")}
            style={{ cursor: "pointer" }}
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
                    onClick={() => location.pathname !== link.path && navigate(link.path)}
                  >
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section
        className="text-center text-white py-5"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <h2 className="display-6 fw-bold">Contact Customer Support</h2>
        <p className="lead mb-0">We’re here to help you with any issues or questions.</p>
      </section>

      {/* Support Section */}
      <section className="container py-5">
        <div
          className="p-5 rounded-4 shadow-lg"
          style={{ backgroundColor: "rgba(248, 249, 250, 0.95)" }}
        >
          <h4 className="fw-bold mb-4 text-center">Common Support Topics</h4>
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <i className="bi bi-house-door-fill fs-1 text-primary"></i>
              <h5 className="mt-3 fw-semibold">Property Listing Issues</h5>
              <p className="text-muted small">
                Trouble uploading photos or submitting property details? We can help fix it.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <i className="bi bi-person-check-fill fs-1 text-success"></i>
              <h5 className="mt-3 fw-semibold">Account & Login Help</h5>
              <p className="text-muted small">
                Forgot your password or facing login issues? Reach out to our support team.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <i className="bi bi-credit-card-2-front-fill fs-1 text-warning"></i>
              <h5 className="mt-3 fw-semibold">Payment or Subscription</h5>
              <p className="text-muted small">
                Need assistance with payments or plans? Contact our billing support.
              </p>
            </div>
          </div>

          <hr className="my-5" />

          <div className="text-center">
            <h5 className="fw-bold mb-3">📧 Contact Our Support Team</h5>
            <p className="text-muted">
              You can reach us anytime at <strong>support@rentease.com</strong>
            </p>
            <a
              href="mailto:support@rentease.com"
              className="btn btn-primary px-4 py-2 mt-2"
            >
              <i className="bi bi-envelope-fill me-2"></i> Contact via Email
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4">
        &copy; {new Date().getFullYear()} RentEase. All rights reserved.
      </footer>
    </div>
  );
}
