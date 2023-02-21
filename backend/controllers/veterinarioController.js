import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";

const registrar = async (req, res) => {
  const { email } = req.body;
  // Prevenir veterinario duplicados
  const existeUsuario = await Veterinario.findOne({ email });
  if (existeUsuario) {
    const error = new Error("Veterinario ya registrado");
    return res.status(400).json({ msg: error.message });
  }
  try {
    // Guardar nuevo veterinario
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();
    res.json({ veterinarioGuardado });
  } catch (error) {
    console.error(error.message);
  }
};

const perfil = (req, res) => {
  res.json({ msg: "Mostrando perfil" });
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Veterinario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();

    res.json({ msg: "Veterinario confirmado correctamente" });
  } catch (error) {
    console.error(error.message);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Veterinario.findOne({ email });

  // Comprobar si el usuario existe
  if (!usuario) {
    const error = new Error("Email no válido");
    return res.status(401).json({ msg: error.message });
  }

  // Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Usuario no confirmado");
    return res.status(401).json({ msg: error.message });
  }

  // Comprobar si el password es igual
  if (await usuario.comprobarPassword(password)) {
    res.json({ token: generarJWT(usuario.id) });
  } else {
    const error = new Error("Password no válido");
    return res.status(401).json({ msg: error.message });
  }
};

export { registrar, perfil, confirmar, autenticar };
