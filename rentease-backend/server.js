// ===== server.js =====
const dns = require("dns");
// Set reliable DNS servers for resolving MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const rentRoutes = require("./routes/rent");

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Serve Uploaded Images =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Routes =====
app.use("/api/auth", require("./routes/auth"));
app.use("/api/property", require("./routes/property")); // Property routes
app.use("/api/user", require("./routes/user"));
app.use("/api/rent", rentRoutes);


// ===== Serve Frontend in Production =====
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("✅ RentEase backend is running successfully!");
  });
}

// ===== MongoDB Connection =====
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

// ===== Start Server =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
