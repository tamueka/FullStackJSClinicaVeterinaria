import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";

const app = express();

// Usamos variables de entorno
dotenv.config();

// Realizamos conexion con Base de Datos
conectarDB();

app.use("/", (req, res) => {
  res.send("Hola Mundo");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto: ${PORT}`);
});
