// Servicios (services) → deben expresar qué hacen a nivel de lógica/BD.
import sql from '../config/db.js'

export const findSecurityQuestions = async (req, res) => {
  try{
    const {data, error} = await sql`SELECT * FROM preguntas`
    return data;
  }catch(error){
    console.error("Error obteniendo preguntas de seguridad:", error);
  }
};

