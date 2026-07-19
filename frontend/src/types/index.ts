// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'AGENT' | 'VIEWER';
  createdAt: string;
  updatedAt: string;
}

// Customer types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Campaign types
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  aiScript?: string;
  totalCustomers: number;
  callsMade: number;
  callsSuccessful: number;
  callsFailed: number;
  appointmentsBooked: number;
  maxAttempts: number;
  retryDelay: number;
  scheduledFor?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
}

// Call types
export interface Call {
  id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  status: 'INITIATED' | 'RINGING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'BUSY' | 'NO_ANSWER' | 'CANCELLED';
  toNumber: string;
  fromNumber: string;
  duration?: number;
  recordingUrl?: string;
  summary?: string;
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  outcome?: string;
  conversationLog?: any[];
  twilioSid?: string;
  startedAt?: string;
  answeredAt?: string;
  endedAt?: string;
  createdAt: string;
  customer?: Customer;
  campaign?: Campaign;
}

// Appointment types
export interface Appointment {
  id: string;
  service: string;
  dateTime: string;
  duration: number;
  location?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  confirmationSms: boolean;
  reminderSent: boolean;
  createdAt: string;
  customer: Customer;
  agent?: User;
}

// Knowledge Base types
export interface KnowledgeBase {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords?: string[];
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

// Analytics types
export interface AnalyticsOverview {
  totalCalls: number;
  totalCustomers: number;
  totalCampaigns: number;
  totalAppointments: number;
  recentCalls: number;
  activeCampaigns: number;
  upcomingAppointments: number;
  completedCallsToday: number;
  appointmentsBookedToday: number;
  conversionRate: string;
}

export interface CallTrend {
  date: string;
  total: number;
  inbound: number;
  outbound: number;
  completed: number;
  failed: number;
}

export interface ConversionMetrics {
  totalCompletedCalls: number;
  appointmentsBooked: number;
  callbackRequests: number;
  noAnswer: number;
  busy: number;
  failed: number;
  conversionRate: string;
  contactRate: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Auth types
export interface LoginResponse {
  accessToken: string;
  user: User;
}
