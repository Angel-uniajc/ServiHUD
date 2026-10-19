const pool = require("../config/db");

const Categoria = {
  async obtenerTodos() {
    const { rows } = await pool.query("SELECT * FROM categorias ORDER BY id_categoria");
    return rows;
  },
  async obtenerPorId(id) {
    const { rows } = await pool.query("SELECT * FROM categorias WHERE id_categoria = $1", [id]);
    return rows[0];
  },
  async crear({ nombre, descripcion }) {
    const { rows } = await pool.query(
      "INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [nombre, descripcion ?? null]
    );
    return rows[0];
  },
  async actualizar(id, { nombre, descripcion }) {
    const { rows } = await pool.query(
      "UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id_categoria = $3 RETURNING *",
      [nombre, descripcion ?? null, id]
    );
    return rows[0];
  },
  async eliminar(id) {
    const { rows } = await pool.query("DELETE FROM categorias WHERE id_categoria = $1 RETURNING *", [id]);
    return rows[0];
  },
};

module.exports = Categoria;
