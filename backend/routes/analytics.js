/**
 * Analytics Routes
 * 
 * GET /api/analytics/overview → Dashboard stats (admin only)
 * 
 * Returns counts for: blog posts, bookings (total + pending), inquiries
 */

const express = require("express");
const BlogPost = require("../models/BlogPost");
const Booking = require("../models/Booking");
const Inquiry = require("../models/Inquiry");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// GET /api/analytics/overview — aggregate counts for admin dashboard
router.get("/overview", authMiddleware, async (req, res) => {
  try {
    const [totalPosts, totalBookings, pendingBookings, totalInquiries] = await Promise.all([
      BlogPost.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Inquiry.countDocuments(),
    ]);

    res.json({
      totalPosts,
      totalBookings,
      pendingBookings,
      totalInquiries,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
