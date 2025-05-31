import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useDelivery } from '@/contexts/DeliveryContext';
import ReactDOMServer from 'react-dom/server';
import MapMarkerPopup from '@/components/map/MapMarkerPopup';
import BottomPanel from '@/components/map/BottomPanel';
import AddressBar from '@/components/map/AddressBar';

const DeliveryMap = () => {
  const { selectedDriver, isAddressBarVisible, setAddressBarVisible, addCustomMarker, setAddCustomMarker } = useDelivery();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const mapboxglRef = useRef<any>(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
  const customMarkerRef = useRef<any>(null);
  // Novo ref para armazenar todos os marcadores de entrega
  const deliveryMarkersRef = useRef<any[]>([]);
  const storeMarkerRef = useRef<any>(null);

  const storeLocation = [
    {id: 0, driver:'Loja', status:'Ponto Saida', eta: '0 min', location: [-49.38726407097774, -20.807881179340534], color: '#45B7D1' },
  ];

  // Mock delivery data com coordenadas no formato correto [longitude, latitude]
  const activeDeliveries = [
    { id: 1, client:"Leandro", driver: "Alex Chen", status: "Em Transito", eta: "5 min", location: [-49.410278488437065, -20.7933523086532], color: '#FF6B6B' },
    { id: 2, client:"Mauro", driver: "Alex Chen", status: "Em Rota", eta: "10 min", location: [-49.407675040202356, -20.77037424404696], color: '#4ECDC4' },
    { id: 3, client:"Oruam", driver: "Alex Chen", status: "Em Rota", eta: "18 min", location: [-49.388828, -20.788155], color: '#45B7D1' },
    { id: 4, client:"Jorge", driver: "Alex Chen", status: "Em Rota", eta: "25 min", location: [-49.36945370333552, -20.81306787830816], color: '#d9d501' },
    { id: 5, client:"Julio", driver: "Sarah Kim", status: "Em Rota", eta: "25 min", location: [-49.35817658103226, -20.791771682116924], color: '#0b3e37' },
    { id: 7, client:"Gertrudes", driver: "Sarah Kim", status: "Em Rota", eta: "25 min", location: [-49.35233594139471, -20.83405322301398], color: '#ff0000' },
    { id: 6, client:"Marinalva", driver: "Sarah Kim", status: "Em Rota", eta: "25 min", location: [-49.37525568020509, -20.821538909299814], color: '#ff19a5' },
    { id: 8, client:"Josilene", driver: "Mike Johnson", status: "Em Rota", eta: "25 min", location: [-49.414923847625154, -20.832798615225524], color: '#ff19a5' },
  ];

  const createRoute = async (start: number[], end: number[], color: string, routeId: string) => {
    if (!mapboxToken) return;
    
    try {
      // Validar coordenadas antes de fazer a chamada
      if (!isValidCoordinates(start) || !isValidCoordinates(end)) {
        console.error('Coordenadas inválidas:', { start, end });
        return;
      }

      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxToken}`;
      const response = await fetch(directionsUrl);
      const data = await response.json();

      if (data.code === "NoSegment" || !data.routes || data.routes.length === 0) {
        console.error('Não foi possível encontrar uma rota entre os pontos:', { start, end, error: data.message });
        return;
      }

      if (map.current.getSource(routeId)) {
        map.current.removeLayer(routeId);
        map.current.removeSource(routeId);
      }

      map.current.addSource(routeId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: data.routes[0].geometry,
        },
      });

      map.current.addLayer({
        id: routeId,
        type: 'line',
        source: routeId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': color,
          'line-width': 4,
          'line-opacity': 0.8
        },
      });
    } catch (error) {
      console.error('Erro ao criar rota:', error);
    }
  };

  // Função auxiliar para validar coordenadas
  const isValidCoordinates = (coords: number[]): boolean => {
    if (!Array.isArray(coords) || coords.length !== 2) return false;
    const [lng, lat] = coords;
    return (
      typeof lng === 'number' && 
      typeof lat === 'number' && 
      lng >= -180 && lng <= 180 && 
      lat >= -90 && lat <= 90
    );
  };

  // Função para limpar apenas os marcadores de entrega (não o customizado)
  const clearDeliveryMarkers = () => {
    deliveryMarkersRef.current.forEach(marker => {
      marker.remove();
    });
    deliveryMarkersRef.current = [];
    
    if (storeMarkerRef.current) {
      storeMarkerRef.current.remove();
      storeMarkerRef.current = null;
    }
  };

  // Função para criar os marcadores de entrega
  const createDeliveryMarkers = (deliveriesToShow: any[]) => {
    if (!mapboxglRef.current) return;
    
    const mapboxgl = mapboxglRef.current;
    
    // Adicionar marcadores para cada ponto de entrega
    deliveriesToShow.forEach((delivery) => {
      const el = document.createElement('div');
      el.className = 'delivery-marker';
      el.innerHTML = `
        <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse-delivery"
             style="background-color: ${delivery.color}">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
          </svg>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat(delivery.location)
        .setPopup(
          new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: false,
            maxWidth: 'none'
          })
            .setHTML(`
              <div id="popup-${delivery.id}">
                ${ReactDOMServer.renderToString(
                  <MapMarkerPopup
                    driver={delivery.driver}
                    client={delivery.client}
                    status={delivery.status}
                    eta={delivery.eta}
                    color={delivery.color}
                  />
                )}
              </div>
            `)
        )
        .addTo(map.current);

      // Adicionar eventos de hover
      el.addEventListener('mouseenter', () => {
        marker.getPopup().addTo(map.current);
      });

      el.addEventListener('mouseleave', () => {
        marker.getPopup().remove();
      });

      // Adicionar à lista de marcadores
      deliveryMarkersRef.current.push(marker);
    });

    // Adicionar marcador para a loja
    const pinStore = document.createElement('div');
    pinStore.className = 'delivery-marker';
    pinStore.innerHTML = `
        <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse-delivery"
             style="background-color: ${storeLocation[0].color}">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
      `;

    storeMarkerRef.current = new mapboxgl.Marker(pinStore)
      .setLngLat(storeLocation[0].location)
      .setPopup(
        new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
          maxWidth: 'none'
        })
          .setHTML(`
            <div id="popup-store">
              ${ReactDOMServer.renderToString(
                <MapMarkerPopup
                  driver={storeLocation[0].driver}
                  client="Loja Central"
                  status={storeLocation[0].status}
                  eta={storeLocation[0].eta}
                  color={storeLocation[0].color}
                />
              )}
            </div>
          `)
      )
      .addTo(map.current);

    // Adicionar eventos de hover para o marcador da loja
    pinStore.addEventListener('mouseenter', () => {
      storeMarkerRef.current?.getPopup().addTo(map.current);
    });

    pinStore.addEventListener('mouseleave', () => {
      storeMarkerRef.current?.getPopup().remove();
    });
  };

  const initializeMap = async () => {
    if (!mapContainer.current || !mapboxToken) return;
    try {
      const mapboxgl = (await import('mapbox-gl')).default;
      await import('mapbox-gl/dist/mapbox-gl.css');
      mapboxgl.accessToken = mapboxToken;

      mapboxglRef.current = mapboxgl;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: storeLocation[0].location,
        zoom: 13,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', async () => {
        await updateMapContent();
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  // Nova função para atualizar o conteúdo do mapa
  const updateMapContent = async () => {
    if (!map.current || !mapboxglRef.current) return;

    // Limpar rotas existentes
    clearExistingRoutes();
    
    // Limpar marcadores de entrega existentes (mas manter o customizado)
    clearDeliveryMarkers();

    // Filtrar entregas com base no driver selecionado
    const filteredDeliveries = selectedDriver
      ? activeDeliveries.filter(delivery => delivery.driver === selectedDriver)
      : activeDeliveries;

    // Agrupar entregas por entregador usando Map
    const deliveriesByDriver = filteredDeliveries.reduce((map, delivery) => {
      const deliveries = map.get(delivery.driver) || [];
      deliveries.push(delivery);
      map.set(delivery.driver, deliveries);
      return map;
    }, new Map());

    // Criar rotas para cada entregador
    for (const [driver, deliveries] of deliveriesByDriver) {
      // Rota inicial: da loja até primeira entrega
      await createRoute(
        storeLocation[0].location,
        deliveries[0].location,
        selectedDriver ? deliveries[0].color : '#b3b3b3',
        `route-${driver.toLowerCase().replace(' ', '-')}-start`
      );

      // Rotas entre as entregas
      for (let i = 0; i < deliveries.length - 1; i++) {
        const start = deliveries[i].location;
        const end = deliveries[i + 1].location;
        await createRoute(
          start,
          end,
          selectedDriver ? deliveries[i].color : '#b3b3b3',
          `route-${driver.toLowerCase().replace(' ', '-')}-${i}`
        );
      }

      // Rota final: da última entrega até a loja
      await createRoute(
        deliveries[deliveries.length - 1].location,
        storeLocation[0].location,
        selectedDriver ? deliveries[0].color : '#b3b3b3',
        `route-${driver.toLowerCase().replace(' ', '-')}-end`
      );
    }

    // Criar os marcadores de entrega
    const markersToShow = selectedDriver ? filteredDeliveries : activeDeliveries;
    createDeliveryMarkers(markersToShow);
  };

  const clearExistingRoutes = () => {
    if (!map.current) return;
    
    // Remover todas as rotas existentes
    const sources = map.current.getStyle().sources;
    Object.keys(sources).forEach(sourceId => {
      if (sourceId.startsWith('route-')) {
        if (map.current.getLayer(sourceId)) {
          map.current.removeLayer(sourceId);
        }
        map.current.removeSource(sourceId);
      }
    });
  };

  useEffect(() => {
    initializeMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // UseEffect para quando o driver selecionado muda
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      updateMapContent();
    }
  }, [selectedDriver]);

  // UseEffect para o marcador customizado
  useEffect(() => {
    const handleAddCustomMarker = (location: { lat: number; lng: number }) => {
      console.log('Adicionando marcador customizado:', location);
      if (!mapboxglRef.current) {
        console.warn('mapboxgl ainda não foi carregado');
        return;
      }

      // Remove marcador anterior se existir
      if (customMarkerRef.current) {
        customMarkerRef.current.remove();
      }

      const mapboxgl = mapboxglRef.current;
      
      // Cria o elemento do marcador
      const el = document.createElement('div');
      el.className = 'delivery-marker custom-marker'; // Adiciona classe para identificar
      el.innerHTML = `
        <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse-delivery" 
             style="background-color: #FF9800">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
          </svg>
        </div>
      `;

      // Cria o marcador
      customMarkerRef.current = new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .setPopup(
          new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: false,
            maxWidth: 'none'
          }).setHTML(
            `<div class="p-2 bg-white rounded shadow">
              <p class="text-sm font-medium">Nova Entrega</p>
              <p class="text-xs text-gray-600">Localização selecionada</p>
             </div>`
          )
        )
        .addTo(map.current);

      // Adiciona eventos de hover
      el.addEventListener('mouseenter', () => {
        if (customMarkerRef.current) {
          customMarkerRef.current.getPopup().addTo(map.current);
        }
      });

      el.addEventListener('mouseleave', () => {
        if (customMarkerRef.current) {
          customMarkerRef.current.getPopup().remove();
        }
      });

      // Opcional: mover o mapa para mostrar o novo marcador
      map.current.flyTo({
        center: [location.lng, location.lat],
        zoom: 15,
        duration: 1000
      });
    };

    // Registra a função no contexto
    if (setAddCustomMarker) {
      setAddCustomMarker(handleAddCustomMarker);
    }

    // Cleanup function
    return () => {
      // Não remover o marcador customizado no cleanup a menos que seja explicitamente necessário
    };
  }, [setAddCustomMarker]);

  return (
    <div className="h-full relative">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />
      {/* Barra de endereço, aparece por cima do mapa */}
      <AddressBar
        isVisible={isAddressBarVisible}
        onClose={() => setAddressBarVisible(false)}
      />
      {/* Overlay Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        {/* Live Stats */}
        <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Rastreamento ao vivo</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-delivery-blue" />
              <span className="text-sm font-semibold">{activeDeliveries.length}</span>
              <span className="text-xs text-gray-600">Ativos</span>
            </div>
          </div>
        </Card>
        {/* Legend */}
        <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-lg">
          <h3 className="text-sm font-semibold mb-2">Delivery Status</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-delivery-orange rounded-full"></div>
              <span className="text-xs">Em Transito</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-delivery-blue rounded-full"></div>
              <span className="text-xs">Aguardando</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs">Em Retirada</span>
            </div>
          </div>
        </Card>
      </div>
      <BottomPanel
        deliveries={activeDeliveries}
        selectedDriver={selectedDriver}
      />
    </div>
  );
};

export default DeliveryMap;