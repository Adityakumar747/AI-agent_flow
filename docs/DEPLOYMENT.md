# Deployment Guide

This guide covers deploying the AI Voice Calling Agent to production environments.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificates obtained
- [ ] Twilio phone number purchased and configured
- [ ] OpenAI API key with sufficient credits
- [ ] Redis instance set up
- [ ] Domain names configured
- [ ] Monitoring and logging set up

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker and Docker Compose installed
- Domain names pointed to your server
- SSL certificates ready

#### Steps

1. **Build Docker images:**

```bash
# Build backend
cd backend
docker build -t voice-agent-backend .

# Build frontend
cd ../frontend
docker build -t voice-agent-frontend .
```

2. **Configure docker-compose.yml:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: voiceagent
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    image: voice-agent-backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/voiceagent
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET}
      TWILIO_ACCOUNT_SID: ${TWILIO_ACCOUNT_SID}
      TWILIO_AUTH_TOKEN: ${TWILIO_AUTH_TOKEN}
      TWILIO_PHONE_NUMBER: ${TWILIO_PHONE_NUMBER}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      BACKEND_URL: https://api.yourdomain.com
      FRONTEND_URL: https://yourdomain.com
    depends_on:
      - postgres
      - redis
    ports:
      - "3001:3001"

  frontend:
    image: voice-agent-frontend
    environment:
      NEXT_PUBLIC_API_URL: https://api.yourdomain.com/api
      NEXT_PUBLIC_WS_URL: https://api.yourdomain.com
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

3. **Create .env file:**

```env
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
OPENAI_API_KEY=sk-...
```

4. **Start services:**

```bash
docker-compose up -d
```

5. **Run migrations:**

```bash
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

### Option 2: Cloud Platform Deployment

#### AWS Deployment

**Services Used:**
- **EC2** or **ECS**: Application hosting
- **RDS PostgreSQL**: Database
- **ElastiCache Redis**: Caching and queues
- **Route53**: DNS management
- **CloudFront**: CDN for frontend
- **Application Load Balancer**: Traffic distribution

**Architecture:**
```
[CloudFront] → [ALB] → [ECS/EC2]
                  ↓
           [RDS + ElastiCache]
```

**Steps:**

1. **Set up RDS PostgreSQL:**
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier voiceagent-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YourPassword \
  --allocated-storage 20
```

2. **Set up ElastiCache Redis:**
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id voiceagent-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

3. **Deploy to ECS:**
- Create ECR repositories
- Push Docker images
- Create ECS task definitions
- Create ECS services
- Configure load balancer

#### Vercel (Frontend Only)

Perfect for deploying the Next.js frontend:

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel --prod
```

3. **Configure environment variables** in Vercel dashboard

#### Heroku (Full Stack)

1. **Install Heroku CLI:**
```bash
heroku login
```

2. **Create apps:**
```bash
# Backend
heroku create voice-agent-api
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev

# Frontend
heroku create voice-agent-app
```

3. **Configure environment variables:**
```bash
heroku config:set JWT_SECRET=your_secret -a voice-agent-api
heroku config:set TWILIO_ACCOUNT_SID=your_sid -a voice-agent-api
# ... set all required variables
```

4. **Deploy:**
```bash
# Backend
cd backend
git push heroku main

# Frontend
cd frontend
git push heroku main
```

### Option 3: VPS Deployment (DigitalOcean, Linode, etc.)

1. **Provision server:**
- Ubuntu 22.04 LTS
- Minimum 2GB RAM, 2 vCPUs
- 50GB SSD storage

2. **Install dependencies:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Redis
sudo apt install redis-server

# Install Nginx
sudo apt install nginx

# Install PM2
sudo npm install -g pm2
```

3. **Clone and setup:**
```bash
git clone <repository-url>
cd ai-voice-calling-agent

# Backend
cd backend
npm install
npm run build

# Frontend
cd ../frontend
npm install
npm run build
```

4. **Configure PM2:**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'voice-agent-backend',
      script: 'dist/main.js',
      cwd: './backend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'voice-agent-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './frontend',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

5. **Configure Nginx:**

```nginx
# /etc/nginx/sites-available/voice-agent

# Frontend
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/voice-agent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Setup SSL with Let's Encrypt:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

## Post-Deployment Configuration

### 1. Twilio Webhooks

Update Twilio phone number webhooks to production URLs:

- Voice URL: `https://api.yourdomain.com/api/calls/webhook/inbound`
- Status Callback: `https://api.yourdomain.com/api/calls/webhook/:callId/status`

### 2. Database Backups

**PostgreSQL automated backups:**

```bash
# Create backup script
cat > /usr/local/bin/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/voiceagent"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump voiceagent > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /usr/local/bin/backup-db.sh
```

### 3. Monitoring

**Set up health checks:**

```bash
# Create health check endpoint monitoring
curl -X POST https://api.yourdomain.com/api/health
```

**Recommended monitoring tools:**
- **UptimeRobot**: Uptime monitoring
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **DataDog/NewRelic**: Application performance

### 4. Logging

Configure centralized logging:

```javascript
// backend/src/main.ts
import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Security Checklist

- [ ] HTTPS enabled for all domains
- [ ] Environment variables secured
- [ ] Database access restricted to application
- [ ] Redis password protected
- [ ] JWT secret is strong and unique
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Twilio webhooks validated
- [ ] Regular security updates applied
- [ ] Firewall configured (only ports 80, 443, 22 open)

## Performance Optimization

1. **Enable caching:**
   - Redis for session storage
   - CDN for static assets

2. **Database optimization:**
   - Add indexes for frequently queried fields
   - Enable connection pooling

3. **Frontend optimization:**
   - Enable Next.js image optimization
   - Implement code splitting
   - Use CDN for assets

## Scaling Considerations

**Horizontal Scaling:**
- Use load balancer for multiple backend instances
- Shared Redis and PostgreSQL
- Separate read replicas for database

**Vertical Scaling:**
- Increase server resources as needed
- Monitor CPU, memory, and disk usage

## Rollback Procedure

If deployment fails:

```bash
# Rollback with PM2
pm2 reload ecosystem.config.js --update-env

# Rollback database migrations
cd backend
npx prisma migrate resolve --rolled-back <migration_name>

# Restore database from backup
psql voiceagent < /var/backups/voiceagent/backup_YYYYMMDD_HHMMSS.sql
```

## Maintenance

**Regular tasks:**
- Weekly: Review logs and error reports
- Monthly: Update dependencies
- Quarterly: Security audit
- Annually: Review and optimize infrastructure costs
