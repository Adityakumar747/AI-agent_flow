# Setup Guide - AI Voice Calling Agent

This guide will walk you through setting up the AI Voice Calling Agent system on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **Redis** (v6 or higher)
- **npm** or **yarn** package manager

## Required Accounts & API Keys

You'll need accounts and API keys for the following services:

1. **Twilio** - For voice calling capabilities
   - Sign up at https://www.twilio.com
   - Get your Account SID and Auth Token
   - Purchase a phone number

2. **OpenAI** - For AI conversation and TTS/STT
   - Sign up at https://platform.openai.com
   - Generate an API key
   - Ensure you have access to GPT-4 and Whisper APIs

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-voice-calling-agent
```

### 2. Set Up the Database

Create a PostgreSQL database:

```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE voiceagent;

# Exit psql
\q
```

### 3. Set Up Redis

Ensure Redis is running:

```bash
# On Linux/Mac
redis-server

# On Windows (with Redis installed via WSL or Windows port)
redis-server.exe
```

### 4. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Configure your `.env` file:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://postgres:password@localhost:5432/voiceagent?schema=public"

JWT_SECRET=your-super-secret-jwt-key-change-this
REDIS_HOST=localhost
REDIS_PORT=6379

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview

BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

Run database migrations and seed:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
```

Start the backend server:

```bash
npm run start:dev
```

The backend should now be running at `http://localhost:3001`

### 5. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local
nano .env.local
```

Configure your `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

Start the frontend development server:

```bash
npm run dev
```

The frontend should now be running at `http://localhost:3000`

## Accessing the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You'll be redirected to the login page
3. Use the default credentials:

```
Email: admin@voiceagent.com
Password: admin123
```

## Twilio Webhook Configuration

For Twilio to communicate with your application, you need to configure webhooks:

### Using ngrok (Recommended for local development)

1. Install ngrok: https://ngrok.com/download

2. Start ngrok tunnel:
```bash
ngrok http 3001
```

3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

4. Update your backend `.env`:
```env
BACKEND_URL=https://abc123.ngrok.io
```

5. Configure Twilio webhooks:
   - Go to your Twilio Console
   - Select your phone number
   - Set Voice & Fax > A CALL COMES IN to:
     `https://abc123.ngrok.io/api/calls/webhook/inbound`

## Verifying the Installation

### Check Backend Health

```bash
curl http://localhost:3001/api
```

You should receive a response indicating the API is running.

### Check Database Connection

```bash
cd backend
npx prisma studio
```

This opens Prisma Studio where you can view your database records.

### Check Redis Connection

```bash
redis-cli ping
```

Should return `PONG`.

### Check WebSocket Connection

Open the browser console at `http://localhost:3000/dashboard` and look for:
```
✅ WebSocket connected
```

## Common Issues

### Port Already in Use

If ports 3000 or 3001 are in use:

```bash
# Find process using the port (Linux/Mac)
lsof -i :3001

# Kill the process
kill -9 <PID>

# On Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Database Connection Error

- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Redis Connection Error

- Verify Redis is running: `redis-cli ping`
- Check REDIS_HOST and REDIS_PORT in .env

### Twilio Webhook Errors

- Ensure ngrok is running
- Verify BACKEND_URL matches ngrok URL
- Check Twilio webhook configuration
- Review Twilio debugger: https://www.twilio.com/console/debugger

## Next Steps

- Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) to understand the API endpoints
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Explore the [ARCHITECTURE.md](./ARCHITECTURE.md) to understand system design

## Support

If you encounter issues:

1. Check the logs: `backend/logs/` and browser console
2. Review Twilio debugger for call-related issues
3. Ensure all environment variables are set correctly
4. Verify all services (PostgreSQL, Redis) are running
