// Controladores (controllers) → deben expresar qué acción están respondiendo para el cliente.
import { findSecurityQuestions } from "../services/securityService.js";


export const getSecurityQuestions = async (req, res) => {
    try{
        const questions = await findSecurityQuestions();
        res.json(questions);
        console.log("Preguntas de seguridad enviadas:", questions);
        
    }catch(error){
        console.error("Error obteniendo preguntas de seguridad:", error);
        res.status(500).json({ error: "Error obteniendo preguntas de seguridad" });
    }
}