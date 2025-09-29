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
};

export const findUserByCedula = async (cedula) => {
    const {data, error} = await supabase
        .from('usuarios')
        .select('*')
        .eq('cedula', cedula)
        .single()
        .limit(1)


    if (error) {
        console.log('|------Servicio de Usuarios------|')
        console.error("Error buscando usuario por cédula:", error);
        throw error;
    }
    return data;
}