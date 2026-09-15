import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config";

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    // state: "",
    // district: "",
    // aadhaar: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const stateDistricts = {
    "Andhra Pradesh": [
      "Srikakulam", "Vizianagaram", "Visakhapatnam", "Guntur", "Krishna", "Chittoor", "Kadapa",
      "Nellore", "Kurnool", "Anantapur"
    ],
    "Telangana": [
      "Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam", "Mahbubnagar",
      "Adilabad", "Ranga Reddy", "Medak", "Nalgonda"
    ],
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData({ ...formData, state, district: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/auth/signup`, formData);
      setMessage(res.data.message);
      setLoading(false);
      setFormData({
        firstName: "",
        lastName: "",
        // state: "",
        // district: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setLoading(false);
      if (err.response) setError(err.response.data.message || "Signup failed");
      else setError("Server not reachable. Please try again later.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f8f9fa" }}>
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
      <div className="flex-grow-1 d-flex flex-wrap">
        {/* Left Image */}
        <div className="d-none d-md-block" style={{ flex: "1", position: "relative" }}>
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            alt="Rental Homes"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-start p-4"
               style={{ background: "rgba(0,0,0,0.4)", color: "white" }}>
            <h1 className="fw-bold display-5">Join RentEase</h1>
            <p className="lead">Create your account to find rental homes easily in Andhra Pradesh & Telangana.</p>
          </div>
        </div>

        {/* Form */}
        <div className="d-flex align-items-center justify-content-center" style={{ flex: "1", padding: "2rem" }}>
          <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "500px" }}>
            <h2 className="text-center fw-bold mb-4 text-dark">Sign Up</h2>

            {message && <div className="alert alert-success text-center">{message}</div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* First & Last Name */}
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label fw-semibold">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col">
                  <label className="form-label fw-semibold">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* State & District
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label fw-semibold">State</label>
                  <select
                    name="state"
                    className="form-select"
                    value={formData.state}
                    onChange={handleStateChange}
                    required
                  >
                    <option value="">Select State</option>
                    {Object.keys(stateDistricts).map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <label className="form-label fw-semibold">District</label>
                  <select
                    name="district"
                    className="form-select"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select District</option>
                    {(stateDistricts[formData.state] || []).map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div> */}

              {/* Aadhaar & Mobile */}
              <div className="row mb-3">
                {/* <div className="col">
                  <label className="form-label fw-semibold">Aadhaar Number</label>
                  <input
                    type="text"
                    name="aadhaar"
                    className="form-control"
                    placeholder="Aadhaar Number"
                    value={formData.aadhaar}
                    onChange={handleChange}
                  />
                </div> */}
                <div className="col">
                  <label className="form-label fw-semibold">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    maxLength={10}
                    className="form-control"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-dark w-100 mt-3" disabled={loading}>
                {loading ? <span><i className="bi bi-arrow-repeat me-2 spin"></i>Signing Up...</span> : "Sign Up"}
              </button>
            </form>

            <div className="text-center mt-3">
              <span className="text-muted">Already have an account? </span>
              <button onClick={() => navigate("/login")} className="btn btn-link p-0 text-primary fw-semibold">Login</button>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-white py-3 text-center">
        <p className="mb-0">&copy; 2025 RentEase. All rights reserved.</p>
      </footer>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
