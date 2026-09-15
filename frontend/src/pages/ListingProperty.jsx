// src/pages/ListingProperty.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function ListingProperty() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else navigate("/login");
  }, []);

  const navLinks = [
    { name: "Home", path: "/home" },
    // { name: "Rental Property", path: "/rental-property" },
    { name: "Listing Property", path: "/listing-property" },
    { name: "Listed Properties", path: "/listed-property" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const states = ["Andhra Pradesh", "Telangana"];
  const districtsMap = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
    Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  };

  const propertyTypes = ["Apartment", "Villa", "Condo", "Studio"];
  const furnishedOptions = ["Unfurnished", "Semi-Furnished", "Fully-Furnished"];
  const amenitiesOptions = ["Pool", "Gym", "Parking", "Balcony", "Air Conditioning", "Pet-Friendly"];

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    propertyType: "",
    beds: "",
    baths: "",
    furnished: "",
    state: "",
    district: "",
    pin: "",
    area: "",
    availableFrom: "",
    amenities: [],
    photos: ["", "", "", ""], // 4 inputs minimum
    description: "",
  });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      amenities: checked ? [...prev.amenities, value] : prev.amenities.filter(a => a !== value)
    }));
  };

  const handlePhotoChange = (index, file) => {
    setFormData(prev => {
      const newPhotos = [...prev.photos];
      newPhotos[index] = file;
      return { ...prev, photos: newPhotos };
    });
  };

  const addPhotoInput = () => {
    if (formData.photos.length < 8)
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ""] }));
  };

  const removePhotoInput = (index) => {
    if (formData.photos.length > 4)
      setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to list a property.");
      navigate("/login");
      return;
    }

    const uploadedPhotos = formData.photos.filter(f => f);
    if (uploadedPhotos.length < 4) {
      alert("Please upload at least 4 images of your property.");
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === "amenities") data.append(key, JSON.stringify(formData.amenities));
        else if (key !== "photos") data.append(key, formData[key]);
      });

      // Automatically add ownerId from logged-in user
      data.append("ownerId", user._id);

      uploadedPhotos.forEach(photo => data.append("photos", photo));

      const res = await fetch("http://localhost:5000/api/property", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        alert("Property listed successfully!");
        navigate("/listed-property");
      } else {
        alert(result.message || "Error listing property");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')",
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center text-white py-4" style={{ minHeight: "100px", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <h2 className="display-6 fw-bold">List Your Property for Rent</h2>
        <p className="lead mb-0">Fill in the form below with property details and photos</p>
      </section>

      {/* Listing Form */}
      <section className="container py-5">
        <div className="p-5 rounded-4 shadow-lg" style={{ backgroundColor: "rgba(248, 249, 250, 0.95)" }}>
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Basic Info */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Property Title</label>
              <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Price ($/mo)</label>
              <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
            </div>

            {/* Property Type */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Property Type</label>
              <select className="form-select" name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                <option value="">Select Type</option>
                {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            {/* Beds & Baths */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">Bedrooms</label>
              <input type="number" className="form-control" name="beds" value={formData.beds} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Bathrooms</label>
              <input type="number" className="form-control" name="baths" value={formData.baths} onChange={handleChange} required />
            </div>

            {/* Furnished & Available From */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Furnished</label>
              <select className="form-select" name="furnished" value={formData.furnished} onChange={handleChange} required>
                <option value="">Select Furnishing</option>
                {furnishedOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Available From</label>
              <input type="date" className="form-control" name="availableFrom" value={formData.availableFrom} onChange={handleChange} required />
            </div>

            {/* Location */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">State</label>
              <select className="form-select" name="state" value={formData.state} onChange={(e) => { handleChange(e); setFormData(prev => ({ ...prev, district: "" })); }} required>
                <option value="">Select State</option>
                {states.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">District</label>
              <select className="form-select" name="district" value={formData.district} onChange={handleChange} required disabled={!formData.state}>
                <option value="">Select District</option>
                {formData.state && districtsMap[formData.state].map(dist => <option key={dist} value={dist}>{dist}</option>)}
              </select>
            </div>

            {/* Pin & Area */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Pin Code</label>
              <input type="text" className="form-control" name="pin" value={formData.pin} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Area / Street</label>
              <input type="text" className="form-control" name="area" value={formData.area} onChange={handleChange} required />
            </div>

            {/* Amenities */}
            <div className="col-12">
              <label className="form-label fw-semibold">Amenities</label>
              <div className="d-flex flex-wrap gap-2">
                {amenitiesOptions.map(a => (
                  <div className="form-check" key={a}>
                    <input className="form-check-input" type="checkbox" value={a} id={a} checked={formData.amenities.includes(a)} onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor={a}>{a}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div className="col-12">
              <label className="form-label fw-semibold">Property Photos (Min 4, Max 8)</label>
              {formData.photos.map((photo, index) => (
                <div key={index} className="mb-2 d-flex align-items-center gap-2">
                  <input type="file" className="form-control" onChange={e => handlePhotoChange(index, e.target.files[0])} accept="image/*" required />
                  {formData.photos.length > 4 && <button type="button" className="btn btn-danger btn-sm" onClick={() => removePhotoInput(index)}>Remove</button>}
                </div>
              ))}
              {formData.photos.length < 8 && <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={addPhotoInput}>Add More Photo</button>}
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Add property highlights, features or special notes"></textarea>
            </div>

            <div className="col-12 text-center mt-4">
              <button type="submit" className="btn btn-primary px-5">List Property</button>
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-dark text-white text-center py-4">
        &copy; {new Date().getFullYear()} RentEase. All rights reserved.
      </footer>
    </div>
  );
}
