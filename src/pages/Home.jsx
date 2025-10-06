import React, { useEffect } from "react";
import { userService } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Verificando autenticación del usuario...");
    
    const checkAuth = async () => {
      try {
        await userService.verifyToken();
        // Token válido, el usuario puede permanecer en Home
      } catch (error) {
        // Token inválido o expirado, redirigir a Login
        console.error("Token inválido:", error.message);
        localStorage.removeItem("token");
        navigate("/", { replace: true }); // Redirigir al login
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div>
      <h1>Home Page</h1>
      <p>Bienvenido al área protegida</p>
    </div>
  );
}