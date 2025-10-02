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
      respuesta_hash: respuesta,
    };

    // Hashear la respuesta antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedRespuesta = await bcrypt.hash(userData.respuesta_hash, salt);
    userData.respuesta_hash = hashedRespuesta;
    // fin del hash

    // Validar que los campos requeridos estén presentes
    if (!userData.nombre || !userData.cedula || !userData.id_pregunta || !userData.respuesta_hash) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const newUser = await createUser(userData);
    res.status(201).json(newUser);

  } catch (error) {
    console.log("|------Controlador de Usuarios------|");
    console.error("Error registrando usuario:", error);
    res.status(500).json({ error: "Error registrando usuario" });
  }
};

export const getIdUser = async (req, res) => {
  try {
    const cedulaLogin = req.body.cedula;
    
    // Validar que venga la cédula
    if (!cedulaLogin) {
      return res.status(400).json({ 
        success: false,
        error: 'La cédula es requerida' 
      });
    }

    // 1. Primero buscar el usuario por cédula
    const idUser = await findUserByCedula(cedulaLogin);

    // 2. Si NO viene respuesta, retornar solo los datos del usuario
    if (!req.body.respuesta) {
      return res.json({
        success: true,
        user: idUser,
        message: 'Usuario encontrado, requiere validar respuesta'
      });
    }

    // 3. Si VIENE respuesta, validarla
    const respuestaLogin = req.body.respuesta;
    const respuestaHash = await hashRespuesta(cedulaLogin, respuestaLogin);

    const token = jwt.sign(
      { id: idUser.id, cedula: idUser.cedula },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Token generado:", token);

    return res.json({
      success: true,
      user: idUser,
      respuestaValidada: respuestaHash,
      message: 'Usuario y respuesta validados correctamente',
      token
    });

  } catch (error) {
    console.log("|------Controlador de Usuarios------|");
    console.error("Error validando cédula:", error);
    
    return res.status(500).json({ 
      success: false,
      error: "Error validando cédula"
    });
  }
}

export const getToken = async (req, res) => {
  try{

  }catch(error){
    console.log("|------Controlador de Usuarios------|");
    console.error("Error generando token:", error);
  }
}
