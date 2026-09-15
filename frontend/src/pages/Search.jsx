import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Search() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🔍 Search properties by title/state/district/area(street)/pin
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return; // prevent empty search
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/property/search?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data && data.success && Array.isArray(data.properties)) {
                setProperties(data.properties);
            } else if (Array.isArray(data)) {
                // backward compatibility if endpoint returns array
                setProperties(data);
            } else {
                setProperties([]);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="fw-bold text-center mb-4">Search Properties</h2>

            {/* Search Bar */}
            <form className="row justify-content-center mb-4" onSubmit={handleSearch}>
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, city, street, or pin..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>
            </form>

            {/* Results */}
            {loading ? (
                <p className="text-center">Loading properties...</p>
            ) : (
                <div className="row g-4">
                    {properties.length === 0 ? (
                        <p className="text-center text-muted">No properties found.</p>
                    ) : (
                        properties.map((p) => (
                            <div className="col-md-4" key={p._id}>
                                <div className="card shadow-sm h-100">
                                    <img
                                        src={
                                            p.photos && p.photos.length > 0
                                                ? `http://localhost:5000/${String(p.photos[0]).replaceAll("\\\\", "/")}`
                                                : "https://via.placeholder.com/400x250?text=No+Image"
                                        }
                                        className="card-img-top"
                                        alt={p.title}
                                        style={{ height: "250px", objectFit: "cover" }}
                                    />
                                    <div className="card-body text-center">
                                        <h5 className="card-title fw-bold">{p.title}</h5>
                                        <p className="card-text text-muted">
                                            ₹{p.price} /mo • {p.beds} Beds • {p.baths} Baths
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
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
