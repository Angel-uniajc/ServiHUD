const pool = require("../config/db");

// JOIN con categorias para devolver también el nombre de la categoría
const SELECT_BASE = `
  SELECT s.id_servicio, s.id_categoria, c.nombre AS categoria,
         s.nombre, s.descripcion, s.precio_base
  FROM servicios s
  JOIN categorias c ON c.id_categoria = s.id_categoria`;

const Servicio = {
  async obtenerTodos() {
    const { rows } = await pool.query(`${SELECT_BASE} ORDER BY s.id_servicio`);
    return rows;
  },
  async obtenerPorId(id) {
    const { rows } = await pool.query(`${SELECT_BASE} WHERE s.id_servicio = $1`, [id]);
    return rows[0];
  },
  async crear({ id_categoria, nombre, descripcion, precio_base }) {
    const { rows } = await pool.query(
      `INSERT INTO servicios (id_categoria, nombre, descripcion, precio_base)
       VALUES ($1, $2, $3, COALESCE($4, 0)) RETURNING id_servicio`,
      [id_categoria, nombre, descripcion ?? null, precio_base ?? null]
    );
    return this.obtenerPorId(rows[0].id_servicio);
  },
  async actualizar(id, { id_categoria, nombre, descripcion, precio_base }) {
    const { rows } = await pool.query(
      `UPDATE servicios
          SET id_categoria = $1, nombre = $2, descripcion = $3, precio_base = COALESCE($4, 0)
        WHERE id_servicio = $5 RETURNING id_servicio`,
      [id_categoria, nombre, descripcion ?? null, precio_base ?? null, id]
    );
    return rows[0] ? this.obtenerPorId(id) : undefined;
  },
  async eliminar(id) {
    const { rows } = await pool.query("DELETE FROM servicios WHERE id_servicio = $1 RETURNING *", [id]);
    return rows[0];
  },
};

module.exports = Servicio;
