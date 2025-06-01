import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useDelivery } from '@/contexts/DeliveryContext';
import ReactDOMServer from 'react-dom/server';
import MapMarkerPopup from '@/components/map/MapMarkerPopup';
import BottomPanel from '@/components/map/BottomPanel';
import AddressBar from '@/components/map/AddressBar';
import { NewOrder } from '@/components/map/NewOrder';
import { getRouteDistance } from '@/services/DistanceService';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import type { MapDataUpdate } from '@/types/pusher.types';

const DeliveryMap = () => {
  // Estilos para o marcador do motorista
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .driver-marker {
        width: 30px;
        height: 30px;
        cursor: pointer;
        transform-origin: bottom;
      }
      
      .driver-marker svg {
        filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.5));
        transition: transform 0.3s ease;
      }
      
      .driver-marker:hover svg {
        transform: scale(1.1);
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const { selectedDriver, isAddressBarVisible, setAddressBarVisible, setAddCustomMarker } = useDelivery();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const mapboxglRef = useRef<any>(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
  const customMarkerRef = useRef<any>(null);
  const deliveryMarkersRef = useRef<Map<string, any>>(new Map());
  const driverMarkersRef = useRef<Map<string, any>>(new Map());
  const storeMarkerRef = useRef<any>(null);

  const [showNewOrder, setShowNewOrder] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [isBottomPanelExpanded, setIsBottomPanelExpanded] = useState(true);
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([]);

  const storeLocation = [
    {id: 0, driver:'Loja', status:'Ponto Saida', eta: '0 min', location: [-49.38726407097774, -20.807881179340534], color: '#45B7D1' },
  ];

  const [isMapActive, setIsMapActive] = useState(false);

  const { 
    mapData, 
    isConnected, 
    error, 
    clearMapData 
  } = useRealTimeData(isMapActive);

  useEffect(() => {
    // Ativa a conexão quando o componente monta
    setIsMapActive(true);
    
    return () => {
      // Desativa quando desmonta
      setIsMapActive(false);
      clearMapData();
    };
  }, [clearMapData]);

  useEffect(() => {
    if (!mapboxglRef.current || !map.current) return;
    console.log('Atualizando marcadores...');

    mapData.forEach((update: MapDataUpdate) => {
      console.log('Atualizando marcador para:', update);
      if (update.data && update.id) {
        console.log('aaaa');
        updateDriverMarker(update.id, update.latitude, update.longitude);
      }
    });
  }, [mapData]);

  const updateDriverMarker = (driverId: string, lat: number, lng: number) => {
    if (!mapboxglRef.current || !map.current) return;

    const mapboxgl = mapboxglRef.current;

    let marker = driverMarkersRef.current.get(driverId);

    if (marker) {
      marker.setLngLat([lng, lat]);
    } else {
      const el = document.createElement('div');
      el.className = 'driver-marker';
      el.innerHTML = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"  width="30px" height="30px" viewBox="0 0 512.000000 512.000000"  preserveAspectRatio="xMidYMid meet">  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none" fill='#ccc'> <path fill="currentColor" d="M2280 4909 c-159 -31 -293 -174 -319 -341 -28 -173 64 -348 227 -429 64 -32 72 -34 177 -34 104 0 114 2 176 32 164 81 261 262 231 430 -42 237 -259 388 -492 342z"/> <path fill="currentColor" d="M1903 4075 c-64 -19 -124 -58 -174 -112 -85 -91 -123 -177 -184 -424 -49 -199 -59 -299 -52 -533 7 -227 20 -307 68 -397 60 -113 127 -148 349 -183 413 -65 607 -96 613 -96 3 0 20 -37 37 -82 169 -438 244 -615 273 -647 65 -69 177 -91 263 -52 56 25 110 92 124 153 20 80 36 30 -221 680 -100 252 -114 280 -152 315 -23 21 -55 44 -72 51 -16 6 -147 30 -290 52 -143 22 -278 43 -299 46 l-39 6 7 117 c4 64 11 148 17 187 l10 71 -98 99 c-154 155 -275 354 -276 455 -2 115 114 208 223 179 59 -16 100 -58 148 -151 24 -46 53 -97 66 -113 l24 -29 7 60 c17 151 -54 304 -162 350 -41 16 -155 16 -210 -2z"/> <path fill="currentColor" d="M1922 3913 c-85 -42 -101 -132 -42 -248 202 -397 560 -625 985 -625 119 0 155 16 185 83 24 52 24 71 1 123 -30 66 -65 80 -211 87 -171 9 -264 37 -397 119 -89 56 -218 196 -273 297 -69 126 -83 145 -120 163 -43 22 -85 22 -128 1z"/> <path fill="currentColor" d="M29 3751 l-29 -29 0 -597 c0 -651 -1 -640 57 -664 21 -8 191 -11 635 -9 l607 3 23 23 23 23 3 608 2 609 -26 31 -26 31 -620 0 -620 0 -29 -29z"/> <path fill="currentColor" d="M3597 3196 c-83 -30 -144 -91 -173 -171 l-11 -30 -94 0 -94 0 -31 83 c-33 89 -54 122 -79 122 -10 0 -15 -10 -15 -30 0 -41 -33 -104 -67 -128 -50 -35 -100 -44 -204 -40 -54 2 -99 0 -99 -5 0 -18 60 -67 82 -67 13 0 66 16 119 34 87 31 97 33 102 18 3 -9 77 -226 165 -482 88 -256 174 -508 192 -560 18 -52 37 -105 42 -118 8 -23 9 -23 65 27 158 141 396 189 606 121 131 -42 256 -132 322 -234 31 -47 84 -23 71 31 -19 77 -163 239 -268 301 -84 50 -191 83 -305 95 l-101 11 -31 81 c-43 112 -95 196 -175 282 -65 69 -181 156 -272 202 -34 17 -45 29 -58 67 -9 26 -16 51 -16 56 0 4 31 8 70 8 l69 0 22 -50 c23 -55 89 -121 141 -143 18 -8 55 -17 81 -21 46 -7 50 -6 82 28 86 91 86 408 0 500 -28 30 -76 34 -138 12z"/> <path fill="currentColor" d="M402 2327 c-20 -21 -22 -34 -22 -146 0 -67 4 -131 10 -141 5 -10 23 -23 40 -28 l30 -11 -21 -53 c-95 -240 -171 -515 -173 -632 l-1 -71 153 -3 153 -3 -7 79 c-9 105 15 222 67 331 77 159 238 288 421 336 96 25 256 17 356 -18 274 -96 454 -378 422 -660 -3 -32 -4 -60 -1 -62 2 -3 329 -5 726 -5 l722 0 -1 110 -1 110 -581 0 -581 0 -26 58 c-39 89 -83 238 -101 341 -21 125 -20 138 10 174 25 30 25 34 22 153 -2 103 -6 125 -22 143 -19 21 -19 21 -796 21 l-777 0 -21 -23z"/> <path fill="currentColor" d="M1063 1895 c-239 -65 -407 -281 -407 -525 0 -154 53 -281 163 -390 178 -176 434 -207 656 -80 247 141 338 468 202 724 -42 79 -146 183 -223 224 -113 59 -274 78 -391 47z m215 -331 c109 -45 162 -173 117 -282 -60 -142 -251 -173 -353 -57 -103 117 -67 275 78 342 36 17 115 15 158 -3z"/> <path fill="currentColor" d="M3778 1894 c-274 -66 -453 -341 -404 -621 34 -194 161 -346 351 -419 60 -24 85 -28 175 -28 116 0 171 13 274 68 163 85 276 275 276 466 0 158 -50 280 -160 390 -74 74 -158 123 -251 145 -78 18 -185 18 -261 -1z m210 -330 c147 -61 178 -261 57 -362 -72 -59 -175 -65 -252 -15 -50 32 -79 75 -94 138 -37 163 133 304 289 239z"/> </g> </svg> `;
          
      marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
      .setLngLat([lng, lat])
      .addTo(map.current);
      console.log('chegou aqui');
      driverMarkersRef.current.set(driverId, marker);
      console.log(driverMarkersRef.current);

      // Adiciona animação ao marcador
      el.style.animation = 'bounce 0.5s ease-in-out';
    }
  };

  // const renderConnectionStatus = () => (
  //   <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
  //     {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
  //     {error && <span className="error"> - {error}</span>}
  //   </div>
  // );

  const renderMapPoints = () => (
    <div className="map-points">
      <h3>Pontos no Mapa ({mapData.length})</h3>
      {mapData.map((point: MapDataUpdate) => (
        <div key={point.id} className="map-point">
          <strong>ID:</strong> {point.id}<br />
          <strong>Lat:</strong> {point.latitude}<br />
          <strong>Lng:</strong> {point.longitude}<br />
          <strong>Hora:</strong> {new Date(point.timestamp).toLocaleTimeString()}
          {point.data && (
            <div><strong>Dados:</strong> {JSON.stringify(point.data)}</div>
          )}
        </div>
      ))}
    </div>
  );

  const handleSaveNewOrder = async (newOrder: any) => {
    // Calculate distance for the new order
    const storeCoords = storeLocation[0].location;
    const newOrderCoords = newOrder.location;
    const distance = await getRouteDistance(storeCoords, newOrderCoords);
    
    let eta = 0;
    if (distance !== null) {
      // Assuming an average speed of 30 km/h for delivery
      const averageSpeedKmH = 30;
      console.log(distance);
      const timeInHours = distance / averageSpeedKmH;
      const timeInMinutes = Math.round(timeInHours * 60);
      eta = timeInMinutes;
    }

    const orderWithDistance = { ...newOrder, distance, eta };

    setActiveDeliveries((prevDeliveries) => [...prevDeliveries, orderWithDistance]);
    setIsBottomPanelExpanded(true);
    console.log(activeDeliveries);
    customMarkerRef.current.remove();
    updateMapContent();
  };

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
    deliveryMarkersRef.current.clear();

    if (storeMarkerRef.current) {
      storeMarkerRef.current.remove();
      storeMarkerRef.current = null;
    }
  };

  // Função para criar os marcadores de entrega
  const createDeliveryMarkers = async (deliveriesToShow: any[]) => {
    if (!mapboxglRef.current) return;
    
    const mapboxgl = mapboxglRef.current;
    
    // Adicionar marcadores para cada ponto de entrega
    for (const delivery of deliveriesToShow) {
      const storeCoords = storeLocation[0].location;
      const deliveryCoords = delivery.location;
      const distance = await getRouteDistance(storeCoords, deliveryCoords);

      let eta = 0;
      if (distance !== null) {
        const averageSpeedKmH = 30;
        const timeInHours = distance / averageSpeedKmH;
        const timeInMinutes = Math.round(timeInHours * 60);
        eta = timeInMinutes;
      }
      const deliveryWithEta = { ...delivery, eta };
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
                    eta={deliveryWithEta.eta + ' min'}
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
      deliveryMarkersRef.current.set(delivery.id, marker);
    }

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
                  eta={storeLocation[0].eta+ ' min'}
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
        const initialDeliveries = [
          { id: 1, client:"Leandro",driverId: 1, driver: "Alex Chen", status: "Em Transito", location: [-49.410278488437065, -20.7933523086532], color: '#FF6B6B' },
          { id: 2, client:"Mauro",driverId: 1, driver: "Alex Chen", status: "Em Rota", location: [-49.407675040202356, -20.77037424404696], color: '#4ECDC4' },
          { id: 3, client:"Oruam",driverId: 1, driver: "Alex Chen", status: "Em Rota", location: [-49.388828, -20.788155], color: '#45B7D1' },
          { id: 4, client:"Jorge",driverId: 1, driver: "Alex Chen", status: "Em Rota", location: [-49.36945370333552, -20.81306787830816], color: '#d9d501' },
          { id: 5, client:"Julio",driverId: 2, driver: "Sarah Kim", status: "Em Rota", location: [-49.35817658103226, -20.791771682116924], color: '#0b3e37' },
          { id: 7, client:"Gertrudes",driverId: 2, driver: "Sarah Kim", status: "Em Rota", location: [-49.35233594139471, -20.83405322301398], color: '#ff0000' },
          { id: 6, client:"Marinalva",driverId: 2, driver: "Sarah Kim", status: "Em Rota", location: [-49.37525568020509, -20.821538909299814], color: '#ff19a5' },
          { id: 8, client:"Josilene",driverId: 3, driver: "Mike Johnson", status: "Em Rota", location: [-49.414923847625154, -20.832798615225524], color: '#ff19a5' }
        ];

        const deliveriesWithEta = await Promise.all(initialDeliveries.map(async (delivery) => {
          const storeCoords = storeLocation[0].location;
          const deliveryCoords = delivery.location;
          const distance = await getRouteDistance(storeCoords, deliveryCoords);

          let eta = 0;
          if (distance !== null) {
            const averageSpeedKmH = 30;
            const timeInHours = distance / averageSpeedKmH;
            const timeInMinutes = Math.round(timeInHours * 60);
            eta = timeInMinutes;
          }
          return { ...delivery, eta };
        }));

        setActiveDeliveries(deliveriesWithEta);
        await updateMapContent();
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  // Nova função para atualizar o conteúdo do mapa
  const updateMapContent = async () => {
    if (!map.current || !mapboxglRef.current) return;
    console.log('Atualizando mapa...');

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
          selectedDriver ? deliveries[i + 1].color : '#b3b3b3',
          `route-${driver.toLowerCase().replace(' ', '-')}-${i}`
        );
      }

      // Rota final: da última entrega até a loja
      await createRoute(
        deliveries[deliveries.length - 1].location,
        storeLocation[0].location,
        '#b3b3b3',
        `route-${driver.toLowerCase().replace(' ', '-')}-end`
      );
    }

    // Criar os marcadores de entrega
    const markersToShow = selectedDriver ? filteredDeliveries : activeDeliveries;
    await createDeliveryMarkers(markersToShow);
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

  useEffect(() => {
    // Atualiza o mapa apenas quando houver mudanças nas entregas ativas
    if (activeDeliveries.length > 0) {
      updateMapContent();
    }
  }, [activeDeliveries]);

  // UseEffect para quando o driver selecionado muda
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      updateMapContent();
    }
  }, [activeDeliveries, selectedDriver]);


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
        <div class="w-12 h-12 rounded-full flex items-center justify-center animate-pulse-delivery">
          <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
          viewBox="0 0 32 32" xml:space="preserve">
          <path fill="#00c400" d="M16,3C10.5,3,6,7.5,6,13c0,8.4,9,15.5,9.4,15.8c0.2,0.1,0.4,0.2,0.6,0.2s0.4-0.1,0.6-0.2C17,28.5,26,21.4,26,13
            C26,7.5,21.5,3,16,3z M16,17c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S18.2,17,16,17z"/>
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
        center: [location.lng + 0.0025, location.lat - 0.0013],
        zoom: 16,
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

  const handleAddressSelect = (address: string, position: { lat: number; lng: number }) => {
    setSelectedAddress(address);
    setSelectedPosition(position);
    setShowNewOrder(true);
    setIsBottomPanelExpanded(false);
  };

  const handleCloseNewOrder = () => {
    setShowNewOrder(false);
    setSelectedAddress('');
    setIsBottomPanelExpanded(true);
  };

  return (
    <div className="h-full relative">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />
      {/* Barra de endereço, aparece por cima do mapa */}
      <AddressBar
        isVisible={isAddressBarVisible}
        onClose={() => setAddressBarVisible(false)}
        onAddressSelect={handleAddressSelect}
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
          <p>Informações sobre entregas e motoristas.</p>
          <div className="mt-4">
            {/* {renderConnectionStatus()} */}
            {renderMapPoints()}
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
          isExpanded={isBottomPanelExpanded}
          setIsExpanded={setIsBottomPanelExpanded}
          isNewOrderVisible={showNewOrder}
        />
      {showNewOrder && (
        <NewOrder 
          isOpen={showNewOrder} 
          onClose={handleCloseNewOrder}
          selectedAddress={selectedAddress}
          position={selectedPosition}
          onSave={handleSaveNewOrder}
        />
      )}
    </div>
  );
};

export default DeliveryMap;