const Servicio = require("../models/servicio.model");
const { esTextoValido, esEnteroPositivo, esNumeroNoNegativo, bad } = require("../middlewares/validar");

function validar(body = {}) {
  if (!esEnteroPositivo(body.id_categoria)) return "El campo \x27id_categoria\x27 es obligatorio y debe ser un entero positivo";
  if (!esTextoValido(body.nombre, 100)) return "El campo \x27nombre\x27 es obligatorio (máx. 100 caracteres)";
  if (body.descripcion != null && (typeof body.descripcion !== "string" || body.descripcion.length > 300))
    return "El campo \x27descripcion\x27 debe ser texto de máx. 300 caracteres";
  if (body.precio_base != null && !esNumeroNoNegativo(body.precio_base))
    return "El campo \x27precio_base\x27 debe ser un número mayor o igual a 0";
  return null;
}

exports.listar = async (req, res, next) => {
  try {
    const data = await Servicio.obtenerTodos();
    res.status(200).json({ ok: true, total: data.length, data });
  } catch (e) { next(e); }
};

exports.obtener = async (req, res, next) => {
  try {
    const data = await Servicio.obtenerPorId(req.params.id);
    if (!data) return res.status(404).json({ ok: false, mensaje: "Servicio no encontrado" });
    res.status(200).json({ ok: true, data });
  } catch (e) { next(e); }
};

exports.crear = async (req, res, next) => {
  try {
    const error = validar(req.body);
    if (error) return bad(res, error);
    const data = await Servicio.crear({ ...req.body, nombre: req.body.nombre.trim() });
    res.status(201).json({ ok: true, mensaje: "Servicio creado correctamente", data });
  } catch (e) { next(e); }
};

exports.actualizar = async (req, res, next) => {
  try {
    const error = validar(req.body);
    if (error) return bad(res, error);
    const data = await Servicio.actualizar(req.params.id, { ...req.body, nombre: req.body.nombre.trim() });
    if (!data) return res.status(404).json({ ok: false, mensaje: "Servicio no encontrado" });
    res.status(200).json({ ok: true, mensaje: "Servicio actualizado correctamente", data });
  } catch (e) { next(e); }
};

exports.eliminar = async (req, res, next) => {
  try {
    const data = await Servicio.eliminar(req.params.id);
    if (!data) return res.status(404).json({ ok: false, mensaje: "Servicio no encontrado" });
    res.status(200).json({ ok: true, mensaje: "Servicio eliminado correctamente", data });
  } catch (e) { next(e); }
};
