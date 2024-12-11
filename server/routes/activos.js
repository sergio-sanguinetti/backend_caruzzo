const express = require("express");
const app = express();

const multer = require("multer");
const upload = multer();

const activosController = require("../controllers/activosController/index");

app.get("/api/activos/:id", (req, res) => {
	activosController.activo(req, res);
});

app.post("/api/activo", (req, res) => {
	activosController.registro(req, res);
	
});

app.put("/api/activo/:id", (req, res) => {
	activosController.actualizacion(req, res);
});

app.get("/api/activos", (req, res) => {
	activosController.activos(req, res);
});

app.post("/api/activo/imagen", upload.single("file"), (req, res) => {
	activosController.importarImagen(req, res);
});

app.delete("/api/activo/:id", (req, res) => {
	activosController.eliminar(req, res);
});

module.exports = app;
