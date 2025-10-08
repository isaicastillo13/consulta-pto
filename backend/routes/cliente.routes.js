import { Router } from 'express';
import { verificarClienteController } from '../controllers/cliente.controller';
const router = Router();

// Ruta para verificar cliente
router.post('/verificar', verificarClienteController);

export default router;