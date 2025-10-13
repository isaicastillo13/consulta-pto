import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();


// Configuración de la conexión
const dbConfig = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,          // 👈 Usuario
  password: process.env.DB_PASSWORD,          // 👈 Contraseña
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Usar encriptación si es true
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' // Ajustar según sea necesario
  },
  connectionTimeout: 300000,
  pool: {
    min: 20,
    max: 15000,
  }
};

// Crear un pool de conexión
const poolPromise = sql.connect(dbConfig)
  .then(pool => {
    console.log('Conectado a SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Error conectando a SQL Server:', err);
    throw err;
  });

export { sql, poolPromise };
