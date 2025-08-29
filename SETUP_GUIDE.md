# Unacademy Backend Setup Guide

This is a **Hono.js-based presentation/learning platform backend** with the following features:
- User authentication (signup/signin)
- Live session management
- PDF upload and conversion to slides
- File storage using Supabase

## 🏗️ Architecture Overview

```
├── Authentication System (JWT-based)
├── Session Management (Create, Start, End sessions)
├── PDF Processing (Convert PDFs to slide images)
├── File Storage (Supabase for images)
└── Database (PostgreSQL with Prisma ORM)
```

## 📋 Required Environment Variables

Create a `.env` file in the root directory with these variables:

### 1. DATABASE_URL (PostgreSQL Database)
```env
DATABASE_URL="postgresql://username:password@host:port/database_name"
```

**Where to get it:**
- **Local PostgreSQL**: `postgresql://postgres:password@localhost:5432/unacademy_db`
- **Railway.app**: Free PostgreSQL hosting
  1. Go to [railway.app](https://railway.app)
  2. Create account and new project
  3. Add PostgreSQL service
  4. Copy the connection string from Variables tab
- **Neon.tech**: Serverless PostgreSQL
  1. Go to [neon.tech](https://neon.tech)
  2. Create free account and database
  3. Copy connection string from dashboard
- **Supabase**: 
  1. Go to [supabase.com](https://supabase.com)
  2. Create project
  3. Go to Settings > Database
  4. Copy connection string

### 2. JWT_SECRET (Authentication)
```env
JWT_SECRET="your-super-secret-jwt-key-make-it-long-and-random"
```

**How to generate:**
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Use online generator
# Visit: https://generate-secret.vercel.app/64
```

### 3. SUPABASE_URL & SUPABASE_KEY (File Storage)
```env
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_KEY="your-supabase-anon-public-key"
```

**Where to get it:**
1. Go to [supabase.com](https://supabase.com)
2. Create free account and new project
3. Go to Settings > API
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_KEY`
5. **Important**: Create a storage bucket named `images`:
   - Go to Storage in Supabase dashboard
   - Create new bucket named `images`
   - Make it public if you want direct image access

### 4. PORT (Optional)
```env
PORT=3000
```

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual values
```

### 3. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Push database schema (creates tables)
npm run db:push

# Optional: Open Prisma Studio to view data
npm run db:studio
```

### 4. Run the Application

**Development (with hot reload):**
```bash
npm run dev:local
```

**Production:**
```bash
npm run build
npm start
```

**Cloudflare Workers (if deploying to CF):**
```bash
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/signup` - User registration
- `POST /api/v1/signin` - User login

### Sessions
- `POST /api/v1/session` - Create new session (requires auth)
- `GET /api/v1/sessionsResponse` - Get all sessions (requires auth)
- `POST /api/v1/session/:id/start` - Start session (requires auth)
- `POST /api/v1/session/:id/end` - End session (requires auth)

### Slides
- `POST /api/v1/session/:id/slides/pdf` - Upload PDF and convert to slides (requires auth)
- `GET /api/v1/session/:id/slides` - Get session slides (requires auth)

### Health Check
- `GET /ping` - Server health check

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/ping
```

### 2. User Signup
```bash
curl -X POST http://localhost:3000/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

### 3. User Signin
```bash
curl -X POST http://localhost:3000/api/v1/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Create Session (with auth token)
```bash
curl -X POST http://localhost:3000/api/v1/session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Session"
  }'
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Verify `DATABASE_URL` is correct
   - Ensure database is running and accessible
   - Run `npm run db:push` to create tables

2. **Supabase Storage Error**
   - Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
   - Ensure `images` bucket exists in Supabase Storage
   - Check bucket permissions

3. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set and consistent
   - Token should be sent in Authorization header: `Bearer <token>`

4. **File Upload Issues**
   - Only PDF and JPG files are supported
   - Maximum file size is 50MB
   - Ensure proper Content-Type in multipart/form-data

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   └── mult.ts      # Multer file upload config
├── middleware/       # Middleware functions
│   ├── auth.ts      # JWT authentication middleware
│   └── utils/       # Utility functions
│       ├── inputParser.ts  # Zod validation schemas
│       └── jwt.ts   # JWT utility functions
├── routes/          # API route handlers
│   ├── auth.ts      # Authentication routes
│   ├── session.ts   # Session management routes
│   ├── slides.ts    # PDF/slides routes
│   └── index.ts     # Route aggregation
├── types/           # TypeScript declarations
│   └── pdftopic.d.ts # PDF processing types
├── supabase.ts      # Supabase client configuration
└── index.ts         # Main application entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start Cloudflare Workers development server
- `npm run dev:local` - Start local Node.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🌐 Deployment Options

1. **Local/VPS**: Use `npm run build && npm start`
2. **Cloudflare Workers**: Use `npm run deploy`
3. **Vercel/Netlify**: Configure build command as `npm run build`
4. **Railway/Render**: Set start command as `npm start`

---

**Need help?** Check the console logs for detailed error messages, and ensure all environment variables are properly set!
