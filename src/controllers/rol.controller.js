const Rol = require("../models/rol.model");
const { esTextoValido, bad } = require("../middlewares/validar");

function validar(body = {}) {
  if (!esTextoValido(body.nombre, 30)) return "El campo \x27nombre\x27 es obligatorio (máx. 30 caracteres)";
  if (body.descripcion != null && (typeof body.descripcion !== "string" || body.descripcion.length > 200))
    return "El campo \x27descripcion\x27 debe ser texto de máx. 200 caracteres";
  return null;
}

exports.listar = async (req, res, next) => {
  try {
    const data = await Rol.obtenerTodos();
    res.status(200).json({ ok: true, total: data.length, data });
  } catch (e) { next(e); }
};

exports.obtener = async (req, res, next) => {
  try {
    const data = await Rol.obtenerPorId(req.params.id);
    if (!data) return res.status(404).json({ ok: false, mensaje: "Rol no encontrado" });
    res.status(200).json({ ok: true, data });
  } catch (e) { next(e); }
};

exports.crear = async (req, res, next) => {
  try {
    const error = validar(req.body);
    if (error) return bad(res, error);
    const data = await Rol.crear({ ...req.body, nombre: req.body.nombre.trim() });
    res.status(201).json({ ok: true, mensaje: "Rol creado correctamente", data });
  } catch (e) { next(e); }
};

exports.actualizar = async (req, res, next) => {
  try {
    const error = validar(req.body);
    if (error) return bad(res, error);
    const data = await Rol.actualizar(req.params.id, { ...req.body, nombre: req.body.nombre.trim() });
    if (!data) return res.status(404).json({ ok: false, mensaje: "Rol no encontrado" });
    res.status(200).json({ ok: true, mensaje: "Rol actualizado correctamente", data });
  } catch (e) { next(e); }
};

exports.eliminar = async (req, res, next) => {
  try {
    const data = await Rol.eliminar(req.params.id);
    if (!data) return res.status(404).json({ ok: false, mensaje: "Rol no encontrado" });
    res.status(200).json({ ok: true, mensaje: "Rol eliminado correctamente", data });
  } catch (e) { next(e); }
};
