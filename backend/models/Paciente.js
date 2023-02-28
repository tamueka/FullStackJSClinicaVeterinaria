import mongoose from "mongoose";

const pacientesSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    propietario: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    veterinario: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Veterinario",
    },
  },
  {
    timestamp: true,
  }
);

const Paciente = mongoose.model("Paciente", pacientesSchema);

export default Paciente;
