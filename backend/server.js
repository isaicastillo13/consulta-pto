// backend/server.js - CON DOTENV CORRECTO
import express from 'express'
import cors from 'cors'
import { config } from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url'
import { Route } from 'react-router-dom'
import userRoutes from './routes/userRoutes.js'


// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config();

// Cargar variables de entorno DESDE LA RAIZ del proyecto
config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 5001


// Middlewares
// Configurar CORS
const corsOptions = {
  origin: 'http://localhost:5173', // frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json())


// (async () => {
//   try {
//     const result = await sql`SELECT NOW()`;
//     console.log("✅ Conexión con Supabase exitosa:", result[0]);
//   } catch (error) {
//     console.error("❌ Error conectando a Supabase:", error.message);
//   }
// })();



// Debug mejorado
app.get('/api/debug', (req, res) => {
  const dbUrl = process.env.DATABASE_URL
  const envPath = path.resolve(__dirname, './.env')
  
  const maskedUrl = dbUrl ? dbUrl.replace(/:[^:@]+@/, ':****@') : 'No definida'
  
  res.json({
    databaseUrl: maskedUrl,
    envFileExists: require('fs').existsSync(envPath),
    envPath: envPath,
    port: PORT,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('SUPABASE'))
  })
})

// Routes
app.use('/api/users', userRoutes)
// // Ruta de registro TEMPORAL (sin DB)
// app.post('/api/register', async (req, res) => {
//   try {
//     const { name, cedula, pregunta, respuesta } = req.body
    
//     console.log('Datos recibidos:', { name, cedula, pregunta, respuesta })
    
//     if (!name || !cedula || !pregunta || !respuesta) {
//       return res.status(400).json({ error: 'Todos los campos son requeridos' })
//     }
    
//     // Simulación exitosa
//     res.status(201).json({ 
//       success: true, 
//       message: 'Usuario registrado (modo prueba - DB no configurada)',
//       data: {
//         id: Date.now(),
//         nombre: name,
//         cedula: cedula,
//         fecha: new Date().toISOString()
//       }
//     })
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

app.listen(PORT, () => {
    console.log('|----------------------------------------|')
    console.log('🛠️ Iniciando servidor...')
    console.log('🔧 Variables de entorno:', process.env.SUPABASE_URL ? '✅ Configuradas' : '❌ No configuradas')
    console.log(`🚀 Servidor en http://localhost:${PORT}`)
    console.log('|----------------------------------------|')
})