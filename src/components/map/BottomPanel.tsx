import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from '@/lib/utils';

interface Delivery {
  id: number;
  driver: string;
  status: string;
  eta: string;
}

interface BottomPanelProps {
  deliveries: Delivery[];
  selectedDriver: string | null;
}

const BottomPanel = ({ deliveries, selectedDriver }: BottomPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredDeliveries = selectedDriver
    ? deliveries.filter(d => d.driver === selectedDriver)
    : deliveries;

  return (
    <div className={cn(
        "absolute bottom-4 z-10 transition-all duration-300 ease-in-out",
        isExpanded ? "left-4 right-4" : "left-4 w-fit"
      )}>
      <Card 
        className={cn(
          "transition-all duration-300 ease-in-out",
          "bg-white/95 backdrop-blur-sm shadow-lg",
          isExpanded ? "p-4 w-full" : "p-2"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <h3 className={cn(
              "font-semibold transition-all duration-300",
              isExpanded ? "text-lg" : "text-sm"
            )}>Entregas Ativas</h3>
            <Badge className="bg-delivery-orange text-white whitespace-nowrap">
              {deliveries.length} Ativos
            </Badge>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {filteredDeliveries.map((delivery) => (
              <div key={delivery.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{delivery.driver}</span>
                  <Badge 
                    variant="secondary" 
                    className={
                      delivery.status === 'In Transit' ? 'bg-delivery-orange text-white' :
                      delivery.status === 'Pickup' ? 'bg-delivery-blue text-white' :
                      'bg-green-500 text-white'
                    }
                  >
                    {delivery.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>ETA: {delivery.eta}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default BottomPanel;