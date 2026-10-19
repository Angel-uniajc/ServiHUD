const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario.model");
const { esTextoValido, esEnteroPositivo, bad } = require("../middlewares/validar");

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// passwordObligatoria = true en POST; en PUT es opcional (si no llega, se conserva)
function validar(body = {}, passwordObligatoria) {
  if (!esEnteroPositivo(body.id_rol)) return "El campo \x27id_rol\x27 es obligatorio y debe ser un entero positivo";
  if (!esTextoValido(body.nombre, 100)) return "El campo \x27nombre\x27 es obligatorio (máx. 100 caracteres)";
  if (!esTextoValido(body.email, 150) || !EMAIL_REGEX.test(body.email.trim()))
    return "El campo \x27email\x27 es obligatorio y debe tener un formato válido";
  if (passwordObligatoria || body.password != null) {
    if (typeof body.password !== "string" || body.password.length < 8)
      return "El campo \x27password\x27 es obligatorio y debe tener mínimo 8 caracteres";
  }
  if (body.telefono != null && (typeof body.telefono !== "string" || body.telefono.length > 20))
    return "El campo \x27telefono\x27 debe ser texto de máx. 20 caracteres";
  if (body.activo != null && typeof body.activo !== "boolean")
    return "El campo \x27activo\x27 debe ser true o false";
  return null;
}

const limpiar = (b) => ({ ...b, nombre: b.nombre.trim(), email: b.email.trim().toLowerCase() });

exports.listar = async (req, res, next) => {
  try {
    const data = await Usuario.obtenerTodos();
    res.status(200).json({ ok: true, total: data.length, data });
  } catch (e) { next(e); }
};

exports.obtener = async (req, res, next) => {
  try {
    const data = await Usuario.obtenerPorId(req.params.id);
    if (!data) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    res.status(200).json({ ok: true, data });
  } catch (e) { next(e); }
};

exports.crear = async (req, res, next) => {
  try {
    const error = validar(req.body, true);
    if (error) return bad(res, error);
    const hash = await bcrypt.hash(req.body.password, 10);
    const data = await Usuario.crear(limpiar(req.body), hash);
    res.status(201).json({ ok: true, mensaje: "Usuario creado correctamente", data });
  } catch (e) { next(e); }
};

exports.actualizar = async (req, res, next) => {
  try {
    const error = validar(req.body, false);
    if (error) return bad(res, error);
    const hash = req.body.password ? await bcrypt.hash(req.body.password, 10) : null;
    const data = await Usuario.actualizar(req.params.id, limpiar(req.body), hash);
    if (!data) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    res.status(200).json({ ok: true, mensaje: "Usuario actualizado correctamente", data });
  } catch (e) { next(e); }
};

exports.eliminar = async (req, res, next) => {
  try {
    const data = await Usuario.eliminar(req.params.id);
    if (!data) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    res.status(200).json({ ok: true, mensaje: "Usuario eliminado correctamente", data });
  } catch (e) { next(e); }
};
