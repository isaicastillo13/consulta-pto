import express from "express";
import { registerUser } from "../controllers/userController.js";
import { validateRequiredFields } from "../middleware/validateRequiredFields.js";

const router = express.Router();
router.post(
  "/register",
  validateRequiredFields(["name", "cedula", "pregunta", "respuesta"]),
  registerUser
);

export default router;
