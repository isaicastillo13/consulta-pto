// backend/server.js - CON DOTENV CORRECTO
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Route } from "react-router-dom";
import securityRoutes from "./routes/securityRoute.js";
import userRoutes from "./routes/userRoute.js";

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

// Cargar variables de entorno DESDE LA RAIZ del proyecto
config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5001;

// Configurar CORS
const corsOptions = {
  origin: "http://localhost:5173", // frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Debug mejorado
app.get("/api/debug", (req, res) => {
  const dbUrl = process.env.DATABASE_URL;
  const envPath = path.resolve(__dirname, "./.env");

  const maskedUrl = dbUrl ? dbUrl.replace(/:[^:@]+@/, ":****@") : "No definida";

  res.json({
    databaseUrl: maskedUrl,
    envFileExists: require("fs").existsSync(envPath),
    envPath: envPath,
    port: PORT,
    allEnvKeys: Object.keys(process.env).filter(
      (key) => key.includes("DATABASE") || key.includes("SUPABASE")
    ),
  });
});

// Ruta para obtener preguntas de seguridad
app.use("/api", securityRoutes);

// Ruta de registro
app.use("/api/users", userRoutes);
app.use("/api/auth", userRoutes);


app.listen(PORT, () => {
  console.log("|----------------------------------------|");
  console.log("🛠️ Iniciando servidor...");
  console.log(
    "🔧 Variables de entorno:",
    process.env.SUPABASE_URL ? "✅ Configuradas" : "❌ No configuradas"
  );
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  console.log("|----------------------------------------|");
});
