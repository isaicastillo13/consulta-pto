// db.js
import postgres from 'postgres'

// Usa la variable de entorno que te proporciona Supabase
const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

export default sql;
