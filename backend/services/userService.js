import sql from '../config/db.js'

class ConsultasService {
  // Crear nueva consulta
  async crearConsulta(consultaData) {
    const { nombre, cedula, id_pregunta, respuesta_hash } = consultaData
    
    const result = await sql`
      INSERT INTO consultas (nombre, cedula, id_pregunta, respuesta_hash) 
      VALUES (${nombre}, ${cedula}, ${id_pregunta}, ${respuesta_hash}) 
      RETURNING *
    `
    
    return result[0]
  }

  // Obtener todas las consultas
  async obtenerConsultas() {
    const consultas = await sql`
      SELECT * FROM consultas 
      ORDER BY fecha_creacion DESC
    `
    return consultas
  }

  // Obtener consulta por ID
  async obtenerConsultaPorId(id) {
    const result = await sql`
      SELECT * FROM consultas WHERE id = ${id}
    `
    return result[0]
  }
}

export default new ConsultasService()