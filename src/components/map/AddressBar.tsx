import React, { useState, useEffect } from 'react';
import GeocodingService from '../../services/GeocodingService';
import { motion, AnimatePresence } from 'framer-motion';
import { useDelivery } from '../../contexts/DeliveryContext';

interface AddressBarProps {
  isVisible: boolean;
  onClose: () => void;
  onAddressSelect: (address: string, position: { lat: number; lng: number }) => void;
}

interface AddressSuggestion {
  formatted_address: string;
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  }
}

const AddressBar: React.FC<AddressBarProps> = ({ isVisible, onClose, onAddressSelect }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const geocodingService = new GeocodingService(process.env.NEXT_PUBLIC_GOOGLE_KEY || '');
  
  // Pega a função do contexto
  const { addCustomMarker } = useDelivery();

  useEffect(() => {
    if (!isVisible) {
      setAddress('');
      setSuggestions([]);
    } else {
      // Limpa o campo de endereço e sugestões ao abrir
      setAddress('');
      setSuggestions([]);
    }
  }, [isVisible]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAddress(value);
    
    if (value.length > 2) {
      setLoading(true);
      try {
        const results = await geocodingService.geocodeAddress(value);
        setSuggestions(results);
      } catch (error) {
        // console.error('Erro ao buscar endereços:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {    
    setAddress(suggestion.formatted_address);
    setSuggestions([]);
    
    // Chama a função do contexto para adicionar o marcador
    if (addCustomMarker) {
      addCustomMarker(suggestion.geometry.location);

      // Notifica o componente pai sobre a seleção do endereço
      onAddressSelect(suggestion.formatted_address, suggestion.geometry.location);

      // Fecha a barra de endereço
      onClose();

    } else {
      console.error('addCustomMarker não está disponível no contexto');
    }
  };

  return (
      <AnimatePresence>
        {isVisible && (
        <motion.div 
          className="address-bar-container fixed top-0 left-0 right-0 z-50 flex justify-center"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="address-bar bg-white rounded-b-lg shadow-lg p-4 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Novo Pedido</h3>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={handleChange}
                placeholder="Digite o endereço de entrega"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delivery-orange focus:border-delivery-orange transition-colors"
              />
              {loading && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-delivery-orange"></div>
                </div>
              )}
              {suggestions.length > 0 && (
                <motion.ul 
                  className="suggestions-list absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={suggestion.place_id || index}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <div className="flex items-start">
                        <div className="mr-2 mt-1 text-delivery-orange">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{suggestion.formatted_address}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddressBar;