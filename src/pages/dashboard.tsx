
import { useState } from "react";
import DeliverySidebar from "./sidebar";
import DeliveryMap from "./map";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const DeliveryDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-delivery-gray flex">
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg hover:bg-delivery-orange hover:text-white transition-all duration-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'w-80' : 'w-16'}
        transition-all duration-300 ease-in-out
        h-screen
        bg-white
        border-r border-gray-200
        shadow-lg
        z-40
        flex-shrink-0
        relative
      `}>
        <DeliverySidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <DeliveryMap />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DeliveryDashboard;
