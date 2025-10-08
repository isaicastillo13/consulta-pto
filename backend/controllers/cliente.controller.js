import { verificarClienteService } from "../services/cliente.service.js";

export async function verificarClienteController(req, res) {
  try {
    const data = req.body;
    const result = await verificarClienteService(data);

 
    if (!result || result.codigoRespuesta !== "00") {
      return res.status(400).json({
        ok: false,
        error: result?.mensaje || "Error en verificación de cliente",
        data: result,
      });
    }

    // 👌 Respuesta limpia al frontend
    return res.json({
      ok: true,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error en verificarClienteController:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Error interno en el servidor",
    });
  }
}
