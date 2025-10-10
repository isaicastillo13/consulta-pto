// src/context/ClienteContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ClienteContext = createContext();

export function useCliente() {
  return useContext(ClienteContext);
}

export function ClienteProvider({ children }) {
  const [cliente, setCliente] = useState(null);
  const [loadingCliente, setLoadingCliente] = useState(true); // 👈 nuevo

  useEffect(() => {
    const clienteGuardado = localStorage.getItem("cliente");
    if (clienteGuardado) {
      setCliente(JSON.parse(clienteGuardado));
    }
    setLoadingCliente(false); // cuando termina la hidratación
  }, []);

  const guardarCliente = (data) => {
    setCliente(data);
    localStorage.setItem("cliente", JSON.stringify(data));
  };

  const limpiarCliente = () => {
    setCliente(null);
    localStorage.removeItem("cliente");
  };

  return (
    <ClienteContext.Provider value={{ cliente, guardarCliente, limpiarCliente, loadingCliente }}>
      {children}
    </ClienteContext.Provider>
  );
}
