/**
 * Inquiry Model
 * 
 * Stores lead inquiries from the "Get Free Audit" forms on service pages.
 * The `source` field tracks which page the inquiry originated from
 * (e.g. "Google Ads Management", "Meta Ads Management").
 * 
 * Used by: ServicePageTemplate → inquiriesApi.create()
 * Visible in: Admin > Inquiries
 */

const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  email:  { type: String, required: true, lowercase: true, trim: true },
  phone:  { type: String, default: "" },
  budget: { type: String, default: "" },
  source: { type: String, default: "Unknown", trim: true }, // Tracks the originating service page
}, { timestamps: true });

module.exports = mongoose.model("Inquiry", inquirySchema);
