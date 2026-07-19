import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);
  private connectedClients: Map<string, Socket> = new Map();

  afterInit(server: Server) {
    this.logger.log('✅ WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
    
    // Send connection confirmation
    client.emit('connected', {
      message: 'Successfully connected to WebSocket server',
      clientId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  /**
   * Emit call started event
   */
  emitCallStarted(callData: any) {
    this.server.emit('call:started', callData);
    this.logger.log(`Emitted call:started event for call ${callData.id}`);
  }

  /**
   * Emit call updated event
   */
  emitCallUpdated(callData: any) {
    this.server.emit('call:updated', callData);
    this.logger.log(`Emitted call:updated event for call ${callData.id}`);
  }

  /**
   * Emit call completed event
   */
  emitCallCompleted(callData: any) {
    this.server.emit('call:completed', callData);
    this.logger.log(`Emitted call:completed event for call ${callData.id}`);
  }

  /**
   * Emit campaign updated event
   */
  emitCampaignUpdated(campaignData: any) {
    this.server.emit('campaign:updated', campaignData);
    this.logger.log(`Emitted campaign:updated event for campaign ${campaignData.id}`);
  }

  /**
   * Emit appointment created event
   */
  emitAppointmentCreated(appointmentData: any) {
    this.server.emit('appointment:created', appointmentData);
    this.logger.log(`Emitted appointment:created event for appointment ${appointmentData.id}`);
  }

  /**
   * Emit appointment updated event
   */
  emitAppointmentUpdated(appointmentData: any) {
    this.server.emit('appointment:updated', appointmentData);
    this.logger.log(`Emitted appointment:updated event for appointment ${appointmentData.id}`);
  }

  /**
   * Emit notification event
   */
  emitNotification(notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    title?: string;
  }) {
    this.server.emit('notification', notification);
    this.logger.log(`Emitted notification: ${notification.message}`);
  }

  /**
   * Subscribe to call updates for specific call
   */
  @SubscribeMessage('subscribe:call')
  handleSubscribeToCall(
    @MessageBody() data: { callId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `call:${data.callId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} subscribed to ${room}`);
    
    return {
      event: 'subscribed',
      data: { room },
    };
  }

  /**
   * Unsubscribe from call updates
   */
  @SubscribeMessage('unsubscribe:call')
  handleUnsubscribeFromCall(
    @MessageBody() data: { callId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `call:${data.callId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} unsubscribed from ${room}`);
    
    return {
      event: 'unsubscribed',
      data: { room },
    };
  }

  /**
   * Subscribe to campaign updates
   */
  @SubscribeMessage('subscribe:campaign')
  handleSubscribeToCampaign(
    @MessageBody() data: { campaignId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `campaign:${data.campaignId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} subscribed to ${room}`);
    
    return {
      event: 'subscribed',
      data: { room },
    };
  }

  /**
   * Unsubscribe from campaign updates
   */
  @SubscribeMessage('unsubscribe:campaign')
  handleUnsubscribeFromCampaign(
    @MessageBody() data: { campaignId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `campaign:${data.campaignId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} unsubscribed from ${room}`);
    
    return {
      event: 'unsubscribed',
      data: { room },
    };
  }

  /**
   * Emit event to specific room
   */
  emitToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
    this.logger.log(`Emitted ${event} to room ${room}`);
  }

  /**
   * Get number of connected clients
   */
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  /**
   * Ping/Pong for keeping connection alive
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    return {
      event: 'pong',
      data: { timestamp: new Date().toISOString() },
    };
  }
}
