// Traduce errores de PostgreSQL a códigos HTTP coherentes
function manejarErrorDB(err, res) {
  switch (err.code) {
    case "23505": // unique_violation
      return res.status(409).json({ ok: false, mensaje: "Ya existe un registro con esos datos únicos", detalle: err.detail });
    case "23503": // foreign_key_violation
      return res.status(400).json({ ok: false, mensaje: "Violación de llave foránea: el registro referenciado no existe o aún tiene registros dependientes", detalle: err.detail });
    case "23514": // check_violation
      return res.status(400).json({ ok: false, mensaje: "Un valor no cumple las restricciones de la tabla", detalle: err.constraint });
    case "23502": // not_null_violation
      return res.status(400).json({ ok: false, mensaje: `El campo \x27${err.column}\x27 es obligatorio` });
    case "22P02": // invalid_text_representation
    case "22003": // numeric_value_out_of_range
    case "22001": // string_data_right_truncation
      return res.status(400).json({ ok: false, mensaje: "Formato o longitud de dato inválido" });
    default:
      console.error(err);
      return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
  }
}

function notFound(req, res) {
  res.status(404).json({ ok: false, mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ ok: false, mensaje: "El cuerpo de la solicitud no es un JSON válido" });
  }
  return manejarErrorDB(err, res);
}

module.exports = { notFound, errorHandler, manejarErrorDB };
