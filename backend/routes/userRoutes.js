import sql from '../config/db.js'
import bcrypt from 'bcrypt'

class UserService {
  // Guardar usuario con hash de respuesta
  async saveUser(userData) {
    const { name, cedula, pregunta, respuesta } = userData
    
    // Validar que todos los campos estén presentes
    if (!name || !cedula || !pregunta || !respuesta) {
      throw new Error('Todos los campos son requeridos')
    }

    // Hashear la respuesta de seguridad
    const saltRounds = 10
    const respuestaHash = await bcrypt.hash(respuesta, saltRounds)

    // Guardar en la base de datos
    const result = await sql`
      INSERT INTO usuarios (nombre, cedula, id_pregunta, respuesta_hash) 
      VALUES (${name}, ${cedula}, ${parseInt(pregunta)}, ${respuestaHash}) 
      RETURNING id, nombre, cedula, fecha_creacion
    `
    
    return result[0]
  }

  // Obtener usuario por cédula
  async getUserByCedula(cedula) {
    const result = await sql`
      SELECT * FROM usuarios WHERE cedula = ${cedula}
    `
    return result[0]
  }

  // Obtener todas las preguntas de seguridad
  async getSecurityQuestions() {
    const questions = await sql`
      SELECT * FROM preguntas_seguridad ORDER BY id
    `
    return questions
  }
}

export default new UserService()