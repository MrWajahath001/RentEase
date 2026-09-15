import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ProfessionalLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      // Store token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to Home
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="d-flex flex-column vh-100" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span
            className="navbar-brand fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            🏡 RentEase
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex">
        {/* Left Image with Overlay */}
        <div
          className="d-none d-lg-flex flex-fill position-relative"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-start p-5"
            style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}
          >
            <h1 className="display-4 fw-bold">Welcome to RentEase</h1>
            <p className="lead">Find your dream rental home with ease, comfort, and style. Explore apartments, villas, and condos now.</p>
          </div>
        </div>

        {/* Right Login Box */}
        <div className="flex-fill d-flex align-items-center justify-content-center"
             style={{ background: 'linear-gradient(135deg, #ffffff, #e0e0e0)' }}>
          <div className="card shadow-lg p-4 p-md-5 w-75" style={{ borderRadius: '0', backgroundColor: '#f8f9fa' }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold text-dark">Login</h2>
              <p className="text-muted">Access your RentEase account</p>
              {error && <div className="alert alert-danger">{error}</div>}
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
              </div>
              <button type="submit" className="btn btn-dark w-100 mb-3">Login</button>
              <div className="text-center">
                <span className="text-muted">Don't have an account? </span>
                <button
                  type="button"
                  className="btn btn-link p-0 text-primary fw-semibold"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-3">
        <div className="container text-center">
          <p className="mb-0">&copy; 2025 RentEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
