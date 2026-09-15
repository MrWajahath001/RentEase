import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

export default function RequestedHouses() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/home";
  };

  const fetchApps = async (uid) => {
    try {
      const res = await fetch(`${API_BASE}/api/rent/my/${uid}`);
      const data = await res.json();
      if (data.success) setApplications(data.applications || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/");
      return;
    }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    fetchApps(parsed._id);
    const iv = setInterval(() => fetchApps(parsed._id), 10000);
    return () => clearInterval(iv);
  }, [navigate]);

  const revoke = async (id) => {
    if (!window.confirm("Revoke this request?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/rent/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: user._id }),
      });
      const data = await res.json();
      if (data.success) setApplications(prev => prev.filter(a => a._id !== id));
      else alert(data.message || "Failed to revoke");
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "#f7f9fc" }}>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid position-relative">
          <span className="navbar-brand fw-bold" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
            🏡 RentEase
          </span>
          {user && (
            <div className="ms-auto">
              <button className="btn btn-outline-light" onClick={() => setShowUserMenu(s => !s)}>
                {user.firstName || "Account"}
              </button>
              {showUserMenu && (
                <div className="position-absolute end-0 mt-2 card shadow" style={{ minWidth: 220 }}>
                  <div className="list-group list-group-flush">
                    <button className="list-group-item list-group-item-action" onClick={() => { setShowUserMenu(false); navigate("/requested-houses"); }}>Requested Houses</button>
                    <button className="list-group-item list-group-item-action text-danger" onClick={() => { setShowUserMenu(false); logout(); }}>Logout</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className="container py-4 flex-grow-1">
        <h3 className="mb-3">Your Requests</h3>
        {loading ? (
          <div>Loading...</div>
        ) : applications.length === 0 ? (
          <div>No requests yet.</div>
        ) : (
          <div className="list-group">
            {applications.map(a => (
              <div key={a._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">{a.propertyId?.title || "Property"}</div>
                    <div className="small text-muted">
                      Status: {a.status}{a.status === "Scheduled" && a.scheduledAt ? ` • Visit: ${new Date(a.scheduledAt).toLocaleString()}` : ""}
                    </div>
                  </div>
                  <div>
                    {a.status === "Pending" ? (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => revoke(a._id)}>Revoke Request</button>
                    ) : (
                      <span className="badge bg-secondary">{a.status}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-dark text-white text-center py-3">&copy; {new Date().getFullYear()} RentEase</footer>
    </div>
  );
}


