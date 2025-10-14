import { createUser } from "../services/userService.js";
import bcrypt from "bcryptjs";
import { findUserByCedula, hashRespuesta } from "../services/userService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, cedula, pregunta, respuesta } = req.body;
    const userData = {
      Nombre: name,
      Cedula: cedula,
      IdPregunta: pregunta,
      Respuesta: respuesta,
    };

    // Hashear la respuesta antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedRespuesta = await bcrypt.hash(userData.Respuesta, salt);
    userData.Respuesta = hashedRespuesta;
    // fin del hash

    // Validar que los campos requeridos estén presentes
    if (
      !userData.Nombre ||
      !userData.Cedula ||
      !userData.IdPregunta ||
      !userData.Respuesta
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const newUser = await createUser(userData);
    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      rowsAffected: newUser, // esto debería ser [1] si todo salió bien
    });
  } catch (error) {
    console.log("|------Controllador de Registro------|");
    console.error("Error registrando usuario:", error);
    res.status(500).json({ error: error.message });
  }
};

export const validateUserByCedula = async (req, res) => {
  try {
    const cedulaLogin = req.body.cedula;

    // Validar que venga la cédula
    if (!cedulaLogin) {
      return res.status(400).json({
        success: false,
        error: "La cédula es requerida",
      });
    }

    const response = await findUserByCedula(cedulaLogin);

    if (response.Existe === 0) {
      return res.status(404).json({
        success: false,
        Mensaje: response.Mensaje,
      });
    } else {
      return res.json({
        success: true,
        message: response.Mensaje,
      });
    }
  } catch (error) {
    console.error("Error buscando usuario:", error);

    return res.status(500).json({
      success: false,
      error: "Error validando cédula",
    });
  }
};

export const validateSecurityAnswer = async (req, res) => {
  try {
    const cedulaLogin = req.body.cedula;
    const respuestaLogin = req.body.respuesta;
    
    await hashRespuesta(cedulaLogin, respuestaLogin);

    const token = jwt.sign(
      { cedula: cedulaLogin, respuesta: respuestaLogin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      message: "Usuario y respuesta validados correctamente",
      token,
    });
  } catch (error) {
    console.error("Error validando respuesta:", error);

    return res.status(500).json({
      success: false,
      error: "Respuesta es incorrecta",
    });
  }
};

export const verifyTokenStatus = (req, res) => {
  return res.json({
    success: true,
    message: "Token válido",
    user: req.user,
  });
};
