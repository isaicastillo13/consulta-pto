import React, { useEffect } from "react";
import { userService } from "../services/api";
import { useNavigate } from "react-router-dom";
import hiIcon from "../assets/hiIconpng.png";
import stickerIcon from "../assets/svg/stickerIcon.svg";
import totalpuntosIcon from "../assets/svg/totalpuntosicon.svg";
import moneyIcon from "../assets/svg/moneyicon.svg";
import creditcardIcon from "../assets/svg/creditcard.svg";
import { useCliente } from "../context/ClienteContext";

export default function Home() {
  const navigate = useNavigate();
  const {cliente} = useCliente();

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

      <div>{cliente ? `👤 ${cliente.PeticionVerificarCliente?.Nombre}` : 'No autenticado' }</div>
      <div>
        <div className="col d-flex align-items-center gap-2">
        <h2>Bienvenido, Cliente</h2>
        <img className="" style={{ width: "32px", height: "auto" }} src={hiIcon} alt="" />
        </div>
        <p className="text-secondary">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>

      <div className="row gap-2">
        <div className="col bg-primary-subtle text-primary">
            <div className="d-flex justify-content-between align-items-center">
                <h4>Total de Puntos</h4>
                <img src={totalpuntosIcon} alt="" />
            </div>
            <h3 className="fw-bold">2000</h3>
        </div>
        <div className="col bg-success-subtle">
            <div>
                <h4></h4>
                <img src={moneyIcon} alt="" />
            </div>
            <h3></h3>
        </div>
        <div className="col bg-danger-subtle">
            <div>
                <h4></h4>
                <img src={stickerIcon} alt="" />
            </div>
            <h3></h3>
        </div>
        <div className="col bg-dark-subtle">
            <div>
                <h4></h4>
                <img src={creditcardIcon} alt="" />
            </div>
            <h3></h3>
        </div>
      </div>

      <div>
        <p></p>
        <p></p>
        <a href=""></a>
    </div>
    <div>
    </div>
    </div>
  );
}