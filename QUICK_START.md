# Quick Start Guide - Environment Setup

This guide will walk you through setting up PostgreSQL, Redis, and configuring your application.

## Step 1: Configure Environment Variables

### Backend Configuration

```bash
# Navigate to backend directory
cd backend

# Copy the example environment file
cp .env.example .env
```

Now open `backend/.env` in your text editor and configure the following:

```env
# Application Settings
NODE_ENV=development
PORT=3001
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/voiceagent?schema=public"

# JWT Secret - Generate a secure random string
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
JWT_EXPIRES_IN=7d

# Redis Settings
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Twilio Configuration (Sign up at https://www.twilio.com)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
HUMAN_TRANSFER_NUMBER=+1234567890

# OpenAI Configuration (Get key from https://platform.openai.com)
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4-turbo-preview

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=AI Voice Agent <noreply@voiceagent.com>
```

### Frontend Configuration

```bash
# Navigate to frontend directory
cd ../frontend

# Copy the example environment file
cp .env.local.example .env.local
```

Open `frontend/.env.local` and configure:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

## Step 2: Install and Set Up PostgreSQL

### Option A: Windows (Recommended)

1. **Download PostgreSQL:**
   - Go to https://www.postgresql.org/download/windows/
   - Download the installer (version 14 or higher)

2. **Install PostgreSQL:**
   - Run the installer
   - Set a password for the `postgres` user (remember this!)
   - Default port: 5432 (keep as is)
   - Install all components including pgAdmin

3. **Create Database:**
   - Open pgAdmin 4 (installed with PostgreSQL)
   - Connect to PostgreSQL (use password from step 2)
   - Right-click "Databases" → Create → Database
   - Name: `voiceagent`
   - Click Save

**OR using Command Line:**
```powershell
# Open PowerShell as Administrator
# Navigate to PostgreSQL bin directory
cd "C:\Program Files\PostgreSQL\14\bin"

# Connect to PostgreSQL
.\psql.exe -U postgres

# Enter your password, then run:
CREATE DATABASE voiceagent;

# Verify it was created:
\l

# Exit:
\q
```

### Option B: Using Docker (All Platforms)

```bash
# Run PostgreSQL in Docker
docker run --name voiceagent-postgres \
  -e POSTGRES_DB=voiceagent \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 \
  -d postgres:14

# Verify it's running
docker ps
```

### Verify PostgreSQL Connection

```bash
# Test connection using psql (from PostgreSQL bin directory)
psql -U postgres -d voiceagent -h localhost

# OR test from your backend directory
cd backend
npx prisma db pull
```

If successful, PostgreSQL is ready!

## Step 3: Install and Set Up Redis

### Option A: Windows (Using WSL2 - Recommended)

Redis doesn't officially support Windows, but you can use WSL2 or a Windows port:

**Method 1: Using WSL2 (Recommended)**

1. **Install WSL2:**
```powershell
# In PowerShell as Administrator
wsl --install
```

2. **Install Redis in WSL:**
```bash
# In WSL terminal
sudo apt update
sudo apt install redis-server

# Start Redis
sudo service redis-server start

# Verify it's running
redis-cli ping
# Should return: PONG
```

3. **Make Redis accessible from Windows:**
Redis will be accessible at `localhost:6379` from Windows

**Method 2: Windows Native Port (Alternative)**

1. Download Redis for Windows from:
   - https://github.com/microsoftarchive/redis/releases
   - Download `Redis-x64-3.0.504.msi`

2. Install and run:
```powershell
# After installation, Redis runs as a Windows service
# Verify it's running
redis-cli ping
```

### Option B: Using Docker (Easiest)

```bash
# Run Redis in Docker
docker run --name voiceagent-redis \
  -p 6379:6379 \
  -d redis:6-alpine

# Verify it's running
docker exec -it voiceagent-redis redis-cli ping
# Should return: PONG
```

### Option C: Cloud Redis (Production-Ready)

Use a managed Redis service:
- **Redis Labs** (Free tier): https://redis.com/try-free/
- **Upstash** (Serverless): https://upstash.com/
- **AWS ElastiCache**
- **Azure Cache for Redis**

