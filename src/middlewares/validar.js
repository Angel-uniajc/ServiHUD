// Helpers de validación reutilizados por los controladores
const esTextoValido = (v, max) => typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;
const esEnteroPositivo = (v) => Number.isInteger(v) && v > 0;
const esNumeroNoNegativo = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;

const bad = (res, mensaje) => res.status(400).json({ ok: false, mensaje });

module.exports = { esTextoValido, esEnteroPositivo, esNumeroNoNegativo, bad };
