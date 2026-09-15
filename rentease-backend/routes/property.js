const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const ImageKit = require("imagekit");
const Property = require("../models/Property");

// ===== ImageKit Config =====
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// ===== Multer Memory Storage (for parsing only) =====
const upload = multer({ storage: multer.memoryStorage() });

// ===== POST Property =====
router.post("/", upload.array("photos", 8), async (req, res) => {
  try {
    const photos = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const uploaded = await imagekit.upload({
          file: file.buffer,
          fileName: Date.now() + "-" + file.originalname,
          folder: "/rentease/properties",
        });
        photos.push(uploaded.url);
      }
    }
    const {
      title,
      price,
      propertyType,
      beds,
      baths,
      furnished,
      state,
      district,
      pin,
      area,
      availableFrom,
      amenities,
      description,
      ownerId, // sent from frontend (user._id)
    } = req.body;

    const property = await Property.create({
      title,
      price,
      propertyType,
      beds,
      baths,
      furnished,
      state,
      district,
      pin,
      area,
      availableFrom,
      amenities: JSON.parse(amenities || "[]"),
      description,
      photos,
      ownerId,
    });

    res.status(201).json({ success: true, message: "Property listed successfully", property });
  } catch (err) {
    console.error("❌ Error saving property:", err);
    res.status(500).json({ success: false, message: "Server error while listing property" });
  }
});

// ===== GET All Properties =====
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error fetching properties" });
  }
});

// ===== SEARCH Properties (must be BEFORE :id route) =====
router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    const filters = query
      ? {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { state: { $regex: query, $options: "i" } },
            { district: { $regex: query, $options: "i" } },
            { area: { $regex: query, $options: "i" } },
            { pin: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const properties = await Property.find(filters).sort({ createdAt: -1 });
    return res.json({ success: true, properties });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error fetching search results" });
  }
});

// ===== GET Single Property By ID =====
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("ownerId", "firstName lastName mobile email");
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.json({ success: true, property });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error fetching property" });
  }
});

// ===== GET Properties by User =====
router.get("/user/:userId", async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (error) {
    console.error("❌ Error fetching user properties:", error);
    res.status(500).json({ success: false, message: "Server error fetching user properties" });
  }
});

// ===== DELETE Property =====
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error deleting property" });
  }
});

 


module.exports = router;
