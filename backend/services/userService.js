import { supabase } from "../lib/supabaseClient.js";
import bcrypt from "bcryptjs";
import { poolPromise, sql } from '../config/db.js';



export const createUser = async (userData) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input('Nombre', sql.NVarChar(100), userData.nombre)
      .input('Cedula', sql.NVarChar(50), userData.cedula)
      .input('IdPregunta', sql.Int, userData.idpregunta)
      .input('Respuesta', sql.NVarChar(255), userData.respuesta)
      .execute('sp_InsertarUsuario');

    console.log('Usuario insertado con éxito');
    return result;
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    throw error;
  } finally {
    sql.close();
  }
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


  if (error || !isMatch) {
    console.log("|------Servicio de Usuarios------|");
    console.error("Error hasheando respuesta:", error);
    throw error;
  }
  return isMatch;
};
