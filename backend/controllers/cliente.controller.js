import { verificarClienteService } from "../services/cliente.service.js";

export async function verificarClienteController(req, res) {
    try{
        const data = req.body;
        const response = await verificarClienteService(data);
        res.json({
            success: true,
            data: response
        });
    }catch(error){
        console.error("Error en verificarClienteController:", error);
        res.status(500).json({
            success: false,
            message: "Error al verificar cliente",
            error: error.message
        });
    }
}