// src/context/ClienteContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ClienteContext = createContext();

export function useCliente() {
  return useContext(ClienteContext);
}

export function ClienteProvider({ children }) {
  const [cliente, setCliente] = useState(null);

  // ✅ Al montar el provider, leemos localStorage
  useEffect(() => {
    const clienteGuardado = localStorage.getItem("cliente");
    if (clienteGuardado) {
      setCliente(JSON.parse(clienteGuardado));
    }
  }, []);

  const guardarCliente = (data) => {
    setCliente(data);
    localStorage.setItem("cliente", JSON.stringify(data)); // sincronizar aquí también
  };

  const limpiarCliente = () => {
    setCliente(null);
    localStorage.removeItem("cliente");
  };

  return (
    <ClienteContext.Provider value={{ cliente, guardarCliente, limpiarCliente }}>
      {children}
    </ClienteContext.Provider>
  );
}
