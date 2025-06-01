import { useEffect, useRef } from 'react';
import { getPusherClient, disconnectPusher } from '@/lib/pusher';
import type { PusherChannels } from '@/types/pusher.types';

interface UsePusherProps {
  channelName: PusherChannels;
  eventName: string;
  onEvent: (data: any) => void;
  enabled?: boolean;
}

export const usePusher = ({ 
  channelName, 
  eventName, 
  onEvent, 
  enabled = true 
}: UsePusherProps) => {
  const pusherRef = useRef<any>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) return;

    // Inicializa o Pusher
    pusherRef.current = getPusherClient();
    
    // Se inscreve no canal
    channelRef.current = pusherRef.current.subscribe(channelName);
    
    // Escuta o evento
    channelRef.current.bind(eventName, onEvent);

    return () => {
      // Cleanup
      if (channelRef.current) {
        channelRef.current.unbind(eventName, onEvent);
        pusherRef.current?.unsubscribe(channelName);
      }
    };
  }, [channelName, eventName, onEvent, enabled]);

  useEffect(() => {
    // Desconecta quando o componente for desmontado
    return () => {
      disconnectPusher();
    };
  }, []);

  return {
    pusher: pusherRef.current,
    channel: channelRef.current,
  };
};