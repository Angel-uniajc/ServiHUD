const { Router } = require("express");

const router = Router();

router.use("/roles", require("./rol.routes"));
router.use("/usuarios", require("./usuario.routes"));
router.use("/categorias", require("./categoria.routes"));
router.use("/servicios", require("./servicio.routes"));

module.exports = router;
