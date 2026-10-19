require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Conexión a PostgreSQL establecida");
    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
  } catch (err) {
    console.error("No se pudo conectar a PostgreSQL:", err.message);
    process.exit(1);
  }
})();