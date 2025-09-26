import supabase from "../../backend/lib/supabaseClient";
import bcrypt from "bcryptjs";
export async function saveUser({nombre, cedula, pregunta, respuesta}) {
    const saltRounds = 10;
    const hashedRespuesta = await bcrypt.hash(respuesta, saltRounds);

    const {data, error} = await supabase
    .from("usuarios")
    .insert([{nombre, cedula, pregunta, respuesta: hashedRespuesta}]);

    if (error) {
        console.error("Error saving user:", error);
        throw error;
    }
    return data;
}