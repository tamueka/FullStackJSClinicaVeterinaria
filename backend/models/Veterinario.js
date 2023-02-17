import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarID from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  web: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: generarID(),
  },
  confirmado: {
    type: Boolean,
    default: false,
  },
});

veterinarioSchema.pre("save", async function (next) {
  // si el password ya esta hasheado pasamos a la siguinete funcion del middleware con next()
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// comparar password con bcrypt
veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

const Veterinario = mongoose.model("Veterinario", veterinarioSchema);

export default Veterinario;
