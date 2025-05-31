import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NewOrderProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAddress: string;
  position: { lat: number; lng: number };

}

export const NewOrder: React.FC<NewOrderProps> = ({ isOpen, onClose, selectedAddress, position }) => {
  const [clientName, setClientName] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [amount, setAmount] = useState('');
  const [complemention, setComplemention] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para cadastrar o novo pedido
    console.log({ clientName, isPaid, amount, selectedAddress });
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