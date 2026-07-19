import { io, Socket } from 'socket.io-client';

class WebSocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect() {
    if (this.socket?.connected) {
      return;
    }

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    this.socket.on('connected', (data) => {
      console.log('WebSocket connection confirmed:', data);
    });

    // Set up event listeners
    this.socket.on('call:started', (data) => this.emit('call:started', data));
    this.socket.on('call:updated', (data) => this.emit('call:updated', data));
    this.socket.on('call:completed', (data) => this.emit('call:completed', data));
    this.socket.on('campaign:updated', (data) => this.emit('campaign:updated', data));
    this.socket.on('appointment:created', (data) => this.emit('appointment:created', data));
    this.socket.on('appointment:updated', (data) => this.emit('appointment:updated', data));
    this.socket.on('notification', (data) => this.emit('notification', data));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
      }
    };
  }

  off(event: string, callback?: Function) {
    if (callback) {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
      }
    } else {
      this.listeners.delete(event);
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  subscribeToCall(callId: string) {
    if (this.socket) {
      this.socket.emit('subscribe:call', { callId });
    }
  }

  unsubscribeFromCall(callId: string) {
    if (this.socket) {
      this.socket.emit('unsubscribe:call', { callId });
    }
  }

  subscribeToCampaign(campaignId: string) {
    if (this.socket) {
      this.socket.emit('subscribe:campaign', { campaignId });
    }
  }

  unsubscribeFromCampaign(campaignId: string) {
    if (this.socket) {
      this.socket.emit('unsubscribe:campaign', { campaignId });
    }
  }

  ping() {
    if (this.socket) {
      this.socket.emit('ping');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsClient = new WebSocketClient();
