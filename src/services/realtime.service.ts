import { getPusherClient } from '@/lib/pusher';
import type { MapDataUpdate } from '@/types/pusher.types';

class RealTimeService {
  private pusher: any = null;
  private channels: Map<string, any> = new Map();

  init() {
    if (!this.pusher) {
      this.pusher = getPusherClient();
    }
  }

  subscribeToMapUpdates(callback: (data: MapDataUpdate) => void) {
    this.init();
    
    if (!this.channels.has('map-updates')) {
      const channel = this.pusher.subscribe('map-updates');
      this.channels.set('map-updates', channel);
    }
    
    const channel = this.channels.get('map-updates');
    channel.bind('location-update', callback);
  }

  unsubscribeFromMapUpdates(callback: (data: MapDataUpdate) => void) {
    const channel = this.channels.get('map-updates');
    if (channel) {
      channel.unbind('location-update', callback);
    }
  }

  disconnect() {
    this.channels.forEach((channel, channelName) => {
      this.pusher?.unsubscribe(channelName);
    });
    this.channels.clear();
    this.pusher?.disconnect();
    this.pusher = null;
  }
}

export const realTimeService = new RealTimeService();