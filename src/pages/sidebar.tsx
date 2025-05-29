
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, MapPin, Users, Package, Clock, TrendingUp, Bell, Eye, EyeOff, Plus } from "lucide-react";
import { useState } from "react";
import { useDelivery } from '@/contexts/DeliveryContext';

interface DeliverySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const DeliverySidebar = ({ isOpen, onToggle }: DeliverySidebarProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { selectedDriver, setSelectedDriver, setAddressBarVisible } = useDelivery();

  const stats = [
    { label: "Active Deliveries", value: "24", trend: "+12%", color: "text-delivery-orange" },
    { label: "Available Drivers", value: "8", trend: "+2", color: "text-delivery-blue" },
    { label: "Avg Delivery Time", value: "28min", trend: "-5min", color: "text-green-600" },
    { label: "Orders Today", value: "156", trend: "+18%", color: "text-delivery-orange" }
  ];

  const recentDeliveries = [
    { id: "#DL-001", driver: "Alex Chen", status: "In Transit", eta: "12 min", address: "123 Main St" },
    { id: "#DL-002", driver: "Sarah Kim", status: "Delivered", eta: "Completed", address: "456 Oak Ave" },
    { id: "#DL-003", driver: "Mike Johnson", status: "Pickup", eta: "5 min", address: "789 Pine Rd" }
  ];

  const menuItems = [
    { id: 'Visão Geral', label: 'Visão Geral', icon: TrendingUp },
    { id: 'Rotas', label: 'Rotas', icon: MapPin },
    { id: 'Entregadores', label: 'Entregadores', icon: Users },
    { id: 'Pedidos', label: 'Pedidos', icon: Package },
    { id: 'Alertas', label: 'Alertas', icon: Bell, badge: 3 }
  ];

  if (!isOpen) {
    return (
      <div className="w-16 h-full bg-white border-r border-gray-200 shadow-lg flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="mb-4 hover:bg-delivery-orange hover:text-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className="mb-2 p-2 hover:bg-delivery-orange hover:text-white transition-colors relative"
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="h-4 w-4" />
            {item.badge && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-delivery-orange">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-delivery-orange to-delivery-orange-light rounded-lg flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SwiftDelivery</h1>
              <p className="text-sm text-delivery-gray-dark">Caique | Operador</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggle} className="hover:bg-delivery-orange hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Botão Criar Novo Pedido */}
        <Button 
          className="w-full bg-delivery-orange hover:bg-delivery-orange-dark text-white mb-4 flex items-center justify-center gap-2"
          onClick={() => setAddressBarVisible(true)}
        >
          <Plus className="h-4 w-4" />
          Criar Novo Pedido
        </Button>

        {/* Navigation */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              size="sm"
              className={`w-full justify-start ${
                activeTab === item.id 
                  ? "bg-delivery-orange hover:bg-delivery-orange-dark text-white" 
                  : "hover:bg-delivery-orange hover:text-white"
              } transition-colors relative`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
              {item.badge && (
                <Badge className="ml-auto h-5 w-5 p-0 text-xs bg-red-500">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {activeTab === 'Entregadores' ? (
        <div className="space-y-4 flex-1 p-6 overflow-y-auto custom-scrollbar content-default">
        <h2 className="text-lg font-semibold text-gray-900">Entregadores Ativos</h2>
        <div className="grid gap-4">
          {[
            {
              name: 'Alex Chen',
              status: 'Ativo',
              avatar: '👨‍✈️',
              activeRoutes: 3,
              deliveriesToday: 12,
              avgDeliveryTime: '25 min',
            },
            {
              name: 'Sarah Kim',
              status: 'Offline',
              avatar: '👩‍✈️',
              activeRoutes: 0,
              deliveriesToday: 8,
              avgDeliveryTime: '28 min',
            },
            {
              name: 'Mike Johnson',
              status: 'Ativo',
              avatar: '👨‍✈️',
              activeRoutes: 2,
              deliveriesToday: 10,
              avgDeliveryTime: '22 min',
            }
          ].map((driver, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-delivery-orange/10 flex items-center justify-center overflow-hidden">
                    <svg className="w-8 h-8 text-delivery-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{driver.name}
                      
                    </h3>
                    <Badge
                      variant={driver.status === 'Ativo' ? 'default' : 'secondary'}
                      className={`mt-2 px-3 py-1 ${driver.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {driver.status}
                    </Badge>
                    <Button
                      onClick={() => {
                        if (selectedDriver === driver.name) {
                          setSelectedDriver(null);
                        } else {
                          setSelectedDriver(driver.name);
                        }
                      }}
                      variant={selectedDriver === driver.name ? "default" : "outline"}
                      className={`mt-2 p-2 h-8 w-8 ${selectedDriver === driver.name ? 'bg-delivery-orange text-white hover:bg-delivery-orange-dark' : 'hover:bg-gray-100'}`}
                    >
                      {selectedDriver === driver.name ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-4 bg-gray-50 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Rotas Ativas</p>
                  <p className="mt-1 text-xl font-semibold text-delivery-orange">{driver.activeRoutes}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Entregas Hoje</p>
                  <p className="mt-1 text-xl font-semibold text-delivery-blue">{driver.deliveriesToday}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Média Entrega</p>
                  <p className="mt-1 text-xl font-semibold text-green-600">{driver.avgDeliveryTime}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      ):(
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar content-default">
          {/* Stats Cards */}
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Performances do Dia</h2>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                      <span className={`text-xs font-medium ${stat.color}`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Quick Actions */}
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
            <div className="space-y-2">
              <Button className="w-full bg-delivery-orange hover:bg-delivery-orange-dark text-white transition-colors">
                <Package className="h-4 w-4 mr-2" />
                Criar Novo Pedido
              </Button>
              <Button variant="outline" className="w-full hover:bg-delivery-blue hover:text-white transition-colors">
                <Users className="h-4 w-4 mr-2" />
                Atribuir ao Entregador
              </Button>
              <Button variant="outline" className="w-full hover:bg-delivery-blue hover:text-white transition-colors">
                <MapPin className="h-4 w-4 mr-2" />
                Otimizar Rotas
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Recent Deliveries */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Deliveries</h2>
            <div className="space-y-3">
              {recentDeliveries.map((delivery) => (
                <Card key={delivery.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-delivery-blue">{delivery.id}</span>
                      <Badge 
                        variant={delivery.status === 'Delivered' ? 'default' : 'secondary'}
                        className={delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {delivery.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{delivery.driver}</p>
                    <p className="text-xs text-gray-500">{delivery.address}</p>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-delivery-orange" />
                      <span className="text-xs text-delivery-orange font-medium">{delivery.eta}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Status */}
      <div className="p-4 border-t border-gray-200 bg-delivery-gray">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-delivery"></div>
          <span className="text-sm font-medium text-gray-700">System Online</span>
          <span className="text-xs text-gray-500 ml-auto">Last update: now</span>
        </div>
      </div>
    </div>
  );
};

export default DeliverySidebar;
