const express = require("express");
const app = express();

const LotesController = require("../controllers/lotesController/index");

app.get("/api/lotes", (req, res) => {
	LotesController.lotes(req, res);
});

app.get("/api/lotes/:id", (req, res) => {
	LotesController.obtenerLote(req, res);
});
app.get("/api/lotes_vendedor/:usuario", (req, res) => {
	LotesController.obtenerLotesVendedor(req, res);
});

app.post("/api/lote", (req, res) => {
	LotesController.registro(req, res);
});

app.put("/api/lote/:id", (req, res) => {
	LotesController.actualizacion(req, res);
});

app.delete("/api/lote/:id", (req, res) => {
	LotesController.eliminar(req, res);
});

module.exports = app;
