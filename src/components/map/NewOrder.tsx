import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRouteDistance } from '@/services/DistanceService';

interface NewOrderProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAddress: string;
  position: { lat: number; lng: number };
  onSave: (newOrder: any) => void;
}

export const NewOrder: React.FC<NewOrderProps> = ({ isOpen, onClose, selectedAddress, position, onSave }) => {
  const [clientName, setClientName] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [amount, setAmount] = useState('');
  const [complemention, setComplemention] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
  const [eta, setEta] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const storeLocation = [-49.38726407097774, -20.807881179340534];

  useEffect(() => {
    const calculateDistanceAndEta = async () => {
      if (position.lat && position.lng) {
        const calculatedDistance = await getRouteDistance(storeLocation, [position.lng, position.lat]);
        setDistance(calculatedDistance);

        let calculatedEta = 0;
        let totalTimer = 0;
        if (calculatedDistance !== null) {
          const averageSpeedKmH = 30;
          const timeInHours = calculatedDistance / averageSpeedKmH;
          const timeInMinutes = Math.round(timeInHours * 60);
          calculatedEta = timeInMinutes;
          totalTimer = (timeInMinutes * 2) + 5;
        }
        setTotalTime(totalTimer)
        setEta(calculatedEta);
      }
    };
    calculateDistanceAndEta();
  }, [position, selectedAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = {
      id: Date.now(), // Gerar um ID único
      client: clientName,
      driver: 'Aguardando',
      status: 'Pendente',
      eta: 'Aguardando',
      location: [position.lng, position.lat],
      color: '#FFD700', // Cor para novos pedidos
    };
    onSave(newOrder);
    onSave(newOrder);
    onClose();
  };

  

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? '0%' : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 w-[20%] h-full bg-white shadow-lg z-50"
    >
      <div className="p-4 h-full flex flex-col">
        <h2 className="text-xl font-bold mb-4">Novo Pedido</h2>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">Nome do Cliente</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4 flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isPaid}
                onChange={() => setIsPaid(!isPaid)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium">Pago</span>
            </label>
          </div>
          
          {!isPaid && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Valor a Pagar</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required={!isPaid}
              />
            </div>
          )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Complemento</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={complemention}
                onChange={(e) => setComplemention(e.target.value)}
              />
            </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Endereço</label>
            <p className="text-xs">{selectedAddress}, {position.lat}, {position.lng}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Distancia (Loja ~ Distino Final)</label>
            <p className="text-xs">{distance !== null ? `${distance.toFixed(2)} km` : 'Calculando...'}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tempo Estimado (ETA)</label>
            <p className="text-xs">{eta > 0 ? `${eta} minutos` : 'Calculando...'}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tempo Total Estimado - Ida e volta</label>
            <p className="text-xs">{eta > 0 ? `${totalTime} minutos` : 'Calculando...'}</p>
          </div>
          
          <div className="mt-auto flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Cadastrar Pedido
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};