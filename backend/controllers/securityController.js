// import { findAllSecurityQuestions } from "../services/securityService.js";

// export const getSecurityQuestions = async (req, res) => {
//     try{
//         const questions = await findAllSecurityQuestions();
//         res.json(questions);
        
//     }catch(error){
//         console.error("Error obteniendo preguntas de seguridad:", error);
//         res.status(500).json({ error: "Error obteniendo preguntas de seguridad" });
//     }
// }


import { getSecurityQuestionsFromDB } from '../services/securityService.js';

export const getSecurityQuestions = async (req, res) => {
  try {
    const questions = await getSecurityQuestionsFromDB();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo preguntas de seguridad' });
  }
};
