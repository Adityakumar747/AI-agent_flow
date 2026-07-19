# Database Setup Options

Docker is not currently installed on your system. Here are your options:

## Option 1: Install Docker Desktop (Recommended for Development)

### Install Docker Desktop for Windows

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Download Docker Desktop for Windows

2. **Install Docker Desktop:**
   - Run the installer
   - Follow the installation wizard
   - Restart your computer if prompted

3. **Start Docker Desktop:**
   - Open Docker Desktop from Start menu
   - Wait for it to start (whale icon in system tray should be steady)

4. **Verify Installation:**
   ```powershell
   docker --version
   docker ps
   ```

5. **Run Containers:**
   ```bash
   # PostgreSQL
   docker run --name voiceagent-postgres `
     -e POSTGRES_DB=voiceagent `
     -e POSTGRES_USER=postgres `
     -e POSTGRES_PASSWORD=voiceagent123 `
     -p 5432:5432 `
     -d postgres:14

   # Redis
   docker run --name voiceagent-redis `
     -p 6379:6379 `
     -d redis:6-alpine
   ```

6. **Verify Containers are Running:**
   ```bash
   docker ps
   ```

---

## Option 2: Install PostgreSQL and Redis Directly (No Docker)

### A. Install PostgreSQL

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Choose version 14 or higher

2. **Run the Installer:**
   - Execute the downloaded .exe file
   - Click "Next" through the setup wizard
   - **Important:** Remember the password you set for the postgres user!
   - Default port: 5432 (keep as is)
   - Install all components (including pgAdmin 4)

3. **Create Database:**
   
   **Option A - Using pgAdmin 4:**
   - Open pgAdmin 4 from Start menu
   - Connect to PostgreSQL (enter your password)
   - Right-click "Databases" → Create → Database
   - Name: `voiceagent`
   - Click "Save"

   **Option B - Using Command Line:**
   ```powershell
   # Navigate to PostgreSQL bin directory
   cd "C:\Program Files\PostgreSQL\14\bin"
   
   # Connect to PostgreSQL
   .\psql.exe -U postgres
   
   # Enter your password, then:
   CREATE DATABASE voiceagent;
   
   # Verify:
   \l
   
   # Exit:
   \q
   ```

4. **Update Backend .env:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/voiceagent?schema=public"
   ```
   Replace `YOUR_PASSWORD` with the password you set during installation.

### B. Install Redis

**Option 1: Using WSL2 (Recommended)**

1. **Install WSL2:**
   ```powershell
   # In PowerShell as Administrator
   wsl --install
   ```
   - Restart your computer when prompted

2. **Install Redis in WSL:**
   ```bash
   # Open WSL terminal (search "WSL" in Start menu)
   sudo apt update
   sudo apt install redis-server -y
   
   # Start Redis
   sudo service redis-server start
   
   # Verify
   redis-cli ping
   # Should return: PONG
   ```

3. **Make Redis Start Automatically:**
   ```bash
   # Add to ~/.bashrc
   echo "sudo service redis-server start" >> ~/.bashrc
   ```

**Option 2: Redis for Windows (Community Port)**

1. **Download:**
   - Visit: https://github.com/microsoftarchive/redis/releases
   - Download `Redis-x64-3.0.504.msi`

2. **Install:**
   - Run the MSI installer
   - Follow the installation wizard
   - Redis will run as a Windows service

3. **Verify:**
   ```powershell
   redis-cli ping
   # Should return: PONG
   ```

**Option 3: Use a Cloud Redis (Easiest - No Local Install)**

1. **Upstash (Free Tier):**
   - Visit: https://upstash.com
   - Sign up for free account
   - Create a Redis database
   - Copy connection details

2. **Update Backend .env:**
   ```env
   REDIS_HOST=your-upstash-host.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=your-upstash-password
   ```

---

## Option 3: Use Cloud Databases (No Local Installation)

### PostgreSQL Cloud Options:

**A. Supabase (Free Tier):**
- Visit: https://supabase.com
- Create free project
- Get connection string from Settings → Database
- Update DATABASE_URL in .env

**B. Neon (Free Tier):**
- Visit: https://neon.tech
- Create free project
- Copy connection string
- Update DATABASE_URL in .env

**C. Railway (Free Trial):**
- Visit: https://railway.app
- Create PostgreSQL database
- Copy connection string
- Update DATABASE_URL in .env

### Redis Cloud Options:

**A. Upstash (Free Tier):**
- Visit: https://upstash.com
- Create free Redis database
- Copy connection details
- Update REDIS_HOST, REDIS_PORT, REDIS_PASSWORD in .env

**B. Redis Labs (Free Tier):**
- Visit: https://redis.com/try-free/
- Create free database
- Copy connection details
- Update .env

---

## Recommended Setup for Your Situation

Since Docker is not installed, I recommend:

### **For Development (Fastest to Set Up):**
**PostgreSQL:** Install locally (15 minutes)
**Redis:** Use WSL2 (10 minutes) or cloud Upstash (5 minutes)

### **For Production or Shared Environment:**
**Both:** Use cloud services (Supabase + Upstash) - 10 minutes total

---

## Quick Decision Guide

**Choose Local Install if:**
- ✅ You want full control
- ✅ You'll work offline often
- ✅ You don't mind installation time

**Choose Docker if:**
- ✅ You want easy cleanup
- ✅ You might need multiple versions
- ✅ You're okay installing Docker Desktop

**Choose Cloud if:**
- ✅ You want fastest setup (5-10 minutes)
- ✅ You don't want to maintain local services
- ✅ You have reliable internet

---

## Next Steps

**Tell me which option you prefer:**

1. **"docker"** - I'll guide you through Docker Desktop installation
2. **"local"** - I'll guide you through PostgreSQL + Redis local installation
3. **"cloud"** - I'll guide you through cloud database setup (Supabase + Upstash)

Once databases are set up, we'll:
- Configure .env files
- Run Prisma migrations
- Seed the database
- Start the application!
