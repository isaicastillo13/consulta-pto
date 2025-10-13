import sql from 'mssql';

// Configuración de la conexión
const dbConfig = {
  server: 'rtxdbtest',
  user: 'usr-rhqdbtest',          // 👈 Usuario
  password: 'LaMupE03x',          // 👈 Contraseña
  database: 'MERC',
  options: {
    encrypt: false,
    trustServerCertificate: true
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
