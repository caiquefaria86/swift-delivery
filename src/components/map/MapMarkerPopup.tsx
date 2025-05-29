import { FC } from 'react';
import { Clock, MapPin, User } from 'lucide-react';

interface MapMarkerPopupProps {
  driver: string;
  client: string;
  status: string;
  eta: string;
  color: string;
}

const MapMarkerPopup: FC<MapMarkerPopupProps> = ({ driver, client, status, eta, color }) => {
  return (
    <div className="p-4 min-w-[200px]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: color }}
        />
        <h3 className="font-semibold text-base">{driver}</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <p className="text-sm text-gray-700">{client}</p>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <p className="text-sm text-gray-600">{status}</p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Clock className="w-4 h-4" style={{ color }} />
          <p className="text-sm font-medium" style={{ color }}>
            ETA: {eta}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapMarkerPopup;