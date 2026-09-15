// src/pages/ListedProperty.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ListedProperty() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAppsFor, setShowAppsFor] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [actionModal, setActionModal] = useState({ open: false, appId: null, action: null, note: "", scheduledAt: "" });
  const [showUserMenu, setShowUserMenu] = useState(false);

  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/home";
  };
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchUserProperties(parsed._id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserProperties = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/api/property/user/${userId}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.properties) && data.properties.length > 0) {
        setProperties(data.properties || []);
      } else {
        // Fallback: fetch all and filter client-side (covers legacy items without proper query)
        const resAll = await fetch(`${API_BASE}/api/property`);
        const dataAll = await resAll.json();
        if (dataAll.success && Array.isArray(dataAll.properties)) {
          const mine = dataAll.properties.filter((p) => {
            const owner = p.ownerId && (typeof p.ownerId === "string" ? p.ownerId : p.ownerId?._id);
            return owner === userId;
          });
          setProperties(mine);
        } else {
          alert(data.message || "Failed to fetch properties");
        }
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      alert("Server error fetching properties");
    } finally {
      setLoading(false);
    }
  };

  const openApplications = async (propertyId) => {
    setShowAppsFor(propertyId);
    setAppsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/rent/property/${propertyId}`);
      const data = await res.json();
      if (data.success) setApplications(data.applications || []);
      else alert(data.message || "Failed to load applications");
    } catch {
      alert("Server error loading applications");
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    let iv;
    if (showAppsFor) {
      const poll = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/rent/property/${showAppsFor}`);
          const data = await res.json();
          if (data.success) setApplications(data.applications || []);
        } catch {
          // ignore
        }
      };
      iv = setInterval(poll, 10000);
    }
    return () => iv && clearInterval(iv);
  }, [showAppsFor]);

  const actOnApplication = async (id, action) => {
    setActionModal({ open: true, appId: id, action, note: "", scheduledAt: "" });
  };

  const submitAction = async () => {
    const { appId, action, note, scheduledAt } = actionModal;
    let payload = { note };
    if (action === "schedule") {
      if (!scheduledAt) { alert("Please select date & time"); return; }
      payload.scheduledAt = scheduledAt;
    }
    try {
      const res = await fetch(`${API_BASE}/api/rent/${appId}/${action}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        setApplications(prev => prev.map(a => (a._id === appId ? data.application : a)));
        setActionModal({ open: false, appId: null, action: null, note: "", scheduledAt: "" });
      } else {
        alert(data.message || "Action failed");
      }
    } catch {
      alert("Server error performing action");
    }
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/property/${propertyId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await res.json();

      if (data.success) {
        setProperties(prev => prev.filter(p => p._id !== propertyId));
        alert("Property deleted successfully");
      } else {
        alert(data.message || "Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Server error deleting property");
    }
  };

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
        backgroundImage: "url('https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd29?auto=format&fit=crop&w=1600&q=80')",
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
            onClick={() => location.pathname !== "/home" && navigate("/home")}
            style={{ cursor: location.pathname === "/home" ? "default" : "pointer" }}
          >
            🏡 RentEase
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav me-3">
              {navLinks.map(link => (
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
            {user && (
              <div className="position-relative">
                <button className="btn btn-outline-light" onClick={() => setShowUserMenu(s => !s)}>
                  {user.firstName || "Account"}
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
        </div>
      </nav>

      {/* Header */}
      <section className="text-center text-white py-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
        <h2 className="display-6 fw-bold">Your Listed Properties</h2>
        <p className="lead mb-0">View and manage all properties you've listed for rent</p>
      </section>

      {/* Property Cards */}
      <section className="container py-5">
        {loading ? (
          <div className="text-center text-white">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div>Loading properties...</div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center text-white fs-4">
            You haven't listed any properties yet.
            <br />
            <button className="btn btn-primary mt-3" onClick={() => navigate("/listing-property")}>
              List a Property
            </button>
          </div>
        ) : (
          <div className="row">
            {properties.map(property => (
              <div className="col-md-4 mb-4" key={property._id}>
                <div className="card shadow-lg h-100 border-0">
                  <img
                    src={property.photos?.[0]
                      ? (String(property.photos[0]).startsWith("http")
                        ? String(property.photos[0])
                        : `${API_BASE}/${property.photos[0].replaceAll("\\", "/")}`)
                      : "https://via.placeholder.com/400x250?text=No+Image"}
                    className="card-img-top"
                    alt={property.title || "Property Image"}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{property.title}</h5>
                    <p className="card-text text-muted mb-1">{property.state}, {property.district} ({property.pin})</p>
                    <p className="fw-semibold text-primary">${property.price}/month</p>
                    <p className="card-text small text-secondary">
                      {property.description?.length > 80 ? property.description.slice(0, 80) + "..." : property.description}
                    </p>
                    <div className="mb-2">
                      {property.amenities?.map(a => <span key={a} className="badge bg-secondary me-1">{a}</span>)}
                    </div>
                  </div>
                  <div className="card-footer bg-light border-0 text-center">
                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => navigate(`/property/${property._id}`)}>
                      <i className="bi bi-eye"></i> View
                    </button>
                    <button className="btn btn-outline-success btn-sm me-2" onClick={() => openApplications(property._id)}>
                      <i className="bi bi-inbox"></i> Applications
                    </button>
                    {/* <button className="btn btn-outline-warning btn-sm me-2" onClick={() => navigate(`/edit-property/${property._id}`)}>
                      <i className="bi bi-pencil"></i> Edit
                    </button> */}
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(property._id)}>
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showAppsFor && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Applications</h5>
                <button type="button" className="btn-close" onClick={() => { setShowAppsFor(null); setApplications([]); }}></button>
              </div>
              <div className="modal-body">
                {appsLoading ? (
                  <div>Loading...</div>
                ) : applications.length === 0 ? (
                  <div>No applications yet.</div>
                ) : (
                  <div className="list-group">
                    {applications.map(a => (
                      <div className="list-group-item" key={a._id}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-semibold">{a.tenantId?.firstName || "Tenant"}</div>
                            <div className="small text-muted">Status: {a.status}{a.scheduledAt ? ` • Visit: ${new Date(a.scheduledAt).toLocaleString()}` : ""}</div>
                          </div>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-success" disabled={a.status === "Approved"} onClick={() => actOnApplication(a._id, "approve")}>Approve</button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => actOnApplication(a._id, "schedule")}>Schedule</button>
                            <button className="btn btn-sm btn-outline-danger" disabled={a.status === "Rejected"} onClick={() => actOnApplication(a._id, "reject")}>Decline</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                 <button className="btn btn-secondary" onClick={() => { setShowAppsFor(null); setApplications([]); }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {actionModal.open && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-capitalize">{actionModal.action}</h5>
                <button className="btn-close" onClick={() => setActionModal({ open: false, appId: null, action: null, note: "", scheduledAt: "" })}></button>
              </div>
              <div className="modal-body">
                {actionModal.open && (
                  <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title text-capitalize">
                            {actionModal.action === "approve"
                              ? "Confirm Approval"
                              : actionModal.action === "reject"
                                ? "Confirm Rejection"
                                : "Schedule Visit"}
                          </h5>
                          <button
                            className="btn-close"
                            onClick={() =>
                              setActionModal({
                                open: false,
                                appId: null,
                                action: null,
                                note: "",
                                scheduledAt: "",
                              })
                            }
                          ></button>
                        </div>

                        <div className="modal-body">
                          {actionModal.action === "approve" && (
                            <p>Are you sure you want to approve this application?</p>
                          )}

                          {actionModal.action === "reject" && (
                            <p>Are you sure you want to reject this application?</p>
                          )}

                          {actionModal.action === "schedule" && (
                            <div className="mb-3">
                              <label className="form-label">Visit Date & Time</label>
                              <input
                                type="datetime-local"
                                className="form-control"
                                value={actionModal.scheduledAt}
                                onChange={(e) =>
                                  setActionModal((s) => ({
                                    ...s,
                                    scheduledAt: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          )}
                        </div>

                        <div className="modal-footer">
                          <button
                            className="btn btn-secondary"
                            onClick={() =>
                              setActionModal({
                                open: false,
                                appId: null,
                                action: null,
                                note: "",
                                scheduledAt: "",
                              })
                            }
                          >
                            Cancel
                          </button>
                          <button className="btn btn-primary" onClick={submitAction}>
                            {actionModal.action === "approve"
                              ? "Confirm"
                              : actionModal.action === "reject"
                                ? "Yes, Reject"
                                : "Schedule"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* <div className="mb-3">
                  <label className="form-label">Note</label>
                  <textarea className="form-control" rows={3} value={actionModal.note} onChange={e => setActionModal(s => ({ ...s, note: e.target.value }))} />
                </div> */}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setActionModal({ open: false, appId: null, action: null, note: "", scheduledAt: "" })}>Cancel</button>
                <button className="btn btn-primary" onClick={submitAction}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4">
        &copy; {new Date().getFullYear()} RentEase. All rights reserved.
      </footer>
    </div>
  );
}