Update your `.env` with the cloud Redis connection details.

### Verify Redis Connection

```bash
# Test Redis connection
redis-cli

# Once connected, run:
ping
# Should return: PONG

set test "Hello"
get test
# Should return: "Hello"

# Exit
exit
```

## Step 4: Install Node.js Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 5: Run Database Migrations

Now that PostgreSQL is set up, create the database tables:

```bash
# Navigate to backend directory
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev

# You'll be prompted to name the migration, enter: "init"
```

**What this does:**
- Creates all database tables based on `prisma/schema.prisma`
- Sets up relationships between tables
- Creates indexes for performance

**Expected Output:**
```
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "voiceagent"

PostgreSQL database voiceagent created at localhost:5432

✔ Generated Prisma Client
✔ The migration has been created successfully
✔ Database migration complete
```

### Verify Migrations

```bash
# View your database in a GUI
npx prisma studio

# This opens http://localhost:5555 with a database browser
```

## Step 6: Seed the Database

Add sample data to test the application:

```bash
# Still in backend directory
npm run seed

# OR directly:
npx prisma db seed
```

**What gets seeded:**
- ✅ Admin user: `admin@voiceagent.com` / `admin123`
- ✅ Agent user: `agent@voiceagent.com` / `agent123`
- ✅ 8 Knowledge Base entries (FAQs)
- ✅ 3 Sample customers
- ✅ System configuration

**Expected Output:**
```
🌱 Starting database seeding...
✅ Created admin user: admin@voiceagent.com
✅ Created agent user: agent@voiceagent.com
✅ Created 8 knowledge base entries
✅ Created 3 sample customers
✅ Created system configuration

🎉 Database seeding completed!

📧 Admin Login:
   Email: admin@voiceagent.com
   Password: admin123

📧 Agent Login:
   Email: agent@voiceagent.com
   Password: agent123
```

## Troubleshooting

### Issue: "Can't reach database server"

**Solution:**
```bash
# Check if PostgreSQL is running
# Windows:
Get-Service postgresql*

# Start if stopped:
Start-Service postgresql-x64-14

# Verify connection string in .env matches your setup
```

### Issue: "Redis connection refused"

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# If not running:
# WSL: sudo service redis-server start
# Docker: docker start voiceagent-redis
# Windows Service: Start-Service Redis
```

### Issue: "MODULE_NOT_FOUND" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Migration fails

**Solution:**
```bash
# Reset database and start fresh
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Apply all migrations
# 4. Run seed
```

### Issue: "Prisma Client not generated"

**Solution:**
```bash
# Regenerate Prisma Client
npx prisma generate
```

## Verification Checklist

Before starting the application, verify:

- [ ] PostgreSQL is running and database exists
- [ ] Redis is running (test with `redis-cli ping`)
- [ ] Backend `.env` is configured with correct credentials
- [ ] Frontend `.env.local` is configured
- [ ] Dependencies installed (`node_modules` folders exist)
- [ ] Migrations completed successfully
- [ ] Seed data added
- [ ] Can open Prisma Studio (`npx prisma studio`)

## Next Steps

Once everything is set up:

```bash
# Terminal 1 - Start Backend
cd backend
npm run start:dev

# Wait for: "🚀 Application is running on: http://localhost:3001/api"

# Terminal 2 - Start Frontend
cd frontend
npm run dev

# Wait for: "▲ Next.js ready on http://localhost:3000"
```

Open your browser to http://localhost:3000 and login with:
- Email: `admin@voiceagent.com`
- Password: `admin123`

## Additional Resources

- **Prisma Studio**: View/edit database at http://localhost:5555 (run: `npx prisma studio`)
- **Swagger API Docs**: http://localhost:3001/api/docs (when backend is running)
- **Redis Commander**: Install with `npm install -g redis-commander` then run `redis-commander`

## Need Help?

1. Check logs in terminal for specific error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL and Redis are running
4. Review the [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md) for detailed troubleshooting
