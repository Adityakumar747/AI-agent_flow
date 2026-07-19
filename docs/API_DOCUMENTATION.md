# API Documentation

Base URL: `http://localhost:3001/api`

All endpoints require authentication except where noted as **Public**.

## Authentication

### POST /auth/login
**Public** - Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "admin@voiceagent.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@voiceagent.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

### POST /auth/register
**Public** - Register a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### GET /auth/profile
Get current user profile

**Headers:**
```
Authorization: Bearer <token>
```

## Customers

### GET /customers
Get paginated list of customers

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "tags": ["premium", "returning"],
      "notes": "Prefers morning appointments",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

### POST /customers
Create a new customer

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567891",
  "tags": ["new"],
  "notes": "First-time customer"
}
```

### GET /customers/:id
Get customer by ID

### PATCH /customers/:id
Update customer

### DELETE /customers/:id
Delete customer

### POST /customers/import
Import customers from CSV

**Request:** Multipart form data with CSV file

## Campaigns

### GET /campaigns
Get paginated list of campaigns

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Summer Promotion 2024",
      "description": "Calling existing customers for special offer",
      "status": "ACTIVE",
      "totalCustomers": 100,
      "callsMade": 45,
      "callsSuccessful": 32,
      "appointmentsBooked": 18,
      "maxAttempts": 3,
      "retryDelay": 60,
      "createdAt": "2024-01-10T09:00:00Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### POST /campaigns
Create a new campaign

**Request Body:**
```json
{
  "name": "New Campaign",
  "description": "Campaign description",
  "aiScript": "Hello! I'm calling from...",
  "maxAttempts": 3,
  "retryDelay": 60,
  "scheduledFor": "2024-02-01T09:00:00Z"
}
```

### POST /campaigns/:id/start
Start a campaign (begins making calls)

### POST /campaigns/:id/pause
Pause an active campaign

### POST /campaigns/:id/customers
Add customers to campaign

**Request Body:**
```json
{
  "customerIds": ["uuid1", "uuid2", "uuid3"]
}
```

## Calls

### GET /calls
Get paginated list of calls

**Query Parameters:**
- `page`, `limit`
- `direction` (INBOUND/OUTBOUND)
- `status` (INITIATED/COMPLETED/FAILED etc.)
- `campaignId` (filter by campaign)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "direction": "OUTBOUND",
      "status": "COMPLETED",
      "toNumber": "+1234567890",
      "fromNumber": "+0987654321",
      "duration": 180,
      "sentiment": "POSITIVE",
      "outcome": "APPOINTMENT_BOOKED",
      "summary": "Customer agreed to book appointment for car service",
      "recordingUrl": "https://...",
      "startedAt": "2024-01-15T14:30:00Z",
      "endedAt": "2024-01-15T14:33:00Z",
      "customer": {
        "name": "John Doe",
        "phone": "+1234567890"
      }
    }
  ],
  "meta": { ... }
}
```

### GET /calls/:id
Get call details including conversation log

### POST /calls/make-call
Manually initiate an outbound call

**Request Body:**
```json
{
  "customerId": "uuid",
  "campaignId": "uuid"
}
```

### POST /calls/webhook/inbound
**Public** - Twilio webhook for incoming calls

### POST /calls/webhook/:callId
**Public** - Twilio webhook for outbound call handling

### POST /calls/webhook/gather/:callId
**Public** - Twilio webhook for processing speech input

### POST /calls/webhook/:callId/status
**Public** - Twilio webhook for call status updates

## Appointments

### GET /appointments
Get paginated list of appointments

