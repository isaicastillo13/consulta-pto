import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/api";
import { useCliente } from "../context/ClienteContext";
import Card from "../components/Card";

// Íconos
import hiIcon from "../assets/hiIconpng.png";
import stickerIcon from "../assets/svg/stickerIcon.svg";
import totalpuntosIcon from "../assets/svg/totalpuntosicon.svg";
import moneyIcon from "../assets/svg/moneyicon.svg";
import creditcardIcon from "../assets/svg/creditcard.svg";
import header from "../assets/header.png";

export default function Home() {
  const navigate = useNavigate();
  const { cliente } = useCliente();

  const [datosCliente, setDatosCliente] = useState(null);
  const [totalPuntos, setTotalPuntos] = useState(0);
  const [stickers, setStickers] = useState(0);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let saldoPuntos = ((totalPuntos * 0.22)/100).toFixed(2);

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
        console.warn(
          "No se encontró información del cliente, redirigiendo a Login."
        );
        navigate("/", { replace: true });
        return;
      }

      try {
        setLoading(true);
        const response = await userService.consultarCliente({
          numeroCliente: cliente.numeroCliente,
          numeroCuenta: cliente.numeroCuenta,
        });

        const puntos =
          response?.RespuestaConsultarCliente?.[0]?.PuntosCliente?.[0] || 0;
        const stickers =
          response?.RespuestaConsultarCliente?.[0]?.StickersCliente?.[0] || 0;
        const name =
          response?.RespuestaConsultarCliente?.[0]?.PrimerNombre?.[0] || "";

        setDatosCliente(response);
        setTotalPuntos(puntos);
        setStickers(stickers);
        setName(name);
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


  // 🧭 Render principal
  return (
    <>
      <div
        className="container m-4 p-4 rounded-4"
        style={{ backgroundColor: "rgba(247, 247, 247)" }}
      >
        {/* HEADER */}
        <div
          className="mb-4"
          style={{ backgroundColor: "rgba(247, 247, 247)" }}
        >
          <div className="d-flex align-items-center gap-2 ">
            <h2 className="mb-0 text-secondary-emphasis">Bienvenido, <b className="bg-primary-subtle px-2 rounded-4 text-primary-emphasis">{name || "Cliente"}</b></h2>
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
      </div>

      <div
        className="container m-4 p-4 rounded-4"
        style={{ backgroundColor: "rgba(247, 247, 247)" }}
      >
        {/* ESTADOS */}
        {loading && <p className="text-muted">Cargando datos...</p>}
        {error && <p className="text-danger">{error}</p>}

        {/* TARJETAS */}
        {!loading && !error && (
          <div className="container col-12 border-1 gap-3 row">
            <Card

              className="col-12 col-sm-6 col-md-3 p-3 rounded-3"
              title="Total de Puntos"
              content="Acomula puntos con cada compra"
              totales={totalPuntos}
              gradientIni="#3559a1"
              gradientEnd="#5695db"
              icon="star"
            />
            <Card
              className="col-12 col-sm-6 col-md-3 p-3 rounded-3"
              title="Saldo Puntos"
              content="Puntos equivalentes a dinero"
              totales={saldoPuntos}
              gradientIni="#1b5f3f"
              gradientEnd="#3ca66d"
              icon="currency-dollar"
            />
            <Card
              className="col-12 col-sm-6 col-md-3 p-3 rounded-3"
              title="Stickers"
              content="Colecciona stickers con cada compra"
              totales={stickers}
              gradientIni="#EF3E42"
              gradientEnd="#FF6A6B"
              icon="ticket"
            />

            <Card
              className="col-12 col-sm-6 col-md-3 p-3 rounded-3"
              title="Tarjeta de Crédito"
              content="Administra tu tarjeta de crédito"
              totales=""
              gradientIni="#1b5f3f"
              gradientEnd="#3ca66d"
              icon="credit-card"
            />
          </div>
        )}
      </div>
    </>
  );
}
