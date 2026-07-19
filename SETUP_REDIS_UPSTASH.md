# Setting Up Redis with Upstash (5 minutes)

## ✅ PostgreSQL Already Configured!
Your Neon PostgreSQL database is ready to use.

## 🔴 Now Set Up Redis with Upstash (Free Tier)

Upstash offers a free serverless Redis instance perfect for development.

### Step 1: Create Upstash Account

1. Visit: **https://upstash.com**
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with:
   - GitHub (recommended - one click)
   - Google
   - Email

### Step 2: Create Redis Database

1. After logging in, click **"Create Database"**

2. Configure your database:
   - **Name:** `voiceagent-redis`
   - **Type:** Select **Regional** (free tier)
   - **Region:** Choose closest to you (e.g., `ap-southeast-1` for Asia)
   - **TLS:** Enable (recommended)
   - **Eviction:** Select **No Eviction**

3. Click **"Create"**

### Step 3: Get Connection Details

After creation, you'll see your database dashboard with:

1. **REST API** tab (default view)
2. Click on **"Redis"** tab or **"Connect"** button

You'll see connection details like:

```
Endpoint: apn1-sharp-bat-12345.upstash.io
Port: 6379
Password: AbCdEf1234567890XyZ
```

### Step 4: Update Your Backend .env File

Open `backend/.env` and update the Redis section:

```env
# Redis Settings - Upstash
REDIS_HOST=apn1-sharp-bat-12345.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=AbCdEf1234567890XyZ
```

**Replace with your actual values from Upstash dashboard!**

### Step 5: Test Connection

To verify your Redis connection works:

```bash
# Install redis-cli (if not already installed)
# Option 1: Windows Chocolatey
choco install redis

# Option 2: WSL
sudo apt install redis-tools

# Test connection
redis-cli -h apn1-sharp-bat-12345.upstash.io -p 6379 -a AbCdEf1234567890XyZ ping
```

Should return: `PONG`

---

## 🎯 Alternative: Local Redis via WSL2 (if you prefer)

If you prefer running Redis locally instead:

### Install WSL2 and Redis:

```powershell
# 1. Install WSL2 (PowerShell as Admin)
wsl --install

# Restart computer

# 2. Install Redis in WSL
wsl
sudo apt update
sudo apt install redis-server -y

# 3. Start Redis
sudo service redis-server start

# 4. Test
redis-cli ping
# Should return: PONG
```

### Update .env for Local Redis:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## 📋 Current Setup Status

- ✅ **PostgreSQL**: Configured (Neon)
- ⏳ **Redis**: Pending (choose Upstash or local)
- ⏳ **Twilio**: Pending (optional for testing)
- ⏳ **OpenAI**: Pending (optional for testing)

---

## 🚀 Next Steps After Redis Setup

Once Redis is configured, we'll:

1. ✅ Generate Prisma Client
2. ✅ Run database migrations
3. ✅ Seed the database
4. ✅ Start the backend server
5. ✅ Start the frontend
6. ✅ Test the application!

---

**Let me know when you've set up Redis on Upstash and I'll continue with the database setup!**

Or if you prefer local Redis via WSL2, let me know and I can guide you through that instead.