**Query Parameters:**
- `page`, `limit`
- `status` (PENDING/CONFIRMED/COMPLETED/CANCELLED)
- `customerId` (filter by customer)
- `dateFrom`, `dateTo` (filter by date range)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "service": "Oil Change",
      "dateTime": "2024-01-20T10:00:00Z",
      "duration": 60,
      "location": "123 Main Street",
      "status": "CONFIRMED",
      "notes": "Requested early morning slot",
      "confirmationSms": true,
      "reminderSent": false,
      "customer": {
        "name": "John Doe",
        "phone": "+1234567890"
      }
    }
  ],
  "meta": { ... }
}
```

### POST /appointments
Create a new appointment

**Request Body:**
```json
{
  "customerId": "uuid",
  "service": "Oil Change",
  "dateTime": "2024-01-20T10:00:00Z",
  "duration": 60,
  "location": "123 Main Street",
  "notes": "Customer prefers early morning"
}
```

### POST /appointments/:id/cancel
Cancel an appointment

**Request Body:**
```json
{
  "reason": "Customer requested reschedule"
}
```

### POST /appointments/:id/send-confirmation
Send SMS confirmation to customer

### GET /appointments/available-slots
Get available time slots for a date

**Query Parameters:**
- `date` (YYYY-MM-DD)
- `duration` (minutes, default: 30)

### GET /appointments/statistics
Get appointment statistics

## Knowledge Base

### GET /knowledge-base
Get paginated knowledge base entries

**Query Parameters:**
- `page`, `limit`
- `category` (filter by category)
- `search` (search in questions/answers)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "question": "What are your business hours?",
      "answer": "We are open Monday to Friday from 9 AM to 6 PM...",
      "category": "GENERAL",
      "keywords": ["hours", "timing", "open"],
      "isActive": true,
      "priority": 10,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": { ... }
}
```

### POST /knowledge-base
Create knowledge base entry

**Request Body:**
```json
{
  "question": "Do you offer warranties?",
  "answer": "Yes, all our services come with...",
  "category": "WARRANTY",
  "keywords": ["warranty", "guarantee"],
  "priority": 7
}
```

### POST /knowledge-base/bulk-import
Import multiple entries at once

**Request Body:**
```json
[
  {
    "question": "...",
    "answer": "...",
    "category": "...",
    "keywords": [...]
  }
]
```

### GET /knowledge-base/categories
Get list of all categories

## Analytics

### GET /analytics/overview
Get dashboard overview metrics

**Response:**
```json
{
  "totalCalls": 1250,
  "totalCustomers": 450,
  "totalCampaigns": 12,
  "totalAppointments": 380,
  "recentCalls": 87,
  "activeCampaigns": 3,
  "upcomingAppointments": 45,
  "completedCallsToday": 23,
  "appointmentsBookedToday": 8,
  "conversionRate": "34.50"
}
```

### GET /analytics/call-trends
Get call trends over time

**Query Parameters:**
- `days` (default: 30)

**Response:**
```json
[
  {
    "date": "2024-01-15",
    "total": 45,
    "inbound": 12,
    "outbound": 33,
    "completed": 38,
    "failed": 7
  }
]
```

### GET /analytics/conversion-metrics
Get detailed conversion metrics

### GET /analytics/campaign-performance
Get performance metrics for all campaigns

### GET /analytics/sentiment-distribution
Get sentiment analysis distribution

### GET /analytics/hourly-distribution
Get call distribution by hour (peak hours)

### POST /analytics/update-daily-metrics
Manually trigger daily metrics update

**Query Parameters:**
- `date` (optional, defaults to today)

## WebSocket Events

Connect to: `ws://localhost:3001`

### Events Emitted by Server

- `connected` - Connection confirmation
- `call:started` - New call initiated
- `call:updated` - Call status updated
- `call:completed` - Call completed
- `campaign:updated` - Campaign status changed
- `appointment:created` - New appointment created
- `appointment:updated` - Appointment updated
- `notification` - System notification

### Events You Can Emit

- `subscribe:call` - Subscribe to call updates
  ```json
  { "callId": "uuid" }
  ```

- `unsubscribe:call` - Unsubscribe from call
- `subscribe:campaign` - Subscribe to campaign updates
- `ping` - Keep connection alive

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- Authenticated endpoints: 100 requests per minute
- Public endpoints: 20 requests per minute
- Webhook endpoints: No limit (from Twilio IPs)

## Swagger Documentation

Interactive API documentation is available in development mode at:
`http://localhost:3001/api/docs`
