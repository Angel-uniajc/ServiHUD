const { Router } = require("express");
const c = require("../controllers/rol.controller");
const validarId = require("../middlewares/validarId");

const router = Router();

router.get("/", c.listar);
router.get("/:id", validarId, c.obtener);
router.post("/", c.crear);
router.put("/:id", validarId, c.actualizar);
router.delete("/:id", validarId, c.eliminar);

module.exports = router;
