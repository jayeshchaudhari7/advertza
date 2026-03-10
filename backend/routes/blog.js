/**
 * Blog Routes
 * 
 * GET    /api/blog-posts              → List posts (supports ?published=true for public, all for admin)
 * GET    /api/blog-posts/:slug        → Get single post by slug (public)
 * POST   /api/blog-posts              → Create post (admin only)
 * PUT    /api/blog-posts/:id          → Update post (admin only)
 * DELETE /api/blog-posts/:id          → Delete post (admin only)
 */

const express = require("express");
const BlogPost = require("../models/BlogPost");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// GET /api/blog-posts — List all posts
// Query params: ?published=true (for public pages), ?category=Google+Ads
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.published === "true") filter.published = true;
    if (req.query.category && req.query.category !== "all") filter.category = req.query.category;

    const posts = await BlogPost.find(filter).sort({ createdAt: -1 });
    res.json({ posts, total: posts.length });
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/blog-posts/:slug — Get single post by slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("Get post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/blog-posts — Create new post (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, published, readTime, date } = req.body;

    if (!title || !slug || !category) {
      return res.status(400).json({ message: "Title, slug, and category are required" });
    }

    // Check for duplicate slug
    const existing = await BlogPost.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "A post with this slug already exists" });
    }

    const post = await BlogPost.create({ title, slug, excerpt, content, category, published, readTime, date });
    res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/blog-posts/:id — Update post (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("Update post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/blog-posts/:id — Delete post (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
