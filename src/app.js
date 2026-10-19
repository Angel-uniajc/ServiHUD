const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ ok: true, mensaje: "API ServiHub funcionando", version: "1.0.0" });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
