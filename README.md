# VoiceForge 🤖📞

An intelligent, AI-powered voice calling system built with NestJS, Next.js, and OpenAI. Automate outbound calling campaigns, handle inbound calls, schedule appointments, and provide real-time analytics.

link -https://ai-agent-flow-lake.vercel.app/

## ✨ Features

- **🎙️ AI-Powered Conversations** - Natural voice interactions using OpenAI GPT-4 and Whisper
- **📞 Automated Outbound Campaigns** - Schedule and manage calling campaigns at scale
- **📥 Inbound Call Handling** - Smart IVR with AI-driven responses
- **📅 Appointment Scheduling** - Automated booking with SMS confirmations
- **📊 Real-Time Analytics** - Comprehensive dashboard with call metrics and insights
- **🔄 Live Updates** - WebSocket-powered real-time call status and notifications
- **💬 Sentiment Analysis** - Automatic conversation sentiment detection
- **📚 Knowledge Base** - Customizable FAQ system for AI responses
- **🔐 Role-Based Access** - Admin, Agent, and Viewer roles
- **📱 SMS Integration** - Automated confirmations and reminders via Twilio

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Next.js       │◄────►│   NestJS API     │◄────►│ PostgreSQL  │
│   Frontend      │ HTTP │   Backend        │      │  Database   │
│                 │◄────►│                  │      └─────────────┘
│                 │  WS  │  ┌────────────┐  │
└─────────────────┘      │  │ Bull Queue │  │      ┌─────────────┐
                         │  │   (Redis)  │◄─┼─────►│   Redis     │
                         │  └────────────┘  │      └─────────────┘
                         │                  │
                         │  ┌────────────┐  │      ┌─────────────┐
                         │  │  Twilio    │◄─┼─────►│   Twilio    │
                         │  │  Service   │  │      │     API     │
                         │  └────────────┘  │      └─────────────┘
                         │                  │
                         │  ┌────────────┐  │      ┌─────────────┐
                         │  │  OpenAI    │◄─┼─────►│   OpenAI    │
                         │  │  Service   │  │      │     API     │
                         │  └────────────┘  │      └─────────────┘
                         └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Twilio Account
- OpenAI API Key

### Installation

```bash
# Clone repository
git clone <repository-url>
cd ai-voice-calling-agent

# Install backend dependencies
cd backend
npm install
cp .env.example .env
# Configure .env with your credentials

# Setup database
npx prisma migrate dev
npx prisma db seed

# Start backend
npm run start:dev

# In a new terminal, install frontend dependencies
cd ../frontend
npm install
cp .env.local.example .env.local
# Configure .env.local

# Start frontend
npm run dev
```

### Default Credentials

```
Email: admin@voiceagent.com
Password: admin123
```

## 📖 Documentation

- **[Setup Guide](./docs/SETUP_GUIDE.md)** - Complete installation instructions
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - REST API and WebSocket reference
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **Redis & Bull** - Queue management
- **Socket.io** - Real-time WebSocket communication
- **Twilio** - Voice and SMS services
- **OpenAI** - GPT-4, Whisper, and TTS

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **React Query** - Server state management
- **Zustand** - Client state management
- **Recharts** - Data visualization

## 📁 Project Structure

```
ai-voice-calling-agent/
├── backend/
│   ├── prisma/              # Database schema and migrations
│   ├── src/
│   │   ├── common/          # Shared modules (prisma, guards, decorators)
│   │   ├── modules/
│   │   │   ├── auth/        # Authentication
│   │   │   ├── users/       # User management
│   │   │   ├── customers/   # Customer management
│   │   │   ├── campaigns/   # Campaign management
│   │   │   ├── calls/       # Call handling & webhooks
│   │   │   ├── appointments/# Appointment scheduling
│   │   │   ├── knowledge-base/ # FAQ management
│   │   │   ├── analytics/   # Metrics & reporting
│   │   │   ├── ai/          # OpenAI integration
│   │   │   ├── twilio/      # Twilio integration
│   │   │   └── websocket/   # Real-time updates
│   │   └── main.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities & configuration
│   │   ├── services/        # API clients
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript types
│   └── package.json
└── docs/                    # Documentation
```

## 🎯 Key Features Explained

### Campaign Management
Create automated calling campaigns targeting specific customer segments. Configure AI scripts, retry logic, and scheduling.

### AI Conversations
Powered by GPT-4, the system conducts natural conversations, handles objections, answers FAQs from the knowledge base, and schedules appointments autonomously.

### Real-Time Dashboard
Monitor active calls, campaign progress, and system metrics in real-time with WebSocket updates.

### Appointment Booking
AI can extract appointment details from conversations and automatically book slots with SMS confirmations.

### Analytics
Track conversion rates, sentiment analysis, call duration, peak hours, and campaign performance.

## 🔒 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Twilio webhook signature validation
- Rate limiting on API endpoints
- Environment variable encryption
- HTTPS enforcement in production

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 and Whisper APIs
- Twilio for voice communication infrastructure
- The NestJS and Next.js communities

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Review Twilio debugger for call-related issues

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Advanced call routing
- [ ] CRM integrations (Salesforce, HubSpot)
- [ ] Voice cloning for brand consistency
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] WhatsApp integration
- [ ] Calendar integrations (Google Calendar, Outlook)

---


