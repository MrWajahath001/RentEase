// routes/rent.js
const express = require("express");
const router = express.Router();
const RentalApplication = require("../models/RentalApplication");
const Notification = require("../models/Notification");

// 🧾 Tenant applies for rent
router.post("/apply", async (req, res) => {
  try {
    const { tenantId, propertyId, ownerId, message } = req.body;

    const existing = await RentalApplication.findOne({ tenantId, propertyId });
    if (existing)
      return res.json({ success: false, message: "You already applied for this property." });

    const newApp = await RentalApplication.create({
      tenantId,
      propertyId,
      ownerId,
      message,
    });

    // Notify owner
    await Notification.create({
      userId: ownerId,
      type: "Application",
      message: "New rental application received",
      data: { applicationId: newApp._id, propertyId, tenantId },
    });

    res.json({ success: true, message: "Application submitted successfully!", newApp });
  } catch (err) {
    console.error("Error creating application:", err);
    res.status(500).json({ success: false, message: "Server error creating application" });
  }
});

// 🧍 Get applications by tenant
router.get("/my/:tenantId", async (req, res) => {
  try {
    const applications = await RentalApplication.find({ tenantId: req.params.tenantId })
      .populate("propertyId", "title price district state")
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching applications" });
  }
});

// 🏠 Get applications for a property (for owner)
router.get("/property/:propertyId", async (req, res) => {
  try {
    const applications = await RentalApplication.find({ propertyId: req.params.propertyId })
      .populate("tenantId", "firstName email")
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching property applications" });
  }
});

// 🧑‍💼 Get applications for owner
router.get("/owner/:ownerId", async (req, res) => {
  try {
    const applications = await RentalApplication.find({ ownerId: req.params.ownerId })
      .populate("tenantId", "firstName email")
      .populate("propertyId", "title")
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching owner applications" });
  }
});

// ✅ Approve application
router.patch("/:id/approve", async (req, res) => {
  try {
    const { note } = req.body || {};
    const app = await RentalApplication.findByIdAndUpdate(
      req.params.id,
      { status: "Approved", decisionAt: new Date(), decisionNote: note },
      { new: true }
    );
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    await Notification.create({
      userId: app.tenantId,
      type: "Decision",
      message: "Your application was approved",
      data: { applicationId: app._id, propertyId: app.propertyId },
    });

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error approving application" });
  }
});

// ❌ Reject application
router.patch("/:id/reject", async (req, res) => {
  try {
    const { note } = req.body || {};
    const app = await RentalApplication.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected", decisionAt: new Date(), decisionNote: note },
      { new: true }
    );
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    await Notification.create({
      userId: app.tenantId,
      type: "Decision",
      message: "Your application was rejected",
      data: { applicationId: app._id, propertyId: app.propertyId },
    });

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error rejecting application" });
  }
});

// 🗓️ Schedule a visit time
router.patch("/:id/schedule", async (req, res) => {
  try {
    const { scheduledAt, note } = req.body;
    if (!scheduledAt) return res.status(400).json({ success: false, message: "scheduledAt is required" });
    const app = await RentalApplication.findByIdAndUpdate(
      req.params.id,
      { status: "Scheduled", scheduledAt: new Date(scheduledAt), decisionNote: note },
      { new: true }
    );
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    await Notification.create({
      userId: app.tenantId,
      type: "Schedule",
      message: "Your property visit has been scheduled",
      data: { applicationId: app._id, propertyId: app.propertyId, scheduledAt: app.scheduledAt },
    });

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error scheduling visit" });
  }
});

// 🔔 Get notifications for a user
router.get("/notifications/:userId", async (req, res) => {
  try {
    const items = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, notifications: items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching notifications" });
  }
});

// 🔕 Mark notification read
router.patch("/notifications/:notificationId/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.notificationId, { read: true }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Notification not found" });
    res.json({ success: true, notification: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating notification" });
  }
});

// 🔄 Revoke (delete) application by tenant
router.delete("/:id", async (req, res) => {
  try {
    const { tenantId } = req.body || {};
    const app = await RentalApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });
    if (tenantId && String(app.tenantId) !== String(tenantId)) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }
    await app.deleteOne();
    res.json({ success: true, message: "Application revoked" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error revoking application" });
  }
});

module.exports = router;
