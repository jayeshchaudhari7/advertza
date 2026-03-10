# Advertza Backend

Express + MongoDB backend for the Advertza admin dashboard.

## Quick Start

```bash
cd backend
npm install
cp .env.example .env     # Edit with your MongoDB URI & JWT secret
node seed.js              # Create initial admin user
npm run dev               # Start dev server on http://localhost:5000
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/advertza` |
| `JWT_SECRET` | Secret key for JWT signing | `my-super-secret-key` |
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## API Routes

### Auth
- `POST /api/auth/login` — Login (returns JWT)
- `GET /api/auth/verify` — Verify token

### Blog Posts
- `GET /api/blog-posts` — List all (add `?published=true` for public)
- `GET /api/blog-posts/:slug` — Get by slug (public)
- `POST /api/blog-posts` — Create (auth required)
- `PUT /api/blog-posts/:id` — Update (auth required)
- `DELETE /api/blog-posts/:id` — Delete (auth required)

### Bookings
- `GET /api/bookings` — List all (auth required)
- `POST /api/bookings` — Create (public, from website form)
- `PUT /api/bookings/:id/status` — Update status (auth required)

### Messages
- `GET /api/messages` — List all (auth required)
- `POST /api/messages` — Submit contact form (public)
- `PUT /api/messages/:id/read` — Mark read (auth required)
- `DELETE /api/messages/:id` — Delete (auth required)

### Analytics
- `GET /api/analytics/overview` — Dashboard stats (auth required)

## Deployment

Deploy to any Node.js host: Render, Railway, DigitalOcean, AWS, etc.

1. Set environment variables on your host
2. Run `node seed.js` once to create the admin user
3. Start with `npm start`
