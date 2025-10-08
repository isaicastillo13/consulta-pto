import { Router } from 'express';
import { verificarClienteController, consultarClienteController  } from '../controllers/cliente.controller.js';
const router = Router();

// Ruta para verificar cliente
router.post('/verificarcliente', verificarClienteController);

// Ruta para consultar cliente
router.post('/consultarcliente', consultarClienteController);


export default router;