/**
 * Booking Routes
 * 
 * Handles consultation bookings from the ConsultationForm
 * (used on Homepage hero section & Contact page).
 * 
 * GET  /api/bookings              → List all bookings (admin only)
 * POST /api/bookings              → Create booking (public — from website form)
 * PUT  /api/bookings/:id/status   → Update booking status (admin only)
 */

const express = require("express");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// GET /api/bookings — List all (admin only), optionally filter by ?status=pending
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== "all") filter.status = req.query.status;

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json({ bookings, total: bookings.length });
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/bookings — Create a new consultation booking (public, from website)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, date, time, timezone } = req.body;

    if (!name || !email || !date || !time) {
      return res.status(400).json({ message: "Name, email, date, and time are required" });
    }

    const booking = await Booking.create({ name, email, phone, date, time, timezone });
    res.status(201).json(booking);
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/bookings/:id/status — Update status: pending → confirmed / cancelled (admin only)
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    console.error("Update booking status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
