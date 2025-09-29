import { supabase } from '../lib/supabaseClient.js';


export const createUser = async (userData) => {
    const { data, error } = await supabase
        .from('usuarios')
        .insert([userData]);
    if (error) {
        console.log('|------Servicio de Usuarios------|')
        console.error("Error creando usuario:", error);
        throw error;
    }
    return data;
}