/**
 * Advertza Backend — Main Server Entry Point
 * 
 * ROUTES OVERVIEW:
 * ─────────────────────────────────────────────────────────
 *  /api/auth          → Admin authentication (login, verify JWT)
 *  /api/blog-posts    → Blog CRUD (public read, admin write)
 *  /api/bookings      → Consultation bookings from Home & Contact page
 *  /api/inquiries     → Lead inquiries from service pages (with source tracking)
 *  /api/analytics     → Dashboard stats (admin only)
 *  /api/health        → Health check endpoint
 * ─────────────────────────────────────────────────────────
 * 
 * SETUP:
 *  1. cd backend
 *  2. npm install
 *  3. cp .env.example .env  (fill in MONGODB_URI, JWT_SECRET, FRONTEND_URL)
 *  4. npm run dev
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Route imports
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const bookingRoutes = require("./routes/bookings");
const analyticsRoutes = require("./routes/analytics");
const inquiryRoutes = require("./routes/inquiryRoutes");

const app = express();

// ============ MIDDLEWARE ============

// CORS — allow requests from your deployed frontend domain
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    const allowed = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:8081",
    ];
    // Also allow any lovable.app preview URLs or localhost ports
    if (allowed.includes(origin) || origin.endsWith(".lovable.app") || origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());

// ============ ROUTES ============

app.use("/api/auth", authRoutes);           // Admin login & JWT verification
app.use("/api/blog-posts", blogRoutes);     // Blog CRUD
app.use("/api/bookings", bookingRoutes);    // Consultation bookings (Home/Contact form → Admin Bookings)
app.use("/api/analytics", analyticsRoutes); // Dashboard stats
app.use("/api/inquiries", inquiryRoutes);   // Service page inquiries (→ Admin Inquiries, with source tracking)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============ DATABASE & START ============

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/advertza";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
