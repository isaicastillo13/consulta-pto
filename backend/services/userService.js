import { supabase } from "../lib/supabaseClient.js";
import bcrypt from "bcryptjs";

export const createUser = async (userData) => {
  const { data, error } = await supabase.from("usuarios").insert([userData]);
  if (error) {
    console.log("|------Servicio de Usuarios------|");
    console.error("Error creando usuario:", error);
    throw error;
  }
  return data;
};

export const findUserByCedula = async (cedula) => {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("cedula", cedula)
    .single()
    .limit(1);

  if (error) {
    console.log("|------Servicio de Usuarios------|");
    console.error("Error buscando usuario por cédula:", error);
    throw error;
  }
  return data;
};

export const hashRespuesta = async (cedula, respuesta) => {
  const salt = await bcrypt.genSalt(10);
  const respuestaHash = await bcrypt.hash(respuesta, salt);



  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("cedula", cedula)
    .single()
    .limit(1);

    const isMatch = await bcrypt.compare(respuesta, data.respuesta_hash);

  if (error) {
    console.log("|------Servicio de Usuarios------|");
    console.error("Error hasheando respuesta:", error);
    throw error;
  }
  return data;
};
