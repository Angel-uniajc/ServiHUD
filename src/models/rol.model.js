const pool = require("../config/db");

const Rol = {
  async obtenerTodos() {
    const { rows } = await pool.query("SELECT * FROM roles ORDER BY id_rol");
    return rows;
  },
  async obtenerPorId(id) {
    const { rows } = await pool.query("SELECT * FROM roles WHERE id_rol = $1", [id]);
    return rows[0];
  },
  async crear({ nombre, descripcion }) {
    const { rows } = await pool.query(
      "INSERT INTO roles (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [nombre, descripcion ?? null]
    );
    return rows[0];
  },
  async actualizar(id, { nombre, descripcion }) {
    const { rows } = await pool.query(
      "UPDATE roles SET nombre = $1, descripcion = $2 WHERE id_rol = $3 RETURNING *",
      [nombre, descripcion ?? null, id]
    );
    return rows[0];
  },
  async eliminar(id) {
    const { rows } = await pool.query("DELETE FROM roles WHERE id_rol = $1 RETURNING *", [id]);
    return rows[0];
  },
};

module.exports = Rol;
