# Unacademy Backend - Live Learning Platform API

A modern, scalable backend API for a live learning/presentation platform built with **Hono.js**, **Prisma ORM**, and **Supabase**. This API enables real-time presentation sessions with PDF upload and conversion capabilities.

## 🚀 Features

- **🔐 JWT Authentication** - Secure user registration and login
- **📊 Session Management** - Create, start, and end live learning sessions
- **📄 PDF Processing** - Upload PDFs and convert them to slide images
- **☁️ Cloud Storage** - Store slide images in Supabase cloud storage
- **🔄 Real-time Ready** - Built for real-time presentation features
- **📱 RESTful API** - Clean, well-documented REST endpoints

## 🏗️ Tech Stack

- **Framework**: [Hono.js](https://hono.dev/) - Fast, lightweight web framework
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: [Supabase Storage](https://supabase.com/storage)
- **PDF Processing**: pdftopic library
- **Validation**: Zod schema validation
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (local or cloud)
- Supabase account (for file storage)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd unacademy-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database_name"

# JWT Secret (Generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-make-it-long-and-random"

# Supabase Configuration (for file storage)
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_KEY="your-supabase-anon-public-key"

# Server Configuration (optional, defaults to 3000)
PORT=3000
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema (creates tables)
npm run db:push

# Optional: Open Prisma Studio to view data
npm run db:studio
```

### 5. Run the Application

**Development mode (with hot reload):**
```bash
npm run dev:local
```

**Production mode:**
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
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/signup` | User registration | ❌ |
| `POST` | `/api/v1/signin` | User login | ❌ |

### Sessions
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/session` | Create new session | ✅ |
| `GET` | `/api/v1/sessionsResponse` | Get all sessions | ✅ |
| `POST` | `/api/v1/session/:id/start` | Start session | ✅ |
| `POST` | `/api/v1/session/:id/end` | End session | ✅ |

### Slides
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/session/:id/slides/pdf` | Upload PDF and convert to slides | ✅ |
| `GET` | `/api/v1/session/:id/slides` | Get session slides | ✅ |

### Health Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/ping` | Server health check | ❌ |

## 🧪 Testing

See [TESTCASE.md](./TESTCASE.md) for comprehensive API testing examples.

### Quick Test
```bash
# Health check
curl http://localhost:3000/ping

# User signup
curl -X POST http://localhost:3000/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "username": "testuser"}'
```

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

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Cloudflare Workers development server |
| `npm run dev:local` | Start local Node.js development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

## 🌐 Deployment

### Local/VPS
```bash
npm run build && npm start
```

### Cloudflare Workers
```bash
npm run deploy
```

### Railway/Render
Set start command as `npm start`

### Vercel/Netlify
Configure build command as `npm run build`

## 🛠️ Environment Variables Setup

### 1. DATABASE_URL (PostgreSQL)
**Free Options:**
- [Railway.app](https://railway.app) - Create PostgreSQL service
- [Neon.tech](https://neon.tech) - Serverless PostgreSQL
- [Supabase](https://supabase.com) - Go to Settings → Database

### 2. JWT_SECRET
Generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Supabase Configuration
1. Go to [supabase.com](https://supabase.com)
2. Create free project
3. Go to Settings → API
4. Copy Project URL and anon public key
5. **Important**: Create storage bucket named `images`

## 🚨 Troubleshooting

### Common Issues

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:
1. Check the console logs for detailed error messages
2. Ensure all environment variables are properly set
3. Verify database and Supabase connections
4. Open an issue with detailed error information

---

**Built with ❤️ using Hono.js, Prisma, and Supabase**
