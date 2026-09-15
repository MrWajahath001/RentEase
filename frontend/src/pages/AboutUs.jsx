import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AboutUs() {

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <NavBar />

      {/* Hero Section */}
      <section
        className="text-center text-white py-5"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <h1 className="display-5 fw-bold">About RentEase</h1>
        <p className="lead mb-0">
          Revolutionizing the way people find and list rental properties with
          ease, transparency, and trust.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="container py-5 bg-light rounded-4 my-5">
        <h2 className="fw-bold mb-4 text-center">How RentEase Works</h2>

        <div className="row g-4 text-dark">
          <div className="col-md-4 text-center">
            <i className="bi bi-house-door-fill fs-1 mb-3 text-primary"></i>
            <h5 className="fw-bold">List Your Property</h5>
            <p>
              Property owners can quickly create listings with photos,
              descriptions, and pricing. Our platform ensures listings are
              verified for authenticity and accuracy.
            </p>
          </div>

          <div className="col-md-4 text-center">
            <i className="bi bi-search fs-1 mb-3 text-primary"></i>
            <h5 className="fw-bold">Find Rentals Easily</h5>
            <p>
              Renters can browse verified listings, filter by location, price,
              or amenities, and find properties that match their needs quickly
              and efficiently.
            </p>
          </div>

          <div className="col-md-4 text-center">
            <i className="bi bi-chat-left-text-fill fs-1 mb-3 text-primary"></i>
            <h5 className="fw-bold">Secure Communication</h5>
            <p>
              Our built-in messaging system allows owners and renters to
              communicate securely, schedule visits, and finalize agreements
              with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container py-5">
        <h2 className="fw-bold mb-4 text-center text-dark">
          Why Choose RentEase
        </h2>
        <ul className="list-group list-group-flush fs-5">
          <li className="list-group-item">
            User-friendly platform: Navigate, search, and manage listings with
            ease.
          </li>
          <li className="list-group-item">
            Verified listings: Trustworthy properties and owners.
          </li>
          <li className="list-group-item">
            Secure communication: Keep your interactions safe and transparent.
          </li>
          <li className="list-group-item">
            24/7 customer support: We are always here to assist both renters and
            owners.
          </li>
          <li className="list-group-item">
            Streamlined management: Owners can track inquiries, schedule
            viewings, and manage listings efficiently.
          </li>
        </ul>
      </section>

      {/* Our Team Section */}
      <section className="container py-5 bg-light rounded-4 my-5">
        <h2 className="fw-bold mb-4 text-center">Meet Our Team</h2>
        <p className="text-center text-dark fs-5">
          RentEase is developed by a dedicated team of real estate professionals
          and developers passionate about making property rental seamless, safe,
          and accessible. Our goal is to build trust, save time, and create
          value for both renters and property owners.
        </p>
      </section>

      <Footer />
    </div>  
  );
}
