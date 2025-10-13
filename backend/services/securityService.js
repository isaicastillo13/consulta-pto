// import { supabase } from '../lib/supabaseClient.js';

// export const findAllSecurityQuestions = async () => {
//   const { data, error } = await supabase
//     .from('preguntas')
//     .select('*');

//   if (error) {
//     console.error("Error obteniendo preguntas de seguridad:", error);
//     throw error;
//   }
//   return data;
// }

// backend/services/userService.js
import { poolPromise, sql } from '../config/db.js';

export const getSecurityQuestionsFromDB = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('EXEC sp_ObtenerPreguntasSeguridad');
    console.log('Preguntas de seguridad obtenidas:', result.recordset);
    return result.recordset; // recordset trae los resultados en forma de array de objetos
  } catch (err) {
    console.error('Error ejecutando consulta:', err);
    throw err;
  }
};
