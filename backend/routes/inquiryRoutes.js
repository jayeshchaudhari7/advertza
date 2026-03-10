/**
 * Inquiry Routes
 * 
 * Handles lead inquiries submitted from service page "Get Free Audit" forms.
 * Each inquiry includes a `source` field that tracks which service page it came from
 * (e.g. "Google Ads Management", "Meta Ads Management").
 * 
 * POST   /api/inquiries          → Create inquiry (public)
 * GET    /api/inquiries           → List all inquiries, filterable by ?source= (admin only)
 * DELETE /api/inquiries/:id       → Delete inquiry (admin only)
 */

const express = require("express");
const router = express.Router();
const Inquiry = require("../models/Inquiry");
const authMiddleware = require("../middleware/auth");

/* CREATE INQUIRY (public — from service/industry page forms) */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, budget, source } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const newInquiry = new Inquiry({ name, email, phone, budget, source });
    await newInquiry.save();

    res.status(201).json({ message: "Inquiry saved", data: newInquiry });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* GET ALL INQUIRIES (admin only) — optionally filter by ?source=Google+Ads+Management */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = {};
    if (req.query.source && req.query.source !== "all") {
      filter.source = req.query.source;
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    res.json({ inquiries, total: inquiries.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* DELETE INQUIRY (admin only) */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
