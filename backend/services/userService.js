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
  let pool;
  try{
    pool = await poolPromise;
    const result = await pool
      .request()
      .input('Cedula', sql.NVarChar(50), cedula)
      .execute('sp_ValidarUsuarioPorCedula');

      
      if(result.recordset[0].Existe === 0) {
        return result.recordset[0];
      }else{
        return result.recordset[0];
      }
  }catch(error){
    console.error('Error al buscar usuario por cédula:', error);
    throw error;
  }finally {
    if(pool){
      pool.close();
    }
  }
};


export const hashRespuesta = async (cedula, respuesta) => {
  let pool;
  try {
    pool = await poolPromise;

    // Ejecutar el procedimiento almacenado
    const result = await pool
      .request()
      .input("Cedula", sql.NVarChar(50), cedula)
      .execute("sp_ObtenerRespuestaHashPorCedula");

    const hashGuardado = result.recordset[0]?.Respuesta;

    if (!hashGuardado) {
      throw new Error("Usuario no encontrado o sin respuesta registrada.");
    }

    // Comparar la respuesta con el hash almacenado
    const isMatch = await bcrypt.compare(respuesta, hashGuardado);

    if (!isMatch) {
      throw new Error("Respuesta incorrecta.");
    }

    return isMatch;
  } catch (error) {
    console.error("|------Servicio de Validación de Respuesta------|");
    console.error("Error validando respuesta:", error);
    throw error;
  } finally {
    if (pool) pool.close();
  }
};
