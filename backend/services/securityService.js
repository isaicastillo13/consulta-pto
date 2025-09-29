import { supabase } from '../lib/supabaseClient.js';

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