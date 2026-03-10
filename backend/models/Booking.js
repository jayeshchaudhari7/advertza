/**
 * Booking Model
 * 
 * Stores consultation booking requests submitted from the
 * ConsultationForm component (used on Homepage hero & Contact page).
 * 
 * Used by: ConsultationForm → bookingsApi.create()
 * Visible in: Admin > Bookings
 */

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, lowercase: true, trim: true },
  phone:    { type: String, default: "" },
  date:     { type: String, required: true },
  time:     { type: String, required: true },
  timezone: { type: String, default: "IST" },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
