import { createContext, useContext, useState, ReactNode, useRef } from 'react';

interface DeliveryContextType {
  selectedDriver: string | null;
  setSelectedDriver: (driver: string | null) => void;
  isAddressBarVisible: boolean;
  setAddressBarVisible: (visible: boolean) => void;
  addCustomMarker?: (location: { lat: number; lng: number }) => void;
  setAddCustomMarker: (fn: (location: { lat: number; lng: number }) => void) => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [isAddressBarVisible, setAddressBarVisible] = useState<boolean>(false);
  
  // Use useRef para armazenar a função em vez de useState
  const addCustomMarkerRef = useRef<((location: { lat: number; lng: number }) => void) | undefined>(undefined);

  // Função para definir a função addCustomMarker
  const setAddCustomMarker = (fn: (location: { lat: number; lng: number }) => void) => {
    addCustomMarkerRef.current = fn;
  };

  // Função wrapper que chama a função armazenada na ref
  const addCustomMarker = (location: { lat: number; lng: number }) => {
    if (addCustomMarkerRef.current) {
      addCustomMarkerRef.current(location);
    } else {
      console.warn('addCustomMarker função não foi definida ainda');
    }
  };

  return (
    <DeliveryContext.Provider value={{
      selectedDriver,
      setSelectedDriver,
      isAddressBarVisible,
      setAddressBarVisible,
      addCustomMarker,
      setAddCustomMarker
    }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
}