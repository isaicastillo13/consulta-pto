import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/api";
import { useCliente } from "../context/ClienteContext";

// Íconos
import hiIcon from "../assets/hiIconpng.png";
import stickerIcon from "../assets/svg/stickerIcon.svg";
import totalpuntosIcon from "../assets/svg/totalpuntosicon.svg";
import moneyIcon from "../assets/svg/moneyicon.svg";
import creditcardIcon from "../assets/svg/creditcard.svg";

export default function Home() {
  const navigate = useNavigate();
  const { cliente } = useCliente();

  const [datosCliente, setDatosCliente] = useState(null);
  const [totalPuntos, setTotalPuntos] = useState(0);
  const [stickers, setStickers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Verificar token al montar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await userService.verifyToken();
      } catch (error) {
        console.error("Token inválido:", error.message);
        localStorage.removeItem("token");
        navigate("/", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  // ✅ Cargar datos del cliente
  useEffect(() => {
    const fetchCliente = async () => {
      if (!cliente) {
        console.warn("No se encontró información del cliente, redirigiendo a Login.");
        navigate("/", { replace: true });
        return;
      }

      try {
        setLoading(true);
        const response = await userService.consultarCliente({
          numeroCliente: cliente.numeroCliente,
          numeroCuenta: cliente.numeroCuenta,
        });

        const puntos = response?.RespuestaConsultarCliente?.[0]?.PuntosCliente?.[0] || 0;
        const stickers = response?.RespuestaConsultarCliente?.[0]?.StickersCliente?.[0] || 0;

        setDatosCliente(response);
        setTotalPuntos(puntos);
        setStickers(stickers);
        setError(null);
      } catch (err) {
        console.error("Error obteniendo datos del cliente:", err);
        setError("No se pudieron cargar los datos del cliente.");
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [cliente, navigate]);

  // ✅ Definir tarjetas de forma declarativa
  const tarjetas = [
    {
      titulo: "Total de Puntos",
      valor: totalPuntos,
      icono: totalpuntosIcon,
      bg: "bg-primary-subtle text-primary",
    },
    {
      titulo: "Saldo disponible",
      valor: datosCliente?.Saldo ?? "0.00",
      icono: moneyIcon,
      bg: "bg-success-subtle text-success",
    },
    {
      titulo: "Stickers digitales",
      valor: stickers,
      icono: stickerIcon,
      bg: "bg-danger-subtle text-danger",
    },
    {
      titulo: "Tarjeta",
      valor: datosCliente?.NumeroTarjeta ?? "—",
      icono: creditcardIcon,
      bg: "bg-dark-subtle text-dark",
    },
  ];

  // 🧭 Render principal
  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2">
          <h2 className="mb-0">Bienvenido, {cliente?.nombre || "Cliente"}</h2>
          <img
            src={hiIcon}
            alt="Saludo"
            style={{ width: "32px", height: "auto" }}
          />
        </div>
        <p className="text-secondary mb-0">
          Consulta y administra tus beneficios de manera rápida.
        </p>
      </div>

      {/* ESTADOS */}
      {loading && <p className="text-muted">Cargando datos...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* TARJETAS */}
      {!loading && !error && (
        <div className="row g-3">
          {tarjetas.map((card, index) => (
            <div key={index} className={`col-12 col-sm-6 col-md-3 p-3 rounded ${card.bg}`}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">{card.titulo}</h5>
                <img src={card.icono} alt={card.titulo} style={{ width: "24px" }} />
              </div>
              <h3 className="fw-bold">{card.valor}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
