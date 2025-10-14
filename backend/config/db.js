import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();


// Configuración de la conexión
const dbConfig = {
  server: "rtxdbtest",
  user: "usr-rhqdbtest",
  password: "LaMupE03x",
  database: "MERC",
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' // Ajustar según sea necesario
  },
  connectionTimeout: 60000, // 60 segundos
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
