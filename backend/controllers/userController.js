import { createUser } from "../services/userService.js";
import bcrypt, { hash } from "bcryptjs";
import { findUserByCedula } from "../services/userService.js";

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
  ;
  try{
    const cedulaLogin = req.body.cedula;
    const idUser = await findUserByCedula(cedulaLogin);
    res.json(idUser);
   

  }catch(error){
    console.log("|------Controlador de Usuarios------|");
    console.error("Error validando cédula:", error);
    res.status(500).json({ error: "Error validando cédula" });
  }
}
