export interface MapDataUpdate {
    id: string;
    latitude: number;
    longitude: number;
    timestamp: string;
    data?: any;
  }
  
  export interface PusherEventData {
    event: string;
    data: any;
    channel: string;
  }
  
  export type PusherChannels = 
    | 'map-updates'
    | 'user-location'
    | 'real-time-data';

   