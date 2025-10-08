// src/context/ClienteContext.jsx
import { createContext, useContext, useState } from 'react';

const ClienteContext = createContext();

export function useCliente() {
  return useContext(ClienteContext);
}

export function ClienteProvider({ children }) {
  const [cliente, setCliente] = useState(null);

  const guardarCliente = (data) => {
    setCliente(data);
  };

  const limpiarCliente = () => {
    setCliente(null);
  };

  return (
    <ClienteContext.Provider value={{ cliente, guardarCliente, limpiarCliente }}>
      {children}
    </ClienteContext.Provider>
  );
}
