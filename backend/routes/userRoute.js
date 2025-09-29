import express from "express";
import { registerUser } from "../controllers/userController.js";
import { validateRequiredFields } from "../middleware/validateRequiredFields.js";
import { getIdUser } from "../controllers/userController.js";

const router = express.Router();
router.post(
  "/register",
  validateRequiredFields(["name", "cedula", "pregunta", "respuesta"]),
  registerUser
);

router.post("/validateid", getIdUser);

export default router;
