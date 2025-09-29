// Servicios (services) → deben expresar qué hacen a nivel de lógica/BD.
// import sql from '../config/db.js'
import { supabase } from '../lib/supabaseClient.js';

// export const findSecurityQuestions = async (req, res) => {
//   try{
//     const {data, error} = await sql`SELECT * FROM preguntas`
//     if(error) throw error;
//     return data;
//   }catch(error){
//     console.error("Error obteniendo preguntas de seguridad:", error);
//     return [];
//   }
// };

export const findSecurityQuestions = async () => {
  const { data, error } = await supabase
    .from('preguntas')
    .select('*');

  if (error) {
    console.error("Error obteniendo preguntas de seguridad:", error);
    throw error;
  }
  return data;
}

