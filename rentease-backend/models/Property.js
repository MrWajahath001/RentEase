// backend/models/Property.js
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  propertyType: { type: String, required: true },
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
  furnished: { type: String, required: true },
  // state: { type: String, required: true },
  // district: { type: String, required: true },
  pin: { type: String, required: true },
  area: { type: String, required: true },
  availableFrom: { type: Date, required: true },
  amenities: [String],
  photos: [String], // store file paths
  description: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Property", propertySchema);
