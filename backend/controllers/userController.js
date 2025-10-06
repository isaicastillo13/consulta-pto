import { createUser } from "../services/userService.js";
import bcrypt, { hash } from "bcryptjs";
import { findUserByCedula, hashRespuesta } from "../services/userService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, cedula, pregunta, respuesta } = req.body;
    const userData = {
      nombre: name,
      cedula,
      id_pregunta: pregunta,
      respuesta,
    };

    // Hashear la respuesta antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedRespuesta = await bcrypt.hash(userData.respuesta, salt);
    userData.respuesta = hashedRespuesta;
    // fin del hash

    // Validar que los campos requeridos estén presentes
    if (
      !userData.nombre ||
      !userData.cedula ||
      !userData.id_pregunta ||
      !userData.respuesta
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const newUser = await createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.log("|------Controllador de Registro de u------|");
    console.error("Error registrando usuario:", error);
    res.status(500).json({ error: "Error registrando usuario" });
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

    const idUser = await findUserByCedula(cedulaLogin);
    return res.json({
      success: true,
      user: idUser,
      message: "Usuario encontrado, requiere validar respuesta",
    });
  } catch (error) {
    console.log("|------Controlador de Usuarios------|");
    console.error("Error validando cédula:", error);

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
    user: req.user
  });
};
