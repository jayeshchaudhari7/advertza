/**
 * Seed Script — Creates the initial admin user
 * 
 * USAGE:
 *   cd backend
 *   node seed.js
 * 
 * This creates an admin with:
 *   Email: admin@advertza.com
 *   Password: admin123
 * 
 * IMPORTANT: Change these credentials in production!
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/advertza";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existing = await Admin.findOne({ email: "admin@advertza.com" });
    if (existing) {
      console.log("⚠️  Admin user already exists. Skipping.");
    } else {
      await Admin.create({
        email: "admin@advertza.com",
        password: "admin123",  // Will be hashed by the pre-save hook
        name: "Admin",
      });
      console.log("✅ Admin user created: admin@advertza.com / admin123");
    }

    await mongoose.disconnect();
    console.log("Done.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
