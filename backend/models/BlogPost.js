/**
 * BlogPost Model
 * 
 * Schema matches the frontend BlogPost interface.
 * Content is stored as a single string (newline-separated paragraphs).
 * Lines starting with "## " are rendered as headings on the frontend.
 */

const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, default: "" },
  content: { type: String, default: "" },
  category: { type: String, required: true },
  published: { type: Boolean, default: false },
  readTime: { type: String, default: "1 min read" },
  date: { type: String }, // Display date (e.g., "Mar 8, 2026")
}, { timestamps: true });

// Auto-generate display date if not provided
blogPostSchema.pre("save", function (next) {
  if (!this.date) {
    this.date = new Date().toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  }
  next();
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
