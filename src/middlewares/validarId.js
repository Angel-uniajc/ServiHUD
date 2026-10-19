// Valida que el parámetro :id de la URL sea un entero positivo
module.exports = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ ok: false, mensaje: "El id debe ser un número entero positivo" });
  }
  req.params.id = id;
  next();
};
