import express from "express";
import { registerUser } from "../controllers/userController.js";
import { validateRequiredFields } from "../middleware/validateRequiredFields.js";
import { validateUserByCedula, validateSecurityAnswer } from "../controllers/userController.js";


const router = express.Router();
router.post(
  "/register",
  validateRequiredFields(["name", "cedula", "pregunta", "respuesta"]),
  registerUser
);

router.post("/validate-cedula",validateUserByCedula);
router.post("/validate-security",validateSecurityAnswer);



export default router;
