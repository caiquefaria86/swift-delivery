import { createContext, useContext, useState, ReactNode } from 'react';

interface DeliveryContextType {
  selectedDriver: string | null;
  setSelectedDriver: (driver: string | null) => void;
  isAddressBarVisible: boolean;
  setAddressBarVisible: (visible: boolean) => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [isAddressBarVisible, setAddressBarVisible] = useState<boolean>(false);

  return (
    <DeliveryContext.Provider value={{ 
      selectedDriver, 
      setSelectedDriver,
      isAddressBarVisible,
      setAddressBarVisible
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