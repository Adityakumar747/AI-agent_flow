import { useEffect, useCallback } from 'react';
import { wsClient } from '@/lib/websocket-client';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';

export function useWebSocket() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      wsClient.connect();

      // Handle notifications
      const unsubscribe = wsClient.on('notification', (data: any) => {
        switch (data.type) {
          case 'success':
            toast.success(data.message, { description: data.title });
            break;
          case 'error':
            toast.error(data.message, { description: data.title });
            break;
          case 'warning':
            toast.warning(data.message, { description: data.title });
            break;
          case 'info':
            toast.info(data.message, { description: data.title });
            break;
        }
      });

      return () => {
        unsubscribe();
        wsClient.disconnect();
      };
    }
  }, [isAuthenticated]);

  const subscribeToCall = useCallback((callId: string) => {
    wsClient.subscribeToCall(callId);
  }, []);

  const unsubscribeFromCall = useCallback((callId: string) => {
    wsClient.unsubscribeFromCall(callId);
  }, []);

  const subscribeToCampaign = useCallback((campaignId: string) => {
    wsClient.subscribeToCampaign(campaignId);
  }, []);

  const unsubscribeFromCampaign = useCallback((campaignId: string) => {
    wsClient.unsubscribeFromCampaign(campaignId);
  }, []);

  const onCallStarted = useCallback((callback: Function) => {
    return wsClient.on('call:started', callback);
  }, []);

  const onCallUpdated = useCallback((callback: Function) => {
    return wsClient.on('call:updated', callback);
  }, []);

  const onCallCompleted = useCallback((callback: Function) => {
    return wsClient.on('call:completed', callback);
  }, []);

  const onCampaignUpdated = useCallback((callback: Function) => {
    return wsClient.on('campaign:updated', callback);
  }, []);

  const onAppointmentCreated = useCallback((callback: Function) => {
    return wsClient.on('appointment:created', callback);
  }, []);

  const onAppointmentUpdated = useCallback((callback: Function) => {
    return wsClient.on('appointment:updated', callback);
  }, []);

  return {
    subscribeToCall,
    unsubscribeFromCall,
    subscribeToCampaign,
    unsubscribeFromCampaign,
    onCallStarted,
    onCallUpdated,
    onCallCompleted,
    onCampaignUpdated,
    onAppointmentCreated,
    onAppointmentUpdated,
    isConnected: wsClient.isConnected(),
  };
}
