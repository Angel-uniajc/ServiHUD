const pool = require("../config/db");

const COLUMNAS = "u.id_usuario, u.id_rol, r.nombre AS rol, u.nombre, u.email, u.telefono, u.activo";
const FROM = "FROM usuarios u JOIN roles r ON r.id_rol = u.id_rol";

const Usuario = {
  async obtenerTodos() {
    const { rows } = await pool.query(`SELECT ${COLUMNAS} ${FROM} ORDER BY u.id_usuario`);
    return rows;
  },
  async obtenerPorId(id) {
    const { rows } = await pool.query(`SELECT ${COLUMNAS} ${FROM} WHERE u.id_usuario = $1`, [id]);
    return rows[0];
  },
  // passwordHash ya viene cifrada desde el controlador
  async crear({ id_rol, nombre, email, telefono, activo }, passwordHash) {
    const { rows } = await pool.query(
      `INSERT INTO usuarios (id_rol, nombre, email, password, telefono, activo)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, TRUE)) RETURNING id_usuario`,
      [id_rol, nombre, email, passwordHash, telefono ?? null, activo ?? null]
    );
    return this.obtenerPorId(rows[0].id_usuario);
  },
  // Si passwordHash es null, se conserva la contraseña actual
  async actualizar(id, { id_rol, nombre, email, telefono, activo }, passwordHash) {
    const { rows } = await pool.query(
      `UPDATE usuarios
          SET id_rol = $1, nombre = $2, email = $3, telefono = $4,
              activo = COALESCE($5, activo), password = COALESCE($6, password)
        WHERE id_usuario = $7 RETURNING id_usuario`,
      [id_rol, nombre, email, telefono ?? null, activo ?? null, passwordHash ?? null, id]
    );
    return rows[0] ? this.obtenerPorId(id) : undefined;
  },
  async eliminar(id) {
    const { rows } = await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = $1 RETURNING id_usuario, id_rol, nombre, email, telefono, activo",
      [id]
    );
    return rows[0];
  },
};

module.exports = Usuario;
