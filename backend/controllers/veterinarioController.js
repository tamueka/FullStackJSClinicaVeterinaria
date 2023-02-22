import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarId.js";

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
  const { veterinario } = req;
  res.json({ perfil: veterinario });
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

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const existeVeterinario = await Veterinario.findOne({ email });

  if (!existeVeterinario) {
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existeVeterinario.token = generarID();
    await existeVeterinario.save();
    res.json({ msg: "Hemos enviado un mail con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};
const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Veterinario.findOne({ token });

  if (tokenValido) {
    res.json({ msg: "Token válido y el usuario existe" });
  } else {
    const error = new Error("Token no válido");
    return res.status(400).json({ msg: error.message });
  }
};
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinario = await Veterinario.findOne({ token });

  if (!veterinario) {
    const error = new Error("Token no válido");
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinario.token = null;
    veterinario.password = password;
    await veterinario.save();
    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
};
