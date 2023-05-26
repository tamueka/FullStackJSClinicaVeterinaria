import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacientesRoutes from "./routes/pacienteRoutes.js";

const app = express();

// helper para el parseo de peticiones HTTP
app.use(express.json());

// Usamos variables de entorno
dotenv.config();

// Realizamos conexion con Base de Datos
conectarDB();

const dominiosPermitidos = ["http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      // el origen del reques esta permitido
      callback(null, true);
    } else {
      callback(new Error("No permitido por cors"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api/veterinarios", veterinarioRoutes);
app.use("/api/pacientes", pacientesRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto: ${PORT}`);
});
