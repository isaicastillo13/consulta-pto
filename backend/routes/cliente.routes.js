import { Router } from 'express';
import { verificarClienteController } from '../controllers/cliente.controller.js';
const router = Router();

// Ruta para verificar cliente
router.post('/verificarcliente', verificarClienteController);


export default router;