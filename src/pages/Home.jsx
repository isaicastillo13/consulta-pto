import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/api";
import { useCliente } from "../context/ClienteContext";
import Card from "../components/Card";

// Íconos
import hiIcon from "../assets/hiIconpng.png";
import puntodeoro from "../assets/puntoDeOro.png";

export default function Home() {
  const navigate = useNavigate();
  const { cliente } = useCliente();

  const [datosCliente, setDatosCliente] = useState(null);
  const [totalPuntos, setTotalPuntos] = useState(0);
  const [stickers, setStickers] = useState(0);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clienteScotia, setClienteScotia] = useState("");
  const [numTarjeta, setNumTarjeta] = useState(0);
  const [titular, setTitular] = useState(null);
  let saldoPuntos = ((totalPuntos * 0.22) / 100).toFixed(2);

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
        const esClienteScotia =
          response?.RespuestaConsultarCliente?.[0]?.CobCodigo?.[0] || "";
        const numTarjeta =
          response?.RespuestaConsultarCliente?.[0]?.CobTarjeta?.[0] || "";
        const titular =
          response?.RespuestaConsultarCliente?.[0]?.CobCliente?.[0] || "";

        setDatosCliente(response);
        setTotalPuntos(puntos);
        setStickers(stickers);
        setName(name);
        if (esClienteScotia === "0"){
          setClienteScotia("No es cliente Scotia");
        }else if (esClienteScotia === "1"){
          setClienteScotia("Convierte en cliente Scotia en nuestras cajas");
        }else{
          setClienteScotia("Cliente Scotia");
        }
    
        setNumTarjeta(numTarjeta);
        setTitular(titular);
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
    <div className="d-flex flex-column justify-content-center align-items-center h-100 p-2">
      <div
        className="container m-4 p-4 rounded-4 row bg-primary-subtle position-relative overflow-visible d-md-overflow-hidden"
        style={{ backgroundColor: "rgba(247, 247, 247)" }}
      >
        {/* HEADER */}
        <div className="col-12 mb-4">
          <div className="d-flex align-items-center gap-2">
            <h2 className="mb-0 text-secondary-emphasis">
              Bienvenido,{" "}
              <b className="px-2 rounded-4 text-primary-emphasis">
                {name || "Cliente"}
              </b>
            </h2>
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

        {/* Imagen decorativa sobresaliente */}
        <div className="col-12 d-flex justify-content-end">
          <img
            className="position-absolute top-50 translate-middle-y d-none d-md-block"
            src={puntodeoro}
            alt="Header"
            style={{
              width: "300px",
              top: "100%", // la empuja al borde inferior
              transform: "translateY(-20%)", // sobresale un poco
              zIndex: 10,
            }}
          />
        </div>
      </div>

      <div
        className="container d-flex flex-column justify-content-center align-items-center py-4 rounded-4"
        style={{ backgroundColor: "rgba(247, 247, 247)" }}
      >
        {/* ESTADOS */}
        {loading && <p className="text-muted">Cargando datos...</p>}
        {error && <p className="text-danger">{error}</p>}

        {/* TARJETAS */}
        {!loading && !error && (
          <div className="container col-12 col-sm-12 gap-3 row">
            <Card
              title="Total de Puntos"
              content="Totoal de puntos Acumulados"
              totales={totalPuntos}
              gradientIni="#3559a1"
              gradientEnd="#4f7dd1"
              icon="trophy"
            />

            <Card
              className="col-12 col-sm-12 col-md shadow-lg"
              title="Saldo Puntos"
              content="Puntos equivalentes a dinero"
              totales={saldoPuntos}
              gradientIni="#1b5f3f"
              gradientEnd="#3ca66d"
              icon="currency-dollar"
            />
            <Card
              className="col-12 col-sm-12 col-md "
              title="Stickers Digitales"
              content="Colecciona stickers con cada compra"
              totales={stickers}
              gradientIni="#EF3E42"
              gradientEnd="#FF6A6B"
              icon="ticket"
            />

            <Card
              className="col-12 col-sm-12 col-md"
              classtitulo="text-danger"
              title="SCOTIABANK"
              content={clienteScotia}
              totales=""
              gradientIni="#e3e1e2"
              gradientEnd="#959492"
              icon="credit-card"
            />
          </div>
        )}
      </div>
    </div>
  );
}
