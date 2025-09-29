// Controladores (controllers) → deben expresar qué acción están respondiendo para el cliente.
import { findSecurityQuestions } from "../services/userService.js";


export const getSecurityQuestions = async (req, res) => {
    try{
        const questions = await findSecurityQuestions();
        res.json(questions);
        
    }catch(error){
        console.error("Error obteniendo preguntas de seguridad:", error);
        res.status(500).json({ error: "Error obteniendo preguntas de seguridad" });
    }
}