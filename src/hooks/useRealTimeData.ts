import { useState, useCallback, useEffect } from 'react';
import { usePusher } from './usePusher';
import type { MapDataUpdate } from '@/types/pusher.types';

export const useRealTimeData = (enabled: boolean = true) => {
  const [mapData, setMapData] = useState<MapDataUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMapUpdate = useCallback((data: any) => {
    console.log('Received map update:', data);
    let parsedData: MapDataUpdate;
    try {
      // Tenta fazer o parse se for uma string, caso contrário, assume que já é o objeto
      parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.error('Failed to parse map data:', e);
      return; // Sai se o parse falhar
    }

    setMapData(prev => {
      // Atualiza ou adiciona novo ponto
      const existingIndex = prev.findIndex(item => item.id === parsedData.id);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = parsedData;
        return updated;
      }
      
      return [...prev, parsedData];
    });
  }, []);

  const handleConnectionChange = useCallback((isConnected: boolean) => {
    console.log('Pusher connection status changed:', isConnected);
    setIsConnected(isConnected);
    if (isConnected) {
      setError(null);
    }
  }, []);

  const { pusher, channel } = usePusher({
    channelName: 'map-updates',
    eventName: 'location-update',
    onEvent: handleMapUpdate,
    enabled
  });

  // Monitora estado da conexão
  useEffect(() => {
    if (pusher) {
      const handleConnected = () => handleConnectionChange(true);
      const handleDisconnected = () => handleConnectionChange(false);
      const handleError = (err: any) => {
        setError(err.message || 'Erro de conexão');
        handleConnectionChange(false);
      };

      pusher.connection.bind('connected', handleConnected);
      pusher.connection.bind('disconnected', handleDisconnected);
      pusher.connection.bind('error', handleError);

      return () => {
        pusher.connection.unbind('connected', handleConnected);
        pusher.connection.unbind('disconnected', handleDisconnected);
        pusher.connection.unbind('error', handleError);
      };
    }
  }, [pusher, handleConnectionChange]);

  const clearMapData = useCallback(() => {
    setMapData([]);
  }, []);

  return {
    mapData,
    isConnected,
    error,
    clearMapData,
    pusher,
    channel
  };
};