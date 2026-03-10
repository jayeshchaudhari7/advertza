/**
 * API Service Layer
 * 
 * Centralised API client for all frontend ↔ backend communication.
 * 
 * ENDPOINTS OVERVIEW:
 * ─────────────────────────────────────────────────────────
 * AUTH
 *   POST /auth/login          → Admin login (returns JWT)
 *   GET  /auth/verify         → Verify current JWT token
 *
 * BLOG
 *   GET    /blog-posts        → List posts (public: published only, admin: all)
 *   GET    /blog-posts/:slug  → Single post by slug (public)
 *   POST   /blog-posts        → Create post (admin)
 *   PUT    /blog-posts/:id    → Update post (admin)
 *   DELETE /blog-posts/:id    → Delete post (admin)
 *
 * BOOKINGS  ← Home & Contact consultation form
 *   GET    /bookings           → List all bookings (admin)
 *   POST   /bookings           → Create booking (public)
 *   PUT    /bookings/:id/status → Update status (admin)
 *
 * INQUIRIES ← Service page "Get Free Audit" forms
 *   GET    /inquiries          → List all inquiries, filterable by ?source= (admin)
 *   POST   /inquiries          → Create inquiry with `source` field (public)
 *   DELETE /inquiries/:id      → Delete inquiry (admin)
 *
 * ANALYTICS
 *   GET /analytics/overview    → Dashboard counts (admin)
 * ─────────────────────────────────────────────────────────
 *
 * CONFIGURATION: Change the URL below to your deployed backend.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "https://advertza.onrender.com/api");

// ============ HELPERS ============

/** Retrieve the admin JWT stored after login */
const getToken = (): string | null => localStorage.getItem("admin_token");

/**
 * Generic fetch wrapper that:
 *  - Attaches the JWT Authorization header when available
 *  - Redirects to /admin/login on 401 responses
 *  - Parses JSON responses and throws on errors
 */
async function apiFetch<T>(endpoint: string, options: RequestInit & { skipAuthRedirect?: boolean } = {}): Promise<T> {
  const token = getToken();
  const { skipAuthRedirect, ...fetchOptions } = options;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
  });

  // Token expired or invalid — force re-login (skip for verify & public calls)
  if (res.status === 401 && !skipAuthRedirect) {
    // Only redirect if we actually had a token (i.e. admin session expired)
    // Don't redirect for public API calls that happen to get 401
    if (token) {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}

// ============ AUTH ============

export const authApi = {
  /** Admin login — returns JWT token + user object */
  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: AdminUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  /** Verify the current JWT is still valid */
  verify: () => apiFetch<{ user: AdminUser }>("/auth/verify", { skipAuthRedirect: true }),
};

// ============ BLOG POSTS ============

export const blogApi = {
  /** List posts — optionally filter by published status and category */
  getAll: (publishedOnly = false, category = "all") => {
    const params = new URLSearchParams();
    if (publishedOnly) params.set("published", "true");
    if (category !== "all") params.set("category", category);
    return apiFetch<{ posts: BlogPost[]; total: number }>(`/blog-posts?${params}`, { skipAuthRedirect: true });
  },

  /** Get a single post by its URL slug (public) */
  getBySlug: (slug: string) => apiFetch<BlogPost>(`/blog-posts/${slug}`, { skipAuthRedirect: true }),

  /** Create a new blog post (admin) */
  create: (post: Omit<BlogPost, "_id" | "createdAt" | "updatedAt">) =>
    apiFetch<BlogPost>("/blog-posts", {
      method: "POST",
      body: JSON.stringify(post),
    }),

  /** Update an existing blog post (admin) */
  update: (id: string, post: Partial<BlogPost>) =>
    apiFetch<BlogPost>(`/blog-posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(post),
    }),

  /** Delete a blog post (admin) */
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/blog-posts/${id}`, { method: "DELETE" }),
};

// ============ BOOKINGS ============
// Source: ConsultationForm on Homepage hero & Contact page

export const bookingsApi = {
  /** List all consultation bookings — optionally filter by status (admin) */
  getAll: (status = "all") => {
    const params = status !== "all" ? `?status=${status}` : "";
    return apiFetch<{ bookings: Booking[]; total: number }>(`/bookings${params}`);
  },

  /** Submit a consultation booking (public — from Home / Contact page) */
  create: (booking: { name: string; email: string; phone?: string; date: string; time: string; timezone?: string }) =>
    apiFetch<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    }),

  /** Update booking status: pending → confirmed / cancelled (admin) */
  updateStatus: (id: string, status: Booking["status"]) =>
    apiFetch<Booking>(`/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// ============ INQUIRIES ============
// Source: ServicePageTemplate "Get Free Audit" form on all /services/* pages
// The `source` field auto-tracks which service page the inquiry came from

export const inquiriesApi = {
  /** List all inquiries — optionally filter by source page (admin) */
  getAll: (source = "all") => {
    const params = source !== "all" ? `?source=${encodeURIComponent(source)}` : "";
    return apiFetch<{ inquiries: Inquiry[]; total: number }>(`/inquiries${params}`);
  },

  /** Submit an inquiry from a service page (public). `source` = page title e.g. "Google Ads Management" */
  create: (data: { name: string; email: string; phone?: string; budget?: string; source?: string }) =>
    apiFetch<{ message: string; data: Inquiry }>("/inquiries", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Delete an inquiry (admin) */
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/inquiries/${id}`, { method: "DELETE" }),
};

// ============ ANALYTICS ============

export const analyticsApi = {
  /** Fetch dashboard overview counts (admin) */
  getOverview: () => apiFetch<AnalyticsOverview>("/analytics/overview"),
};

// ============ TYPES ============

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  readTime: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

/** Consultation booking from Home / Contact page */
export interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  timezone: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

/** Lead inquiry from service pages — includes source tracking */
export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  budget?: string;
  source: string;    // e.g. "Google Ads Management", "Meta Ads Management"
  createdAt: string;
}

/** Dashboard overview stats returned by /analytics/overview */
export interface AnalyticsOverview {
  totalPosts: number;
  totalBookings: number;
  pendingBookings: number;
  totalInquiries: number;
}
