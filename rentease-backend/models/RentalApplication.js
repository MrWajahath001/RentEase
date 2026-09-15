// models/RentalApplication.js
const mongoose = require("mongoose");

const rentalApplicationSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  message: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Approved", "Rejected", "Scheduled"], default: "Pending" },
  scheduledAt: { type: Date },
  decisionAt: { type: Date },
  decisionNote: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RentalApplication", rentalApplicationSchema);
