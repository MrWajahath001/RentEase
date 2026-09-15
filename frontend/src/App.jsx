import { Routes, Route } from "react-router-dom";
import RealEstateLanding from "./pages/RealEstateLanding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ListingProperty from "./pages/ListingProperty";
import ListedProperty from "./pages/ListedProperty";
import AboutUs from "./pages/AboutUs";       // ← import About Us
import ContactUs from "./pages/ContactUs";   // ← import Contact Us
import Search from "./pages/Search";
import PropertyDetails from "./pages/PropertyDetails";
import RequestedHouses from "./pages/RequestedHouses";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RealEstateLanding />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/search" element={<Search />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/listing-property" element={<ListingProperty />} />
      <Route path="/listed-property" element={<ListedProperty />} />
      <Route path="/requested-houses" element={<RequestedHouses />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
    </Routes>
  );
}
