import { supabase } from "../lib/supabaseClient.js";
import bcrypt from "bcryptjs";
import sql from "mssql";
import { poolPromise} from '../config/db.js';

export const createUser = async (userData) => {
  let pool;
  try {
    // 1. Conectar al pool
    pool = await poolPromise;

    // 2. Ejecutar el SP con parámetros seguros
    
    const result = await pool
      .request()
      .input('Nombre', sql.NVarChar(100), userData.Nombre)
      .input('Cedula', sql.NVarChar(50), userData.Cedula)
      .input('IdPregunta', sql.Int, userData.IdPregunta)
      .input('Respuesta', sql.NVarChar(255), userData.Respuesta)
      .execute('sp_InsertarUsuario');


    return result.rowsAffected; // o result.rowsAffected según tu SP
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    throw error;
  } finally {
    // 3. Cierra la conexión solo si existe
    if (pool) {
      pool.close();
    }
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
