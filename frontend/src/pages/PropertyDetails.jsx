// src/pages/PropertyDetails.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Toast } from "bootstrap"; // ✅ Import Bootstrap Toast JS

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyBusy, setApplyBusy] = useState(false);
  const [applySent, setApplySent] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userApp, setUserApp] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toastRef = useRef(null); // ✅ Reference to the toast element

  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/home";
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/property/${id}`);
        const data = await res.json();
        if (data.success) setProperty(data.property);
        else setError("Property not found");
      } catch {
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  useEffect(() => {
    const fetchMyApp = async () => {
      if (!currentUser || !property?._id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/rent/my/${currentUser._id}`);
        const data = await res.json();
        if (data.success) {
          const found = (data.applications || []).find(a => String(a.propertyId?._id || a.propertyId) === String(property._id));
          setUserApp(found || null);
          setApplySent(Boolean(found));
        }
      } catch {
        // ignore
      }
    };
    fetchMyApp();
    const iv = setInterval(fetchMyApp, 10000);
    return () => clearInterval(iv);
  }, [currentUser, property]);

  const handleApply = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!property?._id || !property?.ownerId) return;
    if (applyBusy || applySent) return;
    try {
      setApplyBusy(true);
      const res = await fetch("http://localhost:5000/api/rent/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: currentUser._id,
          propertyId: property._id,
          ownerId: typeof property.ownerId === "string" ? property.ownerId : property.ownerId?._id,
          message: "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApplySent(true);
        setUserApp(data.newApp);
        const toastElement = toastRef.current;
        const toast = new Toast(toastElement);
        toast.show();
      } else {
        alert(data.message || "Failed to submit application");
      }
    } catch {
      alert("Server error submitting application");
    } finally {
      setApplyBusy(false);
    }
  };

  const revoke = async () => {
    if (!userApp) return;
    if (!window.confirm("Revoke this request?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/rent/${userApp._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: currentUser._id }),
      });
      const data = await res.json();
      if (data.success) {
        setUserApp(null);
        setApplySent(false);
      } else {
        alert(data.message || "Failed to revoke");
      }
    } catch {
      alert("Server error");
    }
  };

  if (loading) return <div className="text-center mt-5 text-muted">Loading property...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  const ownerIdStr = typeof property.ownerId === "string" ? property.ownerId : property.ownerId?._id;
  const isOwner = currentUser && ownerIdStr && String(ownerIdStr) === String(currentUser._id);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* ===== Navbar ===== */}
      <nav
        className="navbar navbar-light shadow-sm py-3"
        style={{
          background: "linear-gradient(90deg, #1E3C72 0%, #2A5298 100%)",
        }}
      >
        <div className="container position-relative">
          <span
            className="navbar-brand fw-bold text-white fs-4"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            🏡 RentEase
          </span>
          {currentUser && (
            <div className="ms-auto">
              <button className="btn btn-outline-light" onClick={() => setShowUserMenu(s => !s)}>
                {currentUser.firstName || "Account"}
              </button>
              {showUserMenu && (
                <div className="position-absolute end-0 mt-2 card shadow" style={{ minWidth: 220 }}>
                  <div className="list-group list-group-flush">
                    <button className="list-group-item list-group-item-action" onClick={() => { setShowUserMenu(false); navigate("/requested-houses"); }}>Requested Houses</button>
                    <button className="list-group-item list-group-item-action text-danger" onClick={doLogout}>Logout</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ===== Main Content ===== */}
      <main className="container my-5 flex-grow-1">
        <div
          className="p-4 rounded-4 shadow-lg"
          style={{
            background: "linear-gradient(145deg, #ffffff, #f5f8ff)",
            border: "1px solid #e3e9f5",
          }}
        >
          {/* Image & Info Section */}
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <div
                id="propertyCarousel"
                className="carousel slide rounded-4 overflow-hidden shadow"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {property.photos && property.photos.length > 0 ? (
                    property.photos.map((photo, i) => (
                      <div
                        className={`carousel-item ${i === 0 ? "active" : ""}`}
                        key={i}
                      >
                      <img
                        src={String(photo).startsWith("http") ? String(photo) : `http://localhost:5000/${String(photo).replaceAll("\\\\", "/")}`}
                          className="d-block w-100"
                          alt={property.title}
                          style={{
                            height: "450px",
                            objectFit: "cover",
                            borderRadius: "1rem",
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="carousel-item active">
                      <img
                        src="https://via.placeholder.com/800x400?text=No+Image"
                        className="d-block w-100"
                        alt="No Image"
                      />
                    </div>
                  )}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#propertyCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon"></span>
                </button>
                

                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#propertyCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon"></span>
                </button>
              </div>
            </div>

            <div className="col-lg-5">
              <h2 className="fw-bold text-primary">{property.title}</h2>
              <h4 className="fw-semibold text-dark mb-3">
                ₹{property.price.toLocaleString()}/month
              </h4>

              <p className="text-muted mb-2">
                <i className="bi bi-geo-alt-fill text-primary"></i>{" "}
                {property.district}, {property.state} - {property.pin}
              </p>
              {property.ownerId && (
                <p className="text-muted mb-2">
                  <i className="bi bi-telephone text-success"></i>{" "}
                  Contact: {typeof property.ownerId === "object" ? (property.ownerId.mobile || "N/A") : "N/A"}
                </p>
              )}
              <p className="text-secondary">{property.description}</p>

              <div className="d-flex gap-2 flex-wrap my-3">
                <span className="badge bg-primary-subtle text-dark border">
                  🏠 {property.propertyType}
                </span>
                <span className="badge bg-light text-dark border">
                  🛏️ {property.beds} Beds
                </span>
                <span className="badge bg-light text-dark border">
                  🚿 {property.baths} Baths
                </span>
                <span className="badge bg-light text-dark border">
                  📏 {property.area} sq.ft
                </span>
              </div>

              <p className="text-muted">
                <i className="bi bi-calendar-event"></i>{" "}
                Available from:{" "}
                <strong>
                  {new Date(property.availableFrom).toLocaleDateString()}
                </strong>
              </p>

              {!isOwner && (
                <div className="mt-4 d-flex gap-3 align-items-center">
                  {!applySent ? (
                    <button
                      className="btn btn-success px-4 rounded-pill shadow-sm"
                      onClick={handleApply}
                      disabled={!currentUser || applyBusy}
                      title={!currentUser ? "Login to apply" : undefined}
                    >
                      <i className="bi bi-check-circle px-7"></i> Pay a Visit
                    </button>
                  ) : (
                    <>
                      <span className="badge bg-info text-dark">{userApp?.status || "Pending"}{userApp?.status === "Scheduled" && userApp?.scheduledAt ? ` • ${new Date(userApp.scheduledAt).toLocaleString()}` : ""}</span>
                      {userApp?.status === "Pending" && (
                        <button className="btn btn-outline-danger px-4 rounded-pill shadow-sm" onClick={revoke}>Revoke Request</button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="mt-5">
              <h5 className="fw-bold text-dark mb-3">Amenities</h5>
              <div className="d-flex flex-wrap gap-3">
                {property.amenities.map((a, i) => (
                  <span
                    key={i}
                    className="badge bg-light text-dark border shadow-sm px-3 py-2"
                  >
                    <i className="bi bi-check2-circle text-success me-1"></i>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ===== Toast Notification ===== */}
      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1050 }}
      >
        <div
          ref={toastRef}
          className="toast align-items-center text-bg-success border-0 shadow"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              ✅ Application submitted successfully!
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer
        className="text-center py-4 text-white"
        style={{
          background: "linear-gradient(90deg, #1E3C72 0%, #2A5298 100%)",
        }}
      >
        <p className="mb-1">&copy; {new Date().getFullYear()} RentEase</p>
        <small className="text-white-50">
          Making rentals seamless and smart 💙
        </small>
      </footer>
    </div>
  );
}
